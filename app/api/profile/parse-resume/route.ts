import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { groqChat } from "@/lib/groq";
import { callWithJsonRetry } from "@/lib/json-repair";
import { rateLimitUserAndIp } from "@/lib/rate-limit";
import { requireUser, parseJsonBody } from "@/lib/api-helpers";
import { parseSessionCookieValue } from "@/lib/session-cookie";
import { RESUME_PARSER_SYSTEM, buildResumeParserPrompt } from "@/lib/prompts/resume-parser";
import { sanitizeUserInput, validateAIOutput, buildResponseMeta, buildNextSteps } from "@/lib/api-quality";
import {
  resumeExtractionSchema,
  resumeParseRequestSchema,
  buildLocalResumeFallback,
  auditResumeExtraction,
  type ResumeExtraction,
} from "@/lib/profile-contract";

export const maxDuration = 45;

const CACHE_TTL_MS = 10 * 60 * 1000;
const CACHE_MAX_ENTRIES = 500;
const PARSE_TIMEOUT_MS = 18_000;
const resumeCache = new Map<string, { value: ResumeExtraction; expiresAt: number }>();

function cacheKey(userId: string, text: string): string {
  return createHash("sha256").update(userId).update("\0").update(text).digest("hex");
}

function readCache(key: string): ResumeExtraction | null {
  const cached = resumeCache.get(key);
  if (!cached) return null;
  if (cached.expiresAt <= Date.now()) {
    resumeCache.delete(key);
    return null;
  }
  return cached.value;
}

function writeCache(key: string, value: ResumeExtraction): void {
  if (resumeCache.size >= CACHE_MAX_ENTRIES) {
    const oldest = resumeCache.keys().next().value;
    if (oldest) resumeCache.delete(oldest);
  }
  resumeCache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
}

async function withParseTimeout<T>(operation: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      operation,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("Resume parsing timed out")), PARSE_TIMEOUT_MS);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * Resume / transcript / brag-sheet text → structured profile fields.
 *
 * The user pastes raw text (their resume, transcript, Common App activities
 * export, brag sheet — anything). We send it to Cerebras with the parser
 * system prompt and return the structured extraction.
 *
 * Critical: this route does NOT write to the Profile model. It returns the
 * extraction so the UI can render a confirmation step ("here's what we
 * found — fix anything wrong before we save"). This is the ADMITPATH-001
 * fix: never trust an LLM extraction without human verification, because
 * AP scores get hallucinated about 8% of the time on transcript OCR.
 *
 * Rate-limited like analyze/essay since it's an LLM call. Same Free quota
 * as a profile analysis — pasting a resume is one of the most common
 * onboarding moves and should burn one of the 3 free analyses.
 */
export async function POST(req: Request) {
  const requestId = crypto.randomUUID();
  try {
    const authed = await requireUser();
    let userId: string;
    if ("response" in authed) {
      // DB might be cold — try to get userId from cookie directly
      try {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const session = cookieStore.get("session_user")?.value ?? cookieStore.get("session")?.value;
        if (session) {
          const parsed = parseSessionCookieValue(session);
          if (parsed?.id) {
            userId = parsed.id;
          } else {
            return authed.response;
          }
        } else {
          return authed.response;
        }
      } catch {
        return authed.response;
      }
    } else {
      userId = authed.userId;
    }

    // AI parsing must not bypass abuse controls when the limiter fails.
    let rl: { allowed: boolean };
    try {
      rl = await rateLimitUserAndIp(userId, req);
    } catch (rlErr) {
      console.error("[/api/profile/parse-resume] rate limiter unavailable:", rlErr instanceof Error ? rlErr.message : String(rlErr));
      return NextResponse.json(
        { error: "Request safety check is temporarily unavailable. Please try again shortly." },
        { status: 503, headers: { "Retry-After": "30" } },
      );
    }
    if (!rl.allowed) {
      return NextResponse.json({ error: "Too many requests. Please wait a minute and try again." }, {
        status: 429,
        headers: { "Retry-After": "60" },
      });
    }

    const parsedBody = await parseJsonBody(req, resumeParseRequestSchema, { includeDetails: true });
    if ("response" in parsedBody) return parsedBody.response;

    const { text: rawText } = parsedBody.data;

    // Sanitize the pasted resume text to prevent prompt injection
    const text = sanitizeUserInput(rawText);
    const key = cacheKey(userId, text);
    const cached = readCache(key);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "private, no-store",
          "X-Resume-Cache": "HIT",
          "X-Request-Id": requestId,
        },
      });
    }

    const startTime = Date.now();
    let extracted: unknown;
    try {
      extracted = await withParseTimeout(callWithJsonRetry<ResumeExtraction>(
        () => groqChat([
          { role: "system", content: RESUME_PARSER_SYSTEM },
          { role: "user", content: buildResumeParserPrompt(text) },
        ]),
        1,
        resumeExtractionSchema,
        "resume-parser",
      ));
    } catch (err) {
      console.error("[/api/profile/parse-resume] AI failed:", {
        event: "ai_failed",
        error: err instanceof Error ? err.message : String(err),
        hasGroqKey1: !!process.env.GROQ_API_KEY_1,
        hasCerebrasKey: !!process.env.CEREBRAS_API_KEY,
        hasDbUrl: !!process.env.DATABASE_URL,
      });
      extracted = buildLocalResumeFallback(text);
    }

    // Validate and normalize once before the editable preview receives it.
    const canonical = auditResumeExtraction(resumeExtractionSchema.parse(extracted), text);
    writeCache(key, canonical);
    const quality = validateAIOutput(canonical, {
      requiredFields: ["academic"],
      requiredArrays: ["activities", "courses"],
    });

    const nextSteps = buildNextSteps("resume-parse");
    const meta = buildResponseMeta({
      startTime,
      dataSources: [(canonical as ResumeExtraction & { _fallback?: unknown })._fallback ? "local resume extraction" : "resume-parser prompt"],
      confidenceLevel: quality.score >= 80 ? "high" : "medium",
      qualityScore: quality.score,
    });

    // No DB write here — the UI shows the extraction in a confirmation step
    // and the user clicks "save these to my profile" (which calls the
    // existing /api/profile POST). That's the ADMITPATH-001 trust-verify gate.
    return NextResponse.json({
      ...canonical,
      nextSteps,
      _meta: meta,
      _quality: quality.passed ? undefined : { issues: quality.issues },
    }, {
      headers: { "Cache-Control": "private, no-store", "X-Resume-Cache": "MISS", "X-Request-Id": requestId },
    });
  } catch (err) {
    // Top-level guard: any unhandled throw (DB connection failure in
    // requireUser, Upstash Redis timeout, unexpected null in response
    // construction) surfaces as a structured 503 instead of Next.js's
    // bare 500 with no body.
    console.error("[/api/profile/parse-resume] unhandled error:", {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      hasGroqKey1: !!process.env.GROQ_API_KEY_1,
      hasCerebrasKey: !!process.env.CEREBRAS_API_KEY,
      hasDbUrl: !!process.env.DATABASE_URL,
    });
    return NextResponse.json(
      { error: "Resume parsing service temporarily unavailable. Your draft is saved locally — retry in 30s.", retryable: true },
      { status: 503, headers: { "Retry-After": "30" } },
    );
  }
}
