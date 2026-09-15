// Lightweight operator alerting. Critical-path failures (LLM exhaustion,
// Stripe webhook breakage, DB outage) email the on-call operator at
// process.env.ALERT_EMAIL via Resend. Always emits a structured log so
// Vercel Function Logs stay the source of truth; email is the "wake me up"
// layer.
//
// Rate-limit: at most 5 alerts per scope per hour (in-memory per-instance)
// so a thundering herd does not page 100 times. No DB table -- alert
// history lives in logs.
//
// Pattern source: MongoDB production tracking guide (production monitoring
// concept), adapted for AdmitPath's Prisma + PostgreSQL stack.

import { Resend } from "resend";
import { logError } from "./log-error";
import { rateLimit } from "./rate-limit";

export type AlertSeverity = "critical" | "warn";

export interface AlertInput {
  severity: AlertSeverity;
  scope: string;
  message: string;
  context?: Record<string, string | number | boolean | null | undefined>;
}

const ALERT_FROM = "AdmitPath Alerts <maestro.committee@gmail.com>";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderEmailBody(input: AlertInput, sha: string, ts: string): string {
  const ctxJson = input.context
    ? JSON.stringify(input.context, null, 2)
    : "(none)";
  return [
    `<div style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.5;color:#0F172A;">`,
    `<h2 style="margin:0 0 12px;">[${escapeHtml(input.severity.toUpperCase())}] ${escapeHtml(input.scope)}</h2>`,
    `<p><strong>Message:</strong> ${escapeHtml(input.message)}</p>`,
    `<p><strong>Timestamp:</strong> ${escapeHtml(ts)}</p>`,
    `<p><strong>Deployment:</strong> ${escapeHtml(sha)}</p>`,
    `<p><strong>Context:</strong></p>`,
    `<pre style="background:#EFF2F8;border:1px solid rgba(0,0,0,0.06);border-radius:8px;padding:12px;white-space:pre-wrap;word-break:break-word;">${escapeHtml(ctxJson)}</pre>`,
    `</div>`,
  ].join("");
}

/**
 * Fire an operator alert. Always emits a structured log; on critical and
 * when ALERT_EMAIL + RESEND_API_KEY are configured, also sends an email
 * (rate-limited to 5/hr per scope so failure storms do not page repeatedly).
 *
 * Best-effort: never throws. Callers may invoke fire-and-forget.
 */
export async function sendAlert(input: AlertInput): Promise<void> {
  const ts = new Date().toISOString();

  // Always log. Email is additive.
  logError(
    `alert:${input.scope}`,
    new Error(input.message),
    {
      severity: input.severity,
      ...input.context,
    },
  );

  if (input.severity !== "critical") return;

  const to = process.env.ALERT_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;
  if (!to || !apiKey) return; // silent skip -- operator opted out

  // Rate-limit per scope: 5/hr.
  const allowed = rateLimit(`alert:${input.scope}`, 5, 3_600_000);
  if (!allowed) {
    logError(
      `alert:${input.scope}:suppressed`,
      new Error("alert rate-limited"),
      { severity: input.severity },
    );
    return;
  }

  const sha = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ?? "local";
  const subject = `[ALERT:${input.severity}] ${input.scope} -- ${input.message.slice(0, 80)}`;

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: ALERT_FROM,
      to,
      subject,
      html: renderEmailBody(input, sha, ts),
    });
  } catch (e) {
    // If the alerting channel itself is broken, log it and move on.
    logError("alert:send-failed", e, { scope: input.scope });
  }
}
