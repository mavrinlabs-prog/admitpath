import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { rateLimitAPI, getClientIp } from "@/lib/rate-limit";
import { requireUser } from "@/lib/api-helpers";
import { getAppBaseUrl } from "@/lib/app-url";

export async function POST(req: Request) {
  try {
    const authed = await requireUser();
    if ("response" in authed) return authed.response;
    const { userId } = authed;

    const rl = await rateLimitAPI(`portal:${userId}:${getClientIp(req)}`);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Try again in a minute." },
        { status: 429, headers: { "Retry-After": "60" } },
      );
    }

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { stripeCustomerId: true } });
    if (!user?.stripeCustomerId) {
      return NextResponse.json({ error: "No billing account found" }, { status: 404 });
    }

    const appUrl = getAppBaseUrl();
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${appUrl}/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[stripe/create-portal POST]", err);
    return NextResponse.json({ error: "A temporary error occurred" }, { status: 500 });
  }
}

