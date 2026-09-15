/**
 * Top college comparison pairs for programmatic SEO pages.
 * Each pair generates a /compare/[slugA]-vs-[slugB] page targeting
 * high-volume long-tail queries like "Harvard vs Yale".
 *
 * Pairs are ordered by estimated search volume.
 */

import { COLLEGES, findCollege, type College } from "./colleges";

export interface ComparisonPair {
  slugA: string;
  slugB: string;
  /** URL-safe slug: "harvard-vs-yale" */
  slug: string;
}

/** Generate a URL slug from two school slugs. */
export function makeComparisonSlug(a: string, b: string): string {
  const ca = findCollege(a);
  const cb = findCollege(b);
  if (!ca || !cb) return `${a}-vs-${b}`;
  return `${ca.shortName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-vs-${cb.shortName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

/** Parse a comparison slug back into two college slugs. */
export function parseComparisonSlug(slug: string): { a: College; b: College } | null {
  const pair = COMPARISON_PAIRS.find((p) => p.slug === slug);
  if (!pair) return null;
  const a = findCollege(pair.slugA);
  const b = findCollege(pair.slugB);
  if (!a || !b) return null;
  return { a, b };
}

// Top 51 comparison pairs — covers Ivies, top privates, UCs, and popular matchups
const RAW_PAIRS: [string, string][] = [
  // Ivy vs Ivy
  ["harvard-university", "yale-university"],
  ["harvard-university", "princeton-university"],
  ["harvard-university", "stanford-university"],
  ["yale-university", "princeton-university"],
  ["columbia-university", "university-of-pennsylvania"],
  ["brown-university", "dartmouth-college"],
  ["cornell-university", "brown-university"],
  ["yale-university", "stanford-university"],
  // Ivy vs top private
  ["harvard-university", "massachusetts-institute-of-technology"],
  ["stanford-university", "massachusetts-institute-of-technology"],
  ["princeton-university", "stanford-university"],
  ["columbia-university", "new-york-university"],
  ["harvard-university", "duke-university"],
  ["yale-university", "duke-university"],
  // Top private vs top private
  ["massachusetts-institute-of-technology", "california-institute-of-technology"],
  ["duke-university", "northwestern-university"],
  ["stanford-university", "duke-university"],
  ["johns-hopkins-university", "duke-university"],
  ["university-of-chicago", "northwestern-university"],
  ["vanderbilt-university", "duke-university"],
  ["rice-university", "vanderbilt-university"],
  ["georgetown-university", "university-of-notre-dame"],
  ["carnegie-mellon-university", "georgia-institute-of-technology"],
  ["northeastern-university", "boston-university"],
  ["tufts-university", "boston-college"],
  ["emory-university", "vanderbilt-university"],
  // UC matchups
  ["university-of-california-berkeley", "university-of-california-los-angeles"],
  ["university-of-california-berkeley", "stanford-university"],
  ["university-of-california-los-angeles", "university-of-southern-california"],
  ["university-of-california-san-diego", "university-of-california-los-angeles"],
  ["university-of-california-davis", "university-of-california-santa-barbara"],
  ["university-of-california-irvine", "university-of-california-san-diego"],
  // Public flagships
  ["university-of-michigan", "university-of-virginia"],
  ["university-of-michigan", "university-of-north-carolina-chapel-hill"],
  ["university-of-virginia", "university-of-north-carolina-chapel-hill"],
  ["georgia-institute-of-technology", "university-of-michigan"],
  ["university-of-texas-austin", "university-of-florida"],
  ["purdue-university", "university-of-illinois-urbana-champaign"],
  ["ohio-state-university", "penn-state-university"],
  ["university-of-wisconsin-madison", "university-of-illinois-urbana-champaign"],
  // LAC matchups
  ["williams-college", "amherst-college"],
  ["swarthmore-college", "pomona-college"],
  ["bowdoin-college", "colby-college"],
  ["middlebury-college", "colby-college"],
  // Cross-category popular
  ["harvard-university", "university-of-california-berkeley"],
  ["stanford-university", "university-of-california-berkeley"],
  ["massachusetts-institute-of-technology", "carnegie-mellon-university"],
  ["cornell-university", "university-of-michigan"],
  ["university-of-pennsylvania", "new-york-university"],
  ["washington-university-in-st-louis", "emory-university"],
  ["boston-university", "boston-college"],
];

export const COMPARISON_PAIRS: readonly ComparisonPair[] = RAW_PAIRS
  .filter(([a, b]) => findCollege(a) && findCollege(b))
  .map(([slugA, slugB]) => ({
    slugA,
    slugB,
    slug: makeComparisonSlug(slugA, slugB),
  }));

export const COMPARISON_SLUGS: readonly string[] = COMPARISON_PAIRS.map((p) => p.slug);
