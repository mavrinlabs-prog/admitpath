/**
 * Net Price Predictor utilities
 *
 * Estimates what a family will actually pay at top colleges based on
 * published IPEDS net-price data and institutional aid policies.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type IncomeThreshold = {
  /** Upper bound of this income band (inclusive) */
  max: number;
  /** Estimated net price for families at or below this income */
  netPrice: number;
};

export type SchoolCost = {
  slug: string;
  school: string;
  /** Published cost of attendance (tuition + room & board + fees) */
  sticker: number;
  /** Average net price across all aided students */
  avgNetPrice: number;
  /** Admits without considering ability to pay */
  needBlind: boolean;
  /** Commits to covering 100% of demonstrated financial need */
  meetsFullNeed: boolean;
  /** Replaces loans with grants in aid packages */
  noLoans: boolean;
  /** Sorted ascending by `max` */
  incomeThresholds: IncomeThreshold[];
};

export type EstimatedResult = SchoolCost & {
  /** Estimated net price at the given family income */
  estimated: number;
  /** Sticker minus estimated (total dollar savings) */
  savings: number;
  /** Savings as a percentage of sticker price (0-100) */
  savingsPercent: number;
};

// ---------------------------------------------------------------------------
// Income bands (convenience constants matching common Scorecard NPT4 bands)
// ---------------------------------------------------------------------------

// Updated to match 2024-2025 IPEDS NPT4 bands (College Scorecard).
// Added a 6th band for $150K+ since many families at T20 schools
// are in the $150K-$250K range and still receive meaningful aid.
export const INCOME_BANDS = [
  { label: "$0 - $30K", min: 0, max: 30_000 },
  { label: "$30K - $48K", min: 30_001, max: 48_000 },
  { label: "$48K - $75K", min: 48_001, max: 75_000 },
  { label: "$75K - $110K", min: 75_001, max: 110_000 },
  { label: "$110K - $150K", min: 110_001, max: 150_000 },
  { label: "$150K+", min: 150_001, max: 250_000 },
] as const;

// ---------------------------------------------------------------------------
// Core estimation
// ---------------------------------------------------------------------------

/**
 * Estimate net price for a single school at a given family income.
 *
 * Walks the school's income thresholds in ascending order. If the family
 * income falls BETWEEN two thresholds, linearly interpolates between
 * them (more accurate than step-function). If above all thresholds,
 * interpolates toward the sticker price (capped at $350K income).
 *
 * For schools that meet full need with no-loan policies, net price
 * at low income bands should be $0 or near-$0 — this is validated.
 */
export function estimateNetPrice(school: SchoolCost, income: number): number {
  const thresholds = school.incomeThresholds;
  if (thresholds.length === 0) return school.avgNetPrice;

  // If below the first threshold, return that band's price
  if (income <= thresholds[0]!.max) {
    // Schools meeting full need with no loans: families under $75K
    // typically pay $0-$2,500. If data says otherwise, cap at $2,500.
    if (school.meetsFullNeed && school.noLoans && income <= 75_000) {
      return Math.min(thresholds[0]!.netPrice, 2_500);
    }
    return thresholds[0]!.netPrice;
  }

  // Interpolate between thresholds for smoother estimates
  for (let i = 1; i < thresholds.length; i++) {
    if (income <= thresholds[i]!.max) {
      const prev = thresholds[i - 1]!;
      const curr = thresholds[i]!;
      // Linear interpolation within the band
      const bandWidth = curr.max - prev.max;
      const positionInBand = income - prev.max;
      const ratio = bandWidth > 0 ? positionInBand / bandWidth : 0;
      return Math.round(prev.netPrice + ratio * (curr.netPrice - prev.netPrice));
    }
  }

  // Above all thresholds — interpolate toward sticker price
  const lastThreshold = thresholds[thresholds.length - 1]!;
  const ceiling = 350_000; // Updated: many high-earning families still get some aid

  // For schools that meet full need: the curve is gentler
  // (financial aid extends further up the income scale)
  const stickerTarget = school.meetsFullNeed
    ? school.sticker * 0.92 // meets-full-need schools rarely charge full sticker
    : school.sticker;

  const ratio = Math.min(
    (income - lastThreshold.max) / (ceiling - lastThreshold.max),
    1,
  );
  return Math.round(
    lastThreshold.netPrice + ratio * (stickerTarget - lastThreshold.netPrice),
  );
}

/**
 * Build a full EstimatedResult for a school at the given income.
 */
export function estimateSchool(
  school: SchoolCost,
  income: number,
): EstimatedResult {
  const estimated = estimateNetPrice(school, income);
  const savings = school.sticker - estimated;
  const savingsPercent = Math.round((savings / school.sticker) * 100);
  return { ...school, estimated, savings, savingsPercent };
}

// ---------------------------------------------------------------------------
// Query helpers
// ---------------------------------------------------------------------------

/**
 * Return all schools that commit to meeting 100% of demonstrated need,
 * optionally filtered to need-blind and/or no-loan policies.
 */
export function findFullNeedSchools(
  schools: SchoolCost[],
  options?: { needBlind?: boolean; noLoans?: boolean },
): SchoolCost[] {
  return schools.filter((s) => {
    if (!s.meetsFullNeed) return false;
    if (options?.needBlind && !s.needBlind) return false;
    if (options?.noLoans && !s.noLoans) return false;
    return true;
  });
}

/**
 * Compare net prices across multiple schools for a given income,
 * returning results sorted cheapest-first.
 */
export function compareNetPrices(
  schools: SchoolCost[],
  income: number,
): EstimatedResult[] {
  return schools
    .map((s) => estimateSchool(s, income))
    .sort((a, b) => a.estimated - b.estimated);
}

/**
 * Find schools where the estimated net price is $0 (fully funded)
 * at the given income.
 */
export function findFreeAtIncome(
  schools: SchoolCost[],
  income: number,
): EstimatedResult[] {
  return compareNetPrices(schools, income).filter((r) => r.estimated === 0);
}

/**
 * Return the cheapest N schools for a given income.
 */
export function cheapestSchools(
  schools: SchoolCost[],
  income: number,
  limit = 5,
): EstimatedResult[] {
  return compareNetPrices(schools, income).slice(0, limit);
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

/** Format a number as US currency with no decimals, e.g. "$42,000" */
export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

/**
 * Validate school cost data for internal consistency.
 * Returns an array of warning strings (empty = valid).
 * Used during data import to catch stale IPEDS data.
 */
export function validateSchoolCost(school: SchoolCost): string[] {
  const warnings: string[] = [];

  // Sticker price sanity check (2024-2025: typical range $60K-$95K for private)
  if (school.sticker < 20_000) {
    warnings.push(`Sticker price ${formatCurrency(school.sticker)} seems too low — verify against current IPEDS data`);
  }
  if (school.sticker > 100_000) {
    warnings.push(`Sticker price ${formatCurrency(school.sticker)} seems too high — verify COA breakdown`);
  }

  // Average net price should be less than sticker
  if (school.avgNetPrice >= school.sticker) {
    warnings.push(`Average net price (${formatCurrency(school.avgNetPrice)}) >= sticker (${formatCurrency(school.sticker)}) — data error`);
  }

  // Income thresholds should be ascending
  for (let i = 1; i < school.incomeThresholds.length; i++) {
    const prev = school.incomeThresholds[i - 1]!;
    const curr = school.incomeThresholds[i]!;
    if (curr.max <= prev.max) {
      warnings.push(`Income thresholds not ascending: ${prev.max} >= ${curr.max}`);
    }
    // Net price should generally increase with income (not always, but flag inversions)
    if (curr.netPrice < prev.netPrice * 0.8) {
      warnings.push(`Net price decreases significantly from ${formatCurrency(prev.netPrice)} to ${formatCurrency(curr.netPrice)} — verify data`);
    }
  }

  // Schools claiming full-need + no-loans should have very low net prices at low income
  if (school.meetsFullNeed && school.noLoans && school.incomeThresholds.length > 0) {
    const lowestBand = school.incomeThresholds[0]!;
    if (lowestBand.netPrice > 5_000) {
      warnings.push(`Claims meets-full-need + no-loans but lowest band net price is ${formatCurrency(lowestBand.netPrice)} — expected <$5,000`);
    }
  }

  return warnings;
}

/**
 * Determine the financial aid "generosity tier" of a school.
 * Useful for quick filtering in the UI.
 */
export type GenerosityTier = "Exceptional" | "Strong" | "Average" | "Limited";

export function getGenerosityTier(school: SchoolCost): GenerosityTier {
  if (school.meetsFullNeed && school.noLoans && school.needBlind) return "Exceptional";
  if (school.meetsFullNeed && school.needBlind) return "Strong";
  if (school.meetsFullNeed || (school.avgNetPrice < school.sticker * 0.5)) return "Average";
  return "Limited";
}
