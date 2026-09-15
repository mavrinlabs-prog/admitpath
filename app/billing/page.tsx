"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { track } from "@vercel/analytics";
import { useToast } from "@/components/ui/toast";
import { apiFetch, isApiError, redirectToSignIn } from "@/lib/api-client";
import {
  Check, Sparkles, Zap, Crown, ExternalLink,
  MessageCircle, FileText, BookOpen, Map, BarChart3,
  Receipt, XCircle,
} from "lucide-react";

const plans = [
  {
    id: "pro",
    name: "Pro",
    price: "$19.99",
    period: "/ month",
    tagline: "Planning, feedback, and application tools",
    icon: Crown,
    color: "#4A6FA5",
    gradient: "#4A6FA5",
    popular: false,
    features: [
      { icon: BarChart3, text: "Profile analyses without the Free-plan cap" },
      { icon: BookOpen, text: "Full college list builder" },
      { icon: FileText, text: "Essay feedback (6 dimensions)" },
      { icon: Map, text: "Personalized roadmap" },
      { icon: Zap, text: "Weekly AI check-ins" },
      { icon: MessageCircle, text: "Counselor chat without the Free-plan cap" },
    ],
  },
];

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  plus: "Pro", // legacy Plus → Pro
  pro: "Pro",
};

export default function BillingPage() {
  const toast = useToast();
  const [currentPlan, setCurrentPlan] = useState<string>("free");
  const [loading, setLoading] = useState<string | null>(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [usage, setUsage] = useState<Record<string, { used: number; limit: number; remaining: number; exhausted: boolean }> | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    status?: string;
    cancelAtPeriodEnd?: boolean;
    currentPeriodEnd?: number | null;
  } | null>(null);

  useEffect(() => {
    // First, self-heal from Stripe (covers any missed/dropped webhook), then
    // re-read /api/me. The sync is best-effort — if it fails (e.g. network),
    // we still surface whatever DB state we have.
    let cancelled = false;
    (async () => {
      try {
        const syncResponse = await fetch("/api/billing/sync", { method: "POST" });
        if (syncResponse.ok) {
          const sync = await syncResponse.json() as {
            status?: string;
            cancelAtPeriodEnd?: boolean;
            currentPeriodEnd?: number | null;
          };
          if (!cancelled) setSubscriptionStatus(sync);
        }
      } catch { /* non-fatal */ }
      try {
        const r = await fetch("/api/me");
        if (r.status === 401) {
          if (!cancelled) redirectToSignIn();
          return;
        }
        if (!r.ok) return;
        const d = (await r.json()) as {
          plan?: string;
          effectivePlan?: string;
          freeUsage?: { usage?: Record<string, { used: number; limit: number; remaining: number; exhausted: boolean }> };
        };
        if (cancelled) return;
        if (d.effectivePlan) setCurrentPlan(d.effectivePlan);
        else if (d.plan) setCurrentPlan(d.plan);
        if (d.freeUsage?.usage) setUsage(d.freeUsage.usage);
      } finally {
        if (!cancelled) setPlanLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function goToStripe(planId: string) {
    track("checkout_started", { plan: planId, source: "billing" });
    try {
      const data = await apiFetch<{ url?: string; error?: string }>(
        "/api/stripe/create-checkout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planId }),
        },
      );
      if (data.url) window.location.assign(data.url);
      else toast.error(data.error ?? "Checkout failed. Please try again.");
    } catch (e) {
      if (isApiError(e)) {
        if (e.isAuth) { redirectToSignIn(); return; }
        if (e.isRateLimited) { toast.error("Slow down — try again in a minute."); return; }
        toast.error(e.message);
        return;
      }
      toast.error("Checkout failed. Please try again.");
    }
  }

  async function handleUpgrade(planId: string) {
    setLoading(planId);
    try {
      await goToStripe(planId);
    } catch {
      toast.error("Couldn't reach Stripe checkout. Check your connection and try again.");
    } finally {
      setLoading(null);
    }
  }

  async function handlePortal() {
    setLoading("portal");
    try {
      const data = await apiFetch<{ url?: string; error?: string }>(
        "/api/stripe/create-portal",
        { method: "POST" },
      );
      if (data.url) window.location.assign(data.url);
      else toast.error(data.error ?? "Could not open portal.");
    } catch (e) {
      if (isApiError(e)) {
        if (e.isAuth) { redirectToSignIn(); return; }
        if (e.isRateLimited) { toast.error("Slow down — try again in a minute."); return; }
        toast.error(e.message);
      } else {
        toast.error("Couldn't open the billing portal. Check your connection and try again.");
      }
    } finally {
      setLoading(null);
    }
  }

  const planLabel = PLAN_LABELS[currentPlan] ?? currentPlan;
  const isPaid = currentPlan === "plus" || currentPlan === "pro";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <main id="main" className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="sr-only">Billing</h1>
        {/* Current plan banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 rounded-2xl border px-6 py-5 dl-card-hover overflow-hidden"
          style={{
            backgroundColor: "rgba(255,255,255,0.45)",
            borderColor: "rgba(0,0,0,0.06)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                Current plan
              </p>
              {planLoading ? (
                <div className="mt-1.5 h-7 w-24 rounded-xl animate-shimmer" />
              ) : (
                <div className="mt-1 flex items-center gap-2.5">
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "var(--dl-text-primary, #1B2030)", letterSpacing: "-0.02em" }}
                  >
                    {planLabel}
                  </p>
                  {isPaid && (
                    <span className="badge-primary text-[10px]">
                      <Sparkles className="h-3 w-3" />
                      Active
                    </span>
                  )}
                </div>
              )}
            </div>
            {isPaid && (
              <button
                onClick={handlePortal}
                disabled={loading === "portal"}
                className="focus-ring flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  backgroundColor: "rgba(255,255,255,0.45)",
                  borderColor: "rgba(0,0,0,0.06)",
                  color: "var(--dl-text-secondary, #454B5E)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                {loading === "portal" ? "Opening…" : (
                  <>
                    Manage subscription
                    <ExternalLink className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            )}
          </div>
          {!isPaid && !planLoading && (
            <p className="mt-3 text-sm" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              The Free plan stays available with usage limits. Upgrade below for monthly Pro access.
            </p>
          )}
          {isPaid && subscriptionStatus?.cancelAtPeriodEnd && subscriptionStatus.currentPeriodEnd && (
            <p className="mt-3 text-sm" style={{ color: "#9B4444" }}>
              Cancellation scheduled. Pro access remains active through{" "}
              <strong>{new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</strong>,
              then your account returns to the Free plan.
            </p>
          )}
          {isPaid && !subscriptionStatus?.cancelAtPeriodEnd && subscriptionStatus?.currentPeriodEnd && (
            <p className="mt-3 text-sm" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Renews on {new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}.
            </p>
          )}
        </motion.div>

        {/* Usage metrics — free plan only */}
        {!isPaid && !planLoading && usage && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10 rounded-2xl border px-6 py-5 dl-card-hover overflow-hidden"
            style={{
              backgroundColor: "rgba(255,255,255,0.45)",
              borderColor: "rgba(0,0,0,0.06)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <p
              className="mb-4 text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--dl-text-muted, #5A6275)" }}
            >
              Free plan usage
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {(
                [
                  { key: "analyses", label: "Analyses", icon: BarChart3 },
                  { key: "essays", label: "Essays", icon: FileText },
                  { key: "chat", label: "Chat msgs", icon: MessageCircle },
                  { key: "colleges", label: "Colleges", icon: BookOpen },
                ] as const
              ).map((item) => {
                const u = usage[item.key];
                if (!u) return null;
                const pct = Math.min(100, Math.round((u.used / u.limit) * 100));
                const ItemIcon = item.icon;
                return (
                  <div key={item.key} className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <ItemIcon
                        className="h-3.5 w-3.5"
                        style={{ color: u.exhausted ? "#c44" : "var(--dl-text-muted, #5A6275)" }}
                      />
                      <span
                        className="text-xs font-medium"
                        style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                      >
                        {item.label}
                      </span>
                    </div>
                    <p
                      className="text-sm font-bold tabular-nums"
                      style={{
                        color: u.exhausted
                          ? "#c44"
                          : "var(--dl-text-primary, #1B2030)",
                      }}
                    >
                      {u.used}/{u.limit} used
                    </p>
                    {/* Progress bar */}
                    <div
                      className="h-1.5 w-full overflow-hidden rounded-full"
                      style={{ backgroundColor: "rgba(0,0,0,0.06)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: u.exhausted
                            ? "#c44"
                            : pct >= 66
                            ? "#D4A017"
                            : "#4A6FA5",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            {Object.values(usage).some((u) => u.exhausted) && (
              <p className="mt-3 text-xs" style={{ color: "#c44" }}>
                Some Free-plan limits reached. Upgrade below to remove those caps.
              </p>
            )}
          </motion.div>
        )}

        {/* What you get — Free vs paid comparison (free users only) */}
        {!isPaid && !planLoading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-10 rounded-2xl border px-6 py-5 dl-card-hover overflow-hidden"
            style={{
              backgroundColor: "rgba(255,255,255,0.45)",
              borderColor: "rgba(0,0,0,0.06)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <p
              className="mb-4 text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--dl-text-muted, #5A6275)" }}
            >
              Free vs Pro
            </p>
            <div className="space-y-2.5 text-[13px]">
              {[
                { feature: "Profile analyses", free: "5", pro: "No Free cap" },
                { feature: "Essay feedback", free: "5", pro: "No Free cap" },
                { feature: "Counselor chat", free: "5 messages", pro: "No Free cap" },
                { feature: "College list", free: "8 colleges", pro: "No Free cap" },
              ].map((row) => (
                <div key={row.feature} className="flex items-center justify-between py-1.5" style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                  <span className="font-medium" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                    {row.feature}
                  </span>
                  <div className="flex items-center gap-4 text-xs">
                    <span style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                      {row.free}
                    </span>
                    <span className="font-semibold" style={{ color: "#4A6FA5" }}>
                      {row.pro}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              Pro also includes personalized roadmaps and weekly AI check-ins.
            </p>
          </motion.div>
        )}

        {/* Plan cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {plans.map((plan, index) => {
            const isCurrent = currentPlan === plan.id;
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="relative rounded-3xl border-2 p-6 dl-card-hover overflow-hidden"
                style={
                  isCurrent
                    ? {
                        borderColor: plan.color,
                        background: "rgba(255,255,255,0.45)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        boxShadow: `0 8px 32px ${plan.color}22`,
                        borderRadius: "14px",
                      }
                    : plan.popular
                    ? {
                        borderColor: plan.color,
                        background: "rgba(255,255,255,0.45)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        boxShadow: `0 4px 20px ${plan.color}14`,
                        borderRadius: "14px",
                      }
                    : {
                        borderColor: "rgba(0,0,0,0.06)",
                        background: "rgba(255,255,255,0.45)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        boxShadow: "var(--shadow-sm)",
                        borderRadius: "14px",
                      }
                }
              >
                {/* Popular badge */}
                {plan.popular && !isCurrent && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold text-white"
                    style={{ background: plan.gradient }}
                  >
                    Pro Plan
                  </div>
                )}

                {isCurrent && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold text-white"
                    style={{ background: plan.gradient }}
                  >
                    Current Plan
                  </div>
                )}

                {/* Icon + name */}
                <div className="mb-5 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-2xl"
                    style={{ background: plan.gradient }}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p
                      className="text-lg font-bold leading-none"
                      style={{ color: "var(--dl-text-primary, #1B2030)", letterSpacing: "-0.02em" }}
                    >
                      {plan.name}
                    </p>
                    <p className="mt-0.5 text-[11px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                      {plan.tagline}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span
                    className="text-4xl font-extrabold tabular-nums"
                    style={{ color: plan.color, letterSpacing: "-0.02em" }}
                  >
                    {plan.price}
                  </span>
                  <span className="ml-1 text-sm" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                    {plan.period}
                  </span>
                </div>

                {/* Features */}
                <ul className="mb-7 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f.text} className="flex items-center gap-3 text-sm">
                      <div
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${plan.color}18` }}
                      >
                        <Check className="h-3 w-3" style={{ color: plan.color }} />
                      </div>
                      <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{f.text}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {isCurrent ? (
                  <div
                    className="flex items-center justify-center gap-2 rounded-2xl border-2 py-3 text-sm font-semibold"
                    style={{ borderColor: plan.color, color: plan.color }}
                  >
                    <Check className="h-4 w-4" />
                    You&apos;re on this plan
                  </div>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={loading === plan.id}
                    className="dl-btn dl-btn-primary w-full py-3 text-sm disabled:opacity-60"
                    style={{
                      background: `linear-gradient(135deg, ${plan.color}, ${plan.color === "#4A6FA5" ? "#2E4A6E" : "#0F1D2E"})`,
                    }}
                  >
                    {loading === plan.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.span
                          className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        />
                        Redirecting…
                      </span>
                    ) : `Upgrade to ${plan.name}`}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Billing history + manage subscription — paid users */}
        {isPaid && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-8 rounded-2xl border px-6 py-5 dl-card-hover overflow-hidden"
            style={{
              backgroundColor: "rgba(255,255,255,0.45)",
              borderColor: "rgba(0,0,0,0.06)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <p
              className="mb-3 text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--dl-text-muted, #5A6275)" }}
            >
              Billing &amp; receipts
            </p>
            <p className="mb-4 text-sm" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              View past invoices, update your payment method, or download receipts from the Stripe billing portal.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handlePortal}
                disabled={loading === "portal"}
                className="focus-ring flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  backgroundColor: "rgba(255,255,255,0.45)",
                  borderColor: "rgba(0,0,0,0.06)",
                  color: "var(--dl-text-secondary, #454B5E)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <Receipt className="h-4 w-4" />
                {loading === "portal" ? "Opening…" : "View invoices & receipts"}
                <ExternalLink className="h-3 w-3 opacity-50" />
              </button>
              <button
                onClick={handlePortal}
                disabled={loading === "portal"}
                className="focus-ring flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  backgroundColor: "rgba(255,255,255,0.45)",
                  borderColor: "rgba(200,60,60,0.2)",
                  color: "#9B4444",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <XCircle className="h-4 w-4" />
                {loading === "portal" ? "Opening…" : "Cancel subscription"}
              </button>
            </div>
          </motion.div>
        )}

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            Secure checkout powered by Stripe
          </p>
        </motion.div>
      </main>
    </div>
  );
}
