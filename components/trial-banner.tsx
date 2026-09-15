"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Zap, ArrowRight, Crown } from "lucide-react";
import type { FreePlanStatus, PlanFeature } from "@/lib/trial";

type MeResponse = {
  plan?: string;
  /** Authoritative entitlement after Stripe/manual-grant checks. */
  effectivePlan?: string;
  freeUsage?: FreePlanStatus;
};

const FEATURES: { key: PlanFeature; label: string }[] = [
  { key: "analyses", label: "Analyses" },
  { key: "essays", label: "Essays" },
  { key: "chat", label: "Chat" },
  { key: "colleges", label: "Colleges" },
];

function useMe() {
  const [data, setData] = useState<MeResponse | null>(null);
  useEffect(() => {
    let mounted = true;
    const load = () => {
      fetch("/api/me", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (mounted && d && d.authenticated !== false) {
            setData(d as MeResponse);
          }
        })
        .catch(() => {});
    };
    load();
    // Re-fetch when the tab regains focus. The chip displays Free-plan usage
    // (analyses/essays/chat/colleges counts) which only changes on the
    // server — without this, after a user runs an analysis in another tab
    // (or refreshes profile data) the chip shows stale "X used" counts
    // until the next hard navigation.
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => {
      mounted = false;
      window.removeEventListener("focus", onFocus);
    };
  }, []);
  return data;
}

/**
 * Compact glanceable chip that replaces the legacy strip banner. Designed to
 * sit inside the top nav for both Free and paid users. Hover reveals the per-feature
 * usage breakdown without taking up vertical space.
 */
export function PlanUsageChip() {
  const data = useMe();
  const [hovered, setHovered] = useState(false);

  if (!data) return null;
  const { effectivePlan: eff, freeUsage } = data;

  // Paid users get a small plan crown chip.
  if (eff === "pro") {
    // Capitalize the chip label — DB stores "pro" lowercase but UI
    // copy is sentence-cased everywhere else (badge-primary chip, billing
    // page, etc).
    return (
      <Link
        href="/billing"
        className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-all hover:-translate-y-0.5"
        style={{
          background: "#1E3352",
          color: "#fff",
          borderColor: "#1E3352",
        }}
        aria-label="Pro plan — manage billing"
      >
        <Crown className="h-3 w-3" />
        Pro
      </Link>
    );
  }

  if (!freeUsage) return null;

  const inactive = !freeUsage.active;
  const accent = inactive ? "var(--error)" : "#4A6FA5";

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href="/billing"
        className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold transition-all hover:-translate-y-0.5"
        style={{
          background: inactive
            ? "rgba(239,68,68,0.08)"
            : "rgba(74,111,165,0.08)",
          borderColor: inactive ? "rgba(239,68,68,0.35)" : "rgba(74,111,165,0.30)",
          color: accent,
        }}
        aria-label={inactive ? "Free plan limits reached — upgrade" : "Free plan — view usage"}
      >
        {inactive ? <Zap className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
        <span>
          {inactive
            ? "Free limits reached"
            : "Free plan"}
        </span>
        <ArrowRight className="h-3 w-3 -mr-0.5 opacity-70" />
      </Link>

      {/* Hover tooltip with per-feature usage */}
      {hovered && freeUsage.usage && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-60 rounded-xl border p-3 text-xs shadow-lg animate-toast-in"
          style={{
            background: "rgba(255,255,255,0.45)",
            borderColor: "rgba(0,0,0,0.06)",
            boxShadow: "0 12px 32px rgba(15,23,42,0.18)",
          }}
        >
          <p
            className="mb-2 text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "var(--dl-text-muted, #5A6275)" }}
          >
            Free plan usage
          </p>
          <div className="space-y-1.5">
            {FEATURES.map((f) => {
              // Defensive: a malformed /api/me response (or a future feature
              // key the client doesn't know about) would otherwise crash on
              // `u.used` / `u.limit` access. Fall back to a 0/0 row so the
              // chip degrades to a benign UI rather than throwing inside the
              // root layout — which would manifest as the dashboard's
              // segment-level "Something on our end broke." page.
              const u = freeUsage.usage?.[f.key];
              if (!u || typeof u.used !== "number" || typeof u.limit !== "number") {
                return null;
              }
              const pct = u.limit > 0
                ? Math.min(100, Math.round((u.used / u.limit) * 100))
                : 0;
              return (
                <div key={f.key} className="flex items-center gap-2">
                  <span
                    className="w-20 shrink-0 truncate"
                    style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                  >
                    {f.label}
                  </span>
                  <div
                    className="h-1.5 flex-1 overflow-hidden rounded-full"
                    style={{ background: "rgba(0,0,0,0.06)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        background: u.exhausted ? "var(--error)" : "#4A6FA5",
                      }}
                    />
                  </div>
                  <span
                    className="w-10 shrink-0 text-right font-bold tabular-nums"
                    style={{ color: u.exhausted ? "var(--error)" : "var(--dl-text-primary, #1B2030)" }}
                  >
                    {u.used}/{u.limit}
                  </span>
                </div>
              );
            })}
          </div>
          <p
            className="mt-3 border-t pt-2 text-[10px] leading-relaxed"
            style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-muted, #5A6275)" }}
          >
            Upgrade to Pro to remove the Free-plan caps for analyses, essays, and chat.
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Full-width upgrade prompt shown only after all Free-plan limits are used.
 */
const DISMISS_KEY = "admitpath:freeLimitBannerDismissed:v1";

export function FreeLimitBanner() {
  const data = useMe();
  const [dismissed, setDismissed] = useState(false);

  // Persist dismissal so a user who clicked ✕ doesn't see the same nag bar
  // every page navigation. Stored client-side only; users can clear it by
  // wiping localStorage.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      // Dismissal is persisted client-side and can only be synchronized after hydration.
      if (window.localStorage.getItem(DISMISS_KEY) === "1") setDismissed(true);
    } catch {
      // localStorage may be blocked (Safari private mode etc) — silently ignore.
    }
  }, []);

  if (!data) return null;
  const { effectivePlan: eff, freeUsage } = data;
  if (eff === "pro") return null;
  if (!freeUsage) return null;
  if (freeUsage.active) return null;
  if (dismissed) return null;

  return (
    <div className="mx-auto mt-4 w-full max-w-6xl px-4" role="alert" aria-live="polite">
      <div
        className="flex flex-col gap-3 rounded-2xl border-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
        style={{
          background: "rgba(255,255,255,0.45)",
          borderColor: "rgba(220,38,38,0.30)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{ background: "#4A6FA5" }}
          >
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0">
            <p
              className="text-sm font-bold leading-tight"
              style={{ color: "var(--dl-text-primary, #1B2030)" }}
            >
              You&apos;ve hit your free plan limits
            </p>
            <p className="mt-0.5 text-[11px]" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Remove the Free-plan caps for analyses, essays, and chat for $19.99/mo.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold text-white transition-all hover:-translate-y-0.5"
            style={{
              background: "#4A6FA5",
              boxShadow: "0 4px 12px rgba(74,111,165,0.25)",
            }}
          >
            Upgrade
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={() => {
              setDismissed(true);
              try {
                window.localStorage.setItem(DISMISS_KEY, "1");
              } catch {
                /* ignore */
              }
            }}
            aria-label="Dismiss banner"
            className="rounded-lg px-2 py-1 text-xs transition-opacity hover:opacity-60"
            style={{ color: "var(--dl-text-muted, #5A6275)" }}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
