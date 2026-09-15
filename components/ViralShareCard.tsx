"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Copy,
  Check,
  Gift,
  Users,
} from "lucide-react";

/**
 * ViralShareCard — post-score viral share component (Dropbox referral-style).
 *
 * Triggered when a user scores > 70 on their profile analysis. Shows:
 * - Celebratory score card
 * - A canonical, attributed referral link when the user is authenticated
 * - Referral progress bar: "Invite 3 friends -> Get 1 month Pro FREE"
 *
 * DL design system tokens throughout.
 */

interface ViralShareCardProps {
  score: number;
  className?: string;
}

const CANONICAL_QUIZ_URL = "https://admith.vercel.app/quiz";

export function ViralShareCard({ score, className }: ViralShareCardProps) {
  const [copiedChannel, setCopiedChannel] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState(CANONICAL_QUIZ_URL);
  const [referralCount, setReferralCount] = useState(0);
  const [hasReferralAttribution, setHasReferralAttribution] = useState(false);

  useEffect(() => {
    if (score <= 70) return;

    fetch("/api/referrals")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (typeof data?.referralUrl === "string") {
          setShareUrl(data.referralUrl);
          setHasReferralAttribution(true);
        }
        if (typeof data?.referralCount === "number") {
          setReferralCount(data.referralCount);
        }
      })
      .catch(() => {
        // Keep the canonical quiz link without presenting referral rewards.
      });
  }, [score]);

  const copyToClipboard = useCallback(
    async (channel: string, text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedChannel(channel);
        setTimeout(() => setCopiedChannel(null), 2500);
      } catch {
        if (typeof window !== "undefined") {
          window.prompt("Copy this message:", text);
        }
      }
    },
    [],
  );

  // Only show for scores > 70
  if (score <= 70) return null;

  const referralGoal = 3;
  const referralProgress = Math.min(referralCount, referralGoal);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Celebratory header card */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(74,111,165,0.08), rgba(34,197,94,0.06))",
          borderColor: "rgba(34,197,94,0.2)",
        }}
      >
        {/* Celebration header */}
        <div
          className="px-5 py-4 flex items-center gap-3"
          style={{
            background:
              "linear-gradient(135deg, var(--dl-brand, #4A6FA5), var(--dl-brand-dark, #2E4A6E))",
          }}
        >
          <Trophy className="h-5 w-5 text-white shrink-0" strokeWidth={2} />
          <div>
            <p className="text-sm font-bold text-white">
              Nice! You scored {Math.round(score)}/100
            </p>
            <p className="text-xs text-white/70">
              That puts you ahead of most applicants.
            </p>
          </div>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Prompt */}
          <p
            className="text-[13px] font-semibold"
            style={{ color: "var(--dl-text-primary, #1B2030)" }}
          >
            Your friends would want to know their scores too
          </p>

          {/* Copy link only */}
          <div className="space-y-2.5">
            <button
              type="button"
              aria-label={hasReferralAttribution ? "Copy your referral link" : "Copy the score quiz link"}
              onClick={() => copyToClipboard("link", shareUrl)}
              className="w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200 hover:border-[rgba(74,111,165,0.25)] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A6FA5] focus-visible:ring-offset-2"
              style={{
                borderColor: "rgba(0,0,0,0.06)",
                background: "rgba(255,255,255,0.7)",
              }}
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ background: "var(--dl-brand, #4A6FA5)", color: "#fff" }}
              >
                <Copy className="h-4 w-4" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[12px] font-bold"
                  style={{ color: "var(--dl-text-primary, #1B2030)" }}
                >
                  Copy link
                </p>
                <p
                  className="text-[11px] truncate"
                  style={{ color: "var(--dl-text-muted, #5A6275)" }}
                >
                  {shareUrl}
                </p>
              </div>
              {copiedChannel === "link" ? (
                <Check
                  className="h-4 w-4 shrink-0"
                  style={{ color: "#22C55E" }}
                />
              ) : (
                <Copy
                  className="h-4 w-4 shrink-0"
                  style={{ color: "var(--dl-text-muted, #5A6275)" }}
                />
              )}
            </button>

            {/* Instagram and Twitter share buttons removed — copy link only */}

          </div>

          {/* Referral progress bar */}
          {hasReferralAttribution ? <div
            className="rounded-xl border px-4 py-3.5"
            style={{
              borderColor: "rgba(74,111,165,0.15)",
              background: "rgba(74,111,165,0.04)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Gift className="h-4 w-4" style={{ color: "var(--dl-brand, #4A6FA5)" }} />
              <p
                className="text-[12px] font-bold"
                style={{ color: "var(--dl-text-primary, #1B2030)" }}
              >
                Invite 3 friends &rarr; Get 1 month Pro FREE
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div
                className="flex-1 h-2 rounded-full overflow-hidden"
                style={{ background: "rgba(0,0,0,0.06)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--dl-brand, #4A6FA5), #22C55E)",
                  }}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(referralProgress / referralGoal) * 100}%`,
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <span
                className="text-[11px] font-bold tabular-nums shrink-0"
                style={{
                  color: "var(--dl-text-muted, #5A6275)",
                  fontFamily: "var(--dl-font-mono)",
                }}
              >
                {referralProgress}/{referralGoal}
              </span>
            </div>

            <div className="flex items-center gap-1.5 mt-1.5">
              <Users
                className="h-3 w-3"
                style={{ color: "var(--dl-text-muted, #5A6275)" }}
              />
              <p
                className="text-[10px]"
                style={{ color: "var(--dl-text-muted, #5A6275)" }}
              >
                {referralProgress === 0
                  ? "Share your score link to start earning referrals"
                  : referralProgress >= referralGoal
                    ? "You earned 1 month of Pro! Check your email."
                    : `${referralGoal - referralProgress} more to unlock Pro`}
              </p>
            </div>
          </div> : null}
        </div>
      </div>
    </motion.div>
  );
}
