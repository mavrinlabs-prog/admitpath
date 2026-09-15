/**
 * Competition recommender.
 *
 * Source: `public/competitions.json` — 55 academic competitions across
 * STEM, humanities, business, arts. Free-text eligibility means we have
 * to keyword-match (same approach as scholarship-matcher).
 *
 * Scoring favors competitions whose category aligns with the student's
 * intended major, with bonus weight for prestige indicators in the
 * description (Regeneron, Intel, ISEF, USAMO, etc).
 */

export type CompetitionRow = {
  name: string;
  url: string;
  deadline: string;
  category: string;
  eligibility: string;
  prize: string;
  description: string;
};

export type CompetitionSignals = {
  grade: number | null;
  intendedMajor: string | null;
  // Optional: rough strength signal so prestige competitions don't get
  // matched to weak profiles. Pass false to disable the strength filter.
  gpa: number | null;
};

export type CompetitionMatch = {
  competition: CompetitionRow;
  matchScore: number;
  reasons: string[];
  flags: string[];
  /** Division-level admissions value context, if available for this competition. */
  admissionsContext?: string;
};

const STEM_RE = /(comput|engineer|math|physics|chem|bio|stat|data|astro|neuro|robot)/i;
const HUMANITIES_RE = /(english|history|literature|philosophy|writing|journal|poet)/i;
const ARTS_RE = /(art|music|theater|dance|film|design)/i;
const BUSINESS_RE = /(business|economic|finance|account|management|entrepren)/i;
const POLICY_RE = /(political|policy|government|international|relation)/i;

const CATEGORY_RULES: Array<{ majorRe: RegExp; categoryRe: RegExp }> = [
  { majorRe: STEM_RE, categoryRe: /(comput|technolog|cyber|robot|engineer|math|physic|biolog|chem|stem|science|research)/i },
  { majorRe: HUMANITIES_RE, categoryRe: /(humanit|writing|literature|history|speech|debate)/i },
  { majorRe: ARTS_RE, categoryRe: /(art|writing|speech|communicat)/i },
  { majorRe: BUSINESS_RE, categoryRe: /(business|finance|entrepren|leader|innovat)/i },
  { majorRe: POLICY_RE, categoryRe: /(global|civic|government|diploma|policy|debate|speech)/i },
];

function categoryAlignsWithMajor(category: string, major: string | null): boolean {
  if (!major) return false;
  for (const r of CATEGORY_RULES) {
    if (r.majorRe.test(major) && r.categoryRe.test(category)) return true;
  }
  return false;
}

// Heuristic prestige signal — surfaces in description text. Used to flag
// competitions that need a strong profile to be realistic.
//
// Word boundaries are load-bearing: without them `prom` matches
// "promote / promotion / promising", `ross` matches "across / crossfit",
// `imo` matches "important". Real false-positives observed against the
// actual competitions JSON.
const PRESTIGE_RE = /\b(regeneron|intel|isef|usamo|imo|davidson|usaco|ymsc|ross|prom|nationals|national championship)\b|google science fair/i;

/** Tier classification for admissions impact. */
const TIER_1_RE = /\b(regeneron|intel|isef|usamo|imo|davidson|usaco|google science fair|ymsc)\b/i;
const TIER_2_RE = /\b(amc|aime|mathcounts|science olympiad|debate nationals|deca internationals?|fbla nationals?|mock trial nationals?|model un|national merit|presidential scholar|coca.cola scholar|siemens|mit think|rsi|clark scholar|usabo|usapho|usnco|picoctf|cyberpatriot|congressional app|scholastic art|youngarts|hmmt|concord review|john locke)\b/i;
const TIER_3_RE = /\b(state champion|state finalist|regional winner|honorable mention|national qualifier|semi.?finalist|conrad challenge|diamond challenge)\b/i;

/**
 * Division-level admissions value for competitions with progression tracks.
 * Sourced from training data pipeline analysis of competition outcomes at T20 schools.
 * Used to provide more nuanced admissions context in match reasons.
 */
const DIVISION_CONTEXT: Record<string, string> = {
  "usaco": "USACO admissions value by division: Platinum = top ~200 CS students in the country (equivalent to USAMO for math, flagship signal for MIT/Stanford/CMU CS). Gold = very strong signal, valued at MIT, Stanford, CMU, Berkeley, Cornell, UIUC. Silver = good signal for T30-T50 CS programs. Bronze = foundation-building, minimal direct admissions impact.",
  "usabo": "USABO: Semifinalist (top ~500) = national recognition, strong for pre-med and biology programs at T20s. Finalist (top 20) = elite signal, comparable to USAMO for biology-focused applicants.",
  "usapho": "USAPhO: Semifinalist (top ~400 from ~10,000) = strong STEM signal. Top 20 attend Physics camp. Finalist = among the strongest physics credentials possible for high school students.",
  "amc": "AMC/AIME track: AMC 10/12 Distinguished Honor Roll = solid math foundation. AIME qualifier = above average. USAMO qualifier = elite (top ~250 in the country).",
  "science olympiad": "Science Olympiad: Regional medalist = good school-level activity. State medalist = strong. National qualifier = competitive for T20 STEM programs. National medalist = elite signal.",
};

export function scoreCompetition(
  c: CompetitionRow,
  s: CompetitionSignals,
): CompetitionMatch {
  const reasons: string[] = [];
  const flags: string[] = [];
  // Anti-inflation: base at 40 (not 50). A 90+ match should mean
  // "this competition is highly relevant to your spike AND you're
  // realistically competitive for it."
  let score = 40;

  // Category alignment — the core matching signal
  if (categoryAlignsWithMajor(c.category, s.intendedMajor)) {
    score += 25;
    reasons.push(`Aligns with ${s.intendedMajor}`);
  }

  // Cross-disciplinary bonus: if the competition bridges two fields
  // (e.g., "Science + Policy" for a STEM student interested in policy)
  const descLower = (c.description ?? "").toLowerCase();
  const catLower = c.category.toLowerCase();
  const isCrossDisciplinary =
    (STEM_RE.test(s.intendedMajor ?? "") && POLICY_RE.test(catLower)) ||
    (HUMANITIES_RE.test(s.intendedMajor ?? "") && STEM_RE.test(catLower)) ||
    (BUSINESS_RE.test(s.intendedMajor ?? "") && STEM_RE.test(catLower));
  if (isCrossDisciplinary) {
    score += 8;
    reasons.push("Cross-disciplinary — strengthens interdisciplinary narrative");
  }

  // Eligibility text scan — most competitions allow grades 9-12; the few
  // that gate by grade typically say so explicitly.
  const elig = (c.eligibility ?? "").toLowerCase();
  if (s.grade !== null) {
    const gradeStr = s.grade.toString();
    const rangeMatch = elig.match(/\bgrades?\s+(\d+)\s*[-–]\s*(\d+)\b/);
    const inRange =
      !!rangeMatch &&
      s.grade >= parseInt(rangeMatch[1]!, 10) &&
      s.grade <= parseInt(rangeMatch[2]!, 10);
    const gradeMentioned =
      new RegExp(`\\b${gradeStr}(th|st|nd|rd)\\b`).test(elig) ||
      new RegExp(`\\bgrades?\\s+${gradeStr}\\b`).test(elig) ||
      inRange;
    if (gradeMentioned) score += 5;

    const seniorOnly =
      /\b(seniors?|grade 12|12th)\b/.test(elig) &&
      !/\b(9|10|11)(th|st|nd|rd)\b|\bsophomores?\b|\bjuniors?\b|\ball grades?\b/.test(elig);
    if (s.grade < 12 && seniorOnly) {
      score -= 25;
      flags.push("Senior-only — eligible later");
    }

    // Timeline flag: competitions with early-year deadlines that the student
    // may have already missed this cycle
    if (c.deadline) {
      const deadlineDate = new Date(c.deadline);
      const now = new Date();
      const daysUntilDeadline = Math.round((deadlineDate.getTime() - now.getTime()) / 86400000);
      if (daysUntilDeadline < 0 && daysUntilDeadline > -180) {
        score -= 10;
        flags.push(`Deadline passed (${c.deadline}) — plan for next cycle`);
      } else if (daysUntilDeadline >= 0 && daysUntilDeadline <= 30) {
        score += 5;
        reasons.push(`Deadline soon (${c.deadline}) — apply now`);
      } else if (daysUntilDeadline > 30 && daysUntilDeadline <= 120) {
        score += 3;
        reasons.push("Upcoming deadline — good time to prepare");
      }
    }
  }

  // Prize-size signal: tiered by amount for better discrimination
  const prize = c.prize ?? "";
  const prizeMatch = prize.match(/\$\s*([\d,]+)/);
  const prizeAmount = prizeMatch ? parseInt(prizeMatch[1]!.replace(/,/g, ""), 10) : 0;
  if (prizeAmount >= 100000 || /full scholar/i.test(prize)) {
    score += 12;
    reasons.push("Exceptional prize ($100K+ or full scholarship)");
  } else if (prizeAmount >= 25000) {
    score += 10;
    reasons.push("Major prize ($25K+)");
  } else if (prizeAmount >= 5000) {
    score += 6;
    reasons.push("Significant prize ($5K+)");
  } else if (prizeAmount >= 1000) {
    score += 3;
  }

  // Tiered prestige assessment — determines admissions impact level
  const nameAndDesc = `${c.name ?? ""} ${c.description ?? ""}`;
  if (TIER_1_RE.test(nameAndDesc)) {
    // Tier 1: National/international prestige — a top 4 activity for T20 apps
    if (s.gpa !== null && s.gpa < 3.5) {
      flags.push("Tier-1 prestige — most finalists have 3.9+ GPA and years of preparation");
      score -= 5;
    } else if (s.gpa !== null && s.gpa < 3.8) {
      flags.push("Tier-1 prestige — competitive but your GPA is below the typical finalist range (3.9+)");
      score += 5;
    } else {
      reasons.push("Tier-1 prestige competition — winning/placing is a major admissions differentiator");
      score += 10;
    }
  } else if (TIER_2_RE.test(nameAndDesc)) {
    // Tier 2: Nationally recognized — strong signal in context
    if (s.gpa !== null && s.gpa < 3.5) {
      flags.push("Competitive — most participants have strong academic profiles");
    } else {
      reasons.push("Nationally recognized competition — strong activity for applications");
      score += 7;
    }
  } else if (TIER_3_RE.test(nameAndDesc)) {
    // Tier 3: State/regional level — good but not decisive
    reasons.push("State/regional level — valuable especially with strong placement");
    score += 3;
  }

  // Attach division-level admissions context if available
  const nameLower = (c.name ?? "").toLowerCase();
  let admissionsContext: string | undefined;
  for (const [key, ctx] of Object.entries(DIVISION_CONTEXT)) {
    if (nameLower.includes(key) || (c.description ?? "").toLowerCase().includes(key)) {
      admissionsContext = ctx;
      break;
    }
  }

  return {
    competition: c,
    matchScore: Math.max(0, Math.min(100, score)),
    reasons,
    flags,
    ...(admissionsContext ? { admissionsContext } : {}),
  };
}

export function recommendCompetitions(
  pool: CompetitionRow[],
  signals: CompetitionSignals,
  limit = 12,
): CompetitionMatch[] {
  return pool
    .map((c) => scoreCompetition(c, signals))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}
