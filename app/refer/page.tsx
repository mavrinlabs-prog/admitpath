"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Copy,
  Check,
  Gift,
} from "lucide-react";

/**
 * Referral page — simple "give one, get one" referral sharing.
 *
 * Fetches the authenticated user's canonical referral URL and stats from
 * /api/referrals. The client never derives a share URL from its current host.
 */

export default function ReferPage() {
  const [copied, setCopied] = useState(false);
  const [referralLink, setReferralLink] = useState("");
  const [stats, setStats] = useState<{ referralCount: number; referralMonthsEarned: number } | null>(null);

  useEffect(() => {
    fetch("/api/referrals")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (typeof data?.referralUrl === "string") {
          setReferralLink(data.referralUrl);
        }
        if (
          typeof data?.referralCount === "number" &&
          typeof data?.referralMonthsEarned === "number"
        ) {
          setStats({ referralCount: data.referralCount, referralMonthsEarned: data.referralMonthsEarned });
        }
      })
      .catch(() => {
        // The signed-out state already offers a sign-in action.
      });
  }, []);

  const handleCopy = useCallback(async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      if (typeof window !== "undefined") window.prompt("Copy your link:", referralLink);
    }
  }, [referralLink]);

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

      <main id="main" className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
        {/* sr-only heading removed — visible h1 below serves as the page heading */}
        {/* Hero */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold mb-6"
            style={{
              background: "rgba(74,111,165,0.10)",
              color: "var(--dl-brand, #4A6FA5)",
              border: "1px solid rgba(74,111,165,0.15)",
            }}
          >
            <Gift className="h-3.5 w-3.5" strokeWidth={2} />
            Referral Program
          </div>
          <h1
            className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
            style={{
              color: "var(--dl-text-primary, #1B2030)",
              letterSpacing: "-0.03em",
            }}
          >
            Give a free month. Get a free month.
          </h1>
          <p
            className="text-lg max-w-xl mx-auto"
            style={{ color: "var(--dl-text-secondary, #454B5E)" }}
          >
            Share AdmitPath with your friends. A qualifying upgrade credits one
            month to each account, up to 12 earned referral months.
          </p>
        </div>

        {/* Referral link card */}
        <div
          className="mx-auto max-w-2xl rounded-2xl border p-6 sm:p-8 mb-10"
          style={{
            background: "var(--dl-bg-white, #fff)",
            borderColor: "rgba(0,0,0,0.06)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          <p
            className="text-xs font-bold uppercase tracking-widest mb-4"
            style={{ color: "var(--dl-text-muted, #5A6275)" }}
          >
            Your Referral Link
          </p>
          <div className="flex items-center gap-3">
            <div
              className="flex-1 rounded-xl px-4 py-3 text-sm font-mono truncate"
              style={{
                background: "var(--dl-bg-sunken, #E3E8F1)",
                color: "var(--dl-text-primary, #1B2030)",
                fontFamily: "var(--dl-font-mono, monospace)",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              {referralLink || "Sign in to generate your referral link"}
            </div>
            {referralLink ? (
              <button
                type="button"
                onClick={handleCopy}
                aria-label={copied ? "Link copied to clipboard" : "Copy referral link to clipboard"}
                className="dl-btn dl-btn-primary dl-btn-sm inline-flex items-center gap-2 shrink-0"
              >
                {copied ? <><Check className="h-4 w-4" /> Copied</> : <><Copy className="h-4 w-4" /> Copy</>}
              </button>
            ) : (
              <Link href="/sign-in?redirect_url=%2Frefer" className="dl-btn dl-btn-primary dl-btn-sm shrink-0">
                Sign in
              </Link>
            )}
          </div>

          {/* Only Copy link button — social share buttons removed */}
        </div>

        {/* Referral stats — only shown when authenticated */}
        {stats && (
          <div
            className="mx-auto max-w-2xl rounded-2xl border p-6 sm:p-8 mb-10"
            style={{
              background: "var(--dl-bg-white, #fff)",
              borderColor: "rgba(0,0,0,0.06)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            }}
          >
            <p
              className="text-xs font-bold uppercase tracking-widest mb-4"
              style={{ color: "var(--dl-text-muted, #5A6275)" }}
            >
              Your Referral Stats
            </p>
            <div className="flex gap-8">
              <div>
                <p
                  className="text-2xl font-bold tabular-nums"
                  style={{ color: "var(--dl-brand, #4A6FA5)", fontFamily: "var(--dl-font-mono, monospace)" }}
                >
                  {stats.referralCount}
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                  Friends signed up
                </p>
              </div>
              <div>
                <p
                  className="text-2xl font-bold tabular-nums"
                  style={{ color: "var(--dl-brand, #4A6FA5)", fontFamily: "var(--dl-font-mono, monospace)" }}
                >
                  {stats.referralMonthsEarned}
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                  Free months earned
                </p>
              </div>
            </div>
          </div>
        )}

        {/* How it works */}
        <div
          className="mx-auto max-w-2xl rounded-2xl border p-6 sm:p-8"
          style={{
            background: "var(--dl-bg-white, #fff)",
            borderColor: "rgba(0,0,0,0.06)",
          }}
        >
          <p
            className="text-xs font-bold uppercase tracking-widest mb-5"
            style={{ color: "var(--dl-text-muted, #5A6275)" }}
          >
            How It Works
          </p>
          <div className="space-y-4">
            {[
              { step: "1", title: "Share your link", desc: "Send it to friends via text, social media, or email." },
              { step: "2", title: "They sign up free", desc: "Your friend creates a free AdmitPath account using your link." },
              { step: "3", title: "You both earn rewards", desc: "When they upgrade to Pro, you both get a free month." },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-4">
                <div
                  className="h-9 w-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                  style={{
                    background: "rgba(74,111,165,0.10)",
                    color: "var(--dl-brand, #4A6FA5)",
                    border: "1.5px solid rgba(74,111,165,0.15)",
                  }}
                >
                  {item.step}
                </div>
                <div className="flex-1">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--dl-text-primary, #1B2030)" }}
                  >
                    {item.title}
                  </p>
                  <p className="text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
