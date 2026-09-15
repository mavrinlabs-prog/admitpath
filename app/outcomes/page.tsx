"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  FileText,
  Send,
  MessageSquare,
} from "lucide-react";
import { COLLEGES } from "@/data/colleges";

type Outcome = "admitted" | "rejected" | "waitlisted" | "deferred";
type DecisionType = "ED" | "EA" | "REA" | "RD";

const OUTCOME_OPTIONS: { value: Outcome; label: string; color: string }[] = [
  { value: "admitted", label: "Admitted", color: "#16A34A" },
  { value: "rejected", label: "Rejected", color: "#DC2626" },
  { value: "waitlisted", label: "Waitlisted", color: "#D97706" },
  { value: "deferred", label: "Deferred", color: "#4A6FA5" },
];

const DECISION_OPTIONS: { value: DecisionType; label: string }[] = [
  { value: "ED", label: "Early Decision" },
  { value: "EA", label: "Early Action" },
  { value: "REA", label: "Restrictive Early Action" },
  { value: "RD", label: "Regular Decision" },
];

/* ── Platform metrics ────────────────────────────────────────────── */
const METRICS = [
  {
    icon: Users,
    value: "102",
    label: "Schools' CDS data used",
  },
  {
    icon: GraduationCap,
    value: "7",
    label: "Scoring dimensions",
  },
  {
    icon: FileText,
    value: "6",
    label: "Essay feedback dimensions",
  },
  {
    icon: BarChart3,
    value: "200+",
    label: "Expert articles published",
  },
];

/* ── Aggregate stats (will become live queries) ──────────────────── */
const AGGREGATE_STATS = [
  { label: "Outcome reports collected", value: "Coming soon", icon: Users },
  {
    label: "Target school acceptance rate",
    value: "Coming soon",
    icon: TrendingUp,
  },
  {
    label: "Average schools applied to",
    value: "Coming soon",
    icon: GraduationCap,
  },
];

const OUTCOME_HIGHLIGHTS = [
  {
    icon: TrendingUp,
    stat: "Coming soon",
    title: "Acceptance rate vs. national average",
    description:
      "We are collecting outcome data from the Class of 2030. Once we have statistically significant results, we will publish how AdmitPath users compare to national averages at each selectivity tier.",
  },
  {
    icon: DollarSign,
    stat: "Coming soon",
    title: "Average financial aid awarded",
    description:
      "Students who complete our results survey after decision day help us track aggregate financial aid outcomes. This data will be published once we reach sufficient sample size.",
  },
  {
    icon: GraduationCap,
    stat: "Coming soon",
    title: "Enrollment at top-choice schools",
    description:
      "We are tracking how often AdmitPath users enroll at their first-choice school versus lower-ranked options. Results will be published with the Class of 2030 cycle.",
  },
];

export default function OutcomesPage() {
  const [schoolSlug, setSchoolSlug] = useState("");
  const [outcome, setOutcome] = useState<Outcome | "">("");
  const [decisionType, setDecisionType] = useState<DecisionType | "">("");
  const [submitted, setSubmitted] = useState(false);
  const [entries, setEntries] = useState<
    Array<{ school: string; outcome: Outcome; decision: DecisionType }>
  >([]);
  const [testimonial, setTestimonial] = useState("");
  const [testimonialSubmitted, setTestimonialSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolSlug || !outcome || !decisionType) return;

    const school =
      COLLEGES.find((c) => c.slug === schoolSlug)?.shortName ?? schoolSlug;
    setEntries((prev) => [
      ...prev,
      {
        school,
        outcome: outcome as Outcome,
        decision: decisionType as DecisionType,
      },
    ]);
    setSchoolSlug("");
    setOutcome("");
    setDecisionType("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}
    >
      <main id="main" className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* sr-only heading removed — visible h1 below serves as the page heading */}
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
          <p
            className="text-[11px] uppercase mb-2"
            style={{ color: "#4A6FA5", fontWeight: 700, letterSpacing: "0.12em" }}
            aria-hidden
          >
            Outcome Tracking
          </p>
          <h1
            className="text-[36px] leading-[1.1] sm:text-[44px]"
            style={{
              color: "var(--dl-text-primary, #1B2030)",
              fontFamily: "var(--font-inter)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            Where did you get in?
          </h1>
          <p
            className="mt-3 max-w-xl text-[15px] leading-relaxed"
            style={{ color: "var(--dl-text-secondary, #454B5E)" }}
          >
            Tell us your results. Your outcomes help us improve scoring for
            future students and validate our admission band predictions.
          </p>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {AGGREGATE_STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="border p-5 text-center"
                style={{
                  background: "rgba(255,255,255,0.45)",
                  backdropFilter: "blur(12px)",
                  borderColor: "rgba(0,0,0,0.06)",
                  borderRadius: "14px",
                }}
              >
                <Icon
                  className="h-5 w-5 mx-auto mb-2"
                  style={{ color: "#4A6FA5" }}
                  strokeWidth={1.75}
                />
                <p
                  className="text-[28px] font-bold tabular-nums"
                  style={{
                    color: "#4A6FA5",
                    fontFamily: "var(--font-jetbrains-mono)",
                  }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-[12px] mt-1"
                  style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                >
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Report Form */}
        <div
          className="border p-6 mb-8"
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
            Report a decision
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* School */}
            <div>
              <label
                className="text-[13px] font-semibold block mb-2"
                style={{ color: "var(--dl-text-primary, #1B2030)" }}
              >
                School
              </label>
              <select
                value={schoolSlug}
                onChange={(e) => setSchoolSlug(e.target.value)}
                aria-label="Select a school to report your outcome"
                className="w-full rounded-xl border px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
                style={{
                  borderColor: "rgba(0,0,0,0.1)",
                  background: "rgba(255,255,255,0.7)",
                  color: "var(--dl-text-primary, #1B2030)",
                }}
                required
              >
                <option value="">Select a school...</option>
                {COLLEGES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Outcome */}
            <div>
              <label
                className="text-[13px] font-semibold block mb-2"
                style={{ color: "var(--dl-text-primary, #1B2030)" }}
              >
                Outcome
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {OUTCOME_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setOutcome(opt.value)}
                    aria-pressed={outcome === opt.value}
                    aria-label={`Outcome: ${opt.label}`}
                    className="rounded-xl border px-4 py-3 text-[13px] font-semibold transition-all"
                    style={{
                      borderColor:
                        outcome === opt.value ? opt.color : "rgba(0,0,0,0.08)",
                      background:
                        outcome === opt.value
                          ? `${opt.color}10`
                          : "rgba(255,255,255,0.5)",
                      color:
                        outcome === opt.value
                          ? opt.color
                          : "var(--dl-text-secondary, #454B5E)",
                      borderWidth: outcome === opt.value ? 2 : 1,
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Decision Type */}
            <div>
              <label
                className="text-[13px] font-semibold block mb-2"
                style={{ color: "var(--dl-text-primary, #1B2030)" }}
              >
                Decision type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DECISION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDecisionType(opt.value)}
                    aria-pressed={decisionType === opt.value}
                    aria-label={`Decision type: ${opt.label}`}
                    className="rounded-xl border px-4 py-3 text-[13px] font-semibold transition-all"
                    style={{
                      borderColor:
                        decisionType === opt.value
                          ? "#4A6FA5"
                          : "rgba(0,0,0,0.08)",
                      background:
                        decisionType === opt.value
                          ? "rgba(74,111,165,0.08)"
                          : "rgba(255,255,255,0.5)",
                      color:
                        decisionType === opt.value
                          ? "#4A6FA5"
                          : "var(--dl-text-secondary, #454B5E)",
                      borderWidth: decisionType === opt.value ? 2 : 1,
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!schoolSlug || !outcome || !decisionType}
              className="dl-btn dl-btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" strokeWidth={1.75} />
              Submit outcome
            </button>
          </form>

          {/* Success message */}
          {submitted && (
            <div
              className="mt-4 flex items-center gap-2 rounded-xl p-3"
              style={{
                background: "rgba(22,163,74,0.08)",
                border: "1px solid rgba(22,163,74,0.15)",
              }}
            >
              <CheckCircle2
                className="h-4 w-4 shrink-0"
                style={{ color: "#16A34A" }}
                strokeWidth={2}
              />
              <p className="text-[13px] font-semibold" style={{ color: "#16A34A" }}>
                Outcome recorded. Thank you for helping future students.
              </p>
            </div>
          )}
        </div>

        {/* Recent entries */}
        {entries.length > 0 && (
          <div
            className="border p-6 mb-8"
            style={{
              background: "rgba(255,255,255,0.45)",
              backdropFilter: "blur(12px)",
              borderColor: "rgba(0,0,0,0.06)",
              borderRadius: "14px",
            }}
          >
            <p
              className="text-[11px] uppercase mb-4"
              style={{ color: "#4A6FA5", fontWeight: 700, letterSpacing: "0.12em" }}
            >
              Your reported outcomes
            </p>
            <div className="space-y-3">
              {entries.map((entry, i) => {
                const outcomeStyle = OUTCOME_OPTIONS.find(
                  (o) => o.value === entry.outcome,
                );
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3"
                    style={{
                      borderBottom:
                        i < entries.length - 1
                          ? "1px solid rgba(0,0,0,0.06)"
                          : undefined,
                    }}
                  >
                    <div>
                      <p
                        className="text-[14px] font-bold"
                        style={{ color: "var(--dl-text-primary, #1B2030)" }}
                      >
                        {entry.school}
                      </p>
                      <p
                        className="text-[12px] mt-0.5"
                        style={{ color: "var(--dl-text-muted, #5A6275)" }}
                      >
                        {entry.decision}
                      </p>
                    </div>
                    <span
                      className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                      style={{
                        background: `${outcomeStyle?.color ?? "#4A6FA5"}15`,
                        color: outcomeStyle?.color ?? "#4A6FA5",
                      }}
                    >
                      {entry.outcome.charAt(0).toUpperCase() +
                        entry.outcome.slice(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Share Your Story */}
        <div
          className="border p-6 mb-8"
          style={{
            background: "rgba(255,255,255,0.45)",
            backdropFilter: "blur(12px)",
            borderColor: "rgba(0,0,0,0.06)",
            borderRadius: "14px",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare
              className="h-5 w-5"
              style={{ color: "#4A6FA5" }}
              strokeWidth={1.75}
            />
            <p
              className="text-[11px] uppercase"
              style={{ color: "#4A6FA5", fontWeight: 700, letterSpacing: "0.12em" }}
            >
              Share your story
            </p>
          </div>
          <h3
            className="text-base font-semibold mb-1"
            style={{ color: "var(--dl-text-primary, #1B2030)" }}
          >
            How did AdmitPath help you?
          </h3>
          <p
            className="text-sm mb-4 leading-relaxed"
            style={{ color: "var(--dl-text-secondary, #454B5E)" }}
          >
            Tell us about your experience. Your testimonial may be featured
            (anonymously) to help future applicants.
          </p>

          {testimonialSubmitted ? (
            <div
              className="flex items-center gap-2 rounded-xl p-3"
              style={{
                background: "rgba(22,163,74,0.08)",
                border: "1px solid rgba(22,163,74,0.15)",
              }}
            >
              <CheckCircle2
                className="h-4 w-4 shrink-0"
                style={{ color: "#16A34A" }}
                strokeWidth={2}
              />
              <p className="text-[13px] font-semibold" style={{ color: "#16A34A" }}>
                Thank you for sharing your story!
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!testimonial.trim()) return;
                setTestimonialSubmitted(true);
              }}
              className="space-y-3"
            >
              <textarea
                value={testimonial}
                onChange={(e) => setTestimonial(e.target.value)}
                placeholder="Share how AdmitPath helped with your college application journey..."
                rows={4}
                required
                className="w-full rounded-xl border px-4 py-3 text-[14px] resize-none focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
                style={{
                  borderColor: "rgba(0,0,0,0.1)",
                  background: "rgba(255,255,255,0.7)",
                  color: "var(--dl-text-primary, #1B2030)",
                }}
              />
              <button
                type="submit"
                disabled={!testimonial.trim()}
                className="dl-btn dl-btn-primary text-sm px-5 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                <Send className="h-4 w-4" strokeWidth={1.75} />
                Submit testimonial
              </button>
            </form>
          )}
        </div>

        {/* Platform metrics */}
        <div className="mb-8">
          <p
            className="text-[11px] uppercase mb-4"
            style={{ color: "#4A6FA5", fontWeight: 700, letterSpacing: "0.12em" }}
          >
            Platform usage
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {METRICS.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.label}
                  className="border p-5 text-center"
                  style={{
                    borderColor: "rgba(0,0,0,0.06)",
                    background: "rgba(255,255,255,0.45)",
                    backdropFilter: "blur(12px)",
                    borderRadius: "14px",
                  }}
                >
                  <Icon
                    className="h-5 w-5 mx-auto mb-2"
                    style={{ color: "#4A6FA5" }}
                    strokeWidth={1.75}
                  />
                  <p
                    className="text-xl font-extrabold"
                    style={{ color: "var(--dl-text-primary, #1B2030)" }}
                  >
                    {m.value}
                  </p>
                  <p
                    className="text-[11px] mt-1"
                    style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                  >
                    {m.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Outcome highlights */}
        <div className="mb-8 space-y-4">
          {OUTCOME_HIGHLIGHTS.map((h) => {
            const Icon = h.icon;
            return (
              <div
                key={h.title}
                className="border p-6"
                style={{
                  borderColor: "rgba(0,0,0,0.06)",
                  background: "rgba(255,255,255,0.45)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "14px",
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="shrink-0 rounded-xl p-2.5"
                    style={{ background: "rgba(74,111,165,0.08)" }}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ color: "#4A6FA5" }}
                      strokeWidth={1.75}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3
                        className="text-base font-semibold"
                        style={{ color: "var(--dl-text-primary, #1B2030)" }}
                      >
                        {h.title}
                      </h3>
                      <span
                        className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: "rgba(74,111,165,0.08)",
                          color: "#4A6FA5",
                        }}
                      >
                        {h.stat}
                      </span>
                    </div>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                    >
                      {h.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Help CTA */}
        <div
          className="border p-6 text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(74,111,165,0.06), rgba(74,111,165,0.03))",
            borderColor: "rgba(74,111,165,0.12)",
            borderRadius: "14px",
          }}
        >
          <GraduationCap
            className="h-8 w-8 mx-auto mb-3"
            style={{ color: "#4A6FA5" }}
            strokeWidth={1.5}
          />
          <p
            className="text-[16px] font-bold mb-2"
            style={{
              color: "var(--dl-text-primary, #1B2030)",
              letterSpacing: "-0.02em",
            }}
          >
            Your results help everyone
          </p>
          <p
            className="text-[14px] mb-1 mx-auto max-w-md leading-relaxed"
            style={{ color: "var(--dl-text-secondary, #454B5E)" }}
          >
            Every outcome you report helps us calibrate our scoring model and
            improve predictions for the next generation of applicants. All
            data is anonymized.
          </p>
        </div>
      </main>
    </div>
  );
}
