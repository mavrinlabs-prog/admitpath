/**
 * Scholarship recommendation engine.
 *
 * Source data is `public/scholarships.json` — an unstructured list with
 * free-text eligibility strings. We don't get structured demographic flags
 * per scholarship, so we keyword-match the eligibility text against the
 * student's profile to produce a 0-100 match score plus reasons.
 *
 * Why keyword-match instead of AI: deterministic, cacheable, free to run
 * on Free tier. Good enough for a recommendation surface; the student
 * still reads the actual eligibility string before applying.
 */

export type ScholarshipRow = {
  name: string;
  amount: string;
  deadline: string;
  eligibility: string;
  renewable: boolean;
  category: string;
  grades: string[];
  url: string;
  description: string;
};

export type StudentSignals = {
  grade: number | null;
  gpa: number | null;
  satScore: number | null;
  intendedMajor: string | null;
  householdIncome: number | null;
  state: string | null;
};

export type Match = {
  scholarship: ScholarshipRow;
  matchScore: number;        // 0-100
  reasons: string[];         // why this matches
  flags: string[];           // why it might not (eg. wrong grade)
  scoreMeaning?: string;
  verificationRequired?: boolean;
  missingProfileData?: string[];
  nextAction?: string;
};

const STEM_MAJORS = /(comput|engineer|math|physics|chem|bio|stat|data|astro|neuro|robot)/i;
const HUMANITIES_MAJORS = /(english|history|philosophy|literature|classic|writing|journal)/i;
const ARTS_MAJORS = /(art|music|theater|dance|film|design|architect)/i;
const BUSINESS_MAJORS = /(business|economic|finance|account|management)/i;

/// Two-letter US state abbreviation → full name. Used to expand a profile
/// state code into both forms when we scan eligibility text — a student
/// who selected "CA" should match "California Boys' State" too.
const STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi",
  MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire",
  NJ: "New Jersey", NM: "New Mexico", NY: "New York", NC: "North Carolina",
  ND: "North Dakota", OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania",
  RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota", TN: "Tennessee",
  TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia", WA: "Washington",
  WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming", DC: "District of Columbia",
};

/**
 * Word-boundary state match against eligibility text. Returns true when
 * the eligibility text contains the student's state code OR full name as
 * a standalone token. Prevents the "CA" → "academic" / "scholarship"
 * false-positive class.
 */
function eligibilityMentionsState(eligLower: string, stateCode: string): boolean {
  const code = stateCode.trim().toUpperCase();
  if (!code) return false;
  // Code must appear as a standalone uppercase or word-bounded token.
  // We test against the original eligibility (mixed case) for the code
  // because lowercase 'ca' is too lossy. Caller passes lowercased
  // string for fullname matching, so we re-derive the original isn't
  // needed — we approximate by requiring word boundaries on both sides.
  const codeRe = new RegExp(`\\b${code}\\b`);
  // Eligibility text in our dataset is sentence-case English; codes
  // appear uppercase. Re-check against the lowercased text using
  // lowercase boundaries (CA → ca with \b) gives the same result.
  if (codeRe.test(eligLower.toUpperCase())) return true;
  const fullName = STATE_NAMES[code];
  if (fullName) {
    const nameRe = new RegExp(`\\b${fullName}\\b`, "i");
    if (nameRe.test(eligLower)) return true;
  }
  return false;
}

function categoryMatchesMajor(category: string, major: string | null): boolean {
  if (!major) return false;
  const cat = category.toLowerCase();
  if (STEM_MAJORS.test(major) && /(stem|science|engineer|math|tech)/i.test(cat)) return true;
  if (HUMANITIES_MAJORS.test(major) && /(humanit|writing|essay)/i.test(cat)) return true;
  if (ARTS_MAJORS.test(major) && /(art|creative)/i.test(cat)) return true;
  if (BUSINESS_MAJORS.test(major) && /(business|entrepren|leader)/i.test(cat)) return true;
  return false;
}

/**
 * Score one scholarship against one student profile.
 *
 * Scoring:
 *   +30 if grade matches scholarship.grades (or scholarship lists no grades)
 *   +25 if category aligns with intended major
 *   +20 if eligibility text suggests low-income AND householdIncome < $80K
 *   +15 if eligibility mentions student's state
 *   +15 if scholarship is renewable (signals high impact)
 *   +10 if eligibility mentions strong-academic / merit AND GPA >= 3.7
 *   +5  if SAT mentioned in eligibility AND satScore >= 1450
 *   -50 hard penalty if grade does not match (still surfaced as "next year" option)
 */
/**
 * Parse a dollar amount string like "$5,000", "$50,000", "Full tuition",
 * "$2,500/year" into a numeric value for comparison.
 */
function parseAwardAmount(amount: string): number {
  if (!amount) return 0;
  if (/full\s+(?:tuition|ride|scholarship)/i.test(amount)) return 50000;
  const match = amount.match(/\$\s*([\d,]+)/);
  if (!match) return 0;
  return parseInt(match[1]!.replace(/,/g, ""), 10);
}

/**
 * Estimate competition level from description/eligibility text.
 * Returns a multiplier: 1.0 = normal, 0.7 = very competitive, 1.3 = less competitive.
 */
function competitionLevel(elig: string, desc: string): { level: string; multiplier: number } {
  const combined = `${elig} ${desc}`.toLowerCase();
  if (/(fewer than \d{2,3} recipients|< ?1%|highly competitive|merit-based.*top|national finalist)/i.test(combined)) {
    return { level: "Very Competitive", multiplier: 0.7 };
  }
  if (/(competitive|selective|limited|merit|honor|top \d)/i.test(combined)) {
    return { level: "Competitive", multiplier: 0.85 };
  }
  if (/(open|all students|no minimum|any student|easy|simple application)/i.test(combined)) {
    return { level: "Open", multiplier: 1.2 };
  }
  return { level: "Moderate", multiplier: 1.0 };
}

function daysUntilRecurringDeadline(deadline: string, now = new Date()): number | null {
  if (!deadline.trim()) return null;
  const hasYear = /\b20\d{2}\b/.test(deadline);
  let date = new Date(deadline);
  if (!hasYear) {
    date = new Date(`${deadline}, ${now.getFullYear()}`);
    if (!Number.isNaN(date.getTime()) && date.getTime() < now.getTime() - 86_400_000) {
      date = new Date(`${deadline}, ${now.getFullYear() + 1}`);
    }
  }
  if (Number.isNaN(date.getTime())) return null;
  return Math.ceil((date.getTime() - now.getTime()) / 86_400_000);
}

export function scoreScholarship(s: ScholarshipRow, p: StudentSignals): Match {
  const reasons: string[] = [];
  const flags: string[] = [];
  let score = 0;

  // Grade gate
  const studentGrade = p.grade?.toString();
  if (s.grades.length === 0) {
    score += 25;
  } else if (studentGrade && s.grades.includes(studentGrade)) {
    score += 25;
    reasons.push(`Open to grade ${studentGrade}`);
  } else {
    score -= 50;
    flags.push(
      `Targets grade${s.grades.length > 1 ? "s" : ""} ${s.grades.join("/")} — you'll be eligible later`,
    );
  }

  if (categoryMatchesMajor(s.category, p.intendedMajor)) {
    score += 22;
    reasons.push(`Aligns with your interest in ${p.intendedMajor}`);
  }

  const elig = (s.eligibility ?? "").toLowerCase();
  const desc = (s.description ?? "").toLowerCase();

  // Income-based matching — tiered thresholds
  if (/(low.income|need.based|first.gen|underserved|underrepresented)/.test(elig)) {
    if (p.householdIncome !== null) {
      if (p.householdIncome < 40000) {
        score += 25;
        reasons.push("Strong income-based fit — well within need-based range");
      } else if (p.householdIncome < 80000) {
        score += 18;
        reasons.push("Income-based fit");
      } else if (p.householdIncome < 120000) {
        score += 8;
        reasons.push("May qualify — check exact income thresholds");
      } else {
        flags.push("Need-based scholarship — your income may exceed the threshold");
      }
    } else {
      score += 5;
      flags.push("Need-based — add household income to confirm fit");
    }
  }

  if (p.state && eligibilityMentionsState(elig, p.state)) {
    score += 15;
    reasons.push(`Open to ${p.state} students`);
  }

  if (s.renewable) {
    score += 12;
    reasons.push("Renewable across all four college years");
  }

  // Merit matching — tiered by GPA fit
  if (/(merit|achieve|academic|honor|gpa|top.\d)/.test(elig)) {
    if (p.gpa !== null) {
      if (p.gpa >= 3.9) {
        score += 12;
        reasons.push("GPA strongly positions you for merit scholarships");
      } else if (p.gpa >= 3.7) {
        score += 8;
        reasons.push("GPA in merit-scholarship range");
      } else if (p.gpa >= 3.5) {
        score += 4;
        reasons.push("GPA near the minimum for most merit scholarships");
      } else {
        flags.push("Merit-based — typical GPA floor is 3.5+");
      }
    }
  }

  // Test score matching — tiered
  if (/(sat|psat|test)/.test(elig)) {
    if (p.satScore !== null) {
      if (p.satScore >= 1500) {
        score += 8;
        reasons.push("Test scores well above typical scholarship bar");
      } else if (p.satScore >= 1400) {
        score += 5;
        reasons.push("Test scores meet typical bar");
      } else if (p.satScore >= 1300) {
        score += 2;
      }
    }
  }

  // Award amount signal — larger awards are more impactful (and more competitive)
  const awardAmount = parseAwardAmount(s.amount);
  if (awardAmount >= 25000) {
    score += 8;
    reasons.push(`Significant award (${s.amount})`);
  } else if (awardAmount >= 10000) {
    score += 5;
    reasons.push(`Meaningful award (${s.amount})`);
  } else if (awardAmount >= 2500) {
    score += 2;
  }

  // Competition level assessment — adjust expectations
  const { level, multiplier } = competitionLevel(elig, desc);
  if (level === "Very Competitive") {
    flags.push("Very competitive — limited recipients, strong application needed");
  } else if (level === "Open") {
    reasons.push("Broad stated eligibility; selection likelihood still depends on the official review process");
  }
  // Apply competition multiplier to the positive portion of the score
  if (score > 0) {
    score = Math.round(score * multiplier);
  }

  // Deadline proximity signal
  if (s.deadline) {
    const daysUntil = daysUntilRecurringDeadline(s.deadline);
    if (daysUntil !== null && daysUntil < 0 && daysUntil > -180) {
      score -= 15;
      flags.push(`Deadline passed (${s.deadline}) — check if it recurs next year`);
    } else if (daysUntil !== null && daysUntil >= 0 && daysUntil <= 14) {
      flags.push(`Deadline in ${daysUntil} days — apply immediately if eligible`);
    } else if (daysUntil !== null && daysUntil >= 0 && daysUntil <= 60) {
      score += 3;
      reasons.push("Upcoming deadline — good time to apply");
    }
  }

  // Clamp to 0-100.
  const clamped = Math.max(0, Math.min(100, score));

  const missingProfileData = [
    p.grade === null ? "grade" : null,
    p.gpa === null ? "GPA" : null,
    p.intendedMajor === null ? "intended major" : null,
    p.householdIncome === null ? "household income" : null,
    p.state === null ? "state" : null,
  ].filter((value): value is string => Boolean(value));

  return {
    scholarship: s,
    matchScore: clamped,
    reasons,
    flags,
    scoreMeaning: "Relevance ranking based on saved profile fields; it is not an eligibility decision or probability of winning.",
    verificationRequired: true,
    missingProfileData,
    nextAction: `Open the official ${s.name} page and verify current eligibility and deadline before preparing an application.`,
  };
}

export function recommendScholarships(
  pool: ScholarshipRow[],
  profile: StudentSignals,
  limit = 12,
): Match[] {
  return pool
    .map((s) => scoreScholarship(s, profile))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}

/* ── Bridge: convert structured Scholarship → ScholarshipRow ────────── */
import type { Scholarship } from "@/data/scholarships-db";

/**
 * Convert the new typed `Scholarship` from `data/scholarships-db.ts` into
 * the `ScholarshipRow` shape consumed by the existing scorer. This lets
 * the authenticated `/scholarships` dashboard page use either data source.
 */
export function toScholarshipRow(s: Scholarship): ScholarshipRow {
  return {
    name: s.name,
    amount: s.amount,
    deadline: s.deadline,
    eligibility: s.eligibility,
    renewable: s.renewability === "renewable",
    category: s.type,
    grades: ["12"], // default to seniors; the structured DB doesn't carry grade arrays
    url: s.url,
    description: s.description,
  };
}

/**
 * Enhanced scoring that uses the structured fields (gpaMin, satMin, states,
 * majors, demographic) from the new `Scholarship` type before falling back
 * to the keyword-based scorer.
 */
export function scoreStructured(s: Scholarship, p: StudentSignals): Match {
  // Start with the keyword-based score on the converted row
  const row = toScholarshipRow(s);
  const base = scoreScholarship(row, p);

  // Layer on structured-field bonuses
  if (s.gpaMin != null && p.gpa != null && p.gpa >= s.gpaMin) {
    base.matchScore = Math.min(100, base.matchScore + 8);
    base.reasons.push(`GPA ${p.gpa} meets ${s.gpaMin} minimum`);
  }

  if (s.satMin != null && p.satScore != null && p.satScore >= s.satMin) {
    base.matchScore = Math.min(100, base.matchScore + 5);
    base.reasons.push(`SAT ${p.satScore} meets ${s.satMin} minimum`);
  }

  // State check via structured array
  if (p.state && s.states && !s.states.includes("all")) {
    if (s.states.includes(p.state)) {
      base.matchScore = Math.min(100, base.matchScore + 10);
      base.reasons.push(`Available in your state (${p.state})`);
    } else {
      base.matchScore = Math.max(0, base.matchScore - 20);
      base.flags.push(`Regional: ${s.states.join(", ")} only`);
    }
  }

  // Demographic match via structured array
  if (s.demographic && s.demographic.length > 0) {
    const eligLower = (s.eligibility ?? "").toLowerCase();
    const profileDemoKeywords: string[] = [];
    if (p.householdIncome !== null && p.householdIncome < 80000) profileDemoKeywords.push("low-income");
    // We can't detect all demographics from StudentSignals alone, but
    // at least the income-based ones are captured.

    const incomeMatch = s.demographic.includes("low-income") && profileDemoKeywords.includes("low-income");
    if (incomeMatch) {
      base.matchScore = Math.min(100, base.matchScore + 5);
    }
  }

  return base;
}

/**
 * Recommend scholarships using the structured database, with enhanced
 * scoring that leverages typed fields.
 */
export function recommendStructured(
  pool: Scholarship[],
  profile: StudentSignals,
  limit = 20,
): Match[] {
  return pool
    .map((s) => scoreStructured(s, profile))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}
