"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  UserCheck,
  Star,
  ClipboardCopy,
  Printer,
  FileText,
  Wand2,
} from "lucide-react";

type Pick = {
  course: string;
  reason: string;
  priority: "primary" | "secondary" | "skip";
  flags: string[];
};

type ApiError = { error: string; nextStep?: string };

export function RecLettersClient() {
  const [recLoading, setRecLoading] = useState(false);
  const [picks, setPicks] = useState<Pick[] | null>(null);
  const [recError, setRecError] = useState<ApiError | null>(null);

  const [bragLoading, setBragLoading] = useState(false);
  const [bragSheet, setBragSheet] = useState<string | null>(null);
  const [bragError, setBragError] = useState<ApiError | null>(null);
  const [copied, setCopied] = useState(false);

  async function loadRecommenders() {
    setRecLoading(true);
    setRecError(null);
    try {
      const res = await fetch("/api/rec-letter/recommenders");
      const data = await res.json();
      if (!res.ok) {
        setRecError({ error: data.error, nextStep: data.nextStep });
        setPicks(null);
      } else {
        setPicks(Array.isArray(data.picks) ? data.picks : []);
      }
    } catch {
      setRecError({ error: "Network error. Please retry." });
    } finally {
      setRecLoading(false);
    }
  }

  async function loadBragSheet() {
    setBragLoading(true);
    setBragError(null);
    try {
      const res = await fetch("/api/rec-letter/brag-sheet");
      const data = await res.json();
      if (!res.ok) {
        setBragError({ error: data.error, nextStep: data.nextStep });
        setBragSheet(null);
      } else {
        setBragSheet(typeof data.sheet === "string" ? data.sheet : "");
      }
    } catch {
      setBragError({ error: "Network error. Please retry." });
    } finally {
      setBragLoading(false);
    }
  }

  async function copySheet() {
    if (!bragSheet) return;
    try {
      await navigator.clipboard.writeText(bragSheet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Older browsers / locked-down clipboard policies — fall back to a
      // textarea select. Not pretty, but never silent.
      const ta = document.createElement("textarea");
      ta.value = bragSheet;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function printSheet() {
    if (!bragSheet) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<pre style="font-family:ui-monospace,monospace;font-size:12px;white-space:pre-wrap">${escapeHtml(bragSheet)}</pre>`);
    w.document.close();
    w.focus();
    w.print();
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 text-sm mb-6"
          style={{ color: "var(--dl-text-muted, #5A6275)" }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to resources
        </Link>

        <h1
          className="font-normal tracking-tight mb-3"
          style={{
            color: "var(--dl-text-primary, #1B2030)",
            fontFamily: "var(--font-inter)",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            lineHeight: 1.1,
          }}
        >
          Get a stronger recommendation letter.
        </h1>
        <p className="mb-10 text-base" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          Two tools, both free: pick the right teachers based on your course
          history, then hand them a brag sheet so they have something concrete
          to write about.
        </p>

        {/* Recommender selector */}
        <Section
          title="1. Who should you ask?"
          subtitle="Heuristic match against your course list — based on rigor, recency, and academic-subject weight."
        >
          <button
            onClick={loadRecommenders}
            disabled={recLoading}
            className="btn-primary text-sm px-5 py-2.5 disabled:opacity-60"
          >
            <UserCheck className="h-4 w-4" strokeWidth={1.75} />
            {recLoading ? "Reading your courses…" : picks ? "Refresh picks" : "Pick my recommenders"}
          </button>

          <ApiErrorBanner err={recError} />

          {picks && (
            <div className="mt-6 space-y-3">
              {picks.map((p, i) => (
                <motion.div
                  key={`${p.course}-${i}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border p-5 flex items-start gap-3"
                  style={{
                    borderColor: p.priority === "primary" ? "#4A6FA5" : "rgba(0,0,0,0.06)",
                    background: "rgba(255,255,255,0.45)",
                    boxShadow: "var(--shadow-md)",
                  }}
                >
                  <div
                    className="mt-0.5 h-8 w-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: p.priority === "primary" ? "rgba(74,111,165,0.08)" : "rgba(255,255,255,0.45)",
                      color: "#4A6FA5",
                    }}
                  >
                    <Star className="h-4 w-4" strokeWidth={p.priority === "primary" ? 2.5 : 1.75} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                        {p.course}
                      </h3>
                      <span
                        className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                        style={{
                          background: p.priority === "primary" ? "rgba(74,111,165,0.08)" : "rgba(255,255,255,0.45)",
                          color: p.priority === "primary" ? "#4A6FA5" : "var(--dl-text-muted, #5A6275)",
                        }}
                      >
                        {p.priority}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed mb-2" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                      {p.reason}
                    </p>
                    {p.flags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {p.flags.map((f) => (
                          <span
                            key={f}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                            style={{ background: "rgba(255,255,255,0.45)", color: "var(--dl-text-muted, #5A6275)" }}
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Section>

        {/* Brag sheet generator */}
        <Section
          title="2. Hand them a brag sheet."
          subtitle="Auto-built from your profile. Most teachers say the brag sheet is what makes the difference between a generic letter and a great one."
        >
          <button
            onClick={loadBragSheet}
            disabled={bragLoading}
            className="btn-primary text-sm px-5 py-2.5 disabled:opacity-60"
          >
            <Wand2 className="h-4 w-4" strokeWidth={1.75} />
            {bragLoading ? "Building…" : bragSheet ? "Regenerate" : "Generate brag sheet"}
          </button>

          <ApiErrorBanner err={bragError} />

          {bragSheet && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={copySheet}
                  className="btn-secondary text-xs px-3 py-1.5"
                >
                  <ClipboardCopy className="h-3.5 w-3.5" strokeWidth={1.75} />
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  onClick={printSheet}
                  className="btn-secondary text-xs px-3 py-1.5"
                >
                  <Printer className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Print
                </button>
              </div>
              <pre
                className="rounded-2xl border p-5 text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto"
                style={{
                  borderColor: "rgba(0,0,0,0.06)",
                  background: "rgba(255,255,255,0.45)",
                  fontFamily: "ui-monospace, SFMono-Regular, monospace",
                  color: "var(--dl-text-primary, #1B2030)",
                }}
              >
                {bragSheet}
              </pre>
              <p className="mt-3 flex items-center gap-2 text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                <FileText className="h-3.5 w-3.5" />
                Edit your profile to change what&apos;s on this sheet — it regenerates from there.
              </p>
            </div>
          )}
        </Section>
        {/* Related resources */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <Link
            href="/resources/common-app-essay"
            className="dl-card-hover rounded-2xl border p-5 flex flex-col gap-2"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-[14px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Common App Essay
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Your personal statement and rec letters should tell different sides of the same story. See all 7 prompts.
            </p>
            <span className="mt-auto inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#4A6FA5" }}>
              Read the prompts <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
          <Link
            href="/resources/interview-prep"
            className="dl-card-hover rounded-2xl border p-5 flex flex-col gap-2"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-[14px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Interview Prep
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              22 real interview questions with tips. Align your interview answers with what your recommenders will say.
            </p>
            <span className="mt-auto inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#4A6FA5" }}>
              Prep for interviews <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        </div>

        {/* CTA */}
        <div
          className="rounded-2xl border p-6 text-center mb-4"
          style={{
            background: "linear-gradient(135deg, #4A6FA5, #1E3352)",
            borderColor: "#4A6FA5",
          }}
        >
          <p
            className="text-[20px] font-bold mb-2"
            style={{ color: "#fff", fontFamily: "var(--font-inter)" }}
          >
            Get a stronger application.
          </p>
          <p className="text-[13px] mb-4" style={{ color: "rgba(255,255,255,0.85)" }}>
            Create your free profile to generate personalized recommender picks and brag sheets.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold"
            style={{ background: "#fff", color: "#1E3352" }}
          >
            Create your free profile
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2
        className="text-xl font-semibold mb-1"
        style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-instrument-sans)" }}
      >
        {title}
      </h2>
      <p className="text-sm mb-5" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
        {subtitle}
      </p>
      {children}
    </section>
  );
}

function ApiErrorBanner({ err }: { err: ApiError | null }) {
  return (
    <AnimatePresence>
      {err && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-4 rounded-2xl border p-4 flex items-start gap-3"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
        >
          <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" style={{ color: "#DC2626" }} />
          <div className="flex-1">
            <p className="text-sm" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{err.error}</p>
            {err.nextStep && (
              <Link
                href={err.nextStep}
                className="inline-block mt-2 text-sm underline"
                style={{ color: "#4A6FA5" }}
              >
                Finish your profile →
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"]/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : "&quot;"
  );
}
