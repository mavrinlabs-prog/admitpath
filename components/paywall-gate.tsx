import { auth } from "@/lib/clerk-shim-server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { effectivePlan, isPaidPlan } from "@/lib/utils";
import { getFreePlanStatus, type PlanFeature, FREE_LIMITS } from "@/lib/trial";
import { Sparkles, Lock, ArrowRight, CheckCircle2, Zap } from "lucide-react";

type Props = {
  children: React.ReactNode;
  /** Short feature name shown in the paywall headline, e.g. "AI profile analysis" */
  feature: string;
  /** Free-plan usage bucket consumed by the underlying route. */
  limitFeature?: PlanFeature;
};

/**
 * Server-side paywall gate.
 * - Paid (pro) → always passes.
 * - Free plan + feature budget remaining -> passes.
 * - Exhausted feature budget -> renders the upgrade screen.
 * - Unauthenticated → redirect to /sign-in.
 *
 */
export async function PaywallGate({ children, feature, limitFeature }: Props) {
  const { userId } = await auth();
  if (!userId) {
    const requestHeaders = await headers();
    const candidate = requestHeaders.get("x-admitpath-return-to") ?? "/dashboard";
    const returnTo = candidate.startsWith("/") && !candidate.startsWith("//")
      ? candidate
      : "/dashboard";
    redirect(`/sign-in?redirect_url=${encodeURIComponent(returnTo)}`);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      plan: true,
      stripeSubscriptionId: true,
      isInternal: true,
      analysisCount: true,
      trialEssayCount: true,
      trialChatCount: true,
      profile: { select: { id: true } },
    },
  });

  if (!user) redirect("/profile/create");

  // Onboarding gate: redirect to profile creation if user has no profile.
  // This ensures all authenticated feature routes require profile completion.
  if (user && !user.profile) {
    redirect("/profile/create");
  }

  // Paid users bypass entirely.
  if (user && isPaidPlan(effectivePlan(user))) {
    return <>{children}</>;
  }

  const collegeCount = limitFeature === "colleges"
    ? await prisma.collegeList.count({ where: { userId, deletedAt: null } })
    : 0;

  const status = user
    ? getFreePlanStatus(user, collegeCount)
    : null;

  // API routes remain authoritative; this avoids presenting a locked page first.
  if (status && status.active) {
    if (!limitFeature || !status.usage[limitFeature].exhausted) {
      return <>{children}</>;
    }
  }

  const exhaustedForFeature = limitFeature ? status?.usage[limitFeature].exhausted ?? false : false;
  const headline = exhaustedForFeature && limitFeature
    ? `You've used your free ${limitFeature} — upgrade to keep going.`
    : `Upgrade to use ${feature}.`;

  // Build teaser text based on the feature they tried to access
  const featureTeasers: Record<string, { locked: string; benefit: string }> = {
    analyses: {
      locked: "Pro includes full 7-dimension score breakdowns, spike analysis, and personalized action plans",
      benefit: "AI profile analyses without the Free-plan cap",
    },
    essays: {
      locked: "Pro includes line-level suggestions, cliche detection, voice scoring, and counselor-style assessment",
      benefit: "Essay feedback without the Free-plan cap",
    },
    chat: {
      locked: "Pro removes the chat cap while keeping advice connected to your saved profile",
      benefit: "AI counselor chat without the Free-plan cap",
    },
    colleges: {
      locked: "Build a balanced college list with reach, target, and safety schools tailored to your profile",
      benefit: "Full college list builder without the Free-plan cap",
    },
  };
  const teaser = limitFeature
    ? featureTeasers[limitFeature] ?? {
        locked: `This feature is available on the Pro plan`,
        benefit: `Access to ${feature} without the Free-plan cap, plus current Pro tools`,
      }
    : null;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "var(--dl-bg-root, #D5DCE8)" }}
      role="main"
      aria-label={`Upgrade required to access ${feature}`}
    >
      <div
        className="w-full max-w-xl rounded-3xl border p-8 sm:p-10 shadow-2xl"
        style={{
          background: "rgba(255,255,255,0.45)",
          borderColor: "rgba(0,0,0,0.06)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.10), 0 8px 24px rgba(74,111,165,0.10)",
        }}
      >
        <div
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold mb-5"
          style={{ background: "rgba(74,111,165,0.10)", color: "#4A6FA5" }}
        >
          <Lock className="h-3.5 w-3.5" />
          Free plan limit reached
        </div>

        <h1
          className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3"
          style={{ color: "var(--dl-text-primary, #1B2030)" }}
        >
          {headline}
        </h1>

        {/* Content teaser — show what they're missing */}
        {teaser && (
          <div
            className="rounded-xl border px-4 py-3 mb-5"
            style={{
              background: "linear-gradient(135deg, rgba(74,111,165,0.04), rgba(30,51,82,0.02))",
              borderColor: "rgba(74,111,165,0.15)",
            }}
          >
            <p className="text-sm font-medium mb-1" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              {teaser.locked}
            </p>
            <p className="text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              Upgrade to unlock: {teaser.benefit}
            </p>
          </div>
        )}

        <p className="text-base mb-5" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          Pro removes the Free-plan caps for analyses, essay feedback, counselor chat,
          and a full college list.
        </p>

        {/* Billing assurance */}
        <div
          className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 mb-6"
          style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)" }}
        >
          <Sparkles className="h-4 w-4 shrink-0" style={{ color: "#22C55E" }} />
          <p className="text-xs font-medium" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Pro is billed monthly through Stripe and can be managed from Billing.
          </p>
        </div>

        <div className="space-y-3 mb-7">
          {[
            `AI profile analyses without the Free-plan cap (free: ${FREE_LIMITS.analyses})`,
            `Essay feedback without the Free-plan cap (free: ${FREE_LIMITS.essays})`,
            `Counselor chat without the Free-plan cap (free: ${FREE_LIMITS.chat} messages)`,
            `Full college list — reach, target, safety (free: ${FREE_LIMITS.colleges} colleges)`,
          ].map((line) => (
            <div key={line} className="flex items-start gap-2.5">
              <CheckCircle2
                className="h-5 w-5 shrink-0 mt-0.5"
                style={{ color: "#4A6FA5" }}
              />
              <p className="text-sm" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                {line}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-bold text-white transition-all hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #4A6FA5, #1E3352)",
                boxShadow: "0 8px 20px rgba(74,111,165,0.35)",
              }}
            >
              <Zap className="h-4 w-4" />
              Remove Free-plan caps — $19.99/mo
              <ArrowRight className="h-4 w-4" />
          </Link>

          <div className="flex gap-3">
            <Link
              href="/pricing"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors hover:bg-[rgba(255,255,255,0.45)]"
              style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-primary, #1B2030)" }}
            >
              Compare plans
            </Link>
            <Link
              href="/billing"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors hover:bg-[rgba(255,255,255,0.45)]"
              style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-primary, #1B2030)" }}
            >
              Go to billing
            </Link>
          </div>
        </div>

        <p className="mt-5 text-center text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
          Pro $19.99/mo · Stripe-secured
        </p>
      </div>
    </div>
  );
}
