import { NextResponse } from "next/server";
import { prisma, withRetry } from "@/lib/prisma";
import { checkFeatureAccess, accessDenialResponse } from "@/lib/trial";
import { requireUser } from "@/lib/api-helpers";
import { COLLEGES, type College } from "@/data/colleges";
import {
  getCdsWeights,
  computeWeightedScore,
  DIMENSION_LABEL,
  type CdsDimension,
  type DimensionScores,
} from "@/lib/cds-weights";
import { predictBand, type ApplicantProfile, BAND_PROBABILITY } from "@/lib/admit-rates";

/**
 * College Fit endpoint — returns weighted comparison data for the user's
 * saved profile + latest analysis scores against their target schools.
 *
 * Unlike /api/analyze which includes college fit inline, this endpoint:
 *   1. Works from STORED analysis scores (no new LLM call)
 *   2. Can be called cheaply on the colleges page for real-time fit cards
 *   3. Uses the full CDS C7 weights database
 *
 * Does NOT consume any trial quota (no LLM call).
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
      c.shortName.toLowerCase().includes(q),
  );
}

export async function GET(req: Request) {
  try {
  const authed = await requireUser();
  if ("response" in authed) return authed.response;
  const { userId, user } = authed;

  // No trial quota consumed — this reads stored data only.
  // But we still check basic feature access for auth gate.
  const access = checkFeatureAccess(user, "colleges", 0);
  if (!access.allowed) {
    const { status, body } = accessDenialResponse(access);
    return NextResponse.json(body, { status });
  }

  // Load profile + latest analysis in parallel.
  // withRetry handles Neon cold-start so the page doesn't 503 on first load.
  let profile, latestAnalysis;
  try {
    [profile, latestAnalysis] = await Promise.all([
      withRetry(() =>
        prisma.profile.findFirst({
          where: { userId, deletedAt: null },
          select: {
            gpa: true,
            weightedGpa: true,
            satScore: true,
            actScore: true,
            grade: true,
            activities: true,
            awards: true,
            targetColleges: true,
            intendedMajor: true,
          },
        }),
      ),
      withRetry(() =>
        prisma.analysis.findFirst({
          where: { userId, type: "admission", deletedAt: null },
          orderBy: { createdAt: "desc" },
          select: { result: true, createdAt: true },
        }),
      ),
    ]);
  } catch (dbErr) {
    console.error("[/api/college-fit] DB fetch failed:", {
      error: dbErr instanceof Error ? dbErr.message : String(dbErr),
      hasDbUrl: !!process.env.DATABASE_URL,
      userId,
    });
    return NextResponse.json(
      { error: "Service temporarily unavailable. Please try again in a moment.", retryable: true },
      { status: 503, headers: { "Retry-After": "10" } },
    );
  }

  if (!profile) {
    return NextResponse.json(
      { error: "Please complete your profile first.", redirect: "/profile/create" },
      { status: 400 },
    );
  }

  // Extract dimension scores from latest analysis
  let dimScores: DimensionScores = {
    academicRigor: 50,
    leadership: 50,
    awards: 50,
    activityDepth: 50,
    spike: 50,
    essayQuality: 50,
    recommendations: 50,
  };

  if (latestAnalysis?.result && typeof latestAnalysis.result === "object") {
    const r = latestAnalysis.result as Record<string, unknown>;
    const scores = r.scores as Record<string, number> | undefined;
    if (scores) {
      dimScores = {
        academicRigor: scores.academicRigor ?? 50,
        leadership: scores.leadership ?? 50,
        awards: scores.awards ?? 50,
        activityDepth: scores.activityDepth ?? 50,
        spike: scores.spike ?? 50,
        essayQuality: scores.essayQuality ?? 50,
        recommendations: scores.recommendations ?? 50,
      };
    }
  }

  // Build applicant profile for band prediction
  const activities = Array.isArray(profile.activities) ? profile.activities as Array<{ name?: string; role?: string }> : [];
  const awards = Array.isArray(profile.awards) ? profile.awards as string[] : [];

  const activityCount = activities.length;
  const hasLeadership = activities.some((a) =>
    /\b(president|founder|captain|editor|director|chair)\b/i.test((a as { role?: string }).role ?? ""),
  );
  const awardCount = awards.length;
  const hasNational = awards.some((a) =>
    /\b(national|USAMO|ISEF|Intel|Regeneron|Siemens|RSI|USACO|IMO|IPhO|IOI)\b/i.test(String(a)),
  );

  const ecScore = Math.min(10, Math.round(
    (activityCount >= 5 ? 3 : activityCount >= 3 ? 2 : 1) +
    (hasLeadership ? 2 : 0) +
    (awardCount >= 3 ? 2 : awardCount >= 1 ? 1 : 0) +
    (hasNational ? 3 : 0),
  ));

  const applicantProfile: ApplicantProfile = {
    gpa: profile.gpa ?? 3.0,
    sat: profile.satScore ?? undefined,
    act: profile.actScore ?? undefined,
    ecScore,
    awardsScore: Math.min(10, awardCount >= 5 ? 7 : awardCount >= 3 ? 5 : awardCount >= 1 ? 3 : 1),
    spikeScore: hasNational ? Math.min(10, ecScore + 2) : ecScore,
  };

  // Parse target colleges from profile
  const targets = Array.isArray(profile.targetColleges) ? profile.targetColleges as string[] : [];

  // Also check URL query for specific school to fit-check
  const url = new URL(req.url);
  const querySchool = url.searchParams.get("school");
  if (querySchool && !targets.includes(querySchool)) {
    targets.push(querySchool);
  }

  const genericAvg = Math.round(Object.values(dimScores).reduce((s, v) => s + v, 0) / 7);

  const fits = targets
    .map((label) => {
      const college = matchCollege(label);
      if (!college) return { school: label, matched: false as const };

      const weights = getCdsWeights(college.slug);
      const { score: weightedScore } = computeWeightedScore(dimScores, college.slug);
      const band = predictBand(applicantProfile, college);
      const delta = weightedScore - genericAvg;

      // Find strong/weak alignment with CDS priorities
      const strongPoints = (Object.keys(weights) as CdsDimension[])
        .filter((dim) => weights[dim] >= 3 && dimScores[dim] >= 75)
        .map((dim) => DIMENSION_LABEL[dim]);

      const weakPoints = (Object.keys(weights) as CdsDimension[])
        .filter((dim) => weights[dim] >= 3 && dimScores[dim] < 60)
        .map((dim) => DIMENSION_LABEL[dim]);

      return {
        school: college.shortName,
        slug: college.slug,
        matched: true as const,
        acceptanceRate: college.acceptanceRate,
        satRange: `${college.sat25}-${college.sat75}`,
        gpaAvg: college.gpaAvg,
        weightedScore,
        genericScore: genericAvg,
        delta,
        band: band.band,
        bandRange: BAND_PROBABILITY[band.band],
        bandRationale: band.rationale,
        tier: band.band === "Very Likely"
          ? "likely"
          : band.band === "Possible"
            ? "target"
            : "reach",
        strongMatchDimensions: strongPoints,
        weakMatchDimensions: weakPoints,
        evidenceUsed: [
          `Saved GPA: ${profile.gpa ?? "not provided"}`,
          `Saved testing: ${profile.satScore ? `SAT ${profile.satScore}` : profile.actScore ? `ACT ${profile.actScore}` : "not provided"}`,
          `Latest dimension scores: ${Object.entries(dimScores).map(([dimension, value]) => `${dimension} ${value}`).join(", ")}`,
          `Catalog reference: ${college.shortName} acceptance rate ${college.acceptanceRate}%, SAT ${college.sat25}-${college.sat75}, average GPA ${college.gpaAvg}`,
        ],
        interpretation: `The ${weightedScore}/100 weighted fit score compares the saved dimension scores with the catalog's CDS-factor weights. It is not an admission probability or decision.`,
        missingData: [
          !latestAnalysis ? "a completed profile analysis" : null,
          profile.gpa === null ? "GPA" : null,
          profile.satScore === null && profile.actScore === null ? "SAT or ACT, if the student plans to submit testing" : null,
          activityCount === 0 ? "activities" : null,
        ].filter((value): value is string => Boolean(value)),
        priorityAction: weakPoints.length
          ? `Review the evidence behind ${weakPoints[0]} first and add a verified result or missing context before revisiting this fit estimate.`
          : `Verify ${college.shortName}'s current requirements and connect the strongest documented dimension to a current program or priority.`,
        lotteryDisclaimer: college.acceptanceRate < 15
          ? `${college.shortName} admits ~${college.acceptanceRate}% of applicants. Even well-qualified candidates face lottery dynamics.`
          : undefined,
      };
    })
    .filter(Boolean);

  return NextResponse.json({
    fits,
    dimScores,
    genericAverage: genericAvg,
    analysisDate: latestAnalysis?.createdAt ?? null,
    hasAnalysis: !!latestAnalysis,
    outcomeDisclaimer: "College recommendations and fit bands are planning estimates based on saved profile data and catalog references. They do not guarantee or predict admission.",
    dataFreshness: "Verify current testing policy, deadlines, costs, and programs on each college's official website.",
  });
  } catch (outerErr) {
    // Top-level guard: prevents bare 500/503 from unhandled throws.
    console.error("[/api/college-fit] unhandled error:", {
      error: outerErr instanceof Error ? outerErr.message : String(outerErr),
      stack: outerErr instanceof Error ? outerErr.stack : undefined,
      hasDbUrl: !!process.env.DATABASE_URL,
    });
    return NextResponse.json(
      { error: "College fit service temporarily unavailable. Please try again in a moment.", retryable: true },
      { status: 503, headers: { "Retry-After": "15" } },
    );
  }
}
