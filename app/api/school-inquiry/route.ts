import { NextResponse } from "next/server";
import { rateLimitWindow, getClientIp } from "@/lib/rate-limit";
import { validateSchoolInquiry } from "@/lib/school-inquiry";
import { saveSchoolInquiry } from "@/lib/school-inquiry-server";

export const runtime = "nodejs";

/**
 * POST /api/school-inquiry — school / district / counselor inquiry (JSON).
 * Validates every required field, saves to the SchoolInquiry table (with
 * createdAt + source page), then best-effort notifies the team.
 */
export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limit = await rateLimitWindow(`school-inquiry:${ip}`, 5, 600_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions from this connection. Please wait 10 minutes and try again." },
      { status: 429, headers: { "Retry-After": "600" } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "The form could not be read. Refresh and try again.", fieldErrors: {} }, { status: 400 });
  }

  const validation = validateSchoolInquiry(body);
  if (!validation.ok) {
    if (validation.fieldErrors.website) {
      // Honeypot tripped: pretend success to bots without saving anything.
      return NextResponse.json({ ok: true, id: null });
    }
    return NextResponse.json(
      { ok: false, error: "Please fix the highlighted fields.", fieldErrors: validation.fieldErrors },
      { status: 400 },
    );
  }

  const saved = await saveSchoolInquiry(validation.data, req);
  if (!saved.ok) {
    return NextResponse.json(
      { ok: false, error: "We could not save your inquiry right now. Please try again in a minute or email maestro.committee@gmail.com." },
      { status: 503, headers: { "Retry-After": "60" } },
    );
  }
  return NextResponse.json({ ok: true, id: saved.id });
}
