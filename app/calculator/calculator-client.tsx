"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { COLLEGES } from "@/data/colleges";

type Tier = "Reach" | "Target" | "Likely" | "Hard Reach";

type ValidationError = {
  gpa?: string;
  sat?: string;
};

function tierFor(satRatio: number, gpaRatio: number, ecScore: number): Tier {
  const composite = (satRatio * 0.4 + gpaRatio * 0.4 + (ecScore / 10) * 0.2);
  if (composite >= 1.05) return "Likely";
  if (composite >= 0.7) return "Target";
  if (composite >= 0.4) return "Reach";
  return "Hard Reach";
}

const TIER_COLORS: Record<Tier, { bg: string; fg: string }> = {
  Likely: { bg: "var(--color-safety-bg)", fg: "var(--color-safety)" },
  Target: { bg: "var(--color-target-bg)", fg: "var(--color-target)" },
  Reach: { bg: "var(--color-reach-bg)", fg: "var(--color-reach)" },
  "Hard Reach": { bg: "rgba(239,68,68,0.10)", fg: "#dc2626" },
};

/* DL card style constants */
const DL_CARD_STYLE = {
  background: "var(--dl-bg-card)",
  borderColor: "var(--dl-border)",
  borderRadius: "var(--dl-radius-lg)",
  boxShadow: "var(--dl-shadow-sm)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
} as const;

export function ChancesCalculator() {
  const [gpa, setGpa] = useState(3.9);
  const [sat, setSat] = useState(1450);
  const [ec, setEc] = useState(6);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError>({});
  const resultsRef = useRef<HTMLDivElement>(null);

  const validate = useCallback((): boolean => {
    const newErrors: ValidationError = {};
    if (gpa < 1.0 || gpa > 4.0) newErrors.gpa = "GPA must be between 1.0 and 4.0";
    if (!Number.isFinite(gpa)) newErrors.gpa = "Enter a valid GPA";
    if (sat < 400 || sat > 1600) newErrors.sat = "SAT must be between 400 and 1600";
    if (sat % 10 !== 0) newErrors.sat = "SAT scores are multiples of 10";
    if (!Number.isFinite(sat)) newErrors.sat = "Enter a valid SAT score";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [gpa, sat]);

  const results = useMemo(() => {
    return COLLEGES.map((c) => {
      const satRange = c.sat75 - c.sat25;
      const satRatio = satRange > 0 ? (sat - c.sat25) / satRange : 0.5;
      const gpaRange = c.gpaAvg - 3.5;
      const gpaRatio = gpaRange > 0 ? (gpa - 3.5) / gpaRange : 0.5;
      const tier = tierFor(satRatio, gpaRatio, ec);
      return { college: c, tier, satRatio, gpaRatio };
    }).sort((a, b) => {
      const order: Record<Tier, number> = { Likely: 0, Target: 1, Reach: 2, "Hard Reach": 3 };
      if (order[a.tier] !== order[b.tier]) return order[a.tier] - order[b.tier];
      return a.college.acceptanceRate - b.college.acceptanceRate;
    });
  }, [gpa, sat, ec]);

  const handleSubmit = useCallback(() => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      // Scroll to results
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }, 600);
  }, [validate]);

  return (
    <div>
      {/* Inputs */}
      <section
        className="border p-6 sm:p-8"
        style={DL_CARD_STYLE}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label htmlFor="gpa-input" className="block text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--dl-text-muted, #5A6275)" }}>Unweighted GPA</label>
            <input
              id="gpa-input"
              type="number"
              min={2}
              max={4}
              step={0.01}
              value={gpa}
              onChange={(e) => { setGpa(Math.min(4, Math.max(2, Number(e.target.value) || 0))); setErrors((prev) => ({ ...prev, gpa: undefined })); }}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
              className="input-field w-full text-lg font-bold"
              style={{ minHeight: "44px", borderColor: errors.gpa ? "#DC2626" : undefined }}
              aria-invalid={!!errors.gpa}
              aria-describedby={errors.gpa ? "gpa-error" : undefined}
            />
            <p className="mt-1.5 text-xs" style={{ color: errors.gpa ? "#DC2626" : "var(--dl-text-muted, #5A6275)" }}>
              {errors.gpa || "Out of 4.0"}
            </p>
          </div>
          <div>
            <label htmlFor="sat-input" className="block text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--dl-text-muted, #5A6275)" }}>SAT Score</label>
            <input
              id="sat-input"
              type="number"
              min={400}
              max={1600}
              step={10}
              value={sat}
              onChange={(e) => { setSat(Math.min(1600, Math.max(400, Number(e.target.value) || 0))); setErrors((prev) => ({ ...prev, sat: undefined })); }}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
              className="input-field w-full text-lg font-bold"
              style={{ minHeight: "44px", borderColor: errors.sat ? "#DC2626" : undefined }}
              aria-invalid={!!errors.sat}
              aria-describedby={errors.sat ? "sat-error" : undefined}
            />
            <p id="sat-error" className="mt-1.5 text-xs" style={{ color: errors.sat ? "#DC2626" : "var(--dl-text-muted, #5A6275)" }}>
              {errors.sat || "Out of 1600"}
            </p>
          </div>
          <div>
            <label htmlFor="ec-input" className="block text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--dl-text-muted, #5A6275)" }}>Extracurriculars (1–10)</label>
            <input
              id="ec-input"
              type="range"
              min={1}
              max={10}
              step={1}
              value={ec}
              onChange={(e) => setEc(Number(e.target.value))}
              className="w-full mt-3.5"
              aria-valuemin={1}
              aria-valuemax={10}
              aria-valuenow={ec}
            />
            <p className="mt-1.5 text-xs flex justify-between" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              <span>{ec}/10</span>
              <span>{ec >= 9 ? "National" : ec >= 7 ? "Strong" : ec >= 5 ? "Average" : "Light"}</span>
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="dl-btn dl-btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                Calculate my chances <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </section>

      {/* Results */}
      <AnimatePresence>
        {submitted && (
          <motion.section
            ref={resultsRef}
            aria-live="polite"
            className="mt-10"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <h2 className="text-2xl font-bold mb-4 tracking-tight" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>
              Your estimated chances
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              Based on a {gpa.toFixed(2)} GPA, {sat} SAT, and {ec}/10 extracurriculars. Directional only — essays, recommendations, and hooks aren&apos;t scored here.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {results.map(({ college, tier }, i) => (
                <motion.div
                  key={college.slug}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.03, ease: [0.4, 0, 0.2, 1] }}
                >
                  <Link
                    href={`/college/${college.slug}`}
                    className="dl-card-hover flex items-center justify-between gap-3 border p-4"
                    style={DL_CARD_STYLE}
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-sm truncate" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{college.shortName}</div>
                      <div className="text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>{college.acceptanceRate}% acceptance</div>
                    </div>
                    <span
                      className="rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap"
                      style={{ background: TIER_COLORS[tier].bg, color: TIER_COLORS[tier].fg }}
                    >
                      {tier}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-8 border-2 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6"
              style={{ borderColor: "#4A6FA5", background: "linear-gradient(135deg, rgba(74,111,165,0.08), rgba(74,111,165,0.02))", borderRadius: "var(--dl-radius-xl)", boxShadow: "var(--dl-shadow-md)" }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1.5" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>
                  Want a real assessment?
                </h3>
                <p className="text-sm" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                  AdmitPath scores your full profile — academic rigor, leadership, awards, spike, essays, recs — across 7 dimensions, calibrated to actual admit standards.
                </p>
              </div>
              <Link href="/sign-up" className="dl-btn dl-btn-primary inline-flex items-center gap-2 px-6 py-3.5 text-sm whitespace-nowrap">
                Sign up free <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
