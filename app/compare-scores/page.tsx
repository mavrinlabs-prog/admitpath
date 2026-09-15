"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Copy,
  Check,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  Share2,
} from "lucide-react";

/**
 * Compare Scores — side-by-side profile comparison with "challenge a friend" CTA.
 *
 * Students paste a comparison link to see how they stack up across all 7
 * dimensions. Drives viral sharing through competitive motivation.
 *
 * URL params: /compare-scores?you=82,75,90,70,85,78,80&friend=78,80,65,75,70,82,85&fn=Alex
 */

interface ScoreSet {
  academicRigor: number;
  leadership: number;
  awards: number;
  activityDepth: number;
  spike: number;
  essayQuality: number;
  recommendations: number;
  overall: number;
}

const DIMENSIONS = [
  { key: "academicRigor", label: "Academic Rigor" },
  { key: "leadership", label: "Leadership" },
  { key: "awards", label: "Awards" },
  { key: "activityDepth", label: "Activity Depth" },
  { key: "spike", label: "Spike" },
  { key: "essayQuality", label: "Essay Quality" },
  { key: "recommendations", label: "Recommendations" },
] as const;

function parseScores(csv: string | null, fallback: number[]): ScoreSet {
  const vals = csv
    ? csv.split(",").map((v) => Math.min(100, Math.max(0, parseInt(v, 10) || 0)))
    : fallback;
  const padded = [...vals, ...Array(7).fill(0)].slice(0, 7);
  const overall = Math.round(padded.reduce((a, b) => a + b, 0) / 7);
  return {
    academicRigor: padded[0],
    leadership: padded[1],
    awards: padded[2],
    activityDepth: padded[3],
    spike: padded[4],
    essayQuality: padded[5],
    recommendations: padded[6],
    overall,
  };
}

function DiffIndicator({ diff }: { diff: number }) {
  if (diff > 0) {
    return (
      <span
        className="inline-flex items-center gap-1 text-xs font-bold"
        style={{ color: "var(--dl-green, #16A34A)" }}
      >
        <TrendingUp className="h-3 w-3" strokeWidth={2.5} />+{diff}
      </span>
    );
  }
  if (diff < 0) {
    return (
      <span
        className="inline-flex items-center gap-1 text-xs font-bold"
        style={{ color: "var(--color-error, #DC2626)" }}
      >
        <TrendingDown className="h-3 w-3" strokeWidth={2.5} />{diff}
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-bold"
      style={{ color: "var(--dl-text-muted, #5A6275)" }}
    >
      <Minus className="h-3 w-3" strokeWidth={2.5} />Tied
    </span>
  );
}

export default function CompareScoresPage() {
  const [copied, setCopied] = useState(false);

  // Read from URL params on client
  const params =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();

  const friendName = params.get("fn") || "Friend";
  const you = parseScores(params.get("you"), [82, 75, 90, 70, 85, 78, 80]);
  const friend = parseScores(params.get("friend"), [78, 80, 65, 75, 70, 82, 85]);

  const hasComparison = params.has("you") && params.has("friend");

  const youAheadCount = DIMENSIONS.filter(
    (d) => you[d.key] > friend[d.key],
  ).length;
  const friendAheadCount = DIMENSIONS.filter(
    (d) => friend[d.key] > you[d.key],
  ).length;

  const base =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://admith.vercel.app";

  const challengeLink = `${base}/compare-scores?you=___&friend=${Object.values(you).slice(0, 7).join(",")}&fn=You`;
  const shareText = `I'm comparing my AdmitPath scores with a friend. Challenge me: ${challengeLink}`;

  const handleCopyChallenge = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(challengeLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      if (typeof window !== "undefined") window.prompt("Copy:", challengeLink);
    }
  }, [challengeLink]);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}
    >
      {/* Header */}
      <header
        className="border-b py-4 px-6"
        style={{
          borderColor: "rgba(0,0,0,0.06)",
          background: "var(--dl-bg-white, #fff)",
        }}
      >
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <Link
            href="/"
            className="font-bold text-lg"
            style={{ color: "var(--dl-text-primary, #1B2030)" }}
          >
            AdmitPath
          </Link>
          <Link
            href="/dashboard"
            className="dl-btn dl-btn-primary dl-btn-sm inline-flex items-center gap-1.5"
          >
            Dashboard <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
        {/* Hero */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold mb-5"
            style={{
              background: "rgba(74,111,165,0.10)",
              color: "var(--dl-brand, #4A6FA5)",
              border: "1px solid rgba(74,111,165,0.15)",
            }}
          >
            <Users className="h-3.5 w-3.5" strokeWidth={2} />
            Score Comparison
          </div>
          <h1
            className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3"
            style={{
              color: "var(--dl-text-primary, #1B2030)",
              letterSpacing: "-0.03em",
            }}
          >
            Compare your scores
          </h1>
          <p
            className="text-base max-w-lg mx-auto"
            style={{ color: "var(--dl-text-secondary, #454B5E)" }}
          >
            See how you stack up against a friend across all 7 dimensions.
            Identify your strengths and where to improve.
          </p>
        </div>

        {/* Summary strip */}
        <div
          className="grid grid-cols-3 gap-4 mb-8 mx-auto max-w-xl"
        >
          {[
            {
              label: "You lead",
              value: youAheadCount,
              color: "var(--dl-green, #16A34A)",
              bg: "rgba(34,197,94,0.08)",
            },
            {
              label: "Tied",
              value: 7 - youAheadCount - friendAheadCount,
              color: "var(--dl-text-muted, #5A6275)",
              bg: "rgba(0,0,0,0.04)",
            },
            {
              label: `${friendName} leads`,
              value: friendAheadCount,
              color: "var(--color-error, #DC2626)",
              bg: "rgba(239,68,68,0.06)",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl py-4 text-center"
              style={{ background: stat.bg }}
            >
              <p
                className="text-2xl font-extrabold"
                style={{ color: stat.color, fontFamily: "var(--dl-font-mono)" }}
              >
                {stat.value}
              </p>
              <p className="text-xs font-medium mt-1" style={{ color: "var(--dl-text-muted)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Comparison card */}
        <div
          className="rounded-2xl border p-6 sm:p-8 mb-8"
          style={{
            background: "var(--dl-bg-white, #fff)",
            borderColor: "rgba(0,0,0,0.06)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          {/* Desktop: side-by-side bars */}
          <div className="hidden sm:block">
            {/* Column headers */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
              <span
                className="w-32 text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--dl-text-muted, #5A6275)" }}
              >
                Dimension
              </span>
              <span
                className="flex-1 text-center text-sm font-bold"
                style={{ color: "var(--dl-brand, #4A6FA5)" }}
              >
                You
              </span>
              <span
                className="w-16 text-center text-xs font-bold"
                style={{ color: "var(--dl-text-muted, #5A6275)" }}
              >
                Diff
              </span>
              <span
                className="flex-1 text-center text-sm font-bold"
                style={{ color: "var(--dl-text-secondary, #454B5E)" }}
              >
                {friendName}
              </span>
            </div>

            {/* Dimension rows */}
            <div className="space-y-4">
              {DIMENSIONS.map((dim) => {
                const youVal = you[dim.key];
                const friendVal = friend[dim.key];
                const diff = youVal - friendVal;
                return (
                  <div key={dim.key} className="flex items-center gap-4">
                    <span
                      className="w-32 shrink-0 text-xs font-semibold"
                      style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                    >
                      {dim.label}
                    </span>

                    {/* You bar */}
                    <div className="flex-1 flex items-center gap-2">
                      <div
                        className="flex-1 h-3 rounded-full overflow-hidden"
                        style={{ background: "var(--dl-bg-sunken, #E3E8F1)" }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${youVal}%`,
                            background: "linear-gradient(90deg, var(--dl-brand, #4A6FA5), var(--dl-brand-dark, #2E4A6E))",
                          }}
                        />
                      </div>
                      <span
                        className="w-7 text-xs font-bold text-right"
                        style={{ color: "var(--dl-brand, #4A6FA5)", fontFamily: "var(--dl-font-mono)" }}
                      >
                        {youVal}
                      </span>
                    </div>

                    {/* Diff */}
                    <div className="w-16 text-center">
                      <DiffIndicator diff={diff} />
                    </div>

                    {/* Friend bar */}
                    <div className="flex-1 flex items-center gap-2">
                      <span
                        className="w-7 text-xs font-bold"
                        style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--dl-font-mono)" }}
                      >
                        {friendVal}
                      </span>
                      <div
                        className="flex-1 h-3 rounded-full overflow-hidden"
                        style={{ background: "var(--dl-bg-sunken, #E3E8F1)" }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${friendVal}%`,
                            background: "var(--dl-text-muted, #5A6275)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Overall */}
            <div
              className="flex items-center gap-4 mt-6 pt-4 border-t"
              style={{ borderColor: "rgba(0,0,0,0.06)" }}
            >
              <span
                className="w-32 text-sm font-extrabold"
                style={{ color: "var(--dl-text-primary, #1B2030)" }}
              >
                Overall
              </span>
              <div className="flex-1 text-center">
                <span
                  className="text-2xl font-extrabold"
                  style={{ color: "var(--dl-brand, #4A6FA5)", fontFamily: "var(--dl-font-mono)" }}
                >
                  {you.overall}
                </span>
              </div>
              <div className="w-16 text-center">
                <DiffIndicator diff={you.overall - friend.overall} />
              </div>
              <div className="flex-1 text-center">
                <span
                  className="text-2xl font-extrabold"
                  style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--dl-font-mono)" }}
                >
                  {friend.overall}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile: stacked cards per dimension */}
          <div className="sm:hidden space-y-4">
            {DIMENSIONS.map((dim) => {
              const youVal = you[dim.key];
              const friendVal = friend[dim.key];
              const diff = youVal - friendVal;
              return (
                <div key={dim.key}>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                    >
                      {dim.label}
                    </span>
                    <DiffIndicator diff={diff} />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-12 text-[10px] font-bold" style={{ color: "var(--dl-brand, #4A6FA5)" }}>You</span>
                      <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: "var(--dl-bg-sunken, #E3E8F1)" }}>
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${youVal}%`, background: "linear-gradient(90deg, #4A6FA5, #2E4A6E)" }} />
                      </div>
                      <span className="w-7 text-xs font-bold text-right" style={{ color: "#4A6FA5" }}>{youVal}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-12 text-[10px] font-bold truncate" style={{ color: "var(--dl-text-muted, #5A6275)" }}>{friendName}</span>
                      <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: "var(--dl-bg-sunken, #E3E8F1)" }}>
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${friendVal}%`, background: "var(--dl-text-muted, #5A6275)" }} />
                      </div>
                      <span className="w-7 text-xs font-bold text-right" style={{ color: "var(--dl-text-muted, #5A6275)" }}>{friendVal}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Mobile overall */}
            <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--dl-brand, #4A6FA5)" }}>You</p>
                <span className="text-2xl font-extrabold" style={{ color: "var(--dl-brand, #4A6FA5)" }}>{you.overall}</span>
              </div>
              <DiffIndicator diff={you.overall - friend.overall} />
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--dl-text-muted, #5A6275)" }}>{friendName}</p>
                <span className="text-2xl font-extrabold" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{friend.overall}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Insight callout */}
        <div
          className="rounded-2xl border p-5 mb-8"
          style={{
            background: "rgba(74,111,165,0.05)",
            borderColor: "rgba(74,111,165,0.12)",
          }}
        >
          <p
            className="text-sm font-semibold mb-2"
            style={{ color: "var(--dl-text-primary, #1B2030)" }}
          >
            Key Insights
          </p>
          <ul className="space-y-1.5 text-sm" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            {DIMENSIONS.filter((d) => you[d.key] > friend[d.key])
              .slice(0, 2)
              .map((d) => (
                <li key={d.key}>
                  You&rsquo;re ahead in <strong>{d.label}</strong> by{" "}
                  {you[d.key] - friend[d.key]} points
                </li>
              ))}
            {DIMENSIONS.filter((d) => friend[d.key] > you[d.key])
              .slice(0, 2)
              .map((d) => (
                <li key={d.key}>
                  {friendName} leads in <strong>{d.label}</strong> by{" "}
                  {friend[d.key] - you[d.key]} points — focus here to close the gap
                </li>
              ))}
          </ul>
        </div>

        {/* Challenge a friend CTA */}
        <div
          className="rounded-2xl border p-6 sm:p-8 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(74,111,165,0.06), rgba(74,111,165,0.02))",
            borderColor: "rgba(74,111,165,0.12)",
          }}
        >
          <h2
            className="text-xl font-extrabold mb-2"
            style={{ color: "var(--dl-text-primary, #1B2030)" }}
          >
            Challenge a friend
          </h2>
          <p
            className="text-sm mb-5 max-w-md mx-auto"
            style={{ color: "var(--dl-text-secondary, #454B5E)" }}
          >
            Send your scores to a friend and see who comes out on top. They
            fill in their scores and the comparison generates automatically.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleCopyChallenge}
              aria-label={copied ? "Challenge link copied" : "Copy challenge link to clipboard"}
              className="dl-btn dl-btn-primary inline-flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" /> Link copied!
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" /> Copy challenge link
                </>
              )}
            </button>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:underline"
              style={{ color: "var(--dl-brand, #4A6FA5)" }}
            >
              Get your score <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
