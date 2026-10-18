import { NextResponse } from "next/server";
import { getClientIp, rateLimitWindow } from "@/lib/rate-limit";
import { formDataToInquiry, validateSchoolInquiry } from "@/lib/school-inquiry";
import { saveSchoolInquiry } from "@/lib/school-inquiry-server";

export const runtime = "nodejs";

/** No-JavaScript fallback for the inquiry form (classic form POST + 303). */
export async function POST(req: Request) {
  const ip = getClientIp(req);
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.redirect(new URL("/for-schools?inquiry=invalid#inquiry", req.url), 303);
  }
  const raw = formDataToInquiry(form);
  const back = typeof raw.sourcePage === "string" && /^\/[A-Za-z0-9/_-]{0,120}$/.test(raw.sourcePage)
    ? raw.sourcePage
    : "/for-schools";

  if (!(await rateLimitWindow(`school-inquiry:${ip}`, 5, 600_000)).allowed) {
    return NextResponse.redirect(new URL(`${back}?inquiry=rate-limited#inquiry`, req.url), 303);
  }
  const validation = validateSchoolInquiry(raw);
  if (!validation.ok) {
    return NextResponse.redirect(new URL(`${back}?inquiry=invalid#inquiry`, req.url), 303);
  }
  const saved = await saveSchoolInquiry(validation.data, req);
  return NextResponse.redirect(new URL(`${back}?inquiry=${saved.ok ? "sent" : "failed"}#inquiry`, req.url), 303);
}
