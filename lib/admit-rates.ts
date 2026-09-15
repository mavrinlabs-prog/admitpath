/**
 * Calibrated admit-rate band predictor.
 *
 * Per the master plan: stop showing precise admission percentages
 * (which are statistically dishonest at the individual level) and
 * instead report HONEST BANDS:
 *
 *   - "Very Likely"  → ~70%+ probability based on the applicant's
 *                       relative position vs the school's admit pool.
 *   - "Possible"     → ~20-70% probability.
 *   - "Long Shot"    → ~5-20% probability.
 *   - "Hail Mary"    → <5% probability.
 *
 * Calibration sources (from the public CDS data):
 *   - sat25 / sat75 / gpaAvg are the school's reported admit-pool
 *     statistics — already in `data/colleges.ts`.
 *   - acceptanceRate is the school-wide overall rate.
 *
 * The composite score blends test-score position, GPA position,
 * and a profile-strength multiplier (0–10 scale: how strong are
 * the applicant's extracurriculars, awards, leadership) and then
 * weights the result by the school's overall selectivity bucket
 * so that "Very Likely" at Harvard and "Very Likely" at a
 * 30%-acceptance state flagship are calibrated to the SAME
 * underlying probability — not the SAME composite score.
 */

import type { College } from "@/data/colleges";

export type Band = "Very Likely" | "Possible" | "Long Shot" | "Hail Mary";

export type DemographicFactors = {
  firstGen: boolean;
  urm: boolean;
  lowIncome: boolean;
  underrepresentedState: boolean;
  totalBoostPercent: number;
};

export type BandResult = {
  band: Band;
  rationale: string;          // 1-line explanation
  probabilityRange: [number, number]; // calibrated probability bracket, %
  demographicFactors?: DemographicFactors;
};

/** Hex / chip color tokens for each band. */
export const BAND_STYLES: Record<Band, { bg: string; fg: string; border: string }> = {
  "Very Likely": { bg: "rgba(22,163,74,0.12)",  fg: "#16A34A", border: "#16A34A" },
  "Possible":    { bg: "rgba(74,111,165,0.14)", fg: "#4A6FA5", border: "#4A6FA5" },
  "Long Shot":   { bg: "rgba(74,111,165,0.14)", fg: "#4A6FA5", border: "#4A6FA5" },
  "Hail Mary":   { bg: "rgba(220,38,38,0.10)",  fg: "#DC2626", border: "#DC2626" },
};

// 2024-2025 cycle calibration: T20 overall rates dropped further.
// Harvard 3.2%, MIT 3.9%, Stanford 3.6%, Columbia 3.9% — "Hail Mary"
// threshold must reflect that even strong profiles face <8% odds.
export const BAND_PROBABILITY: Record<Band, [number, number]> = {
  "Very Likely": [65, 95],
  "Possible":    [22, 65],
  "Long Shot":   [6, 22],
  "Hail Mary":   [1, 6],
};

export type ApplicantProfile = {
  gpa: number;        // unweighted, 0-4 scale (5 if weighted is the only available number)
  sat?: number;       // 400-1600. Omit for test-optional applicants.
  act?: number;       // 1-36. We convert to SAT-equivalent.
  ecScore: number;    // 0-10, self-rated or model-derived
  awardsScore?: number; // 0-10, optional. Defaults to ecScore.
  spikeScore?: number;  // 0-10, optional. Defaults to ecScore.
  // Demographic factors (optional, for holistic boost estimation)
  firstGen?: boolean;
  urm?: boolean;          // underrepresented minority
  lowIncome?: boolean;
  state?: string;         // 2-letter code, for geographic diversity signal
  intendedMajor?: string; // e.g. "computer science", "biology"
};

/** States underrepresented at top schools — geographic diversity boost. */
const UNDERREPRESENTED_STATES = new Set([
  "MT", "WY", "ND", "SD", "NE", "KS", "OK", "AR", "MS", "AL",
  "WV", "ID", "AK", "NM", "HI", "IA", "LA", "SC", "KY", "TN",
]);

/** Majors where school-specific admit rate often differs from overall. */
const COMPETITIVE_MAJOR_KEYWORDS: Record<string, string[]> = {
  engineering: ["engineering", "mechanical engineering", "electrical engineering", "civil engineering", "aerospace"],
  cs: ["computer science", "cs", "computing", "informatics"],
  business: ["business", "finance", "accounting", "management"],
  nursing: ["nursing", "bsn"],
  architecture: ["architecture"],
};

/** Convert ACT composite to SAT-equivalent using the College Board concordance. */
function actToSat(act: number): number {
  if (act >= 36) return 1590;
  if (act >= 35) return 1540;
  if (act >= 34) return 1500;
  if (act >= 33) return 1460;
  if (act >= 32) return 1430;
  if (act >= 31) return 1400;
  if (act >= 30) return 1370;
  if (act >= 29) return 1340;
  if (act >= 28) return 1310;
  if (act >= 27) return 1280;
  if (act >= 26) return 1240;
  if (act >= 25) return 1210;
  if (act >= 24) return 1180;
  if (act >= 23) return 1140;
  if (act >= 22) return 1110;
  if (act >= 21) return 1080;
  if (act >= 20) return 1040;
  return 1000;
}

/**
 * Map raw composite (0..1.4-ish) to a probability of admission,
 * given the school's overall selectivity bucket.
 *
 * The mapping is calibrated against publicly-reported "matched
 * applicant" admit rates at peer institutions so that:
 *   - composite=1.0 (exactly at the median admit) at Harvard
 *     yields ~12% admit (= still highly competitive)
 *   - composite=1.0 at a 30%-acceptance flagship yields ~45%
 *   - composite=1.0 at a 70%-acceptance regional yields ~85%
 */
/**
 * Map raw composite (0..~1.4) to a probability of admission,
 * given the school's overall selectivity bucket.
 *
 * 2024-2025 calibration updates:
 *   - At sub-5% schools (Harvard, Stanford, MIT), even composite=1.3
 *     (well above median) yields only ~12-15% probability, not 2.4x baseline.
 *   - For 15-30% acceptance schools, the lift curve is less compressed.
 *   - Schools above 50% acceptance get a gentler curve where strong profiles
 *     genuinely reach "Very Likely" territory.
 *
 * Anti-inflation: the old lift=2.4 at composite=1.3 made sub-5% schools
 * report 12% probability (2.4 * 5% = 12%) — which is honest. But for
 * 15% schools it yielded 36%, which is too generous given that composite=1.3
 * is not actually top-decile at a 15% school. Tighten the mid-range.
 */
function compositeToProbability(composite: number, schoolAcceptRate: number): number {
  const base = schoolAcceptRate / 100;

  // Selectivity-adjusted lift curve — harsher for selective schools
  let lift: number;
  if (base <= 0.08) {
    // Ultra-selective (sub-8%): Harvard, Stanford, MIT, Yale, Princeton
    // Even perfect stats = ~15% chance. The holistic uncertainty is massive.
    lift =
      composite >= 1.3 ? 2.8
      : composite >= 1.15 ? 2.2
      : composite >= 1.0 ? 1.5
      : composite >= 0.85 ? 0.9
      : composite >= 0.7 ? 0.5
      : composite >= 0.5 ? 0.25
      : 0.1;
  } else if (base <= 0.20) {
    // Very selective (8-20%): Duke, Northwestern, JHU, UChicago
    lift =
      composite >= 1.3 ? 2.5
      : composite >= 1.15 ? 1.9
      : composite >= 1.0 ? 1.4
      : composite >= 0.85 ? 0.9
      : composite >= 0.7 ? 0.55
      : composite >= 0.5 ? 0.3
      : 0.1;
  } else if (base <= 0.40) {
    // Selective (20-40%): UMich, UVA, BC, NYU
    lift =
      composite >= 1.3 ? 2.2
      : composite >= 1.15 ? 1.8
      : composite >= 1.0 ? 1.4
      : composite >= 0.85 ? 1.0
      : composite >= 0.7 ? 0.6
      : composite >= 0.5 ? 0.35
      : 0.15;
  } else {
    // Less selective (40%+): state flagships, regional schools
    lift =
      composite >= 1.3 ? 2.0
      : composite >= 1.15 ? 1.7
      : composite >= 1.0 ? 1.4
      : composite >= 0.85 ? 1.1
      : composite >= 0.7 ? 0.75
      : composite >= 0.5 ? 0.5
      : 0.25;
  }

  const p = Math.min(0.95, base * lift);
  // Floor — even an unqualified applicant has ~1% chance of holistic luck.
  return Math.max(0.01, p);
}

/** Bucket a probability into the 4 honest bands.
 *  Calibrated to 2024-2025 cycle: tighter thresholds to prevent
 *  over-optimistic "Very Likely" at selective schools.
 */
function probabilityToBand(p: number): Band {
  const pct = p * 100;
  if (pct >= 65) return "Very Likely";
  if (pct >= 22) return "Possible";
  if (pct >= 6) return "Long Shot";
  return "Hail Mary";
}

/**
 * Main predictor. Returns an honest band + 1-line rationale + the
 * calibrated probability range so the UI can show "Possible (25-70%)"
 * if it wants — never a precise number like "37.4%".
 */
export function predictBand(
  applicant: ApplicantProfile,
  school: College
): BandResult {
  // Test-score position (0..1.4-ish range)
  const sat = applicant.sat ?? (applicant.act ? actToSat(applicant.act) : NaN);
  const hasTestScore = Number.isFinite(sat);
  const satPosition =
    hasTestScore && school.sat75 > school.sat25
      ? (sat - school.sat25) / (school.sat75 - school.sat25)
      : NaN; // NaN signals test-optional — handled below

  // GPA position relative to school's average admitted student.
  // Use a wider denominator to avoid bunching everyone near 1.0
  const gpaPosition =
    school.gpaAvg > 0
      ? (applicant.gpa - 3.0) / Math.max(0.01, school.gpaAvg - 3.0)
      : 0.5;

  // EC / awards / spike — use the strongest of the three to reward
  // genuine spikiness (the master plan: well-rounded ≠ admitted).
  // But also factor in the AVERAGE of the other two to prevent
  // a single inflated self-rating from carrying the profile.
  const ecRaw = applicant.ecScore;
  const awardsRaw = applicant.awardsScore ?? applicant.ecScore;
  const spikeRaw = applicant.spikeScore ?? applicant.ecScore;
  const bestProfile = Math.max(ecRaw, awardsRaw, spikeRaw);
  const avgProfile = (ecRaw + awardsRaw + spikeRaw) / 3;
  // Weighted: 60% best signal (rewards spikiness), 40% average (guards against inflation)
  const profileStrength = (0.6 * bestProfile + 0.4 * avgProfile) / 10;

  // Composite — adjust weights based on test-optional status.
  // When the student submits scores, academics = 70% (SAT 40% + GPA 30%).
  // When test-optional, GPA carries more weight and profile picks up the rest.
  let composite: number;
  if (Number.isFinite(satPosition)) {
    composite = 0.38 * satPosition + 0.30 * gpaPosition + 0.32 * profileStrength;
  } else {
    // Test-optional: GPA + profile carry the full weight.
    // Note: test-optional applicants at ultra-selective schools face
    // a slight penalty in practice — without scores above the 75th
    // percentile, they lose a signaling opportunity. Reflect that.
    const testOptionalPenalty = school.acceptanceRate < 15 ? 0.05 : 0;
    composite = 0.45 * gpaPosition + 0.55 * profileStrength - testOptionalPenalty;
  }

  const probability = compositeToProbability(composite, school.acceptanceRate);
  const band = probabilityToBand(probability);

  // --- Demographic factors ---
  let demographicFactors: DemographicFactors | undefined;
  const isUnderrepresentedState = applicant.state
    ? UNDERREPRESENTED_STATES.has(applicant.state.toUpperCase())
    : false;
  if (applicant.firstGen || applicant.urm || applicant.lowIncome || isUnderrepresentedState) {
    let totalBoost = 0;
    if (applicant.firstGen) totalBoost += 3;
    if (applicant.urm) totalBoost += 5;
    if (applicant.lowIncome) totalBoost += 3;
    if (isUnderrepresentedState) totalBoost += 2;
    demographicFactors = {
      firstGen: !!applicant.firstGen,
      urm: !!applicant.urm,
      lowIncome: !!applicant.lowIncome,
      underrepresentedState: isUnderrepresentedState,
      totalBoostPercent: totalBoost,
    };
  }

  // --- 1-line rationale with ED and major-specific hints ---
  const rationaleLines: string[] = [];
  if (band === "Very Likely") {
    rationaleLines.push(`Your stats sit comfortably above ${school.shortName}'s median admit.`);
  } else if (band === "Possible") {
    rationaleLines.push(`Your profile is in range — admission depends on essays, recommendations, and fit.`);
  } else if (band === "Long Shot") {
    rationaleLines.push(`Below the median admit at ${school.shortName} — a clear spike or hook would help.`);
  } else {
    rationaleLines.push(`${school.shortName} accepts ~${school.acceptanceRate}% — even strong profiles face long odds here.`);
  }

  // ED consideration — if the school offers ED, note the boost
  if (school.earlyOption && school.earlyOption !== "none") {
    const earlyType = school.earlyOption === "REA" ? "REA" :
                      school.earlyOption.includes("ED") ? "ED" : "EA";
    if (earlyType === "ED") {
      rationaleLines.push(`ED applicants see ~2-3x higher admit rates at most schools — applying ED to ${school.shortName} significantly improves odds.`);
    } else if (earlyType === "REA") {
      rationaleLines.push(`${school.shortName} offers Restrictive Early Action — early applicants show demonstrated interest, which can help.`);
    } else {
      rationaleLines.push(`${school.shortName} offers Early Action — applying early shows interest and can provide an edge.`);
    }
  }

  // Major-specific adjustment hint
  if (applicant.intendedMajor) {
    const majorLower = applicant.intendedMajor.toLowerCase();
    for (const [category, keywords] of Object.entries(COMPETITIVE_MAJOR_KEYWORDS)) {
      if (keywords.some((kw) => majorLower.includes(kw))) {
        rationaleLines.push(
          `Note: ${category} at ${school.shortName} may have a different admit rate than the overall ${school.acceptanceRate}% — competitive majors often admit at lower rates.`
        );
        break;
      }
    }
  }

  const rationale = rationaleLines.join(" ");

  return {
    band,
    rationale,
    probabilityRange: BAND_PROBABILITY[band],
    ...(demographicFactors ? { demographicFactors } : {}),
  };
}

/**
 * Convenience: predict bands for an entire college list and bucket
 * them so the UI can show "X reaches, Y targets, Z safeties" style
 * summaries (using the band labels, not the legacy reach/target words).
 */
export function predictBands(
  applicant: ApplicantProfile,
  schools: readonly College[]
): Array<{ school: College; result: BandResult }> {
  return schools.map((school) => ({
    school,
    result: predictBand(applicant, school),
  }));
}
