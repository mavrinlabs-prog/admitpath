"use client";

import { useMemo } from "react";
import { Sparkles, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { scoreVoice, VOICE_AXIS_LABEL, type VoiceAxis } from "@/lib/voice-rubric";
import { scoreWhyUs } from "@/lib/why-us-scorer";
import { findCollegeByName } from "@/data/colleges";

type Props = {
  /** The essay text being drafted. */
  content: string;
  /** Target college name (free-text from the form). Used by why-us scorer. */
  collegeName?: string;
  /** Show only the why-us scorer when the prompt looks like a "Why us?" supplement. */
  isWhyUs?: boolean;
  /** Optional word-count limit (Common App = 650, supplements vary). */
  wordLimit?: number;
};

function scoreColor(score: number): string {
  if (score >= 75) return "#16A34A";
  if (score >= 55) return "#4A6FA5";
  if (score >= 35) return "#D97706";
  return "#DC2626";
}

function scoreLabel(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 75) return "Strong";
  if (score >= 55) return "Developing";
  if (score >= 35) return "Needs work";
  return "Weak";
}

function ScoreTrend({ score }: { score: number }) {
  if (score >= 75) return <TrendingUp className="h-3 w-3" style={{ color: "#16A34A" }} aria-label="Strong" />;
  if (score >= 35) return <Minus className="h-3 w-3" style={{ color: "#D97706" }} aria-label="Average" />;
  return <TrendingDown className="h-3 w-3" style={{ color: "#DC2626" }} aria-label="Needs improvement" />;
}

export function EssayLiveCoach({ content, collegeName, isWhyUs, wordLimit = 650 }: Props) {
  const voice = useMemo(
    () => (content.trim().length > 30 ? scoreVoice(content) : null),
    [content]
  );

  const whyUs = useMemo(() => {
    if (!isWhyUs || !collegeName || content.trim().length < 30) return null;
    const school = findCollegeByName(collegeName);
    if (!school) return null;
    return scoreWhyUs(content, school);
  }, [content, collegeName, isWhyUs]);

  // Word and character counts
  const wordCount = useMemo(
    () => (content.trim().match(/\S+/g) ?? []).length,
    [content]
  );
  const charCount = content.length;

  if (!voice && !whyUs) {
    // Even before scoring kicks in, show the word counter so students
    // can see their progress while drafting the first few sentences.
    if (content.trim().length > 0) {
      return (
        <div
          className="rounded-xl border p-4"
          style={{ background: "rgba(255,255,255,0.45)", borderColor: "rgba(0,0,0,0.06)" }}
        >
          <div className="flex items-center justify-between">
            <p className="text-[12px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              Keep writing — scoring starts at ~30 characters.
            </p>
            <p className="text-[12px] font-semibold tabular-nums" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              {wordCount}/{wordLimit} words
            </p>
          </div>
        </div>
      );
    }
    return null;
  }

  // Word count status color
  const wcColor =
    wordCount > wordLimit ? "#DC2626"
    : wordCount >= wordLimit * 0.75 ? "#16A34A"
    : wordCount >= wordLimit * 0.5 ? "#4A6FA5"
    : "var(--dl-text-muted, #5A6275)";

  return (
    <div
      className="dl-card-hover rounded-xl border p-4 sm:p-5"
      style={{ background: "rgba(255,255,255,0.45)", borderColor: "rgba(0,0,0,0.06)" }}
      role="region"
      aria-label="Live essay coaching scores"
    >
      <div className="flex items-center justify-between mb-3">
        <h3
          className="flex items-center gap-2 text-[14px] font-semibold"
          style={{ color: "var(--dl-text-primary, #1B2030)" }}
        >
          <Sparkles className="h-3.5 w-3.5" style={{ color: "#4A6FA5" }} />
          Live coach
          <span className="text-[10px] font-normal" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            updates as you type · no AI call
          </span>
        </h3>
        {/* Word + character counter */}
        <div className="flex items-center gap-3">
          <span
            className="text-[11px] tabular-nums font-semibold"
            style={{ color: wcColor }}
            aria-label={`${wordCount} of ${wordLimit} words`}
          >
            {wordCount}/{wordLimit} words
          </span>
          <span
            className="text-[10px] tabular-nums"
            style={{ color: "var(--dl-text-muted, #5A6275)" }}
            aria-label={`${charCount} characters`}
          >
            {charCount.toLocaleString()} chars
          </span>
        </div>
      </div>

      {/* Composite score summary */}
      {voice && (
        <div
          className="flex items-center gap-3 rounded-lg px-3 py-2 mb-4"
          style={{ background: "var(--dl-bg-sunken, #E3E8F1)" }}
        >
          <p
            className="text-[28px] font-bold tabular-nums leading-none"
            style={{ color: scoreColor(voice.composite) }}
            aria-label={`Composite voice score: ${voice.composite}`}
          >
            {voice.composite}
          </p>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              {scoreLabel(voice.composite)}
            </p>
            <p className="text-[10px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              Composite across 4 voice axes (Place, Detail, Vulnerability, Surprise)
            </p>
          </div>
        </div>
      )}

      {/* Voice rubric */}
      {voice && (
        <div className="mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            {(Object.keys(voice.scores) as VoiceAxis[]).map((axis) => (
              <div
                key={axis}
                className="rounded-lg p-2.5"
                style={{ background: "var(--dl-bg-sunken, #E3E8F1)" }}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                    {VOICE_AXIS_LABEL[axis]}
                  </p>
                  <ScoreTrend score={voice.scores[axis]} />
                </div>
                <p
                  className="text-[18px] font-bold tabular-nums"
                  style={{ color: scoreColor(voice.scores[axis]) }}
                  aria-label={`${VOICE_AXIS_LABEL[axis]}: ${voice.scores[axis]} out of 100`}
                >
                  {voice.scores[axis]}
                </p>
                <p className="text-[9px] mt-0.5" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                  {scoreLabel(voice.scores[axis])}
                </p>
              </div>
            ))}
          </div>
          {voice.feedback.length > 0 && (
            <ul className="space-y-1.5" aria-label="Voice feedback suggestions">
              {voice.feedback.slice(0, 3).map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-[12px]">
                  <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" style={{ color: "#D97706" }} aria-hidden />
                  <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{f}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Word count warning */}
      {wordCount > wordLimit && (
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 mb-4 text-[12px]"
          style={{ background: "rgba(220,38,38,0.06)", color: "#DC2626" }}
          role="alert"
        >
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          <span className="font-medium">
            {wordCount - wordLimit} words over the {wordLimit}-word limit. Trim to avoid auto-rejection.
          </span>
        </div>
      )}

      {/* Why-us specificity */}
      {whyUs && (
        <div
          className="rounded-lg p-3 border-t pt-3"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-[12px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Why-us specificity
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[10px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                {scoreLabel(whyUs.score)}
              </span>
              <p className="text-[18px] font-bold tabular-nums" style={{ color: scoreColor(whyUs.score) }}>
                {whyUs.score}
              </p>
            </div>
          </div>
          <p className="text-[11px] mb-2" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            {whyUs.specificSignals.length} specific signal{whyUs.specificSignals.length !== 1 ? "s" : ""} · {whyUs.genericPhrases.length} generic phrase{whyUs.genericPhrases.length !== 1 ? "s" : ""}
          </p>
          {whyUs.feedback.length > 0 && (
            <ul className="space-y-1.5" aria-label="Why-us feedback">
              {whyUs.feedback.slice(0, 3).map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-[12px]">
                  {whyUs.score >= 70 ? (
                    <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0" style={{ color: "#16A34A" }} aria-hidden />
                  ) : (
                    <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" style={{ color: "#D97706" }} aria-hidden />
                  )}
                  <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{f}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
