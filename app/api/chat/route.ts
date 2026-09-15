import { NextResponse } from "next/server";
import { groqChatStream } from "@/lib/groq";
import { prisma, withRetry } from "@/lib/prisma";
import { checkFeatureAccess, accessDenialResponse } from "@/lib/trial";
import { requireUser, parseJsonBody } from "@/lib/api-helpers";
import { COUNSELOR_CHAT_RUNTIME_SYSTEM } from "@/lib/prompts/counselor-chat-runtime";
import { buildBoundedSystemPrompt, fitMessagesToProviderBudget, selectRecentMessages } from "@/lib/chat-budget";
import { buildCounselorProfileContext } from "@/lib/counselor-context";
import { COUNSELOR_PROVIDER_TIMEOUT_MS, createCounselorDeadline } from "@/lib/counselor-provider";
import { buildSchoolDataContext, detectSchoolsInMessages } from "@/lib/school-data-context";
import { searchSchoolInfo, formatSearchContext } from "@/lib/web-search";
import { sanitizeUserInput } from "@/lib/api-quality";
import { recordSuccess, recordFailure, recordResponseTime } from "@/lib/monitoring";
import { FreePlanLimitReachedError, freeUsageLimitBody, releaseFreeUsage, reserveFreeUsage } from "@/lib/free-usage";
import { buildCounselorFallbackReply } from "@/lib/counselor-fallback";
import { z } from "zod";

// `content: z.string().min(1)` — without the lower bound, an empty-string
// message would pass validation and burn a trial chat slot on a no-op AI call
// (the client already guards against this, but the server is the authority).
const chatSchema = z.preprocess((raw) => {
  if (!raw || typeof raw !== "object") return raw;
  const body = raw as Record<string, unknown>;
  if (typeof body.message === "string" && !Array.isArray(body.messages)) {
    return { messages: [{ role: "user", content: body.message }] };
  }
  return raw;
}, z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().trim().min(1).max(4000),
  })).min(1).max(40),
}));

// The full counselor persona lives in lib/prompts/counselor-chat.ts so it's
// editable in one place across surfaces (chat page, floating widget,
// onboarding follow-up). Current prompt = evidence-first college planning —
// brilliant older student voice, validate stress briefly, pivot to action,
// always end with EXACTLY ONE follow-up question.
const BASE_SYSTEM_PROMPT = COUNSELOR_CHAT_RUNTIME_SYSTEM;

export async function POST(req: Request) {
 let reservedUserId: string | null = null;
 try {
  const _monitorStart = Date.now();
  // Free accounts get five total messages; paid accounts do not use that quota.
  const authed = await requireUser();
  if ("response" in authed) {
    return authed.response;
  }
  const { userId, user } = authed;

  // Enforce chat limit: free users get 5 chat messages total
  const access = checkFeatureAccess(user ?? null, "chat");
  if (!access.allowed) {
    const { status, body } = accessDenialResponse(access);
    return NextResponse.json(body, { status });
  }

  const parsedBody = await parseJsonBody(req, chatSchema);
  if ("response" in parsedBody) return parsedBody.response;

  if (access.reason === "free") {
    try {
      await reserveFreeUsage(userId, "chat");
      reservedUserId = userId;
    } catch (error) {
      if (error instanceof FreePlanLimitReachedError) {
        return NextResponse.json(freeUsageLimitBody("chat"), { status: 429 });
      }
      console.error("[/api/chat] free-plan reservation failed:", error);
      return NextResponse.json(
        { error: "Could not verify your Free-plan usage. Please retry.", code: "USAGE_RESERVATION_FAILED" },
        { status: 503, headers: { "Retry-After": "15" } },
      );
    }
  }

  // Pull profile + latest analysis in parallel; both are non-fatal if missing.
  // withRetry handles Neon cold-start so context fetch doesn't fail on first load.
  let context = "";
  try {
    const [profile, latest] = await Promise.all([
      withRetry(() =>
        prisma.profile.findUnique({
          where: { userId },
          select: {
            gpa: true, weightedGpa: true, satScore: true, actScore: true,
            grade: true, intendedMajor: true, targetColleges: true, admissionsConcern: true,
          },
        }),
      ),
      withRetry(() =>
        prisma.analysis.findFirst({
          where: { userId, type: "admission", deletedAt: null },
          orderBy: { createdAt: "desc" },
          select: { result: true },
        }),
      ),
    ]);
    context = buildCounselorProfileContext({
      profile,
      latestAnalysis: latest,
      plan: user?.plan,
    });
  } catch (err) {
    console.error("[/api/chat]", { event: "context_fetch_failed", fatal: false, error: String(err), hasDbUrl: !!process.env.DATABASE_URL });
  }

  // Sanitize all user messages to prevent prompt injection. Only sanitize
  // user-role messages — assistant messages are our own output.
  const sanitizedMessages = selectRecentMessages(parsedBody.data.messages.map((m) => ({
    ...m,
    content: m.role === "user" ? sanitizeUserInput(m.content) : m.content,
  })));

  // Detect schools mentioned in user messages and inject real data so the
  // LLM grounds its advice in our database instead of hallucinating stats.
  const schoolContext = buildSchoolDataContext(sanitizedMessages);

  // For schools NOT in our database, run live web search to pull real-time
  // data (acceptance rates, student reviews, Reddit posts, blog articles).
  // This fires only when: (1) SERP_API_KEY is set, (2) unknown schools detected.
  let webSearchContext = "";
  const knownSlugs = detectSchoolsInMessages(sanitizedMessages);
  if (knownSlugs.length === 0) {
    const lastUserMsg = sanitizedMessages.filter(m => m.role === "user").pop();
    if (lastUserMsg) {
      const schoolPatterns = lastUserMsg.content.match(
        /\b(?:University\s+of\s+[A-Z][a-zA-Z\s]+|[A-Z][a-zA-Z]+\s+(?:University|College|Institute))\b/g
      );
      if (schoolPatterns && schoolPatterns.length > 0) {
        try {
          const searchResult = await searchSchoolInfo(schoolPatterns[0]);
          webSearchContext = formatSearchContext(searchResult);
        } catch {
          // Best effort — don't block the chat on search failure
        }
      }
    }
  }

  const systemPrompt = buildBoundedSystemPrompt(
    BASE_SYSTEM_PROMPT,
    [context, schoolContext, webSearchContext],
  );
  const providerMessages = fitMessagesToProviderBudget(systemPrompt, sanitizedMessages);

  // Raw newline-delimited UTF-8 text stream. SSE would also be valid but
  // costs us a ~5x byte-budget overhead per delta (data: prefix + double
  // newline framing) for no meaningful client-side win — the chat client
  // doesn't need event names or last-event-id replay. Plain text it is.
  const encoder = new TextEncoder();
  const isFreePlanRequest = access.reason === "free";
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let completed = false;
      let deliveredChars = 0;
      const deadline = createCounselorDeadline(COUNSELOR_PROVIDER_TIMEOUT_MS, req.signal);
      try {
        for await (const delta of groqChatStream([
          { role: "system", content: systemPrompt },
          ...providerMessages,
        ], { signal: deadline.signal })) {
          controller.enqueue(encoder.encode(delta));
          deliveredChars += delta.length;
        }
        completed = true;
        const durationMs = Date.now() - _monitorStart;
        recordSuccess("api/chat", durationMs);
        recordResponseTime("api/chat", durationMs);
      } catch (err) {
        const durationMs = Date.now() - _monitorStart;
        recordFailure("api/chat", durationMs, err instanceof Error ? err.message : String(err));
        console.error("[/api/chat] AI stream failed:", {
          event: "ai_failed",
          error: err instanceof Error ? err.message : String(err),
          timedOut: deadline.didTimeOut(),
          hasGroqKey1: !!process.env.GROQ_API_KEY_1,
          hasCerebrasKey: !!process.env.CEREBRAS_API_KEY,
          hasDbUrl: !!process.env.DATABASE_URL,
        });
        if (deliveredChars === 0 && !req.signal.aborted) {
          const fallback = buildCounselorFallbackReply(context, sanitizedMessages);
          controller.enqueue(encoder.encode(fallback));
          completed = true;
          recordSuccess("api/chat:fallback", durationMs);
          recordResponseTime("api/chat", durationMs);
        } else {
          if (isFreePlanRequest && reservedUserId) {
            try {
              await releaseFreeUsage(reservedUserId, "chat");
              reservedUserId = null;
            } catch (releaseError) {
              console.error("[/api/chat] free-plan reservation release failed:", releaseError);
            }
          }
          controller.error(err);
          return;
        }
      } finally {
        deadline.dispose();
      }

      // Persist AI generation for cross-app analytics
      if (completed) {
        try {
          await withRetry(() =>
            prisma.generation.create({
              data: {
                userId,
                app: "admitpath",
                type: "chat",
                payload: { messageCount: providerMessages.length } as object,
                createdAt: new Date(),
              },
            }),
          );
        } catch {
          // Non-fatal — chat already delivered to user
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
 } catch (outerErr) {
    if (reservedUserId) {
      try {
        await releaseFreeUsage(reservedUserId, "chat");
      } catch (releaseError) {
        console.error("[/api/chat] reservation cleanup failed:", releaseError);
      }
    }
    // Top-level guard: any unhandled throw (requireUser crash, cookie parsing
    // edge case, checkFeatureAccess null pointer) surfaces as structured JSON 503.
    console.error("[/api/chat] POST unhandled error:", {
      error: outerErr instanceof Error ? outerErr.message : String(outerErr),
      stack: outerErr instanceof Error ? outerErr.stack : undefined,
      hasGroqKey1: !!process.env.GROQ_API_KEY_1,
      hasCerebrasKey: !!process.env.CEREBRAS_API_KEY,
      hasDbUrl: !!process.env.DATABASE_URL,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Chat service temporarily unavailable. Please try again in 30s.", retryable: true },
      { status: 503, headers: { "Retry-After": "30" } },
    );
  }
}
