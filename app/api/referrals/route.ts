import { NextResponse } from "next/server";
import { requireUser, parseJsonBody } from "@/lib/api-helpers";
import { z } from "zod";
import { getReferralStats, recordReferral } from "@/lib/referral";
import { buildReferralUrl } from "@/lib/site-url";

/**
 * Referral API — GET returns stats for the authenticated user,
 * POST applies a referral code during signup.
 *
 * Referral codes carry an exact account ID protected by an HMAC signature.
 */

// ---------------------------------------------------------------------------
// GET /api/referrals — referral stats for authenticated user
// ---------------------------------------------------------------------------

export async function GET() {
  const r = await requireUser({ select: { id: true } });
  if ("response" in r) {
    return r.response;
  }

  const stats = await getReferralStats(r.userId);

  return NextResponse.json({
    referralCode: stats.referralCode,
    referralUrl: buildReferralUrl(stats.referralCode),
    referralCount: stats.totalReferred,
    referralMonthsEarned: stats.freeMonthsEarned,
  });
}

// ---------------------------------------------------------------------------
// POST /api/referrals — apply a referral code during signup
// ---------------------------------------------------------------------------

const applySchema = z.object({
  referralCode: z.string().min(24).max(192).regex(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/).trim(),
});

export async function POST(req: Request) {
  const r = await requireUser({ select: { id: true } });
  if ("response" in r) return r.response;

  const body = await parseJsonBody(req, applySchema);
  if ("response" in body) return body.response;

  const { referralCode } = body.data;
  const result = await recordReferral(r.userId, referralCode);

  if (!result.success) {
    const status = result.error === "Invalid referral code" ? 404
      : result.error === "Cannot refer yourself" ? 400
      : 409;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({ success: true });
}
