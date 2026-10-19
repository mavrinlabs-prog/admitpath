/**
 * Referral system.
 *
 * Flow (2026-10):
 *   1. Referrer shares /r/CODE (CODE = base64url(userId) + HMAC signature).
 *   2. /r/CODE sets an httpOnly `ref` cookie and redirects to
 *      /sign-up?ref=CODE&redirect_url=/checkout/pro (attribution kept in both
 *      cookie and query string).
 *   3. Google OAuth callback records a Referral row (status "pending") for NEW
 *      accounts only, after anti-abuse checks (self-referral, same normalized
 *      email, same device token, same Stripe customer => "blocked").
 *   4. /checkout/pro (or POST /api/stripe/create-checkout) creates a ONE-TIME
 *      Stripe promotion code — 50% off the first Pro invoice, max_redemptions
 *      1, restricted to the referee's Stripe customer — and pre-applies it via
 *      Checkout `discounts`, so the referee never types a code.
 *   5. checkout.session.completed marks the referral "redeemed" and generates
 *      the referrer's single-use reward code. It is emailed when Resend is
 *      configured, otherwise stored ("stored_manual_send") for admin follow-up.
 *
 * The referee is never granted free access; Pro still requires a paid
 * Stripe subscription. Rewards are capped per referrer.
 */

import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { assessPair, type AccountSignals } from "@/lib/abuse-signals";

export const REFEREE_DISCOUNT_PERCENT = 50;
export const MAX_REWARDS_PER_REFERRER = 12;

export function rewardPercentOff(): number {
  const raw = Number(process.env.REFERRAL_REWARD_PERCENT_OFF ?? 100);
  return Number.isFinite(raw) && raw > 0 && raw <= 100 ? Math.round(raw) : 100;
}

export function rewardDescription(): string {
  const pct = rewardPercentOff();
  return pct === 100 ? "one free month of AdmitPath Pro" : `${pct}% off one month of AdmitPath Pro`;
}

/** Statuses: pending -> checkout_started -> redeemed; or blocked. */
export const REFERRAL_STATUS = {
  PENDING: "pending",
  CHECKOUT_STARTED: "checkout_started",
  REDEEMED: "redeemed",
  BLOCKED: "blocked",
  /** Legacy rows from the previous free-month credit system. */
  LEGACY_CREDITED: "credited",
} as const;

function referralSecret(): string | null {
  const value = process.env.REFERRAL_SECRET
    || process.env.SESSION_SECRET
    || process.env.AUTH_SECRET
    || process.env.NEXTAUTH_SECRET;
  if (value && value.trim().length >= 32) return value.trim();
  if (process.env.NODE_ENV !== "production") return "dev-referral-secret-32-characters";
  return null;
}

/**
 * Signed referral code. Throws only when no signing secret is configured in
 * production; callers that render pages use `tryGenerateReferralCode`.
 */
export function generateReferralCode(userId: string): string {
  const secret = referralSecret();
  if (!secret) throw new Error("REFERRAL_SECRET or SESSION_SECRET must be at least 32 characters");
  const payload = Buffer.from(userId, "utf8").toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url").slice(0, 22);
  return `${payload}.${signature}`;
}

export function tryGenerateReferralCode(userId: string): string | null {
  try {
    return generateReferralCode(userId);
  } catch {
    return null;
  }
}

/** Resolve a code to the referrer's user ID. Never throws. */
export function referralUserId(code: string | null | undefined): string | null {
  if (!code || code.length > 300) return null;
  const secret = referralSecret();
  if (!secret) return null;
  const [payload, signature, extra] = code.split(".");
  if (!payload || !signature || extra || signature.length !== 22) return null;
  const expected = createHmac("sha256", secret).update(payload).digest("base64url").slice(0, 22);
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

const SIGNAL_SELECT = {
  id: true,
  email: true,
  name: true,
  deviceId: true,
  signupIpHash: true,
  stripeCustomerId: true,
  abuseReviewStatus: true,
} as const;

type SignalRow = {
  id: string;
  email: string;
  name: string | null;
  deviceId: string | null;
  signupIpHash: string | null;
  stripeCustomerId: string | null;
  abuseReviewStatus: string | null;
};

function toSignals(row: SignalRow): AccountSignals {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    deviceHash: row.deviceId,
    ipHash: row.signupIpHash,
    stripeCustomerId: row.stripeCustomerId,
    abuseReviewStatus: row.abuseReviewStatus,
  };
}

/**
 * Record a referral for a newly created account. Idempotent per referee
 * (unique refereeId). Abuse-blocked attempts are stored with status
 * "blocked" so admins can see them; they never receive a discount.
 */
export async function recordReferral(
  refereeId: string,
  referralCode: string,
): Promise<{ success: boolean; error?: string }> {
  const referrerId = referralUserId(referralCode);
  if (!referrerId) return { success: false, error: "Invalid referral code" };
  if (referrerId === refereeId) return { success: false, error: "Cannot refer yourself" };

  const [referrer, referee] = await Promise.all([
    prisma.user.findFirst({ where: { id: referrerId, deletedAt: null }, select: SIGNAL_SELECT }),
    prisma.user.findFirst({ where: { id: refereeId, deletedAt: null }, select: SIGNAL_SELECT }),
  ]);
  if (!referrer || !referee) return { success: false, error: "Invalid referral code" };

  const existing = await prisma.referral.findUnique({ where: { refereeId } }).catch(() => null);
  if (existing) return { success: false, error: "Referral already recorded" };

  const assessment = assessPair(toSignals(referrer), toSignals(referee));
  const blocked = assessment.decision === "block";
  try {
    await prisma.referral.create({
      data: {
        referrerId: referrer.id,
        refereeId,
        referralCode,
        status: blocked ? REFERRAL_STATUS.BLOCKED : REFERRAL_STATUS.PENDING,
        refereeDiscountPct: REFEREE_DISCOUNT_PERCENT,
        blockedReason: blocked ? assessment.flags.join(",") : null,
      },
    });
  } catch (err: unknown) {
    if ((err as { code?: string })?.code === "P2002") return { success: false, error: "Referral already recorded" };
    throw err;
  }
  if (blocked) return { success: false, error: "Referral not eligible" };
  return { success: true };
}

function promoCode(prefix: string): string {
  return `${prefix}-${randomBytes(5).toString("base64url").replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 8)}`;
}

/**
 * Ensure the referee has a one-time 50%-off promotion code for their first Pro
 * invoice. Returns the Stripe promotion-code ID to pass as a Checkout
 * discount, or null when the user has no eligible referral. Idempotent: the
 * same code is reused across checkout retries.
 */
export async function ensureRefereeDiscount(
  stripe: Stripe,
  refereeId: string,
  customerId: string,
): Promise<{ promotionCodeId: string; code: string; referralId: string } | null> {
  const referral = await prisma.referral.findUnique({ where: { refereeId } }).catch(() => null);
  if (!referral) return null;
  if (referral.status !== REFERRAL_STATUS.PENDING && referral.status !== REFERRAL_STATUS.CHECKOUT_STARTED) return null;
  if (referral.redeemedAt || referral.blockedReason) return null;

  if (referral.refereePromoCodeId && referral.refereePromoCode) {
    try {
      const existing = await stripe.promotionCodes.retrieve(referral.refereePromoCodeId);
      if (existing.active && (existing.max_redemptions == null || existing.times_redeemed < existing.max_redemptions)) {
        return { promotionCodeId: existing.id, code: existing.code, referralId: referral.id };
      }
      return null; // already used
    } catch {
      // fall through and mint a fresh code
    }
  }

  const coupon = await stripe.coupons.create(
    {
      percent_off: referral.refereeDiscountPct || REFEREE_DISCOUNT_PERCENT,
      duration: "once",
      max_redemptions: 1,
      name: `Referral ${referral.refereeDiscountPct || REFEREE_DISCOUNT_PERCENT}% off first month`,
      metadata: { app: "admitpath", kind: "referee_discount", referralId: referral.id, refereeId },
    },
    { idempotencyKey: `admitpath-referee-coupon-${referral.id}` },
  );
  const promotion = await stripe.promotionCodes.create(
    {
      promotion: { type: "coupon", coupon: coupon.id },
      code: promoCode("FRIEND"),
      max_redemptions: 1,
      customer: customerId,
      restrictions: { first_time_transaction: true },
      metadata: { app: "admitpath", kind: "referee_discount", referralId: referral.id, refereeId },
    },
    { idempotencyKey: `admitpath-referee-promo-${referral.id}` },
  );
  await prisma.referral.update({
    where: { id: referral.id },
    data: {
      refereeCouponId: coupon.id,
      refereePromoCodeId: promotion.id,
      refereePromoCode: promotion.code,
    },
  });
  return { promotionCodeId: promotion.id, code: promotion.code, referralId: referral.id };
}

export async function markReferralCheckoutStarted(referralId: string, sessionId: string): Promise<void> {
  await prisma.referral.updateMany({
    where: { id: referralId, status: { in: [REFERRAL_STATUS.PENDING, REFERRAL_STATUS.CHECKOUT_STARTED] } },
    data: { status: REFERRAL_STATUS.CHECKOUT_STARTED, checkoutSessionId: sessionId, checkoutStartedAt: new Date() },
  }).catch(() => undefined);
}

/**
 * Called from checkout.session.completed after the referee's Pro subscription
 * is verified. Marks the referral redeemed exactly once (guarded update), then
 * generates the referrer's single-use reward code.
 */
export async function completeReferral(
  stripe: Stripe,
  refereeId: string,
  options: {
    sendEmail?: (to: string, firstName: string, code: string, description: string) => Promise<{ error?: unknown } | unknown>;
  } = {},
): Promise<"redeemed" | "skipped"> {
  const referral = await prisma.referral.findUnique({ where: { refereeId } }).catch(() => null);
  if (!referral || referral.redeemedAt) return "skipped";
  if (referral.status !== REFERRAL_STATUS.PENDING && referral.status !== REFERRAL_STATUS.CHECKOUT_STARTED) return "skipped";

  const claim = await prisma.referral.updateMany({
    where: { id: referral.id, redeemedAt: null, status: { in: [REFERRAL_STATUS.PENDING, REFERRAL_STATUS.CHECKOUT_STARTED] } },
    data: { status: REFERRAL_STATUS.REDEEMED, redeemedAt: new Date() },
  });
  if (claim.count !== 1) return "skipped";

  const rewardedSoFar = await prisma.referral.count({
    where: { referrerId: referral.referrerId, rewardStatus: { in: ["generated", "emailed", "stored_manual_send"] } },
  });
  const referrer = await prisma.user.findFirst({
    where: { id: referral.referrerId, deletedAt: null },
    select: { id: true, email: true, name: true, stripeCustomerId: true },
  });
  if (!referrer || rewardedSoFar >= MAX_REWARDS_PER_REFERRER) {
    await prisma.referral.update({ where: { id: referral.id }, data: { rewardStatus: "none" } });
    return "redeemed";
  }

  try {
    const coupon = await stripe.coupons.create(
      {
        percent_off: rewardPercentOff(),
        duration: "once",
        max_redemptions: 1,
        name: "AdmitPath referral reward",
        metadata: { app: "admitpath", kind: "referrer_reward", referralId: referral.id, referrerId: referrer.id },
      },
      { idempotencyKey: `admitpath-reward-coupon-${referral.id}` },
    );
    const promotion = await stripe.promotionCodes.create(
      {
        promotion: { type: "coupon", coupon: coupon.id },
        code: promoCode("THANKS"),
        max_redemptions: 1,
        ...(referrer.stripeCustomerId ? { customer: referrer.stripeCustomerId } : {}),
        metadata: { app: "admitpath", kind: "referrer_reward", referralId: referral.id, referrerId: referrer.id },
      },
      { idempotencyKey: `admitpath-reward-promo-${referral.id}` },
    );
    let rewardStatus: "generated" | "emailed" | "stored_manual_send" = "stored_manual_send";
    let rewardEmailedAt: Date | null = null;
    if (process.env.RESEND_API_KEY?.trim() && options.sendEmail) {
      try {
        const result = await options.sendEmail(referrer.email, referrer.name?.split(" ")[0] ?? "", promotion.code, rewardDescription());
        if (!(result as { error?: unknown } | null)?.error) {
          rewardStatus = "emailed";
          rewardEmailedAt = new Date();
        }
      } catch {
        rewardStatus = "stored_manual_send";
      }
    }
    await prisma.$transaction([
      prisma.referral.update({
        where: { id: referral.id },
        data: {
          rewardCouponId: coupon.id,
          rewardPromoCodeId: promotion.id,
          rewardCode: promotion.code,
          rewardStatus,
          rewardGeneratedAt: new Date(),
          rewardEmailedAt,
        },
      }),
      prisma.user.update({
        where: { id: referrer.id },
        data: { referralCount: { increment: 1 }, referralMonthsEarned: { increment: 1 } },
      }),
    ]);
  } catch (error) {
    console.error("[referral] reward generation failed (referral stays redeemed; retry from admin)", {
      referralId: referral.id,
      name: error instanceof Error ? error.name : "UnknownError",
    });
    await prisma.referral.update({ where: { id: referral.id }, data: { rewardStatus: "failed" } }).catch(() => undefined);
  }
  return "redeemed";
}

/** Referral stats for the referrer's /refer page. */
export async function getReferralStats(userId: string) {
  const [totalReferred, totalRedeemed, rewards] = await Promise.all([
    prisma.referral.count({ where: { referrerId: userId, status: { not: REFERRAL_STATUS.BLOCKED } } }).catch(() => 0),
    prisma.referral.count({
      where: { referrerId: userId, status: { in: [REFERRAL_STATUS.REDEEMED, REFERRAL_STATUS.LEGACY_CREDITED] } },
    }).catch(() => 0),
    prisma.referral.findMany({
      where: { referrerId: userId, rewardCode: { not: null } },
      select: { rewardCode: true, rewardStatus: true, rewardGeneratedAt: true },
      orderBy: { rewardGeneratedAt: "desc" },
      take: 12,
    }).catch(() => []),
  ]);
  return {
    referralCode: tryGenerateReferralCode(userId),
    totalReferred,
    totalRedeemed,
    rewards,
  };
}
