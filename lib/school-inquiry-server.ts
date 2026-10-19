import { prisma } from "@/lib/prisma";
import { sendSchoolInquiryNotification } from "@/lib/email";
import { hashIp, getRequestIp } from "@/lib/abuse-signals";
import { INQUIRY_NEEDS, INQUIRY_ROLES, INQUIRY_TIMELINES, labelFor, type SchoolInquiryInput } from "@/lib/school-inquiry";

export type SaveInquiryResult =
  | { ok: true; id: string; emailDelivered: boolean }
  | { ok: false; reason: "database_unavailable" };

/**
 * Persist first, notify second. The DB row is the source of truth (visible at
 * /admin/inquiries); email is best-effort and skipped (dry-run log) when
 * RESEND_API_KEY is not configured, so no inquiry is ever lost and the user is
 * never shown a fake success.
 */
export async function saveSchoolInquiry(data: SchoolInquiryInput, req: Request): Promise<SaveInquiryResult> {
  let id: string;
  try {
    const row = await prisma.schoolInquiry.create({
      data: {
        name: data.name,
        email: data.email,
        schoolName: data.schoolName,
        role: data.role,
        phone: data.phone ?? null,
        studentCount: data.studentCount,
        timeline: data.timeline,
        needs: data.needs,
        message: data.message ?? null,
        audience: data.audience,
        sourcePage: data.sourcePage,
        ipHash: hashIp(getRequestIp(req.headers)),
        userAgent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
      },
      select: { id: true },
    });
    id = row.id;
  } catch (error) {
    console.error("[school-inquiry] DB save failed", { name: error instanceof Error ? error.name : "UnknownError" });
    return { ok: false, reason: "database_unavailable" };
  }

  let emailDelivered = false;
  if (process.env.RESEND_API_KEY?.trim()) {
    try {
      const details = [
        `Role: ${labelFor(INQUIRY_ROLES, data.role)}`,
        `Phone: ${data.phone ?? "—"}`,
        `Students: ${data.studentCount.toLocaleString()}`,
        `Timeline: ${labelFor(INQUIRY_TIMELINES, data.timeline)}`,
        `Needs: ${data.needs.map((need) => labelFor(INQUIRY_NEEDS, need)).join(", ")}`,
        `Source page: ${data.sourcePage}`,
        `Inquiry ID: ${id}`,
        data.message ? `Message: ${data.message}` : "",
      ].filter(Boolean).join(" | ");
      const result = await sendSchoolInquiryNotification({
        name: data.name,
        email: data.email,
        schoolName: data.schoolName,
        role: data.role,
        studentCount: data.studentCount,
        message: details,
      });
      emailDelivered = !result.error;
    } catch (error) {
      console.warn("[school-inquiry] notification failed (inquiry is saved)", { id, name: error instanceof Error ? error.name : "UnknownError" });
    }
  } else {
    console.info("[school-inquiry] RESEND_API_KEY not set — notification skipped (dry run); inquiry saved", { id });
  }

  if (emailDelivered) {
    await prisma.schoolInquiry.update({ where: { id }, data: { emailDelivered: true } }).catch(() => undefined);
  }
  return { ok: true, id, emailDelivered };
}
