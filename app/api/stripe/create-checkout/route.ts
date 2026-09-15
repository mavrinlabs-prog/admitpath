import { NextResponse } from "next/server";
import { stripe, PLANS } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { rateLimitAPI, getClientIp } from "@/lib/rate-limit";
import { requireUser, parseJsonBody } from "@/lib/api-helpers";
import { getAppBaseUrl, getAppUrl } from "@/lib/app-url";
import { effectivePlan } from "@/lib/utils";
import { checkoutRequestSchema } from "@/lib/billing-contract";

/**
 * GET /api/stripe/create-checkout - redirect to /pricing instead of returning
 * a bare error page on browser navigation.
 */
export function GET() {
  return NextResponse.redirect(getAppUrl("/pricing"));
}

export async function POST(req: Request) {
  let authed: Awaited<ReturnType<typeof requireUser>>;
  try {
    authed = await requireUser();
  } catch (err) {
    console.error("[stripe/create-checkout] requireUser threw unexpectedly:", err);
    console.error("[stripe/create-checkout] Missing env:", {
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
      STRIPE_PRICE_PRO: !!process.env.STRIPE_PRICE_PRO,
    });
    return NextResponse.json(
      { error: "Authentication service unavailable. Please try again." },
      { status: 503 },
    );
  }
  if ("response" in authed) return authed.response;
  const { userId } = authed;

  const rl = await rateLimitAPI(`checkout:${userId}:${getClientIp(req)}`);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many checkout attempts. Try again in a minute." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  const parsedBody = await parseJsonBody(req, checkoutRequestSchema);
  if ("response" in parsedBody) return parsedBody.response;

  const planId = parsedBody.data.planId;
  const interval = parsedBody.data.interval;
  const plan = PLANS[planId];

  const priceId = plan.priceId;

  if (!priceId) {
    console.error("[stripe/create-checkout] Missing price env var:", {
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
      STRIPE_PRICE_PRO: !!process.env.STRIPE_PRICE_PRO,
      STRIPE_PRO_PRICE_ID: !!process.env.STRIPE_PRO_PRICE_ID,
      requestedPlan: planId,
      requestedInterval: interval,
    });
    return NextResponse.json(
      { error: "Checkout is temporarily unavailable. Please contact support if this continues." },
      { status: 500 },
    );
  }

  const user = authed.user;
  if (effectivePlan(user) === "pro") {
    return NextResponse.json(
      { error: "Your account already has Pro access.", reason: "already_pro", billingUrl: "/billing" },
      { status: 409 },
    );
  }
  const email = (user as { email?: string }).email;

  let customerId = (user as { stripeCustomerId?: string | null }).stripeCustomerId;
  if (!customerId) {
    try {
      const customer = await stripe.customers.create({
        email: email ?? undefined,
        metadata: { userId },
      });
      customerId = customer.id;
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      });
    } catch (err) {
      console.error("[stripe/create-checkout] customer create failed:", err);
      return NextResponse.json(
        { error: "Could not start checkout. Please try again in a moment." },
        { status: 502 },
      );
    }
  }

  const APP_URL = getAppBaseUrl();

  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/pricing?cancelled=1`,
      metadata: { userId, planId },
      subscription_data: { metadata: { userId, planId } },
      allow_promotion_codes: true,
    }, {
      idempotencyKey: `admith-checkout:${userId}:${Math.floor(Date.now() / 600_000)}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[stripe/create-checkout] Stripe API error:", err);
    return NextResponse.json(
      { error: "Checkout is temporarily unavailable. Please try again in a moment." },
      { status: 502 },
    );
  }
}
