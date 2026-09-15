/**
 * Shared score-to-color mapping for the score ring and dimension bars on the
 * Analyze and Essays pages.
 *
 * Anti-inflation calibration: with tighter scoring across the engine,
 * a score of 85+ is genuinely exceptional (top 10-15% of applicants).
 * The green threshold stays at 80 for the headline ring to reward
 * strong work, but we add a "gold" tier at 92+ to distinguish truly
 * outstanding from merely strong.
 */
export function getScoreColor(score: number): string {
  if (score >= 92) return "#16A34A"; // exceptional — deeper green
  if (score >= 80) return "#22C55E"; // strong
  if (score >= 60) return "#4A6FA5"; // competitive
  if (score >= 40) return "#D97706"; // needs work — amber warning
  return "#EF4444"; // significant weakness
}

/** Stricter threshold for per-dimension bars. With the anti-inflation
 *  scoring changes, 70+ is now legitimately strong (was easy to reach before).
 *  50-69 is "competitive but not differentiating". Below 50 = red flag. */
export function getDimensionColor(score: number): string {
  if (score >= 85) return "#16A34A"; // exceptional
  if (score >= 70) return "#22C55E"; // strong
  if (score >= 50) return "#4A6FA5"; // competitive
  if (score >= 35) return "#D97706"; // below average — amber
  return "#EF4444"; // significant weakness
}

/** Human-readable label for a score, calibrated to anti-inflated scoring. */
export function getScoreLabel(score: number): string {
  if (score >= 92) return "Exceptional";
  if (score >= 80) return "Strong";
  if (score >= 65) return "Competitive";
  if (score >= 50) return "Developing";
  if (score >= 35) return "Needs Work";
  return "Critical Gap";
}

/**
 * Admissions-context label — tells the student what their score means for
 * their target school tier. Calibrated to real admissions data per the
 * Master Prompt's honesty mandate: specific anchors, not vague encouragement.
 */
export function getScoreContext(score: number, dimension: string): string {
  if (score >= 92) return `Top 5-10% of T20 applicants in ${dimension}. This is a genuine differentiator.`;
  if (score >= 80) return `Strong by T20 standards. ${dimension} won't hold you back — focus on weaker dimensions.`;
  if (score >= 65) return `At the median for T20 applicants in ${dimension}. Not a weakness, but not a differentiator either.`;
  if (score >= 50) return `Below the T20 median in ${dimension}. This is actionable — specific improvements here move your overall profile.`;
  if (score >= 35) return `Significant gap in ${dimension}. At most T20s, this would be flagged by a reader. Address this before submitting.`;
  return `Critical weakness in ${dimension}. This dimension alone could take you out of consideration at selective schools.`;
}
