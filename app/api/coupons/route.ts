import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, parseJsonBody } from "@/lib/api-helpers";
import { z } from "zod";

/**
 * Coupon API -- POST applies a coupon code during checkout or signup.
 * GET returns coupon validity status.
 *
 * Coupons are stored in the `Coupon` table. Each code is unique, single-use,
 * and grants the specified discount or plan upgrade.
 *
 * Admin email for coupon management: maestro.committee@gmail.com
 */

const applySchema = z.object({
  code: z.string().min(4).max(32).trim().toUpperCase(),
});

// ---------------------------------------------------------------------------
// GET /api/coupons?code=XXXX -- check if a coupon code is valid
// ---------------------------------------------------------------------------
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = (searchParams.get("code") ?? "").trim().toUpperCase();

  if (!code || code.length < 4) {
    return NextResponse.json({ valid: false, error: "Invalid code format" }, { status: 400 });
  }

  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code },
      select: { code: true, usedAt: true, discountPct: true, freeMonths: true, planGrant: true, expiresAt: true },
    });

    if (!coupon) {
      return NextResponse.json({ valid: false, error: "Code not found" }, { status: 404 });
    }

    if (coupon.usedAt) {
      return NextResponse.json({ valid: false, error: "Code already used" }, { status: 410 });
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return NextResponse.json({ valid: false, error: "Code has expired" }, { status: 410 });
    }

    return NextResponse.json({
      valid: true,
      discountPct: coupon.discountPct,
      freeMonths: coupon.freeMonths,
      planGrant: coupon.planGrant,
    });
  } catch {
    return NextResponse.json({ valid: false, error: "Could not verify code" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST /api/coupons -- redeem a coupon code (authenticated)
// ---------------------------------------------------------------------------
export async function POST(req: Request) {
  const authed = await requireUser({ select: { id: true, plan: true } });
  if ("response" in authed) return authed.response;

  const body = await parseJsonBody(req, applySchema);
  if ("response" in body) return body.response;

  const { code } = body.data;
  const { userId } = authed;

  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
    }

    if (coupon.usedAt) {
      return NextResponse.json({ error: "This code has already been used" }, { status: 410 });
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return NextResponse.json({ error: "This code has expired" }, { status: 410 });
    }

    // Redeem the coupon -- mark as used and apply benefit
    await prisma.$transaction([
      prisma.coupon.update({
        where: { code, usedAt: null },
        data: { usedAt: new Date(), usedByUserId: userId },
      }),
      // If coupon grants a plan upgrade, apply it
      ...(coupon.planGrant
        ? [
            prisma.user.update({
              where: { id: userId },
              data: { plan: coupon.planGrant },
            }),
          ]
        : []),
    ]);

    return NextResponse.json({
      success: true,
      discountPct: coupon.discountPct,
      freeMonths: coupon.freeMonths,
      planGrant: coupon.planGrant,
      message: coupon.planGrant
        ? `Coupon applied! Your plan has been upgraded to ${coupon.planGrant}.`
        : coupon.freeMonths
          ? `Coupon applied! You get ${coupon.freeMonths} free month(s).`
          : `Coupon applied! You get ${coupon.discountPct}% off.`,
    });
  } catch (err) {
    console.error("[/api/coupons] redemption error:", err);
    return NextResponse.json(
      { error: "Could not apply coupon. Please try again." },
      { status: 500 },
    );
  }
}
