import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { getClientIp, rateLimitWindow } from "@/lib/rate-limit";
import { verifyUnsubscribeToken } from "@/lib/unsubscribe";

export const runtime = "nodejs";

function requestValues(req: Request): { email: string; token: string } | null {
  const url = new URL(req.url);
  const email = (url.searchParams.get("email") ?? "").trim().toLowerCase();
  const token = url.searchParams.get("t") ?? "";
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254 || token.length > 128) return null;
  return { email, token };
}

async function unsubscribe(req: Request): Promise<NextResponse> {
  const ip = getClientIp(req);
  if (!(await rateLimitWindow(`unsubscribe:${ip}`, 10, 60_000)).allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const values = requestValues(req);
  if (!values || !verifyUnsubscribeToken(values.email, values.token)) {
    return NextResponse.json({ error: "Invalid unsubscribe link" }, { status: 400 });
  }

  await prisma.user.updateMany({
    where: { email: values.email, deletedAt: null },
    data: { emailConsent: false, emailConsentAt: null },
  });

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (apiKey && audienceId) {
    await new Resend(apiKey).contacts.update({
      audienceId,
      email: values.email,
      unsubscribed: true,
    }).catch((error) => {
      console.error("[unsubscribe] audience update failed", {
        name: error instanceof Error ? error.name : "UnknownError",
      });
    });
  }

  return NextResponse.json({ success: true });
}

export async function POST(req: Request) {
  return unsubscribe(req);
}

export async function GET(req: Request) {
  const result = await unsubscribe(req);
  if (result.ok) return NextResponse.redirect(new URL("/unsubscribed", req.url), 303);
  return NextResponse.redirect(new URL("/unsubscribed?status=invalid", req.url), 303);
}
