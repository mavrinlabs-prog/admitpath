import { NextResponse } from "next/server";
import { getClientIp, rateLimitWindow } from "@/lib/rate-limit";
import {
  sendSchoolInquiryConfirmation,
  sendSchoolInquiryNotification,
} from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (!(await rateLimitWindow(`school-inquiry-form:${ip}`, 3, 600_000)).allowed) {
    return NextResponse.redirect(new URL("/for-schools?inquiry=rate-limited", req.url), 303);
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.redirect(new URL("/for-schools?inquiry=invalid", req.url), 303);
  }
  const email = String(form.get("email") ?? "").trim().slice(0, 254);
  const schoolName = String(form.get("schoolName") ?? "").trim().slice(0, 300);
  const studentCount = Math.max(0, Math.min(100000, Number(form.get("studentCount")) || 0));

  if (!/^\S+@\S+\.\S+$/.test(email) || !schoolName) {
    return NextResponse.redirect(new URL("/for-schools?inquiry=invalid", req.url), 303);
  }

  const inquiry = {
    name: "School counselor",
    email,
    schoolName,
    role: "counselor",
    studentCount,
    message: "Submitted from the counselor pricing form.",
  };

  const [notification] = await Promise.allSettled([
    sendSchoolInquiryNotification(inquiry),
    sendSchoolInquiryConfirmation(email, inquiry.name),
  ]);

  if (notification.status === "rejected" || notification.value.error) {
    return NextResponse.redirect(new URL("/for-schools?inquiry=failed", req.url), 303);
  }

  return NextResponse.redirect(new URL("/for-schools?inquiry=sent", req.url), 303);
}
