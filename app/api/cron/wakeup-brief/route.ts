import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCronSecret } from "@/lib/api-helpers";
import { Resend } from "resend";

export const runtime = "nodejs";

const BRIEF_TO = "maestro.committee@gmail.com";
const FROM = process.env.EMAIL_FROM ?? "AdmitPath <maestro.committee@gmail.com>";

/**
 * Daily wakeup brief — sends a summary email to the team each morning.
 *
 * Contents:
 *   - User signups in the last 24 hours
 *   - Total user count
 *   - Any recent errors (from Vercel logs — approximated via DB health check)
 *
 * Registered in vercel.json at 07:00 UTC.
 */
export async function GET(req: Request) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const errors: string[] = [];

  // --- Gather metrics ---
  let newSignups = 0;
  let totalUsers = 0;
  let newUserNames: string[] = [];

  try {
    const [signupResult, totalResult] = await Promise.all([
      prisma.user.findMany({
        where: { createdAt: { gte: yesterday }, deletedAt: null },
        select: { name: true, email: true, plan: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where: { deletedAt: null } }),
    ]);

    newSignups = signupResult.length;
    totalUsers = totalResult;
    newUserNames = signupResult.map(
      (u) => `${u.name ?? "Anonymous"} (${u.email}, ${u.plan})`
    );
  } catch (err) {
    errors.push(`DB query failed: ${String(err)}`);
  }

  // --- Build email ---
  const signupList =
    newUserNames.length > 0
      ? newUserNames
          .slice(0, 20)
          .map((n) => `<li>${n}</li>`)
          .join("")
      : "<li>No new signups</li>";

  const errorBlock =
    errors.length > 0
      ? `<h3 style="margin:16px 0 8px;color:#EF4444;">Errors</h3><ul>${errors.map((e) => `<li style="color:#EF4444;">${e}</li>`).join("")}</ul>`
      : `<p style="color:#16A34A;font-weight:600;">No errors detected.</p>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><title>AdmitPath Wakeup Brief</title></head>
<body style="margin:0;padding:24px;font-family:Inter,-apple-system,system-ui,sans-serif;background:#D5DCE8;color:#1B2030;">
  <div style="max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:8px;overflow:hidden;">
    <div style="background:#2E4A6E;padding:16px 24px;color:#FFFFFF;font-weight:700;font-size:16px;">
      AdmitPath — Daily Wakeup Brief
    </div>
    <div style="padding:24px;">
      <p style="margin:0 0 4px;font-size:12px;color:#8890A5;">${now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>

      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <tr style="border-bottom:1px solid rgba(0,0,0,0.06);">
          <td style="padding:10px 0;font-size:14px;color:#454B5E;">New signups (24h)</td>
          <td align="right" style="padding:10px 0;font-size:18px;font-weight:bold;color:#4A6FA5;">${newSignups}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;font-size:14px;color:#454B5E;">Total users</td>
          <td align="right" style="padding:10px 0;font-size:18px;font-weight:bold;color:#1B2030;">${totalUsers}</td>
        </tr>
      </table>

      <h3 style="margin:16px 0 8px;font-size:14px;color:#2E4A6E;">Recent Signups</h3>
      <ul style="margin:0;padding-left:20px;font-size:13px;line-height:1.7;color:#454B5E;">
        ${signupList}
      </ul>
      ${newUserNames.length > 20 ? `<p style="font-size:12px;color:#8890A5;">... and ${newUserNames.length - 20} more</p>` : ""}

      ${errorBlock}
    </div>
    <div style="background:#EFF2F8;padding:12px 24px;font-size:11px;color:#8890A5;border-top:1px solid rgba(0,0,0,0.06);">
      Automated brief from AdmitPath cron system
    </div>
  </div>
</body>
</html>`;

  // --- Send email ---
  let emailSent = false;
  try {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY not set");
    const resend = new Resend(key);
    await resend.emails.send({
      from: FROM,
      to: BRIEF_TO,
      subject: `Wakeup Brief — ${newSignups} new signup${newSignups === 1 ? "" : "s"}, ${totalUsers} total`,
      html,
    });
    emailSent = true;
  } catch (err) {
    console.error("[cron/wakeup-brief] email send failed:", err);
    errors.push(`Email send failed: ${String(err)}`);
  }

  console.log("[cron/wakeup-brief]", { newSignups, totalUsers, emailSent, errors: errors.length });

  return NextResponse.json({
    ok: true,
    newSignups,
    totalUsers,
    emailSent,
    errors,
  });
}
