"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Clock, ChevronRight, ChevronDown, ArrowLeft,
  Mic, Play, Pause, RotateCcw, Send, Loader2, Lock, Star,
  CheckCircle2, AlertCircle, TrendingUp, Target, Lightbulb,
} from "lucide-react";
import {
  INTERVIEW_QUESTIONS,
  INTERVIEW_CATEGORIES,
  type InterviewQuestion,
  type InterviewCategory,
} from "@/data/interview-questions";

// ─── Types ──────────────────────────────────────────────────────────────

type ScoreDimension = "clarity" | "specificity" | "authenticity" | "relevance" | "confidence";

type FeedbackResult = {
  scores: Record<ScoreDimension, number>;
  overallScore: number;
  strengths: string[];
  improvements: string[];
  improvedVersion: string;
  schoolNote?: string;
  followUpPrediction: string;
  verdict: string;
  dimensionFeedback?: Record<ScoreDimension, {
    score: number;
    evidence: string;
    explanation: string;
    practiceAction: string;
  }>;
  practicePlan?: Array<{ priority: number; action: string; successCheck: string }>;
  assessmentDisclaimer?: string;
};

type PracticeRecord = {
  questionId: string;
  score: number;
  timestamp: number;
};

type ViewState = "browse" | "practice" | "feedback";

// ─── Helpers ────────────────────────────────────────────────────────────

const TIMER_SECONDS = 120; // 2 minutes per question

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#16A34A";
  if (score >= 60) return "#D97706";
  return "#DC2626";
}

function getScoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Strong";
  if (score >= 70) return "Good";
  if (score >= 60) return "Developing";
  if (score >= 50) return "Needs Work";
  return "Weak";
}

function getDifficultyColor(d: string): string {
  if (d === "easy") return "#16A34A";
  if (d === "medium") return "#D97706";
  return "#DC2626";
}

function loadProgress(): PracticeRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("admitpath:interview-progress");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveProgress(records: PracticeRecord[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("admitpath:interview-progress", JSON.stringify(records));
}

// ─── Score Ring Component ───────────────────────────────────────────────

function ScoreRing({ score, size = 64, strokeWidth = 5 }: { score: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
        />
      </svg>
      <span
        className="absolute text-sm font-bold"
        style={{ color }}
      >
        {score}
      </span>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────

export function InterviewPracticeClient() {
  const [view, setView] = useState<ViewState>("browse");
  const [selectedCategory, setSelectedCategory] = useState<InterviewCategory | "all">("all");
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion | null>(null);
  const [answer, setAnswer] = useState("");
  const [targetSchool, setTargetSchool] = useState("");
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState<PracticeRecord[]>([]);
  const [expandedTips, setExpandedTips] = useState<string | null>(null);

  // Timer
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load progress on mount
  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  // Timer effect
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            setTimerActive(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, timeLeft]);

  const filteredQuestions =
    selectedCategory === "all"
      ? INTERVIEW_QUESTIONS
      : INTERVIEW_QUESTIONS.filter((q) => q.category === selectedCategory);

  const practicedIds = new Set(progress.map((r) => r.questionId));
  const averageScore =
    progress.length > 0
      ? Math.round(progress.reduce((sum, r) => sum + r.score, 0) / progress.length)
      : 0;

  const startPractice = useCallback((q: InterviewQuestion) => {
    setSelectedQuestion(q);
    setAnswer("");
    setFeedback(null);
    setError("");
    setTimeLeft(TIMER_SECONDS);
    setTimerActive(false);
    setView("practice");
    setTimeout(() => textareaRef.current?.focus(), 100);
  }, []);

  const resetPractice = useCallback(() => {
    setAnswer("");
    setTimeLeft(TIMER_SECONDS);
    setTimerActive(false);
    setFeedback(null);
    setError("");
    setTimeout(() => textareaRef.current?.focus(), 100);
  }, []);

  const submitAnswer = useCallback(async () => {
    if (!selectedQuestion || answer.trim().length < 20) {
      setError("Please write at least a few sentences before submitting.");
      return;
    }

    setLoading(true);
    setError("");
    setTimerActive(false);

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: selectedQuestion.question,
          answer: answer.trim(),
          targetSchool: targetSchool || undefined,
          category: selectedQuestion.category,
          difficulty: selectedQuestion.difficulty,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "The server response could not be read. Please try again." }));
        if (res.status === 429 && data.upgradeUrl) {
          setError("You've reached the Free-plan limit of 5 feedback sessions. Upgrade to remove that cap.");
        } else if (res.status === 401) {
          setError("Please sign in to use AI feedback.");
        } else {
          setError(data.error || "Failed to get feedback. Please try again.");
        }
        return;
      }

      const data = await res.json();
      const fb = data.feedback as FeedbackResult;
      setFeedback(fb);
      setView("feedback");

      // Save progress
      const record: PracticeRecord = {
        questionId: selectedQuestion.id,
        score: fb.overallScore,
        timestamp: Date.now(),
      };
      const updated = [...progress, record];
      setProgress(updated);
      saveProgress(updated);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedQuestion, answer, targetSchool, progress]);

  // ─── Browse View ────────────────────────────────────────────────────

  if (view === "browse") {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
        {/* Nav placeholder */}
        <div className="border-b" style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)" }}>
          <div className="mx-auto max-w-5xl px-4 h-[68px] flex items-center justify-between">
            <Link href="/tools" className="flex items-center gap-2 text-sm font-medium" style={{ color: "#4A6FA5" }}>
              <ArrowLeft className="h-4 w-4" />
              Back to tools
            </Link>
          </div>

        </div>

        <main className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
          {/* Header */}
          <header className="mb-10 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#4A6FA5" }}>
              AI Interview Coach
            </p>
            <h1
              className="mb-3 text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight"
              style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
            >
              Practice. Get scored. Nail the interview.
            </h1>
            <p
              className="mx-auto max-w-2xl text-base leading-relaxed"
              style={{ color: "var(--dl-text-secondary, #454B5E)" }}
            >
              {INTERVIEW_QUESTIONS.length} real questions from Harvard, Yale, MIT, Stanford, and Georgetown alumni interviews.
              Practice your answers, get AI feedback on 5 dimensions, and track your progress.
            </p>
          </header>

          {/* Progress bar */}
          {progress.length > 0 && (
            <div
              className="mb-8 rounded-xl border p-5"
              style={{ background: "rgba(255,255,255,0.5)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
            >
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5" style={{ color: "#16A34A" }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                      {practicedIds.size} / {INTERVIEW_QUESTIONS.length} practiced
                    </p>
                    <p className="text-xs" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
                      {Math.round((practicedIds.size / INTERVIEW_QUESTIONS.length) * 100)}% complete
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5" style={{ color: "#4A6FA5" }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                      Average: {averageScore}/100
                    </p>
                    <p className="text-xs" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
                      {getScoreLabel(averageScore)}
                    </p>
                  </div>
                </div>
                <div className="flex-1" />
                <div className="h-2 w-40 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(practicedIds.size / INTERVIEW_QUESTIONS.length) * 100}%`,
                      background: "linear-gradient(135deg, #4A6FA5, #2E4A6E)",
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Category filter */}
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className="rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all"
              style={{
                borderColor: selectedCategory === "all" ? "#4A6FA5" : "rgba(0,0,0,0.06)",
                backgroundColor: selectedCategory === "all" ? "rgba(74,111,165,0.1)" : "rgba(255,255,255,0.5)",
                color: selectedCategory === "all" ? "#4A6FA5" : "var(--dl-text-secondary, #454B5E)",
              }}
            >
              All ({INTERVIEW_QUESTIONS.length})
            </button>
            {(Object.entries(INTERVIEW_CATEGORIES) as [InterviewCategory, typeof INTERVIEW_CATEGORIES[InterviewCategory]][]).map(
              ([key, cat]) => {
                const count = INTERVIEW_QUESTIONS.filter((q) => q.category === key).length;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className="rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all"
                    style={{
                      borderColor: selectedCategory === key ? cat.color : "rgba(0,0,0,0.06)",
                      backgroundColor: selectedCategory === key ? `${cat.color}15` : "rgba(255,255,255,0.5)",
                      color: selectedCategory === key ? cat.color : "var(--dl-text-secondary, #454B5E)",
                    }}
                  >
                    {cat.label} ({count})
                  </button>
                );
              },
            )}
          </div>

          {/* Question cards */}
          <div className="space-y-3">
            {filteredQuestions.map((q) => {
              const practiced = practicedIds.has(q.id);
              const lastScore = [...progress].reverse().find((r) => r.questionId === q.id)?.score;
              const catInfo = INTERVIEW_CATEGORIES[q.category];
              const isExpanded = expandedTips === q.id;

              return (
                <div
                  key={q.id}
                  className="rounded-xl border transition-all"
                  style={{
                    background: "rgba(255,255,255,0.45)",
                    backdropFilter: "blur(12px)",
                    borderColor: "rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        {/* Category + difficulty badges */}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span
                            className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
                            style={{ backgroundColor: `${catInfo.color}12`, color: catInfo.color }}
                          >
                            {catInfo.label}
                          </span>
                          <span
                            className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize"
                            style={{
                              backgroundColor: `${getDifficultyColor(q.difficulty)}12`,
                              color: getDifficultyColor(q.difficulty),
                            }}
                          >
                            {q.difficulty}
                          </span>
                          {q.schools && q.schools.length > 0 && (
                            <span className="text-[10px]" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
                              {q.schools.slice(0, 3).join(", ")}
                              {q.schools.length > 3 && ` +${q.schools.length - 3}`}
                            </span>
                          )}
                          {practiced && lastScore !== undefined && (
                            <span
                              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                              style={{ backgroundColor: `${getScoreColor(lastScore)}12`, color: getScoreColor(lastScore) }}
                            >
                              <Star className="h-2.5 w-2.5" />
                              {lastScore}
                            </span>
                          )}
                        </div>

                        {/* Question text */}
                        <h3
                          className="text-[15px] font-semibold leading-snug mb-2"
                          style={{ color: "var(--dl-text-primary, #1B2030)" }}
                        >
                          &ldquo;{q.question}&rdquo;
                        </h3>

                        {/* Tips toggle */}
                        <button
                          onClick={() => setExpandedTips(isExpanded ? null : q.id)}
                          className="flex items-center gap-1 text-xs font-medium transition-colors hover:opacity-80"
                          style={{ color: "#4A6FA5" }}
                        >
                          {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                          Tips & common mistakes
                        </button>
                      </div>

                      {/* Practice button */}
                      <button
                        onClick={() => startPractice(q)}
                        aria-label={`Practice: ${q.question}`}
                        className="shrink-0 flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-md active:scale-[0.97]"
                        style={{ background: "linear-gradient(135deg, #4A6FA5, #2E4A6E)" }}
                      >
                        <Mic className="h-3.5 w-3.5" />
                        Practice
                      </button>
                    </div>

                    {/* Expanded tips */}
                    {isExpanded && (
                      <div className="mt-4 space-y-3 border-t pt-4" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                        <div>
                          <p className="text-xs font-semibold mb-1.5 flex items-center gap-1.5" style={{ color: "#16A34A" }}>
                            <Lightbulb className="h-3 w-3" /> Tips
                          </p>
                          <ul className="space-y-1">
                            {q.tips.map((tip, i) => (
                              <li key={i} className="text-xs leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-semibold mb-1.5 flex items-center gap-1.5" style={{ color: "#DC2626" }}>
                            <AlertCircle className="h-3 w-3" /> Common mistakes
                          </p>
                          <ul className="space-y-1">
                            {q.commonMistakes.map((m, i) => (
                              <li key={i} className="text-xs leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                                {m}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {q.followUps.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold mb-1.5" style={{ color: "#4A6FA5" }}>
                              Likely follow-ups
                            </p>
                            <ul className="space-y-1">
                              {q.followUps.map((f, i) => (
                                <li key={i} className="text-xs leading-relaxed italic" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                                  &ldquo;{f}&rdquo;
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div
            className="mt-12 rounded-2xl border p-8 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(74,111,165,0.06), rgba(46,74,110,0.03))",
              borderColor: "rgba(74,111,165,0.15)",
            }}
          >
            <h2
              className="mb-2 text-xl font-bold"
              style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
            >
              Remove the Free-plan practice cap
            </h2>
            <p className="mb-5 text-sm" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              The Free plan includes 5 AI feedback sessions. Pro removes that cap and keeps school-specific coaching and progress history available.
            </p>
            <Link
              href="/billing"
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg active:scale-[0.97]"
              style={{ background: "linear-gradient(135deg, #4A6FA5, #2E4A6E)" }}
            >
              View plans
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // ─── Practice View ──────────────────────────────────────────────────

  if (view === "practice" && selectedQuestion) {
    const catInfo = INTERVIEW_CATEGORIES[selectedQuestion.category];

    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
        {/* Top bar */}
        <div className="border-b" style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)" }}>
          <div className="mx-auto max-w-3xl px-4 h-[68px] flex items-center justify-between">
            <button
              onClick={() => setView("browse")}
              className="flex items-center gap-2 text-sm font-medium"
              style={{ color: "#4A6FA5" }}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to questions
            </button>

            {/* Timer */}
            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-2 rounded-full px-3 py-1.5"
                style={{
                  backgroundColor: timeLeft <= 30 ? "rgba(220,38,38,0.1)" : "rgba(74,111,165,0.08)",
                  color: timeLeft <= 30 ? "#DC2626" : "#4A6FA5",
                }}
              >
                <Clock className="h-3.5 w-3.5" />
                <span className="text-sm font-mono font-semibold tabular-nums">{formatTime(timeLeft)}</span>
              </div>
              {!timerActive ? (
                <button
                  onClick={() => setTimerActive(true)}
                  className="rounded-full p-2 transition-colors hover:bg-black/5"
                  title="Start timer"
                >
                  <Play className="h-4 w-4" style={{ color: "#4A6FA5" }} />
                </button>
              ) : (
                <button
                  onClick={() => setTimerActive(false)}
                  className="rounded-full p-2 transition-colors hover:bg-black/5"
                  title="Pause timer"
                >
                  <Pause className="h-4 w-4" style={{ color: "#4A6FA5" }} />
                </button>
              )}
              <button
                onClick={resetPractice}
                className="rounded-full p-2 transition-colors hover:bg-black/5"
                title="Reset"
              >
                <RotateCcw className="h-4 w-4" style={{ color: "var(--dl-text-muted, #8890A5)" }} />
              </button>
            </div>
          </div>
        </div>

        <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
          {/* Question card */}
          <div
            className="mb-6 rounded-xl border p-6"
            style={{ background: "rgba(255,255,255,0.5)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span
                className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={{ backgroundColor: `${catInfo.color}12`, color: catInfo.color }}
              >
                {catInfo.label}
              </span>
              <span
                className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize"
                style={{
                  backgroundColor: `${getDifficultyColor(selectedQuestion.difficulty)}12`,
                  color: getDifficultyColor(selectedQuestion.difficulty),
                }}
              >
                {selectedQuestion.difficulty}
              </span>
            </div>
            <h2
              className="text-lg sm:text-xl font-bold"
              style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
            >
              &ldquo;{selectedQuestion.question}&rdquo;
            </h2>
          </div>

          {/* Target school input */}
          <div className="mb-4">
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Target school (optional — enables school-specific feedback)
            </label>
            <input
              type="text"
              value={targetSchool}
              onChange={(e) => setTargetSchool(e.target.value)}
              placeholder="e.g., Harvard, MIT, Georgetown"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-[#4A6FA5]"
              style={{
                borderColor: "rgba(0,0,0,0.08)",
                backgroundColor: "rgba(255,255,255,0.6)",
                color: "var(--dl-text-primary, #1B2030)",
              }}
            />
          </div>

          {/* Answer textarea */}
          <div className="mb-4">
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Your answer ({answer.trim().split(/\s+/).filter(Boolean).length} words)
            </label>
            <textarea
              ref={textareaRef}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer as you would say it in a real interview. Aim for 100-250 words (about 1-2 minutes of speaking)."
              rows={10}
              className="w-full rounded-xl border px-4 py-3 text-sm leading-relaxed outline-none transition-colors focus:border-[#4A6FA5] resize-none"
              style={{
                borderColor: "rgba(0,0,0,0.08)",
                backgroundColor: "rgba(255,255,255,0.6)",
                color: "var(--dl-text-primary, #1B2030)",
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <div
              className="mb-4 flex items-start gap-2 rounded-lg border px-4 py-3 text-sm"
              style={{ borderColor: "rgba(220,38,38,0.2)", backgroundColor: "rgba(220,38,38,0.05)", color: "#DC2626" }}
            >
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            onClick={submitAnswer}
            disabled={loading || answer.trim().length < 20}
            className="w-full flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #4A6FA5, #2E4A6E)" }}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Scoring your answer...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Get AI feedback
              </>
            )}
          </button>

          {/* Tips hint */}
          <div className="mt-6 space-y-2">
            <p className="text-xs font-semibold" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
              Quick tips for this question:
            </p>
            {selectedQuestion.tips.map((tip, i) => (
              <p key={i} className="text-xs leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {tip}
              </p>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // ─── Feedback View ──────────────────────────────────────────────────

  if (view === "feedback" && selectedQuestion && feedback) {
    const dimensions: { key: ScoreDimension; label: string; icon: typeof Target }[] = [
      { key: "clarity", label: "Clarity", icon: Target },
      { key: "specificity", label: "Specificity", icon: Target },
      { key: "authenticity", label: "Authenticity", icon: Target },
      { key: "relevance", label: "Relevance", icon: Target },
      { key: "confidence", label: "Confidence", icon: Target },
    ];

    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
        {/* Top bar */}
        <div className="border-b" style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)" }}>
          <div className="mx-auto max-w-3xl px-4 h-[68px] flex items-center justify-between">
            <button
              onClick={() => setView("browse")}
              className="flex items-center gap-2 text-sm font-medium"
              style={{ color: "#4A6FA5" }}
            >
              <ArrowLeft className="h-4 w-4" />
              All questions
            </button>
            <button
              onClick={() => startPractice(selectedQuestion)}
              className="flex items-center gap-2 text-sm font-medium"
              style={{ color: "#4A6FA5" }}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Try again
            </button>
          </div>
        </div>

        <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
          {/* Question recap */}
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#4A6FA5" }}>
              Feedback for
            </p>
            <h2
              className="text-lg font-bold"
              style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
            >
              &ldquo;{selectedQuestion.question}&rdquo;
            </h2>
          </div>

          {/* Overall score */}
          <div
            className="mb-6 rounded-xl border p-6 flex items-center gap-6"
            style={{ background: "rgba(255,255,255,0.5)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
          >
            <ScoreRing score={feedback.overallScore} size={80} strokeWidth={6} />
            <div>
              <p className="text-xl font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                {getScoreLabel(feedback.overallScore)}
              </p>
              <p className="text-sm" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {feedback.verdict}
              </p>
            </div>
          </div>

          {/* Dimension scores */}
          <div
            className="mb-6 rounded-xl border p-5"
            style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
          >
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Score breakdown
            </h3>
            <div className="space-y-3">
              {dimensions.map(({ key, label }) => {
                const score = feedback.scores[key] ?? 0;
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="w-24 text-xs font-medium" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                      {label}
                    </span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${score}%`,
                          backgroundColor: getScoreColor(score),
                        }}
                      />
                    </div>
                    <span
                      className="w-8 text-right text-xs font-bold"
                      style={{ color: getScoreColor(score) }}
                    >
                      {score}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {feedback.dimensionFeedback && (
            <div className="mb-6 rounded-xl border p-5" style={{ background: "rgba(255,255,255,0.45)", borderColor: "rgba(0,0,0,0.06)" }}>
              <h3 className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Why each score</h3>
              <div className="mt-4 space-y-4">
                {dimensions.map(({ key, label }) => {
                  const detail = feedback.dimensionFeedback?.[key];
                  if (!detail) return null;
                  return (
                    <div key={key} className="border-l-2 pl-3" style={{ borderColor: getScoreColor(detail.score) }}>
                      <p className="text-xs font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{label} · {detail.score}/100</p>
                      <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}><span className="font-semibold">Answer evidence:</span> &ldquo;{detail.evidence}&rdquo;</p>
                      <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{detail.explanation}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Strengths */}
          {feedback.strengths.length > 0 && (
            <div
              className="mb-4 rounded-xl border p-5"
              style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
            >
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "#16A34A" }}>
                <CheckCircle2 className="h-4 w-4" />
                Strengths
              </h3>
              <ul className="space-y-2">
                {feedback.strengths.map((s, i) => (
                  <li key={i} className="text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Improvements */}
          {feedback.improvements.length > 0 && (
            <div
              className="mb-4 rounded-xl border p-5"
              style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
            >
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "#D97706" }}>
                <TrendingUp className="h-4 w-4" />
                Areas for improvement
              </h3>
              <ul className="space-y-2">
                {feedback.improvements.map((s, i) => (
                  <li key={i} className="text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {feedback.practicePlan && feedback.practicePlan.length > 0 && (
            <div className="mb-4 rounded-xl border p-5" style={{ background: "rgba(74,111,165,0.04)", borderColor: "rgba(74,111,165,0.12)" }}>
              <h3 className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Ordered practice plan</h3>
              <ol className="mt-3 space-y-3">
                {feedback.practicePlan.map((item) => (
                  <li key={item.priority} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: "#4A6FA5" }}>{item.priority}</span>
                    <span><span className="font-semibold">Practice:</span> {item.action}<br /><span className="font-semibold">Done when:</span> {item.successCheck}</span>
                  </li>
                ))}
              </ol>
              {feedback.assessmentDisclaimer && <p className="mt-4 text-xs leading-relaxed" style={{ color: "var(--dl-text-muted, #5A6275)" }}>{feedback.assessmentDisclaimer}</p>}
            </div>
          )}

          {/* Improved version */}
          {feedback.improvedVersion && (
            <div
              className="mb-4 rounded-xl border p-5"
              style={{ background: "rgba(74,111,165,0.04)", borderColor: "rgba(74,111,165,0.12)" }}
            >
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "#4A6FA5" }}>
                <Lightbulb className="h-4 w-4" />
                Stronger version
              </h3>
              <p className="text-sm leading-relaxed italic" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                &ldquo;{feedback.improvedVersion}&rdquo;
              </p>
            </div>
          )}

          {/* School note */}
          {feedback.schoolNote && (
            <div
              className="mb-4 rounded-xl border p-5"
              style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
            >
              <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                School-specific note
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {feedback.schoolNote}
              </p>
            </div>
          )}

          {/* Follow-up prediction */}
          {feedback.followUpPrediction && (
            <div
              className="mb-6 rounded-xl border p-5"
              style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
            >
              <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                Predicted follow-up question
              </h3>
              <p className="text-sm leading-relaxed italic" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                &ldquo;{feedback.followUpPrediction}&rdquo;
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => startPractice(selectedQuestion)}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold border transition-all hover:bg-white/50"
              style={{ borderColor: "rgba(0,0,0,0.08)", color: "var(--dl-text-primary, #1B2030)" }}
            >
              <RotateCcw className="h-4 w-4" />
              Practice again
            </button>
            <button
              onClick={() => {
                // Find next unpracticed question in same category
                const sameCategory = INTERVIEW_QUESTIONS.filter(
                  (q) => q.category === selectedQuestion.category && q.id !== selectedQuestion.id && !practicedIds.has(q.id),
                );
                const nextQ = sameCategory[0] ?? INTERVIEW_QUESTIONS.find((q) => q.id !== selectedQuestion.id && !practicedIds.has(q.id));
                if (nextQ) startPractice(nextQ);
                else setView("browse");
              }}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg active:scale-[0.97]"
              style={{ background: "linear-gradient(135deg, #4A6FA5, #2E4A6E)" }}
            >
              Next question
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* CTA */}
          <div
            className="mt-10 rounded-2xl border p-6 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(74,111,165,0.06), rgba(46,74,110,0.03))",
              borderColor: "rgba(74,111,165,0.15)",
            }}
          >
            <Lock className="h-5 w-5 mx-auto mb-2" style={{ color: "#4A6FA5" }} />
            <h3 className="text-base font-bold mb-1" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Remove the Free-plan practice cap
            </h3>
            <p className="text-xs mb-4" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Pro removes the Free-plan scoring cap and includes school-specific coaching and interview progress history.
            </p>
            <Link
              href="/billing"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg"
              style={{ background: "linear-gradient(135deg, #4A6FA5, #2E4A6E)" }}
            >
              View plans
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Fallback
  return null;
}
