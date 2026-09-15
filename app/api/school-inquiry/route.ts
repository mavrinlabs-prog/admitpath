import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimitWindow, getClientIp } from "@/lib/rate-limit";
import {
  sendSchoolInquiryNotification,
  sendSchoolInquiryConfirmation,
} from "@/lib/email";

export const runtime = "nodejs";

const schoolInquirySchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(254),
  schoolName: z.string().min(1).max(300),
  role: z.enum(["counselor", "admin", "district_admin", "other"]),
  studentCount: z.number().int().min(0).max(100000).default(0),
  message: z.string().max(2000).default(""),
});

/**
 * POST /api/school-inquiry
 *
 * Accepts a school/district sales inquiry. Validates input, rate-limits by
 * IP (3 requests per 10 minutes), sends an internal notification to the
 * team and a confirmation email to the submitter.
 */
export async function POST(req: Request) {
  // ── Rate limit by IP ──────────────────────────────────────
  const ip = getClientIp(req);
  const limit = await rateLimitWindow(`school-inquiry:${ip}`, 3, 600_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  // ── Parse & validate ──────────────────────────────────────
  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 },
    );
  }

  const parsed = schoolInquirySchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid input", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { name, email, schoolName, role, studentCount, message } = parsed.data;

  // ── Send emails (best-effort — don't fail the request) ────
  const inquiry = { name, email, schoolName, role, studentCount, message };

  try {
    const [notification] = await Promise.allSettled([
      sendSchoolInquiryNotification(inquiry),
      sendSchoolInquiryConfirmation(email, name),
    ]);
    const delivered = notification.status === "fulfilled" && !notification.value.error;
    if (!delivered) {
      return NextResponse.json(
        { ok: false, error: "We could not deliver your inquiry. Please email support directly." },
        { status: 503 },
      );
    }
  } catch (err) {
    console.error("[school-inquiry] Email send error", {
      name: err instanceof Error ? err.name : "UnknownError",
    });
    return NextResponse.json(
      { ok: false, error: "We could not deliver your inquiry. Please email support directly." },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true, delivered: true });
}
