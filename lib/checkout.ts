import { stripe, PLANS } from "@/lib/stripe";
import { PRO_TRIAL_DAYS, isEligibleForProTrial } from "@/lib/billing-trial";
import { prisma } from "@/lib/prisma";
import { getAppBaseUrl } from "@/lib/app-url";
import { effectivePlan, type EffectivePlanUser } from "@/lib/utils";
import { ensureRefereeDiscount, markReferralCheckoutStarted } from "@/lib/referral";

export type CheckoutUser = EffectivePlanUser & {
  id: string;
  email?: string | null;
  stripeCustomerId?: string | null;
};

export type ProCheckoutResult =
  | { ok: true; url: string; discountApplied: boolean }
  | { ok: false; reason: "already_pro" | "not_configured" | "stripe_error"; message: string };

/**
 * Create a Stripe Checkout session for Pro. Shared by the direct GET
 * /checkout/pro redirect (Go Pro buttons) and POST /api/stripe/create-checkout.
 * Applies the user's one-time referral promotion code automatically.
 */
export async function createProCheckoutSession(
  user: CheckoutUser,
  options: { cancelPath?: string } = {},
): Promise<ProCheckoutResult> {
  if (effectivePlan(user) === "pro") {
    return { ok: false, reason: "already_pro", message: "Your account already has Pro access." };
  }
  const priceId = PLANS.pro.priceId;
  if (!priceId || !process.env.STRIPE_SECRET_KEY) {
    console.error("[checkout] Stripe not configured", {
      hasSecret: Boolean(process.env.STRIPE_SECRET_KEY),
      hasPrice: Boolean(priceId),
    });
    return { ok: false, reason: "not_configured", message: "Checkout is temporarily unavailable. Please try again later." };
  }

  try {
    let customerId = user.stripeCustomerId ?? null;
    if (!customerId) {
      const customer = await stripe.customers.create(
        { email: user.email ?? undefined, metadata: { userId: user.id, app: "admitpath" } },
        { idempotencyKey: `admitpath-customer-${user.id}` },
      );
      customerId = customer.id;
      await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
    }

    let discount: Awaited<ReturnType<typeof ensureRefereeDiscount>> = null;
    try {
      discount = await ensureRefereeDiscount(stripe, user.id, customerId);
    } catch (error) {
      // Never block a purchase because the referral discount failed; log it.
      console.error("[checkout] referral discount unavailable", { name: error instanceof Error ? error.name : "UnknownError" });
    }

    // 7-day free trial only on the customer's first-ever subscription (card still required).
    const previousSubscriptions = await stripe.subscriptions.list({ customer: customerId, status: "all", limit: 1 });
    const trialDays = isEligibleForProTrial(previousSubscriptions.data.length) ? PRO_TRIAL_DAYS : undefined;

    const appUrl = getAppBaseUrl();
    const cancelPath = options.cancelPath && options.cancelPath.startsWith("/") && !options.cancelPath.startsWith("//")
      ? options.cancelPath
      : "/pricing";
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}${cancelPath}${cancelPath.includes("?") ? "&" : "?"}cancelled=1`,
      metadata: { userId: user.id, planId: "pro", ...(discount ? { referralId: discount.referralId } : {}) },
      subscription_data: {
        metadata: { userId: user.id, planId: "pro" },
        // Referred users get their 50%-off first month instead of the trial (offers don't stack).
        ...(trialDays && !discount ? { trial_period_days: trialDays } : {}),
      },
      // Stripe forbids allow_promotion_codes together with discounts.
      ...(discount
        ? { discounts: [{ promotion_code: discount.promotionCodeId }] }
        : { allow_promotion_codes: true }),
    });
    if (!session.url) throw new Error("Stripe returned no checkout URL");
    if (discount) await markReferralCheckoutStarted(discount.referralId, session.id);
    return { ok: true, url: session.url, discountApplied: Boolean(discount) };
  } catch (error) {
    console.error("[checkout] Stripe session failed", { name: error instanceof Error ? error.name : "UnknownError" });
    return { ok: false, reason: "stripe_error", message: "Could not start checkout. Please try again in a moment." };
  }
}
