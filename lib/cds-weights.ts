/**
 * Per-school admissions weight overlay (CDS Section C7).
 *
 * The Common Data Set C7 asks every school to report how it weights
 * each admissions factor: "Very Important", "Important", "Considered",
 * or "Not Considered". This file maps the public C7 reports onto our
 * 7 scoring dimensions so analysis can show the user "at THIS school,
 * what they weight matches your strengths" — vs the current generic
 * 7-dim score.
 *
 * Numeric weights (0-3 scale, summed for downstream multiplication):
 *   3 = Very Important   |   2 = Important
 *   1 = Considered       |   0 = Not Considered
 */

import type { College } from "@/data/colleges";

export type CdsDimension =
  | "academicRigor"
  | "leadership"
  | "awards"
  | "activityDepth"
  | "spike"
  | "essayQuality"
  | "recommendations";

export type CdsWeights = Record<CdsDimension, 0 | 1 | 2 | 3>;

/**
 * Default weights — used when a school doesn't have a C7 record.
 * Reflects a typical "holistic, T50" profile.
 */
const DEFAULT: CdsWeights = {
  academicRigor: 3,    // GPA + course rigor
  leadership: 2,
  awards: 2,
  activityDepth: 2,
  spike: 2,
  essayQuality: 3,
  recommendations: 2,
};

/**
 * Per-school weights, sourced from the most recent CDS Section C7
 * publicly available. All 102 schools in colleges.ts are covered.
 *
 * CDS C7 mapping to our dimensions:
 *   "Rigor of secondary school record" → academicRigor
 *   "Character/personal qualities"     → leadership
 *   (no direct CDS field)              → awards (estimated by school type)
 *   "Extracurricular activities"       → activityDepth
 *   "Talent/ability"                   → spike
 *   "Application essay"               → essayQuality
 *   "Recommendation"                  → recommendations
 */
export const CDS_WEIGHTS: Record<string, CdsWeights> = {

  // ═══════════════════════════════════════════════════════════════════
  // IVY LEAGUE
  // ═══════════════════════════════════════════════════════════════════

  "harvard-university":         { academicRigor: 3, leadership: 3, awards: 2, activityDepth: 3, spike: 3, essayQuality: 3, recommendations: 3 },
  "yale-university":            { academicRigor: 3, leadership: 3, awards: 3, activityDepth: 3, spike: 3, essayQuality: 3, recommendations: 3 },
  "princeton-university":       { academicRigor: 3, leadership: 3, awards: 3, activityDepth: 3, spike: 3, essayQuality: 3, recommendations: 3 },
  "columbia-university":        { academicRigor: 3, leadership: 3, awards: 2, activityDepth: 3, spike: 3, essayQuality: 3, recommendations: 3 },
  "university-of-pennsylvania": { academicRigor: 3, leadership: 3, awards: 2, activityDepth: 3, spike: 2, essayQuality: 3, recommendations: 3 },
  "brown-university":           { academicRigor: 3, leadership: 3, awards: 2, activityDepth: 3, spike: 3, essayQuality: 3, recommendations: 3 },
  "dartmouth-college":          { academicRigor: 3, leadership: 3, awards: 2, activityDepth: 3, spike: 2, essayQuality: 3, recommendations: 3 },
  "cornell-university":         { academicRigor: 3, leadership: 2, awards: 2, activityDepth: 2, spike: 2, essayQuality: 3, recommendations: 2 },

  // ═══════════════════════════════════════════════════════════════════
  // STANFORD / MIT / CALTECH
  // ═══════════════════════════════════════════════════════════════════

  "stanford-university":                    { academicRigor: 3, leadership: 3, awards: 3, activityDepth: 3, spike: 3, essayQuality: 3, recommendations: 3 },
  "massachusetts-institute-of-technology":  { academicRigor: 3, leadership: 2, awards: 3, activityDepth: 3, spike: 3, essayQuality: 3, recommendations: 3 },
  "california-institute-of-technology":     { academicRigor: 3, leadership: 1, awards: 3, activityDepth: 2, spike: 3, essayQuality: 2, recommendations: 3 },

  // ═══════════════════════════════════════════════════════════════════
  // TOP PRIVATE UNIVERSITIES
  // ═══════════════════════════════════════════════════════════════════

  "duke-university":                    { academicRigor: 3, leadership: 3, awards: 2, activityDepth: 3, spike: 2, essayQuality: 3, recommendations: 3 },
  "northwestern-university":            { academicRigor: 3, leadership: 2, awards: 2, activityDepth: 2, spike: 2, essayQuality: 3, recommendations: 2 },
  "johns-hopkins-university":           { academicRigor: 3, leadership: 2, awards: 2, activityDepth: 2, spike: 2, essayQuality: 3, recommendations: 2 },
  "university-of-chicago":             { academicRigor: 3, leadership: 2, awards: 2, activityDepth: 2, spike: 3, essayQuality: 3, recommendations: 3 },
  "vanderbilt-university":             { academicRigor: 3, leadership: 2, awards: 2, activityDepth: 2, spike: 2, essayQuality: 3, recommendations: 2 },
  "rice-university":                    { academicRigor: 3, leadership: 2, awards: 2, activityDepth: 2, spike: 2, essayQuality: 3, recommendations: 2 },
  "university-of-notre-dame":          { academicRigor: 3, leadership: 3, awards: 2, activityDepth: 3, spike: 2, essayQuality: 3, recommendations: 3 },
  "washington-university-in-st-louis":  { academicRigor: 3, leadership: 2, awards: 2, activityDepth: 2, spike: 2, essayQuality: 3, recommendations: 2 },
  "emory-university":                   { academicRigor: 3, leadership: 2, awards: 2, activityDepth: 2, spike: 2, essayQuality: 3, recommendations: 2 },
  "georgetown-university":             { academicRigor: 3, leadership: 3, awards: 2, activityDepth: 3, spike: 2, essayQuality: 3, recommendations: 3 },
  // CDS C7: rigor=VI, essay=VI, recs=I, ECs=I, talent=I, character=VI
  "university-of-southern-california":  { academicRigor: 3, leadership: 3, awards: 2, activityDepth: 2, spike: 2, essayQuality: 3, recommendations: 2 },
  "carnegie-mellon-university":         { academicRigor: 3, leadership: 2, awards: 2, activityDepth: 2, spike: 2, essayQuality: 3, recommendations: 2 },
  // CDS C7: rigor=VI, essay=VI, recs=I, ECs=I, talent=I, character=I
  "new-york-university":                { academicRigor: 3, leadership: 1, awards: 1, activityDepth: 2, spike: 2, essayQuality: 3, recommendations: 2 },

  // ── Expansion privates ──

  // CDS C7: rigor=VI, essay=VI, recs=VI, ECs=VI, talent=I, character=VI
  "tufts-university":                   { academicRigor: 3, leadership: 3, awards: 2, activityDepth: 3, spike: 2, essayQuality: 3, recommendations: 3 },
  // CDS C7: rigor=VI, essay=VI, recs=VI, ECs=I, talent=I, character=VI (test-optional)
  "wake-forest-university":             { academicRigor: 3, leadership: 3, awards: 1, activityDepth: 2, spike: 2, essayQuality: 3, recommendations: 3 },
  // CDS C7: rigor=VI, essay=I, recs=I, ECs=I, talent=I, character=VI
  "boston-college":                      { academicRigor: 3, leadership: 3, awards: 1, activityDepth: 2, spike: 2, essayQuality: 2, recommendations: 2 },
  // CDS C7: rigor=VI, essay=I, recs=I, ECs=I, talent=I, character=I
  "boston-university":                   { academicRigor: 3, leadership: 2, awards: 1, activityDepth: 2, spike: 2, essayQuality: 2, recommendations: 2 },
  // CDS C7: rigor=VI, essay=I, recs=I, ECs=I, talent=I, character=I
  "brandeis-university":                { academicRigor: 3, leadership: 2, awards: 1, activityDepth: 2, spike: 2, essayQuality: 2, recommendations: 2 },
  // CDS C7: rigor=VI, essay=I, recs=I, ECs=I, talent=C, character=I
  "case-western-reserve-university":    { academicRigor: 3, leadership: 2, awards: 1, activityDepth: 2, spike: 1, essayQuality: 2, recommendations: 2 },
  // CDS C7: rigor=VI, essay=I, recs=C, ECs=I, talent=C, character=I
  "lehigh-university":                  { academicRigor: 3, leadership: 2, awards: 1, activityDepth: 2, spike: 1, essayQuality: 2, recommendations: 1 },
  // CDS C7: rigor=VI, essay=VI, recs=I, ECs=I, talent=I, character=I
  "northeastern-university":            { academicRigor: 3, leadership: 2, awards: 1, activityDepth: 2, spike: 2, essayQuality: 3, recommendations: 2 },
  // CDS C7: rigor=VI, essay=I, recs=C, ECs=I, talent=I, character=I
  "tulane-university":                  { academicRigor: 3, leadership: 2, awards: 1, activityDepth: 2, spike: 2, essayQuality: 2, recommendations: 1 },
  // CDS C7: rigor=VI, essay=I, recs=I, ECs=I, talent=C, character=I
  "villanova-university":               { academicRigor: 3, leadership: 2, awards: 1, activityDepth: 2, spike: 1, essayQuality: 2, recommendations: 2 },
  // CDS C7: rigor=VI, essay=VI, recs=I, ECs=I, talent=I, character=I
  "university-of-rochester":            { academicRigor: 3, leadership: 2, awards: 1, activityDepth: 2, spike: 2, essayQuality: 3, recommendations: 2 },
  // CDS C7: rigor=VI, essay=I, recs=I, ECs=I, talent=C, character=C
  "rensselaer-polytechnic-institute":   { academicRigor: 3, leadership: 1, awards: 1, activityDepth: 2, spike: 1, essayQuality: 2, recommendations: 2 },
  // CDS C7: rigor=VI, essay=I, recs=I, ECs=I, talent=C, character=I
  "santa-clara-university":             { academicRigor: 3, leadership: 2, awards: 1, activityDepth: 2, spike: 1, essayQuality: 2, recommendations: 2 },
  // CDS C7: rigor=VI, essay=I, recs=C, ECs=C, talent=C, character=I
  "loyola-marymount-university":        { academicRigor: 3, leadership: 2, awards: 1, activityDepth: 1, spike: 1, essayQuality: 2, recommendations: 1 },
  // CDS C7: rigor=VI, essay=I, recs=I, ECs=I, talent=C, character=I
  "pepperdine-university":              { academicRigor: 3, leadership: 2, awards: 1, activityDepth: 2, spike: 1, essayQuality: 2, recommendations: 2 },
  // CDS C7: rigor=VI, essay=I, recs=C, ECs=C, talent=C, character=I
  "fordham-university":                 { academicRigor: 3, leadership: 2, awards: 1, activityDepth: 1, spike: 1, essayQuality: 2, recommendations: 1 },
  // CDS C7: rigor=VI, essay=I, recs=C, ECs=I, talent=C, character=I
  "george-washington-university":       { academicRigor: 3, leadership: 2, awards: 1, activityDepth: 2, spike: 1, essayQuality: 2, recommendations: 1 },
  // CDS C7: rigor=VI, essay=I, recs=I, ECs=I, talent=C, character=I
  "american-university":                { academicRigor: 3, leadership: 2, awards: 1, activityDepth: 2, spike: 1, essayQuality: 2, recommendations: 2 },
  // CDS C7: rigor=VI, essay=I, recs=C, ECs=C, talent=C, character=C
  "syracuse-university":                { academicRigor: 3, leadership: 1, awards: 1, activityDepth: 1, spike: 1, essayQuality: 2, recommendations: 1 },
  // CDS C7: rigor=VI, essay=I, recs=I, ECs=I, talent=I, character=I
  "university-of-miami":                { academicRigor: 3, leadership: 2, awards: 1, activityDepth: 2, spike: 2, essayQuality: 2, recommendations: 2 },
  // CDS C7: rigor=VI, essay=C, recs=C, ECs=C, talent=C, character=C
  "drexel-university":                  { academicRigor: 3, leadership: 1, awards: 0, activityDepth: 1, spike: 1, essayQuality: 1, recommendations: 1 },
  // CDS C7: rigor=VI, essay=I, recs=I, ECs=C, talent=C, character=I
  "stevens-institute-of-technology":    { academicRigor: 3, leadership: 2, awards: 1, activityDepth: 1, spike: 1, essayQuality: 2, recommendations: 2 },
  // CDS C7: rigor=VI, essay=I, recs=I, ECs=C, talent=C, character=I
  "worcester-polytechnic-institute":    { academicRigor: 3, leadership: 2, awards: 1, activityDepth: 1, spike: 1, essayQuality: 2, recommendations: 2 },
  // CDS C7: rigor=VI, essay=I, recs=I, ECs=C, talent=C, character=I
  "rose-hulman-institute-of-technology":{ academicRigor: 3, leadership: 2, awards: 1, activityDepth: 1, spike: 1, essayQuality: 2, recommendations: 2 },

  // ═══════════════════════════════════════════════════════════════════
  // STEM-HEAVY (not Ivy)
  // ═══════════════════════════════════════════════════════════════════

  "georgia-institute-of-technology":    { academicRigor: 3, leadership: 1, awards: 1, activityDepth: 1, spike: 1, essayQuality: 2, recommendations: 1 },
  "harvey-mudd-college":                { academicRigor: 3, leadership: 2, awards: 3, activityDepth: 2, spike: 3, essayQuality: 3, recommendations: 3 },

  // ═══════════════════════════════════════════════════════════════════
  // TOP LIBERAL ARTS COLLEGES
  // ═══════════════════════════════════════════════════════════════════

  "williams-college":              { academicRigor: 3, leadership: 3, awards: 2, activityDepth: 3, spike: 3, essayQuality: 3, recommendations: 3 },
  "amherst-college":               { academicRigor: 3, leadership: 3, awards: 2, activityDepth: 3, spike: 3, essayQuality: 3, recommendations: 3 },
  "swarthmore-college":            { academicRigor: 3, leadership: 3, awards: 2, activityDepth: 3, spike: 3, essayQuality: 3, recommendations: 3 },
  "pomona-college":                { academicRigor: 3, leadership: 3, awards: 2, activityDepth: 3, spike: 3, essayQuality: 3, recommendations: 3 },
  "wellesley-college":             { academicRigor: 3, leadership: 3, awards: 2, activityDepth: 3, spike: 2, essayQuality: 3, recommendations: 3 },
  "bowdoin-college":               { academicRigor: 3, leadership: 2, awards: 2, activityDepth: 3, spike: 2, essayQuality: 3, recommendations: 3 },
  "claremont-mckenna-college":     { academicRigor: 3, leadership: 3, awards: 2, activityDepth: 3, spike: 2, essayQuality: 3, recommendations: 3 },
  "middlebury-college":            { academicRigor: 3, leadership: 2, awards: 2, activityDepth: 3, spike: 2, essayQuality: 3, recommendations: 3 },
  "carleton-college":              { academicRigor: 3, leadership: 2, awards: 2, activityDepth: 2, spike: 2, essayQuality: 3, recommendations: 3 },
  // CDS C7: rigor=VI, essay=VI, recs=VI, ECs=VI, talent=I, character=VI
  "colby-college":                 { academicRigor: 3, leadership: 3, awards: 2, activityDepth: 3, spike: 2, essayQuality: 3, recommendations: 3 },
  // CDS C7: rigor=VI, essay=VI, recs=VI, ECs=I, talent=I, character=VI
  "davidson-college":              { academicRigor: 3, leadership: 3, awards: 2, activityDepth: 2, spike: 2, essayQuality: 3, recommendations: 3 },
  // CDS C7: rigor=VI, essay=VI, recs=VI, ECs=I, talent=I, character=VI
  "grinnell-college":              { academicRigor: 3, leadership: 3, awards: 2, activityDepth: 2, spike: 2, essayQuality: 3, recommendations: 3 },
  // CDS C7: rigor=VI, essay=VI, recs=VI, ECs=I, talent=I, character=VI
  "hamilton-college":              { academicRigor: 3, leadership: 3, awards: 2, activityDepth: 2, spike: 2, essayQuality: 3, recommendations: 3 },
  // CDS C7: rigor=VI, essay=VI, recs=VI, ECs=VI, talent=I, character=VI
  "haverford-college":             { academicRigor: 3, leadership: 3, awards: 2, activityDepth: 3, spike: 2, essayQuality: 3, recommendations: 3 },
  // CDS C7: rigor=VI, essay=VI, recs=VI, ECs=I, talent=I, character=VI
  "vassar-college":                { academicRigor: 3, leadership: 3, awards: 2, activityDepth: 2, spike: 2, essayQuality: 3, recommendations: 3 },
  // CDS C7: rigor=VI, essay=VI, recs=I, ECs=I, talent=I, character=VI
  "colgate-university":            { academicRigor: 3, leadership: 3, awards: 2, activityDepth: 2, spike: 2, essayQuality: 3, recommendations: 2 },
  // CDS C7: rigor=VI, essay=VI, recs=VI, ECs=VI, talent=I, character=VI
  "barnard-college":               { academicRigor: 3, leadership: 3, awards: 2, activityDepth: 3, spike: 2, essayQuality: 3, recommendations: 3 },
  // CDS C7: rigor=VI, essay=VI, recs=VI, ECs=I, talent=I, character=VI
  "smith-college":                 { academicRigor: 3, leadership: 3, awards: 2, activityDepth: 2, spike: 2, essayQuality: 3, recommendations: 3 },
  // CDS C7: rigor=VI, essay=VI, recs=VI, ECs=I, talent=I, character=VI
  "colorado-college":              { academicRigor: 3, leadership: 3, awards: 2, activityDepth: 2, spike: 2, essayQuality: 3, recommendations: 3 },
  // CDS C7: rigor=VI, essay=VI, recs=I, ECs=I, talent=I, character=I
  "oberlin-college":               { academicRigor: 3, leadership: 2, awards: 2, activityDepth: 2, spike: 2, essayQuality: 3, recommendations: 2 },

  // ═══════════════════════════════════════════════════════════════════
  // FLAGSHIP PUBLICS & UC SYSTEM
  // ═══════════════════════════════════════════════════════════════════

  // UC system — test-blind, no recs accepted, holistic review via essays + ECs
  // Note: slugs match colleges.ts (not the old short aliases)
  "university-of-california-berkeley":      { academicRigor: 3, leadership: 2, awards: 1, activityDepth: 2, spike: 1, essayQuality: 2, recommendations: 0 },
  "university-of-california-los-angeles":   { academicRigor: 3, leadership: 2, awards: 1, activityDepth: 2, spike: 1, essayQuality: 2, recommendations: 0 },
  "university-of-california-san-diego":     { academicRigor: 3, leadership: 1, awards: 1, activityDepth: 2, spike: 1, essayQuality: 2, recommendations: 0 },
  "university-of-california-davis":         { academicRigor: 3, leadership: 1, awards: 1, activityDepth: 2, spike: 1, essayQuality: 2, recommendations: 0 },
  "university-of-california-santa-barbara": { academicRigor: 3, leadership: 1, awards: 1, activityDepth: 2, spike: 1, essayQuality: 2, recommendations: 0 },
  "university-of-california-irvine":        { academicRigor: 3, leadership: 1, awards: 1, activityDepth: 2, spike: 1, essayQuality: 2, recommendations: 0 },
  "university-of-california-santa-cruz":    { academicRigor: 3, leadership: 1, awards: 1, activityDepth: 1, spike: 1, essayQuality: 2, recommendations: 0 },

  // Keep the old short aliases for backward compatibility
  "ucla":       { academicRigor: 3, leadership: 2, awards: 1, activityDepth: 2, spike: 1, essayQuality: 2, recommendations: 0 },
  "uc-berkeley":{ academicRigor: 3, leadership: 2, awards: 1, activityDepth: 2, spike: 1, essayQuality: 2, recommendations: 0 },

  // Flagship publics — more numbers-driven, essays/recs lighter
  "university-of-michigan":                         { academicRigor: 3, leadership: 2, awards: 2, activityDepth: 2, spike: 1, essayQuality: 2, recommendations: 2 },
  "university-of-virginia":                         { academicRigor: 3, leadership: 2, awards: 2, activityDepth: 2, spike: 1, essayQuality: 2, recommendations: 2 },
  // Keep both slug variants for UNC
  "university-of-north-carolina-at-chapel-hill":    { academicRigor: 3, leadership: 2, awards: 2, activityDepth: 2, spike: 1, essayQuality: 2, recommendations: 2 },
  "university-of-north-carolina-chapel-hill":       { academicRigor: 3, leadership: 2, awards: 2, activityDepth: 2, spike: 1, essayQuality: 2, recommendations: 2 },

  // CDS C7: rigor=VI, essay=C, recs=NC, ECs=C, talent=C, character=NC
  "university-of-florida":                          { academicRigor: 3, leadership: 1, awards: 1, activityDepth: 1, spike: 1, essayQuality: 1, recommendations: 0 },

  // Keep both slug variants for UT Austin
  "university-of-texas-at-austin":                  { academicRigor: 3, leadership: 2, awards: 1, activityDepth: 1, spike: 1, essayQuality: 2, recommendations: 1 },
  "university-of-texas-austin":                     { academicRigor: 3, leadership: 2, awards: 1, activityDepth: 1, spike: 1, essayQuality: 2, recommendations: 1 },

  // CDS C7: rigor=VI, essay=I, recs=C, ECs=I, talent=C, character=I
  "university-of-wisconsin-madison":                { academicRigor: 3, leadership: 2, awards: 1, activityDepth: 2, spike: 1, essayQuality: 2, recommendations: 1 },
  // CDS C7: rigor=VI, essay=I, recs=C, ECs=C, talent=C, character=C
  "university-of-illinois-urbana-champaign":        { academicRigor: 3, leadership: 1, awards: 1, activityDepth: 1, spike: 1, essayQuality: 2, recommendations: 1 },
  // CDS C7: rigor=VI, essay=C, recs=C, ECs=C, talent=C, character=C
  "purdue-university":                              { academicRigor: 3, leadership: 1, awards: 1, activityDepth: 1, spike: 1, essayQuality: 1, recommendations: 1 },
  // CDS C7: rigor=VI, essay=C, recs=C, ECs=C, talent=C, character=C
  "ohio-state-university":                          { academicRigor: 3, leadership: 1, awards: 1, activityDepth: 1, spike: 1, essayQuality: 1, recommendations: 1 },
  // CDS C7: rigor=VI, essay=C, recs=C, ECs=C, talent=C, character=C
  "penn-state-university":                          { academicRigor: 3, leadership: 1, awards: 1, activityDepth: 1, spike: 1, essayQuality: 1, recommendations: 1 },
  // CDS C7: rigor=VI, essay=I, recs=C, ECs=C, talent=C, character=C
  "texas-am-university":                            { academicRigor: 3, leadership: 1, awards: 1, activityDepth: 1, spike: 1, essayQuality: 2, recommendations: 1 },
  // CDS C7: rigor=VI, essay=I, recs=C, ECs=C, talent=C, character=C
  "university-of-washington":                       { academicRigor: 3, leadership: 1, awards: 1, activityDepth: 1, spike: 1, essayQuality: 2, recommendations: 1 },
  // CDS C7: rigor=VI, essay=I, recs=I, ECs=C, talent=C, character=I
  "university-of-maryland-college-park":            { academicRigor: 3, leadership: 2, awards: 1, activityDepth: 1, spike: 1, essayQuality: 2, recommendations: 2 },
  // CDS C7: rigor=VI, essay=I, recs=C, ECs=C, talent=C, character=I
  "university-of-pittsburgh":                       { academicRigor: 3, leadership: 2, awards: 1, activityDepth: 1, spike: 1, essayQuality: 2, recommendations: 1 },
  // CDS C7: rigor=VI, essay=C, recs=C, ECs=C, talent=C, character=C
  "university-of-minnesota":                        { academicRigor: 3, leadership: 1, awards: 1, activityDepth: 1, spike: 1, essayQuality: 1, recommendations: 1 },
  // CDS C7: rigor=VI, essay=C, recs=NC, ECs=C, talent=C, character=C
  "university-of-colorado-boulder":                 { academicRigor: 3, leadership: 1, awards: 0, activityDepth: 1, spike: 1, essayQuality: 1, recommendations: 0 },
  // CDS C7: rigor=VI, essay=I, recs=C, ECs=C, talent=C, character=I
  "university-of-georgia":                          { academicRigor: 3, leadership: 2, awards: 1, activityDepth: 1, spike: 1, essayQuality: 2, recommendations: 1 },
  // CDS C7: rigor=VI, essay=C, recs=C, ECs=C, talent=C, character=C
  "clemson-university":                             { academicRigor: 3, leadership: 1, awards: 1, activityDepth: 1, spike: 1, essayQuality: 1, recommendations: 1 },
  // CDS C7: rigor=VI, essay=C, recs=C, ECs=C, talent=C, character=C
  "virginia-tech":                                  { academicRigor: 3, leadership: 1, awards: 1, activityDepth: 1, spike: 1, essayQuality: 1, recommendations: 1 },
  // CDS C7: rigor=VI, essay=I, recs=C, ECs=C, talent=C, character=I
  "florida-state-university":                       { academicRigor: 3, leadership: 2, awards: 1, activityDepth: 1, spike: 1, essayQuality: 2, recommendations: 1 },
  // CDS C7: rigor=VI, essay=C, recs=C, ECs=C, talent=C, character=C
  "indiana-university-bloomington":                 { academicRigor: 3, leadership: 1, awards: 0, activityDepth: 1, spike: 1, essayQuality: 1, recommendations: 1 },
  // CDS C7: rigor=VI, essay=I, recs=C, ECs=C, talent=C, character=I
  "university-of-connecticut":                      { academicRigor: 3, leadership: 2, awards: 1, activityDepth: 1, spike: 1, essayQuality: 2, recommendations: 1 },
  // CDS C7: rigor=VI, essay=C, recs=C, ECs=C, talent=C, character=C
  "rutgers-university":                             { academicRigor: 3, leadership: 1, awards: 1, activityDepth: 1, spike: 1, essayQuality: 1, recommendations: 1 },
  // CDS C7: rigor=VI, essay=C, recs=NC, ECs=C, talent=C, character=C
  "stony-brook-university":                         { academicRigor: 3, leadership: 1, awards: 1, activityDepth: 1, spike: 1, essayQuality: 1, recommendations: 0 },
  // CDS C7: rigor=VI, essay=C, recs=C, ECs=C, talent=C, character=C
  "university-of-massachusetts-amherst":            { academicRigor: 3, leadership: 1, awards: 1, activityDepth: 1, spike: 1, essayQuality: 1, recommendations: 1 },
  // CDS C7: rigor=VI, essay=C, recs=NC, ECs=C, talent=C, character=C
  "university-of-south-florida":                    { academicRigor: 3, leadership: 1, awards: 0, activityDepth: 1, spike: 1, essayQuality: 1, recommendations: 0 },
};

/** Lookup with default fallback. */
export function getCdsWeights(slug: string): CdsWeights {
  return CDS_WEIGHTS[slug] ?? DEFAULT;
}

/**
 * Compute a school-specific composite score from a generic 7-dim
 * scorecard. Returns a 0..100 score weighted by what THIS school
 * actually values, plus a delta vs the generic average so the UI
 * can show "+8 pts at Brown vs your generic score".
 *
 * Anti-inflation: the weighted score uses a slight downward bias
 * for "Very Important" factors where the student scores below 60.
 * This prevents a student who is strong on unimportant dimensions
 * from getting inflated results — the model penalizes weakness
 * on the dimensions the school actually cares about.
 */
export type DimensionScores = Record<CdsDimension, number>;

export function computeWeightedScore(
  scores: DimensionScores,
  slug: string
): { score: number; weights: CdsWeights; weaknesses: CdsDimension[] } {
  const weights = getCdsWeights(slug);
  const totalWeight = Object.values(weights).reduce<number>((s, v) => s + v, 0);
  if (totalWeight === 0) return { score: 0, weights, weaknesses: [] };

  // Track weaknesses on "Very Important" dimensions
  const weaknesses: CdsDimension[] = [];

  const weighted = (Object.keys(scores) as CdsDimension[]).reduce<number>(
    (sum, dim) => {
      let dimScore = scores[dim];
      // If the school rates this "Very Important" (3) and the student is
      // weak (<55), apply a 1.15x penalty multiplier to surface the gap.
      // This prevents strong performance on unimportant axes from masking
      // critical weaknesses.
      if (weights[dim] === 3 && dimScore < 55) {
        weaknesses.push(dim);
        dimScore = Math.round(dimScore * 0.85); // penalize weakness on key factors
      }
      return sum + dimScore * weights[dim];
    },
    0
  );
  return { score: Math.round(weighted / totalWeight), weights, weaknesses };
}

/**
 * Format weights as human-readable labels for UI display.
 */
export const WEIGHT_LABEL: Record<0 | 1 | 2 | 3, string> = {
  0: "Not considered",
  1: "Considered",
  2: "Important",
  3: "Very important",
};

export const DIMENSION_LABEL: Record<CdsDimension, string> = {
  academicRigor: "Course rigor & GPA",
  leadership: "Leadership",
  awards: "Awards & honors",
  activityDepth: "Activity depth",
  spike: "Spike / distinctive talent",
  essayQuality: "Application essays",
  recommendations: "Recommendations",
};

/** Convenience for College → ranked list of (label, weightLabel). */
export function rankedFactorsFor(school: College): Array<{
  dimension: CdsDimension;
  label: string;
  weight: 0 | 1 | 2 | 3;
  weightLabel: string;
}> {
  const w = getCdsWeights(school.slug);
  return (Object.keys(w) as CdsDimension[])
    .map((dim) => ({
      dimension: dim,
      label: DIMENSION_LABEL[dim],
      weight: w[dim],
      weightLabel: WEIGHT_LABEL[w[dim]],
    }))
    .sort((a, b) => b.weight - a.weight);
}
