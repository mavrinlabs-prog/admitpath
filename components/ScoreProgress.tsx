"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AnalysisEntry {
  id: string;
  createdAt: string;
  overallScore: number | null;
  scores?: Record<string, number>;
}

interface ScoreProgressProps {
  analyses: AnalysisEntry[];
}

// ---------------------------------------------------------------------------
// 7 scoring dimensions (canonical order)
// ---------------------------------------------------------------------------

const DIMENSIONS = [
  { key: "academicRigor", label: "Academic Rigor" },
  { key: "leadership", label: "Leadership" },
  { key: "awards", label: "Awards" },
  { key: "activityDepth", label: "Activity Depth" },
  { key: "spike", label: "Spike" },
  { key: "essayQuality", label: "Essay Quality" },
  { key: "recommendations", label: "Recommendations" },
] as const;

// ---------------------------------------------------------------------------
// Sparkline — simple SVG line chart with draw animation
// ---------------------------------------------------------------------------

function Sparkline({ values }: { values: number[] }) {
  const width = 120;
  const height = 40;
  const padding = 6;

  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [values]);

  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values.map((v, i) => {
    const x = padding + (i / (values.length - 1)) * (width - padding * 2);
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return { x, y };
  });

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
      role="img"
      aria-label={`Score trend: ${values.join(", ")}`}
    >
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke="#4A6FA5"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: pathLength || 999,
          strokeDashoffset: pathLength || 999,
          animation: pathLength
            ? "sparkline-draw 1.2s ease-out forwards"
            : "none",
        }}
      />

      {/* Dots at each data point */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={2.5}
          fill="#FFFFFF"
          stroke="#4A6FA5"
          strokeWidth={1.5}
        />
      ))}

      <style>{`
        @keyframes sparkline-draw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Score Progress Component
// ---------------------------------------------------------------------------

export function ScoreProgress({ analyses }: ScoreProgressProps) {
  const count = analyses.length;

  // Extract score history (oldest first for the sparkline)
  const scoreHistory = analyses
    .filter((a) => a.overallScore !== null)
    .map((a) => a.overallScore as number)
    .reverse();

  const currentScore = scoreHistory.length > 0 ? scoreHistory[scoreHistory.length - 1] : null;
  const previousScore = scoreHistory.length > 1 ? scoreHistory[scoreHistory.length - 2] : null;
  const scoreDelta =
    currentScore !== null && previousScore !== null
      ? Math.round(currentScore - previousScore)
      : null;

  const improved = scoreDelta !== null && scoreDelta > 0;
  const declined = scoreDelta !== null && scoreDelta < 0;

  // Find weakest dimension that dropped (for decline messaging)
  const latest = analyses[0];
  const previous = analyses.length > 1 ? analyses[1] : null;
  let droppedDimension: { key: string; label: string; delta: number } | null = null;

  if (declined && latest?.scores && previous?.scores) {
    let worstDrop = 0;
    for (const dim of DIMENSIONS) {
      const curr = latest.scores[dim.key];
      const prev = previous.scores[dim.key];
      if (typeof curr === "number" && typeof prev === "number") {
        const d = curr - prev;
        if (d < worstDrop) {
          worstDrop = d;
          droppedDimension = { key: dim.key, label: dim.label, delta: Math.round(d) };
        }
      }
    }
  }

  // ---- 0 analyses: get started ----
  if (count === 0) {
    return (
      <section
        className="relative mb-8 border p-6"
        style={{
          background: "rgba(255,255,255,0.45)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderColor: "rgba(0,0,0,0.06)",
          borderRadius: "14px",
        }}
      >
        <p
          className="text-[11px] uppercase mb-3"
          style={{ color: "#4A6FA5", fontWeight: 700, letterSpacing: "0.12em" }}
        >
          Your Progress
        </p>
        <p
          className="text-[18px] leading-snug mb-1"
          style={{
            color: "var(--dl-text-primary, #1B2030)",
            fontFamily: "var(--font-inter)",
            fontWeight: 700,
          }}
        >
          Run your first analysis to get started
        </p>
        <p
          className="text-[14px] leading-relaxed mb-4"
          style={{ color: "var(--dl-text-secondary, #454B5E)" }}
        >
          See exactly where you stand across all 7 admissions dimensions. Your
          score becomes your roadmap.
        </p>
        <Link
          href="/analyze"
          className="dl-btn dl-btn-primary dl-btn-sm inline-flex items-center gap-1.5"
        >
          Run first analysis <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
        </Link>
      </section>
    );
  }

  // ---- 1 analysis: encourage second run ----
  if (count === 1 && currentScore !== null) {
    return (
      <section
        className="relative mb-8 border p-6"
        style={{
          background: "rgba(255,255,255,0.45)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderColor: "rgba(0,0,0,0.06)",
          borderRadius: "14px",
        }}
      >
        <p
          className="text-[11px] uppercase mb-3"
          style={{ color: "#4A6FA5", fontWeight: 700, letterSpacing: "0.12em" }}
        >
          Your Progress
        </p>
        <div className="flex items-end gap-5 mb-4">
          <div>
            <p
              className="text-[36px] leading-none tabular-nums"
              style={{
                color: "#4A6FA5",
                fontFamily: "var(--font-jetbrains-mono)",
                fontWeight: 700,
              }}
            >
              {Math.round(currentScore)}
              <span
                className="ml-1 text-[14px]"
                style={{ color: "#5A6275", fontFamily: "var(--font-inter)", fontWeight: 500 }}
              >
                / 100
              </span>
            </p>
            <p
              className="mt-1 text-[12px]"
              style={{ color: "var(--dl-text-muted, #5A6275)" }}
            >
              Current overall score
            </p>
          </div>
        </div>
        <div
          className="rounded-lg border px-4 py-3 mb-4"
          style={{
            borderColor: "rgba(74,111,165,0.15)",
            background: "rgba(74,111,165,0.04)",
          }}
        >
          <p
            className="text-[14px] leading-snug"
            style={{
              color: "var(--dl-text-primary, #1B2030)",
              fontWeight: 600,
            }}
          >
            Run your second analysis to start tracking progress
          </p>
          <p
            className="text-[12px] mt-1"
            style={{ color: "var(--dl-text-secondary, #454B5E)" }}
          >
            Improve your profile, then re-run to see your score change over time.
          </p>
        </div>
        <Link
          href="/analyze"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors hover:opacity-80"
          style={{ color: "#4A6FA5" }}
        >
          Run new analysis to update your score{" "}
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
        </Link>
      </section>
    );
  }

  // ---- 2+ analyses: full progress view ----
  return (
    <section
      className="relative mb-8 border p-6"
      style={{
        background: "rgba(255,255,255,0.45)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderColor: improved
          ? "rgba(22,163,74,0.12)"
          : declined
            ? "rgba(239,68,68,0.08)"
            : "rgba(0,0,0,0.06)",
        borderRadius: "14px",
      }}
    >
      <p
        className="text-[11px] uppercase mb-4"
        style={{ color: "#4A6FA5", fontWeight: 700, letterSpacing: "0.12em" }}
      >
        Your Progress
      </p>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        {/* Score + delta */}
        <div className="flex items-end gap-5">
          {currentScore !== null && (
            <div>
              <p
                className="text-[36px] leading-none tabular-nums"
                style={{
                  color: "#4A6FA5",
                  fontFamily: "var(--font-jetbrains-mono)",
                  fontWeight: 700,
                }}
              >
                {Math.round(currentScore)}
                <span
                  className="ml-1 text-[14px]"
                  style={{ color: "#5A6275", fontFamily: "var(--font-inter)", fontWeight: 500 }}
                >
                  / 100
                </span>
              </p>
              <p
                className="mt-1 text-[12px]"
                style={{ color: "var(--dl-text-muted, #5A6275)" }}
              >
                Current overall score
              </p>
            </div>
          )}

          {/* Score change badge */}
          {scoreDelta !== null && scoreDelta !== 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1"
              style={{
                background: improved
                  ? "rgba(22,163,74,0.06)"
                  : "rgba(239,68,68,0.05)",
                border: `1px solid ${
                  improved ? "rgba(22,163,74,0.12)" : "rgba(239,68,68,0.1)"
                }`,
              }}
            >
              {improved ? (
                <TrendingUp
                  className="h-3.5 w-3.5"
                  style={{ color: "#16A34A" }}
                  strokeWidth={2}
                />
              ) : (
                <TrendingDown
                  className="h-3.5 w-3.5"
                  style={{ color: "#EF4444" }}
                  strokeWidth={2}
                />
              )}
              <span
                className="text-[12px] font-semibold tabular-nums"
                style={{ color: improved ? "#16A34A" : "#EF4444" }}
              >
                {improved ? "+" : ""}
                {scoreDelta} since last
              </span>
            </motion.div>
          )}

          {scoreDelta === 0 && (
            <div
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1"
              style={{
                background: "rgba(74,111,165,0.04)",
                border: "1px solid rgba(74,111,165,0.08)",
              }}
            >
              <Minus
                className="h-3.5 w-3.5"
                style={{ color: "#4A6FA5" }}
                strokeWidth={2}
              />
              <span
                className="text-[12px] font-medium"
                style={{ color: "#4A6FA5" }}
              >
                No change
              </span>
            </div>
          )}
        </div>

        {/* Sparkline */}
        {scoreHistory.length >= 2 && (
          <div className="flex flex-col items-end gap-1">
            <Sparkline values={scoreHistory.slice(-5)} />
            <p
              className="text-[10px]"
              style={{ color: "var(--dl-text-muted, #5A6275)" }}
            >
              Last {Math.min(scoreHistory.length, 5)} analyses
            </p>
          </div>
        )}
      </div>

      {/* Improvement or decline note */}
      {improved && (
        <div
          className="mt-4 rounded-lg border px-4 py-3"
          style={{
            borderColor: "rgba(22,163,74,0.1)",
            background: "rgba(22,163,74,0.03)",
          }}
        >
          <p
            className="text-[13px] leading-snug"
            style={{
              color: "#16A34A",
              fontWeight: 600,
            }}
          >
            Score improved. Keep building on this momentum.
          </p>
          <p
            className="text-[12px] mt-1"
            style={{ color: "var(--dl-text-secondary, #454B5E)" }}
          >
            Re-run after each profile improvement to track your trajectory.
          </p>
        </div>
      )}

      {declined && (
        <div
          className="mt-4 rounded-lg border px-4 py-3"
          style={{
            borderColor: "rgba(239,68,68,0.08)",
            background: "rgba(239,68,68,0.02)",
          }}
        >
          <p
            className="text-[13px] leading-snug"
            style={{
              color: "var(--dl-text-primary, #1B2030)",
              fontWeight: 600,
            }}
          >
            Score dipped slightly.
          </p>
          {droppedDimension && (
            <p
              className="text-[12px] mt-1"
              style={{ color: "var(--dl-text-secondary, #454B5E)" }}
            >
              {droppedDimension.label} dropped {Math.abs(droppedDimension.delta)}{" "}
              points.{" "}
              <Link
                href="/analyze"
                className="font-semibold underline"
                style={{ color: "#4A6FA5" }}
              >
                See what changed
              </Link>
            </p>
          )}
          {!droppedDimension && (
            <p
              className="text-[12px] mt-1"
              style={{ color: "var(--dl-text-secondary, #454B5E)" }}
            >
              Small fluctuations are normal. Focus on your weakest dimension for
              the biggest gains.
            </p>
          )}
        </div>
      )}

      {/* CTA */}
      <div className="mt-4">
        <Link
          href="/analyze"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors hover:opacity-80"
          style={{ color: "#4A6FA5" }}
        >
          Run new analysis to update your score{" "}
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
        </Link>
      </div>
    </section>
  );
}
