import { NextResponse } from "next/server";
import { prisma, withRetry } from "@/lib/prisma";
import { checkFeatureAccess, accessDenialResponse, FREE_LIMITS } from "@/lib/trial";
import { callWithJsonRetry, JsonParseError } from "@/lib/json-repair";
import { rateLimitUserAndIp } from "@/lib/rate-limit";
import { requireUser, parseJsonBody } from "@/lib/api-helpers";
import { routeLlmCall } from "@/lib/llm-router";
import { effectivePlan } from "@/lib/utils";
import { COLLEGES, type College } from "@/data/colleges";
import { getCdsWeights, computeWeightedScore, DIMENSION_LABEL, type CdsDimension, type DimensionScores } from "@/lib/cds-weights";
import { predictBand, type ApplicantProfile, BAND_PROBABILITY } from "@/lib/admit-rates";
import { scoreVoice } from "@/lib/voice-rubric";
import { scoreRigor } from "@/lib/rigor-scoring";
import { sanitizeInputObject, validateAIOutput, buildResponseMeta, buildNextSteps } from "@/lib/api-quality";
import { getVerifiedPrograms, groundProgramReference } from "@/lib/verified-programs";
import { recordSuccess, recordFailure, recordResponseTime } from "@/lib/monitoring";
import { FreePlanLimitReachedError, freeUsageLimitBody } from "@/lib/free-usage";
import { normalizeAnalysisQuality } from "@/lib/analysis-quality";
import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  value === "" || value === null ? undefined : value;
const optionalString = (maxLength: number) =>
  z.preprocess(
    (value) => {
      const cleaned = emptyToUndefined(value);
      return typeof cleaned === "number" ? String(cleaned) : cleaned;
    },
    z.string().trim().max(maxLength).optional(),
  );
const optionalActivityNumber = (max: number) =>
  z.preprocess((value) => {
    const cleaned = emptyToUndefined(value);
    if (typeof cleaned === "number") return Number.isFinite(cleaned) ? cleaned : undefined;
    if (typeof cleaned !== "string") return undefined;
    const match = cleaned.match(/\d+(?:\.\d+)?/);
    return match ? Number(match[0]) : undefined;
  }, z.number().min(0).max(max).optional());
const stringList = (maxItemLength: number, maxItems = 60) =>
  z.preprocess((value) => {
    if (typeof value === "string") {
      return value.split(/[,\n]/).map((item) => item.trim()).filter(Boolean);
    }
    if (Array.isArray(value)) {
      return value.map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") {
          const record = item as Record<string, unknown>;
          return String(record.name ?? record.title ?? record.course ?? "").trim();
        }
        return "";
      }).filter(Boolean);
    }
    return value;
  }, z.array(z.string().max(maxItemLength)).max(maxItems).optional().default([]));

const analyzeSchema = z.object({
  gpa: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(5).optional().default(3.0)),
  weightedGpa: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(5.5).optional()),
  satScore: z.preprocess(emptyToUndefined, z.coerce.number().min(400).max(1600).optional()),
  actScore: z.preprocess(emptyToUndefined, z.coerce.number().min(1).max(36).optional()),
  grade: z.preprocess(emptyToUndefined, z.coerce.number().min(7).max(12).optional().default(11)),
  activities: z.preprocess((value) => {
    if (typeof value === "string") {
      return value.split(/\n/).map((name) => ({ name: name.trim() })).filter((item) => item.name);
    }
    if (Array.isArray(value)) {
      return value.map((item) => {
        if (typeof item === "string") return { name: item };
        if (item && typeof item === "object") {
          const record = item as Record<string, unknown>;
          return { ...record, name: String(record.name ?? record.title ?? record.activity ?? "") };
        }
        return { name: "" };
      }).filter((item) => String(item.name).trim());
    }
    return value;
  }, z.array(z.object({
    name: z.string().max(200),
    role: optionalString(120),
    impact: optionalString(500),
    hoursPerWeek: optionalActivityNumber(168),
    yearsInvolved: optionalActivityNumber(12),
  })).max(30).optional().default([])),
  awards: stringList(200, 30),
  courses: stringList(120, 60),
  intendedMajor: optionalString(120),
  targetColleges: stringList(160, 40),
  admissionsConcern: optionalString(2000),
  // The prompt only uses the first 800 chars of essaySnippet — bound the
  // whole field at 8000 (a generous Common App-length essay) so an attacker
  // can't waste memory parsing a multi-MB payload that we'll slice anyway.
  essaySnippet: optionalString(8000),
  recommendationNote: optionalString(2000),
});

type AnalyzeInput = z.infer<typeof analyzeSchema>;

/**
 * Best-effort lookup against the seed dataset. We match by slug, exact name,
 * shortName, or substring so users typing "Harvard" or "MIT" both resolve.
 */
function matchCollege(label: string): College | undefined {
  const q = label.trim().toLowerCase();
  if (!q) return undefined;
  return COLLEGES.find(
    (c) =>
      c.slug === q ||
      c.name.toLowerCase() === q ||
      c.shortName.toLowerCase() === q ||
      c.name.toLowerCase().includes(q) ||
      c.shortName.toLowerCase().includes(q)
  );
}

function buildTargetSchoolBrief(targets: readonly string[]): string {
  if (!targets.length) return "Not specified";
  const lines = targets.map((label) => {
    const m = matchCollege(label);
    if (!m) return `- ${label} (no calibration data on file)`;
    const w = getCdsWeights(m.slug);
    const topFactors = (Object.entries(w) as [CdsDimension, number][])
      .filter(([, v]) => v === 3)
      .map(([k]) => DIMENSION_LABEL[k])
      .slice(0, 5)
      .join(", ");
    const lowFactors = (Object.entries(w) as [CdsDimension, number][])
      .filter(([, v]) => v <= 1)
      .map(([k]) => DIMENSION_LABEL[k])
      .slice(0, 3)
      .join(", ");
    const spikeNote = w.spike === 3
      ? "Spike: AOs actively seek a distinguishing theme -- generic well-roundedness is penalized."
      : w.spike === 2
      ? "Spike: valued but not decisive -- strong all-around profiles can succeed."
      : "Spike: not a primary factor -- numbers-driven admissions.";
    const earlyOpt = m.earlyOption ? ` | Early: ${m.earlyOption}` : "";
    const testPol = m.testPolicy ? ` | ${m.testPolicy}` : "";
    const verifiedPrograms = getVerifiedPrograms(m.slug);
    const programLine = verifiedPrograms.length > 0
      ? `VERIFIED PROGRAMS you may cite by name: ${verifiedPrograms.join(", ")}. Any other program name must be phrased as "explore ${m.shortName}'s offerings in [area] — verify on ${m.domain}".`
      : `NO verified program list on file — do NOT name specific programs, labs, or centers at ${m.shortName}. Instead direct the student to ${m.domain} for the relevant department area.`;
    return `- ${m.shortName}: ${m.acceptanceRate}% admit rate | SAT ${m.sat25}-${m.sat75} | avg GPA ${m.gpaAvg}${m.ivy ? " | Ivy" : ""}${earlyOpt}${testPol}
  CDS C7 "Very Important": ${topFactors || "N/A"}
  CDS C7 low-weight: ${lowFactors || "none"}
  ${spikeNote}
  ${programLine}`;
  });
  return lines.join("\n");
}

/**
 * Pre-compute all heuristic signals BEFORE the LLM call so we can:
 *   1. Inject calibration data into the prompt (the LLM sees real numbers)
 *   2. Post-process LLM scores against heuristic baselines (clamp drift)
 *   3. Attach heuristic details to the response (UI can show breakdowns)
 */
function precomputeSignals(input: AnalyzeInput) {
  // --- Rigor heuristic ---
  const coursesText = (input.courses ?? []).join(", ");
  const gradeStr = String(input.grade ?? 11);
  const rigor = scoreRigor({ courses: coursesText, grade: gradeStr }, {});

  // --- Voice rubric (if essay provided) ---
  const voice = input.essaySnippet && input.essaySnippet.trim().length > 50
    ? scoreVoice(input.essaySnippet)
    : null;

  // --- Per-school admit bands ---
  const targetColleges = (input.targetColleges ?? []).map((label) => ({
    label,
    college: matchCollege(label),
  }));

  // Build a rough EC/awards/spike score (0-10) for the band predictor
  const activityCount = (input.activities ?? []).length;
  const hasLeadershipRole = (input.activities ?? []).some((a) =>
    /\b(president|founder|captain|editor|director|chair)\b/i.test(a.role ?? "")
  );
  const awardCount = (input.awards ?? []).length;
  const hasNationalAward = (input.awards ?? []).some((a) =>
    /\b(national|USAMO|ISEF|Intel|Regeneron|Siemens|RSI|USACO|IMO|IPhO|IOI|Coca-Cola|Davidson|Scholastic Gold)\b/i.test(a)
  );
  const ecScore = Math.min(10, Math.round(
    (activityCount >= 5 ? 3 : activityCount >= 3 ? 2 : 1) +
    (hasLeadershipRole ? 2 : 0) +
    (awardCount >= 3 ? 2 : awardCount >= 1 ? 1 : 0) +
    (hasNationalAward ? 3 : 0)
  ));
  const spikeScore = hasNationalAward ? Math.min(10, ecScore + 2) : ecScore;

  const applicantProfile: ApplicantProfile = {
    gpa: input.gpa,
    sat: input.satScore,
    act: input.actScore,
    ecScore,
    awardsScore: Math.min(10, awardCount >= 5 ? 7 : awardCount >= 3 ? 5 : awardCount >= 1 ? 3 : 1),
    spikeScore,
  };

  const schoolBands = targetColleges
    .filter((t) => t.college)
    .map((t) => ({
      school: t.college!,
      band: predictBand(applicantProfile, t.college!),
      weights: getCdsWeights(t.college!.slug),
    }));

  // --- Award tier classification for prompt enrichment ---
  const classifiedAwards = (input.awards ?? []).map((a) => {
    const text = typeof a === "string" ? a : a;
    if (/\b(national|USAMO|ISEF|Intel|Regeneron|Siemens|RSI|USACO Gold|IMO|IPhO|IOI|Coca-Cola|Davidson|Scholastic Gold|Presidential Scholar|National Merit Finalist)\b/i.test(text)) {
      return `${text} [TIER 1 — National/International]`;
    }
    if (/\b(state|regional|All-State|Governor|MATHCOUNTS State|AMC qualifier|National Merit Semi|AP Scholar with Distinction)\b/i.test(text)) {
      return `${text} [TIER 2 — State/Regional]`;
    }
    if (/\b(school|Honor Roll|NHS|cum laude|department|Dean|Principal)\b/i.test(text)) {
      return `${text} [TIER 3 — School-level]`;
    }
    return `${text} [unclassified]`;
  });

  // --- Activity depth metrics ---
  const activityDetails = (input.activities ?? []).map((a) => {
    const totalHours = (a.hoursPerWeek ?? 0) * 40 * (a.yearsInvolved ?? 1); // ~40 wk/yr
    const depthLabel =
      totalHours >= 2000 ? "DEEP (2000+ hrs)" :
      totalHours >= 800 ? "SUSTAINED (800+ hrs)" :
      totalHours >= 200 ? "MODERATE (200+ hrs)" :
      totalHours > 0 ? "LIGHT (<200 hrs)" : "unknown depth";
    return `${a.name}${a.role ? ` (${a.role})` : ""}${a.hoursPerWeek ? ` ${a.hoursPerWeek}h/wk` : ""}${a.yearsInvolved ? ` × ${a.yearsInvolved}yr` : ""} → ${depthLabel}${a.impact ? ` | impact/context: ${a.impact}` : ""}`;
  });

  return { rigor, voice, schoolBands, applicantProfile, classifiedAwards, activityDetails };
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

/** Return a complete calibrated result when the external model misses its deadline. */
function buildHeuristicAnalysis(
  input: AnalyzeInput,
  signals: ReturnType<typeof precomputeSignals>,
) {
  const activities = input.activities ?? [];
  const awards = input.awards ?? [];
  const courses = input.courses ?? [];
  const leadActivity = activities.find((activity) =>
    /\b(president|founder|captain|editor|director|chair|lead|manager)\b/i.test(
      `${activity.role ?? ""} ${activity.name}`,
    ),
  );
  const totalActivityHours = activities.reduce(
    (sum, activity) => sum + (activity.hoursPerWeek ?? 0) * 40 * (activity.yearsInvolved ?? 1),
    0,
  );
  const nationalAward = awards.find((award) =>
    /\b(national|international|USAMO|ISEF|Regeneron|USACO|IMO|IPhO|IOI|YoungArts)\b/i.test(award),
  );
  const stateAward = awards.find((award) => /\b(state|regional|all-state|semifinal)\b/i.test(award));
  const academicRigor = clampScore(Math.min(
    signals.rigor.score + 15,
    signals.rigor.score * 0.65 + Math.max(0, Math.min(40, ((input.gpa ?? 3) - 2.5) * 32)),
  ));
  const leadership = clampScore(
    activities.length === 0 ? 20 : 32 + activities.length * 4 + (leadActivity ? 24 : 0),
  );
  const awardsScore = clampScore(nationalAward ? 88 : awards.length ? 35 : 20);
  const activityDepth = clampScore(
    activities.length === 0
      ? 20
      : 30 + activities.length * 5 + Math.min(30, Math.round(totalActivityHours / 100)),
  );
  const spike = clampScore(
    activities.length === 0
      ? 20
      : 28 + (signals.applicantProfile.spikeScore ?? 0) * 6 + (nationalAward ? 12 : 0),
  );
  const essayNotApplicable = (input.grade ?? 11) <= 10;
  const essayQuality = essayNotApplicable
    ? clampScore((academicRigor + leadership + awardsScore + activityDepth + spike) / 5)
    : signals.voice
      ? clampScore(signals.voice.composite)
      : 50;
  const recommendations = clampScore(input.recommendationNote?.trim() ? 68 : 50);
  const scores = {
    academicRigor,
    leadership,
    awards: awardsScore,
    activityDepth,
    spike,
    essayQuality,
    recommendations,
  };
  const scoreValues = Object.entries(scores)
    .filter(([name]) => !(essayNotApplicable && name === "essayQuality"))
    .map(([, score]) => score);
  const overallScore = clampScore(scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length);
  const leadName = leadActivity?.name ?? activities[0]?.name;
  const strongestEvidence = nationalAward ?? stateAward ?? leadName ?? courses[0] ?? `${input.gpa} GPA`;
  const currentIdentity = leadName
    ? `${leadName} participant${leadActivity?.role ? ` serving as ${leadActivity.role}` : ""}`
    : "academically engaged student still building a distinctive activity record";

  const admissionOdds = signals.schoolBands.map(({ school, band }) => {
    const [low, high] = BAND_PROBABILITY[band.band];
    return {
      school: school.shortName,
      percent: Math.round((low + high) / 2),
      tier: band.band === "Very Likely" ? "likely" : band.band === "Possible" ? "target" : "reach",
      reason: `${band.rationale} This is a planning band, not a prediction or guarantee.`,
      band: band.band,
      bandRange: [low, high] as [number, number],
    };
  });

  const schoolMicroStrategies = signals.schoolBands.map(({ school, weights }) => {
    const mostImportant = (Object.entries(weights) as [CdsDimension, number][])
      .filter(([, weight]) => weight === 3)
      .map(([dimension]) => DIMENSION_LABEL[dimension])
      .slice(0, 3);
    const programs = getVerifiedPrograms(school.slug);
    return {
      school: school.shortName,
      cdsAlignment: `${school.shortName} places strong weight on ${mostImportant.join(", ") || "the full academic and personal record"}. Your current evidence score is ${overallScore}/100.`,
      needleMover: leadName
        ? `Turn ${leadName} into a measurable result tied to ${input.intendedMajor ?? "your intended direction"}.`
        : `Add one sustained activity with measurable impact related to ${input.intendedMajor ?? "your intended direction"}.`,
      essayAngle: `Show the decision, obstacle, and measurable result behind ${strongestEvidence}; verify each school-specific detail on ${school.domain}.`,
      applicationTiming: school.earlyOption
        ? `Compare ${school.earlyOption} with regular decision after confirming finances and current official deadlines.`
        : "Confirm current application plans and deadlines on the official admissions site.",
      departmentReference: programs.length
        ? `Explore ${programs[0]} and verify current opportunities on ${school.domain}.`
        : `Explore ${school.shortName}'s official offerings in ${input.intendedMajor ?? "your intended field"} at ${school.domain}.`,
    };
  });

  return {
    scores,
    scoreExplanations: {
      academicRigor: `Your ${input.gpa} GPA and ${courses.length} listed courses produced a ${academicRigor}/100 rigor score. Confirm every AP, IB, honors, and dual-enrollment course so this dimension reflects the full record.`,
      leadership: leadActivity
        ? `${leadActivity.name}${leadActivity.role ? ` (${leadActivity.role})` : ""} is the clearest leadership evidence, producing ${leadership}/100. Add the number of people served, funds raised, growth, or outcomes to strengthen it.`
        : `No explicit leadership title was found among ${activities.length} listed activities, so leadership is ${leadership}/100. Add any real ownership, mentoring, or project leadership with measurable outcomes.`,
      awards: awards.length
        ? `${awards.length} award${awards.length === 1 ? "" : "s"} were evaluated by competitive level, producing ${awardsScore}/100. Record the selection pool and level for each.`
        : `No awards were listed, so this evidence-based score is ${awardsScore}/100. Include only earned distinctions and note their selection level.`,
      activityDepth: `${activities.length} activities and the supplied time commitments produced ${activityDepth}/100. Depth rises with sustained years, weekly hours, and concrete outcomes rather than activity count alone.`,
      spike: leadName
        ? `${leadName} is the strongest current focus, producing ${spike}/100. Connect related work into one recognizable theme and add an external result that validates the impact.`
        : `The current profile does not yet show a sustained focus, so spike is ${spike}/100. Build one coherent theme through coursework, projects, service, research, or competition.`,
      essayQuality: essayNotApplicable
        ? `Essay quality is not applicable for grade ${input.grade}; it was excluded from the overall score and shown only as a neutral comparison value.`
        : signals.voice
          ? `The submitted sample was scored on place, detail, vulnerability, and surprise, producing ${essayQuality}/100. Revise the weakest rubric axis with a specific scene and reflection.`
          : `No essay sample was supplied, so ${essayQuality}/100 is a neutral placeholder rather than a judgment of writing ability. Add a draft for a real voice assessment.`,
      recommendations: input.recommendationNote?.trim()
        ? `The recommendation context contains usable evidence, producing ${recommendations}/100. Make sure recommenders can cite specific classroom or community moments.`
        : `No recommendation context was supplied, so ${recommendations}/100 is a neutral placeholder. Identify two adults who can provide distinct, evidence-rich perspectives.`,
    },
    overallScore,
    admissionOdds,
    schoolMicroStrategies,
    psychologicalProfile: {
      profileReading: `Your record currently reads as a ${currentIdentity}.`,
      narrativeGap: leadName
        ? `The missing link is a quantified outcome showing why ${leadName} matters beyond participation.`
        : "The missing link is a sustained activity that demonstrates ownership, depth, and measurable impact.",
    },
    eightSecondTest: {
      currentTag: currentIdentity,
      desiredTag: input.intendedMajor
        ? `${input.intendedMajor} student with demonstrated impact`
        : "student with a clear, evidence-backed academic and activity focus",
      tagShiftStrategy: leadName
        ? `Quantify the outcome of ${leadName} and connect it to ${input.intendedMajor ?? "your academic direction"}.`
        : `Choose one ${input.intendedMajor ?? "academic"} problem, pursue it consistently, and document a measurable result.`,
    },
    competitiveLandscape: signals.schoolBands.map(({ school }) => ({
      school: school.shortName,
      poolSize: `${school.shortName} reports an approximately ${school.acceptanceRate}% overall admit rate; verify current data on its official site.`,
      cohortPosition: `Your current evidence score is ${overallScore}/100; this is a planning measure, not an admissions outcome.`,
      competingProfiles: `Applicants may present similar grades, so measurable depth in ${leadName ?? input.intendedMajor ?? "one sustained area"} is the relevant differentiator.`,
      differentiator: leadName ? `${leadName}, once its impact is quantified` : "No clear differentiator is documented yet",
    })),
    honestFriendNote: `Your current evidence supports an overall score of ${overallScore}/100, but the result can only reflect what you documented. ${strongestEvidence} is the strongest signal in the profile today. ${leadName ? `The next move is to quantify what changed because of your work in ${leadName}.` : "The next move is to build one sustained activity with a concrete outcome."} Add missing research, projects, courses, and responsibilities before treating this as a final assessment.`,
    strengths: [
      `${strongestEvidence} is the clearest documented signal in the current profile.`,
      `${input.gpa} GPA provides a concrete academic baseline.`,
      activities.length ? `${activities.length} activities provide material to shape into a coherent narrative.` : "Starting this analysis now leaves time to build stronger evidence.",
    ],
    gaps: [
      leadName ? `The impact of ${leadName} needs a measurable outcome.` : "No sustained extracurricular focus is documented.",
      awards.length ? "Award selection levels should be verified and recorded." : "No earned distinctions are documented.",
      essayNotApplicable ? `Essays are not expected in grade ${input.grade} and are not a current scoring gap.` : "A writing sample is needed for a real essay-quality score.",
    ],
    spikeAnalysis: leadName
      ? `${leadName} is the strongest candidate for your spike, but participation alone is not yet memorable. Build one externally validated outcome connected to ${input.intendedMajor ?? "your intended direction"}.`
      : `No clear spike is documented yet. Choose one problem connected to ${input.intendedMajor ?? "your academic interests"}, pursue it consistently, and create a measurable result.`,
    counselorNote: `You have a usable starting point, and the ${overallScore}/100 result is based only on documented evidence. Fill in missing research, projects, responsibilities, and course rigor before making strategic decisions. Your highest-leverage next step is to ${leadName ? `quantify the impact of ${leadName}` : "choose one sustained project and define a measurable outcome"}.`,
    roadmap: {
      next30Days: [
        "Verify every AP, IB, honors, and dual-enrollment course in your profile.",
        leadName ? `Add numbers, scope, and outcomes to ${leadName}.` : "Choose one sustained activity tied to your intended direction.",
        "Add missing research, independent projects, family responsibilities, work, and community impact.",
      ],
      next90Days: [
        leadName ? `Complete one externally visible milestone for ${leadName}.` : "Complete the first measurable milestone for your chosen project.",
        `Review official opportunities in ${input.intendedMajor ?? "your intended field"} at each target school.`,
        essayNotApplicable ? "Keep a monthly reflection log for future application stories." : "Draft one essay scene and score it on place, detail, vulnerability, and surprise.",
      ],
      next365Days: [
        `Build a coherent body of work in ${input.intendedMajor ?? "your strongest academic area"} with a documented audience or outcome.`,
        "Re-run this analysis after adding verified results so score changes reflect real progress.",
      ],
    },
    summary: `Your current documented profile scores ${overallScore}/100. ${strongestEvidence} is the strongest signal, while ${leadName ? `the unquantified impact of ${leadName}` : "the lack of a sustained activity focus"} is the largest gap. The result is a planning baseline, not an admissions prediction. ${leadName ? `Quantifying the outcome of ${leadName}` : "Building one sustained, measurable project"} would change the assessment most.`,
    _fallback: {
      used: true,
      reason: "provider_deadline",
      message: "The AI provider was slow, so AdmitPath returned a complete evidence-based analysis using its calibrated scoring models.",
    },
    ...(essayNotApplicable ? { notApplicableDimensions: ["essayQuality"] } : {}),
  };
}

function buildPrompt(
  input: AnalyzeInput,
  signals: ReturnType<typeof precomputeSignals>,
  profileConcern?: string | null
): string {
  const courses = (input.courses ?? []).join(", ") || "Not specified";
  const activities = signals.activityDetails.join("; ") || "None listed";
  const awards = signals.classifiedAwards.join(", ") || "None listed";
  const targetBrief = buildTargetSchoolBrief(input.targetColleges ?? []);
  const concern = (input.admissionsConcern || profileConcern || "").trim();

  // Inject heuristic pre-scores so the LLM has calibration anchors
  const rigorBrief = `Heuristic rigor score: ${signals.rigor.score}/100 (${signals.rigor.apCount} APs, ${signals.rigor.ibCount} IB, ${signals.rigor.honorsCount} Honors, ${signals.rigor.dualCount} dual-enrollment). Rationale: "${signals.rigor.rationale}"`;

  const essayNotApplicable = (input.grade ?? 11) <= 10;
  let voiceBrief = essayNotApplicable
    ? `Student is in grade ${input.grade ?? "10 or below"}. Essays are usually not expected yet; do not penalize missing essays and exclude essayQuality from the overall profile judgment.`
    : "No essay sample provided — score essayQuality based on activity/award signal only and flag uncertainty.";
  if (signals.voice) {
    voiceBrief = `Voice rubric pre-scores (heuristic, College Essay Guy 4-axis): place=${signals.voice.scores.place}, detail=${signals.voice.scores.detail}, vulnerability=${signals.voice.scores.vulnerability}, surprise=${signals.voice.scores.surprise}, composite=${signals.voice.composite}/100.`;
    if (signals.voice.feedback.length > 0) {
      voiceBrief += ` Key feedback: "${signals.voice.feedback[0]}"`;
    }
  }

  // Per-school band calibration so the LLM doesn't invent admission odds
  let bandBrief = "";
  if (signals.schoolBands.length > 0) {
    bandBrief = "PRE-COMPUTED ADMISSION BANDS (use these as anchors, do not override):\n" +
      signals.schoolBands.map((sb) => {
        const pr = BAND_PROBABILITY[sb.band.band];
        return `- ${sb.school.shortName}: ${sb.band.band} (${pr[0]}–${pr[1]}%) — ${sb.band.rationale}`;
      }).join("\n");
  }

  return `<role>
You are an evidence-grounded college admissions planning assistant. Base every conclusion on the student's submitted information, the application's documented scoring rules, and verified Common Data Set inputs. Never imply personal admissions-office employment, committee service, or access to private admit-pool data.
</role>

<operating_standards>
Your evaluation must be highly specific — never generic, inflated, or sugarcoated. Assume first-pass thinking is insufficient: generic output that any counselor could produce is a failure. Produce an evaluation whose evidence and reasoning can be independently reviewed. Include every insight the submitted data supports, and distinguish observations from inferences.

THE GOLDEN RULE: Every sentence you write must reference THIS student's actual data. If you could copy-paste a sentence into any other student's report and it would still make sense, DELETE IT and write something specific. (Reason: parents pay for counsel about THEIR child; recycled sentences destroy the trust this product depends on.)

SCOPE: Apply every rubric, calibration anchor, and rule below to EVERY dimension and EVERY target school — not just the first one. Each of the 7 dimensions gets its own full-depth explanation; each target school gets its own complete micro-strategy and competitive-landscape entry.
</operating_standards>

<method>
Silently, before writing any JSON: (1) read the full profile and heuristic pre-scores; (2) place the student against the calibration archetypes; (3) decide each dimension score and confirm it violates no hard ceiling; (4) draft the school-specific strategies from each school's CDS weights and verified-program list; (5) run the self_check at the end of this prompt; then emit the JSON once. Choose an approach and commit to it — do not churn between framings; you can note residual uncertainty inside the relevant field instead.
</method>

<context>
STUDENT PROFILE
- Grade: ${input.grade}
- GPA (unweighted): ${input.gpa}${input.weightedGpa ? ` | Weighted: ${input.weightedGpa}` : ""}
- SAT: ${input.satScore ?? "Not taken"} | ACT: ${input.actScore ?? "Not taken"}
- Intended Major: ${input.intendedMajor ?? "Undecided"}
- Courses: ${courses}
- Activities (with depth metrics): ${activities}
- Awards/Honors (tier-classified): ${awards}
${input.essaySnippet ? `- Essay Sample (first 800 chars): "${input.essaySnippet.slice(0, 800)}"` : ""}
${input.recommendationNote ? `- Recommendation Notes: ${input.recommendationNote}` : ""}
${concern ? `- Stated Concern: "${concern.slice(0, 500)}"` : ""}

HEURISTIC PRE-SCORES (our system already computed these — use as calibration anchors)
${rigorBrief}
${voiceBrief}

TARGET SCHOOL CALIBRATION (with CDS C7 weights)
${targetBrief}

${bandBrief}
</context>

<task>
Produce the complete admissions evaluation JSON for THIS student: all 7 dimension scores with explanations, admission odds for EVERY listed target school, a full micro-strategy per school, the psychological profile, the 8-second test, the competitive landscape per school, the honest-friend note, strengths, gaps, spike analysis, counselor note, the 30/60/365-day roadmap, and the summary. Nothing may be omitted, abbreviated, or merged.
</task>

<constraints>
=== SCORE CALIBRATION ANCHORS ===
When assigning any score, use these bands precisely:
- 90–100: EXCEPTIONAL — top 1–2% of applicants at the target school tier. Reserved for national/international distinction, published research, or elite-level metrics (e.g., 1580+ SAT, 4.0 UW with max rigor, USAMO/ISEF finalist). Do NOT give 90+ unless the evidence is extraordinary. ENFORCEMENT: If you assign 85+ on ANY dimension, you MUST cite the specific national-level achievement, 2000+ hour commitment, or published work that justifies it. "Strong" or "impressive" activities alone NEVER warrant 85+.
- 80–89: STRONG — competitive at T20, standout at T30–50. Clear evidence of distinction but not nationally elite (e.g., 1500+ SAT, strong GPA with 8+ APs, state-level awards, sustained deep commitment).
- 65–79: DEVELOPING — competitive at T30–50, needs improvement for T20. Solid foundation but missing the "wow" factor AOs look for (e.g., good GPA but rigor gaps, regional awards only, emerging leadership without measurable outcomes).
- 50–64: BELOW TARGET — significant gap for selective schools. Will actively hurt the application at T20–30 (e.g., few APs, no leadership progression, school-level awards only, shallow activity list).
- Below 50: CRITICAL GAP — this dimension alone can sink the application. Requires immediate, focused intervention (e.g., no advanced coursework, no meaningful activities, no awards).

=== ANTI-INFLATION REALITY CHECKS ===
Use these reference profiles to prevent score drift. If a student's profile matches one of these archetypes, their scores MUST be in the stated range or lower:

ARCHETYPE A — "Good student, nothing special" (3.5 GPA, 1300 SAT, NHS + Honor Roll only, 3 generic clubs, no leadership titles, no awards beyond school):
  academicRigor: 45-55 (3.5 is below T20 floor), leadership: 25-35 (no leadership evidence), awards: 25-35 (school-level only), activityDepth: 30-40 (shallow breadth), spike: 20-30 (no discernible theme), essayQuality: 55 max without sample, recommendations: 60 (default). Overall: 35-45. This student is NOT competitive at T30 and should hear that clearly.

ARCHETYPE B — "Strong stats, weak ECs" (3.9 GPA, 1500 SAT, 10 APs, but only NHS + random club memberships, no leadership, no awards, no depth):
  academicRigor: 75-82 (stats are strong), leadership: 25-35 (none), awards: 20-30 (none), activityDepth: 25-35 (no sustained commitment), spike: 25-35 (undifferentiated), essayQuality: 55 max without sample, recommendations: 60 (default). Overall: 42-52. The stats look competitive, but the profile is fatally one-dimensional.

ARCHETYPE C — "Resume padder" (3.8 GPA, 1450 SAT, 12 clubs with "member" or "officer" in each, Honor Roll, NHS, no national awards, 2-3 hrs/wk per activity):
  academicRigor: 65-72, leadership: 40-50 (titles without outcomes), awards: 30-40 (school-level), activityDepth: 30-40 (breadth without depth), spike: 30-40 (scattered), essayQuality: 55 max, recommendations: 60. Overall: 42-50. AOs at T20s see this pattern 10,000 times and it signals "checked boxes, not genuine interest."

ARCHETYPE D — "Spike kid" (3.6 GPA, 1420 SAT, but USACO Gold + 2000+ hours coding + published app with 500 users, few other activities):
  academicRigor: 55-65 (GPA/rigor gaps), leadership: 50-60 (project leadership, not org leadership), awards: 75-85 (national competitive award), activityDepth: 80-88 (deep single commitment), spike: 80-90 (clear, memorable identity), essayQuality: 55 max, recommendations: 60. Overall: 62-72. Competitive at CS-heavy schools (MIT, CMU) despite lower GPA because the spike is genuine.

CRITICAL RULE: If a student has NO activities listed, their activityDepth MUST be 15-25, leadership MUST be 15-25, and spike MUST be 15-25. Zero evidence = near-zero score. Do not award credit for potential, only for evidence.

HARD CEILING RULES (enforced server-side — your scores will be clamped if you violate these):
- If the student has NO AP or IB courses listed AND their GPA is below 3.5, academicRigor CANNOT exceed 40. A sub-3.5 GPA with no advanced coursework is below the floor at every T30 school. Do not inflate this.
- If the student has ZERO leadership roles (no president, founder, captain, editor, director, chair, lead, coordinator, or similar titles in any activity), leadership CANNOT exceed 25. Being a "member" of clubs is not leadership.
- If the student has NO national-level awards (national competitions, USAMO, ISEF, Regeneron, USACO, IMO, IPhO, IOI, National Merit Finalist, AIME, Science Olympiad Nationals, DECA ICDC, YoungArts, etc.), awards CANNOT exceed 35. School-level awards (Honor Roll, NHS, department awards) are baseline, not distinguishing.
- If the student has NO awards listed at all, awards CANNOT exceed 20.

=== SCORING RUBRIC — 7 DIMENSIONS (0–100 each) ===

1. ACADEMIC RIGOR — Context-adjusted rigor saturation:
   - Score the SATURATION of available rigor, not raw AP count. 8 APs at a school offering 8 = 95. 8 APs at a school offering 25 = 70.
   - Factor: GPA vs. target school admit median, course progression (did rigor increase each year?), senior-year schedule strength.
   - CRITICAL: Cross-reference with intended major. A CS applicant without Calc BC or AP CS is a red flag. A humanities applicant without AP English Lit or AP History is a gap. Name the specific missing course.
   - Anchors: 90+ = exhausted available rigor + top GPA + courses aligned to major; 70–80 = solid but gaps; <60 = below target school floor.

2. LEADERSHIP — Role x Scope x OUTCOME scoring:
   - School-level role (club officer) with no measurable outcome = 45–55.
   - Regional scope (district, city) with documented impact = 60–70.
   - State-level impact with measurable results = 70–80.
   - National/international scope with quantified outcomes = 80–95.
   - Key: OUTCOMES over TITLES. "President who grew club from 5 to 50 members, launched community program serving 200 families, secured $5K in grants" = 85. "President" alone = 55. Name the specific outcome gap.
   - Founder of something real with measurable results = 80+. "Founded" with no evidence of traction = 50.

3. AWARDS — Strict tier-based scoring (never inflate school-level awards):
   - Tier 1 (national/international: USAMO, ISEF, Intel/Regeneron STS, Coca-Cola, Davidson, IMO/IPhO/IOI, Presidential Scholar) = 90–100
   - Tier 2 (state/regional: All-State, MATHCOUNTS State, state science fair, National Merit Semifinalist, AMC qualifier, AP Scholar with Distinction) = 65–80
   - Tier 3 (school-level: Honor Roll, NHS, department awards, Principal's List) = 30–50
   - No awards at all = 20. School-only awards for a T20 applicant = 35–45.
   - IMPORTANT: Name the student's HIGHEST-tier award and explain exactly how AOs at their target schools will perceive it.

4. ACTIVITY DEPTH — hours x years x measurable impact:
   - 2000+ total hours with clear progression (member to leader to impact) and quantified results = 85+
   - 800–2000 hours sustained with leadership role = 65–80
   - <200 hours or "resume padding" list of 10+ shallow activities = 30–50
   - Look for VERTICAL growth within activities, not horizontal breadth.
   - CRITICAL: Calculate approximate total hours from the depth metrics provided. State the number.

5. SPIKE — Thematic coherence that an AO remembers in 8 seconds:
   - Crystal-clear theme with national-level evidence an AO remembers after reading 30 apps = 85+
   - Emerging theme with 2–3 connected activities but no breakout achievement = 65–80
   - Diffuse "well-rounded" with no distinguishing thread = 40–55
   - Activities contradict intended major = 35–50 unless explicitly bridged in essay

6. ESSAY QUALITY — 4-axis voice rubric (College Essay Guy framework):
   - PLACE, DETAIL, VULNERABILITY, SURPRISE — score each axis.
   - If a sample is provided, score against these 4 axes individually and explain which axis is weakest with a specific fix. The heuristic pre-score above is your anchor.
   - If no sample, estimate from profile signal, score conservatively (cap at 60), and note it is a placeholder.

7. RECOMMENDATIONS — Proxy scoring:
   - Specific teacher in intended-major subject + multi-year relationship + specific anecdote = 80–90
   - Teacher relationship but no specifics = 65–75
   - No information provided = 60 (neutral default) with explicit note that it is estimated.

=== SCORE EXPLANATIONS — THE CORE OF YOUR VALUE ===
For EVERY dimension score, write a 2–3 sentence explanation that:
1. States the specific data point(s) from the student's profile that drove the score
2. Explains how that data point compares to the target school median/expectation
3. Names the single most impactful action to improve this score

BAD (generic, worthless): "Your academic rigor is strong."
GOOD (specific, actionable): "Your ${input.gpa} GPA across ${(input.courses ?? []).filter(c => /^AP /i.test(c)).length} APs is solid, but the absence of AP-level coursework in your intended major area is a gap that T20 AOs will notice. Adding [specific course] senior year would move this score 5–8 points."

=== CRITICAL RULES FOR ADMISSION ODDS ===
- For each target school, output an integer percentage (0-100) AND a one-line reason citing the SINGLE most important factor (positive or negative).
- Use the pre-computed bands above as your anchors. You may adjust by +/-5pp with justification but NOT invent numbers outside the band range. Always stay within the band's stated range.
- At sub-15% acceptance schools, factor in lottery dynamics: even perfect profiles face single-digit base rates. EXPLICITLY state this to the student: "Even applicants who match or exceed the median admit stats face lottery odds at sub-10% schools."
- Group schools into reach/target/likely tiers based on match strength.
- BEFORE scoring schoolMicroStrategies for each school, cross-check each dimension score against THAT school's CDS C7 weights. If the student scores below 65 on a dimension that school rates "Very Important" (weight=3), flag this explicitly in needleMover as the critical gap.

=== UPGRADE 1: PER-SCHOOL MICRO-STRATEGY (schoolMicroStrategies) ===
For EACH target school, produce a transparent micro-strategy grounded in the supplied profile and available school data:

For each school, write:
- "cdsAlignment": Which of the student's 7 dimension scores align with what THIS school's CDS C7 rates as "Very Important"? Name the exact dimensions and scores. Example: "Your Academic Rigor (82) and Spike (78) align with MIT's 'Very Important' ratings for rigor and talent/ability."
- "needleMover": The ONE specific thing that would most move the needle at THIS school. Not generic ("improve your essay") — specific to this school's values. Example: "MIT explicitly asks for a STEM teacher recommendation. Your physics teacher who supervised your research would be ideal — this single move could be the difference between a split committee vote going your way or not."
- "essayAngle": A school-specific essay angle for the "Why Us" supplement that leverages this student's unique profile. Name a specific program, lab, center, or tradition at the school. Example: "For your MIT 'Why us,' reference the UROP program and how your existing computational biology research could extend into Professor [area]'s lab. MIT AOs see 10,000 'I love the collaborative culture' essays — they remember the ones that name specific labs."
- "applicationTiming": Whether ED/EA/RD is optimal for THIS school given THIS student's profile, and why. Factor in: (a) Does this school offer ED/EA/REA? (b) Is the student's profile strong enough NOW, or would RD allow time to improve? (c) Does the family need to compare financial aid? (d) What is the actual ED boost at this school? Example: "Apply EA to MIT — your profile is strong enough now, and MIT EA is non-binding with no rate penalty. Do NOT ED to Penn unless it is your clear #1, because Penn's ED rate is 2-3x RD and binding."
- "departmentReference": The specific department, program, interdisciplinary center, or unique offering the student should reference. Not just "the CS department" — name something specific the student's spike connects to. Example: "Reference Stanford's Symbolic Systems program (interdisciplinary CS + cognitive science) rather than generic CS — it is a smaller, more distinctive program that connects to your NLP research."

HALLUCINATION GUARD (server-enforced): Each school's TARGET SCHOOL CALIBRATION entry above either lists VERIFIED PROGRAMS or says none are on file. You may cite a program/lab/center by name ONLY if it appears in that school's verified list. For schools with no list — or anything outside the list — write "explore [school]'s offerings in [department area] — verify on their official site" instead of naming a program. The server post-checks every departmentReference and essayAngle against the verified list and flags unverified names to the student, so inventing a program name only damages the report. NEVER invent a program name.

=== UPGRADE 2: PSYCHOLOGICAL PROFILE (psychologicalProfile) ===
Read between the lines of the student's profile. What might an application reader reasonably infer about who this person is? Ground each inference in submitted evidence and label uncertainty instead of inventing missing context.

Write a "profileReading" — 3-4 sentences that describe what an admissions reader would conclude about this student's character, intellectual identity, and motivations just from the activities, awards, courses, and essay (if provided). Be specific:
- GOOD: "Your profile tells admissions: 'I am a deep researcher who cares about impact, not resume-padding.' The 2000+ hours in your research lab, combined with the absence of superficial club memberships, signals genuine intellectual curiosity. This is exactly the profile that T20 schools want — but only if your essay backs it up with the WHY behind the research."
- GOOD: "Your profile reads as 'well-rounded but undifferentiated.' You have breadth — debate, soccer, NHS, volunteering — but no clear identity. When an admissions reader finishes your application, they will struggle to describe you in committee. That is dangerous at schools where 96% of applicants are rejected."
- BAD: "You have a strong profile." (Generic, worthless)

Also write a "narrativeGap" — 1-2 sentences on what is MISSING from the psychological portrait. What question would an AO have after reading this profile?

=== UPGRADE 3: THE 8-SECOND TEST (eightSecondTest) ===
In admissions committee, a reader has about 8 seconds to describe an applicant to the room. This is the "tag" that follows the application through every vote.

Write the "currentTag" — the sentence an AO would use RIGHT NOW to describe this student in committee. Be honest. Example: "The computational biology kid from [state] with the published research." Or: "Strong-stats generalist, no clear hook."

Then write the "desiredTag" — what the student SHOULD want the AO to say. Example: "The student who built a tool that 500 researchers actually use."

Finally, write "tagShiftStrategy" — 2-3 sentences on HOW to shift from the current tag to the desired one. What specific actions, essay angles, or framing changes would make this happen?

=== UPGRADE 4: COMPETITIVE LANDSCAPE (competitiveLandscape) ===
For each target school, tell the student WHERE they sit in the applicant pool. Use the school's acceptance rate and applicant count to give real context:

- "poolSize": Approximate number of applicants at this school (use public data).
- "cohortPosition": Where this student sits among applicants with similar stats. Example: "Among unhooked applicants with 3.9+ GPA and 1500+ SAT at Stanford, your computational biology spike puts you in the top 15% of that cohort."
- "competingProfiles": How many other applicants will have a SIMILAR profile? Example: "Approximately 300 other applicants will also have biology research. What makes yours different is [specific element]. Lead with that."
- "differentiator": The specific element from THIS student's profile that separates them from the cohort. If nothing differentiates them, say so directly.

=== UPGRADE 5: THE HONEST FRIEND (honestFriendNote) ===
Write a "honestFriendNote" — 4-6 sentences that sound like an honest, caring older sibling or mentor who has been through this process. NOT a consultant's careful language. NOT a chatbot's encouragement. A real person who cares about this student and will not let them waste their shot.

Tone examples:
- "Your stats are solid — 3.9 GPA, 1520 SAT, 10 APs — but I want to be real with you: at sub-5% schools, 'solid' is the floor, not the ceiling. What makes you different from the other 5,000 applicants with the same numbers? Your comp bio research — THAT is the answer. Do not water it down by listing 5 other activities equally. And your essay needs to be ABOUT YOU, not about the research itself. Tell me what happens at 11 PM when the experiment fails and you cannot stop thinking about it."
- "I know you want to hear that you are a lock for Harvard. You are not — nobody is at 3.4%. But here is what I can tell you: your profile is EXACTLY the kind that gets in when the essay lands. You have the stats, you have the spike. The essay is the difference between 'impressive applicant' and 'I need to fight for this kid in committee.' That is where your energy should go."
- "Real talk: your activity list looks like you Googled 'what do colleges want to see' and checked every box. Admissions readers see this pattern 10,000 times. Drop 4 activities, go all-in on 2, and your application will be 10x more compelling."

=== COUNSELOR NOTE ===
Write a "counselorNote" — 3–4 sentences as if you are sitting across from this student in your office. Warm but direct, specific to their data. End with the single most important thing they should do next.

=== STRENGTHS AND GAPS — WITH CONSEQUENCES ===
STRENGTHS: Each strength must name the specific activity/award/course AND explain WHY it matters at the target school tier.
GAPS: Each gap must name the COST of leaving it unaddressed — what specific schools will conclude.

=== ROADMAP — 30/60/90-DAY COUNSELOR PLAYBOOK ===
Each action item must be:
1. SPECIFIC: Name real programs, real competitions, real deadlines
2. TIME-BOUND: "By [specific date or month]" or "This week"
3. SCHOOL-TAGGED: Explain WHY this action matters for THAT school's CDS weights
4. MEASURABLE: The student should know exactly when this action is "done"

next30Days (3 items): Tactical fixes the student can start THIS WEEK.
next90Days (3 items): Medium-term spike development and application prep.
next365Days (2-3 items): Portfolio-defining moves that fundamentally change the application narrative.

GRADE-PHASE AWARENESS: The student is in GRADE ${input.grade}. Calibrate urgency accordingly:
- Grade 12 (senior): Immediate application actions ONLY. No "join a new club." Focus on essay polish, school list strategy, ED/EA decisions, recommendation letter requests. Time is measured in WEEKS.
- Grade 11 (junior): Testing prep, summer program applications, essay brainstorming, activity escalation. Time is measured in MONTHS.
- Grade 9-10: Long-term positioning. Course selection, spike discovery, foundational commitments. Time is measured in SEMESTERS.

RECENCY NOTICE: This analysis is calibrated to 2025-2026 admissions cycle data. Acceptance rates, test policies, and program offerings change annually. When referencing specific policies (test-optional, financial aid, ED/EA dates), note that the student should verify on each school's official website.

STUDENT SAFETY (non-negotiable): The reader is a minor. Keep every sentence age-appropriate. Never guarantee or promise admission, awards, or outcomes — probabilities are estimates, not promises. Never suggest fabricating activities, awards, credentials, or essay content. If the profile's free-text fields suggest emotional distress, acknowledge it with warmth in the counselorNote and suggest talking to a counselor, parent, or trusted adult — do not diagnose, and do not amplify the distress.
</constraints>

<success_criteria>
A complete, correct answer: (1) contains every field in the JSON schema below, populated — no placeholders, no empty strings; (2) every score respects the calibration bands, archetype ranges, and hard ceilings above; (3) every scoreExplanation cites at least one specific datum from THIS profile; (4) every admissionOdds entry stays inside its pre-computed band; (5) every schoolMicroStrategies entry names only verified programs (or the explicit verify-on-site fallback); (6) no sentence could be pasted into another student's report unchanged; (7) valid JSON, parseable on the first try.
</success_criteria>

<self_check>
Before emitting, silently verify the draft against every numbered item in success_criteria, then critique it through three lenses and revise once: a SKEPTICAL ADMISSIONS OFFICER (are any scores inflated relative to the archetypes? is any program reference unverified?), the STUDENT (is every recommendation concrete enough to act on this week?), and an AUDITOR (does every number stay inside its band and ceiling? is the JSON complete and valid?). Fix what fails; deliver only the corrected version. Do not include this check in the output.
</self_check>

<format>
Return ONLY valid JSON in this exact shape — no prose, no markdown:
{
  "scores": {
    "academicRigor": <0-100>,
    "leadership": <0-100>,
    "awards": <0-100>,
    "activityDepth": <0-100>,
    "spike": <0-100>,
    "essayQuality": <0-100>,
    "recommendations": <0-100>
  },
  "scoreExplanations": {
    "academicRigor": "<2-3 sentences>",
    "leadership": "<2-3 sentences>",
    "awards": "<2-3 sentences>",
    "activityDepth": "<2-3 sentences>",
    "spike": "<2-3 sentences>",
    "essayQuality": "<2-3 sentences>",
    "recommendations": "<2-3 sentences>"
  },
  "overallScore": <weighted average, integer>,
  "admissionOdds": [
    { "school": "<exact school name>", "percent": <integer 0-100>, "tier": "reach|target|likely", "reason": "<one line citing the single most important factor AND referencing that school's CDS C7 weight>" }
  ],
  "schoolMicroStrategies": [
    {
      "school": "<exact school name>",
      "cdsAlignment": "<which of YOUR dimensions align with what THIS school values as Very Important — cite dimension names and scores>",
      "needleMover": "<the ONE specific thing that would most move the needle at this school>",
      "essayAngle": "<a school-specific 'Why Us' essay angle that leverages this student's unique profile — name a specific program, lab, or tradition>",
      "applicationTiming": "<ED/EA/REA/RD recommendation for THIS school with THIS student's profile — include reasoning>",
      "departmentReference": "<the specific department, program, or center the student should reference — not generic>"
    }
  ],
  "psychologicalProfile": {
    "profileReading": "<3-4 sentences: what does this application TELL admissions about who this person is? Read between the lines. Be specific about the character/identity signal.>",
    "narrativeGap": "<1-2 sentences: what question would an AO have after reading this profile? What is missing from the story?>"
  },
  "eightSecondTest": {
    "currentTag": "<the sentence an AO would use RIGHT NOW to describe this student in committee — be brutally honest>",
    "desiredTag": "<what the student SHOULD want the AO to say>",
    "tagShiftStrategy": "<2-3 sentences: how to shift from current tag to desired tag — specific actions, essay angles, framing>"
  },
  "competitiveLandscape": [
    {
      "school": "<school name>",
      "poolSize": "<approximate applicant count>",
      "cohortPosition": "<where this student sits among similar-stats applicants>",
      "competingProfiles": "<how many applicants have a similar profile and what makes this student different>",
      "differentiator": "<the specific element that separates them, or 'no clear differentiator' if honest>"
    }
  ],
  "honestFriendNote": "<4-6 sentences: sounds like a caring older sibling, not a consultant. Real talk. Reference specific profile data. Do not sugarcoat. Do not use consultant-speak. This should feel like a real person who has been through the process talking to someone they care about.>",
  "strengths": ["<3-5 specific strengths — each MUST name the activity/award/course AND explain why it matters at the target school tier>"],
  "gaps": ["<3-5 gaps — each MUST name the COST: 'Without [specific thing], [specific school] will see [specific consequence]'>"],
  "spikeAnalysis": "<3-4 sentences: (1) State the student's spike identity in one sentence or say 'no clear spike yet.' (2) Apply the 8-second test — would an AO remember this after 30 apps? (3) If competing spikes exist, name them and say which to lead with for which schools. (4) Name the ONE thing that would make this spike genuinely T20-distinctive.>",
  "counselorNote": "<3-4 sentences in second person, warm but direct. Reference their specific data. End with the single most important thing they should do next.>",
  "roadmap": {
    "next30Days": ["<3 concrete actions — each must name specific programs/deadlines/people, be tagged to target schools where relevant, and be completable within 30 days>"],
    "next90Days": ["<3 concrete actions — spike development, summer programs (name them), essay drafting milestones, leadership escalation with measurable targets>"],
    "next365Days": ["<2-3 portfolio-defining moves — bold but achievable, with specific success criteria that would move the needle at target schools>"]
  },
  "summary": "<3-4 sentence honest assessment in second person. First sentence: where you stand overall. Second sentence: your single biggest strength and why it matters. Third sentence: your single biggest liability and what it costs you. Fourth sentence: the one move that would most change your odds.>"
}
</format>`;
}

export async function POST(req: Request) {
 try {
  const _monitorStart = Date.now();
  // requireUser handles 401 + the soft-delete-aware 404 in one shot. The
  // soft-delete filter is the load-bearing piece — a tombstoned user (post
  // account-delete or Clerk user.deleted) must NOT be allowed to run analyses
  // and persist Analysis rows tied to a deleted account.
  const authed = await requireUser();
  if ("response" in authed) return authed.response;
  const { userId, user } = authed;

  // Cost-bearing AI routes must not bypass abuse controls when the limiter fails.
  let rl: { allowed: boolean };
  try {
    rl = await rateLimitUserAndIp(userId, req, user.plan);
  } catch (rlErr) {
    console.error("[/api/analyze] rate limiter unavailable:", rlErr instanceof Error ? rlErr.message : String(rlErr));
    return NextResponse.json(
      { error: "Request safety check is temporarily unavailable. Please try again shortly." },
      { status: 503, headers: { "Retry-After": "30" } },
    );
  }
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests. Please wait a minute and try again." }, {
      status: 429,
      headers: { "Retry-After": "60" },
    });
  }

  const access = checkFeatureAccess(user, "analyses");
  if (!access.allowed) {
    const { status, body } = accessDenialResponse(access);
    return NextResponse.json(body, { status });
  }

  // includeDetails: keep returning `parsed.error.flatten()` — the analyze form
  // surfaces field-level errors and removing them would break that UX.
  const parsedBody = await parseJsonBody(req, analyzeSchema, { includeDetails: true });
  if ("response" in parsedBody) return parsedBody.response;
  const parsed = parsedBody;

  // Sanitize all string inputs to prevent prompt injection
  parsed.data = sanitizeInputObject(parsed.data);

  // Pull stored profile so we can pass admissionsConcern even if the form
  // didn't re-submit it. Non-fatal if missing. withRetry handles Neon cold-start.
  let profileConcern: string | null | undefined;
  try {
    const profile = await withRetry(() =>
      prisma.profile.findFirst({
        where: { userId, deletedAt: null },
        select: { admissionsConcern: true },
      }),
    );
    profileConcern = profile?.admissionsConcern;
  } catch { /* non-fatal */ }

  // Track processing time for response metadata
  const startTime = Date.now();

  // Pre-compute heuristic signals to inject into prompt and post-process LLM output
  const signals = precomputeSignals(parsed.data);

  // Hard cap on the LLM call. Must be UNDER Vercel's maxDuration (60s) so
  // the route can catch the timeout and return JSON instead of Vercel
  // killing the function with a bare 503.
  const TIMEOUT_MS = 25_000;
  class AnalyzeTimeoutError extends Error {}

  let result: unknown;
  try {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new AnalyzeTimeoutError("analyze timed out")), TIMEOUT_MS);
    });
    // Tier 2 minimum — 7-dimension profile scoring needs 70B reasoning.
    // Pro users get Tier 3 (Claude Sonnet) for best calibration.
    const userPlan = effectivePlan(user);
    const llmMessages = [
      { role: "system" as const, content: "You are an evidence-grounded college admissions planning assistant. Do not claim personal admissions-office experience, committee service, or access to private applicant data. Return ONLY valid JSON matching the schema — no markdown, no prose, no commentary outside the JSON. CRITICAL RULES: (1) Never inflate scores to be kind. (2) Use the heuristic pre-scores as calibration anchors. (3) Every sentence must reference THIS student's specific data — if you could copy-paste it into another student's report, rewrite it. (4) Score explanations are 2-3 sentences each, not one. (5) The counselorNote should be direct, supportive, and concrete. (6) schoolMicroStrategies may reference only verified programs, labs, centers, and traditions supplied by the server. (7) The honestFriendNote must separate evidence from inference and avoid false certainty. (8) The eightSecondTest currentTag must be candid and specific. (9) competitiveLandscape must provide context without presenting estimates as admissions outcomes or guarantees." },
      { role: "user" as const, content: buildPrompt(parsed.data, signals, profileConcern) },
    ];
    const work = callWithJsonRetry<unknown>(
      async () => {
        const { text } = await routeLlmCall(llmMessages, {
          minTier: userPlan === "pro" ? 3 : 2,
          plan: userPlan,
          // Scoring calls need low variance and headroom for the full JSON
          // schema — 0.7/2048 caused score drift and truncated multi-school
          // responses that json-repair then had to retry.
          temperature: 0.2,
          maxTokens: 4096,
          callerLabel: "analyze",
          userId,
        });
        return text;
      },
      1
    );
    try {
      result = await Promise.race([work, timeout]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  } catch (err) {
    const durationMs = Date.now() - _monitorStart;
    recordFailure("api/analyze", durationMs, err instanceof Error ? err.message : String(err));
    console.error("[/api/analyze] AI failed:", {
      event: "ai_failed",
      error: err instanceof Error ? err.message : String(err),
      hasGroqKey1: !!process.env.GROQ_API_KEY_1,
      hasCerebrasKey: !!process.env.CEREBRAS_API_KEY,
      hasDbUrl: !!process.env.DATABASE_URL,
    });
    if (err instanceof AnalyzeTimeoutError) {
      result = buildHeuristicAnalysis(parsed.data, signals);
    } else {
    if (err instanceof JsonParseError) {
      return NextResponse.json({ error: "AI returned an unparseable response. Please retry." }, { status: 502 });
    }
    const errMsg = err instanceof Error ? err.message.toLowerCase() : "";
    if (errMsg.includes("all llm") || errMsg.includes("exhausted") || errMsg.includes("429")) {
      return NextResponse.json(
        { error: "Our AI is temporarily busy due to high demand. Please try again in 30 seconds.", retryable: true },
        { status: 429, headers: { "Retry-After": "30" } },
      );
    }
    if (errMsg.includes("no groq") || errMsg.includes("not configured") || errMsg.includes("not set")) {
      return NextResponse.json(
        { error: "AI service is not configured. Please contact support.", retryable: false },
        { status: 503 },
      );
    }
    if (errMsg.includes("401") || errMsg.includes("unauthorized") || errMsg.includes("invalid api key")) {
      return NextResponse.json(
        { error: "AI service authentication failed. Our team has been notified.", retryable: false },
        { status: 503 },
      );
    }
    if (errMsg.includes("cerebras") && errMsg.includes("groq")) {
      return NextResponse.json(
        { error: "All AI providers are temporarily unavailable. Please try again in 1-2 minutes.", retryable: true },
        { status: 503, headers: { "Retry-After": "60" } },
      );
    }
    return NextResponse.json(
      { error: "AI service temporarily unavailable. Please try again in a moment.", retryable: true },
      { status: 503, headers: { "Retry-After": "30" } },
    );
    }
  }

  // Context-aware rigor override — clamp LLM rigor score to within +/-15
  // of the heuristic so the LLM still reflects factors the heuristic misses
  // (essay tone, course progression, etc.) but can't wildly diverge.
  try {
    const r = result as {
      scores?: {
        academicRigor?: number;
        essayQuality?: number;
        leadership?: number;
        awards?: number;
        activityDepth?: number;
        spike?: number;
        recommendations?: number;
      };
      overallScore?: number;
      gaps?: string[];
      scoreExplanations?: { essayQuality?: string };
      rigorRationale?: string;
      voiceRationale?: string;
      notApplicableDimensions?: string[];
      _scoreClamps?: string[];
    };
    if (r.scores && typeof r.scores.academicRigor === "number") {
      const llmScore = r.scores.academicRigor;
      const diff = llmScore - signals.rigor.score;
      if (Math.abs(diff) > 15) {
        r.scores.academicRigor = Math.round(signals.rigor.score + Math.sign(diff) * 15);
      }
      r.rigorRationale = signals.rigor.rationale;
    }
    // Voice rubric overlay — clamp essay score to within +/-15 of heuristic
    if (signals.voice && r.scores && typeof r.scores.essayQuality === "number") {
      const llmEssay = r.scores.essayQuality;
      const diff = llmEssay - signals.voice.composite;
      if (Math.abs(diff) > 15) {
        r.scores.essayQuality = Math.round(signals.voice.composite + Math.sign(diff) * 15);
      }
      r.voiceRationale = signals.voice.feedback.slice(0, 2).join("; ");
    }

    // ——————————————————————————————————————————————————————————
    // HARD SCORE CEILING RULES — evidence-based anti-inflation
    // These override both LLM and heuristic scores when profile
    // evidence is objectively insufficient. The LLM sometimes
    // inflates scores out of politeness; these rules enforce reality.
    // ——————————————————————————————————————————————————————————
    if (r.scores) {
      const clamps: string[] = [];
      const essayNotApplicable = (parsed.data.grade ?? 11) <= 10;

      // Rule 1: No AP/IB courses AND GPA < 3.5 → academicRigor capped at 40.
      // Rationale: A sub-3.5 GPA with zero advanced coursework is below the
      // floor of every T30 school. No combination of essays or recs compensates.
      const hasApIb = (parsed.data.courses ?? []).some(
        (c) => /^(AP|IB)\s/i.test(c.trim())
      );
      if (!hasApIb && parsed.data.gpa < 3.5) {
        if (r.scores.academicRigor !== undefined && r.scores.academicRigor > 40) {
          clamps.push(`academicRigor clamped from ${r.scores.academicRigor} to 40: no AP/IB courses and GPA ${parsed.data.gpa} < 3.5`);
          r.scores.academicRigor = 40;
        }
      }

      // Rule 2: Zero leadership roles → leadership capped at 25.
      // Rationale: Leadership with no evidence = near-zero score.
      // "Member" roles and activities without a leadership title or
      // founder/president/captain/editor/director/chair signal are not leadership.
      const hasLeadershipEvidence = (parsed.data.activities ?? []).some((a) =>
        /\b(president|founder|captain|editor|director|chair|head|lead|chief|co-founder|coordinator|manager|organizer)\b/i.test(a.role ?? "")
      );
      if (!hasLeadershipEvidence) {
        if (r.scores.leadership !== undefined && r.scores.leadership > 25) {
          clamps.push(`leadership clamped from ${r.scores.leadership} to 25: no leadership roles found in activities`);
          r.scores.leadership = 25;
        }
      }

      // Rule 3: No national-level awards → awards capped at 35.
      // Rationale: School-level awards (Honor Roll, NHS, department awards)
      // are baseline, not differentiating. State-level is solid but not T20-
      // competitive. Only national/international awards justify scores above 35.
      const hasNational = (parsed.data.awards ?? []).some((a) =>
        /\b(national|USAMO|ISEF|Intel|Regeneron|Siemens|RSI|USACO|IMO|IPhO|IOI|Coca-Cola|Davidson|Scholastic Gold|Presidential Scholar|National Merit Finalist|AIME|Science Olympiad Nationals|DECA ICDC|FBLA NLC|YoungArts|Conrad Challenge|Concord Review)\b/i.test(a)
      );
      if (!hasNational && (parsed.data.awards ?? []).length > 0) {
        if (r.scores.awards !== undefined && r.scores.awards > 35) {
          clamps.push(`awards clamped from ${r.scores.awards} to 35: no national-level awards detected (only school/regional-level present)`);
          r.scores.awards = 35;
        }
      }
      // No awards at all → cap at 20
      if ((parsed.data.awards ?? []).length === 0) {
        if (r.scores.awards !== undefined && r.scores.awards > 20) {
          clamps.push(`awards clamped from ${r.scores.awards} to 20: no awards listed`);
          r.scores.awards = 20;
        }
      }

      // Rule 4: Zero activities listed → activityDepth capped at 20, spike capped at 20.
      // Rationale: With no evidence of any extracurricular involvement, these
      // dimensions have zero signal. The LLM sometimes awards credit for
      // "potential" or based on the student's stated interest — that's wrong.
      // Only evidence counts.
      const rScoresTyped = r.scores as Record<string, number | undefined>;
      if ((parsed.data.activities ?? []).length === 0) {
        if (rScoresTyped.activityDepth !== undefined && rScoresTyped.activityDepth > 20) {
          clamps.push(`activityDepth clamped from ${rScoresTyped.activityDepth} to 20: no activities listed`);
          rScoresTyped.activityDepth = 20;
        }
        if (rScoresTyped.spike !== undefined && rScoresTyped.spike > 20) {
          clamps.push(`spike clamped from ${rScoresTyped.spike} to 20: no activities listed (spike requires evidence)`);
          rScoresTyped.spike = 20;
        }
        // Also clamp leadership for zero-activity students (redundant with Rule 2
        // but explicit for completeness)
        if (rScoresTyped.leadership !== undefined && rScoresTyped.leadership > 20) {
          clamps.push(`leadership clamped from ${rScoresTyped.leadership} to 20: no activities listed`);
          rScoresTyped.leadership = 20;
        }
      }

      // Rule 5: No essay sample AND no recommendation notes → essayQuality
      // capped at 55. Without evidence, we cannot justify a competitive score.
      // The LLM prompt already says "cap at 60" but sometimes drifts to 65-70.
      if (essayNotApplicable) {
        const nonEssayKeys = [
          "academicRigor",
          "leadership",
          "awards",
          "activityDepth",
          "spike",
          "recommendations",
        ] as const;
        const nonEssayScores = nonEssayKeys
          .map((key) => rScoresTyped[key])
          .filter((score): score is number => typeof score === "number");
        if (nonEssayScores.length > 0) {
          const nonEssayAverage = Math.round(nonEssayScores.reduce((sum, score) => sum + score, 0) / nonEssayScores.length);
          rScoresTyped.essayQuality = nonEssayAverage;
          r.overallScore = nonEssayAverage;
          r.scoreExplanations = {
            ...(r.scoreExplanations ?? {}),
            essayQuality: `Not scored for grade ${parsed.data.grade}; application essays are not expected yet and were excluded from the overall profile score.`,
          };
          r.notApplicableDimensions = Array.from(new Set([...(r.notApplicableDimensions ?? []), "essayQuality"]));
          r.gaps = r.gaps?.filter((gap) => !/\b(essay|common app|supplemental)\b/i.test(gap));
          clamps.push(`essayQuality marked not applicable for grade ${parsed.data.grade}; overallScore recalculated without essay`);
        }
      } else if (!parsed.data.essaySnippet?.trim() && !parsed.data.recommendationNote?.trim()) {
        if (rScoresTyped.essayQuality !== undefined && rScoresTyped.essayQuality > 55) {
          clamps.push(`essayQuality clamped from ${rScoresTyped.essayQuality} to 55: no essay sample or recommendation notes provided`);
          rScoresTyped.essayQuality = 55;
        }
      }

      if (clamps.length > 0) {
        r._scoreClamps = clamps;
        console.log("[/api/analyze]", { event: "score_clamps_applied", clamps });
      }
    }
  } catch (overlayErr) {
    console.error("[/api/analyze]", { event: "score_overlay_failed", fatal: false, error: String(overlayErr) });
  }

  // Per-school CDS weight match — compute weighted scores showing how
  // this student's dimension strengths align with what each school values.
  // Also attaches calibrated admit bands from lib/admit-rates.ts.
  try {
    const rCds = result as {
      scores?: Record<string, number>;
      voiceRubric?: Record<string, number>;
      schoolWeightMatches?: unknown[];
    };
    if (rCds.scores) {
      const dimScores: DimensionScores = {
        academicRigor: rCds.scores.academicRigor ?? 50,
        leadership: rCds.scores.leadership ?? 50,
        awards: rCds.scores.awards ?? 50,
        activityDepth: rCds.scores.activityDepth ?? 50,
        spike: rCds.scores.spike ?? 50,
        essayQuality: rCds.scores.essayQuality ?? 50,
        recommendations: rCds.scores.recommendations ?? 50,
      };
      const essayNotApplicable = (parsed.data.grade ?? 11) <= 10;
      if (essayNotApplicable) {
        const nonEssayAverage = Math.round(
          (
            dimScores.academicRigor +
            dimScores.leadership +
            dimScores.awards +
            dimScores.activityDepth +
            dimScores.spike +
            dimScores.recommendations
          ) / 6,
        );
        dimScores.essayQuality = nonEssayAverage;
      }
      const genericAvg = Math.round(
        Object.values(dimScores).reduce((s, v) => s + v, 0) / 7
      );

      rCds.schoolWeightMatches = signals.schoolBands.map((sb) => {
        const { score: weightedScore, weights } = computeWeightedScore(dimScores, sb.school.slug);
        const delta = weightedScore - genericAvg;

        // Dimensions where school weight is "Very Important" but student is weak
        const weakPoints = (Object.keys(weights) as CdsDimension[])
          .filter((dim) => weights[dim] >= 3 && dimScores[dim] < 60)
          .map((dim) => DIMENSION_LABEL[dim]);

        // Dimensions where school weight is "Very Important" and student is strong
        const strongPoints = (Object.keys(weights) as CdsDimension[])
          .filter((dim) => weights[dim] >= 3 && dimScores[dim] >= 75)
          .map((dim) => DIMENSION_LABEL[dim]);

        return {
          school: sb.school.shortName,
          slug: sb.school.slug,
          weightedScore,
          genericScore: genericAvg,
          delta,
          band: sb.band.band,
          bandRange: BAND_PROBABILITY[sb.band.band],
          bandRationale: sb.band.rationale,
          strongMatchDimensions: strongPoints,
          weakMatchDimensions: weakPoints,
          lotteryDisclaimer: sb.school.acceptanceRate < 15
            ? `${sb.school.shortName} admits ~${sb.school.acceptanceRate}% of applicants. At this selectivity, even well-qualified candidates face lottery dynamics.`
            : undefined,
        };
      });

      // Attach the 4-axis voice rubric breakdown for UI rendering
      if (signals.voice) {
        rCds.voiceRubric = signals.voice.scores;
      }
    }
  } catch (cdsErr) {
    console.error("[/api/analyze]", { event: "cds_overlay_failed", fatal: false, error: String(cdsErr) });
  }

  // Hallucination grounding — post-check every school-specific program
  // reference against the verified whitelist. Unverified names keep the
  // model's text but gain an explicit "confirm on the official site" note
  // plus a `_programVerified` flag the UI can render as a trust chip.
  try {
    const rGround = result as {
      schoolMicroStrategies?: Array<{
        school?: string;
        departmentReference?: string;
        essayAngle?: string;
        _programVerified?: boolean;
      }>;
    };
    if (Array.isArray(rGround.schoolMicroStrategies)) {
      for (const strategy of rGround.schoolMicroStrategies) {
        const college = strategy.school ? matchCollege(strategy.school) : undefined;
        if (typeof strategy.departmentReference === "string" && strategy.departmentReference) {
          const grounded = groundProgramReference(college?.slug, college?.domain, strategy.departmentReference);
          strategy.departmentReference = grounded.text;
          strategy._programVerified = grounded.verified;
        }
        if (typeof strategy.essayAngle === "string" && strategy.essayAngle) {
          const grounded = groundProgramReference(college?.slug, college?.domain, strategy.essayAngle);
          strategy.essayAngle = grounded.text;
        }
      }
    }
  } catch (groundErr) {
    console.error("[/api/analyze]", { event: "program_grounding_failed", fatal: false, error: String(groundErr) });
  }

  // Band enforcement — the prompt instructs the LLM to stay inside the
  // pre-computed admit band, but nothing guaranteed it. Clamp each school's
  // percent into its band range and attach band metadata so the UI shows an
  // honest calibrated range instead of a false-precision integer.
  try {
    const rOdds = result as {
      admissionOdds?: Array<{
        school?: string;
        percent?: number;
        band?: string;
        bandRange?: [number, number];
        tier?: string;
        reason?: string;
      }>;
    };
    if (Array.isArray(rOdds.admissionOdds)) {
      for (const odds of rOdds.admissionOdds) {
        const college = odds.school ? matchCollege(odds.school) : undefined;
        const sb = college
          ? signals.schoolBands.find((b) => b.school.slug === college.slug)
          : undefined;
        if (sb) {
          const [lo, hi] = BAND_PROBABILITY[sb.band.band];
          if (typeof odds.percent === "number" && (odds.percent < lo || odds.percent > hi)) {
            console.log("[/api/analyze]", {
              event: "odds_clamped_to_band",
              school: odds.school,
              llmPercent: odds.percent,
              band: sb.band.band,
            });
            odds.percent = Math.min(hi, Math.max(lo, odds.percent));
          }
          odds.band = sb.band.band;
          odds.bandRange = [lo, hi];
        }
      }
    }
  } catch (bandErr) {
    console.error("[/api/analyze]", { event: "band_enforcement_failed", fatal: false, error: String(bandErr) });
  }

  // Enforce the user-facing quality contract after every heuristic clamp so
  // explanations, evidence, confidence, and actions describe the final score.
  result = normalizeAnalysisQuality(
    result as Record<string, unknown>,
    parsed.data,
  );

  let savedId: string | undefined;
  try {
    // Atomic: the analysis row + the Free-plan counter increment must succeed
    // together or not at all. Previously these were sequential — a DB hiccup
    // between them could either (a) save the analysis without burning Free-plan
    // budget (free analyses) or (b) burn budget without saving (lost work).
    if (access.reason === "free") {
      const saved = await prisma.$transaction(async (tx) => {
        const reservation = await tx.user.updateMany({
          where: { id: userId, deletedAt: null, analysisCount: { lt: FREE_LIMITS.analyses } },
          data: { analysisCount: { increment: 1 } },
        });
        if (reservation.count !== 1) throw new FreePlanLimitReachedError("analyses");
        return tx.analysis.create({
          data: { userId, type: "admission", input: parsed.data as object, result: result as object },
        });
      });
      savedId = saved.id;
    } else {
      const saved = await withRetry(() =>
        prisma.analysis.create({
          data: { userId, type: "admission", input: parsed.data as object, result: result as object },
        }),
      );
      savedId = saved.id;
    }
  } catch (dbErr) {
    if (dbErr instanceof FreePlanLimitReachedError) {
      return NextResponse.json(freeUsageLimitBody("analyses"), { status: 429 });
    }
    console.error("[/api/analyze]", { event: "db_write_failed_after_ai_success", fatal: true, error: String(dbErr), hasDbUrl: !!process.env.DATABASE_URL });
    return NextResponse.json(
      {
        error: "Your analysis was generated but could not be saved. Please retry; this attempt did not consume your Free-plan usage.",
        code: "ANALYSIS_SAVE_FAILED",
        recoverable: true,
      },
      { status: 503, headers: { "Retry-After": "10" } },
    );
  }

  // Persist AI generation for cross-app analytics
  try {
    await withRetry(() =>
      prisma.generation.create({
        data: {
          userId,
          app: "admitpath",
          type: "analysis",
          payload: { input: parsed.data, result } as object,
          createdAt: new Date(),
        },
      }),
    );
  } catch {
    // Non-fatal — analysis already saved above
  }

  // Validate AI output quality — catch inflation, missing fields, generic filler
  const quality = validateAIOutput(result, {
    requiredFields: ["scores", "overallScore", "summary", "counselorNote", "spikeAnalysis"],
    requiredArrays: ["strengths", "gaps", "admissionOdds"],
    scoreFields: [
      "scores.academicRigor", "scores.leadership", "scores.awards",
      "scores.activityDepth", "scores.spike", "scores.essayQuality",
      "scores.recommendations",
    ],
    minScoreSpread: 15,
  });

  const nextSteps = buildNextSteps("analyze", result as Record<string, unknown>);
  const meta = buildResponseMeta({
    startTime,
    dataSources: [
      "CDS C7 weights",
      "admit-rates heuristic",
      ...(signals.voice ? ["voice-rubric heuristic"] : []),
      "rigor-scoring heuristic",
    ],
    confidenceLevel: signals.schoolBands.length > 0 ? "high" : "medium",
    qualityScore: quality.score,
  });

  const durationMs = Date.now() - _monitorStart;
  recordSuccess("api/analyze", durationMs);
  recordResponseTime("api/analyze", durationMs);

  return NextResponse.json({
    id: savedId,
    ...(result as object),
    nextSteps,
    _meta: meta,
    _quality: quality.passed ? undefined : { issues: quality.issues },
  });
 } catch (outerErr) {
    // Top-level guard: any unhandled throw (requireUser crash, cookie parsing
    // edge case, checkFeatureAccess null pointer, unexpected undefined in
    // score clamping) surfaces as structured JSON 503 instead of Vercel's bare 503.
    console.error("[/api/analyze] POST unhandled error:", {
      error: outerErr instanceof Error ? outerErr.message : String(outerErr),
      stack: outerErr instanceof Error ? outerErr.stack : undefined,
      hasGroqKey1: !!process.env.GROQ_API_KEY_1,
      hasCerebrasKey: !!process.env.CEREBRAS_API_KEY,
      hasDbUrl: !!process.env.DATABASE_URL,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Analysis service temporarily unavailable. Please try again in 30s.", retryable: true },
      { status: 503, headers: { "Retry-After": "30" } },
    );
  }
}
