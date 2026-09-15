"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  SlidersHorizontal,
  TrendingUp,
  GraduationCap,
  Trophy,
  Zap,
} from "lucide-react";
import { predictBand, type ApplicantProfile, type Band, BAND_STYLES } from "@/lib/admit-rates";
import { COLLEGES, type College } from "@/data/colleges";

/* ── Top 20 schools for the scenario modeler ─────────────────────── */
const TARGET_SCHOOLS: College[] = COLLEGES.filter(
  (c) => c.acceptanceRate <= 20,
).slice(0, 16);

/* ── Dimension slider configs ────────────────────────────────────── */
type SliderConfig = {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  icon: typeof GraduationCap;
};

const SLIDERS: SliderConfig[] = [
  {
    key: "gpa",
    label: "GPA (unweighted)",
    min: 2.0,
    max: 4.0,
    step: 0.05,
    format: (v) => v.toFixed(2),
    icon: GraduationCap,
  },
  {
    key: "sat",
    label: "SAT Score",
    min: 1000,
    max: 1600,
    step: 10,
    format: (v) => String(v),
    icon: TrendingUp,
  },
  {
    key: "ecScore",
    label: "Extracurricular Strength",
    min: 1,
    max: 10,
    step: 1,
    format: (v) => `${v}/10`,
    icon: Trophy,
  },
  {
    key: "awardsScore",
    label: "Awards & Recognition",
    min: 1,
    max: 10,
    step: 1,
    format: (v) => `${v}/10`,
    icon: Trophy,
  },
  {
    key: "spikeScore",
    label: "Spike / Differentiator",
    min: 1,
    max: 10,
    step: 1,
    format: (v) => `${v}/10`,
    icon: Zap,
  },
];

const BAND_ORDER: Band[] = ["Very Likely", "Possible", "Long Shot", "Hail Mary"];
const BAND_EMOJI: Record<Band, string> = {
  "Very Likely": "",
  "Possible": "",
  "Long Shot": "",
  "Hail Mary": "",
};

function bandIndex(b: Band): number {
  return BAND_ORDER.indexOf(b);
}

export function WhatIfClient() {
  const [values, setValues] = useState<Record<string, number>>({
    gpa: 3.5,
    sat: 1350,
    ecScore: 5,
    awardsScore: 4,
    spikeScore: 4,
  });

  const [prevValues, setPrevValues] = useState<Record<string, number>>({
    ...values,
  });

  const profile: ApplicantProfile = useMemo(
    () => ({
      gpa: values.gpa,
      sat: values.sat,
      ecScore: values.ecScore,
      awardsScore: values.awardsScore,
      spikeScore: values.spikeScore,
    }),
    [values],
  );

  const prevProfile: ApplicantProfile = useMemo(
    () => ({
      gpa: prevValues.gpa,
      sat: prevValues.sat,
      ecScore: prevValues.ecScore,
      awardsScore: prevValues.awardsScore,
      spikeScore: prevValues.spikeScore,
    }),
    [prevValues],
  );

  const results = useMemo(
    () =>
      TARGET_SCHOOLS.map((school) => ({
        school,
        current: predictBand(profile, school),
        previous: predictBand(prevProfile, school),
      })),
    [profile, prevProfile],
  );

  const handleSliderChange = (key: string, value: number) => {
    setPrevValues({ ...values });
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const improvements = results.filter(
    (r) => bandIndex(r.current.band) < bandIndex(r.previous.band),
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-medium mb-6 transition-colors hover:opacity-80"
            style={{ color: "var(--dl-brand, #4A6FA5)" }}
          >
            <ArrowRight className="h-3.5 w-3.5 rotate-180" strokeWidth={2} />
            Back to dashboard
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: "rgba(74,111,165,0.12)", color: "#4A6FA5" }}
            >
              <SlidersHorizontal className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <div>
              <p
                className="text-[11px] uppercase"
                style={{ color: "#4A6FA5", fontWeight: 700, letterSpacing: "0.12em" }}
              >
                Scenario Modeler
              </p>
            </div>
          </div>
          <h1
            className="text-[36px] leading-[1.1] sm:text-[44px]"
            style={{
              color: "var(--dl-text-primary, #1B2030)",
              fontFamily: "var(--font-inter)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            What if...?
          </h1>
          <p
            className="mt-3 max-w-xl text-[15px] leading-relaxed"
            style={{ color: "var(--dl-text-secondary, #454B5E)" }}
          >
            Move the sliders to see how changes to your profile would affect
            your admission bands at top schools. Every adjustment recalculates
            in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Sliders */}
          <div className="lg:col-span-1">
            <div
              className="border p-6 sticky top-8"
              style={{
                background: "rgba(255,255,255,0.45)",
                backdropFilter: "blur(12px)",
                borderColor: "rgba(0,0,0,0.06)",
                borderRadius: "14px",
              }}
            >
              <p
                className="text-[11px] uppercase mb-5"
                style={{ color: "#4A6FA5", fontWeight: 700, letterSpacing: "0.12em" }}
              >
                Your scenario
              </p>

              <div className="space-y-6">
                {SLIDERS.map((slider) => {
                  const Icon = slider.icon;
                  return (
                    <div key={slider.key}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon
                            className="h-4 w-4"
                            style={{ color: "#4A6FA5" }}
                            strokeWidth={1.75}
                          />
                          <label
                            className="text-[13px] font-semibold"
                            style={{ color: "var(--dl-text-primary, #1B2030)" }}
                          >
                            {slider.label}
                          </label>
                        </div>
                        <span
                          className="text-[14px] font-bold tabular-nums"
                          style={{
                            color: "#4A6FA5",
                            fontFamily: "var(--font-jetbrains-mono)",
                          }}
                        >
                          {slider.format(values[slider.key])}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={slider.min}
                        max={slider.max}
                        step={slider.step}
                        value={values[slider.key]}
                        onChange={(e) =>
                          handleSliderChange(slider.key, parseFloat(e.target.value))
                        }
                        className="w-full accent-[#4A6FA5] h-1.5"
                        style={{ cursor: "pointer" }}
                        aria-label={slider.label}
                        aria-valuemin={slider.min}
                        aria-valuemax={slider.max}
                        aria-valuenow={values[slider.key]}
                        aria-valuetext={slider.format(values[slider.key])}
                      />
                      <div className="flex justify-between mt-1">
                        <span
                          className="text-[10px]"
                          style={{ color: "var(--dl-text-muted, #5A6275)" }}
                        >
                          {slider.format(slider.min)}
                        </span>
                        <span
                          className="text-[10px]"
                          style={{ color: "var(--dl-text-muted, #5A6275)" }}
                        >
                          {slider.format(slider.max)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA */}
              <div className="mt-8 pt-6" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                <p
                  className="text-[13px] font-semibold mb-2"
                  style={{ color: "var(--dl-text-primary, #1B2030)" }}
                >
                  Make this real
                </p>
                <p
                  className="text-[12px] mb-4"
                  style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                >
                  Get a personalized action plan to hit these numbers.
                </p>
                <Link
                  href="/analyze"
                  className="dl-btn dl-btn-primary w-full justify-center"
                >
                  Get your action plan
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-2">
            {/* Movement summary */}
            {improvements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 border p-4"
                style={{
                  background: "rgba(22,163,74,0.06)",
                  borderColor: "rgba(22,163,74,0.15)",
                  borderRadius: "12px",
                }}
              >
                <p className="text-[13px] font-semibold" style={{ color: "#16A34A" }}>
                  {improvements.length} school{improvements.length !== 1 ? "s" : ""} improved:
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {improvements.map((r) => (
                    <span
                      key={r.school.slug}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        background: "rgba(22,163,74,0.1)",
                        color: "#16A34A",
                      }}
                    >
                      {r.school.shortName}: {r.previous.band} → {r.current.band}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* School cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.map((r) => {
                const style = BAND_STYLES[r.current.band];
                const improved = bandIndex(r.current.band) < bandIndex(r.previous.band);
                const declined = bandIndex(r.current.band) > bandIndex(r.previous.band);
                return (
                  <motion.div
                    key={r.school.slug}
                    layout
                    className="border p-5 transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.45)",
                      backdropFilter: "blur(12px)",
                      borderColor: improved
                        ? "rgba(22,163,74,0.2)"
                        : "rgba(0,0,0,0.06)",
                      borderRadius: "14px",
                      boxShadow: improved
                        ? "0 0 0 1px rgba(22,163,74,0.1)"
                        : undefined,
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p
                          className="text-[15px] font-bold"
                          style={{ color: "var(--dl-text-primary, #1B2030)" }}
                        >
                          {r.school.shortName}
                        </p>
                        <p
                          className="text-[11px] mt-0.5"
                          style={{ color: "var(--dl-text-muted, #5A6275)" }}
                        >
                          {r.school.acceptanceRate}% acceptance rate
                        </p>
                      </div>
                      <span
                        className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                        style={{
                          background: style.bg,
                          color: style.fg,
                          border: `1px solid ${style.border}`,
                        }}
                      >
                        {r.current.band}
                      </span>
                    </div>

                    {/* Band change indicator */}
                    {(improved || declined) && (
                      <div
                        className="flex items-center gap-1.5 mb-2"
                        style={{
                          color: improved ? "#16A34A" : "#DC2626",
                        }}
                      >
                        <TrendingUp
                          className="h-3.5 w-3.5"
                          style={{
                            transform: declined ? "scaleY(-1)" : undefined,
                          }}
                          strokeWidth={2}
                        />
                        <span className="text-[11px] font-semibold">
                          {r.previous.band} → {r.current.band}
                        </span>
                      </div>
                    )}

                    <p
                      className="text-[12px] leading-relaxed"
                      style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                    >
                      {r.current.rationale.split(".")[0]}.
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom CTA */}
            <div
              className="mt-8 border p-6 text-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(74,111,165,0.06), rgba(74,111,165,0.03))",
                borderColor: "rgba(74,111,165,0.12)",
                borderRadius: "14px",
              }}
            >
              <p
                className="text-[18px] font-bold mb-2"
                style={{
                  color: "var(--dl-text-primary, #1B2030)",
                  letterSpacing: "-0.02em",
                }}
              >
                Turn &ldquo;what if&rdquo; into &ldquo;what&apos;s next&rdquo;
              </p>
              <p
                className="text-[14px] mb-5 mx-auto max-w-md"
                style={{ color: "var(--dl-text-secondary, #454B5E)" }}
              >
                Run a full 7-dimension analysis to get a personalized action plan
                that makes these improvements real.
              </p>
              <Link
                href="/analyze"
                className="dl-btn dl-btn-primary"
              >
                Run full analysis
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </Link>
            </div>

            {/* Disclaimer */}
            <p
              className="text-xs text-center mt-6"
              style={{ color: "var(--dl-text-muted, #5A6275)" }}
            >
              Bands are directional estimates based on CDS data and profile
              analysis. Actual admissions depend on essays, recommendations,
              and institutional priorities that cannot be fully modeled.
            </p>

            {/* Related tools — internal linking for SEO */}
            <div className="mt-8 pt-6" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
              <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                Related tools
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { href: "/calculator", label: "Chances Calculator" },
                  { href: "/college-list-builder", label: "College List Builder" },
                  { href: "/scholarship-match", label: "Scholarship Match" },
                  { href: "/test-prep-guide", label: "Test Prep Guide" },
                  { href: "/tools", label: "All 45 Tools" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-xs px-3 py-1.5 rounded-full transition-colors hover:opacity-80"
                    style={{
                      background: "rgba(74,111,165,0.08)",
                      color: "#4A6FA5",
                      fontWeight: 600,
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
