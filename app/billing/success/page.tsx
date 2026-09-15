/**
 * Post-checkout landing pad. Stripe's success_url points here so we can:
 *
 *   1. Pull the active subscription directly from Stripe (handles the case
 *      where the webhook hasn't fired yet, or was dropped) and reconcile
 *      the user's plan + stripeSubscriptionId in our DB. Without this,
 *      a user could pay successfully and still see the free-plan UI for
 *      30+ seconds — bad first impression for a paid product.
 *
 *   2. Show a real "you're in" success screen rather than dumping them
 *      onto /dashboard with a query param banner.
 *
 * If the customer is missing or there's no active sub yet (network/replication
 * lag), we still render the success page — but a small "Still finalizing…"
 * note. The /billing page mount also calls /api/billing/sync defensively.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Check, Crown } from "lucide-react";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getGoogleUser, hasSessionCookie } from "@/lib/google-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Payment Successful",
  description: "Your AdmitPath subscription is active.",
  alternates: { canonical: "/billing/success" },
  robots: { index: false, follow: false },
};

function resolvePlan(priceId: string | undefined | null): "pro" | null {
  if (!priceId) return null;
  const pro = process.env.STRIPE_PRICE_PRO || process.env.STRIPE_PRO_PRICE_ID;
  const legacyPlus = process.env.STRIPE_PRICE_PLUS || process.env.STRIPE_PLUS_PRICE_ID;
  if (priceId === pro || priceId === legacyPlus) return "pro";
  return null;
}

export default async function BillingSuccessPage() {
  const googleUser = await getGoogleUser();
  if (!googleUser) {
    if (!(await hasSessionCookie())) redirect("/sign-in");
    redirect("/dashboard");
  }
  const userId = googleUser.id;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) redirect("/dashboard");

  let resolvedPlan: "pro" | null = null;
  let synced = false;

  if (user.stripeCustomerId) {
    try {
      const subs = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: "all",
        limit: 5,
      });
      const live = subs.data.find((s) => s.status === "active");
      if (live) {
        const priceId = live.items.data[0]?.price.id;
        const planId = resolvePlan(priceId);
        if (planId) {
          await prisma.user.update({
            where: { id: userId },
            data: { plan: planId, stripeSubscriptionId: live.id },
          });
          resolvedPlan = planId;
          synced = true;
        }
      }
    } catch (err) {
      // Non-fatal — webhook will reconcile eventually, /billing/sync will
      // handle it on next visit.
      console.error("billing/success: stripe list failed:", err);
    }
  }

  const planLabel =
    resolvedPlan === "pro" ? "Pro" : "your plan";

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}
    >
      <div
        className="w-full max-w-md rounded-3xl border p-8 text-center dl-card-hover overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.45)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderColor: "rgba(0,0,0,0.06)",
          boxShadow:
            "0 24px 64px rgba(15,23,42,0.08), 0 8px 24px rgba(74,111,165,0.10)",
        }}
      >
        <div
          className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{
            background: "linear-gradient(135deg, #4A6FA5, #1E3352)",
            boxShadow: "0 8px 20px rgba(74,111,165,0.30)",
          }}
        >
          <Crown className="h-6 w-6 text-white" />
        </div>

        <p
          className="text-xs font-bold uppercase tracking-widest mb-2"
          style={{ color: "#4A6FA5" }}
        >
          {synced ? "Subscription active" : "Almost ready"}
        </p>
        <h1
          className="text-3xl font-extrabold tracking-tight mb-3"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          Welcome to {planLabel}.
        </h1>
        <p
          className="text-sm leading-relaxed mb-6"
          style={{ color: "var(--dl-text-secondary, #454B5E)" }}
        >
          {synced
            ? "Your account is unlocked. The Free-plan caps are removed and the current Pro analysis, essay, and counselor tools are live now."
            : "Stripe is finalizing your subscription. This usually takes a few seconds. Refresh /billing if your plan still shows as Free."}
        </p>

        <ul
          className="text-left text-sm space-y-2 mb-7 rounded-xl border p-4"
          style={{ background: "var(--dl-bg-root, #D5DCE8)", borderColor: "rgba(0,0,0,0.06)" }}
        >
          {[
            "Profile analyses without the Free-plan cap",
            "Essay feedback on 6 axes with line-level edits",
            "AI counselor chat",
            "Full college list builder",
          ].map((line) => (
            <li key={line} className="flex items-start gap-2">
              <span
                className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                style={{ background: "#DCFCE7", color: "#16A34A" }}
              >
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              <span style={{ color: "var(--dl-text-primary, #1B2030)" }}>{line}</span>
            </li>
          ))}
        </ul>

        <Link
          href="/dashboard"
          className="btn-primary w-full justify-center text-sm py-3"
        >
          Open dashboard
          <ArrowRight className="h-4 w-4" />
        </Link>

        <p className="mt-4 text-[11px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
          Manage your subscription from{" "}
          <Link href="/billing" className="underline" style={{ color: "#4A6FA5" }}>
            Billing
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
