/**
 * Self-heal endpoint: re-derive a user's plan from Stripe directly, bypassing
 * webhooks. Critical safety net for the case where a webhook is delayed,
 * dropped, or signature-rejected — without this, a paying user could be
 * stuck on `free` indefinitely.
 *
 * Idempotent. Safe to call repeatedly. Called automatically by:
 *   - /billing page on mount (so anyone visiting their billing tab gets
 *     their plan reconciled).
 *   - /api/me as a backstop for the chip — covered by a separate code path.
 *
 * Resolution rules:
 *   - No stripeCustomerId on user → nothing to sync, return current state.
 *   - Customer exists but no active subs → ensure plan reflects free
 *     and clear stripeSubscriptionId (handles cancellations webhooks may have
 *     missed).
 *   - Active sub found → write plan from price + sub id. Fail closed if the
 *     price doesn't match either env var.
 */
import { NextResponse } from "next/server";
import { stripe, resolvePlan } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";

function subscriptionPeriodEnd(subscription: import("stripe").Stripe.Subscription): number | null {
  const item = subscription.items.data[0] as unknown as { current_period_end?: number } | undefined;
  const root = subscription as unknown as { current_period_end?: number };
  const seconds = item?.current_period_end ?? root.current_period_end;
  return seconds ? seconds * 1000 : null;
}

export async function POST() {
  const authed = await requireUser();
  if ("response" in authed) return authed.response;
  const { userId } = authed;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ synced: false, reason: "no_user" });
  if (user.isInternal && (user.plan === "pro" || user.plan === "plus")) {
    return NextResponse.json({
      synced: true,
      plan: "pro",
      status: "manual_entitlement",
      cancelAtPeriodEnd: false,
      currentPeriodEnd: null,
    });
  }
  if (!user.stripeCustomerId) {
    return NextResponse.json({ synced: false, reason: "no_customer" });
  }

  // Only an active paid subscription grants Pro. Trials are retired.
  const subs = await stripe.subscriptions.list({
    customer: user.stripeCustomerId,
    status: "all",
    limit: 5,
  });

  const live = subs.data.find((s) => s.status === "active");

  if (!live) {
    // No active sub — make sure we're not pretending they're paid.
    if (user.stripeSubscriptionId || user.plan !== "free") {
      await prisma.user.update({
        where: { id: userId },
        data: {
          stripeSubscriptionId: null,
          plan: "free",
          trialStartedAt: null,
        },
      });
    }
    return NextResponse.json({
      synced: true,
      plan: "free",
      stripeSubscriptionId: null,
      status: "free",
      cancelAtPeriodEnd: false,
      currentPeriodEnd: null,
    });
  }

  const priceId = live.items.data[0]?.price.id;
  const planId = resolvePlan(priceId);
  if (!planId) {
    console.error("billing/sync: unknown price, refusing to upgrade", { userId });
    return NextResponse.json(
      { synced: false, reason: "unknown_price" },
      { status: 500 }
    );
  }

  await prisma.user.update({
    where: { id: userId },
    data: { plan: planId, stripeSubscriptionId: live.id },
  });

  return NextResponse.json({
    synced: true,
    plan: planId,
    stripeSubscriptionId: live.id,
    status: live.status,
    cancelAtPeriodEnd: live.cancel_at_period_end,
    currentPeriodEnd: subscriptionPeriodEnd(live),
  });
}
