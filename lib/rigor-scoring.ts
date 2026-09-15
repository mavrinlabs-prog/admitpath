/**
 * Context-aware course rigor scoring.
 *
 * The generic "took 6 APs" scoring punishes students at schools that
 * only offer 4 APs and rewards students at schools that offer 30 — both
 * unfair. Real admissions readers grade rigor RELATIVE to what the
 * school offers (this is what "Most Rigorous" means on the secondary
 * school report).
 *
 * Inputs:
 *   - `courses` — freeform textarea from the analyze form
 *   - `schoolContext.apsOffered` — number of APs the school offers
 *     (default 12; we look this up from a small map below)
 *   - `grade` — current grade level, used to scale expectations
 *
 * Output:
 *   - `score` 0-100 calibrated to admissions rigor scoring
 *   - `apCount` / `ibCount` / `dualEnrollCount` / `honorsCount`
 *   - `hardestCourses` — the most signal-rich course names found
 *   - `rationale` — a 1-line explanation the user can read
 *
 * The detection is regex-based — no LLM call required.
 */

const AP_PATTERNS = [
  /\bAP\s+([A-Za-z][A-Za-z\s&:]+?)(?=,|;|\.|\n|\(|$)/g,
  /\bAdvanced Placement\s+([A-Za-z][A-Za-z\s&:]+?)(?=,|;|\.|\n|\(|$)/g,
  // Catch "AP-" prefix style: "AP-Calculus"
  /\bAP[-–]([A-Za-z][A-Za-z\s&:]+?)(?=,|;|\.|\n|\(|$)/g,
];
const IB_PATTERNS = [
  /\bIB\s+(HL|SL)?\s*([A-Za-z][A-Za-z\s&]+?)(?=,|;|\.|\n|\(|$)/g,
  /\bInternational Baccalaureate\b/gi,
  // Catch "IB Diploma" / "full IB"
  /\bIB\s+Diploma\b/gi,
  /\bfull\s+IB\b/gi,
];
const HONORS_PATTERNS = [
  /\bHonors?\s+([A-Za-z][A-Za-z\s&]+?)(?=,|;|\.|\n|\(|$)/g,
  // Catch "Pre-AP" courses (honors-equivalent at many schools)
  /\bPre-AP\s+([A-Za-z][A-Za-z\s&]+?)(?=,|;|\.|\n|\(|$)/g,
  // Catch "Accelerated" prefix used by some districts
  /\bAccelerated\s+([A-Za-z][A-Za-z\s&]+?)(?=,|;|\.|\n|\(|$)/g,
];
const DUAL_PATTERNS = [
  /\b(?:Dual\s+Enroll(?:ment)?|DE\s)\b/gi,
  /\b(?:College in High School|Concurrent Enrollment)\b/gi,
  /\bcollege\s+credit\b/gi,
  /\buniversity\s+course\b/gi,
  // Additional patterns for dual enrollment variants
  /\bcommunity\s+college\s+course\b/gi,
  /\bCC\s+course\b/gi,
  /\bearly\s+college\b/gi,
  /\bRunning Start\b/gi, // Washington state dual enrollment
  /\bPost Secondary Enrollment Options?\b/gi, // Ohio PSEO
  /\bPSEO\b/g,
];
const COLLEGE_COURSE_RE = /\b(?:CS|MATH|PHYS|CHEM|BIO|ECON|ENGL|HIST|PSYC|SOC|PHIL|POLS|STAT|ENGR|CMSC)\s?\d{3,4}\b/g;

/** Hard STEM courses that signal top rigor even without AP label. */
const HARD_STEM_COURSES = [
  /\b(?:multivariable|multi[-\s]variable)\s+calculus\b/i,
  /\blinear\s+algebra\b/i,
  /\bdifferential\s+equations\b/i,
  /\borganic\s+chemistry\b/i,
  /\breal\s+analysis\b/i,
  /\babstract\s+algebra\b/i,
  /\bnumber\s+theory\b/i,
  /\bcalc(?:ulus)?\s+(?:BC|III|3|AB)\b/i,
  /\bAP\s+Research\b/i,
  /\bAP\s+Seminar\b/i,
];

/** Course progression sequences — detecting increasing rigor over time. */
const PROGRESSION_CHAINS: string[][] = [
  ["algebra", "geometry", "precalculus", "calculus", "ap calc", "ap calculus"],
  ["biology", "honors biology", "ap biology"],
  ["chemistry", "honors chemistry", "ap chemistry"],
  ["physics", "honors physics", "ap physics"],
  ["spanish 1", "spanish 2", "spanish 3", "ap spanish"],
  ["french 1", "french 2", "french 3", "ap french"],
  ["us history", "ap us history", "ap world history"],
  ["english", "honors english", "ap english", "ap literature", "ap language"],
  ["computer science", "ap computer science", "ap cs"],
  ["statistics", "ap statistics"],
];

export type SchoolContext = {
  /** APs offered by the student's high school. ~12 is the national mean. */
  apsOffered?: number;
  /** True if the school offers IB. */
  ibProgram?: boolean;
  /** True if dual enrollment is available. */
  dualEnroll?: boolean;
};

export type RigorResult = {
  score: number;
  apCount: number;
  ibCount: number;
  honorsCount: number;
  dualCount: number;
  collegeCourseCount: number;
  hardestCourses: string[];
  rationale: string;
  progressionBonus: boolean;
  gpaRigorCoherence: number | null; // weighted-unweighted gap signal
};

function dedupeMatches(text: string, patterns: RegExp[]): string[] {
  const matches = new Set<string>();
  for (const re of patterns) {
    re.lastIndex = 0;
    for (const m of Array.from(text.matchAll(re))) {
      const captured = (m[1] ?? m[0]).trim();
      if (captured.length > 1 && captured.length < 60) {
        matches.add(captured.replace(/\s+/g, " "));
      }
    }
  }
  return Array.from(matches);
}

export function scoreRigor(
  profile: { courses: string; grade?: string; gpa?: number; weightedGpa?: number },
  context: SchoolContext = {}
): RigorResult {
  const text = profile.courses ?? "";
  const grade = profile.grade ?? "11";

  const apMatches = dedupeMatches(text, AP_PATTERNS);
  const ibMatches = dedupeMatches(text, IB_PATTERNS);
  const honorsMatches = dedupeMatches(text, HONORS_PATTERNS);
  const dualMatches = dedupeMatches(text, DUAL_PATTERNS);
  const collegeCourseMatches = (text.match(COLLEGE_COURSE_RE) ?? []);

  const apCount = apMatches.length;
  const ibCount = ibMatches.length;
  const honorsCount = honorsMatches.length;
  const dualCount = dualMatches.length + collegeCourseMatches.length;
  const collegeCourseCount = collegeCourseMatches.length;

  const apsOffered = context.apsOffered ?? 12;
  // Saturated AP intake — what fraction of available APs the student took.
  // (capped at 1.0; some kids self-study extra)
  const apSaturation = apsOffered > 0 ? Math.min(1, apCount / apsOffered) : 0;

  // Expected AP count by grade — soph 0-1, junior 3-5, senior 5-8.
  const gradeNum = parseInt(grade, 10) || 11;
  const expectedAPsByGrade = gradeNum >= 12 ? 6 : gradeNum >= 11 ? 4 : gradeNum >= 10 ? 1 : 0;

  // Hard STEM course detection (beyond AP label)
  const hardStemCount = HARD_STEM_COURSES.reduce(
    (acc, re) => acc + (re.test(text) ? 1 : 0), 0
  );

  // IB Diploma detection — full IB is significantly more rigorous than cherry-picked IB courses
  const fullIBDiploma = /\bIB\s+Diploma\b/i.test(text) || /\bfull\s+IB\b/i.test(text);

  // Composite (0..100):
  //   Anti-inflation: grade-adjusted base. Most students claiming "rigor"
  //   are in the 40-65 range. 85+ should mean "Most Rigorous" on the
  //   school report — a designation only ~15% of applicants at T20s receive.
  //   Grade-sensitive base creates spread: freshmen start at 20, seniors at 40.
  //   - grade-scaled base points (20-40)
  //   - +35 from AP saturation (the BIG signal)
  //   - +15 from "above expected for grade" multiplier
  //   - IB / dual enrollment / honors are bonuses
  const gradeBase = gradeNum >= 12 ? 40 : gradeNum >= 11 ? 35 : gradeNum >= 10 ? 28 : 20;
  let score = gradeBase;
  score += Math.round(35 * apSaturation);
  if (apCount > expectedAPsByGrade) {
    score += Math.min(18, 5 * (apCount - expectedAPsByGrade));
  }
  if (ibCount > 0) score += 8;
  // Full IB Diploma is a massive rigor signal — equivalent to 8+ APs
  if (fullIBDiploma) score += 15;

  // Dual enrollment weighted 1.2x vs AP — signals college-level readiness
  if (dualCount > 0) score += Math.min(10, Math.round(2.4 * dualCount));

  // Honors bonus — scaled by whether APs are available
  if (honorsCount > 0) {
    if (apCount === 0) {
      // No APs: honors-only pathway — proportional bonus
      const honorsBonus = honorsCount >= 5
        ? Math.min(15, 3 * honorsCount)  // proportional bonus for heavy honors load
        : Math.min(10, 2 * honorsCount);
      score += honorsBonus;
    } else {
      // Has APs + honors = rounding out rigor across subjects
      score += Math.min(6, honorsCount);
    }
  }

  // Penalty: claimed lots of APs at a school that only offers a few — likely
  // overstating ("AP Calc" mentioned but school offers no calc track).
  if (apsOffered > 0 && apCount > apsOffered * 1.2) {
    score -= 8; // mild — could also indicate self-study
  }

  // Penalty: nothing rigorous at all by junior year.
  if (gradeNum >= 11 && apCount === 0 && ibCount === 0 && dualCount === 0 && honorsCount === 0) {
    score -= 20;
  }

  // Course progression detection — shows increasing rigor over time
  const lowerText = text.toLowerCase();
  let progressionBonus = false;
  for (const chain of PROGRESSION_CHAINS) {
    let matchCount = 0;
    for (const step of chain) {
      if (lowerText.includes(step)) matchCount++;
    }
    // At least 3 steps in a progression chain = deliberate ramp-up
    if (matchCount >= 3) {
      progressionBonus = true;
      break;
    }
  }
  if (progressionBonus) score += 8;

  // Hard STEM bonus — courses like multivariable calc, linear algebra show
  // post-AP rigor that T20 admits typically have
  if (hardStemCount > 0) score += Math.min(12, hardStemCount * 5);

  // GPA-rigor coherence — large weighted-unweighted gap signals heavy AP load
  let gpaRigorCoherence: number | null = null;
  if (profile.gpa != null && profile.weightedGpa != null && profile.gpa > 0) {
    const gap = profile.weightedGpa - profile.gpa;
    gpaRigorCoherence = Math.round(gap * 100) / 100;
    // A gap >= 0.5 means heavy AP/honors weighting (e.g., 3.2 UW / 4.1 W = 0.9 gap)
    if (gap >= 0.8) {
      score += 8; // very heavy AP load reflected in transcript
    } else if (gap >= 0.5) {
      score += 5; // moderate AP load
    }
    // If gap is tiny (< 0.2) but claims lots of APs, something's off
    if (gap < 0.2 && apCount >= 4) {
      score -= 3; // mild inconsistency
    }
  }

  // --- EDGE CASE HANDLING ---

  // International student detection: A-Levels, CBSE, IGCSE equivalents
  const intlCurriculum =
    /\bA[-\s]?Level\b/i.test(text) ||
    /\bIGCSE\b/i.test(text) ||
    /\bCBSE\b/i.test(text) ||
    /\bICSE\b/i.test(text) ||
    /\bAbitur\b/i.test(text) ||
    /\bBaccalaur[eé]at\b/i.test(text) ||
    /\bGaokao\b/i.test(text) ||
    /\bJEE\b/i.test(text) ||
    /\bKonkur\b/i.test(text);
  if (intlCurriculum && apCount === 0 && ibCount === 0) {
    // Don't penalize international students for not taking APs —
    // their national curriculum may be equally or more rigorous.
    // Restore to at least a baseline neutral score.
    score = Math.max(score, 55);
  }

  // Homeschool detection: self-directed rigor is harder to measure
  const isHomeschool = /\bhome\s*school/i.test(text) || /\bhome\s*educated/i.test(text);
  if (isHomeschool && dualCount >= 2) {
    // Homeschoolers who take dual enrollment courses show initiative
    score += 5;
  }

  score = Math.max(0, Math.min(100, score));

  // Hardest-courses surface — surface the top APs / college courses by name.
  const hardestCourses: string[] = [];
  if (apMatches.length > 0) {
    hardestCourses.push(...apMatches.slice(0, 3).map((c) => `AP ${c}`));
  }
  if (collegeCourseMatches.length > 0) {
    hardestCourses.push(...collegeCourseMatches.slice(0, 2));
  }
  if (ibMatches.length > 0) {
    hardestCourses.push(...ibMatches.slice(0, 2).map((c) => `IB ${c}`));
  }

  // Rationale — single line tied to the calibration call.
  let rationale: string;
  if (score >= 88) {
    rationale = `Exceptional rigor: ${apCount} AP${apCount === 1 ? "" : "s"} taken vs ~${apsOffered} offered — this reads as "Most Rigorous" on the school report. Top 10-15% of T20 applicant pools.`;
  } else if (score >= 75) {
    rationale = `Strong rigor: ${apCount} AP${apCount === 1 ? "" : "s"} shows commitment. To reach "Most Rigorous" (the designation that moves the needle at T20s), aim for ${Math.max(expectedAPsByGrade + 2, apCount + 2)}+ by graduation.`;
  } else if (score >= 58) {
    rationale = `Moderate rigor for grade ${gradeNum}. The median T20 admit takes ${expectedAPsByGrade + 2}-${expectedAPsByGrade + 4} APs — you're below that bar. Prioritize the hardest courses available.`;
  } else if (score >= 40) {
    rationale = `Below-average rigor. Most competitive applicants in your grade have ${expectedAPsByGrade}+ APs by now. If your school offers more, this is the biggest gap to close.`;
  } else {
    rationale = `No meaningful rigor signal detected. Without AP/IB/Honors/Dual Enrollment, T20-T50 schools will flag this as a disqualifying weakness.`;
  }

  return {
    score,
    apCount,
    ibCount,
    honorsCount,
    dualCount,
    collegeCourseCount,
    hardestCourses,
    rationale,
    progressionBonus,
    gpaRigorCoherence,
  };
}
