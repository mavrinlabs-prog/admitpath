"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { track } from "@vercel/analytics";
import {
  ArrowLeft, Sparkles, FileText, CheckCircle, AlertCircle,
  ChevronRight, Zap,
} from "lucide-react";
import { getScoreColor, getDimensionColor } from "@/lib/scoring";
import { AISourceChip } from "@/components/ai-source-chip";
import { EmptyEssays } from "@/components/illustrations/EmptyEssays";
import { InlineEssayEdits } from "@/components/inline-essay-edits";
import { AiPolicyBadge } from "@/components/ai-policy-badge";
import { findCollegeByName } from "@/data/colleges";
import { EssayLiveCoach } from "@/components/essay-live-coach";
import { analytics } from "@/lib/analytics";
import { ResumeQuickImport } from "@/components/resume-quick-import";
import { HydrationSafeSelect } from "@/components/ui/hydration-safe-select";
import { ESSAY_TYPE_LABELS, ESSAY_TYPE_VALUES, type EssayType } from "@/lib/essay-types";
import { essaySubmissionSchema, type EssayFieldErrors } from "@/lib/essay-contract";
import {
  firstEssayFieldError,
  getEssaySubmissionError,
  type EssayErrorBody,
} from "@/lib/essay-client-errors";

type EssayScores = {
  authenticity: number; insight: number; specificity: number;
  storytelling: number; impact: number; voice: number;
};
type LineEdit = { original: string; suggestion: string; reason: string; direction?: string };
type VoiceAxisDetail = { score: number; evidence: string };
type ClicheEntry = { phrase: string; location: string; why: string; alternative: string };
type StructureAnalysis = { arc: string; momentumDrop: string; endingVerdict: string };
type CraftAnalysis = {
  structure: string;
  clarity: string;
  voice: string;
  specificity: string;
  reflection: string;
  narrativeCoherence: string;
  opening: string;
  conclusion: string;
  redundancy: string;
  sentenceLevelOpportunities: string;
  authenticityRisks: string;
};
type EssayFeedback = {
  scores: EssayScores;
  overallScore: number;
  wordCount: number;
  topStrengths: string[];
  criticalIssues: string[];
  redFlags?: string[];
  cliches?: ClicheEntry[];
  aiSignals?: string[];
  lineEdits: LineEdit[];
  summary: string;
  voiceRubric?: Record<string, VoiceAxisDetail | number>;
  structureAnalysis?: StructureAnalysis;
  counselorNote?: string;
  promptFit?: { score: number; feedback: string };
  promptRecommendation?: string;
  calibration?: string;
  craftAnalysis?: CraftAnalysis;
  revisionPriorities?: Array<{
    rank: number;
    issue: string;
    evidence: string;
    instruction: string;
    successCheck: string;
  }>;
  authorshipPolicy?: string;
};

// Same defensive coercion analyze/page.tsx uses: the Cerebras → Groq fallback
// chain occasionally returns a stringified number, NaN, or out-of-range value.
// Left raw, that crashes the SVG dasharray math and renders a blank score ring.
function safeScore(v: unknown): number {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
}
function safeEssayScores(s: Partial<EssayScores> | null | undefined): EssayScores {
  return {
    authenticity: safeScore(s?.authenticity),
    insight: safeScore(s?.insight),
    specificity: safeScore(s?.specificity),
    storytelling: safeScore(s?.storytelling),
    impact: safeScore(s?.impact),
    voice: safeScore(s?.voice),
  };
}

const ESSAY_DRAFT_KEY = "admitpath:essay-draft:v1";

function formatSavedAt(d: Date) {
  const seconds = Math.round((Date.now() - d.getTime()) / 1000);
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  return `${hours}h ago`;
}

const SCORE_LABELS: Record<keyof EssayScores, string> = {
  authenticity: "Authenticity",
  insight: "Insight",
  specificity: "Specificity",
  storytelling: "Storytelling",
  impact: "Impact",
  voice: "Voice",
};

function ScoreRing({ score }: { score: number }) {
  const r = 54;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);

  // Count-up animation for the displayed number
  const [shown, setShown] = useState(0);
  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const duration = 1200;
    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(eased * score));
      if (t < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <motion.div
      className="relative inline-flex items-center justify-center"
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.15 }}
    >
      {/* Glow pulse on reveal */}
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{ background: `radial-gradient(circle, ${color}33, transparent 60%)` }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.2, 1.3] }}
        transition={{ delay: 1.0, duration: 0.8, ease: "easeOut" }}
      />
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={r} fill="none" strokeWidth="8" stroke="rgba(0,0,0,0.06)" />
        <motion.circle
          cx="64" cy="64" r={r}
          fill="none" strokeWidth="8"
          stroke={color}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          transform="rotate(-90 64 64)"
        />
      </svg>
      <div className="absolute text-center">
        <motion.p
          className="text-3xl font-extrabold leading-none tabular-nums"
          style={{ color, fontFamily: "var(--font-inter)" }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {shown}
        </motion.p>
        <p className="text-xs font-medium mt-0.5" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>/ 100</p>
      </div>
    </motion.div>
  );
}

function DimensionBar({ label, score, delay }: { label: string; score: number; delay: number }) {
  const color = getDimensionColor(score);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    let frame: number;
    const startTime = performance.now();
    const wait = delay * 1000;
    const duration = 700;
    function tick(now: number) {
      const elapsed = now - startTime - wait;
      if (elapsed < 0) { frame = requestAnimationFrame(tick); return; }
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(eased * score));
      if (t < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [score, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35 }}
    >
      <div className="mb-1 flex justify-between text-xs">
        <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{label}</span>
        <span className="font-bold tabular-nums" style={{ color }}>{shown}</span>
      </div>
      <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: "rgba(0,0,0,0.06)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ delay: delay + 0.1, duration: 0.7, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

export default function EssaysPage() {
  const [prompt, setPrompt] = useState("");
  const [content, setContent] = useState("");
  const [college, setCollege] = useState("");
  const [essayType, setEssayType] = useState<EssayType | "">("");
  const [wordLimit, setWordLimit] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<EssayFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<EssayFieldErrors>({});

  // Hydration-safe draft restore + auto-save. The draft banner and saved
  // indicator render only after `mounted` so SSR HTML matches first paint.
  const [mounted, setMounted] = useState(false);
  const [restored, setRestored] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [savingDraft, setSavingDraft] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [draftEssayId, setDraftEssayId] = useState<string | null>(null);
  const feedbackRequestKeyRef = useRef<string | null>(null);
  const feedbackInFlightRef = useRef(false);

  function clearSubmissionError(field: keyof EssayFieldErrors) {
    feedbackRequestKeyRef.current = null;
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  // Auto-resize textarea to fit content
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(320, el.scrollHeight)}px`;
  }, [content]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ESSAY_DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          prompt?: string; content?: string; college?: string; essayType?: EssayType; wordLimit?: string;
          draftEssayId?: string;
        };
        const hasAny = !!(parsed.prompt || parsed.content || parsed.college || parsed.wordLimit);
        if (hasAny) {
          if (parsed.prompt) setPrompt(parsed.prompt);
          if (parsed.content) setContent(parsed.content);
          if (parsed.college) setCollege(parsed.college);
          if (parsed.essayType && ESSAY_TYPE_VALUES.includes(parsed.essayType)) setEssayType(parsed.essayType);
          if (parsed.wordLimit) setWordLimit(parsed.wordLimit);
          if (parsed.draftEssayId) setDraftEssayId(parsed.draftEssayId);
          setRestored(true);
        }
      }
    } catch {
      // Ignore — fall through to a clean editor.
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setSavingDraft(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      // Save to localStorage (always — works offline)
      try {
        localStorage.setItem(
          ESSAY_DRAFT_KEY,
          JSON.stringify({ prompt, content, college, essayType, wordLimit, draftEssayId }),
        );
      } catch {
        // Quota / private mode — no-op.
      }
      // Save to DB (if user has typed enough content)
      if (prompt.trim().length > 0 && content.trim().length >= 50) {
        try {
          const res = await fetch("/api/essay", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              essayId: draftEssayId || undefined,
              prompt,
              content,
              college: college || undefined,
              essayType: essayType || undefined,
            }),
          });
          if (res.ok) {
            const data = await res.json() as { id?: string; saved?: boolean };
            if (data.id && !draftEssayId) setDraftEssayId(data.id);
          }
        } catch {
          // DB save failed — localStorage backup is sufficient
        }
      }
      setSavedAt(new Date());
      setSavingDraft(false);
    }, 3000);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt, content, college, essayType, wordLimit, mounted]);

  function clearDraft() {
    try { localStorage.removeItem(ESSAY_DRAFT_KEY); } catch { /* noop */ }
    setPrompt(""); setContent(""); setCollege(""); setEssayType(""); setWordLimit("");
    feedbackRequestKeyRef.current = null;
    setFieldErrors({}); setError(null); setRestored(false); setSavedAt(null);
  }

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const wordLimitNum = wordLimit ? parseInt(wordLimit, 10) : NaN;
  const overLimit = Number.isFinite(wordLimitNum) && wordCount > wordLimitNum;

  async function handleFeedback() {
    if (feedbackInFlightRef.current) return;

    const requestKey = feedbackRequestKeyRef.current ?? crypto.randomUUID();
    const parsed = essaySubmissionSchema.safeParse({
      essayId: draftEssayId || undefined,
      requestKey,
      prompt,
      content,
      college,
      essayType,
      wordLimit,
    });
    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      setError("Check the highlighted fields and try again.");
      return;
    }

    feedbackRequestKeyRef.current = requestKey;
    feedbackInFlightRef.current = true;
    setLoading(true);
    setError(null);
    setFieldErrors({});
    setFeedback(null);
    try {
      const res = await fetch("/api/essay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (res.status === 401) {
        const here = window.location.pathname;
        window.location.assign(`/sign-in?redirect_url=${encodeURIComponent(here)}`);
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as EssayErrorBody;
        setFieldErrors(body.fieldErrors ?? {});
        setError(getEssaySubmissionError(res.status, body));
        return;
      }
      const raw = (await res.json()) as EssayFeedback & { essayId?: string };
      if (raw.essayId) setDraftEssayId(raw.essayId);
      feedbackRequestKeyRef.current = null;
      // Sanitize before render — see safeEssayScores().
      setFeedback({
        ...raw,
        scores: safeEssayScores(raw.scores),
        overallScore: safeScore(raw.overallScore),
      });
      // No PII — pathname only. Prompt/content stay client-side.
      track("essay_scored", { path: "/essays" });
      analytics.essaySubmitted();
      // Feedback rendered cleanly — clear the draft so the next session
      // doesn't restore the essay the user just scored.
      try { localStorage.removeItem(ESSAY_DRAFT_KEY); } catch { /* noop */ }
      setRestored(false);
    } catch {
      setError("Couldn't reach the essay scorer. Check your connection and try again.");
    } finally {
      feedbackInFlightRef.current = false;
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
{/* Hero — flat surface, editorial typography */}
      <div
        className="border-b py-10"
        style={{ background: "var(--dl-bg-root, #D5DCE8)", borderColor: "rgba(0,0,0,0.06)" }}
      >
        <div className="mx-auto max-w-7xl px-4">
          <p
            className="text-[11px] uppercase"
            style={{ color: "#4A6FA5", fontWeight: 700, letterSpacing: "0.12em" }}
          >
            Essays
          </p>
          <h1
            className="mt-2 text-[34px] leading-tight"
            style={{
              color: "var(--dl-text-primary, #1B2030)",
              fontFamily: "var(--font-inter)",
              letterSpacing: "-0.02em",
            }}
          >
            Your essay is the one part of your application that&rsquo;s entirely you.
          </h1>
          <p
            className="mt-2 max-w-xl text-[15px] italic leading-relaxed"
            style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}
          >
            We score it across 6&nbsp;dimensions — the same rubric admissions readers at T25 schools use. Honest feedback, not flattery.
          </p>
          <p className="mt-2 text-[12px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            Need a prompt?{" "}
            <Link
              href="/resources/common-app-essay"
              className="underline transition-opacity hover:opacity-70"
              style={{ color: "#4A6FA5" }}
            >
              Common App prompts
            </Link>
            {" · "}
            <Link
              href="/resources/supplemental-essays"
              className="underline transition-opacity hover:opacity-70"
              style={{ color: "#4A6FA5" }}
            >
              Supplemental prompts
            </Link>
          </p>
        </div>
      </div>

      <main id="main" className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left panel — input */}
          <div className="space-y-5">
            <ResumeQuickImport context="essay" />
            {/* Hydration-gated draft banner + saved indicator. */}
            {mounted && (
              <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.18em]">
                <div style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                  {restored ? (
                    <span>
                      Restored from draft ·{" "}
                      <button
                        type="button"
                        onClick={clearDraft}
                        className="underline hover:opacity-80"
                        style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                      >
                        Start over
                      </button>
                    </span>
                  ) : (
                    <span>&nbsp;</span>
                  )}
                </div>
                <div style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                  {savingDraft
                    ? "Saving…"
                    : savedAt
                    ? `Saved ${formatSavedAt(savedAt)}`
                    : ""}
                </div>
              </div>
            )}

            {/* Prompt + meta */}
            <div className="dl-card-hover card space-y-4">
              <h2
                className="text-[18px]"
                style={{ color: "#1B2030", fontFamily: "var(--font-inter)", fontWeight: 700, letterSpacing: "-0.02em" }}
              >
                Essay details
              </h2>
              <div>
                <label className="label" htmlFor="essay-type">Essay type</label>
                <HydrationSafeSelect
                  id="essay-type"
                  className="input-field"
                  value={essayType}
                  hydrationPlaceholder="Choose a type"
                  aria-invalid={!!firstEssayFieldError(fieldErrors, "essayType")}
                  aria-describedby={firstEssayFieldError(fieldErrors, "essayType") ? "essay-type-error" : undefined}
                  onChange={(event) => {
                    setEssayType(event.target.value as EssayType | "");
                    clearSubmissionError("essayType");
                  }}
                >
                  <option value="">Choose a type</option>
                  {ESSAY_TYPE_VALUES.map((value) => (
                    <option key={value} value={value}>{ESSAY_TYPE_LABELS[value]}</option>
                  ))}
                </HydrationSafeSelect>
                {firstEssayFieldError(fieldErrors, "essayType") && (
                  <p id="essay-type-error" className="mt-1 text-xs" style={{ color: "var(--error)" }}>
                    {firstEssayFieldError(fieldErrors, "essayType")}
                  </p>
                )}
              </div>
              <div>
                <label className="label" htmlFor="essay-prompt">Essay prompt *</label>
                <input
                  id="essay-prompt"
                  type="text"
                  className="input-field"
                  placeholder="e.g. Describe a challenge you faced and how you overcame it."
                  value={prompt}
                  aria-invalid={!!firstEssayFieldError(fieldErrors, "prompt")}
                  aria-describedby={firstEssayFieldError(fieldErrors, "prompt") ? "essay-prompt-error" : undefined}
                  onChange={(e) => {
                    setPrompt(e.target.value);
                    clearSubmissionError("prompt");
                  }}
                />
                {firstEssayFieldError(fieldErrors, "prompt") && (
                  <p id="essay-prompt-error" className="mt-1 text-xs" style={{ color: "var(--error)" }}>
                    {firstEssayFieldError(fieldErrors, "prompt")}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label" htmlFor="essay-college">Target college</label>
                  <input
                    id="essay-college"
                    type="text"
                    className="input-field"
                    placeholder="Common App / MIT…"
                    value={college}
                    aria-invalid={!!firstEssayFieldError(fieldErrors, "college")}
                    aria-describedby={firstEssayFieldError(fieldErrors, "college") ? "essay-college-error" : undefined}
                    onChange={(e) => {
                      setCollege(e.target.value);
                      clearSubmissionError("college");
                    }}
                  />
                  {firstEssayFieldError(fieldErrors, "college") && (
                    <p id="essay-college-error" className="mt-1 text-xs" style={{ color: "var(--error)" }}>
                      {firstEssayFieldError(fieldErrors, "college")}
                    </p>
                  )}
                  {(() => {
                    const matched = college ? findCollegeByName(college) : undefined;
                    return matched ? (
                      <div className="mt-2">
                        <AiPolicyBadge slug={matched.slug} showSummary />
                      </div>
                    ) : null;
                  })()}
                </div>
                <div>
                  <label className="label" htmlFor="essay-word-limit">Word limit</label>
                  <input
                    id="essay-word-limit"
                    type="number"
                    className="input-field"
                    placeholder="650"
                    value={wordLimit}
                    aria-invalid={!!firstEssayFieldError(fieldErrors, "wordLimit")}
                    aria-describedby={firstEssayFieldError(fieldErrors, "wordLimit") ? "essay-word-limit-error" : undefined}
                    onChange={(e) => {
                      setWordLimit(e.target.value);
                      clearSubmissionError("wordLimit");
                    }}
                  />
                  {firstEssayFieldError(fieldErrors, "wordLimit") && (
                    <p id="essay-word-limit-error" className="mt-1 text-xs" style={{ color: "var(--error)" }}>
                      {firstEssayFieldError(fieldErrors, "wordLimit")}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Essay text area */}
            <div className="dl-card-hover card space-y-3">
              <div className="flex items-center justify-between">
                <h2
                  className="text-base font-bold"
                  style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                >
                  Your essay *
                </h2>
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums"
                  style={{
                    backgroundColor: overLimit
                      ? "var(--error-light)"
                      : wordCount > 0
                      ? "rgba(74,111,165,0.08)"
                      : "rgba(255,255,255,0.45)",
                    color: overLimit
                      ? "var(--error)"
                      : wordCount > 0
                      ? "#4A6FA5"
                      : "var(--dl-text-muted, #5A6275)",
                    fontFamily: "var(--dl-font-mono)",
                    transition: "background-color 200ms, color 200ms",
                  }}
                >
                  {wordCount} / {wordLimit || "650"} words
                </span>
              </div>
              <textarea
                ref={textareaRef}
                aria-label="Your essay"
                aria-invalid={!!firstEssayFieldError(fieldErrors, "content")}
                aria-describedby={firstEssayFieldError(fieldErrors, "content") ? "essay-content-error" : undefined}
                className="input-field resize-none"
                style={{
                  fontFamily: "var(--font-lora), Georgia, serif",
                  fontSize: "16px",
                  lineHeight: "1.8",
                  minHeight: "20rem",
                  maxHeight: "70vh",
                  letterSpacing: "0.005em",
                  overflowY: "auto",
                }}
                placeholder="Paste your full essay draft here…"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  clearSubmissionError("content");
                }}
              />
              {firstEssayFieldError(fieldErrors, "content") && (
                <p id="essay-content-error" className="text-xs" style={{ color: "var(--error)" }}>
                  {firstEssayFieldError(fieldErrors, "content")}
                </p>
              )}
              {content.trim().length > 30 && (
                <EssayLiveCoach
                  content={content}
                  collegeName={college}
                  isWhyUs={prompt.toLowerCase().includes("why") && (prompt.toLowerCase().includes(college.toLowerCase()) || college.length > 0)}
                />
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 rounded-xl border px-4 py-3 text-sm"
                style={{
                  backgroundColor: "var(--error-light)",
                  borderColor: "rgba(239,68,68,0.25)",
                  color: "var(--error)",
                }}
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {(error.includes("Pro") || error.includes("Upgrade")) ? (
                  <span>
                    {error}{" "}
                    <Link href="/pricing" className="font-bold underline">
                      See plans →
                    </Link>
                  </span>
                ) : error}
              </motion.div>
            )}

            <button
              onClick={handleFeedback}
              disabled={loading}
              className="dl-btn dl-btn-primary dl-btn-lg w-full"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                  Analyzing (10–20s)…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Get feedback
                </span>
              )}
            </button>

            {/* Single muted disclaimer — feedback is a draft pass; a human
                counselor should review before submission. */}
            <p
              className="mt-3 text-xs leading-relaxed"
              style={{ color: "var(--dl-text-muted, #5A6275)" }}
            >
              Use the feedback as a draft pass. A human counselor should review before submission.
            </p>
          </div>

          {/* Right panel — results */}
          <div>
            <AnimatePresence mode="wait">
              {feedback ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-5"
                >
                  {/* Source-of-truth chip — anchors the feedback panel to the
                      draft the user pasted, so output reads as commentary on
                      that text rather than as an absolute verdict. */}
                  <div>
                    <AISourceChip>based on the draft you pasted</AISourceChip>
                  </div>
                  {/* Overall score */}
                  <div
                    className="dl-card-hover card text-center"
                  >
                    <p className="section-label mb-3">Overall Score</p>
                    <ScoreRing score={feedback.overallScore} />
                    <p
                      className="mt-3 text-[13px] font-semibold leading-snug"
                      style={{ color: "var(--dl-text-primary, #1B2030)" }}
                    >
                      {feedback.overallScore >= 80
                        ? "This essay would make an admissions reader pause. Keep refining — you're close to unforgettable."
                        : feedback.overallScore >= 60
                          ? "The raw material is here. The specific changes below will transform this from good to genuinely memorable."
                          : "Every great essay starts as a rough draft. Here's the path from where you are to an essay that gets you in."}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                      {feedback.summary}
                    </p>
                  </div>

                  {/* 6 dimensions */}
                  <div className="dl-card-hover card space-y-3.5">
                    <h3
                      className="font-bold"
                      style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                    >
                      6-Dimension Breakdown
                    </h3>
                    {(Object.keys(feedback.scores) as Array<keyof EssayScores>).map((k, i) => (
                      <DimensionBar key={k} label={SCORE_LABELS[k]} score={feedback.scores[k]} delay={i * 0.07} />
                    ))}
                  </div>

                  {/* Strengths — staggered slide-in */}
                  {feedback.topStrengths.length > 0 && (
                    <motion.div
                      className="dl-card-hover card"
                      style={{ borderColor: "rgba(34,197,94,0.3)", backgroundColor: "var(--success-light)" }}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.4 }}
                    >
                      <h3
                        className="mb-3 flex items-center gap-2 font-bold"
                        style={{ color: "var(--success)" }}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Strengths
                      </h3>
                      <ul className="space-y-1.5">
                        {feedback.topStrengths.map((s, i) => (
                          <motion.li
                            key={i}
                            className="flex items-start gap-2 text-sm"
                            style={{ color: "var(--dl-text-primary, #1B2030)" }}
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 + i * 0.1, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          >
                            <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "var(--success)" }} />
                            {s}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {/* Issues — subtle attention pulse */}
                  {feedback.criticalIssues.length > 0 && (
                    <motion.div
                      className="dl-card-hover card"
                      style={{ borderColor: "rgba(239,68,68,0.25)", backgroundColor: "var(--error-light)" }}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.4 }}
                    >
                      <h3
                        className="mb-3 flex items-center gap-2 font-bold"
                        style={{ color: "var(--error)" }}
                      >
                        <motion.span
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ delay: 1.5, duration: 0.5 }}
                        >
                          <AlertCircle className="h-4 w-4" />
                        </motion.span>
                        Critical Issues
                      </h3>
                      <ul className="space-y-1.5">
                        {feedback.criticalIssues.map((s, i) => (
                          <motion.li
                            key={i}
                            className="flex items-start gap-2 text-sm"
                            style={{ color: "var(--dl-text-primary, #1B2030)" }}
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.1 + i * 0.08, duration: 0.3 }}
                          >
                            <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "var(--error)" }} />
                            {s}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {/* Red flags — cliche / overused patterns detected */}
                  {feedback.redFlags && feedback.redFlags.length > 0 && (
                    <div
                      className="dl-card-hover card"
                      style={{ borderColor: "rgba(234,179,8,0.3)", backgroundColor: "rgba(254,249,195,0.3)" }}
                    >
                      <h3
                        className="mb-3 flex items-center gap-2 font-bold text-sm"
                        style={{ color: "#B45309" }}
                      >
                        <AlertCircle className="h-4 w-4" />
                        Red Flags
                        <span className="ml-1 text-xs font-normal" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                          (overused phrases or cliches admissions readers flag)
                        </span>
                      </h3>
                      <ul className="space-y-1.5">
                        {feedback.redFlags.map((flag, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                            <span className="mt-0.5 shrink-0 text-xs" style={{ color: "#B45309" }}>
                              ⚠
                            </span>
                            <span className="font-mono text-xs" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                              &ldquo;{flag}&rdquo;
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Counselor Note — the honest percentile assessment */}
                  {feedback.counselorNote && (
                    <div
                      className="dl-card-hover card"
                      style={{ borderColor: "rgba(74,111,165,0.25)", borderLeftWidth: "4px", borderLeftColor: "#4A6FA5" }}
                    >
                      <h3
                        className="mb-3 flex items-center gap-2 text-sm font-bold"
                        style={{ color: "#4A6FA5" }}
                      >
                        <Zap className="h-4 w-4" />
                        Counselor Assessment
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                        {feedback.counselorNote}
                      </p>
                    </div>
                  )}

                  {/* Voice Rubric with evidence */}
                  {feedback.voiceRubric && (
                    <div className="dl-card-hover card space-y-3">
                      <h3
                        className="font-bold"
                        style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                      >
                        Voice Rubric (College Essay Guy 4-Axis)
                      </h3>
                      <div className="space-y-3">
                        {(["place", "detail", "vulnerability", "surprise"] as const).map((axis) => {
                          const raw = feedback.voiceRubric?.[axis];
                          const isDetailed = raw && typeof raw === "object" && "score" in raw;
                          const score = isDetailed ? safeScore((raw as VoiceAxisDetail).score) : safeScore(raw);
                          const evidence = isDetailed ? (raw as VoiceAxisDetail).evidence : null;
                          const labels: Record<string, string> = { place: "Place", detail: "Detail", vulnerability: "Vulnerability", surprise: "Surprise" };
                          return (
                            <div key={axis}>
                              <DimensionBar label={labels[axis]} score={score} delay={0} />
                              {evidence && (
                                <p className="mt-1.5 text-xs leading-relaxed pl-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                                  {evidence}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {feedback.craftAnalysis && (
                    <div className="dl-card-hover card">
                      <h3 className="font-bold" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>
                        Complete craft diagnostic
                      </h3>
                      <div className="mt-4 divide-y" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                        {(Object.entries(feedback.craftAnalysis) as Array<[keyof CraftAnalysis, string]>).map(([key, value]) => (
                          <div key={key} className="py-3 first:pt-0 last:pb-0">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                              {key.replace(/([A-Z])/g, " $1")}
                            </p>
                            <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {feedback.revisionPriorities && feedback.revisionPriorities.length > 0 && (
                    <div className="dl-card-hover card">
                      <h3 className="font-bold" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>
                        Exact revision priorities
                      </h3>
                      <ol className="mt-4 space-y-4">
                        {feedback.revisionPriorities.map((priority) => (
                          <li key={priority.rank} className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: "#4A6FA5" }}>{priority.rank}</span>
                            <div className="min-w-0 text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                              <p className="font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{priority.issue}</p>
                              <p className="mt-1"><span className="font-semibold">Draft evidence:</span> &ldquo;{priority.evidence}&rdquo;</p>
                              <p className="mt-1"><span className="font-semibold">Revise:</span> {priority.instruction}</p>
                              <p className="mt-1"><span className="font-semibold">Done when:</span> {priority.successCheck}</p>
                            </div>
                          </li>
                        ))}
                      </ol>
                      {feedback.authorshipPolicy && (
                        <p className="mt-4 border-t pt-4 text-xs leading-relaxed" style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-muted, #5A6275)" }}>
                          {feedback.authorshipPolicy}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Structure Analysis */}
                  {feedback.structureAnalysis && (
                    <div className="dl-card-hover card space-y-3">
                      <h3
                        className="font-bold"
                        style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                      >
                        Structure Analysis
                      </h3>
                      {feedback.structureAnalysis.arc && (
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-1" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                            Narrative Arc
                          </p>
                          <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                            {feedback.structureAnalysis.arc}
                          </p>
                        </div>
                      )}
                      {feedback.structureAnalysis.momentumDrop && (
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-1" style={{ color: "#D97706" }}>
                            Momentum Drop
                          </p>
                          <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                            {feedback.structureAnalysis.momentumDrop}
                          </p>
                        </div>
                      )}
                      {feedback.structureAnalysis.endingVerdict && (
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-1" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                            Ending Verdict
                          </p>
                          <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                            {feedback.structureAnalysis.endingVerdict}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Cliches — detailed with alternatives */}
                  {feedback.cliches && feedback.cliches.length > 0 && (
                    <div
                      className="dl-card-hover card"
                      style={{ borderColor: "rgba(234,179,8,0.3)", backgroundColor: "rgba(254,249,195,0.15)" }}
                    >
                      <h3
                        className="mb-3 flex items-center gap-2 font-bold text-sm"
                        style={{ color: "#B45309" }}
                      >
                        <AlertCircle className="h-4 w-4" />
                        Cliches Detected
                        <span className="ml-1 text-xs font-normal" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                          (with specific alternatives)
                        </span>
                      </h3>
                      <div className="space-y-3">
                        {feedback.cliches.map((c, i) => (
                          <div
                            key={i}
                            className="rounded-lg p-3"
                            style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
                          >
                            <p className="font-mono text-xs font-semibold" style={{ color: "#B45309" }}>
                              &ldquo;{c.phrase}&rdquo;
                            </p>
                            <p className="mt-1 text-[11px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                              {c.location}
                            </p>
                            <p className="mt-1.5 text-xs leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                              {c.why}
                            </p>
                            <p className="mt-2 text-xs leading-relaxed font-medium" style={{ color: "#4A6FA5" }}>
                              Try instead: {c.alternative}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Signals */}
                  {feedback.aiSignals && feedback.aiSignals.length > 0 && (
                    <div
                      className="dl-card-hover card"
                      style={{ borderColor: "rgba(74,111,165,0.25)", backgroundColor: "rgba(74,111,165,0.06)" }}
                    >
                      <h3
                        className="mb-3 flex items-center gap-2 font-bold text-sm"
                        style={{ color: "#4A6FA5" }}
                      >
                        <AlertCircle className="h-4 w-4" />
                        AI-Generation Signals
                        <span className="ml-1 text-xs font-normal" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                          (patterns that may flag as AI-written)
                        </span>
                      </h3>
                      <ul className="space-y-1.5">
                        {feedback.aiSignals.map((signal, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                            <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "#4A6FA5" }} />
                            {signal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Prompt Fit + Recommendation */}
                  {feedback.promptFit && (
                    <div className="dl-card-hover card space-y-2">
                      <div className="flex items-baseline justify-between">
                        <h3
                          className="font-bold text-sm"
                          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                        >
                          Prompt Fit
                        </h3>
                        <span
                          className="text-lg font-bold tabular-nums"
                          style={{ color: getScoreColor(safeScore(feedback.promptFit.score)) }}
                        >
                          {safeScore(feedback.promptFit.score)}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                        {feedback.promptFit.feedback}
                      </p>
                      {feedback.promptRecommendation && feedback.promptRecommendation !== "Current prompt is the best fit." && (
                        <p className="text-sm leading-relaxed font-medium" style={{ color: "#4A6FA5" }}>
                          {feedback.promptRecommendation}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Calibration */}
                  {feedback.calibration && (
                    <div className="dl-card-hover card">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-1.5" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                        School Calibration
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                        {feedback.calibration}
                      </p>
                    </div>
                  )}

                  {/* Inline essay annotations — highlights edits in the essay body */}
                  {feedback.lineEdits.length > 0 && content.trim() && (
                    <InlineEssayEdits content={content} lineEdits={feedback.lineEdits} />
                  )}

                  {/* Upgrade teaser — blurred rewrite suggestions preview */}
                  <motion.div
                    className="dl-card-hover card overflow-hidden"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.35 }}
                    style={{
                      background: "linear-gradient(135deg, rgba(30,51,82,0.06), rgba(74,111,165,0.04))",
                      borderColor: "rgba(30,51,82,0.2)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                        style={{ background: "#1E3352" }}
                      >
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-sm font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                        Pro members get specific rewrite suggestions for every paragraph
                      </p>
                    </div>

                    {/* Blurred rewrite suggestion previews */}
                    <div className="space-y-2.5 mb-4">
                      {[
                        {
                          original: feedback.lineEdits[0]?.original || "Your opening paragraph tells instead of shows...",
                          rewrite: "Replace the abstract claim with a concrete scene. Start with the moment you realized...",
                          reason: "Specificity",
                        },
                        {
                          original: feedback.lineEdits[1]?.original || "The transition between paragraphs 2 and 3 drops momentum...",
                          rewrite: "Bridge the gap by echoing the sensory detail from the previous paragraph into...",
                          reason: "Storytelling",
                        },
                        {
                          original: "Your conclusion restates the thesis without deepening the insight...",
                          rewrite: "End on the unresolved tension — what you still don't know shows more growth than...",
                          reason: "Insight",
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="relative rounded-xl border p-3 overflow-hidden"
                          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.4)" }}
                        >
                          <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#4A6FA5" }}>
                            {item.reason}
                          </p>
                          <p
                            className="text-[11px] leading-relaxed mb-1 select-none"
                            style={{
                              color: "var(--dl-text-muted, #5A6275)",
                              textDecoration: "line-through",
                              filter: "blur(3px)",
                              WebkitFilter: "blur(3px)",
                              userSelect: "none",
                            }}
                          >
                            {item.original}
                          </p>
                          <p
                            className="text-[11px] leading-relaxed font-medium select-none"
                            style={{
                              color: "#4A6FA5",
                              filter: "blur(4px)",
                              WebkitFilter: "blur(4px)",
                              userSelect: "none",
                            }}
                          >
                            {item.rewrite}
                          </p>
                          <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{ background: "rgba(255,255,255,0.1)" }}
                          >
                            <span
                              className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
                              style={{ background: "rgba(74,111,165,0.12)", color: "#4A6FA5" }}
                            >
                              Pro
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="text-[12px] leading-snug mb-3" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                      Pro members get paragraph-by-paragraph suggestions, essay runs without the Free-plan cap, and supplemental scoring for schools on their list.
                    </p>

                    <Link
                      href="/pricing"
                      className="dl-btn dl-btn-primary dl-btn-sm w-full justify-center"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Unlock rewrite suggestions — $19.99/mo
                    </Link>
                  </motion.div>

                  {/* Next steps after feedback */}
                  <motion.div
                    className="dl-card-hover card"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.35 }}
                    style={{
                      background: "linear-gradient(135deg, rgba(74,111,165,0.06), rgba(30,51,82,0.04))",
                      borderColor: "rgba(74,111,165,0.2)",
                    }}
                  >
                    <p
                      className="text-[11px] font-bold uppercase tracking-[0.12em] mb-3"
                      style={{ color: "#4A6FA5" }}
                    >
                      Next steps
                    </p>
                    <div className="space-y-2">
                      <Link
                        href="/analyze"
                        className="flex items-center gap-3 rounded-xl border p-3 transition-all duration-200 hover:border-[rgba(74,111,165,0.25)] hover:shadow-sm"
                        style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.6)" }}
                      >
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                          style={{ background: "rgba(74,111,165,0.10)", color: "#4A6FA5" }}
                        >
                          <Zap className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </span>
                        <div>
                          <p className="text-[12px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Re-run your profile analysis</p>
                          <p className="text-[11px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>See how your essay score affects your overall profile</p>
                        </div>
                      </Link>
                      <button
                        onClick={() => {
                          setFeedback(null);
                          setContent("");
                          setPrompt("");
                          if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 hover:border-[rgba(74,111,165,0.25)] hover:shadow-sm"
                        style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.6)" }}
                      >
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                          style={{ background: "rgba(74,111,165,0.10)", color: "#4A6FA5" }}
                        >
                          <FileText className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </span>
                        <div>
                          <p className="text-[12px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Score another essay</p>
                          <p className="text-[11px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>Score a supplemental or different draft</p>
                        </div>
                      </button>
                    </div>
                  </motion.div>

                  {/* Fallback line edits list (shown when no essay content or as reference) */}
                  {feedback.lineEdits.length > 0 && !content.trim() && (
                    <div className="card space-y-3">
                      <h3
                        className="font-bold"
                        style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                      >
                        Line Edits
                      </h3>
                      {feedback.lineEdits.map((e, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="rounded-xl p-4 text-sm"
                          style={{ backgroundColor: "rgba(255,255,255,0.45)" }}
                        >
                          <p
                            className="mb-1.5 font-mono text-xs line-through"
                            style={{ color: "var(--dl-text-muted, #5A6275)" }}
                          >
                            {e.original}
                          </p>
                          <p
                            className="mb-2 font-mono text-xs font-semibold"
                            style={{ color: "#4A6FA5" }}
                          >
                            {e.suggestion}
                          </p>
                          {e.direction && (
                            <p className="text-xs leading-relaxed mb-1.5" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                              {e.direction}
                            </p>
                          )}
                          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                            {e.reason}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="sticky top-24"
                >
                  <div
                    className="dl-card-hover card flex min-h-80 flex-col items-center justify-center text-center"
                    style={{
                      background: "rgba(255,255,255,0.45)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    {loading ? (
                      <div className="flex flex-col items-center gap-4">
                        <motion.div
                          className="flex h-16 w-16 items-center justify-center rounded-2xl"
                          style={{ background: "#4A6FA5" }}
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Sparkles className="h-7 w-7 text-white" />
                        </motion.div>
                        <div>
                          <p
                            className="font-bold"
                            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                          >
                            Analyzing your essay…
                          </p>
                          <p className="mt-1 text-sm" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                            Scoring across the six rubric dimensions.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div
                          className="mb-4 flex items-center justify-center"
                          style={{ color: "#4A6FA5" }}
                        >
                          <EmptyEssays size={96} />
                        </div>
                        <p
                          className="font-bold"
                          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                        >
                          Your story deserves to be heard.
                        </p>
                        <p className="mt-1.5 max-w-xs text-sm" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                          Paste your draft. We&apos;ll review voice, narrative, specificity, reflection, structure, and mechanics, then give you concrete revision priorities.
                        </p>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
