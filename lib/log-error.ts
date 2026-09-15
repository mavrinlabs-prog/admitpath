/**
 * Structured error logger with PII redaction.
 *
 * Applies ONIX Error Handler pattern (Agent 6): detect, classify, log, prevent
 * propagation. Vercel Function Logs ingest stdout/stderr as JSON, giving
 * queryable observability without a third-party SDK.
 *
 * PII redaction is defense-in-depth: even if a developer accidentally logs
 * student-supplied text, PII won't persist in Vercel logs (COPPA/FERPA-relevant
 * for a college admissions tool handling minors' data).
 *
 * Usage:
 *   import { logError, logEvent } from "@/lib/log-error";
 *   catch (err) { logError("analyze:llm", err, { userId, tier: 2 }); }
 */

type ErrorContext = Record<string, string | number | boolean | null | undefined>;

/**
 * PII redaction — strips emails, phone numbers, SSNs, and student names
 * from log payloads before they hit stdout.
 */
function redactPII(value: unknown): unknown {
  if (typeof value !== "string") return value;
  return value
    // Email addresses
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[email-redacted]")
    // US phone numbers
    .replace(/(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, "[phone-redacted]")
    // SSN patterns
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[ssn-redacted]")
    // Student names after common labels (heuristic — better safe than sorry)
    .replace(/(?:student|name|child|kid|son|daughter|applicant):\s*[A-Z][a-z]+ [A-Z][a-z]+/gi, "[name-redacted]")
    // Clerk user IDs should stay (they're internal), but strip Stripe customer IDs from logs
    .replace(/cus_[a-zA-Z0-9]{14,}/g, "[stripe-customer-redacted]");
}

function redactContext(ctx?: ErrorContext): ErrorContext | undefined {
  if (!ctx) return ctx;
  const out: ErrorContext = {};
  for (const [k, v] of Object.entries(ctx)) {
    out[k] = redactPII(v) as string | number | boolean | null | undefined;
  }
  return out;
}

/**
 * Log a structured error. One line of JSON per error — easy to grep/jq
 * in Vercel dashboard. Keys are stable so alerts can key on them.
 */
export function logError(
  scope: string,
  err: unknown,
  context?: ErrorContext
): void {
  const message = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack : undefined;
  console.error(
    JSON.stringify({
      ts: Date.now(),
      level: "error",
      scope,
      message: redactPII(message),
      stack,
      ...redactContext(context),
    })
  );
}

/**
 * Log a structured info-level event. Used for observability without
 * third-party SDKs — generation quality scores, tier selection, etc.
 */
export function logEvent(
  event: string,
  props?: ErrorContext & { userId?: string }
): void {
  console.log(
    JSON.stringify({
      ts: Date.now(),
      level: "info",
      event,
      ...redactContext(props),
    })
  );
}

/**
 * Log a warning — not an error, but something that should be investigated.
 * e.g., quality score below threshold, Groq key pool shrinking.
 */
export function logWarn(
  scope: string,
  message: string,
  context?: ErrorContext
): void {
  console.warn(
    JSON.stringify({
      ts: Date.now(),
      level: "warn",
      scope,
      message: redactPII(message),
      ...redactContext(context),
    })
  );
}
