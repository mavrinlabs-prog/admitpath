"use client";

import React from "react";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { track } from "@vercel/analytics";
import { useToast } from "@/components/ui/toast";
import {
  Check, Sparkles, Zap, Crown, ArrowRight, Shield,
  BarChart3, MessageCircle, FileText, Map, BookOpen, Star,
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { analytics } from "@/lib/analytics";

const plans = [
  {
    id: "free",
    name: "Free",
    priceMonthly: "$0",
    period: "forever",
    tagline: "Take the first step — zero risk, zero pressure",
    icon: Sparkles,
    color: "var(--dl-text-muted, #64748B)",
    gradient: "var(--dl-text-muted, #64748B)",
    features: [
      { icon: BarChart3, text: "5 AI profile analyses (7-dimension score)" },
      { icon: FileText, text: "5 essay feedback runs" },
      { icon: MessageCircle, text: "5 counselor chat messages" },
      { icon: BookOpen, text: "Save up to 8 colleges" },
    ],
    cta: "Get My Free Score",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: "$19.99",
    period: "/ month",
    tagline: "Everything you need to plan and iterate",
    icon: Crown,
    color: "var(--dl-brand, #4A6FA5)",
    gradient: "var(--dl-brand, #4A6FA5)",
    features: [
      { icon: BarChart3, text: "Profile analyses without the Free-plan cap" },
      { icon: BookOpen, text: "Full college list builder" },
      { icon: FileText, text: "Essay feedback (6 dimensions)" },
      { icon: MessageCircle, text: "Counselor chat without the Free-plan cap" },
      { icon: Map, text: "Personalized application roadmap" },
      { icon: Zap, text: "Weekly AI progress check-ins" },
      { icon: Sparkles, text: "All current student planning tools" },
    ],
    cta: "Subscribe to Pro",
    subCta: "Powered by Stripe",
    highlighted: true,
  },
];

const TRUST_ITEMS = [
  { icon: Shield, text: "Stripe-secured payments" },
  { icon: Sparkles, text: "Manage your plan from billing settings" },
  { icon: Zap, text: "Upgrade or downgrade anytime" },
];

const pricingFAQs = [
  { q: "What does the Free plan include?", a: "Sign up with just an email. You get 5 profile analyses, 5 essay reviews, 5 counselor chat messages, and up to 8 saved colleges — no time limit." },
  { q: "What changes when I upgrade to Pro?", a: "Pro removes the Free-plan usage caps for analyses, essay feedback, counselor chat, and college saves, and unlocks the current personalized planning tools for $19.99 per month. Automated abuse controls and the Terms still apply." },
  { q: "What does Pro include?", a: "Pro includes profile analysis, essay feedback on 6 dimensions, AI counselor chat, personalized planning, progress history, and the full college-list builder without the Free-plan caps." },
  { q: "How do I manage my subscription?", a: "Manage your subscription directly from your billing settings. If you have an issue, email maestro.committee@gmail.com and we'll sort it out." },
  { q: "What happens when I hit my Free plan limits?", a: "You'll see exactly what insights you're missing — blurred previews of the full analysis. Your data, college list, and past scores are preserved. Upgrade anytime to pick up right where you left off." },
  { q: "Is my payment info stored on AdmitPath's servers?", a: "No. All payments are processed by Stripe. AdmitPath never touches your card number — only a Stripe customer ID is stored in our database." },
];

function PricingFAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="mt-24 mx-auto max-w-3xl">
      <div className="text-center mb-10">
        <p className="section-label">FAQ</p>
        <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: "var(--dl-text-primary, #1B2030)", letterSpacing: "-0.02em" }}>
          Common questions
        </h2>
      </div>
      <div className="space-y-2">
        {pricingFAQs.map((faq, i) => (
          <div key={i} className="border overflow-hidden" style={{ background: "var(--dl-bg-card, rgba(255,255,255,0.45))", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderRadius: "14px", borderColor: open === i ? "var(--dl-brand, #4A6FA5)" : "var(--dl-border, rgba(0,0,0,0.06))" }}>
            <button
              className="faq-toggle flex w-full items-center justify-between px-6 py-4 text-left min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A6FA5] focus-visible:ring-offset-2"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              style={{ borderRadius: 12, border: "none", background: "transparent" }}
            >
              <span className="text-sm font-semibold pr-4" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{faq.q}</span>
              <motion.span animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0" style={{ color: "var(--dl-brand, #4A6FA5)" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 5.5l5 5 5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </motion.span>
            </button>
            <motion.div
              initial={false}
              animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{faq.a}</p>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const defaultPlan = searchParams?.get("plan") ?? null;

  // Fire pricing_view once on mount. No PII — just the optional plan hint
  // from the query string so we can attribute funnel entrances.
  useEffect(() => {
    track("pricing_view", { plan: defaultPlan ?? "none" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function goToStripe(planId: "pro") {
    track("checkout_started", { plan: planId, source: "pricing" });
    const res = await fetch("/api/stripe/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId }),
    });
    if (res.status === 401) {
      const dest = encodeURIComponent(`/pricing?plan=${planId}`);
      router.push(`/sign-up?redirect=${dest}`);
      return;
    }
    const data = (await res.json()) as { url?: string; error?: string };
    if (data.url) {
      window.location.assign(data.url);
    } else {
      toast.error(data.error ?? "Couldn't reach Stripe checkout. Check your connection and try again.");
      setLoading(null);
    }
  }

  async function handleCheckout(planId: string) {
    if (planId === "free") {
      router.push("/sign-up?plan=free");
      return;
    }
    if (planId !== "pro") return;

    setLoading(planId);
    analytics.upgradeClicked(planId, 'pricing_page');
    try {
      await goToStripe(planId);
    } catch {
      toast.error("Couldn't reach checkout. Check your connection and try again.");
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <MarketingNav />

      {/* Social proof banner */}
      <div
        className="flex items-center justify-center gap-2 py-2.5 px-4 text-center"
        style={{
          background: "rgba(74,111,165,0.06)",
          borderBottom: "1px solid rgba(74,111,165,0.08)",
        }}
      >
        <Star className="h-3.5 w-3.5" style={{ color: "#4A6FA5" }} />
        <p className="text-[12px] font-medium" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          <span className="font-bold" style={{ color: "#4A6FA5" }}>Early access</span>
          {" "}&mdash; Build and review your US college application profile
        </p>
      </div>

      <main id="main">
      {/* Hero */}
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-5 inline-flex items-center gap-2 badge-primary">
            <Shield className="h-3.5 w-3.5" />
            <span>Free plan included · Pro $19.99/mo · Auto-downgrades to Free</span>
          </div>
          <h1
            className="mb-4 text-5xl font-extrabold leading-tight"
            style={{ color: "var(--dl-text-primary, #1B2030)", letterSpacing: "-0.02em" }}
          >
            Invest in the next 4&nbsp;years<br />
            <span style={{ color: "var(--dl-brand, #4A6FA5)" }}>of your life.</span>
          </h1>
          <p className="text-lg" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            One monthly plan for profile analysis, essay feedback, college research, and planning tools available whenever you need them.
          </p>
          <p className="mt-3 text-sm font-medium" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            Built for students navigating US college admissions.
          </p>

        </motion.div>
      </div>

      {/* Cards */}
      <div className="mx-auto max-w-6xl px-4 pb-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 max-w-3xl mx-auto">
          {plans.map((plan, index) => {
            // Free is never the highlighted paid card even when the URL pins it.
            const isHighlighted =
              plan.id !== "free" && (plan.highlighted || defaultPlan === plan.id);
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="relative flex flex-col border-2 p-7 dl-card-hover overflow-hidden"
                style={{
                  borderColor: isHighlighted ? plan.color : "var(--dl-border, rgba(0,0,0,0.06))",
                  background: "var(--dl-bg-card, rgba(255,255,255,0.45))",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderRadius: "14px",
                }}
              >
                {isHighlighted && (
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 text-white font-bold"
                    style={{
                      background: "var(--dl-brand, #4A6FA5)",
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      borderRadius: 100,
                      padding: "4px 12px",
                    }}
                  >
                    Pro Plan
                  </div>
                )}

                {/* Plan header */}
                <div className="mb-6 flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-2xl"
                    style={{ background: plan.gradient }}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2
                      className="text-xl font-bold leading-none"
                      style={{ color: "var(--dl-text-primary, #1B2030)", letterSpacing: "-0.02em" }}
                    >
                      {plan.name}
                    </h2>
                    <p className="mt-0.5 text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                      {plan.tagline}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-7">
                  <span
                    className="text-5xl font-extrabold tabular-nums"
                    style={{ color: plan.color, letterSpacing: "-0.02em" }}
                  >
                    {plan.priceMonthly}
                  </span>
                  <span className="ml-1 text-sm" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                    {plan.period}
                  </span>
                </div>

                {/* Features */}
                <ul className="mb-8 flex-1 space-y-3.5">
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
                <button
                  onClick={() => handleCheckout(plan.id)}
                  disabled={loading === plan.id}
                  className="dl-btn dl-btn-primary flex w-full items-center justify-center gap-2 py-3 min-h-[44px] text-sm disabled:opacity-60"
                >
                  {loading === plan.id ? (
                    <>
                      <motion.span
                        className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      />
                      Redirecting…
                    </>
                  ) : (
                    <>
                      {plan.cta}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
                {"subCta" in plan && plan.subCta && (
                  <p
                    className="mt-2.5 text-center text-[11px]"
                    style={{ color: "var(--dl-text-muted, #5A6275)" }}
                  >
                    {plan.subCta}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Season Pass removed per user request */}

        {/* Trust row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-6"
        >
          {TRUST_ITEMS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              <Icon className="h-4 w-4" style={{ color: "var(--dl-brand, #4A6FA5)" }} />
              {text}
            </div>
          ))}
        </motion.div>

        <p className="mt-5 text-center text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
          Prices in USD. Powered by Stripe. Your payment info is never stored on our servers.
        </p>

        {/* Comparison table — grouped Core / AI / Export / Advanced */}
        <div className="mt-24 mx-auto max-w-3xl">
          <div className="mb-8">
            <p className="section-label">Plan comparison</p>
            <h2
              className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight"
              style={{ color: "var(--dl-text-primary, #1B2030)", letterSpacing: "-0.02em" }}
            >
              What&apos;s included
            </h2>
          </div>

          <div
            className="overflow-hidden border"
            style={{ background: "rgba(255,255,255,0.5)", borderRadius: 12, borderColor: "rgba(0,0,0,0.06)" }}
          >
            <table className="w-full text-[13px]">
              <thead>
                <tr>
                  <th scope="col" className="px-5 py-3.5 text-left font-medium w-1/2" style={{ color: "var(--dl-text-muted, #5A6275)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                    <span className="sr-only">Feature</span>
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-center font-semibold" style={{ color: "var(--dl-text-secondary, #454B5E)", borderBottom: "1px solid rgba(0,0,0,0.06)", letterSpacing: "-0.01em" }}>
                    <div>Free</div>
                    <div className="text-[10px] font-normal mt-0.5" style={{ color: "var(--dl-text-muted, #5A6275)" }}>$0</div>
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-center font-semibold" style={{ color: "#4A6FA5", borderBottom: "2px solid #4A6FA5", letterSpacing: "-0.01em" }}>
                    <div>Pro</div>
                    <div className="text-[10px] font-normal mt-0.5" style={{ color: "var(--dl-text-muted, #5A6275)" }}>$19.99/mo</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Profile analyses", free: "5", pro: "No Free cap" },
                  { label: "7-dimension score", free: true, pro: true },
                  { label: "Admission odds", free: true, pro: true },
                  { label: "College list", free: "8 colleges", pro: "No Free cap" },
                  { label: "Essay feedback", free: "5", pro: "No Free cap" },
                  { label: "AI counselor chat", free: "5 messages", pro: "No Free cap" },
                  { label: "Action plan", free: "---", pro: true },
                  { label: "Weekly check-ins", free: "---", pro: true },
                  { label: "Data export", free: true, pro: true },
                ].map((row, i) => (
                  <tr key={row.label} style={{ borderTop: i > 0 ? "1px solid rgba(0,0,0,0.04)" : undefined }}>
                    <td className="px-5 py-3 font-medium" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{row.label}</td>
                    {(["free", "pro"] as const).map((col) => {
                      const v = row[col];
                      const isPro = col === "pro";
                      return (
                        <td key={col} className="px-5 py-3 text-center" style={{ color: isPro ? "var(--dl-text-primary, #1B2030)" : "var(--dl-text-secondary, #454B5E)", fontWeight: isPro && typeof v === "string" ? 600 : 400 }}>
                          {v === true ? (
                            <Check className="inline-block h-4 w-4" style={{ color: isPro ? "#4A6FA5" : "#22C55E" }} />
                          ) : v === "---" ? (
                            <span style={{ color: "var(--dl-text-muted, #8890A5)" }}>&mdash;</span>
                          ) : (
                            <span>{v}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing FAQ */}
        <PricingFAQ />
      </div>
      </main>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen px-4 pb-24" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
          <div className="mx-auto max-w-3xl pt-24 text-center">
            <div className="animate-shimmer mx-auto h-7 w-64 rounded-full mb-6" />
            <div className="animate-shimmer mx-auto h-12 w-3/4 rounded-2xl mb-4" />
            <div className="animate-shimmer mx-auto h-5 w-1/2 rounded-xl" />
          </div>
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
            {[0, 1].map((i) => (
              <div key={i} className="rounded-3xl border-2 p-7" style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}>
                <div className="animate-shimmer mb-6 h-11 w-11 rounded-2xl" />
                <div className="animate-shimmer mb-3 h-5 w-1/2 rounded-md" />
                <div className="animate-shimmer mb-7 h-12 w-2/3 rounded-md" />
                <div className="space-y-3">
                  {[0, 1, 2, 3, 4].map((j) => (
                    <div key={j} className="animate-shimmer h-4 w-5/6 rounded" />
                  ))}
                </div>
                <div className="animate-shimmer mt-8 h-12 w-full rounded-2xl" />
              </div>
            ))}
          </div>
        </div>
      }
    >
      <PricingContent />
    </Suspense>
  );
}
