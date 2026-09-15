import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { rateLimitWindow, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const newsletterSchema = z.object({
  email: z.string().email().max(254),
});

/**
 * Newsletter subscribe endpoint. Accepts { email } and forwards to Resend
 * Audiences. Missing delivery configuration fails closed so the UI never
 * reports a subscription that was not persisted upstream.
 */
export async function POST(req: NextRequest) {
  // Rate limit: 5 subscribe attempts per minute per IP to prevent abuse
  const ip = getClientIp(req);
  const limit = await rateLimitWindow(`newsletter:${ip}`, 5, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    return NextResponse.json(
      { ok: false, error: "Newsletter signup is temporarily unavailable." },
      { status: 503, headers: { "Retry-After": "60" } },
    );
  }

  try {
    const resend = new Resend(apiKey);
    await resend.contacts.create({
      audienceId,
      email,
      unsubscribed: false,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[newsletter] Resend create-contact failed", {
      name: err instanceof Error ? err.name : "UnknownError",
    });
    return NextResponse.json({ ok: false, error: "Subscribe failed" }, { status: 500 });
  }
}
