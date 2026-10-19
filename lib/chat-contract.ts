import { z } from "zod";

/**
 * Request contract for POST /api/chat.
 *
 * Production incident: "/chat: Couldn't reach the counselor." Reproduced
 * locally — the old schema 400'd (and the client rendered every non-2xx as
 * "couldn't reach") when:
 *   - the conversation passed 40 messages (20 exchanges),
 *   - any assistant reply exceeded 4,000 characters,
 *   - a stopped/empty assistant bubble was in history,
 *   - the client sent extra fields or a "system" role.
 * The server already trims history to the provider budget, so the contract
 * now normalizes instead of rejecting: keeps the most recent 40 non-empty
 * user/assistant turns, truncates each to 4,000 chars, and only fails when
 * there is no user message at all.
 */
export const CHAT_LIMITS = {
  maxMessages: 40,
  maxChars: 4000,
  maxPageChars: 80,
} as const;

export type NormalizedChatMessage = { role: "user" | "assistant"; content: string };

const PAGE_PATTERN = /^\/[a-z0-9/_-]{0,79}$/i;

export function normalizeChatRequest(raw: unknown): {
  messages: NormalizedChatMessage[];
  page: string | null;
} {
  if (!raw || typeof raw !== "object") return { messages: [], page: null };
  const body = raw as Record<string, unknown>;
  const source: unknown[] = Array.isArray(body.messages)
    ? body.messages
    : typeof body.message === "string"
      ? [{ role: "user", content: body.message }]
      : [];
  const messages = source
    .map((item): NormalizedChatMessage | null => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      if (record.role !== "user" && record.role !== "assistant") return null;
      if (typeof record.content !== "string") return null;
      const content = record.content.trim();
      if (!content) return null;
      return { role: record.role, content: content.slice(0, CHAT_LIMITS.maxChars) };
    })
    .filter((item): item is NormalizedChatMessage => item !== null)
    .slice(-CHAT_LIMITS.maxMessages);
  // A conversation must not start with an orphaned assistant turn.
  while (messages.length > 0 && messages[0].role === "assistant") messages.shift();
  const pageRaw = typeof body.page === "string" ? body.page.split("?")[0] : null;
  const page = pageRaw && PAGE_PATTERN.test(pageRaw) ? pageRaw : null;
  return { messages, page };
}

export const chatSchema = z.preprocess(
  normalizeChatRequest,
  z.object({
    messages: z.array(z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1).max(CHAT_LIMITS.maxChars),
    })).min(1, "Type a message to send.").max(CHAT_LIMITS.maxMessages)
      .refine((items) => items[items.length - 1]?.role === "user", "The last message must be from you."),
    page: z.string().nullable(),
  }),
);

/** Friendly copy for each failure class the chat UI can hit. */
export function chatErrorKind(status: number, body: { reason?: string; code?: string } | null):
  | "upgrade" | "rate_limited" | "auth" | "invalid" | "blocked" | "unavailable" {
  if (status === 401) return "auth";
  if (body?.reason === "free_limit_reached") return "upgrade";
  if (status === 429) return "rate_limited";
  if (status === 400) return "invalid";
  if (status === 403) return "blocked";
  return "unavailable";
}
