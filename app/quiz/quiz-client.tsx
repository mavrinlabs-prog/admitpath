"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { COLLEGES } from "@/data/colleges";
import { ArrowRight, ArrowLeft, ChevronRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Step = 0 | 1 | 2 | 3 | 4;

const GRADE_OPTIONS = ["9th", "10th", "11th", "12th"];
const EC_LEVELS = [
  { label: "Just getting started", value: 3 },
  { label: "A few clubs, no leadership", value: 5 },
  { label: "Active member, some leadership", value: 7 },
  { label: "Significant leadership + awards", value: 8 },
  { label: "National-level achievement / deep spike", value: 10 },
];

function tierFor(satRatio: number, gpaRatio: number, ecScore: number) {
  const composite = satRatio * 0.4 + gpaRatio * 0.4 + (ecScore / 10) * 0.2;
  if (composite >= 1.05) return "Likely" as const;
  if (composite >= 0.7) return "Target" as const;
  if (composite >= 0.4) return "Reach" as const;
  return "Hard Reach" as const;
}

const TIER_COLORS = {
  Likely: { bg: "rgba(34,197,94,0.12)", fg: "#16a34a" },
  Target: { bg: "rgba(74,111,165,0.14)", fg: "#4A6FA5" },
  Reach: { bg: "rgba(74,111,165,0.14)", fg: "#4A6FA5" },
  "Hard Reach": { bg: "rgba(239,68,68,0.10)", fg: "#dc2626" },
};

const stepVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

export function QuizClient() {
  const [step, setStep] = useState<Step>(0);
  const [direction, setDirection] = useState(1);
  const [grade, setGrade] = useState("");
  const [gpa, setGpa] = useState("");
  const [sat, setSat] = useState("");
  const [ec, setEc] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");

  function next() {
    if (!canAdvance) return;
    setDirection(1);
    if (step < 4) setStep((step + 1) as Step);
    else {
      setProcessing(true);
      setTimeout(() => {
        setDone(true);
        setProcessing(false);
      }, 800);
    }
  }
  function back() {
    setDirection(-1);
    if (step > 0) setStep((step - 1) as Step);
  }

  // Keyboard navigation: Enter to advance, Escape to go back
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && canAdvance && !processing) {
      e.preventDefault();
      next();
    }
  }

  const canAdvance =
    step === 0
      ? grade !== ""
      : step === 1
        ? gpa !== "" && Number(gpa) >= 1 && Number(gpa) <= 5
        : step === 2
          ? sat === "" || (Number(sat) >= 400 && Number(sat) <= 1600)
          : step === 3
            ? ec !== null
            : true;

  const results = useMemo(() => {
    if (!done) return [];
    const gpaNum = Number(gpa) || 3.5;
    const satNum = Number(sat) || 0;
    const ecNum = ec ?? 5;
    return COLLEGES.map((c) => {
      const satRatio = satNum > 0 ? (satNum - c.sat25) / (c.sat75 - c.sat25) : 0.5;
      const gpaRatio = (gpaNum - 3.5) / (c.gpaAvg - 3.5);
      const tier = tierFor(satRatio, gpaRatio, ecNum);
      return { college: c, tier };
    }).sort((a, b) => {
      const order = { Likely: 0, Target: 1, Reach: 2, "Hard Reach": 3 };
      return order[a.tier] - order[b.tier] || a.college.acceptanceRate - b.college.acceptanceRate;
    });
  }, [done, gpa, sat, ec]);

  const tierCounts = useMemo(() => {
    const counts = { Likely: 0, Target: 0, Reach: 0, "Hard Reach": 0 };
    results.forEach((r) => counts[r.tier]++);
    return counts;
  }, [results]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <MarketingNav />

      <main id="main" className="mx-auto max-w-xl px-4 py-16 sm:py-20" onKeyDown={handleKeyDown}>
        <h1 className="sr-only">College Fit Quiz</h1>
        {!done ? (
          <>
            {/* Progress */}
            <div className="mb-8 flex gap-1.5">
              {[0, 1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className="h-1.5 flex-1 rounded-full overflow-hidden"
                  style={{ background: "rgba(0,0,0,0.06)" }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "#4A6FA5" }}
                    initial={{ width: "0%" }}
                    animate={{ width: s <= step ? "100%" : "0%" }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  />
                </div>
              ))}
            </div>

            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              Question {step + 1} of 5
            </p>

            {/* Animated step container */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                {/* Step 0: Grade */}
                {step === 0 && (
                  <div>
                    <h2
                      className="text-2xl sm:text-3xl leading-tight mb-6"
                      style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                    >
                      Select your grade
                    </h2>
                    <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Grade selection">
                      {GRADE_OPTIONS.map((g) => (
                        <button
                          key={g}
                          role="radio"
                          aria-checked={grade === g}
                          onClick={() => setGrade(g)}
                          className="quiz-option border p-4 text-[15px] font-medium transition-all duration-200 active:scale-[0.97]"
                          style={{
                            borderRadius: "var(--dl-radius-lg)",
                            borderColor: grade === g ? "#4A6FA5" : "var(--dl-border)",
                            background: grade === g ? "rgba(74,111,165,0.08)" : "var(--dl-bg-card)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                            color: grade === g ? "#4A6FA5" : "var(--dl-text-primary, #1B2030)",
                            boxShadow: grade === g ? "0 0 0 3px rgba(74,111,165,0.10), var(--dl-shadow-sm)" : "var(--dl-shadow-sm)",
                          }}
                        >
                          {g} grade
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 1: GPA */}
                {step === 1 && (
                  <div>
                    <h2
                      className="text-2xl sm:text-3xl leading-tight mb-2"
                      style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                    >
                      What&apos;s your unweighted GPA?
                    </h2>
                    <p className="text-[14px] mb-6" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                      On a 4.0 scale. If you&apos;re unsure, your best estimate is fine.
                    </p>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      step={0.01}
                      value={gpa}
                      onChange={(e) => setGpa(e.target.value)}
                      placeholder="e.g. 3.85"
                      className="input-field w-full text-center text-[20px]"
                      style={{ minHeight: "56px" }}
                      autoFocus
                    />
                  </div>
                )}

                {/* Step 2: SAT */}
                {step === 2 && (
                  <div>
                    <h2
                      className="text-2xl sm:text-3xl leading-tight mb-2"
                      style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                    >
                      SAT score (optional)
                    </h2>
                    <p className="text-[14px] mb-6" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                      Leave blank if you haven&apos;t taken it yet or plan to go test-optional.
                    </p>
                    <input
                      type="number"
                      min={400}
                      max={1600}
                      step={10}
                      value={sat}
                      onChange={(e) => setSat(e.target.value)}
                      placeholder="e.g. 1450"
                      className="input-field w-full text-center text-[20px]"
                      style={{ minHeight: "56px" }}
                      autoFocus
                    />
                  </div>
                )}

                {/* Step 3: ECs */}
                {step === 3 && (
                  <div>
                    <h2
                      className="text-2xl sm:text-3xl leading-tight mb-6"
                      style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                    >
                      How would you describe your extracurriculars?
                    </h2>
                    <div className="space-y-2.5">
                      {EC_LEVELS.map((l) => (
                        <button
                          key={l.value}
                          onClick={() => setEc(l.value)}
                          className="quiz-option w-full text-left border p-4 text-[14px] transition-all duration-200 active:scale-[0.98]"
                          style={{
                            borderRadius: "var(--dl-radius-lg)",
                            borderColor: ec === l.value ? "#4A6FA5" : "var(--dl-border)",
                            background: ec === l.value ? "rgba(74,111,165,0.08)" : "var(--dl-bg-card)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                            color: ec === l.value ? "#4A6FA5" : "var(--dl-text-primary, #1B2030)",
                            boxShadow: ec === l.value ? "0 0 0 3px rgba(74,111,165,0.10), var(--dl-shadow-sm)" : "var(--dl-shadow-sm)",
                          }}
                        >
                          {l.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Confirmation */}
                {step === 4 && (
                  <div>
                    <h2
                      className="text-2xl sm:text-3xl leading-tight mb-4"
                      style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                    >
                      Ready to see your results?
                    </h2>
                    <div
                      className="border p-5 mb-6 space-y-2"
                      style={{ background: "var(--dl-bg-card)", borderColor: "var(--dl-border)", borderRadius: "var(--dl-radius-lg)", boxShadow: "var(--dl-shadow-sm)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
                    >
                      <div className="flex justify-between text-[14px]">
                        <span style={{ color: "var(--dl-text-muted, #5A6275)" }}>Grade</span>
                        <span style={{ color: "var(--dl-text-primary, #1B2030)" }}>{grade}</span>
                      </div>
                      <div className="flex justify-between text-[14px]">
                        <span style={{ color: "var(--dl-text-muted, #5A6275)" }}>GPA</span>
                        <span style={{ color: "var(--dl-text-primary, #1B2030)" }}>{gpa}</span>
                      </div>
                      <div className="flex justify-between text-[14px]">
                        <span style={{ color: "var(--dl-text-muted, #5A6275)" }}>SAT</span>
                        <span style={{ color: "var(--dl-text-primary, #1B2030)" }}>{sat || "Not provided"}</span>
                      </div>
                      <div className="flex justify-between text-[14px]">
                        <span style={{ color: "var(--dl-text-muted, #5A6275)" }}>Extracurriculars</span>
                        <span style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                          {EC_LEVELS.find((l) => l.value === ec)?.label ?? "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={back}
                disabled={step === 0}
                className="quiz-back-btn inline-flex items-center gap-1 text-[14px] font-medium transition-opacity disabled:opacity-30"
                style={{ color: "var(--dl-text-secondary, #454B5E)", borderRadius: 12 }}
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
              <button
                onClick={next}
                disabled={!canAdvance || processing}
                className="dl-btn dl-btn-primary inline-flex items-center gap-2 h-11 px-6 text-sm"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    {step === 4 ? "See my chances" : "Next"}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          /* Results — tantalizing but incomplete for non-signed-up users */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <h2
              className="text-2xl sm:text-3xl leading-tight mb-2"
              style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
            >
              Your admissions snapshot
            </h2>
            <p className="text-[14px] mb-6" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Based on academics alone. But academics are only <strong style={{ color: "#4A6FA5" }}>1 of 7 dimensions</strong> admissions officers evaluate.
            </p>

            {/* Tier summary */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {(["Likely", "Target", "Reach", "Hard Reach"] as const).map((t, i) => (
                <motion.div
                  key={t}
                  className="p-3 text-center"
                  style={{ background: TIER_COLORS[t].bg, borderRadius: "var(--dl-radius-lg)", border: "1px solid var(--dl-border)", boxShadow: "var(--dl-shadow-sm)" }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] }}
                >
                  <p className="text-[22px] font-bold tabular-nums" style={{ color: TIER_COLORS[t].fg }}>
                    {tierCounts[t]}
                  </p>
                  <p className="text-[11px] font-semibold" style={{ color: TIER_COLORS[t].fg }}>
                    {t}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Tantalizing insight — show what they're missing */}
            <motion.div
              className="border p-5 mb-6"
              style={{
                background: "linear-gradient(135deg, rgba(74,111,165,0.08), rgba(30,51,82,0.04))",
                borderColor: "rgba(74,111,165,0.2)",
                borderRadius: "var(--dl-radius-lg)",
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <p className="text-[15px] font-bold leading-snug mb-2" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                Your academic profile suggests{" "}
                <span style={{ color: "#4A6FA5" }}>
                  {tierCounts.Likely > 0 ? `${tierCounts.Likely} likely` : tierCounts.Target > 0 ? `${tierCounts.Target} target` : `${tierCounts.Reach} reach`}
                </span>{" "}
                {tierCounts.Likely > 0 ? "matches" : "schools"}.
              </p>
              <p className="text-[13px] leading-relaxed mb-3" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                But GPA and test scores are only part of the picture. Admissions officers also evaluate
                leadership, activity depth, spike factor, essay quality, awards, and recommendations.
                Your real odds could be significantly different once all 7 dimensions are scored.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Leadership", "Activity Depth", "Spike Factor", "Essay Quality", "Awards", "Recommendations"].map((dim) => (
                  <span
                    key={dim}
                    className="rounded-full px-2.5 py-1 text-[10px] font-semibold"
                    style={{ background: "rgba(74,111,165,0.08)", color: "#4A6FA5", border: "1px solid rgba(74,111,165,0.15)" }}
                  >
                    {dim} — ?
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Show top 5 schools only, blur the rest */}
            <div className="space-y-2">
              {results.slice(0, 5).map((r, i) => (
                <motion.div
                  key={r.college.slug}
                  className="dl-card-hover flex items-center justify-between border px-4 py-3"
                  style={{ borderColor: "var(--dl-border)", background: "var(--dl-bg-card)", borderRadius: "var(--dl-radius-lg)", boxShadow: "var(--dl-shadow-sm)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.025, ease: [0.4, 0, 0.2, 1] }}
                >
                  <div>
                    <Link
                      href={`/college/${r.college.slug}`}
                      className="text-[14px] font-medium transition-colors hover:text-[#4A6FA5]"
                      style={{ color: "var(--dl-text-primary, #1B2030)" }}
                    >
                      {r.college.name}
                    </Link>
                    <p className="text-[11px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                      {r.college.acceptanceRate}% · {r.college.city}, {r.college.state}
                    </p>
                  </div>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                    style={{
                      background: TIER_COLORS[r.tier].bg,
                      color: TIER_COLORS[r.tier].fg,
                    }}
                  >
                    {r.tier}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Blurred remaining schools */}
            {results.length > 5 && (
              <div className="relative mt-2 overflow-hidden rounded-2xl">
                <div
                  className="space-y-2 select-none pointer-events-none"
                  style={{ filter: "blur(5px)", WebkitFilter: "blur(5px)", userSelect: "none" }}
                  aria-hidden
                >
                  {results.slice(5, 12).map((r) => (
                    <div
                      key={r.college.slug}
                      className="flex items-center justify-between border px-4 py-3"
                      style={{ borderColor: "var(--dl-border)", background: "var(--dl-bg-card)", borderRadius: "var(--dl-radius-lg)" }}
                    >
                      <div>
                        <p className="text-[14px] font-medium" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{r.college.name}</p>
                        <p className="text-[11px]" style={{ color: "var(--dl-text-muted)" }}>{r.college.acceptanceRate}%</p>
                      </div>
                      <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold" style={{ background: TIER_COLORS[r.tier].bg, color: TIER_COLORS[r.tier].fg }}>{r.tier}</span>
                    </div>
                  ))}
                </div>
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.3)" }}
                >
                  <p className="text-[13px] font-bold" style={{ color: "#4A6FA5" }}>
                    +{results.length - 5} more schools — sign up to see all
                  </p>
                </div>
              </div>
            )}

            {/* Email capture + CTA */}
            <motion.div
              className="mt-8 border p-6 text-center"
              style={{
                background: "rgba(255,255,255,0.6)",
                borderColor: "rgba(74,111,165,0.2)",
                borderRadius: "var(--dl-radius-lg)",
                boxShadow: "0 4px 16px rgba(74,111,165,0.08)",
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <p
                className="text-[17px] font-bold leading-snug mb-2"
                style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
              >
                Want the full 7-dimension breakdown?
              </p>
              <p className="text-[13px] mb-5" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                Create your free account to see all 7 dimensions scored, get your complete admission odds,
                and receive a personalized 90-day roadmap. Takes under 3 minutes.
              </p>

              {!emailSubmitted ? (
                <div className="max-w-sm mx-auto">
                  <div className="flex gap-2 mb-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                      placeholder="Your email address"
                      className="input-field flex-1 text-[14px]"
                      style={{ minHeight: "44px" }}
                    />
                    <button
                      onClick={() => {
                        if (!email || !email.includes("@")) {
                          setEmailError("Enter a valid email.");
                          return;
                        }
                        // Store email for signup pre-fill
                        try { sessionStorage.setItem("admitpath:quiz-email", email); } catch { /* noop */ }
                        setEmailSubmitted(true);
                      }}
                      className="dl-btn dl-btn-primary px-5 text-[13px] shrink-0"
                    >
                      Continue
                    </button>
                  </div>
                  {emailError && (
                    <p className="text-[11px] font-medium" style={{ color: "#EF4444" }}>{emailError}</p>
                  )}
                  <p className="text-[10px] mt-1" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                    No spam. We will only email you about your admissions progress.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-[13px] font-semibold" style={{ color: "#16A34A" }}>
                    Great. Let us build your full profile.
                  </p>
                  <Link
                    href={`/sign-up?email=${encodeURIComponent(email)}`}
                    className="dl-btn dl-btn-primary inline-flex h-11 items-center gap-2 px-6 text-sm"
                  >
                    Create free account — see all 7 dimensions
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </motion.div>

            <p
              className="mt-6 text-[11px] text-center leading-relaxed"
              style={{ color: "var(--dl-text-muted, #5A6275)" }}
            >
              This snapshot uses GPA, SAT, and self-reported extracurriculars.
              Your full analysis includes essays, course rigor, leadership depth, and more.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
