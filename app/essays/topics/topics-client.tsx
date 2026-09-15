"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, Lightbulb, AlertTriangle, Wand2 } from "lucide-react";
import { COMMON_APP_PROMPTS } from "@/lib/prompts/essay-topics";

type Topic = {
  prompt: number;
  title: string;
  anchor: string;
  angle: string;
  avoid: string;
};

type TopicsResponse = {
  topics?: Topic[];
  tierUsed?: number;
  error?: string;
  nextStep?: string;
};

export function TopicsClient() {
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<Topic[] | null>(null);
  const [error, setError] = useState<{ message: string; nextStep?: string; isPaywall?: boolean } | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/essay/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      const data = (await res.json()) as TopicsResponse & { upgradeUrl?: string };
      if (!res.ok) {
        setError({
          message: data.error ?? "Could not generate topics. Please try again.",
          nextStep: data.nextStep ?? data.upgradeUrl,
          isPaywall: res.status === 429 || res.status === 403,
        });
        setTopics(null);
        return;
      }
      setTopics(Array.isArray(data.topics) ? data.topics : []);
      setRetryCount(0);
    } catch {
      setRetryCount((prev) => prev + 1);
      setError({
        message: retryCount >= 2
          ? "Persistent network issue. Check your connection and refresh the page."
          : "Network error. Please retry.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        <Link
          href="/essays"
          className="inline-flex items-center gap-2 text-sm mb-6"
          style={{ color: "var(--dl-text-muted, #5A6275)" }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to essays
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <span className="badge-primary inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            New
          </span>
          <span className="text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            Counts as 1 essay credit · Free tier gets 3
          </span>
        </div>

        <h1
          className="font-bold tracking-tight mb-3"
          style={{
            color: "#1B2030",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            lineHeight: 1.1,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          Essay topic ideas, anchored in your profile
        </h1>
        <p className="mb-8 text-base" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          We read your activities, awards, and courses, then suggest 3-5 Common App
          topics that only you could write — with the cliché trap to avoid for each.
          We don&apos;t draft the essay; we pick the topic.
        </p>

        <button
          onClick={generate}
          disabled={loading}
          className="dl-btn dl-btn-primary text-base px-6 py-3 disabled:opacity-60"
        >
          <Wand2 className="h-4 w-4" strokeWidth={1.75} />
          {loading ? "Reading your profile…" : topics ? "Regenerate topics" : "Generate topics"}
        </button>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 border p-4 flex items-start gap-3"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderRadius: "14px" }}
            >
              <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" style={{ color: "#92400E" }} />
              <div className="flex-1">
                <p className="text-sm" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                  {error.message}
                </p>
                {error.nextStep && (
                  <Link
                    href={error.nextStep}
                    className="inline-flex items-center gap-1.5 mt-2 text-sm font-medium underline"
                    style={{ color: "#4A6FA5" }}
                  >
                    {error.isPaywall ? "View plans" : "Finish your profile"} →
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {topics && topics.length === 0 && !error && (
          <p
            className="mt-6 text-sm"
            style={{ color: "var(--dl-text-muted, #5A6275)" }}
          >
            No topics surfaced — your profile may need more concrete detail. Try adding
            specific roles, impact numbers, or course names.
          </p>
        )}

        <div className="mt-8 space-y-4">
          {topics?.map((t, i) => (
            <motion.div
              key={`${t.prompt}-${i}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="dl-card-hover border p-6"
              style={{
                borderColor: "rgba(0,0,0,0.06)",
                background: "rgba(255,255,255,0.45)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderRadius: "14px",
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2
                  className="text-lg font-semibold"
                  style={{ color: "var(--dl-text-primary, #1B2030)" }}
                >
                  {t.title}
                </h2>
                <span
                  className="shrink-0 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full"
                  style={{
                    background: "rgba(74,111,165,0.08)",
                    color: "#4A6FA5",
                  }}
                >
                  Prompt {t.prompt}
                </span>
              </div>

              <p className="text-xs italic mb-4" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                {COMMON_APP_PROMPTS[t.prompt] ?? ""}
              </p>

              <Field icon={<Lightbulb className="h-3.5 w-3.5" />} label="Anchored in" body={t.anchor} />
              <Field label="The angle" body={t.angle} />
              <Field
                icon={<AlertTriangle className="h-3.5 w-3.5" style={{ color: "var(--dl-text-muted, #5A6275)" }} />}
                label="Cliché to avoid"
                body={t.avoid}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  body,
}: {
  icon?: React.ReactNode;
  label: string;
  body: string;
}) {
  return (
    <div className="mt-3 first:mt-0">
      <p
        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest mb-1"
        style={{ color: "var(--dl-text-muted, #5A6275)" }}
      >
        {icon}
        {label}
      </p>
      <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
        {body}
      </p>
    </div>
  );
}
