import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { rateLimitAPI, getClientIp } from "@/lib/rate-limit";
import { requireUser } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

/**
 * POST /api/account/delete
 * Soft-deletes the user and cascades to Profile, CollegeList, Essay.
 * Cancels any active Stripe subscription on a best-effort basis — never
 * fails the route if Stripe errors. Hard-delete is intentionally avoided
 * so Stripe webhooks (e.g. invoice.paid arriving late) can still find
 * the row.
 */
export async function POST(req: Request) {
  const authed = await requireUser();
  if ("response" in authed) return authed.response;
  const { userId } = authed;

  // Defensive rate-limit on account-delete. Prevents automated enumeration
  // and ensures a buggy client retry doesn't spam the deletion path.
  const rl = await rateLimitAPI(`delete:${userId}:${getClientIp(req)}`);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Try again in a minute." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  let body: { confirmation?: string } = {};
  try {
    body = await req.json();
  } catch {
    // body parsing failed — treated as missing confirmation below
  }

  if (body.confirmation !== "DELETE MY ACCOUNT") {
    return NextResponse.json(
      { error: "Missing or invalid confirmation" },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const now = new Date();

  // Cascade soft-delete atomically across every model that holds the user's
  // data. Previously this missed Analysis and Subscription, leaving past
  // analyses queryable in some report contexts and the subscription row
  // dangling after Stripe cancel.
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { deletedAt: now },
    }),
    prisma.profile.updateMany({
      where: { userId, deletedAt: null },
      data: { deletedAt: now },
    }),
    prisma.collegeList.updateMany({
      where: { userId, deletedAt: null },
      data: { deletedAt: now },
    }),
    prisma.essay.updateMany({
      where: { userId, deletedAt: null },
      data: { deletedAt: now },
    }),
    prisma.analysis.updateMany({
      where: { userId, deletedAt: null },
      data: { deletedAt: now },
    }),
    prisma.subscription.updateMany({
      where: { userId, deletedAt: null },
      data: { deletedAt: now },
    }),
    // Application has no `deletedAt` column (schema.prisma defines it as
    // hard-cascade-on-User-delete only). Soft-deleting the User keeps the
    // row alive forever since the cascade never fires. Hard-delete here so
    // applications don't accumulate as orphan rows after every account
    // deletion. (The user has already confirmed "DELETE MY ACCOUNT".)
    prisma.application.deleteMany({ where: { userId } }),
  ]);

  // Best-effort Stripe cancellation — never fail the route on Stripe errors.
  if (user.stripeSubscriptionId) {
    try {
      await stripe.subscriptions.cancel(user.stripeSubscriptionId);
    } catch (err) {
      console.error("[account/delete] stripe cancel failed:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
