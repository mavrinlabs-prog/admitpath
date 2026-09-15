/**
 * Shared referral system logic.
 *
 * Referral codes contain the exact account ID plus a truncated HMAC signature.
 * When a referee upgrades to Pro ($19.99/mo), both
 * referrer and referee get 1 free month via Stripe subscription credit.
 *
 * Flow:
 *   1. User shares /r/CODE link
 *   2. Visitor lands on /r/CODE -> redirected to /sign-up?ref=CODE
 *   3. POST /api/referrals { referralCode } records the Referral row
 *   4. On referee's checkout.session.completed (upgrade to Pro), webhook
 *      calls creditReferral() to apply Stripe invoice credits to both users
 */

import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { createHmac, timingSafeEqual } from "crypto";

const APP_NAME = "AdmitPath";
const CREDIT_AMOUNT_CENTS = 1999; // $19.99 = 1 free month of Pro

function getStripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not set");
  return new Stripe(key, { apiVersion: "2025-02-24.acacia" as Stripe.LatestApiVersion });
}

/**
 * Generate a signed referral code that resolves to exactly one user.
 * The signature prevents callers from changing the embedded account ID.
 */
export function generateReferralCode(userId: string): string {
  const payload = Buffer.from(userId, "utf8").toString("base64url");
  const signature = createHmac("sha256", referralSecret())
    .update(payload)
    .digest("base64url")
    .slice(0, 22);
  return `${payload}.${signature}`;
}

function referralSecret(): string {
  const value = process.env.REFERRAL_SECRET
    || process.env.SESSION_SECRET
    || process.env.AUTH_SECRET
    || process.env.NEXTAUTH_SECRET;
  if (value && value.trim().length >= 32) return value.trim();
  if (process.env.NODE_ENV !== "production") return "dev-referral-secret-32-characters";
  throw new Error("REFERRAL_SECRET or SESSION_SECRET must be at least 32 characters");
}

export function referralUserId(code: string): string | null {
  const [payload, signature, extra] = code.split(".");
  if (!payload || !signature || extra || signature.length !== 22) return null;
  const expected = createHmac("sha256", referralSecret())
    .update(payload)
    .digest("base64url")
    .slice(0, 22);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) {
    return null;
  }
  try {
    const userId = Buffer.from(payload, "base64url").toString("utf8");
    return /^[A-Za-z0-9_-]{3,128}$/.test(userId) ? userId : null;
  } catch {
    return null;
  }
}

/**
 * Record a referral relationship when a new user signs up via a referral link.
 * Returns the created Referral row or null if the referral is invalid/duplicate.
 */
export async function recordReferral(
  refereeId: string,
  referralCode: string,
): Promise<{ success: boolean; error?: string }> {
  const referrerId = referralUserId(referralCode);
  if (!referrerId) return { success: false, error: "Invalid referral code" };

  const referrer = await prisma.user.findFirst({
    where: { id: referrerId, deletedAt: null },
    select: { id: true },
  });

  if (!referrer) return { success: false, error: "Invalid referral code" };
  if (referrer.id === refereeId) return { success: false, error: "Cannot refer yourself" };

  // Check for existing referral (idempotent)
  const existing = await prisma.referral.findUnique({
    where: { refereeId },
  }).catch(() => null);

  if (existing) return { success: false, error: "Referral already recorded" };

  try {
    await prisma.referral.create({
      data: {
        referrerId: referrer.id,
        refereeId,
        referralCode,
        status: "pending",
      },
    });
    return { success: true };
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    if (code === "P2002") return { success: false, error: "Referral already recorded" };
    throw err;
  }
}

/**
 * Credit both referrer and referee with 1 free month when the referee upgrades.
 *
 * Uses Stripe customer balance credits (negative balance = credit).
 * This approach works regardless of billing cycle and doesn't require
 * modifying the subscription itself.
 *
 * Called from the Stripe webhook handler on checkout.session.completed
 * when the referee's plan changes to "pro".
 */
export async function creditReferral(refereeId: string): Promise<void> {
  const referral = await prisma.referral.findUnique({
    where: { refereeId },
  }).catch(() => null);

  if (!referral || referral.status !== "pending") return;

  const creditedCount = await prisma.referral.count({
    where: { referrerId: referral.referrerId, status: "credited" },
  });
  if (creditedCount >= 12) return;

  const claim = await prisma.referral.updateMany({
    where: { id: referral.id, status: "pending" },
    data: { status: "processing" },
  });
  if (claim.count !== 1) return;

  try {
  const stripe = getStripeClient();

  // Load both users' Stripe customer IDs
  const [referrer, referee] = await Promise.all([
    prisma.user.findUnique({
      where: { id: referral.referrerId },
      select: { id: true, email: true, name: true, stripeCustomerId: true },
    }),
    prisma.user.findUnique({
      where: { id: referral.refereeId },
      select: { id: true, email: true, name: true, stripeCustomerId: true },
    }),
  ]);

  if (!referrer || !referee || (referrer.stripeCustomerId === referee.stripeCustomerId && !!referrer.stripeCustomerId)) {
    throw new Error("Referral users are invalid or share a billing customer");
  }

  const ensureStripeCustomer = async (user: typeof referrer) => {
    if (user.stripeCustomerId) return user.stripeCustomerId;
    const customer = await stripe.customers.create(
      { email: user.email, name: user.name ?? undefined, metadata: { app: APP_NAME, userId: user.id } },
      { idempotencyKey: `referral-customer-${user.id}` },
    );
    await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customer.id } });
    return customer.id;
  };

  const [referrerCustomerId, refereeCustomerId] = await Promise.all([
    ensureStripeCustomer(referrer),
    ensureStripeCustomer(referee),
  ]);

  await Promise.all([
      stripe.customers.createBalanceTransaction(referrerCustomerId, {
        amount: -CREDIT_AMOUNT_CENTS, // negative = credit
        currency: "usd",
        description: `${APP_NAME} referral reward: 1 free month (referred ${referral.refereeId.slice(0, 8)})`,
      }, { idempotencyKey: `referral-credit-${referral.id}-referrer` }),
      stripe.customers.createBalanceTransaction(refereeCustomerId, {
        amount: -CREDIT_AMOUNT_CENTS,
        currency: "usd",
        description: `${APP_NAME} referral reward: 1 free month (referred by ${referral.referrerId.slice(0, 8)})`,
      }, { idempotencyKey: `referral-credit-${referral.id}-referee` }),
  ]);

  // Mark referral as credited + update referrer stats
  await prisma.$transaction([
    prisma.referral.update({
      where: { id: referral.id },
      data: { status: "credited", creditedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: referral.referrerId },
      data: {
        referralCount: { increment: 1 },
        referralMonthsEarned: { increment: 1 },
      },
    }),
  ]);
  } catch (error) {
    await prisma.referral.updateMany({
      where: { id: referral.id, status: "processing" },
      data: { status: "pending" },
    });
    throw error;
  }
}

/**
 * Get referral stats for a user (referrer perspective).
 */
export async function getReferralStats(userId: string) {
  const [totalReferred, totalCredited] = await Promise.all([
    prisma.referral.count({ where: { referrerId: userId } }).catch(() => 0),
    prisma.referral.count({
      where: { referrerId: userId, status: "credited" },
    }).catch(() => 0),
  ]);

  return {
    referralCode: generateReferralCode(userId),
    totalReferred,
    freeMonthsEarned: totalCredited,
  };
}
