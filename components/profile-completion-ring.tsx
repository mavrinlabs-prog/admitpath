"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

type Profile = {
  gpa?: number | null;
  weightedGpa?: number | null;
  satScore?: number | null;
  actScore?: number | null;
  grade?: number | null;
  state?: string | null;
  activities?: unknown;
  awards?: unknown;
  courses?: unknown;
  intendedMajor?: string | null;
  targetColleges?: unknown;
};

const FIELDS: { key: keyof Profile; label: string; isFilled: (v: unknown, p?: Profile) => boolean }[] = [
  { key: "gpa",            label: "GPA",            isFilled: (v) => typeof v === "number" && v > 0 },
  { key: "grade",          label: "Grade",          isFilled: (v) => typeof v === "number" && v > 0 },
  { key: "state",          label: "State",          isFilled: (v) => typeof v === "string" && v.length > 0 },
  { key: "intendedMajor",  label: "Major",          isFilled: (v) => typeof v === "string" && v.length > 0 },
  { key: "activities",     label: "Activities",     isFilled: (v) => Array.isArray(v) && v.length > 0 },
  { key: "awards",         label: "Awards",         isFilled: (v) => Array.isArray(v) && v.length > 0 },
  { key: "courses",        label: "Courses",        isFilled: (v) => Array.isArray(v) && v.length > 0 },
  { key: "targetColleges", label: "Target schools", isFilled: (v) => Array.isArray(v) && v.length > 0 },
  // Test-optional: either SAT or ACT satisfies this field
  { key: "satScore",       label: "Test score",     isFilled: (v, p) => (typeof v === "number" && v > 0) || (typeof p?.actScore === "number" && p.actScore > 0) },
];

/**
 * Profile completion indicator — clean horizontal bar with segmented
 * progress and a plain checklist feel. No gradient rings, glow effects,
 * or particle animations. Click-through to /profile/create to fill more
 * fields (or /analyze when done).
 *
 * Hidden until the /api/profile call resolves to avoid a flash from 0%.
 */
export function ProfileCompletionRing({ size: _size = 96 }: { size?: number }) {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/profile")
      .then((r) => (r.ok ? r.json() : {}))
      .then((d) => { if (mounted) setProfile((d as Profile) ?? {}); })
      .catch(() => { if (mounted) setProfile({}); });
    return () => { mounted = false; };
  }, []);

  if (profile === null) return null;

  const filledCount = FIELDS.filter((f) => f.isFilled((profile as Profile)[f.key], profile as Profile)).length;
  const total = FIELDS.length;
  const pct = Math.round((filledCount / total) * 100);
  const isComplete = pct === 100;

  const nextField = FIELDS.find((f) => !f.isFilled((profile as Profile)[f.key], profile as Profile));

  return (
    <Link
      href={isComplete ? "/analyze" : "/profile/create"}
      className="group flex items-center gap-4 border p-4 transition-all hover:border-[rgba(74,111,165,0.15)] hover:shadow-[0_2px_8px_rgba(74,111,165,0.06)]"
      style={{
        background: "rgba(255,255,255,0.45)",
        borderColor: "rgba(0,0,0,0.06)",
        borderRadius: "14px",
      }}
      aria-label={
        isComplete
          ? "Profile complete. Click to run your first analysis"
          : `Profile completion: ${pct}%. ${filledCount} of ${total} sections filled. Click to continue`
      }
    >
      {/* Numeric indicator */}
      <div className="shrink-0 flex flex-col items-center justify-center" style={{ width: 56, height: 56 }}>
        {isComplete ? (
          <span
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ background: "rgba(22,163,74,0.08)" }}
          >
            <Check className="h-5 w-5" style={{ color: "#16A34A" }} strokeWidth={2} />
          </span>
        ) : (
          <div className="text-center">
            <p
              className="text-[22px] leading-none tabular-nums"
              style={{
                color: "#4A6FA5",
                fontFamily: "var(--font-jetbrains-mono)",
                fontWeight: 700,
              }}
            >
              {filledCount}
              <span
                className="text-[13px]"
                style={{ color: "var(--dl-text-muted, #5A6275)", fontWeight: 500 }}
              >
                /{total}
              </span>
            </p>
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className="text-[13px]"
          style={{
            color: isComplete ? "#16A34A" : "var(--dl-text-primary, #1B2030)",
            fontWeight: 600,
          }}
        >
          {isComplete ? "Profile complete" : "Complete your profile"}
        </p>

        {/* Segmented progress bar */}
        <div className="mt-2 flex gap-1" aria-hidden>
          {FIELDS.map((f, i) => {
            const filled = f.isFilled((profile as Profile)[f.key], profile as Profile);
            return (
              <motion.div
                key={i}
                className="h-1 flex-1 rounded-full"
                style={{
                  background: filled
                    ? isComplete ? "#16A34A" : "#4A6FA5"
                    : "rgba(0,0,0,0.06)",
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
              />
            );
          })}
        </div>

        <p className="mt-1.5 text-[12px] leading-snug" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          {isComplete
            ? "Ready for your first analysis."
            : nextField
              ? `Next: ${nextField.label}`
              : `${filledCount} of ${total} sections`}
        </p>

        <span
          className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider"
          style={{ color: isComplete ? "#16A34A" : "#4A6FA5" }}
        >
          {isComplete ? "Run analysis" : "Continue"}
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
