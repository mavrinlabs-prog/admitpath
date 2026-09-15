import { Resend } from "resend";
import { createUnsubscribeToken } from "@/lib/unsubscribe";

// Falls back to the AdmitPath team alias rather than any individual's
// personal address — earlier code leaked a third-party gmail here.
const ALERT_EMAIL = process.env.ALERT_EMAIL ?? "maestro.committee@gmail.com";

function getResendClient(): Resend {
  const key = (process.env.RESEND_API_KEY ?? "").replace(/^\xEF\xBB\xBF/, "").trim();
  if (!key) {
    throw new Error("RESEND_API_KEY is not set. Add to .env.local or Vercel.");
  }
  return new Resend(key);
}

const FROM = process.env.EMAIL_FROM ?? "AdmitPath <maestro.committee@gmail.com>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]!);
}

function emailHeader(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function unsubscribeHeaders(recipientEmail: string): Record<string, string> {
  const token = createUnsubscribeToken(recipientEmail);
  const mailto = "<mailto:maestro.committee@gmail.com?subject=unsubscribe>";
  if (!token) return { "List-Unsubscribe": mailto };
  const url = `${APP_URL}/api/unsubscribe?email=${encodeURIComponent(recipientEmail)}&t=${token}`;
  return {
    "List-Unsubscribe": `${mailto}, <${url}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}

/**
 * Shared transactional email renderer. Cool blue-grey (#D5DCE8) background,
 * brand-dark (#2E4A6E) header bar, white (#FFFFFF) card body, surface
 * (#EFF2F8) footer. Single primary-blue (#4A6FA5) CTA. Inline styles +
 * table-based layout for client compatibility (Gmail/Outlook strip <style>).
 * 560px mobile-first column. Inter font stack.
 *
 * Signature:
 *   renderEmail({ heading, intro, cta?, footer? })
 *     heading  — bold Inter 24px, primary line of the email
 *     intro    — body HTML rendered in 16px Inter (paragraphs, lists ok)
 *     cta?     — { label, href } single primary-blue button
 *     footer?  — optional body HTML rendered inside the white card area
 */
function renderEmail(opts: {
  heading: string;
  intro: string;
  cta?: { label: string; href: string };
  footer?: string;
}): string {
  const { heading, intro, cta, footer } = opts;
  const body = `font-family: Inter, -apple-system, system-ui, sans-serif; color: #1B2030;`;
  const button = cta
    ? `
      <tr>
        <td style="padding: 8px 32px 32px 32px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="background: #4A6FA5; border-radius: 6px;">
                <a href="${cta.href}" style="display: inline-block; padding: 16px 28px; font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 14px; color: #FFFFFF; text-decoration: none; font-weight: bold;">${cta.label}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    : "";

  const footerBlock = footer
    ? `
      <tr>
        <td style="padding: 0 32px 16px 32px; ${body} font-size: 14px; line-height: 1.55; color: #454B5E;">${footer}</td>
      </tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${heading}</title>
  </head>
  <body style="margin: 0; padding: 0; background: #D5DCE8;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #D5DCE8;">
      <tr>
        <td align="center" style="padding: 32px 16px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="560" style="max-width: 560px; width: 100%;">
            <!-- Header -->
            <tr>
              <td style="background: #2E4A6E; padding: 20px 32px; border-radius: 8px 8px 0 0;">
                <span style="${body} font-size: 16px; font-weight: 700; letter-spacing: 0.02em; color: #FFFFFF;">AdmitPath</span>
              </td>
            </tr>
            <!-- Body card -->
            <tr>
              <td style="background: #FFFFFF;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="padding: 32px 32px 16px 32px; ${body} font-size: 24px; line-height: 1.25; font-weight: bold; color: #1B2030;">${heading}</td>
                  </tr>
                  <tr>
                    <td style="padding: 0 32px 24px 32px; ${body} font-size: 16px; line-height: 1.6; color: #1B2030;">${intro}</td>
                  </tr>
                  ${button}
                  ${footerBlock}
                </table>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background: #EFF2F8; padding: 16px 32px; border-top: 1px solid rgba(0,0,0,0.06); border-radius: 0 0 8px 8px;">
                <span style="${body} font-size: 11px; color: #8890A5;">AdmitPath · <a href="${APP_URL}" style="color: #8890A5; text-decoration: underline;">admith.vercel.app</a> · <a href="${APP_URL}/settings" style="color: #8890A5; text-decoration: underline;">Manage email preferences</a> · <a href="mailto:maestro.committee@gmail.com?subject=Unsubscribe" style="color: #8890A5; text-decoration: underline;">Unsubscribe</a></span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendWelcomeEmail(to: string, firstName: string, overallScore?: number | null) {
  const resend = getResendClient();

  const scoreBlock = overallScore != null && Number.isFinite(overallScore)
    ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 16px 0;">
        <tr>
          <td style="background: #4A6FA5; border-radius: 12px; padding: 16px 24px; text-align: center;">
            <span style="font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 36px; font-weight: 800; color: #FFFFFF; line-height: 1;">${Math.round(overallScore)}</span>
            <span style="font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 14px; color: rgba(255,255,255,0.7);"> / 100</span>
            <br />
            <span style="font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 11px; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.1em;">Your profile score</span>
          </td>
        </tr>
      </table>`
    : "";

  return resend.emails.send({
    from: FROM,
    to,
    subject: overallScore ? `Your score: ${Math.round(overallScore)}/100 — here's your roadmap` : "Your college roadmap is ready",
    html: renderEmail({
      heading: `Welcome to AdmitPath, ${firstName}.`,
      intro: `<p style="margin: 0 0 16px 0;">You just joined thousands of students who use AdmitPath to build stronger college applications. Here's what you get:</p>
<ul style="margin: 0 0 16px 0; padding-left: 20px; line-height: 1.8;">
  <li><strong>7-dimension profile scoring</strong> calibrated against real admissions outcomes</li>
  <li><strong>Line-by-line essay feedback</strong> on voice, insight, and specificity</li>
  <li><strong>College matching</strong> using published Common Data Set admit rates</li>
  <li><strong>30/90/365-day action plans</strong> personalized to your gaps</li>
</ul>
${scoreBlock}
<p style="margin: 0;">The students who improve the most do three things in their first week: complete their profile, run the analysis, and score one essay draft.</p>`,
      cta: { label: overallScore ? "View your full results" : "Complete your profile", href: overallScore ? `${APP_URL}/analyze` : `${APP_URL}/profile/create` },
    }),
  });
}

export async function sendProfileNudgeEmail(to: string, firstName: string, pct: number, missingFields?: string[]) {
  const resend = getResendClient();

  // Build a specific list of what's missing so the nudge feels actionable
  const missingBlock = missingFields && missingFields.length > 0
    ? `<p style="margin: 12px 0 0 0; font-size: 14px; color: #454B5E;">Specifically, we're still missing:</p>
       <ul style="margin: 8px 0 0 0; padding-left: 20px; line-height: 1.7; color: #1B2030;">
         ${missingFields.map((f) => `<li>${f}</li>`).join("")}
       </ul>`
    : "";

  const remaining = 100 - pct;
  const timeEstimate = remaining <= 25 ? "under 2 minutes" : remaining <= 50 ? "about 3 minutes" : "about 5 minutes";

  return resend.emails.send({
    from: FROM,
    to,
    subject: `${firstName}, ${remaining <= 25 ? "you're almost done" : `${pct}% complete`} — finish in ${timeEstimate}`,
    html: renderEmail({
      heading: `${firstName}, you're ${pct}% there.`,
      intro: `<p style="margin: 0 0 12px 0;">Your profile is ${pct}% complete. Finishing it takes ${timeEstimate} and unlocks:</p>
<ul style="margin: 0 0 12px 0; padding-left: 20px; line-height: 1.7;">
  <li>Your full 7-dimension score breakdown</li>
  <li>School-specific admission probability estimates</li>
  <li>A personalized 30/90/365-day action plan</li>
</ul>
${missingBlock}
<p style="margin: 12px 0 0 0; font-size: 14px; color: #454B5E;">Students with complete profiles get significantly more accurate scoring. Every field you fill in makes the analysis sharper.</p>`,
      cta: { label: remaining <= 25 ? "Finish now (2 min)" : "Continue your profile", href: `${APP_URL}/profile/create` },
    }),
  });
}

export async function sendEssayTipEmail(to: string, firstName: string) {
  const resend = getResendClient();
  return resend.emails.send({
    from: FROM,
    to,
    subject: "This week's essay tip",
    html: renderEmail({
      heading: `Show, don't tell.`,
      intro: `<p style="margin: 0 0 12px 0;">${firstName}, the most common mistake in college essays is stating qualities instead of demonstrating them. Instead of "I am a leader," show a moment where you led under pressure.</p><p style="margin: 0;">Upload your draft to AdmitPath for feedback on authenticity, insight, specificity, storytelling, impact, and voice.</p>`,
      cta: { label: "Get essay feedback", href: `${APP_URL}/essays` },
    }),
  });
}

export async function sendDeadlineReminderEmail(to: string, firstName: string, daysLeft: number) {
  const resend = getResendClient();
  return resend.emails.send({
    from: FROM,
    to,
    subject: `${daysLeft} days until your application deadline`,
    html: renderEmail({
      heading: `${firstName}, ${daysLeft} days remain.`,
      intro: `<p style="margin: 0 0 12px 0;">Your AdmitPath checklist:</p><ul style="margin: 0; padding-left: 20px;"><li>College list finalized (reach/target/safety)</li><li>Essays reviewed and submitted</li><li>Recommendations requested</li><li>Activity list complete</li></ul>`,
      cta: { label: "Check your progress", href: `${APP_URL}/dashboard` },
    }),
  });
}

export async function sendPaymentConfirmationEmail(email: string, plan: string) {
  const resend = getResendClient();
  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `Payment received · ${planLabel} plan`,
      html: renderEmail({
        heading: `Payment received.`,
        intro: `<p style="margin: 0;">Your AdmitPath ${planLabel} plan is now active. You have full access to profile analysis, essay feedback, and your personalized college roadmap.</p>`,
        cta: { label: "Go to your dashboard", href: `${APP_URL}/dashboard` },
      }),
    });
  } catch (err) {
    // Payment confirmation is important — log the failure so ops can
    // investigate if a paying customer never received their receipt.
    console.error("[email] sendPaymentConfirmationEmail failed", { to: email, plan, error: String(err) });
  }
}

export async function sendWeeklyProgressEmail(
  email: string,
  data: {
    analysesRun: number;
    essaysReviewed: number;
    profileCompleteness: number;
    avgScoreChange: number;
    currentScore?: number | null;
    previousScore?: number | null;
    firstName?: string;
    /** Current dimension scores for per-dimension comparison */
    currentDimensions?: Record<string, number> | null;
    /** Previous week's dimension scores */
    previousDimensions?: Record<string, number> | null;
  }
) {
  const resend = getResendClient();
  const dateLabel = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const delta =
    data.avgScoreChange === 0
      ? "0"
      : `${data.avgScoreChange > 0 ? "+" : ""}${data.avgScoreChange}`;

  const improved = data.avgScoreChange > 0;
  const declined = data.avgScoreChange < 0;
  const name = data.firstName || "there";

  // Build celebration or encouragement header based on score change
  const scoreChangeColor = improved ? "#16A34A" : declined ? "#EF4444" : "#4A6FA5";
  const scoreChangeLabel = improved ? "Score improved!" : declined ? "Score dipped" : "Score held steady";

  // Score comparison block with arrow from previous to current
  const hasBothScores = data.currentScore != null && Number.isFinite(data.currentScore) && data.previousScore != null && Number.isFinite(data.previousScore);
  const scoreBlock = data.currentScore != null && Number.isFinite(data.currentScore)
    ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 16px 0;">
        <tr>
          <td style="background: ${improved ? "rgba(22,163,74,0.08)" : "rgba(74,111,165,0.08)"}; border: 1px solid ${improved ? "rgba(22,163,74,0.2)" : "rgba(74,111,165,0.15)"}; border-radius: 12px; padding: 16px 24px; text-align: center;">
            <span style="font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: ${scoreChangeColor}; font-weight: 700;">${scoreChangeLabel}</span>
            <br />
            ${hasBothScores
              ? `<span style="font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 22px; font-weight: 600; color: #8890A5; line-height: 1.3;">${Math.round(data.previousScore!)}</span>
                 <span style="font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 16px; color: #8890A5;"> &rarr; </span>
                 <span style="font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 36px; font-weight: 800; color: ${scoreChangeColor}; line-height: 1.3;">${Math.round(data.currentScore)}</span>
                 <span style="font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 14px; color: #8890A5;"> / 100</span>`
              : `<span style="font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 36px; font-weight: 800; color: ${scoreChangeColor}; line-height: 1.3;">${Math.round(data.currentScore)}</span>
                 <span style="font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 14px; color: #8890A5;"> / 100</span>`}
            ${hasBothScores && data.previousScore !== data.currentScore
              ? `<br /><span style="font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 13px; color: ${scoreChangeColor}; font-weight: 600;">${improved ? "+" : ""}${Math.round(data.currentScore - data.previousScore!)} points &mdash; ${improved ? "that's progress!" : "let's bounce back"}</span>`
              : ""}
          </td>
        </tr>
      </table>`
    : "";

  // Per-dimension comparison block
  const DIMENSION_LABELS: Record<string, string> = {
    academicRigor: "Academic Rigor",
    leadership: "Leadership",
    awards: "Awards",
    activityDepth: "Activity Depth",
    spike: "Spike",
    essayQuality: "Essay Quality",
    recommendations: "Recommendations",
  };

  let dimensionBlock = "";
  let weakestDimKey = "";
  let weakestDimScore = 101;
  let improvedDims: string[] = [];
  let declinedDims: string[] = [];

  if (data.currentDimensions) {
    const dimRows: string[] = [];
    const dimKeys = Object.keys(DIMENSION_LABELS);

    for (const key of dimKeys) {
      const curr = data.currentDimensions[key];
      if (typeof curr !== "number" || !Number.isFinite(curr)) continue;

      // Track weakest
      if (curr < weakestDimScore) {
        weakestDimScore = curr;
        weakestDimKey = key;
      }

      const prev = data.previousDimensions?.[key];
      let changeStr = "";
      if (typeof prev === "number" && Number.isFinite(prev)) {
        const diff = Math.round(curr - prev);
        if (diff > 0) {
          changeStr = `<span style="color: #16A34A; font-weight: 600;">+${diff}</span>`;
          improvedDims.push(DIMENSION_LABELS[key]);
        } else if (diff < 0) {
          changeStr = `<span style="color: #EF4444; font-weight: 600;">${diff}</span>`;
          declinedDims.push(DIMENSION_LABELS[key]);
        } else {
          changeStr = `<span style="color: #8890A5;">&mdash;</span>`;
        }
      }

      dimRows.push(
        `<tr style="border-bottom: 1px solid rgba(0,0,0,0.06);">
          <td style="padding: 8px 0; font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 13px; color: #454B5E;">${DIMENSION_LABELS[key]}</td>
          <td align="right" style="padding: 8px 8px 8px 0; font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 14px; font-weight: bold; color: #1B2030;">${Math.round(curr)}</td>
          <td align="right" style="padding: 8px 0; font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 13px; width: 40px;">${changeStr}</td>
        </tr>`
      );
    }

    if (dimRows.length > 0) {
      dimensionBlock = `
        <p style="margin: 16px 0 8px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #4A6FA5; font-weight: 700;">Dimension breakdown</p>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 8px 0; border-collapse: collapse;">
          ${dimRows.join("")}
        </table>`;
    }
  }

  // Improvement areas callout
  let improvementCallout = "";
  if (improvedDims.length > 0) {
    improvementCallout += `<p style="margin: 8px 0 0 0; font-size: 13px; color: #16A34A; font-weight: 600;">Improved: ${improvedDims.join(", ")}</p>`;
  }
  if (declinedDims.length > 0) {
    improvementCallout += `<p style="margin: 4px 0 0 0; font-size: 13px; color: #EF4444;">Dipped: ${declinedDims.join(", ")}</p>`;
  }

  // Specific next action based on weakest dimension
  const NEXT_ACTIONS: Record<string, string> = {
    academicRigor: "Focus on course rigor. If you can still adjust your schedule, add an AP or honors class in a core subject.",
    leadership: "Take on a leadership role in an existing activity. Starting a club or project this month shows initiative.",
    awards: "Enter competitions in your strongest area. Regional and state-level awards move the needle most.",
    activityDepth: "Double down on your top 2-3 activities. Depth beats breadth every time in admissions.",
    spike: "Develop your spike further. What makes you memorable? Build a project, publish, or compete in that area.",
    essayQuality: "Revise your essays. Upload a draft to AdmitPath for line-by-line feedback on voice and specificity.",
    recommendations: "Strengthen your recommender relationships. Meet with your teacher this week and share your goals.",
  };

  let nextActionBlock = "";
  if (weakestDimKey && NEXT_ACTIONS[weakestDimKey]) {
    nextActionBlock = `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 16px 0 0 0;">
        <tr>
          <td style="background: rgba(74,111,165,0.06); border: 1px solid rgba(74,111,165,0.12); border-radius: 8px; padding: 12px 16px;">
            <span style="font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #4A6FA5; font-weight: 700;">Your #1 action this week</span>
            <br />
            <span style="font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 14px; color: #1B2030; line-height: 1.5;">Your weakest dimension is <strong>${DIMENSION_LABELS[weakestDimKey]}</strong> (${Math.round(weakestDimScore)}/100). ${NEXT_ACTIONS[weakestDimKey]}</span>
          </td>
        </tr>
      </table>`;
  }

  // Motivational note based on activity
  const activityNote = data.analysesRun === 0 && data.essaysReviewed === 0
    ? `<p style="margin: 16px 0 0 0; font-size: 14px; color: #454B5E; font-style: italic;">You didn't run any analyses or reviews this week. Even one session per week keeps your application on track. Pick up where you left off below.</p>`
    : improved
      ? `<p style="margin: 16px 0 0 0; font-size: 14px; color: #16A34A; font-weight: 600;">Your score went from ${data.previousScore != null ? Math.round(data.previousScore) : "?"} to ${data.currentScore != null ? Math.round(data.currentScore) : "?"} — that's progress!</p>`
      : "";

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: improved
        ? `${name === "there" ? "Your" : `${name}, your`} score went up ${Math.abs(data.avgScoreChange)} points this week`
        : `Your weekly progress · ${dateLabel}`,
      html: renderEmail({
        heading: improved
          ? `${name}, your score is climbing.`
          : `Your week on AdmitPath.`,
        intro: `<p style="margin: 0 0 12px 0;">Here's what happened in the last seven days.</p>
${scoreBlock}
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);"><td style="padding: 10px 0; font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 14px; color: #454B5E;">Analyses run</td><td align="right" style="padding: 10px 0; font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 16px; font-weight: bold; color: #1B2030;">${data.analysesRun}</td></tr>
            <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);"><td style="padding: 10px 0; font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 14px; color: #454B5E;">Essays reviewed</td><td align="right" style="padding: 10px 0; font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 16px; font-weight: bold; color: #1B2030;">${data.essaysReviewed}</td></tr>
            <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);"><td style="padding: 10px 0; font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 14px; color: #454B5E;">Profile completeness</td><td align="right" style="padding: 10px 0; font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 16px; font-weight: bold; color: #1B2030;">${data.profileCompleteness}%</td></tr>
            <tr><td style="padding: 10px 0; font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 14px; color: #454B5E;">Score change</td><td align="right" style="padding: 10px 0; font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 16px; font-weight: bold; color: ${scoreChangeColor};">${delta}</td></tr>
          </table>
${dimensionBlock}
${improvementCallout}
${nextActionBlock}
${activityNote}`,
        cta: { label: "Open your dashboard", href: `${APP_URL}/dashboard` },
      }),
    });
  } catch (err) {
    console.error("[email] sendWeeklyProgressEmail failed", { to: email, error: String(err) });
  }
}

export async function sendPaymentFailedEmail(to: string, firstName: string) {
  const resend = getResendClient();
  return resend.emails.send({
    from: FROM,
    to,
    subject: "We couldn't process your payment",
    html: renderEmail({
      heading: `${firstName}, your payment didn't go through.`,
      intro: `<p style="margin: 0 0 12px 0;">Your AdmitPath subscription payment failed. To keep access, update your payment method.</p><p style="margin: 0;">Reply to this email if you need help.</p>`,
      cta: { label: "Update payment method", href: `${APP_URL}/settings` },
    }),
  });
}

export async function sendWinBackEmail(to: string, firstName: string) {
  const resend = getResendClient();
  return resend.emails.send({
    from: FROM,
    to,
    subject: "Your subscription ended — pick up where you left off",
    html: renderEmail({
      heading: `${firstName}, your Pro subscription has ended.`,
      intro: `<p style="margin: 0;">Your profile and essays are saved. Reactivate any time to keep going.</p>`,
      cta: { label: "Reactivate your plan", href: `${APP_URL}/pricing` },
    }),
  });
}

// ---------------------------------------------------------------------------
// Monetization-optimized lifecycle emails
// ---------------------------------------------------------------------------

/**
 * Day 1: Welcome + first score (engagement hook).
 * Already handled by sendWelcomeEmail above — includes score block when available.
 */

/**
 * Day 3: "3 things your profile is missing" (value demonstration).
 * Shows the user specific gaps to create urgency + demonstrates analysis value.
 */
export async function sendDay3GapEmail(
  to: string,
  firstName: string,
  gaps: string[],
  overallScore?: number | null,
) {
  const resend = getResendClient();
  const gapItems = (gaps.length > 0 ? gaps.slice(0, 3) : [
    "Your activity list doesn't show a clear spike — admissions readers can't identify what makes you memorable",
    "No essay has been scored yet — this is the highest-leverage piece you can still improve",
    "Your college list is empty — without reach/target/safety balance, you're flying blind",
  ]).map((g) => `<li>${g}</li>`).join("");

  const scoreNote = overallScore != null && Number.isFinite(overallScore)
    ? `<p style="margin: 0 0 16px 0;">Your current score is <strong>${Math.round(overallScore)}/100</strong>. Fixing even one of these gaps typically improves scores by 8–15 points.</p>`
    : "";

  return resend.emails.send({
    from: FROM,
    to,
    subject: `${firstName}, 3 things your profile is missing`,
    html: renderEmail({
      heading: `${firstName}, here's what's holding you back.`,
      intro: `<p style="margin: 0 0 12px 0;">We analyzed your profile and found three specific gaps that admissions officers at competitive schools will notice:</p>
<ol style="margin: 0 0 16px 0; padding-left: 20px; line-height: 1.8;">
  ${gapItems}
</ol>
${scoreNote}
<p style="margin: 0;">Each gap has a clear fix. The students who improve the fastest address these in order of impact.</p>`,
      cta: { label: "Fix your gaps now", href: `${APP_URL}/analyze` },
    }),
  });
}

/**
 * Day 7: Upgrade nudge — what Pro unlocks.
 */
export async function sendDay7SocialProofEmail(to: string, firstName: string) {
  const resend = getResendClient();
  return resend.emails.send({
    from: FROM,
    to,
    subject: `${firstName}, here's what you're not seeing in your analysis`,
    html: renderEmail({
      heading: `${firstName}, here's what Pro students unlock.`,
      intro: `<p style="margin: 0 0 12px 0;">You've seen your top 3 dimension scores. Here's what Pro members get that free users don't:</p>
<ul style="margin: 0 0 16px 0; padding-left: 20px; line-height: 1.8;">
  <li><strong>All 7 dimension scores</strong> — not just the top 3. The bottom 4 are where the real gaps live.</li>
  <li><strong>Re-analyses without the Free-plan cap</strong> — track your progress as you improve</li>
  <li><strong>Full essay feedback</strong> — line-by-line suggestions across 6 scoring dimensions</li>
  <li><strong>Complete school list</strong> — admission odds at every target school, not just 3</li>
</ul>
<p style="margin: 0 0 12px 0;">The difference isn't talent — it's visibility. You can't fix gaps you can't see.</p>
<p style="margin: 0;">Pro is $19.99/month and can be canceled anytime.</p>`,
      cta: { label: "View monthly Pro", href: `${APP_URL}/billing` },
    }),
  });
}

/**
 * Day 14: Deadline urgency + upgrade.
 * "Your application deadline is X days away."
 */
export async function sendDay14DeadlineUrgencyEmail(
  to: string,
  firstName: string,
  daysUntilDeadline?: number,
) {
  const resend = getResendClient();
  const deadlineText = daysUntilDeadline && daysUntilDeadline > 0
    ? `Your earliest application deadline is <strong>${daysUntilDeadline} days away</strong>.`
    : `Early Action deadlines are approaching fast — most fall between October and January.`;

  return resend.emails.send({
    from: FROM,
    to,
    subject: daysUntilDeadline
      ? `${firstName}, ${daysUntilDeadline} days until your deadline`
      : `${firstName}, application deadlines are closer than you think`,
    html: renderEmail({
      heading: `${firstName}, the clock is ticking.`,
      intro: `<p style="margin: 0 0 12px 0;">${deadlineText}</p>
<p style="margin: 0 0 12px 0;">Here's what you still need to do:</p>
<ul style="margin: 0 0 16px 0; padding-left: 20px; line-height: 1.8;">
  <li>Score and revise every essay (Common App + supplementals)</li>
  <li>Re-run your profile analysis after each improvement</li>
  <li>Finalize your college list with reach/target/safety balance</li>
  <li>Track recommendation letters and transcripts</li>
</ul>
<p style="margin: 0 0 12px 0;">Students on the Free plan are limited to 5 analyses and 5 essay reviews. If you're applying to multiple schools with drafts, you'll likely hit those limits.</p>
<p style="margin: 0;">Pro ($19.99/mo) removes the Free-plan feature caps for the current paid tools, subject to service availability and abuse safeguards.</p>`,
      cta: { label: "Upgrade to Pro", href: `${APP_URL}/pricing` },
    }),
  });
}

/**
 * After free limit hit: direct upgrade email.
 * Triggered when a user exhausts their free analyses/essays.
 */
export async function sendLimitExhaustedEmail(
  to: string,
  firstName: string,
  feature: "analyses" | "essays" | "chat",
) {
  const resend = getResendClient();
  const featureLabels: Record<string, { name: string; limit: string; value: string }> = {
    analyses: { name: "profile analyses", limit: "5", value: "Each run can help you identify the next part of your profile to revisit" },
    essays: { name: "essay reviews", limit: "5", value: "You can use each review to revise voice, specificity, and structure" },
    chat: { name: "counselor messages", limit: "5", value: "The AI counselor can discuss college-list strategy, essay brainstorming, and planning questions" },
  };
  const f = featureLabels[feature];

  return resend.emails.send({
    from: FROM,
    to,
    subject: `${firstName}, you've used all ${f.limit} free ${f.name}`,
    html: renderEmail({
      heading: `${firstName}, you've used all ${f.limit} free ${f.name}.`,
      intro: `<p style="margin: 0 0 12px 0;">${f.value}.</p>
<p style="margin: 0 0 12px 0;">With Pro ($19.99/month), the Free-plan cap is removed for <strong>${f.name}</strong> and the other current Pro tools. Automated abuse controls and the Terms still apply.</p>
<p style="margin: 0;">Your progress is saved. Upgrade and pick up right where you left off.</p>`,
      cta: { label: "Upgrade to keep improving", href: `${APP_URL}/pricing` },
    }),
  });
}

// ---------------------------------------------------------------------------
// Student onboarding sequence (Day 2 / 4 / 7 / 14)
// ---------------------------------------------------------------------------

export async function sendOnboardingDay2Email(to: string, firstName: string) {
  const resend = getResendClient();
  return resend.emails.send({
    from: FROM,
    to,
    subject: "Your 7-dimension score is waiting",
    html: renderEmail({
      heading: `${firstName}, your scores are ready to calculate.`,
      intro: `<p style="margin: 0 0 12px 0;">AdmitPath evaluates your profile across seven dimensions that admissions officers actually weight:</p>
<ol style="margin: 0 0 12px 0; padding-left: 20px; line-height: 1.7;">
  <li><strong>Academic Rigor</strong> — course load, GPA trend, test scores</li>
  <li><strong>Leadership</strong> — initiative and impact, not just titles</li>
  <li><strong>Awards</strong> — regional, national, international recognition</li>
  <li><strong>Activity Depth</strong> — sustained commitment vs. résumé padding</li>
  <li><strong>Spike</strong> — a standout area that makes you memorable</li>
  <li><strong>Essay Quality</strong> — voice, insight, specificity</li>
  <li><strong>Recommendations</strong> — strength of teacher/counselor advocacy</li>
</ol>
<p style="margin: 0;">Complete your profile and we'll score each dimension 0–100, calibrated against real admissions outcomes — no grade inflation.</p>`,
      cta: { label: "See your scores", href: `${APP_URL}/analyze` },
    }),
  });
}

export async function sendOnboardingDay4Email(to: string, firstName: string) {
  const resend = getResendClient();
  return resend.emails.send({
    from: FROM,
    to,
    subject: "The essay that changes everything",
    html: renderEmail({
      heading: `${firstName}, your essay is the highest-leverage piece of your application.`,
      intro: `<p style="margin: 0 0 12px 0;">GPA and test scores are fixed by the time you apply. Your essay is the one component you can still dramatically improve — and it's the part admissions readers remember.</p>
<p style="margin: 0 0 12px 0;">AdmitPath scores essays on a 4-axis voice rubric:</p>
<ul style="margin: 0 0 12px 0; padding-left: 20px; line-height: 1.7;">
  <li><strong>Place</strong> — Does the reader feel grounded in a specific setting?</li>
  <li><strong>Detail</strong> — Are you showing concrete moments, not abstract claims?</li>
  <li><strong>Vulnerability</strong> — Are you honest about doubt, failure, or growth?</li>
  <li><strong>Surprise</strong> — Does the essay reveal something unexpected about you?</li>
</ul>
<p style="margin: 0;">Upload a draft and get line-by-line feedback in under a minute.</p>`,
      cta: { label: "Get essay feedback", href: `${APP_URL}/essays` },
    }),
  });
}

export async function sendOnboardingDay7Email(to: string, firstName: string) {
  const resend = getResendClient();
  return resend.emails.send({
    from: FROM,
    to,
    subject: "Your school list needs balance",
    html: renderEmail({
      heading: `${firstName}, a balanced college list is your safety net.`,
      intro: `<p style="margin: 0 0 12px 0;">Most students either aim too high (all reaches) or play it too safe. AdmitPath organizes your list into four bands based on your actual admit probability:</p>
<ul style="margin: 0 0 12px 0; padding-left: 20px; line-height: 1.7;">
  <li><strong>Very Likely</strong> (>70%) — schools where your profile is well above the median admit</li>
  <li><strong>Possible</strong> (40–70%) — solid fits where you're competitive</li>
  <li><strong>Long Shot</strong> (15–40%) — aspirational but realistic with a strong application</li>
  <li><strong>Hail Mary</strong> (<15%) — dream schools worth a shot, but don't bank on them</li>
</ul>
<p style="margin: 0 0 12px 0;">Common mistakes we see: listing 8 Hail Marys and 1 safety, ignoring financial fit, or choosing schools based on prestige instead of actual program strength.</p>
<p style="margin: 0;">Build a balanced list using real Common Data Set admit rates — not marketing brochures.</p>`,
      cta: { label: "Build your list", href: `${APP_URL}/colleges` },
    }),
  });
}

export async function sendOnboardingDay14Email(to: string, firstName: string) {
  const resend = getResendClient();
  return resend.emails.send({
    from: FROM,
    to,
    subject: "What AdmitPath Pro includes",
    html: renderEmail({
      heading: `${firstName}, here is what Pro includes.`,
      intro: `<p style="margin: 0 0 12px 0;">AdmitPath Pro is $19.99/month and removes the Free-plan usage caps.</p>
<ul style="margin: 0 0 12px 0; padding-left: 20px; line-height: 1.7;">
  <li>7-dimension profile analyses without the Free-plan cap of 5</li>
  <li>Essay feedback without the Free-plan cap of 5</li>
  <li>Full college match list with real admit-rate data</li>
  <li>AI counselor chat for strategy questions</li>
  <li>30/60/90-day action plans</li>
</ul>
<p style="margin: 0 0 12px 0;">What it doesn't replace: a human counselor who knows you personally. If you have access to one, use both.</p>
<p style="margin: 0;">We built AdmitPath so the quality of your college guidance doesn't depend on your family's income.</p>`,
      cta: { label: "See plans", href: `${APP_URL}/pricing` },
    }),
  });
}

// ---------------------------------------------------------------------------
// Parent-focused sequence (Intro / Financial / Decision)
// ---------------------------------------------------------------------------

export async function sendParentIntroEmail(
  to: string,
  parentName: string,
  studentName: string
) {
  const resend = getResendClient();
  return resend.emails.send({
    from: FROM,
    to,
    subject: `How AdmitPath helps ${studentName}`,
    html: renderEmail({
      heading: `${parentName}, here's how AdmitPath works.`,
      intro: `<p style="margin: 0 0 12px 0;">AdmitPath is a college counseling tool that helps ${studentName} build a stronger application. Here's what it does in plain language:</p>
<ul style="margin: 0 0 12px 0; padding-left: 20px; line-height: 1.7;">
  <li><strong>Profile scoring</strong> — evaluates ${studentName}'s academics, activities, awards, and essays on the same criteria admissions officers use</li>
  <li><strong>College matching</strong> — suggests schools based on real admit-rate data from Common Data Sets (the official statistics colleges publish), not rankings or reputation</li>
  <li><strong>Essay feedback</strong> — reviews drafts and gives specific, actionable suggestions</li>
  <li><strong>Action plans</strong> — breaks the process into manageable steps with real deadlines</li>
</ul>
<p style="margin: 0 0 12px 0;">Everything is grounded in data. We use published admission statistics, not anecdotes or guesswork.</p>
<p style="margin: 0;">${studentName} can use the Free plan with no time limit. Pro removes the Free-plan caps for analyses and essay reviews.</p>`,
      cta: { label: "See how it works", href: `${APP_URL}/how-it-works` },
    }),
  });
}

export async function sendParentFinancialEmail(to: string, parentName: string) {
  const resend = getResendClient();
  return resend.emails.send({
    from: FROM,
    to,
    subject: "The financial aid conversation",
    html: renderEmail({
      heading: `${parentName}, sticker price isn't what you'll pay.`,
      intro: `<p style="margin: 0 0 12px 0;">The published cost of attendance at most private universities is $75,000–$90,000 per year. Almost nobody pays that number. The figure that matters is the <strong>net price</strong> — what your family actually owes after grants, scholarships, and aid.</p>
<p style="margin: 0 0 12px 0;">A few things worth knowing:</p>
<ul style="margin: 0 0 12px 0; padding-left: 20px; line-height: 1.7;">
  <li><strong>Need-blind admissions</strong> — some schools don't consider your ability to pay when making admit decisions</li>
  <li><strong>Meets-full-need</strong> — a smaller group of schools guarantees to cover 100% of demonstrated financial need (though their definition of "need" may differ from yours)</li>
  <li><strong>Net price calculators</strong> — every school is required to publish one; it gives a personalized estimate based on your income and assets</li>
</ul>
<p style="margin: 0;">Start with net price estimates early. A school that looks expensive at sticker price might be the most affordable option after aid.</p>`,
      cta: { label: "Estimate your cost", href: `${APP_URL}/net-price` },
    }),
  });
}

export async function sendParentDecisionEmail(
  to: string,
  parentName: string,
  studentName: string
) {
  const resend = getResendClient();
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Supporting ${studentName}'s decision`,
    html: renderEmail({
      heading: `${parentName}, this is ${studentName}'s call.`,
      intro: `<p style="margin: 0 0 12px 0;">When multiple acceptances arrive, the decision can feel overwhelming — for both of you. Here's what the research shows helps:</p>
<ul style="margin: 0 0 12px 0; padding-left: 20px; line-height: 1.7;">
  <li><strong>Ask questions, don't rank.</strong> "What excites you about this school?" is more useful than "I think you should pick X."</li>
  <li><strong>Separate prestige from fit.</strong> The "best" school is the one where ${studentName} will thrive academically, socially, and financially.</li>
  <li><strong>Compare offers side by side.</strong> Look at net cost, program strength, campus culture, and career outcomes — not just the name on the sweatshirt.</li>
  <li><strong>Set a budget together.</strong> Be honest about what your family can afford. Student debt affects the first decade after graduation.</li>
</ul>
<p style="margin: 0;">AdmitPath's decision comparison framework helps ${studentName} weigh these factors objectively.</p>`,
      cta: {
        label: "Compare offers",
        href: `${APP_URL}/college-decision-comparison-guide`,
      },
    }),
  });
}

// ---------------------------------------------------------------------------
// Viral growth drip sequence (Marketing PRD — proven formulas)
// ---------------------------------------------------------------------------

/**
 * Day 0: Welcome + first free score (engagement hook).
 * Already handled by sendWelcomeEmail above. This is the enhanced version
 * that emphasizes the free score as the immediate value proposition.
 */

/**
 * Day 1: "How'd you score? Here's what it means..."
 * Explains the scoring framework and creates urgency to act on gaps.
 */
export async function sendDay1ScoreExplainerEmail(
  to: string,
  firstName: string,
  overallScore?: number | null,
) {
  const resend = getResendClient();

  const scoreBlock = overallScore != null && Number.isFinite(overallScore)
    ? `<p style="margin: 0 0 16px 0;">You scored <strong style="color: #4A6FA5; font-size: 20px;">${Math.round(overallScore)}/100</strong>. Here's what that means:</p>
       <ul style="margin: 0 0 16px 0; padding-left: 20px; line-height: 1.8;">
         ${overallScore >= 90 ? '<li><strong>90+:</strong> Exceptional — your profile is competitive at T10 programs. Focus on maintaining and refining your narrative.</li>' : ''}
         ${overallScore >= 80 && overallScore < 90 ? '<li><strong>80–89:</strong> Strong — solidly competitive for T30 schools. Shore up remaining gaps to push into elite territory.</li>' : ''}
         ${overallScore >= 65 && overallScore < 80 ? '<li><strong>65–79:</strong> Developing — real promise but clear gaps. The students who improve fastest start closing their weakest dimension <em>this week</em>.</li>' : ''}
         ${overallScore < 65 ? '<li><strong>Below 65:</strong> Early stage — but every point you gain now compounds. You have maximum runway for improvement.</li>' : ''}
       </ul>`
    : `<p style="margin: 0 0 16px 0;">You haven't run your first score yet. Students who score early and iterate improve <strong>3x faster</strong> than those who wait.</p>`;

  return resend.emails.send({
    from: FROM,
    to,
    subject: overallScore
      ? `${firstName}, here's what your ${Math.round(overallScore)}/100 score means`
      : `${firstName}, your free score is waiting`,
    html: renderEmail({
      heading: `${firstName}, let's decode your score.`,
      intro: `${scoreBlock}
<p style="margin: 0 0 12px 0;">Your score breaks down across 7 dimensions that admissions officers actually weight. The gap between your strongest and weakest dimension is where the opportunity lives.</p>
<p style="margin: 0;">Re-analyzing weekly helps you spot improvement and catch new gaps as your profile evolves.</p>`,
      cta: {
        label: overallScore ? "See your full breakdown" : "Get your free score now",
        href: `${APP_URL}/analyze`,
      },
    }),
  });
}

/**
 * Day 3: Habit formation nudge — consistency matters.
 */
export async function sendDay3HabitEmail(to: string, firstName: string) {
  const resend = getResendClient();
  return resend.emails.send({
    from: FROM,
    to,
    subject: `${firstName}, 10 minutes this week could change your school list`,
    html: renderEmail({
      heading: `${firstName}, consistency beats intensity.`,
      intro: `<p style="margin: 0 0 12px 0;">The students who get the most from AdmitPath share one habit: they come back weekly.</p>
<ul style="margin: 0 0 16px 0; padding-left: 20px; line-height: 1.8;">
  <li>Re-analyze after adding a new activity or award — <strong>watch your score change</strong></li>
  <li>Score one essay draft per week — <strong>iteration is how great essays happen</strong></li>
  <li>Review your gap list — <strong>pick one action item and do it this week</strong></li>
</ul>
<p style="margin: 0 0 12px 0;">Even 10 minutes compounds over time. The students who improve aren't the smartest — they're the most consistent.</p>
<p style="margin: 0;">Your profile is saved. Pick up right where you left off.</p>`,
      cta: { label: "Run a quick check-in", href: `${APP_URL}/analyze` },
    }),
  });
}

/**
 * Day 7: "Ready to unlock your full roadmap? [Upgrade]"
 * Conversion nudge after a week of free usage.
 */
export async function sendDay7UpgradeEmail(to: string, firstName: string) {
  const resend = getResendClient();
  return resend.emails.send({
    from: FROM,
    to,
    subject: `${firstName}, ready to unlock your full roadmap?`,
    html: renderEmail({
      heading: `${firstName}, you've seen the preview. Here's the full picture.`,
      intro: `<p style="margin: 0 0 12px 0;">After a week on AdmitPath, you've seen how the 7-dimension scoring works. But the free tier only scratches the surface.</p>
<p style="margin: 0 0 12px 0;">With Pro ($19.99/mo), you unlock:</p>
<ul style="margin: 0 0 16px 0; padding-left: 20px; line-height: 1.8;">
  <li><strong>Profile analyses without the Free-plan cap</strong> — re-run as you improve</li>
  <li><strong>Essay feedback without the Free-plan cap</strong> — iterate across drafts</li>
  <li><strong>Full 30/90/365-day roadmaps</strong> — specific actions tied to your gaps</li>
  <li><strong>School-specific gap reports</strong> — see what each target school needs from you</li>
  <li><strong>Spike deep-dives</strong> — build the narrative that makes you memorable</li>
</ul>
<p style="margin: 0 0 12px 0;">The subscription is $19.99/month and can be managed from Billing.</p>
<p style="margin: 0;">Your progress transfers instantly. No setup needed.</p>`,
      cta: { label: "Unlock full access — $19.99/mo", href: `${APP_URL}/pricing` },
    }),
  });
}

/**
 * Day 14: "Your friend [Name] just scored [X]. Can you beat them?"
 * Competitive social proof to drive re-engagement.
 */
export async function sendDay14CompetitiveEmail(
  to: string,
  firstName: string,
  friendName?: string,
  friendScore?: number,
) {
  const resend = getResendClient();
  const friend = friendName || "A student in your area";
  const score = friendScore || 82;

  return resend.emails.send({
    from: FROM,
    to,
    subject: `${firstName}, ${friend} just scored ${score}/100. Can you beat them?`,
    html: renderEmail({
      heading: `${firstName}, the competition is heating up.`,
      intro: `<p style="margin: 0 0 12px 0;">${friend} just scored <strong style="color: #4A6FA5; font-size: 18px;">${score}/100</strong> on their AdmitPath profile analysis.</p>
<p style="margin: 0 0 12px 0;">Here's what the top scorers do differently:</p>
<ul style="margin: 0 0 16px 0; padding-left: 20px; line-height: 1.8;">
  <li>They run the analysis <strong>every week</strong> to track progress</li>
  <li>They focus on their <strong>weakest dimension first</strong> (highest ROI)</li>
  <li>They use essay feedback to push their <strong>essay score above 85</strong></li>
  <li>They build a <strong>balanced school list</strong> with data-backed reach/target/safety</li>
</ul>
<p style="margin: 0 0 12px 0;">Your profile is still saved. Run a fresh analysis and see if you can close the gap.</p>
<p style="margin: 0;">The students who improve the most treat this like training — consistent, data-driven, and focused on their weakest areas.</p>`,
      cta: { label: "Re-run your analysis", href: `${APP_URL}/analyze` },
    }),
  });
}

/**
 * Day 30: "You've run [X] analyses. Here's your improvement."
 * Milestone celebration + retention + upgrade nudge.
 */
export async function sendDay30MilestoneEmail(
  to: string,
  firstName: string,
  analysisCount: number,
  scoreImprovement: number,
  currentScore?: number | null,
) {
  const resend = getResendClient();
  const improved = scoreImprovement > 0;
  const scoreBlock = currentScore != null && Number.isFinite(currentScore)
    ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 16px 0;">
        <tr>
          <td style="background: ${improved ? "rgba(22,163,74,0.08)" : "rgba(74,111,165,0.08)"}; border: 1px solid ${improved ? "rgba(22,163,74,0.2)" : "rgba(74,111,165,0.15)"}; border-radius: 12px; padding: 16px 24px; text-align: center;">
            <span style="font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: ${improved ? "#16A34A" : "#4A6FA5"}; font-weight: 700;">30-Day Progress</span>
            <br />
            <span style="font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 36px; font-weight: 800; color: ${improved ? "#16A34A" : "#4A6FA5"}; line-height: 1.3;">${Math.round(currentScore)}</span>
            <span style="font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 14px; color: #8890A5;"> / 100</span>
            ${improved ? `<br /><span style="font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 13px; color: #16A34A; font-weight: 600;">+${Math.round(scoreImprovement)} points improvement</span>` : ""}
          </td>
        </tr>
      </table>`
    : "";

  return resend.emails.send({
    from: FROM,
    to,
    subject: improved
      ? `${firstName}, you improved +${Math.round(scoreImprovement)} points in 30 days!`
      : `${firstName}, your 30-day AdmitPath report`,
    html: renderEmail({
      heading: improved
        ? `${firstName}, you're making real progress.`
        : `${firstName}, your first month on AdmitPath.`,
      intro: `<p style="margin: 0 0 12px 0;">Here's your 30-day snapshot:</p>
${scoreBlock}
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 16px 0; border-collapse: collapse;">
  <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);">
    <td style="padding: 10px 0; font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 14px; color: #454B5E;">Analyses run</td>
    <td align="right" style="padding: 10px 0; font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 16px; font-weight: bold; color: #1B2030;">${analysisCount}</td>
  </tr>
  <tr>
    <td style="padding: 10px 0; font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 14px; color: #454B5E;">Score change</td>
    <td align="right" style="padding: 10px 0; font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 16px; font-weight: bold; color: ${improved ? "#16A34A" : "#4A6FA5"};">${improved ? "+" : ""}${Math.round(scoreImprovement)}</td>
  </tr>
</table>
${improved
  ? `<p style="margin: 0 0 12px 0;">Your consistency is paying off. Students who maintain this pace through application season see the strongest outcomes.</p>`
  : `<p style="margin: 0 0 12px 0;">The students who improve the most do one thing: they keep showing up. Even 10 minutes a week moves the needle.</p>`
}
<p style="margin: 0;">Keep the momentum going. Your next milestone is day 60.</p>`,
      cta: {
        label: improved ? "Keep the streak alive" : "Run your next analysis",
        href: `${APP_URL}/analyze`,
      },
    }),
  });
}

// ---------------------------------------------------------------------------
// Referral & growth emails
// ---------------------------------------------------------------------------

/**
 * Referral invite: sent when a user shares AdmitPath with a friend via email.
 */
export async function sendReferralInviteEmail(
  to: string,
  senderName: string,
  senderScore?: number | null,
) {
  const resend = getResendClient();
  const scoreTeaser = senderScore != null && Number.isFinite(senderScore)
    ? ` ${senderName} scored <strong>${Math.round(senderScore)}/100</strong> on their profile analysis.`
    : "";

  return resend.emails.send({
    from: FROM,
    to,
    subject: `${senderName} invited you to try AdmitPath`,
    html: renderEmail({
      heading: `${senderName} thinks you should try AdmitPath.`,
      intro: `<p style="margin: 0 0 12px 0;">${senderName} is using AdmitPath to build a stronger college application and thought you'd find it useful.${scoreTeaser}</p>
<p style="margin: 0 0 12px 0;">AdmitPath scores your profile across 7 dimensions that admissions officers actually weight — then gives you a specific action plan to improve.</p>
<ul style="margin: 0 0 16px 0; padding-left: 20px; line-height: 1.8;">
  <li><strong>7-dimension profile scoring</strong> calibrated against real admissions outcomes</li>
  <li><strong>Line-by-line essay feedback</strong> on voice, insight, and specificity</li>
  <li><strong>College matching</strong> using published Common Data Set admit rates</li>
  <li><strong>100% free to start</strong> — no time limit</li>
</ul>
<p style="margin: 0;">When you upgrade to Pro, both you and ${senderName} get a free month.</p>`,
      cta: { label: "Get your free score", href: `${APP_URL}/?ref=invite` },
    }),
  });
}

/**
 * Streak milestone: celebrate consecutive days of activity.
 */
export async function sendStreakMilestoneEmail(
  to: string,
  firstName: string,
  streakDays: number,
  currentScore?: number | null,
) {
  const resend = getResendClient();

  const milestoneLabel = streakDays >= 30 ? "30-day" : streakDays >= 14 ? "14-day" : "7-day";
  const encouragement = streakDays >= 30
    ? "A month of consistent work. The students who maintain this pace through application season see the strongest outcomes."
    : streakDays >= 14
      ? "Two weeks of showing up. You're building the kind of consistency that separates competitive applicants."
      : "A full week of engagement. You're already ahead of most students who sign up and never come back.";

  const scoreBlock = currentScore != null && Number.isFinite(currentScore)
    ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 16px 0;">
        <tr>
          <td style="background: rgba(22,163,74,0.08); border: 1px solid rgba(22,163,74,0.2); border-radius: 12px; padding: 16px 24px; text-align: center;">
            <span style="font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #16A34A; font-weight: 700;">${milestoneLabel} streak</span>
            <br />
            <span style="font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 36px; font-weight: 800; color: #16A34A; line-height: 1.3;">${streakDays}</span>
            <span style="font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 14px; color: #8890A5;"> days</span>
            <br />
            <span style="font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 13px; color: #454B5E;">Current score: ${Math.round(currentScore)}/100</span>
          </td>
        </tr>
      </table>`
    : "";

  return resend.emails.send({
    from: FROM,
    to,
    subject: `${firstName}, ${streakDays}-day streak! Keep the momentum.`,
    html: renderEmail({
      heading: `${firstName}, ${streakDays} days in a row.`,
      intro: `<p style="margin: 0 0 12px 0;">${encouragement}</p>
${scoreBlock}
<p style="margin: 0 0 12px 0;">Here's how to make the most of your next week:</p>
<ul style="margin: 0 0 16px 0; padding-left: 20px; line-height: 1.8;">
  <li>Re-run your analysis after any profile update — track the score change</li>
  <li>Score one essay draft — iteration is how great essays happen</li>
  <li>Review your weakest dimension and take one concrete action</li>
</ul>
<p style="margin: 0;">Consistency compounds. Keep going.</p>`,
      cta: { label: "Continue your streak", href: `${APP_URL}/dashboard` },
    }),
  });
}

/**
 * Inactivity re-engagement: sent when a user hasn't visited in 7+ days.
 */
export async function sendInactivityNudgeEmail(
  to: string,
  firstName: string,
  daysSinceLastVisit: number,
  currentScore?: number | null,
) {
  const resend = getResendClient();
  const scoreNote = currentScore != null && Number.isFinite(currentScore)
    ? ` Your last score was <strong>${Math.round(currentScore)}/100</strong> — let's see if we can push it higher.`
    : "";

  return resend.emails.send({
    from: FROM,
    to,
    subject: `${firstName}, it's been ${daysSinceLastVisit} days — your profile is waiting`,
    html: renderEmail({
      heading: `${firstName}, pick up where you left off.`,
      intro: `<p style="margin: 0 0 12px 0;">It's been ${daysSinceLastVisit} days since your last visit to AdmitPath.${scoreNote}</p>
<p style="margin: 0 0 12px 0;">Application deadlines don't wait. Even 10 minutes this week can move the needle:</p>
<ul style="margin: 0 0 16px 0; padding-left: 20px; line-height: 1.8;">
  <li>Re-run your profile analysis — see if anything changed</li>
  <li>Upload a new essay draft for feedback</li>
  <li>Check your college list for balance</li>
</ul>
<p style="margin: 0;">Your progress is saved. Nothing was lost.</p>`,
      cta: { label: "Jump back in", href: `${APP_URL}/dashboard` },
    }),
  });
}

// ---------------------------------------------------------------------------
// B2B school outreach emails
// ---------------------------------------------------------------------------

/**
 * Internal notification when a school submits an inquiry via /for-schools.
 * Sent to the team so they can follow up.
 */
export async function sendSchoolInquiryNotification(inquiry: {
  name: string;
  email: string;
  schoolName: string;
  role: string;
  studentCount: number;
  message: string;
}) {
  const resend = getResendClient();
  const safeName = escapeHtml(inquiry.name);
  const safeEmail = escapeHtml(inquiry.email);
  const safeSchool = escapeHtml(inquiry.schoolName);
  const safeRole = escapeHtml(inquiry.role);
  const safeMessage = escapeHtml(inquiry.message);
  const roleLabels: Record<string, string> = {
    counselor: "School Counselor",
    admin: "School Administrator",
    district_admin: "District Administrator",
    other: "Other",
  };

  return resend.emails.send({
    from: FROM,
    to: process.env.SCHOOL_INQUIRY_EMAIL ?? ALERT_EMAIL,
    subject: emailHeader(`[School Inquiry] ${inquiry.schoolName} - ${inquiry.name}`),
    html: renderEmail({
      heading: "New school inquiry",
      intro: `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 16px 0; border-collapse: collapse;">
  <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);"><td style="padding: 8px 0; font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 14px; color: #454B5E;">Name</td><td align="right" style="padding: 8px 0; font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 14px; font-weight: bold; color: #1B2030;">${safeName}</td></tr>
  <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);"><td style="padding: 8px 0; font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 14px; color: #454B5E;">Email</td><td align="right" style="padding: 8px 0; font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 14px; font-weight: bold; color: #1B2030;"><a href="mailto:${safeEmail}" style="color: #4A6FA5;">${safeEmail}</a></td></tr>
  <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);"><td style="padding: 8px 0; font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 14px; color: #454B5E;">School / District</td><td align="right" style="padding: 8px 0; font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 14px; font-weight: bold; color: #1B2030;">${safeSchool}</td></tr>
  <tr style="border-bottom: 1px solid rgba(0,0,0,0.06);"><td style="padding: 8px 0; font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 14px; color: #454B5E;">Role</td><td align="right" style="padding: 8px 0; font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 14px; font-weight: bold; color: #1B2030;">${roleLabels[inquiry.role] ?? safeRole}</td></tr>
  <tr><td style="padding: 8px 0; font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 14px; color: #454B5E;">Students</td><td align="right" style="padding: 8px 0; font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 14px; font-weight: bold; color: #1B2030;">${inquiry.studentCount > 0 ? inquiry.studentCount.toLocaleString() : "Not specified"}</td></tr>
</table>
${safeMessage ? `<p style="margin: 0; font-size: 14px; color: #454B5E;"><strong>Message:</strong> ${safeMessage}</p>` : ""}`,
      cta: {
        label: `Reply to ${safeName}`,
        href: `mailto:${inquiry.email}?subject=Re%3A%20AdmitPath%20for%20${encodeURIComponent(inquiry.schoolName)}`,
      },
    }),
  });
}

/**
 * Confirmation email sent to the person who submitted a school inquiry.
 * Acknowledges receipt and sets response-time expectations.
 */
export async function sendSchoolInquiryConfirmation(to: string, name: string) {
  const resend = getResendClient();
  const safeName = escapeHtml(name);
  return resend.emails.send({
    from: FROM,
    to,
    subject: "We received your inquiry — AdmitPath for Schools",
    html: renderEmail({
      heading: `${safeName}, we received your inquiry.`,
      intro: `<p style="margin: 0 0 12px 0;">Thank you for your interest in AdmitPath. We review each inquiry and follow up as availability allows.</p>
<p style="margin: 0 0 12px 0;">AdmitPath currently provides these student-facing tools:</p>
<ul style="margin: 0 0 16px 0; padding-left: 20px; line-height: 1.8;">
  <li><strong>Profile planning</strong> for academics, activities, goals, and college preferences</li>
  <li><strong>AI essay feedback</strong> on voice, insight, specificity, and structure</li>
  <li><strong>College-list and planning tools</strong> that use published admissions information</li>
</ul>
<p style="margin: 0 0 12px 0;">A counselor dashboard, roster import, district SSO, and contracted school plan are not generally available. Any evaluation requires an agreed scope and review of your privacy, security, accessibility, and procurement requirements.</p>
<p style="margin: 0;">If you have immediate questions, reply to this email or reach us at <a href="mailto:maestro.committee@gmail.com" style="color: #4A6FA5;">maestro.committee@gmail.com</a>.</p>`,
      cta: {
        label: "Learn more about AdmitPath for Schools",
        href: `${APP_URL}/for-schools`,
      },
    }),
  });
}

// ---------------------------------------------------------------------------
// Internal alerts
// ---------------------------------------------------------------------------

export async function sendGroqExhaustionAlert() {
  const resend = getResendClient();
  return resend.emails.send({
    from: FROM,
    to: ALERT_EMAIL,
    subject: "[ALERT] AdmitPath: All Groq keys exhausted",
    html: `<p>All GROQ_API_KEY_1..30 keys have failed with 401 or 429. Action required: rotate keys at console.groq.com and update Vercel env vars.</p><p>Time: ${new Date().toISOString()}</p>`,
  });
}
