/**
 * Undermatching Nudge.
 *
 * Research (Hoxby & Avery, 2013; Bowen, Chingos & McPherson) shows
 * high-achieving low-income students systematically apply ONLY to
 * regional schools they could financially attend, missing T20s where
 * (a) they would be admitted, and (b) financial aid would actually
 * cost LESS than their state flagship.
 *
 * This component nudges those students toward the meets-full-need
 * privates for further research if their stats are near the published range
 * and their household income is below $80K. It does not estimate admission or aid.
 */

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Sparkles, TrendingUp, X } from "lucide-react";

type Props = {
  gpa: number;
  sat: number;
  householdIncome: number;
  /** True if their current college list contains only state schools / regionals. */
  listLooksRegional?: boolean;
};

const FULL_NEED_TARGETS = [
  { name: "Harvard", slug: "harvard-university", sat: 1500 },
  { name: "Yale", slug: "yale-university", sat: 1500 },
  { name: "Princeton", slug: "princeton-university", sat: 1500 },
  { name: "MIT", slug: "massachusetts-institute-of-technology", sat: 1530 },
  { name: "Stanford", slug: "stanford-university", sat: 1500 },
  { name: "Amherst", slug: "amherst-college", sat: 1450 },
  { name: "Williams", slug: "williams-college", sat: 1480 },
  { name: "Bowdoin", slug: "bowdoin-college", sat: 1450 },
];

const STORAGE_KEY = "admitpath:undermatch-nudge-dismissed:v1";

export function UndermatchingNudge({ gpa, sat, householdIncome, listLooksRegional }: Props) {
  // SSR-safe: never read localStorage during server render. Hydrate as
  // visible, then check dismissal on mount so SSR and client agree.
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") setDismissed(true);
    } catch { /* private mode */ }
    setMounted(true);
  }, []);

  const matches = useMemo(
    () => FULL_NEED_TARGETS.filter((t) => sat >= t.sat - 80),
    [sat]
  );

  // Trigger conditions:
  //   - GPA >= 3.7 unweighted
  //   - SAT >= 1400 (or near a target school's threshold)
  //   - Household income < $80K
  //   - College list looks regional (or unknown — show anyway)
  const eligible =
    mounted &&
    !dismissed &&
    gpa >= 3.7 &&
    sat >= 1400 &&
    householdIncome > 0 &&
    householdIncome < 80000 &&
    matches.length > 0 &&
    (listLooksRegional ?? true);

  if (!eligible) return null;

  function dismiss() {
    setDismissed(true);
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch { /* private mode */ }
  }

  return (
    <div
      className="relative border-2 p-5 sm:p-6"
      role="alert"
      aria-label="Undermatching reminder: research need-based aid at additional schools"
      style={{
        borderColor: "rgba(74,111,165,0.5)",
        background: "linear-gradient(135deg, rgba(74,111,165,0.06), rgba(74,111,165,0.02))",
        borderRadius: "var(--dl-radius-lg)",
        boxShadow: "var(--dl-shadow-md)",
      }}
    >
      <button
        onClick={dismiss}
        className="absolute top-3 right-3 rounded-full p-1 transition-opacity hover:opacity-70"
        style={{ color: "var(--dl-text-muted, #5A6275)" }}
        aria-label="Dismiss undermatching nudge"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-3">
        <div
          className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: "rgba(74,111,165,0.08)" }}
        >
          <Sparkles className="h-5 w-5" style={{ color: "#4A6FA5" }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className="text-[15px] font-semibold mb-1.5"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-instrument-sans)" }}
          >
            Research need-based aid at {matches.length} additional schools
          </h3>
          <p className="text-[13px] leading-relaxed mb-3" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            With a {gpa.toFixed(2)} GPA / {sat} SAT and household income under $80K,
            these schools may be worth researching for need-based aid. This is not an
            admission or price estimate; use each school&apos;s official net price calculator.
          </p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {matches.slice(0, 6).map((m) => (
              <Link
                key={m.slug}
                href={`/colleges/${m.slug}`}
                className="rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors hover:border-[#4A6FA5] hover:text-[#4A6FA5]"
                style={{ borderColor: "var(--dl-border)", color: "var(--dl-text-secondary, #454B5E)" }}
              >
                {m.name}
              </Link>
            ))}
          </div>
          <Link
            href="/net-price"
            className="inline-flex items-center gap-1 text-[12px] font-semibold"
            style={{ color: "#4A6FA5" }}
          >
            <TrendingUp className="h-3 w-3" />
            Compare planning estimates →
          </Link>
        </div>
      </div>
    </div>
  );
}
