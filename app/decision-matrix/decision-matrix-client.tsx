"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { ArrowRight, Plus, X, Trash2, Trophy, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ──────────────────────────────────────────────────────────────

type Factor = {
  id: string;
  name: string;
  weight: number; // 1-10
};

type School = {
  id: string;
  name: string;
  scores: Record<string, number>; // factorId → 1-5
};

const DEFAULT_FACTORS: Factor[] = [
  { id: "cost", name: "Real cost (net price after aid)", weight: 10 },
  { id: "major", name: "Strength of your major/department", weight: 9 },
  { id: "career", name: "Career outcomes for your field", weight: 8 },
  { id: "culture", name: "Cultural / social fit", weight: 7 },
  { id: "location", name: "Location and distance from home", weight: 5 },
  { id: "honors", name: "Honors program / special admit status", weight: 4 },
  { id: "prestige", name: "Brand prestige", weight: 3 },
  { id: "weather", name: "Weather and geography", weight: 2 },
];

let nextId = 1;
function genId() {
  return `f${Date.now()}-${nextId++}`;
}

// ─── Helpers ────────────────────────────────────────────────────────────

function getScoreColor(pct: number): string {
  if (pct >= 80) return "#16A34A";
  if (pct >= 60) return "#D97706";
  return "#DC2626";
}

function getScoreLabel(score: number): string {
  if (score === 5) return "Excellent";
  if (score === 4) return "Good";
  if (score === 3) return "Okay";
  if (score === 2) return "Weak";
  return "Poor";
}

// ─── Component ──────────────────────────────────────────────────────────

export function DecisionMatrixClient() {
  const [factors, setFactors] = useState<Factor[]>(DEFAULT_FACTORS);
  const [schools, setSchools] = useState<School[]>([
    { id: "s1", name: "", scores: {} },
    { id: "s2", name: "", scores: {} },
  ]);
  const [newFactorName, setNewFactorName] = useState("");

  // Computed weighted scores
  const results = useMemo(() => {
    const maxPossible = factors.reduce((sum, f) => sum + f.weight * 5, 0);
    return schools
      .filter((s) => s.name.trim())
      .map((s) => {
        const weightedSum = factors.reduce((sum, f) => {
          const score = s.scores[f.id] || 0;
          return sum + score * f.weight;
        }, 0);
        const pct = maxPossible > 0 ? Math.round((weightedSum / maxPossible) * 100) : 0;
        return { school: s, weightedSum, pct };
      })
      .sort((a, b) => b.pct - a.pct);
  }, [factors, schools]);

  function addSchool() {
    setSchools([...schools, { id: genId(), name: "", scores: {} }]);
  }

  function removeSchool(id: string) {
    if (schools.length <= 2) return;
    setSchools(schools.filter((s) => s.id !== id));
  }

  function updateSchoolName(id: string, name: string) {
    setSchools(schools.map((s) => (s.id === id ? { ...s, name } : s)));
  }

  function updateScore(schoolId: string, factorId: string, score: number) {
    setSchools(
      schools.map((s) =>
        s.id === schoolId
          ? { ...s, scores: { ...s.scores, [factorId]: score } }
          : s
      )
    );
  }

  function addFactor() {
    if (!newFactorName.trim()) return;
    setFactors([...factors, { id: genId(), name: newFactorName.trim(), weight: 5 }]);
    setNewFactorName("");
  }

  function removeFactor(id: string) {
    setFactors(factors.filter((f) => f.id !== id));
  }

  function updateWeight(id: string, weight: number) {
    setFactors(factors.map((f) => (f.id === id ? { ...f, weight } : f)));
  }

  const hasResults = results.length >= 2 && results.every((r) => r.pct > 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <MarketingNav />

      <main id="main" className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <Link
          href="/tools"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: "#4A6FA5" }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to tools
        </Link>

        <p
          className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-3"
          style={{ color: "var(--dl-text-muted, #5A6275)" }}
        >
          Free tool
        </p>
        <h1
          className="text-3xl sm:text-4xl leading-tight mb-3"
          style={{
            color: "var(--dl-text-primary, #1B2030)",
            fontFamily: "var(--font-inter)",
            letterSpacing: "-0.02em",
          }}
        >
          College Decision Matrix
        </h1>
        <p
          className="max-w-2xl text-[15px] leading-relaxed mb-10"
          style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}
        >
          Got multiple acceptances? Score each school on the factors that matter
          most to you, weight them by importance, and see which school wins
          objectively. No more second-guessing.
        </p>

        {/* Schools */}
        <section className="mb-8">
          <h2
            className="text-lg font-bold mb-4"
            style={{ color: "var(--dl-text-primary, #1B2030)" }}
          >
            Your admitted schools
          </h2>
          <div className="flex flex-wrap gap-3 mb-3">
            {schools.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-2 border px-3 py-2 rounded-xl"
                style={{ background: "var(--dl-bg-card)", borderColor: "var(--dl-border)", boxShadow: "var(--dl-shadow-sm)" }}
              >
                <input
                  type="text"
                  value={s.name}
                  onChange={(e) => updateSchoolName(s.id, e.target.value)}
                  placeholder="School name..."
                  className="bg-transparent outline-none text-[14px] w-40"
                  style={{ color: "var(--dl-text-primary, #1B2030)" }}
                />
                {schools.length > 2 && (
                  <button
                    onClick={() => removeSchool(s.id)}
                    className="p-1 rounded hover:bg-red-50 transition-colors"
                    aria-label={`Remove ${s.name || "school"}`}
                  >
                    <X className="h-3.5 w-3.5 text-red-400" />
                  </button>
                )}
              </div>
            ))}
            {schools.length < 6 && (
              <button
                onClick={addSchool}
                className="flex items-center gap-1.5 border border-dashed px-3 py-2 rounded-xl text-[13px] font-medium transition-colors hover:border-[#4A6FA5] hover:text-[#4A6FA5]"
                style={{ borderColor: "rgba(0,0,0,0.1)", color: "var(--dl-text-muted, #5A6275)" }}
              >
                <Plus className="h-3.5 w-3.5" />
                Add school
              </button>
            )}
          </div>
        </section>

        {/* Factors & Weights */}
        <section className="mb-8">
          <h2
            className="text-lg font-bold mb-4"
            style={{ color: "var(--dl-text-primary, #1B2030)" }}
          >
            Decision factors (drag weight slider to set importance)
          </h2>
          <div className="space-y-3">
            {factors.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-4 border px-4 py-3 rounded-xl"
                style={{ background: "var(--dl-bg-card)", borderColor: "var(--dl-border)", boxShadow: "var(--dl-shadow-sm)" }}
              >
                <span
                  className="flex-1 text-[13px] font-medium min-w-[180px]"
                  style={{ color: "var(--dl-text-primary, #1B2030)" }}
                >
                  {f.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold w-5 text-right" style={{ color: "#4A6FA5" }}>
                    {f.weight}
                  </span>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={f.weight}
                    onChange={(e) => updateWeight(f.id, parseInt(e.target.value))}
                    className="w-24 accent-[#4A6FA5]"
                  />
                </div>
                <button
                  onClick={() => removeFactor(f.id)}
                  className="p-1 rounded hover:bg-red-50 transition-colors"
                  aria-label={`Remove factor ${f.name}`}
                >
                  <Trash2 className="h-3.5 w-3.5 text-red-400" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={newFactorName}
              onChange={(e) => setNewFactorName(e.target.value)}
              placeholder="Add a custom factor..."
              className="input-field flex-1 text-[13px]"
              style={{ minHeight: "40px" }}
              onKeyDown={(e) => e.key === "Enter" && addFactor()}
            />
            <button
              onClick={addFactor}
              disabled={!newFactorName.trim()}
              className="px-4 py-2 rounded-xl text-[13px] font-semibold text-white transition-opacity disabled:opacity-40"
              style={{ backgroundColor: "#4A6FA5" }}
            >
              Add
            </button>
          </div>
        </section>

        {/* Scoring Grid */}
        <section className="mb-10">
          <h2
            className="text-lg font-bold mb-4"
            style={{ color: "var(--dl-text-primary, #1B2030)" }}
          >
            Score each school (1 = poor, 5 = excellent)
          </h2>
          <div
            className="overflow-x-auto border rounded-xl"
            style={{ borderColor: "var(--dl-border)", boxShadow: "var(--dl-shadow-sm)" }}
          >
            <table className="w-full text-[13px]">
              <thead>
                <tr style={{ background: "var(--dl-bg-sunken, #E3E8F1)" }}>
                  <th
                    className="sticky left-0 px-4 py-3 text-left font-semibold"
                    style={{ color: "var(--dl-text-primary, #1B2030)", background: "var(--dl-bg-sunken, #E3E8F1)", minWidth: 200 }}
                  >
                    Factor
                  </th>
                  {schools
                    .filter((s) => s.name.trim())
                    .map((s) => (
                      <th
                        key={s.id}
                        className="px-4 py-3 text-center font-semibold whitespace-nowrap"
                        style={{ color: "var(--dl-text-primary, #1B2030)", minWidth: 120 }}
                      >
                        {s.name}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {factors.map((f, i) => (
                  <tr
                    key={f.id}
                    style={{
                      background: i % 2 === 0 ? "var(--dl-bg-card)" : "rgba(0,0,0,0.02)",
                    }}
                  >
                    <td
                      className="sticky left-0 px-4 py-3 font-medium"
                      style={{
                        color: "var(--dl-text-primary, #1B2030)",
                        background: i % 2 === 0 ? "var(--dl-bg-card, #fff)" : "rgba(239,242,248,0.7)",
                      }}
                    >
                      {f.name}
                      <span className="ml-1 text-[11px]" style={{ color: "#4A6FA5" }}>
                        (w{f.weight})
                      </span>
                    </td>
                    {schools
                      .filter((s) => s.name.trim())
                      .map((s) => (
                        <td key={s.id} className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-1" role="radiogroup" aria-label={`Score for ${s.name} on ${f.name}`}>
                            {[1, 2, 3, 4, 5].map((v) => (
                              <button
                                key={v}
                                role="radio"
                                aria-checked={s.scores[f.id] === v}
                                aria-label={`${v} - ${getScoreLabel(v)}`}
                                onClick={() => updateScore(s.id, f.id, v)}
                                onKeyDown={(e) => {
                                  if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                                    e.preventDefault();
                                    const next = Math.min(5, v + 1);
                                    updateScore(s.id, f.id, next);
                                  }
                                  if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                                    e.preventDefault();
                                    const prev = Math.max(1, v - 1);
                                    updateScore(s.id, f.id, prev);
                                  }
                                }}
                                className="w-7 h-7 rounded-lg text-[12px] font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#4A6FA5] focus:ring-offset-1"
                                title={getScoreLabel(v)}
                                style={{
                                  backgroundColor:
                                    (s.scores[f.id] || 0) >= v
                                      ? "#4A6FA5"
                                      : "rgba(0,0,0,0.04)",
                                  color:
                                    (s.scores[f.id] || 0) >= v
                                      ? "#fff"
                                      : "var(--dl-text-muted, #8890A5)",
                                }}
                                tabIndex={s.scores[f.id] === v ? 0 : -1}
                              >
                                {v}
                              </button>
                            ))}
                          </div>
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Results */}
        <AnimatePresence>
          {hasResults && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="mb-10"
            >
              <h2
                className="text-lg font-bold mb-4 flex items-center gap-2"
                style={{ color: "var(--dl-text-primary, #1B2030)" }}
              >
                <Trophy className="h-5 w-5" style={{ color: "#D97706" }} />
                Results
              </h2>
              <div className="space-y-3">
                {results.map((r, i) => (
                  <motion.div
                    key={r.school.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 border px-5 py-4 rounded-xl"
                    style={{
                      background: i === 0 ? "rgba(74,111,165,0.06)" : "var(--dl-bg-card)",
                      borderColor: i === 0 ? "#4A6FA5" : "var(--dl-border)",
                      boxShadow: "var(--dl-shadow-sm)",
                    }}
                  >
                    <span
                      className="text-2xl font-extrabold w-10 text-center"
                      style={{ color: i === 0 ? "#4A6FA5" : "var(--dl-text-muted, #8890A5)" }}
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <p
                        className="text-[15px] font-bold"
                        style={{ color: "var(--dl-text-primary, #1B2030)" }}
                      >
                        {r.school.name}
                        {i === 0 && (
                          <span className="ml-2 text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(74,111,165,0.1)", color: "#4A6FA5" }}>
                            Top pick
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-2xl font-extrabold"
                        style={{ color: getScoreColor(r.pct) }}
                      >
                        {r.pct}
                      </p>
                      <p className="text-[11px]" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
                        weighted score
                      </p>
                    </div>
                    {/* Bar */}
                    <div className="w-32 h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(0,0,0,0.06)" }}>
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${r.pct}%` }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.1 }}
                        style={{ backgroundColor: getScoreColor(r.pct) }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
              <p className="mt-4 text-[12px] leading-relaxed" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
                This matrix reflects your personal priorities. A school that scores lower
                overall may still be right if it wins on the 1-2 factors that matter most to
                you. Use this as one input alongside campus visits, conversations with
                current students, and financial reality.
              </p>
            </motion.section>
          )}
        </AnimatePresence>

        {/* CTA */}
        <div
          className="border rounded-xl p-6 text-center"
          style={{ background: "rgba(74,111,165,0.04)", borderColor: "rgba(74,111,165,0.15)" }}
        >
          <p className="text-[14px] font-semibold mb-2" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Need help comparing financial aid offers?
          </p>
          <p className="text-[13px] mb-4" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Use our Aid Comparison tool to see the true cost at each school.
          </p>
          <Link
            href="/aid-comparison"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#4A6FA5" }}
          >
            Compare aid packages
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
