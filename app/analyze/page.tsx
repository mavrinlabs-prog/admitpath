"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { track } from "@vercel/analytics";
import {
  ArrowLeft, ArrowRight, Sparkles, BarChart3, CheckCircle, AlertCircle,
  TrendingUp, ChevronRight, Zap, Target, CalendarDays, CalendarRange, CalendarCheck,
  Share2, Flag, Brain, Eye, Users, MessageCircle, GraduationCap, Lock,
} from "lucide-react";
import { getScoreColor, getDimensionColor } from "@/lib/scoring";
import { AISourceChip } from "@/components/ai-source-chip";
import { EmptyAnalyses } from "@/components/illustrations/EmptyAnalyses";
import { analytics } from "@/lib/analytics";
import { ViralShareCard } from "@/components/ViralShareCard";
import { ResumeQuickImport } from "@/components/resume-quick-import";
import { HydrationSafeSelect } from "@/components/ui/hydration-safe-select";
import { apiErrorMessage } from "@/lib/api-client";
import { missingAnalysisProfileFields } from "@/lib/profile-readiness";

type Scores = {
  academicRigor: number;
  leadership: number;
  awards: number;
  activityDepth: number;
  spike: number;
  essayQuality: number;
  recommendations: number;
};

type Odds = { label: string; percent: number; reason: string };

type SchoolOdds = {
  school: string;
  percent: number;
  tier: "reach" | "target" | "likely";
  reason: string;
  /** Server-attached calibrated band (lib/admit-rates.ts) — preferred over percent */
  band?: string;
  bandRange?: [number, number];
};

type SchoolMicroStrategy = {
  school: string;
  cdsAlignment: string;
  needleMover: string;
  essayAngle: string;
  applicationTiming: string;
  departmentReference: string;
};

type CompetitiveLandscapeEntry = {
  school: string;
  poolSize: string;
  cohortPosition: string;
  competingProfiles: string;
  differentiator: string;
};

type AnalysisResult = {
  id: string;
  scores: Scores;
  scoreExplanations?: Record<keyof Scores, string>;
  overallScore: number;
  admissionOdds: { reach: Odds; target: Odds; safety: Odds } | SchoolOdds[];
  strengths: string[];
  gaps: string[];
  spikeAnalysis?: string;
  counselorNote?: string;
  schoolMicroStrategies?: SchoolMicroStrategy[];
  psychologicalProfile?: {
    profileReading: string;
    narrativeGap: string;
  };
  eightSecondTest?: {
    currentTag: string;
    desiredTag: string;
    tagShiftStrategy: string;
  };
  competitiveLandscape?: CompetitiveLandscapeEntry[];
  honestFriendNote?: string;
  roadmap: {
    next30Days: string[];
    next90Days: string[];
    next365Days: string[];
  };
  summary: string;
  dimensionAssessments?: Record<keyof Scores, {
    score: number;
    explanation: string;
    evidenceUsed: Array<{
      text: string;
      source: "confirmed_profile" | "system_calculation" | "ai_inference";
    }>;
    inference: string;
    missingEvidence: string[];
    confidence: "low" | "medium" | "high";
    priorityAction: string;
  }>;
  priorityGaps?: Array<{
    rank: number;
    dimension: keyof Scores;
    gap: string;
    evidence: string;
    whyItMatters: string;
    action: string;
  }>;
  actionPlan?: Array<{
    priority: number;
    timeframe: "next_30_days" | "next_90_days" | "long_term";
    action: string;
    reason: string;
    linkedDimension: keyof Scores;
    successMeasure: string;
  }>;
  outcomeDisclaimer?: string;
};

const DIMENSION_ORDER: Array<keyof Scores> = [
  "academicRigor", "leadership", "awards", "activityDepth", "spike", "essayQuality", "recommendations",
];

const DIMENSION_LABELS: Record<keyof Scores, string> = {
  academicRigor: "Academic Rigor",
  leadership: "Leadership",
  awards: "Awards",
  activityDepth: "Activity Depth",
  spike: "Spike / Focus",
  essayQuality: "Essay Quality",
  recommendations: "Recommendations",
};

const DIMENSION_SHORT: Record<keyof Scores, string> = {
  academicRigor: "Academics",
  leadership: "Leadership",
  awards: "Awards",
  activityDepth: "Depth",
  spike: "Spike",
  essayQuality: "Essays",
  recommendations: "Recs",
};

/**
 * Lightweight confetti burst for high scores. CSS-only — no deps.
 * Renders 40 particles that fall and fade over ~2s, then self-removes.
 */
function confettiValue(seed: number): number {
  return ((seed * 9301 + 49297) % 233280) / 233280;
}

function ScoreConfetti() {
  const colors = ["#4A6FA5", "#2E4A6E", "#22C55E", "#0369A1", "#D4AF37"];
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: 40 + confettiValue(i * 7 + 1) * 20,
    delay: confettiValue(i * 7 + 2) * 0.3,
    duration: 1.4 + confettiValue(i * 7 + 3) * 1.2,
    color: colors[Math.floor(confettiValue(i * 7 + 4) * colors.length)],
    size: 5 + confettiValue(i * 7 + 5) * 7,
    rotation: confettiValue(i * 7 + 6) * 360,
    xDrift: (confettiValue(i * 7 + 7) - 0.5) * 260,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -10, x: 0, rotate: 0, opacity: 1 }}
          animate={{
            y: 500,
            x: p.xDrift,
            rotate: p.rotation + 540,
            opacity: [1, 1, 0],
          }}
          transition={{ duration: p.duration, delay: p.delay + 0.8, ease: "easeOut" }}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: 0,
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Defensive coercion for any score-shaped number coming back from the model.
 * The Cerebras → Groq fallback chain occasionally returns a stringified
 * number, NaN, or out-of-range value; left raw, that crashes our SVG math
 * (NaN polygon points) and renders a blank radar. Clamp to a sane 0–100.
 */
function safeScore(v: unknown): number {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

function safeScores(s: Scores): Scores {
  return {
    academicRigor: safeScore(s?.academicRigor),
    leadership: safeScore(s?.leadership),
    awards: safeScore(s?.awards),
    activityDepth: safeScore(s?.activityDepth),
    spike: safeScore(s?.spike),
    essayQuality: safeScore(s?.essayQuality),
    recommendations: safeScore(s?.recommendations),
  };
}

const ODDS_COLORS: Record<string, string> = {
  reach: "#EF4444",
  target: "#4A6FA5",
  safety: "#22C55E",
};

/**
 * Score-interpretation text for each dimension. Maps a raw 0-100 score to a
 * tier label + one-liner so the student understands what the number means in
 * context. These bands mirror the color thresholds in `lib/scoring.ts`.
 */
function getScoreTier(score: number): { tier: string; description: string } {
  if (score >= 90) return { tier: "Exceptional evidence", description: "The submitted record contains unusually strong evidence for this dimension; review the cited facts below." };
  if (score >= 80) return { tier: "Strong evidence", description: "The submitted record supports this as a current strength, subject to the missing-context notes below." };
  if (score >= 65) return { tier: "Developing evidence", description: "The record shows a useful foundation and specific opportunities to add depth or proof." };
  if (score >= 50) return { tier: "Limited evidence", description: "The current record is incomplete or below the selected calibration; use the cited gap to decide what to document or improve." };
  return { tier: "Priority evidence gap", description: "The submitted record does not yet support a stronger assessment. This is a planning priority, not an admissions verdict." };
}

function getOverallInterpretation(score: number): string {
  if (score >= 90) return "Your submitted profile contains strong evidence across most dimensions. Review the citations and missing context before drawing conclusions.";
  if (score >= 80) return "Your submitted profile supports several strengths, with targeted gaps that the action plan makes explicit.";
  if (score >= 65) return "Your profile shows a developing foundation. Prioritize the evidence-backed gaps below rather than trying to improve everything at once.";
  if (score >= 50) return "The current profile has material gaps or missing evidence. The ordered plan focuses on changes that can be documented and evaluated.";
  return "The submitted information is currently limited in several dimensions. Treat this as a baseline for planning, not a judgment of your potential or an admissions prediction.";
}

/** Find the weakest dimension and return its key, label, and score. */
function getWeakestDimension(scores: Scores): { key: keyof Scores; label: string; score: number } {
  let weakest: keyof Scores = "academicRigor";
  for (const k of DIMENSION_ORDER) {
    if (scores[k] < scores[weakest]) weakest = k;
  }
  return { key: weakest, label: DIMENSION_LABELS[weakest], score: scores[weakest] };
}

/** Loading-state dimension labels cycled during analysis. */
const LOADING_STEPS = [
  "Reading your academic story...",
  "Measuring the leadership that matters...",
  "Weighing your awards against real admits...",
  "Checking if your activities show depth or breadth...",
  "Looking for your spike — the thing only you bring...",
  "Evaluating your essay voice...",
  "Assessing recommendation strength...",
  "Calibrating your odds at real schools...",
  "Building the plan that closes every gap...",
];

/**
 * Radar chart for the 7 admissions dimensions. Pure SVG so it's lightweight,
 * animates the polygon in on mount, and reads the same color tokens as the
 * rest of the app.
 */
function RadarChart({ scores }: { scores: Scores }) {
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 110;
  const labelR = maxR + 22;
  const n = DIMENSION_ORDER.length;

  // Start at the top (-90°) and step clockwise
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;

  const point = (value: number, i: number) => {
    const r = (value / 100) * maxR;
    return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))] as const;
  };

  const polygon = DIMENSION_ORDER
    .map((k, i) => point(scores[k], i).join(","))
    .join(" ");

  const rings = [25, 50, 75, 100];

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width="100%"
      style={{ maxWidth: 320, display: "block", margin: "0 auto" }}
      role="img"
      aria-label="Profile strength across seven dimensions"
    >
      {/* Concentric grid */}
      {rings.map((r) => (
        <polygon
          key={r}
          points={DIMENSION_ORDER
            .map((_, i) => point(r, i).join(","))
            .join(" ")}
          fill="none"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth={r === 100 ? 1.25 : 0.75}
          opacity={r === 100 ? 0.9 : 0.55}
        />
      ))}
      {/* Spokes */}
      {DIMENSION_ORDER.map((_, i) => {
        const [x, y] = point(100, i);
        return (
          <line
            key={`spoke-${i}`}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="rgba(0,0,0,0.06)"
            strokeWidth={0.75}
            opacity={0.55}
          />
        );
      })}
      {/* Score polygon */}
      <motion.polygon
        points={polygon}
        fill="rgba(74,111,165,0.18)"
        stroke="#4A6FA5"
        strokeWidth={2}
        strokeLinejoin="round"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
      {/* Score dots */}
      {DIMENSION_ORDER.map((k, i) => {
        const [x, y] = point(scores[k], i);
        return (
          <motion.circle
            key={`dot-${k}`}
            cx={x}
            cy={y}
            r={3.5}
            fill="#4A6FA5"
            stroke="#fff"
            strokeWidth={1.5}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.05, duration: 0.25 }}
          />
        );
      })}
      {/* Axis labels */}
      {DIMENSION_ORDER.map((k, i) => {
        const lx = cx + labelR * Math.cos(angle(i));
        const ly = cy + labelR * Math.sin(angle(i));
        return (
          <text
            key={`lbl-${k}`}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={11}
            fontWeight={600}
            fill="var(--dl-text-secondary, #454B5E)"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {DIMENSION_SHORT[k]}
          </text>
        );
      })}
    </svg>
  );
}

// Circular score dial — fills from 0 to score% with spring animation
function MiniScoreDial({ label, score, delay }: { label: string; score: number; delay: number }) {
  const r = 26;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - score / 100);
  const color = getDimensionColor(score);
  const count = useMotionValue(0);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const controls = animate(count, score, {
      duration: 1.0,
      delay: delay + 0.1,
      ease: [0.16, 1, 0.3, 1],
    });
    const unsub = count.on("change", (v) => setShown(Math.round(v)));
    return () => { controls.stop(); unsub(); };
  }, [score, delay, count]);

  return (
    <motion.div
      className="flex flex-col items-center gap-1.5"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22, delay }}
    >
      <div className="relative flex items-center justify-center">
        <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden>
          <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="5" />
          <motion.circle
            cx="32" cy="32" r={r}
            fill="none" stroke={color} strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.0, delay, ease: [0.16, 1, 0.3, 1] }}
            transform="rotate(-90 32 32)"
          />
        </svg>
        <span
          className="absolute text-xs font-bold tabular-nums"
          style={{ color }}
        >
          {shown}
        </span>
      </div>
      <span className="text-[10px] font-medium text-center leading-tight" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
        {label}
      </span>
    </motion.div>
  );
}

function AnimatedScoreBar({ label, score, delay }: { label: string; score: number; delay: number }) {
  const color = getDimensionColor(score);
  const count = useMotionValue(0);
  const display = useTransform(count, (v: number) => Math.round(v));
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const controls = animate(count, score, { duration: 0.9, delay: delay + 0.1, ease: [0.16, 1, 0.3, 1] });
    const unsub = display.on("change", (v: number) => setShown(v));
    return () => { controls.stop(); unsub(); };
  }, [score, delay, count, display]);
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35 }}
    >
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{label}</span>
        <span className="font-bold tabular-nums" style={{ color }}>{shown}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.06)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}aa)` }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ delay: delay + 0.1, duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const r = 58;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);

  // Count-up: drive a motion value 0→score and snap to integer for the
  // displayed number. Reads as a confident reveal rather than a jump-cut.
  const count = useMotionValue(0);
  const display = useTransform(count, (v: number) => Math.round(v));
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const controls = animate(count, score, {
      duration: 1.3,
      ease: [0.16, 1, 0.3, 1],
    });
    const unsub = display.on("change", (v: number) => setShown(v));
    return () => { controls.stop(); unsub(); };
  }, [score, count, display]);

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Soft glow pulse on completion — additive, low cost */}
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{ background: `radial-gradient(circle, ${color}33, transparent 60%)` }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: [0, 0.9, 0], scale: [0.6, 1.15, 1.25] }}
        transition={{ delay: 1.1, duration: 0.9, ease: "easeOut" }}
      />
      <svg width="136" height="136" viewBox="0 0 136 136" className="relative">
        <circle cx="68" cy="68" r={r} fill="none" strokeWidth="10" stroke="rgba(0,0,0,0.06)" />
        <motion.circle
          cx="68" cy="68" r={r}
          fill="none" strokeWidth="10"
          stroke={color} strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          transform="rotate(-90 68 68)"
        />
      </svg>
      <div className="absolute text-center">
        <motion.p
          className="number-pop text-4xl font-extrabold leading-none tabular-nums"
          style={{ color, fontFamily: "var(--font-inter)" }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {shown}
        </motion.p>
        <p className="mt-0.5 text-[10px] font-medium" style={{ color: "var(--dl-text-muted, #5A6275)" }}>/ 100</p>
      </div>
    </div>
  );
}

function RoadmapBlock({
  Icon, title, subtitle, items, accent, delay,
}: {
  Icon: typeof CalendarDays;
  title: string;
  subtitle: string;
  items: string[];
  accent: string;
  delay: number;
}) {
  if (!items?.length) return null;
  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      style={{ borderColor: `${accent}33` }}
    >
      <div className="mb-3 flex items-center gap-2.5">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ background: `${accent}1A`, color: accent }}
        >
          <Icon className="h-4 w-4" strokeWidth={2.25} />
        </span>
        <div>
          <h3
            className="text-sm font-bold leading-tight"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
            {title}
          </h3>
          <p className="text-[11px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>{subtitle}</p>
        </div>
      </div>
      <ol className="space-y-2">
        {items.map((a, i) => (
          <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ backgroundColor: accent }}
            >
              {i + 1}
            </span>
            <span className="leading-relaxed">{a}</span>
          </li>
        ))}
      </ol>
    </motion.div>
  );
}

/**
 * Premium loading state that cycles through dimension-specific status messages
 * so the wait feels purposeful rather than empty. Keeps the skeleton layout
 * for continuity but replaces the generic banner with a live progress ticker.
 */
function AnalysisLoadingState() {
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIdx((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const progress = ((stepIdx + 1) / LOADING_STEPS.length) * 100;

  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
      aria-busy="true"
      aria-live="polite"
    >
      {/* Live status banner with dimension cycling */}
      <div
        className="rounded-2xl border px-5 py-4"
        style={{ background: "rgba(74,111,165,0.08)", borderColor: "rgba(74,111,165,0.2)" }}
      >
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{ background: "#4A6FA5" }}
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            <Sparkles className="h-4 w-4 text-white" />
          </motion.div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>
              Analyzing your profile
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={stepIdx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="text-[12px] font-medium"
                style={{ color: "#4A6FA5" }}
              >
                {LOADING_STEPS[stepIdx]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: "rgba(74,111,165,0.12)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #4A6FA5, #2E4A6E)" }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <p className="mt-1.5 text-[10px] font-medium tabular-nums" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
          Step {stepIdx + 1} of {LOADING_STEPS.length}
        </p>
      </div>

      {/* Score ring placeholder */}
      <div className="card text-center">
        <div className="animate-shimmer mx-auto mb-3 h-3 w-32 rounded-full" />
        <div className="animate-shimmer mx-auto h-32 w-32 rounded-full" />
        <div className="animate-shimmer mx-auto mt-4 h-4 w-3/4 rounded" />
        <div className="animate-shimmer mx-auto mt-2 h-4 w-2/3 rounded" />
      </div>

      {/* Radar placeholder */}
      <div className="card">
        <div className="animate-shimmer mb-4 h-4 w-40 rounded" />
        <div className="animate-shimmer mx-auto h-72 w-72 rounded-full" style={{ maxWidth: "100%" }} />
      </div>

      {/* Score-bar list placeholder */}
      <div className="card space-y-3">
        <div className="animate-shimmer h-4 w-36 rounded" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between">
              <div className="animate-shimmer h-3 w-32 rounded" />
              <div className="animate-shimmer h-3 w-8 rounded" />
            </div>
            <div className="animate-shimmer h-2 w-full rounded-full" />
          </div>
        ))}
      </div>

      {/* Roadmap placeholders */}
      {[0, 1, 2].map((i) => (
        <div key={i} className="card space-y-2">
          <div className="animate-shimmer h-4 w-40 rounded" />
          <div className="animate-shimmer h-3 w-5/6 rounded" />
          <div className="animate-shimmer h-3 w-4/6 rounded" />
          <div className="animate-shimmer h-3 w-3/4 rounded" />
        </div>
      ))}
    </motion.div>
  );
}

/** Shareable score card — lets users share their score via clipboard or native share. */
function ShareScoreCard({ score }: { score: number }) {
  const [copied, setCopied] = useState(false);

  const shareText = `I scored ${Math.round(score)}/100 on AdmitPath's college readiness assessment. Get your score free at admith.vercel.app`;
  const shareUrl = "https://admith.vercel.app/analyze";

  async function handleShare() {
    // Try native share API first (mobile), fall back to clipboard
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "My AdmitPath Score", text: shareText, url: shareUrl });
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }
    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard blocked — do nothing
    }
  }

  return (
    <motion.div
      className="dl-card-hover card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.35 }}
      style={{
        background: "linear-gradient(135deg, rgba(74,111,165,0.06), rgba(30,51,82,0.04))",
        borderColor: "rgba(74,111,165,0.2)",
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[13px] font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Share your score
          </p>
          <p className="mt-1 text-[12px] leading-snug" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            &ldquo;I scored {Math.round(score)}/100 on AdmitPath&rsquo;s college readiness assessment&rdquo;
          </p>
        </div>
        <button
          onClick={handleShare}
          className="dl-btn dl-btn-primary dl-btn-sm shrink-0"
          style={{ gap: 6 }}
        >
          <Share2 className="h-3.5 w-3.5" strokeWidth={2} />
          {copied ? "Copied!" : "Share"}
        </button>
      </div>
    </motion.div>
  );
}

/** Goal-setting CTA — prompts user to set a target score for retention. */
function SetGoalCard({ score }: { score: number }) {
  const [goalSet, setGoalSet] = useState(false);
  const targetScore = Math.min(100, Math.round(score) + 13);
  const GOAL_KEY = "admitpath:score-goal:v1";

  useEffect(() => {
    try {
      const saved = localStorage.getItem(GOAL_KEY);
      if (saved) setGoalSet(true);
    } catch { /* noop */ }
  }, []);

  function handleSetGoal() {
    try { localStorage.setItem(GOAL_KEY, JSON.stringify({ target: targetScore, from: Math.round(score), setAt: new Date().toISOString() })); } catch { /* noop */ }
    setGoalSet(true);
  }

  return (
    <motion.div
      className="dl-card-hover card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.35 }}
      style={{
        borderColor: goalSet ? "rgba(22,163,74,0.2)" : "rgba(74,111,165,0.15)",
        background: goalSet ? "rgba(22,163,74,0.04)" : "rgba(255,255,255,0.6)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="flex h-6 w-6 items-center justify-center rounded-lg"
          style={{ background: goalSet ? "rgba(22,163,74,0.1)" : "rgba(74,111,165,0.08)", color: goalSet ? "#16A34A" : "#4A6FA5" }}
        >
          <Flag className="h-3.5 w-3.5" strokeWidth={2} />
        </span>
        <p className="text-[13px] font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
          {goalSet ? "Goal set!" : "Set a goal"}
        </p>
      </div>
      {goalSet ? (
        <p className="text-[12px] leading-snug" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          You&apos;re targeting <strong style={{ color: "#4A6FA5" }}>{targetScore}/100</strong>. Re-run your analysis after making improvements to track progress toward your goal.
        </p>
      ) : (
        <>
          <p className="text-[12px] leading-snug mb-3" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            Your score is <strong style={{ color: "#4A6FA5" }}>{Math.round(score)}</strong>. Set a target of <strong style={{ color: "#4A6FA5" }}>{targetScore}</strong> and we&apos;ll track your progress.
          </p>
          <button
            onClick={handleSetGoal}
            className="dl-btn dl-btn-primary dl-btn-sm text-[12px]"
          >
            Set target: {targetScore}/100
          </button>
        </>
      )}
    </motion.div>
  );
}

/**
 * Weakness-based action items — picks the 3 lowest-scoring dimensions and
 * maps each to a specific, actionable next step with a link.
 */
const DIMENSION_ACTIONS: Record<keyof Scores, { action: string; detail: string; href: string }> = {
  academicRigor: { action: "Strengthen your course load", detail: "Add an AP or honors course next semester to show upward rigor trend", href: "/profile/create" },
  leadership: { action: "Take on a leadership role", detail: "Run for officer positions in your top 2 activities this month", href: "/profile/create" },
  awards: { action: "Enter a competition", detail: "Find and register for 2 competitions aligned with your spike area", href: "/competitions" },
  activityDepth: { action: "Deepen your top activity", detail: "Increase hours or start a related project that shows sustained commitment", href: "/profile/create" },
  spike: { action: "Build your spike narrative", detail: "Connect your strongest activities into a cohesive theme admissions readers remember", href: "/chat" },
  essayQuality: { action: "Draft and score an essay", detail: "Write your Common App essay and get line-by-line feedback on voice and specificity", href: "/essays" },
  recommendations: { action: "Build teacher relationships", detail: "Start meaningful conversations with 2 teachers who can speak to your growth", href: "/resources" },
};

function WeaknessBasedActions({ scores }: { scores: Scores }) {
  const sorted = [...DIMENSION_ORDER].sort((a, b) => scores[a] - scores[b]);
  const weakest3 = sorted.slice(0, 3);

  return (
    <div className="space-y-2.5">
      {weakest3.map((k, i) => {
        const act = DIMENSION_ACTIONS[k];
        return (
          <Link
            key={k}
            href={act.href}
            className="flex items-start gap-3 rounded-xl border p-3.5 transition-all duration-200 hover:border-[rgba(74,111,165,0.25)] hover:shadow-sm"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.6)" }}
          >
            <span
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ backgroundColor: "#4A6FA5" }}
            >
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold leading-snug" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                {act.action}
                <span className="ml-1.5 text-[11px] font-normal" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                  ({DIMENSION_LABELS[k]}: {scores[k]}/100)
                </span>
              </p>
              <p className="mt-0.5 text-[11px] leading-snug" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                {act.detail}
              </p>
            </div>
            <ChevronRight className="mt-1 h-3.5 w-3.5 shrink-0" style={{ color: "#4A6FA5" }} />
          </Link>
        );
      })}
    </div>
  );
}

/**
 * Blurred overlay for gated content — free users see the shape of content
 * but can't read it. Creates FOMO without being obnoxious.
 */
function BlurredGate({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div
        className="select-none pointer-events-none"
        style={{ filter: "blur(6px)", WebkitFilter: "blur(6px)", userSelect: "none" }}
        aria-hidden
      >
        {children}
      </div>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-2"
        style={{ background: "rgba(255,255,255,0.35)", backdropFilter: "blur(1px)" }}
      >
        <div
          className="flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-bold"
          style={{ background: "rgba(74,111,165,0.12)", color: "#4A6FA5" }}
        >
          <Lock className="h-3.5 w-3.5" />
          {label || "Unlock with Pro"}
        </div>
      </div>
    </div>
  );
}

/** Mid-results upgrade card — inserted between visible and blurred content. */
function FreeUpgradeCard() {
  return (
    <motion.div
      className="card overflow-hidden"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      style={{
        background: "linear-gradient(135deg, rgba(74,111,165,0.10), rgba(30,51,82,0.06))",
        borderColor: "rgba(74,111,165,0.3)",
        border: "2px solid rgba(74,111,165,0.25)",
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
          style={{ background: "linear-gradient(135deg, #4A6FA5, #1E3352)" }}
        >
          <Zap className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h3
            className="text-[17px] font-bold leading-tight mb-1"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
            You have seen your strengths. Your weaknesses are where the real opportunity is.
          </h3>
          <p
            className="text-[13px] leading-relaxed mb-4"
            style={{ color: "var(--dl-text-secondary, #454B5E)" }}
          >
            Unlock your full 7-dimension analysis to see every gap, get your complete 90-day roadmap,
            and see admission bands for all your target schools. The students who close their gaps fastest
            are the ones who see them first.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/pricing"
              className="dl-btn dl-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Unlock full analysis — $19.99/mo
            </Link>
            <span className="text-[11px] font-medium" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              About 67 cents/day
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AnalyzePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFreePlan, setIsFreePlan] = useState(true);
  const [resumeReviewing, setResumeReviewing] = useState(false);
  const autoRunStartedRef = useRef(false);

  // Fetch user plan on mount to gate results display
  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => {
        const ep = data?.effectivePlan;
        setIsFreePlan(ep === "free" || !ep);
      })
      .catch(() => setIsFreePlan(true));
  }, []);

  const [form, setForm] = useState({
    gpa: "", weightedGpa: "", satScore: "", actScore: "",
    grade: "11", activities: "", awards: "", courses: "",
    intendedMajor: "", targetColleges: "", essaySnippet: "",
    admissionsConcern: "",
  });

  // Auto-run: when redirected from profile creation (?autorun=1),
  // fetch saved profile and immediately trigger analysis for instant aha moment.
  useEffect(() => {
    if (autoRunStartedRef.current) return;
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("autorun") !== "1") return;
    autoRunStartedRef.current = true;

    fetch("/api/profile")
      .then((r) => {
        if (r.status === 401) {
          const returnTo = "/analyze?autorun=1";
          window.location.assign(`/sign-in?redirect_url=${encodeURIComponent(returnTo)}`);
          throw new Error("auth redirect");
        }
        if (!r.ok) throw new Error("no profile");
        return r.json();
      })
      .then((profile: Record<string, unknown>) => {
        const p = profile as {
          grade?: number; gpa?: number; weightedGpa?: number;
          satScore?: number; actScore?: number; intendedMajor?: string;
          targetColleges?: string[];
          activities?: Array<{ name: string }>; awards?: Array<string | { name?: string }>;
          courses?: string[]; admissionsConcern?: string;
        };
        const awardNames = (p.awards || []).flatMap((award) =>
          typeof award === "string" ? [award] : award.name ? [award.name] : [],
        );
        // Populate form for display
        setForm({
          grade: p.grade ? String(p.grade) : "11",
          gpa: p.gpa ? String(p.gpa) : "",
          weightedGpa: p.weightedGpa ? String(p.weightedGpa) : "",
          satScore: p.satScore ? String(p.satScore) : "",
          actScore: p.actScore ? String(p.actScore) : "",
          intendedMajor: p.intendedMajor || "",
          targetColleges: (p.targetColleges || []).join(", "),
          activities: (p.activities || []).map((a) => a.name).join("\n"),
          awards: awardNames.join("\n"),
          courses: (p.courses || []).join("\n"),
          admissionsConcern: p.admissionsConcern || "",
          essaySnippet: "",
        });
        const missing = missingAnalysisProfileFields(p);
        if (missing.length > 0) {
          setError(`Finish your profile before analysis: ${missing.join(", ")}.`);
          return null;
        }
        // Fire analysis directly only after the persisted profile is ready.
        setLoading(true);
        setError(null);
        return fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gpa: p.gpa, weightedGpa: p.weightedGpa,
            satScore: p.satScore, actScore: p.actScore,
            grade: p.grade || 11,
            activities: p.activities || [],
            awards: awardNames,
            courses: p.courses || [],
            intendedMajor: p.intendedMajor,
            targetColleges: p.targetColleges || [],
            admissionsConcern: p.admissionsConcern,
          }),
        });
      })
      .then(async (res) => {
        if (!res) return;
        if (!res.ok) {
          if (res.status === 401) {
            const returnTo = "/analyze?autorun=1";
            window.location.assign(`/sign-in?redirect_url=${encodeURIComponent(returnTo)}`);
            return;
          }
          const body = await res.json().catch(() => null);
          setError(apiErrorMessage(body, "Analysis failed. Try running it manually."));
          return;
        }
        const raw = (await res.json()) as AnalysisResult;
        setResult({ ...raw, scores: safeScores(raw.scores), overallScore: safeScore(raw.overallScore) });
        track("analysis_run", { path: "/analyze" });
        analytics.analysisRun();
      })
      .catch(() => { /* Profile fetch failed — user runs manually */ })
      .finally(() => setLoading(false));
  }, []);

  function update(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleAnalyze() {
    setLoading(true);
    setError(null);
    setResult(null);

    // Validate before burning a quota slot. Bad numeric input previously made
    // it all the way to the model and either crashed parsing or returned junk
    // odds — fail fast with a useful message instead.
    const gpaNum = parseFloat(form.gpa);
    if (!form.gpa || !Number.isFinite(gpaNum) || gpaNum < 0 || gpaNum > 5) {
      setError("Enter a valid unweighted GPA between 0.0 and 5.0.");
      setLoading(false);
      return;
    }
    if (form.satScore) {
      const sat = parseInt(form.satScore, 10);
      if (!Number.isFinite(sat) || sat < 400 || sat > 1600) {
        setError("SAT must be between 400 and 1600 (or leave blank).");
        setLoading(false);
        return;
      }
    }
    if (form.actScore) {
      const act = parseInt(form.actScore, 10);
      if (!Number.isFinite(act) || act < 1 || act > 36) {
        setError("ACT must be between 1 and 36 (or leave blank).");
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gpa: form.gpa ? parseFloat(form.gpa) : undefined,
          weightedGpa: form.weightedGpa ? parseFloat(form.weightedGpa) : undefined,
          satScore: form.satScore ? parseInt(form.satScore) : undefined,
          actScore: form.actScore ? parseInt(form.actScore) : undefined,
          grade: parseInt(form.grade) || 11,
          activities: form.activities.split("\n").map((a) => a.trim()).filter(Boolean).map((a) => ({ name: a })),
          awards: form.awards.split("\n").map((a) => a.trim()).filter(Boolean),
          courses: form.courses.split("\n").map((a) => a.trim()).filter(Boolean),
          intendedMajor: form.intendedMajor || undefined,
          targetColleges: form.targetColleges.split(/[,\n]/).map((s) => s.trim()).filter(Boolean),
          admissionsConcern: form.admissionsConcern || undefined,
          essaySnippet: form.essaySnippet || undefined,
        }),
      });

      if (res.status === 401) {
        const here = window.location.pathname;
        window.location.assign(`/sign-in?redirect_url=${encodeURIComponent(here)}`);
        return;
      }
      if (res.status === 403) {
        setError("You've used all 5 Free-plan analyses. Upgrade to Pro to remove that cap.");
        return;
      }
      if (res.status === 429) {
        setError("Slow down — too many requests. Try again in a minute.");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(apiErrorMessage(data, "Analysis failed. Please try again."));
        return;
      }
      const raw = (await res.json()) as AnalysisResult;
      // Sanitize before render — see safeScores().
      setResult({
        ...raw,
        scores: safeScores(raw.scores),
        overallScore: safeScore(raw.overallScore),
      });
      // No PII — just pathname + bucketed overall score.
      track("analysis_run", { path: "/analyze" });
      analytics.analysisRun();
    } catch {
      setError("Couldn't reach the analysis service. Check your connection and try again.");
    } finally {
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
            Analysis
          </p>
          <h1
            className="mt-2 text-[34px] leading-tight"
            style={{
              color: "var(--dl-text-primary, #1B2030)",
              fontFamily: "var(--font-inter)",
              letterSpacing: "-0.02em",
            }}
          >
            Know exactly where you stand.
          </h1>
          <p
            className="mt-2 max-w-2xl text-[15px] italic leading-relaxed"
            style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}
          >
            Scored across seven dimensions, calibrated against your target schools, with a 30 / 90 / 365-day roadmap.
          </p>
        </div>
      </div>

      <main id="main" className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Input panel */}
          <div className="space-y-5">
            <ResumeQuickImport context="analyze" onReviewStateChange={setResumeReviewing} />
            {!resumeReviewing && (
              <>
            {/* Academic */}
            <div className="dl-card-hover card space-y-4">
              <h2
                className="text-[18px]"
                style={{ color: "#1B2030", fontFamily: "var(--font-inter)", fontWeight: 700, letterSpacing: "-0.02em" }}
              >
                Academic profile
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label" htmlFor="analyze-grade">Grade</label>
                  <HydrationSafeSelect
                    id="analyze-grade"
                    className="input-field"
                    value={form.grade}
                    onChange={(e) => update("grade", e.target.value)}
                    hydrationPlaceholder={`Grade ${form.grade}`}
                  >
                    {[7, 8, 9, 10, 11, 12].map((g) => (
                      <option key={g} value={g}>Grade {g}</option>
                    ))}
                  </HydrationSafeSelect>
                </div>
                <div>
                  <label className="label" htmlFor="analyze-gpa">Unweighted GPA *</label>
                  <input
                    id="analyze-gpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.5"
                    className="input-field"
                    placeholder="3.85"
                    value={form.gpa}
                    onChange={(e) => update("gpa", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="label" htmlFor="analyze-weighted-gpa">Weighted GPA</label>
                  <input
                    id="analyze-weighted-gpa"
                    type="number"
                    step="0.01"
                    className="input-field"
                    placeholder="4.20"
                    value={form.weightedGpa}
                    onChange={(e) => update("weightedGpa", e.target.value)}
                  />
                </div>
                <div>
                  <label className="label" htmlFor="analyze-sat">SAT Score</label>
                  <input
                    id="analyze-sat"
                    type="number"
                    min={400}
                    max={1600}
                    className="input-field"
                    placeholder="1450"
                    value={form.satScore}
                    onChange={(e) => update("satScore", e.target.value)}
                  />
                </div>
                <div>
                  <label className="label" htmlFor="analyze-act">ACT Score</label>
                  <input
                    id="analyze-act"
                    type="number"
                    min={1}
                    max={36}
                    className="input-field"
                    placeholder="32"
                    value={form.actScore}
                    onChange={(e) => update("actScore", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="analyze-courses">AP / IB / Honors courses (one per line)</label>
                <textarea
                  id="analyze-courses"
                  className="input-field h-20 resize-none text-sm"
                  placeholder={"AP Calculus BC\nAP Computer Science A\nIB English HL"}
                  value={form.courses}
                  onChange={(e) => update("courses", e.target.value)}
                />
              </div>
            </div>

            {/* Activities + Awards */}
            <div className="dl-card-hover card space-y-4">
              <h2
                className="text-[18px]"
                style={{ color: "#1B2030", fontFamily: "var(--font-inter)", fontWeight: 700, letterSpacing: "-0.02em" }}
              >
                Activities &amp; awards
              </h2>
              <div>
                <label className="label" htmlFor="analyze-activities">Activities (one per line, include hours/week if known)</label>
                <textarea
                  id="analyze-activities"
                  className="input-field h-24 resize-none text-sm"
                  placeholder={"Varsity soccer captain, 15h/wk\nNHS president\nResearch intern at UCF"}
                  value={form.activities}
                  onChange={(e) => update("activities", e.target.value)}
                />
              </div>
              <div>
                <label className="label" htmlFor="analyze-awards">Awards / Honors (one per line)</label>
                <textarea
                  id="analyze-awards"
                  className="input-field h-16 resize-none text-sm"
                  placeholder={"National Merit Semifinalist\nState DECA placer"}
                  value={form.awards}
                  onChange={(e) => update("awards", e.target.value)}
                />
              </div>
            </div>

            {/* Goals + Essay + Concern */}
            <div className="dl-card-hover card space-y-4">
              <h2
                className="text-[18px]"
                style={{ color: "#1B2030", fontFamily: "var(--font-inter)", fontWeight: 700, letterSpacing: "-0.02em" }}
              >
                Goals &amp; essay
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label" htmlFor="analyze-major">Intended major</label>
                  <input
                    id="analyze-major"
                    type="text"
                    className="input-field"
                    placeholder="Computer Science"
                    value={form.intendedMajor}
                    onChange={(e) => update("intendedMajor", e.target.value)}
                  />
                </div>
                <div>
                  <label className="label" htmlFor="analyze-targets">Target colleges</label>
                  <input
                    id="analyze-targets"
                    type="text"
                    className="input-field"
                    placeholder="Harvard, MIT, UCLA"
                    value={form.targetColleges}
                    onChange={(e) => update("targetColleges", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="analyze-concern">What worries you most about your application? (optional)</label>
                <textarea
                  id="analyze-concern"
                  className="input-field h-16 resize-none text-sm"
                  placeholder="e.g. My GPA dipped junior year and I haven't won any national awards."
                  value={form.admissionsConcern}
                  onChange={(e) => update("admissionsConcern", e.target.value.slice(0, 500))}
                />
              </div>
              <div>
                <label className="label" htmlFor="analyze-essay">Essay snippet (optional · first 300 chars)</label>
                <textarea
                  id="analyze-essay"
                  className="input-field h-20 resize-none text-sm"
                  placeholder="Paste the opening of your main essay…"
                  value={form.essaySnippet}
                  onChange={(e) => update("essaySnippet", e.target.value.slice(0, 300))}
                />
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 rounded-xl border px-4 py-3 text-sm"
                  style={{
                    backgroundColor: "var(--error-light)",
                    borderColor: "rgba(239,68,68,0.25)",
                    color: "var(--error)",
                  }}
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>
                    {error}
                    {(error.includes("Pro") || error.includes("Upgrade")) && (
                      <>
                        {" "}
                        <Link href="/pricing" className="font-bold underline">
                          See plans →
                        </Link>
                      </>
                    )}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handleAnalyze}
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
                  Analyzing your profile…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Run analysis
                </span>
              )}
            </button>

            {/* Single muted disclaimer — model estimates calibrated to public
                admit-rate data. Kept below the Run button so users see it
                before they spend a quota slot. */}
            <p
              className="mt-3 text-xs leading-relaxed"
              style={{ color: "var(--dl-text-muted, #5A6275)" }}
            >
              Scores are directional estimates based on CDS data and profile analysis. Actual admissions decisions depend on many factors including essays, recommendations, and institutional priorities that scores cannot fully capture. Use these as guidance, not guarantees.
            </p>
              </>
            )}
          </div>

          {/* Results panel */}
          <div aria-live="polite" aria-busy={loading}>
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="relative space-y-5"
                >
                  {/* Confetti burst for high scores */}
                  {result.overallScore > 80 && <ScoreConfetti />}

                  {/* Source-of-truth chip — declares what the model was given,
                      so the panel reads as advisory output of the inputs above
                      rather than as a verdict. */}
                  <div>
                    <AISourceChip>based on your profile inputs above</AISourceChip>
                  </div>
                  {/* Reset — lets the user iterate on inputs without a hard
                      page refresh (which would otherwise lose the form state). */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setResult(null);
                        setError(null);
                        if (typeof window !== "undefined") {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      className="text-xs font-semibold underline"
                      style={{ color: "#4A6FA5" }}
                    >
                      ← Run a new analysis
                    </button>
                  </div>

                  {/* Score ring */}
                  <div
                    className="dl-card-hover card text-center"
                  >
                    <p className="section-label mb-3">Overall Profile Score</p>
                    <ScoreRing score={result.overallScore} />
                    {/* Rationale demoted to a collapsible per Anthropic's
                        process-as-progressive-disclosure pattern. The score
                        ring + radar + roadmap are the load-bearing output;
                        the model's prose justification is on-demand. */}
                    <details className="why-this-score group mt-4 text-left">
                      <summary
                        className="flex cursor-pointer list-none items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] outline-none focus-visible:underline [&::-webkit-details-marker]:hidden"
                        style={{ color: "var(--dl-text-muted, #5A6275)" }}
                      >
                        <ChevronRight
                          className="h-3 w-3 transition-transform duration-200 group-open:rotate-90"
                          strokeWidth={2.25}
                        />
                        Why this score
                      </summary>
                      <p
                        className="mt-2 text-[13px] leading-relaxed"
                        style={{ color: "var(--dl-text-muted, #5A6275)" }}
                      >
                        {result.summary}
                      </p>
                    </details>
                    {/* Overall score interpretation */}
                    <motion.p
                      className="mt-3 text-[13px] leading-relaxed text-center"
                      style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.4, duration: 0.5 }}
                    >
                      {getOverallInterpretation(result.overallScore)}
                    </motion.p>
                  </div>

                  {/* Share your score */}
                  <ShareScoreCard score={result.overallScore} />

                  {/* Viral share card — celebratory share for scores > 70 */}
                  <ViralShareCard score={result.overallScore} />

                  {/* Compare with friends — viral loop teaser */}
                  <motion.div
                    className="dl-card-hover card"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.35 }}
                    style={{
                      borderColor: "rgba(74,111,165,0.15)",
                      background: "rgba(255,255,255,0.6)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="flex h-6 w-6 items-center justify-center rounded-lg"
                            style={{ background: "rgba(74,111,165,0.08)", color: "#4A6FA5" }}
                          >
                            <Share2 className="h-3.5 w-3.5" strokeWidth={2} />
                          </span>
                          <p className="text-[13px] font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                            Compare with friends
                          </p>
                        </div>
                        <p className="text-[12px] leading-snug" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                          Send your friends a link to get their own score, then compare dimension-by-dimension.
                        </p>
                      </div>
                      <button
                        onClick={async () => {
                          const text = `Compare college readiness scores with me on AdmitPath! Get your free score:`;
                          if (typeof navigator !== "undefined" && navigator.share) {
                            try { await navigator.share({ title: "Compare scores on AdmitPath", text, url: "https://admith.vercel.app/analyze" }); return; } catch { /* fallthrough */ }
                          }
                          try { await navigator.clipboard.writeText(`${text}\nhttps://admith.vercel.app/analyze`); } catch { /* noop */ }
                        }}
                        className="dl-btn shrink-0 rounded-lg border px-4 py-2 text-[12px] font-semibold transition-all hover:border-[rgba(74,111,165,0.25)]"
                        style={{ borderColor: "rgba(0,0,0,0.08)", color: "#4A6FA5", background: "rgba(74,111,165,0.06)" }}
                      >
                        Invite friends
                      </button>
                    </div>
                  </motion.div>

                  {/* Set a goal — retention hook */}
                  <SetGoalCard score={result.overallScore} />

                  {/* Radar — free users see full radar (hook) */}
                  <div className="dl-card-hover card">
                    <div className="mb-3 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" style={{ color: "#4A6FA5" }} />
                      <h3
                        className="text-[15px]"
                        style={{ color: "#1B2030", fontFamily: "var(--font-inter)", fontWeight: 700, letterSpacing: "-0.02em" }}
                      >
                        7-Dimension Radar
                      </h3>
                    </div>
                    <RadarChart scores={result.scores} />
                  </div>

                  {/* Mini score dials — free: top 3 visible, bottom 4 blurred */}
                  {(() => {
                    const sorted = [...DIMENSION_ORDER].sort((a, b) => result.scores[b] - result.scores[a]);
                    const topDimensions = isFreePlan ? sorted.slice(0, 3) : DIMENSION_ORDER;
                    const gatedDimensions = isFreePlan ? sorted.slice(3) : [];

                    return (
                      <>
                        <div className="dl-card-hover card">
                          <h3 className="mb-1 font-bold" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>
                            {isFreePlan ? "Your Top 3 Strengths" : "Dimension Scores"}
                          </h3>
                          {isFreePlan && (
                            <p className="mb-4 text-[11px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                              Your strongest dimensions — where you stand out to admissions readers.
                            </p>
                          )}
                          <div className={`grid gap-3 justify-items-center ${isFreePlan ? "grid-cols-3" : "grid-cols-4 sm:grid-cols-7"}`}>
                            {topDimensions.map((k, i) => (
                              <MiniScoreDial key={k} label={DIMENSION_LABELS[k]} score={result.scores[k]} delay={i * 0.08} />
                            ))}
                          </div>
                        </div>

                        {/* Blurred bottom 4 dimensions for free users */}
                        {isFreePlan && gatedDimensions.length > 0 && (
                          <BlurredGate label="Unlock all 7 dimensions with Pro">
                            <div className="dl-card-hover card">
                              <h3 className="mb-4 font-bold" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>
                                Remaining Dimensions
                              </h3>
                              <div className="grid grid-cols-4 gap-3 justify-items-center">
                                {gatedDimensions.map((k, i) => (
                                  <MiniScoreDial key={k} label={DIMENSION_LABELS[k]} score={result.scores[k]} delay={i * 0.08} />
                                ))}
                              </div>
                            </div>
                          </BlurredGate>
                        )}
                      </>
                    );
                  })()}

                  {/* Linear breakdown — free: top 3 visible, bottom 4 blurred */}
                  {(() => {
                    const sorted = [...DIMENSION_ORDER].sort((a, b) => result.scores[b] - result.scores[a]);
                    const visibleDims = isFreePlan ? sorted.slice(0, 3) : DIMENSION_ORDER;
                    const hiddenDims = isFreePlan ? sorted.slice(3) : [];

                    return (
                      <>
                        <div className="dl-card-hover card space-y-4">
                          <h3 className="text-[18px]" style={{ color: "#1B2030", fontFamily: "var(--font-inter)", fontWeight: 700, letterSpacing: "-0.02em" }}>
                            Score Breakdown
                          </h3>
                          {visibleDims.map((k, i) => {
                            const tier = getScoreTier(result.scores[k]);
                            const assessment = result.dimensionAssessments?.[k];
                            const explanation = assessment?.explanation ?? result.scoreExplanations?.[k];
                            return (
                              <div key={k}>
                                <AnimatedScoreBar label={DIMENSION_LABELS[k]} score={result.scores[k]} delay={i * 0.07} />
                                <motion.p
                                  className="mt-1 text-[11px] leading-snug"
                                  style={{ color: "var(--dl-text-muted, #5A6275)" }}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: i * 0.07 + 0.5, duration: 0.3 }}
                                >
                                  <span className="font-semibold">{tier.tier}</span> — {tier.description}
                                </motion.p>
                                {explanation && (
                                  <motion.p
                                    className="mt-1.5 text-[12px] leading-relaxed rounded-lg px-3 py-2"
                                    style={{
                                      color: "var(--dl-text-secondary, #454B5E)",
                                      backgroundColor: "rgba(74,111,165,0.04)",
                                      borderLeft: "2px solid rgba(74,111,165,0.2)",
                                    }}
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.07 + 0.7, duration: 0.3 }}
                                  >
                                    {explanation}
                                  </motion.p>
                                )}
                                {assessment && (
                                  <div className="mt-2 space-y-1.5 text-[11px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                                    <p className="font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                                      Confirmed evidence used
                                      <span className="ml-2 font-normal capitalize" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                                        {assessment.confidence} confidence
                                      </span>
                                    </p>
                                    <ul className="space-y-1">
                                      {assessment.evidenceUsed.map((evidence, evidenceIndex) => (
                                        <li key={`${k}-evidence-${evidenceIndex}`} className="flex items-start gap-2">
                                          <CheckCircle className="mt-0.5 h-3 w-3 shrink-0" style={{ color: "var(--success)" }} />
                                          {evidence.text}
                                        </li>
                                      ))}
                                    </ul>
                                    <p><span className="font-semibold">Interpretation:</span> {assessment.inference}</p>
                                    {assessment.missingEvidence.length > 0 && (
                                      <p><span className="font-semibold">Still missing:</span> {assessment.missingEvidence.join("; ")}.</p>
                                    )}
                                    <p><span className="font-semibold">Priority action:</span> {assessment.priorityAction}</p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Blurred remaining dimensions */}
                        {isFreePlan && hiddenDims.length > 0 && (
                          <BlurredGate label="See all 7 dimension scores — Upgrade">
                            <div className="dl-card-hover card space-y-4">
                              {hiddenDims.map((k, i) => {
                                const tier = getScoreTier(result.scores[k]);
                                return (
                                  <div key={k}>
                                    <AnimatedScoreBar label={DIMENSION_LABELS[k]} score={result.scores[k]} delay={i * 0.07} />
                                    <p className="mt-1 text-[11px] leading-snug" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                                      <span className="font-semibold">{tier.tier}</span> — {tier.description}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </BlurredGate>
                        )}
                      </>
                    );
                  })()}

                  {/* Mid-results upgrade card for free users */}
                  {isFreePlan && <FreeUpgradeCard />}

                  {/* Spike Analysis */}
                  {result.spikeAnalysis && (
                    <motion.div
                      className="dl-card-hover card"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.35 }}
                      style={{ borderColor: "rgba(74,111,165,0.2)" }}
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4" style={{ color: "#4A6FA5" }} />
                        <h3
                          className="text-[15px]"
                          style={{ color: "#1B2030", fontFamily: "var(--font-inter)", fontWeight: 700, letterSpacing: "-0.02em" }}
                        >
                          Spike Analysis
                        </h3>
                      </div>
                      <p
                        className="text-[13px] leading-relaxed"
                        style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                      >
                        {result.spikeAnalysis}
                      </p>
                    </motion.div>
                  )}

                  {/* Counselor Note */}
                  {result.counselorNote && (
                    <motion.div
                      className="dl-card-hover card"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.35 }}
                      style={{
                        borderColor: "rgba(74,111,165,0.3)",
                        background: "linear-gradient(135deg, rgba(74,111,165,0.06), rgba(30,51,82,0.04))",
                      }}
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <Sparkles className="h-4 w-4" style={{ color: "#4A6FA5" }} />
                        <h3
                          className="text-[15px]"
                          style={{ color: "#1B2030", fontFamily: "var(--font-inter)", fontWeight: 700, letterSpacing: "-0.02em" }}
                        >
                          What Your Counselor Would Say
                        </h3>
                      </div>
                      <p
                        className="text-[13.5px] leading-relaxed"
                        style={{ color: "var(--dl-text-primary, #1B2030)", fontStyle: "italic" }}
                      >
                        &ldquo;{result.counselorNote}&rdquo;
                      </p>
                    </motion.div>
                  )}

                  {/* 8-Second Test */}
                  {result.eightSecondTest && (
                    <motion.div
                      className="dl-card-hover card"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.42, duration: 0.35 }}
                      style={{
                        borderColor: "rgba(74,111,165,0.3)",
                        background: "linear-gradient(135deg, rgba(30,51,82,0.06), rgba(74,111,165,0.03))",
                      }}
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <Eye className="h-4 w-4" style={{ color: "#4A6FA5" }} />
                        <h3
                          className="text-[15px]"
                          style={{ color: "#1B2030", fontFamily: "var(--font-inter)", fontWeight: 700, letterSpacing: "-0.02em" }}
                        >
                          The 8-Second Test
                        </h3>
                      </div>
                      <p className="text-[11px] mb-3" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                        In committee, an admissions officer has 8 seconds to describe you. Here is what they would say:
                      </p>
                      <div
                        className="rounded-xl border p-3.5 mb-3"
                        style={{ borderColor: "rgba(239,68,68,0.15)", background: "rgba(239,68,68,0.03)" }}
                      >
                        <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: "#EF4444" }}>
                          Right now, they would say:
                        </p>
                        <p className="text-[13px] font-semibold leading-relaxed" style={{ color: "var(--dl-text-primary, #1B2030)", fontStyle: "italic" }}>
                          &ldquo;{result.eightSecondTest.currentTag}&rdquo;
                        </p>
                      </div>
                      <div
                        className="rounded-xl border p-3.5 mb-3"
                        style={{ borderColor: "rgba(34,197,94,0.2)", background: "rgba(34,197,94,0.03)" }}
                      >
                        <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: "#16A34A" }}>
                          What you want them to say:
                        </p>
                        <p className="text-[13px] font-semibold leading-relaxed" style={{ color: "var(--dl-text-primary, #1B2030)", fontStyle: "italic" }}>
                          &ldquo;{result.eightSecondTest.desiredTag}&rdquo;
                        </p>
                      </div>
                      <div
                        className="rounded-xl border p-3.5"
                        style={{ borderColor: "rgba(74,111,165,0.15)", background: "rgba(74,111,165,0.03)" }}
                      >
                        <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: "#4A6FA5" }}>
                          How to shift the narrative:
                        </p>
                        <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                          {result.eightSecondTest.tagShiftStrategy}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Psychological Profile */}
                  {result.psychologicalProfile && (
                    <motion.div
                      className="dl-card-hover card"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45, duration: 0.35 }}
                      style={{ borderColor: "rgba(74,111,165,0.25)" }}
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <Brain className="h-4 w-4" style={{ color: "#4A6FA5" }} />
                        <h3
                          className="text-[15px]"
                          style={{ color: "#1B2030", fontFamily: "var(--font-inter)", fontWeight: 700, letterSpacing: "-0.02em" }}
                        >
                          What Your Application Really Says
                        </h3>
                      </div>
                      <p className="text-[11px] mb-3" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                        Reading between the lines of your profile -- what admissions readers will conclude about who you are.
                      </p>
                      <p
                        className="text-[13px] leading-relaxed mb-3"
                        style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                      >
                        {result.psychologicalProfile.profileReading}
                      </p>
                      <div
                        className="rounded-xl border p-3.5"
                        style={{ borderColor: "rgba(239,68,68,0.15)", background: "rgba(239,68,68,0.03)" }}
                      >
                        <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: "#EF4444" }}>
                          The question admissions will have:
                        </p>
                        <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                          {result.psychologicalProfile.narrativeGap}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Honest Friend Note */}
                  {result.honestFriendNote && (
                    <motion.div
                      className="dl-card-hover card"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.48, duration: 0.35 }}
                      style={{
                        borderColor: "rgba(30,51,82,0.3)",
                        background: "linear-gradient(135deg, rgba(30,51,82,0.08), rgba(74,111,165,0.04))",
                      }}
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" style={{ color: "#1E3352" }} />
                        <h3
                          className="text-[15px]"
                          style={{ color: "#1B2030", fontFamily: "var(--font-inter)", fontWeight: 700, letterSpacing: "-0.02em" }}
                        >
                          Real Talk
                        </h3>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(30,51,82,0.1)", color: "#1E3352" }}>
                          from someone who has been there
                        </span>
                      </div>
                      <p
                        className="text-[13.5px] leading-relaxed"
                        style={{ color: "var(--dl-text-primary, #1B2030)" }}
                      >
                        {result.honestFriendNote}
                      </p>
                    </motion.div>
                  )}

                  {/* Admission odds — free: top 3 schools visible, rest blurred */}
                  <div className="dl-card-hover card">
                    <h3 className="mb-4 font-bold" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>
                      Admission Odds
                    </h3>
                    {Array.isArray(result.admissionOdds) ? (
                      /* New per-school format — split for free users */
                      <>
                        <div className="space-y-3">
                          {(result.admissionOdds as SchoolOdds[]).slice(0, isFreePlan ? 3 : undefined).map((o, i) => {
                            const tierColor = o.tier === "reach" ? "#EF4444" : o.tier === "target" ? "#4A6FA5" : "#22C55E";
                            return (
                              <motion.div
                                key={o.school}
                                className="rounded-xl p-3.5 overflow-hidden"
                                style={{
                                  backgroundColor: `${tierColor}08`,
                                  border: `1px solid ${tierColor}25`,
                                }}
                                initial={{ opacity: 0, x: 24 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                              >
                                <div className="flex items-baseline justify-between">
                                  <p className="text-xs font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                                    {o.school}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <motion.span
                                      className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                                      style={{ backgroundColor: `${tierColor}15`, color: tierColor }}
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      transition={{ type: "spring", stiffness: 400, damping: 15, delay: i * 0.1 + 0.25 }}
                                    >
                                      {o.tier}
                                    </motion.span>
                                    <span
                                      className="text-[13px] font-semibold tabular-nums"
                                      style={{ color: tierColor, fontFamily: "var(--font-inter)" }}
                                      title={o.bandRange
                                        ? `Calibrated range: ${o.bandRange[0]}–${o.bandRange[1]}%. Estimates, never guarantees.`
                                        : "Approximate calibrated band — estimates, never guarantees."}
                                    >
                                      {o.band ?? (o.percent >= 60 ? "Very Likely" : o.percent >= 22 ? "Possible" : o.percent >= 7 ? "Long Shot" : "Hail Mary")}
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-2 h-1 w-full rounded-full overflow-hidden" style={{ backgroundColor: `${tierColor}15` }}>
                                  <motion.div
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: tierColor }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, o.percent)}%` }}
                                    transition={{ delay: i * 0.1 + 0.3, duration: 0.7, ease: "easeOut" }}
                                  />
                                </div>
                                <p className="mt-1.5 text-[11px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                                  {o.reason}
                                </p>
                              </motion.div>
                            );
                          })}
                        </div>
                        {/* Blurred remaining schools for free */}
                        {isFreePlan && (result.admissionOdds as SchoolOdds[]).length > 3 && (
                          <div className="mt-3">
                            <BlurredGate label={`See all ${(result.admissionOdds as SchoolOdds[]).length} schools — Upgrade`}>
                              <div className="space-y-3">
                                {(result.admissionOdds as SchoolOdds[]).slice(3).map((o) => {
                                  const tierColor = o.tier === "reach" ? "#EF4444" : o.tier === "target" ? "#4A6FA5" : "#22C55E";
                                  return (
                                    <div
                                      key={o.school}
                                      className="rounded-xl p-3.5"
                                      style={{ backgroundColor: `${tierColor}08`, border: `1px solid ${tierColor}25` }}
                                    >
                                      <div className="flex items-baseline justify-between">
                                        <p className="text-xs font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{o.school}</p>
                                        <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase" style={{ backgroundColor: `${tierColor}15`, color: tierColor }}>{o.tier}</span>
                                      </div>
                                      <p className="mt-1.5 text-[11px]" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{o.reason}</p>
                                    </div>
                                  );
                                })}
                              </div>
                            </BlurredGate>
                          </div>
                        )}
                      </>
                    ) : (
                      /* Legacy reach/target/safety format — always shown (only 3 items) */
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {(["reach", "target", "safety"] as const).map((k) => {
                          const o = (result.admissionOdds as { reach: Odds; target: Odds; safety: Odds })[k];
                          if (!o) return null;
                          return (
                            <div
                              key={k}
                              className="rounded-xl p-3.5"
                              style={{
                                backgroundColor: `var(--color-${k}-bg)`,
                                border: `1px solid var(--color-${k}-border)`,
                              }}
                            >
                              <div className="flex items-baseline justify-between">
                                <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: `var(--color-${k})` }}>{k}</p>
                                <p className="text-[13px] font-semibold tabular-nums" style={{ color: `var(--color-${k})`, fontFamily: "var(--font-inter)" }} title={`Approximate calibrated band — actual probability ~${o.percent}%`}>
                                  {o.percent >= 60 ? "Very Likely" : o.percent >= 22 ? "Possible" : o.percent >= 7 ? "Long Shot" : "Hail Mary"}
                                </p>
                              </div>
                              <p className="mt-0.5 text-xs font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{o.label}</p>
                              <p className="mt-1.5 text-[11px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{o.reason}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Per-School Micro-Strategies */}
                  {result.schoolMicroStrategies && result.schoolMicroStrategies.length > 0 && (
                    <motion.div
                      className="dl-card-hover card"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.35 }}
                    >
                      <div className="mb-4 flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" style={{ color: "#4A6FA5" }} />
                        <h3
                          className="text-[15px]"
                          style={{ color: "#1B2030", fontFamily: "var(--font-inter)", fontWeight: 700, letterSpacing: "-0.02em" }}
                        >
                          School-by-School Strategy
                        </h3>
                      </div>
                      <div className="space-y-4">
                        {result.schoolMicroStrategies.map((s, i) => (
                          <motion.details
                            key={s.school}
                            className="group rounded-xl border overflow-hidden"
                            style={{ borderColor: "rgba(74,111,165,0.15)", background: "rgba(255,255,255,0.5)" }}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.05, duration: 0.3 }}
                          >
                            <summary
                              className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-[13px] font-bold hover:bg-[rgba(74,111,165,0.03)] transition-colors [&::-webkit-details-marker]:hidden"
                              style={{ color: "var(--dl-text-primary, #1B2030)" }}
                            >
                              <ChevronRight
                                className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-open:rotate-90"
                                strokeWidth={2.25}
                                style={{ color: "#4A6FA5" }}
                              />
                              {s.school}
                            </summary>
                            <div className="px-4 pb-4 space-y-3">
                              <div className="rounded-lg p-3" style={{ background: "rgba(74,111,165,0.04)", borderLeft: "2px solid rgba(74,111,165,0.2)" }}>
                                <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: "#4A6FA5" }}>
                                  CDS Weight Alignment
                                </p>
                                <p className="text-[12px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                                  {s.cdsAlignment}
                                </p>
                              </div>
                              <div className="rounded-lg p-3" style={{ background: "rgba(34,197,94,0.04)", borderLeft: "2px solid rgba(34,197,94,0.2)" }}>
                                <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: "#16A34A" }}>
                                  The #1 Needle Mover
                                </p>
                                <p className="text-[12px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                                  {s.needleMover}
                                </p>
                              </div>
                              <div className="rounded-lg p-3" style={{ background: "rgba(74,111,165,0.04)", borderLeft: "2px solid rgba(74,111,165,0.2)" }}>
                                <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: "#4A6FA5" }}>
                                  Essay Angle for &ldquo;Why Us&rdquo;
                                </p>
                                <p className="text-[12px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                                  {s.essayAngle}
                                </p>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="rounded-lg p-3" style={{ background: "rgba(74,111,165,0.04)", borderLeft: "2px solid rgba(74,111,165,0.2)" }}>
                                  <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: "#4A6FA5" }}>
                                    Application Timing
                                  </p>
                                  <p className="text-[12px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                                    {s.applicationTiming}
                                  </p>
                                </div>
                                <div className="rounded-lg p-3" style={{ background: "rgba(74,111,165,0.04)", borderLeft: "2px solid rgba(74,111,165,0.2)" }}>
                                  <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: "#4A6FA5" }}>
                                    Reference in Your App
                                  </p>
                                  <p className="text-[12px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                                    {s.departmentReference}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.details>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Competitive Landscape */}
                  {result.competitiveLandscape && result.competitiveLandscape.length > 0 && (
                    <motion.div
                      className="dl-card-hover card"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35, duration: 0.35 }}
                    >
                      <div className="mb-4 flex items-center gap-2">
                        <Users className="h-4 w-4" style={{ color: "#4A6FA5" }} />
                        <h3
                          className="text-[15px]"
                          style={{ color: "#1B2030", fontFamily: "var(--font-inter)", fontWeight: 700, letterSpacing: "-0.02em" }}
                        >
                          Where You Stand in the Applicant Pool
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {result.competitiveLandscape.map((cl, i) => (
                          <motion.div
                            key={cl.school}
                            className="rounded-xl border p-3.5"
                            style={{ borderColor: "rgba(74,111,165,0.12)", background: "rgba(74,111,165,0.02)" }}
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.35 + i * 0.05, duration: 0.3 }}
                          >
                            <div className="flex items-baseline justify-between mb-2">
                              <p className="text-[13px] font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                                {cl.school}
                              </p>
                              <span className="text-[11px] font-medium" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                                ~{cl.poolSize} applicants
                              </span>
                            </div>
                            <p className="text-[12px] leading-relaxed mb-1.5" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                              {cl.cohortPosition}
                            </p>
                            <p className="text-[12px] leading-relaxed mb-1.5" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                              {cl.competingProfiles}
                            </p>
                            <div className="rounded-lg px-3 py-2" style={{ background: "rgba(74,111,165,0.06)" }}>
                              <p className="text-[11px] leading-relaxed" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                                <span className="font-bold" style={{ color: "#4A6FA5" }}>Your differentiator: </span>
                                {cl.differentiator}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Strengths */}
                  {result.strengths.length > 0 && (
                    <div
                      className="dl-card-hover card"
                      style={{ borderColor: "rgba(34,197,94,0.3)", backgroundColor: "var(--success-light)" }}
                    >
                      <h3 className="mb-3 flex items-center gap-2 font-bold" style={{ color: "var(--success)" }}>
                        <CheckCircle className="h-4 w-4" />
                        Strengths
                      </h3>
                      <ul className="space-y-2">
                        {result.strengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                            <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "var(--success)" }} />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Gaps */}
                  {result.gaps.length > 0 && (() => {
                    const weakest = getWeakestDimension(result.scores);
                    return (
                      <div
                        className="dl-card-hover card"
                        style={{ borderColor: "rgba(239,68,68,0.25)", backgroundColor: "var(--error-light)" }}
                      >
                        <h3 className="mb-3 flex items-center gap-2 font-bold" style={{ color: "var(--error)" }}>
                          <AlertCircle className="h-4 w-4" />
                          Gaps to Close
                        </h3>
                        {/* Weakest-dimension callout */}
                        <div
                          className="mb-3 rounded-lg border px-3 py-2.5"
                          style={{ borderColor: "rgba(239,68,68,0.15)", backgroundColor: "rgba(239,68,68,0.04)" }}
                        >
                          <p className="text-[12px] font-semibold" style={{ color: "var(--error)" }}>
                            Priority: {weakest.label} ({weakest.score}/100)
                          </p>
                          <p className="mt-0.5 text-[11px] leading-snug" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                            This is your lowest-scoring dimension. The roadmap below front-loads actions to improve it.
                          </p>
                        </div>
                        <ul className="space-y-2">
                          {result.gaps.map((g, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                              <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "var(--error)" }} />
                              {g}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })()}

                  {result.actionPlan && result.actionPlan.length > 0 && !isFreePlan && (
                    <div className="dl-card-hover card">
                      <h3 className="text-[15px] font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                        Ordered action plan
                      </h3>
                      <p className="mt-1 text-[11px] leading-relaxed" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                        Ordered by the lowest evidence-backed dimensions, with a concrete completion test for each step.
                      </p>
                      <ol className="mt-4 space-y-3">
                        {result.actionPlan.map((rankedAction) => (
                          <li key={`${rankedAction.priority}-${rankedAction.linkedDimension}`} className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: "#4A6FA5" }}>
                              {rankedAction.priority}
                            </span>
                            <div className="min-w-0">
                              <p className="text-[13px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{rankedAction.action}</p>
                              <p className="mt-1 text-[11px] leading-relaxed capitalize" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                                {rankedAction.timeframe.replaceAll("_", " ")} · {rankedAction.reason}
                              </p>
                              <p className="mt-1 text-[11px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                                <span className="font-semibold">Done when:</span> {rankedAction.successMeasure}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* What's next — free: 1 visible action, rest blurred */}
                  <motion.div
                    className="dl-card-hover card"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.35 }}
                    style={{
                      background: "linear-gradient(135deg, rgba(74,111,165,0.06), rgba(30,51,82,0.04))",
                      borderColor: "rgba(74,111,165,0.2)",
                    }}
                  >
                    <p
                      className="text-[11px] font-bold uppercase tracking-[0.12em] mb-1"
                      style={{ color: "#4A6FA5" }}
                    >
                      {isFreePlan ? "Your most impactful next step" : "What to do next"}
                    </p>
                    <p className="text-[12px] leading-snug mb-4" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                      {isFreePlan
                        ? "Here is the single highest-impact action you can take right now."
                        : "Based on your weakest dimensions, here are the 3 highest-impact actions you can take right now."}
                    </p>
                    {isFreePlan ? (
                      <>
                        {/* Show only the #1 action for free users */}
                        {(() => {
                          const sorted = [...DIMENSION_ORDER].sort((a, b) => result.scores[a] - result.scores[b]);
                          const weakestKey = sorted[0];
                          const act = DIMENSION_ACTIONS[weakestKey];
                          return (
                            <Link
                              href={act.href}
                              className="flex items-start gap-3 rounded-xl border p-3.5 transition-all duration-200 hover:border-[rgba(74,111,165,0.25)] hover:shadow-sm"
                              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.6)" }}
                            >
                              <span
                                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                                style={{ backgroundColor: "#4A6FA5" }}
                              >
                                1
                              </span>
                              <div className="min-w-0">
                                <p className="text-[13px] font-semibold leading-snug" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                                  {act.action}
                                  <span className="ml-1.5 text-[11px] font-normal" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                                    ({DIMENSION_LABELS[weakestKey]}: {result.scores[weakestKey]}/100)
                                  </span>
                                </p>
                                <p className="mt-0.5 text-[11px] leading-snug" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                                  {act.detail}
                                </p>
                              </div>
                              <ChevronRight className="mt-1 h-3.5 w-3.5 shrink-0" style={{ color: "#4A6FA5" }} />
                            </Link>
                          );
                        })()}
                        {/* Blurred remaining actions */}
                        <div className="mt-3">
                          <BlurredGate label="See your full action plan — Upgrade">
                            <div className="space-y-2.5">
                              {[...DIMENSION_ORDER].sort((a, b) => result.scores[a] - result.scores[b]).slice(1, 3).map((k, i) => {
                                const act = DIMENSION_ACTIONS[k];
                                return (
                                  <div key={k} className="flex items-start gap-3 rounded-xl border p-3.5" style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.6)" }}>
                                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: "#4A6FA5" }}>{i + 2}</span>
                                    <div className="min-w-0">
                                      <p className="text-[13px] font-semibold">{act.action}</p>
                                      <p className="mt-0.5 text-[11px]">{act.detail}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </BlurredGate>
                        </div>
                      </>
                    ) : (
                      <WeaknessBasedActions scores={result.scores} />
                    )}

                    <div className="mt-4 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                      <Link
                        href="/essays"
                        className="flex items-center gap-3 rounded-xl border p-3.5 transition-all duration-200 hover:border-[rgba(74,111,165,0.25)] hover:shadow-sm"
                        style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.6)" }}
                      >
                        <span
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                          style={{ background: "rgba(74,111,165,0.10)", color: "#4A6FA5" }}
                        >
                          <Sparkles className="h-4 w-4" strokeWidth={1.75} />
                        </span>
                        <div>
                          <p className="text-[13px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Score your essay</p>
                          <p className="text-[11px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>Get line-by-line feedback</p>
                        </div>
                      </Link>
                      <Link
                        href="/colleges"
                        className="flex items-center gap-3 rounded-xl border p-3.5 transition-all duration-200 hover:border-[rgba(74,111,165,0.25)] hover:shadow-sm"
                        style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.6)" }}
                      >
                        <span
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                          style={{ background: "rgba(74,111,165,0.10)", color: "#4A6FA5" }}
                        >
                          <Target className="h-4 w-4" strokeWidth={1.75} />
                        </span>
                        <div>
                          <p className="text-[13px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Build your school list</p>
                          <p className="text-[11px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>Reach, target, and safety</p>
                        </div>
                      </Link>
                    </div>
                  </motion.div>

                  {/* Pro upsell teaser — blurred preview of Pro-only insights */}
                  <motion.div
                    className="dl-card-hover card overflow-hidden"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55, duration: 0.35 }}
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
                        Unlock your full analysis
                      </p>
                    </div>

                    {/* Blurred Pro-only insight previews */}
                    <div className="space-y-3 mb-4">
                      {[
                        {
                          title: "Spike Analysis Deep-Dive",
                          preview: `Your submitted ${form.intendedMajor || "academic"} evidence produced a spike score of ${result.scores.spike}/100. The full report separates documented facts from interpretation and identifies the next evidence to build.`,
                        },
                        {
                          title: "School-Specific Gap Report",
                          preview: `The full school-specific report compares your documented dimensions with the available Common Data Set factors and flags gaps without treating them as admission guarantees.`,
                        },
                        {
                          title: "Admit Probability Breakdown",
                          preview: "See calibrated planning ranges, the evidence behind them, and the limits of what profile data can predict. No single action guarantees a change in an admission outcome.",
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="relative rounded-xl border p-3.5 overflow-hidden"
                          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.4)" }}
                        >
                          <p className="text-[12px] font-bold mb-1" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                            {item.title}
                          </p>
                          <p
                            className="text-[11px] leading-relaxed select-none"
                            style={{
                              color: "var(--dl-text-secondary, #454B5E)",
                              filter: "blur(4px)",
                              WebkitFilter: "blur(4px)",
                              userSelect: "none",
                            }}
                          >
                            {item.preview}
                          </p>
                          <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{ background: "rgba(255,255,255,0.15)" }}
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
                      See exactly what {form.targetColleges.split(/[,\n]/)[0]?.trim() || "your target schools"} {form.targetColleges.split(/[,\n]/)[0]?.trim() ? "is" : "are"} looking for. Pro members get spike deep-dives, school-specific gap reports, and re-analyses without the Free-plan cap.
                    </p>

                    <Link
                      href="/pricing"
                      className="dl-btn dl-btn-primary dl-btn-sm w-full justify-center"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Unlock full analysis — $19.99/mo
                    </Link>
                  </motion.div>

                  {/* Roadmap — free: fully blurred with upgrade CTA */}
                  {result.roadmap && (
                    isFreePlan ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" style={{ color: "#4A6FA5" }} />
                          <h3
                            className="text-sm font-bold uppercase tracking-wide"
                            style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}
                          >
                            Your complete 90-day plan
                          </h3>
                        </div>
                        <BlurredGate label="Upgrade for your complete 90-day plan">
                          <RoadmapBlock
                            Icon={CalendarDays}
                            title="Next 30 days"
                            subtitle="Tactical fixes — start this week"
                            items={result.roadmap.next30Days}
                            accent="#4A6FA5"
                            delay={0}
                          />
                          <RoadmapBlock
                            Icon={CalendarRange}
                            title="Next 90 days"
                            subtitle="Spike development & summer prep"
                            items={result.roadmap.next90Days}
                            accent="#1E3352"
                            delay={0.08}
                          />
                          <RoadmapBlock
                            Icon={CalendarCheck}
                            title="Next 365 days"
                            subtitle="Portfolio-defining moves"
                            items={result.roadmap.next365Days}
                            accent="#1E3352"
                            delay={0.16}
                          />
                        </BlurredGate>
                        <Link
                          href="/pricing"
                          className="dl-btn dl-btn-primary dl-btn-lg w-full justify-center"
                        >
                          <Sparkles className="h-4 w-4" />
                          Get your full roadmap — $19.99/mo
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" style={{ color: "#4A6FA5" }} />
                          <h3
                            className="text-sm font-bold uppercase tracking-wide"
                            style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}
                          >
                            Counselor-grade roadmap
                          </h3>
                        </div>
                        <RoadmapBlock
                          Icon={CalendarDays}
                          title="Next 30 days"
                          subtitle="Tactical fixes — start this week"
                          items={result.roadmap.next30Days}
                          accent="#4A6FA5"
                          delay={0}
                        />
                        <RoadmapBlock
                          Icon={CalendarRange}
                          title="Next 90 days"
                          subtitle="Spike development & summer prep"
                          items={result.roadmap.next90Days}
                          accent="#1E3352"
                          delay={0.08}
                        />
                        <RoadmapBlock
                          Icon={CalendarCheck}
                          title="Next 365 days"
                          subtitle="Portfolio-defining moves"
                          items={result.roadmap.next365Days}
                          accent="#1E3352"
                          delay={0.16}
                        />
                      </div>
                    )
                  )}
                </motion.div>
              ) : loading ? (
                <AnalysisLoadingState />
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="sticky top-24"
                >
                  <div
                    className="dl-card-hover card flex min-h-96 flex-col items-center justify-center text-center"
                    style={{
                      background: "rgba(255,255,255,0.45)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    <div
                      className="mb-5 flex items-center justify-center"
                      style={{ color: "#4A6FA5" }}
                    >
                      <EmptyAnalyses size={96} />
                    </div>
                    <p className="text-xl font-bold" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>
                      Fill in your profile to see where you stand.
                    </p>
                    <p className="mt-2 max-w-xs text-sm" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                      We&apos;ll score the 7 dimensions, estimate your odds at the schools you list, and lay out a 30 / 90 / 365-day plan around your real gaps.
                    </p>
                    <div className="mt-6 flex items-center gap-5">
                      {[
                        { icon: Zap, label: "7 dimensions" },
                        { icon: Target, label: "Calibrated odds" },
                        { icon: TrendingUp, label: "30/90/365 plan" },
                      ].map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-1.5 text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                          <Icon className="h-3.5 w-3.5" style={{ color: "#4A6FA5" }} />
                          {label}
                        </div>
                      ))}
                    </div>
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
