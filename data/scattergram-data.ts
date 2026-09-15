/**
 * Simulated admit/reject/waitlist data points for peer comparison scattergrams.
 *
 * Data is procedurally generated per-school using the CDS SAT/GPA ranges
 * from data/colleges.ts as seed parameters. Each school gets 50-80 points
 * with realistic clustering: admits skew high-GPA + high-SAT with some
 * noise (hooked applicants, recruited athletes), rejects scatter below
 * thresholds, and waitlists cluster near decision boundaries.
 *
 * None of this is real student data — it is simulated to match publicly
 * reported admissions statistics and give students directional guidance.
 */

import { COLLEGES, type College } from "./colleges";

export type DataPoint = {
  gpa: number;
  sat: number;
  outcome: "admitted" | "rejected" | "waitlisted";
};

/* ── Deterministic pseudo-random (seeded by school slug) ────────────── */
function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 12345) % 2147483647;
    return s / 2147483647;
  };
}

/* ── Clamp helpers ──────────────────────────────────────────────────── */
function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

function round10(v: number): number {
  return Math.round(v / 10) * 10;
}

/* ── Generate data for one school ───────────────────────────────────── */
function generateSchoolData(c: College): DataPoint[] {
  const rand = seededRandom(hashCode(c.slug));
  const points: DataPoint[] = [];

  const satMid = (c.sat25 + c.sat75) / 2;
  const satSpread = (c.sat75 - c.sat25) / 2;
  const gpaFloor = Math.max(2.5, c.gpaAvg - 0.6);
  const gpaCeil = Math.min(4.0, c.gpaAvg + 0.15);

  // How many total points (50-80 depending on school size hash)
  const total = 55 + Math.floor(rand() * 25);

  // Proportion split based on acceptance rate
  const admitPct = Math.min(0.55, Math.max(0.25, c.acceptanceRate / 100 + 0.15));
  const waitlistPct = c.acceptanceRate < 15 ? 0.12 : 0.08;
  const rejectPct = 1 - admitPct - waitlistPct;

  const nAdmit = Math.round(total * admitPct);
  const nWaitlist = Math.round(total * waitlistPct);
  const nReject = total - nAdmit - nWaitlist;

  // Admitted: cluster high, with some "hooked" outliers
  for (let i = 0; i < nAdmit; i++) {
    const isHooked = rand() < 0.12; // ~12% admits at lower stats
    let gpa: number;
    let sat: number;

    if (isHooked) {
      gpa = round2(clamp(c.gpaAvg - 0.3 + rand() * 0.4, gpaFloor, gpaCeil));
      sat = round10(clamp(satMid - satSpread * 0.8 + rand() * satSpread * 0.6, 1000, 1600));
    } else {
      // Strong admits — GPA near or above average, SAT in upper half
      gpa = round2(clamp(c.gpaAvg - 0.15 + rand() * 0.25, gpaFloor, gpaCeil));
      sat = round10(clamp(satMid + (rand() - 0.3) * satSpread * 1.2, c.sat25, 1600));
    }
    points.push({ gpa, sat, outcome: "admitted" });
  }

  // Rejected: scatter below typical thresholds
  for (let i = 0; i < nReject; i++) {
    const isNearMiss = rand() < 0.25; // some rejects have decent stats
    let gpa: number;
    let sat: number;

    if (isNearMiss) {
      gpa = round2(clamp(c.gpaAvg - 0.2 + rand() * 0.3, gpaFloor - 0.2, gpaCeil));
      sat = round10(clamp(satMid - satSpread * 0.5 + rand() * satSpread, 1000, 1600));
    } else {
      gpa = round2(clamp(gpaFloor - 0.1 + rand() * (c.gpaAvg - gpaFloor + 0.2), 2.5, gpaCeil - 0.1));
      sat = round10(clamp(c.sat25 - 120 + rand() * (satSpread * 1.5), 900, c.sat75));
    }
    points.push({ gpa, sat, outcome: "rejected" });
  }

  // Waitlisted: cluster near the decision boundary
  for (let i = 0; i < nWaitlist; i++) {
    const gpa = round2(clamp(c.gpaAvg - 0.2 + rand() * 0.25, gpaFloor, gpaCeil));
    const sat = round10(clamp(satMid - satSpread * 0.3 + rand() * satSpread * 0.6, c.sat25 - 30, c.sat75));
    points.push({ gpa, sat, outcome: "waitlisted" });
  }

  return points;
}

/* ── Build the full lookup ──────────────────────────────────────────── */
const _cache: Record<string, DataPoint[]> = {};

export function getScattergramData(slug: string): DataPoint[] | undefined {
  if (_cache[slug]) return _cache[slug];
  const c = COLLEGES.find((x) => x.slug === slug);
  if (!c) return undefined;
  const data = generateSchoolData(c);
  _cache[slug] = data;
  return data;
}

/** All slugs that have scattergram data (all colleges). */
export const SCATTERGRAM_SLUGS: readonly string[] = COLLEGES.map((c) => c.slug);
