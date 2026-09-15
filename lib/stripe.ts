import Stripe from "stripe";

/**
 * Lazy Stripe client. We deliberately avoid instantiating at module-load so
 * routes that merely import { PLANS } don't crash when STRIPE_SECRET_KEY is
 * unset (e.g. test envs). Calls into `stripe.*` will throw a clear error
 * instead of an opaque module-evaluation failure.
 */
/** Strip UTF-8 BOM and whitespace that leak from some env var editors */
function cleanStripeKey(raw: string): string {
  return raw.replace(/^\xEF\xBB\xBF/, "").replace(/^﻿/, "").trim();
}

let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  _stripe = new Stripe(cleanStripeKey(key), { apiVersion: "2026-06-24.dahlia", typescript: true });
  return _stripe;
}

export const stripe = new Proxy({} as Stripe, {
  get(_t, prop) {
    const client = getStripe();
    // @ts-expect-error — dynamic forward
    const v = client[prop];
    return typeof v === "function" ? v.bind(client) : v;
  },
});

export const PLANS = {
  pro: {
    name: "Pro",
    price: 19.99,
    priceId: process.env.STRIPE_PRICE_PRO || process.env.STRIPE_PRO_PRICE_ID,
    features: [
      "AI analyses without the Free-plan cap",
      "Full college list builder",
      "Essay feedback (6 dimensions)",
      "AI counselor chat without the Free-plan cap",
      "Personalized application roadmap",
      "Weekly AI progress check-ins",
      "All current student planning tools",
    ],
  },
} as const;

export type PlanId = keyof typeof PLANS;

/**
 * Resolve a Stripe price ID to one of our internal paid-plan strings.
 *
 * Both the Stripe webhook and the /api/billing/sync self-heal endpoint must
 * agree on this mapping; keeping them on a single import prevents one of the
 * two from drifting (e.g. recognising a new env var alias the other doesn't).
 *
 * Fail-closed: if the price matches neither configured env var, return null
 * and let the caller decide what to do — never silently grant access.
 */
export function resolvePlan(priceId: string | undefined | null): PlanId | null {
  if (!priceId) return null;
  const proPriceId = process.env.STRIPE_PRICE_PRO || process.env.STRIPE_PRO_PRICE_ID;
  // Legacy Plus price IDs resolve to Pro (Plus tier removed)
  const legacyPlusPriceId = process.env.STRIPE_PRICE_PLUS || process.env.STRIPE_PLUS_PRICE_ID;
  if (priceId === proPriceId) return "pro";
  if (priceId === legacyPlusPriceId) return "pro";
  return null;
}
