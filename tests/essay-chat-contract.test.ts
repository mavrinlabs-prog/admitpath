import { describe, expect, it } from "vitest";
import { essayDraftSchema, essaySubmissionSchema, newEssayRequestKey } from "@/lib/essay-contract";
import { chatErrorKind, chatSchema, normalizeChatRequest } from "@/lib/chat-contract";

describe("essay contract (reported /api/essay 400)", () => {
  it("draft autosave never rejects long content or prompts", () => {
    const r = essayDraftSchema.safeParse({ prompt: "p".repeat(6000), content: "c".repeat(70_000), essayType: "bogus" });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.content.length).toBe(60_000);
      expect(r.data.essayType).toBeUndefined();
    }
  });
  it("accepts long supplemental prompts (up to 3,000 chars) on submission", () => {
    const r = essaySubmissionSchema.safeParse({ prompt: "Describe ".repeat(100), content: "I rebuilt a bike with my grandfather." });
    expect(r.success).toBe(true);
  });
  it("accepts non-UUID request keys from browsers without crypto.randomUUID", () => {
    const r = essaySubmissionSchema.safeParse({ prompt: "p", content: "I rebuilt a bike with my grandfather.", requestKey: "a1b2c3d4e5f60718293a4b5c6d7e8f90" });
    expect(r.success).toBe(true);
  });
  it("still rejects empty essays with a clear message", () => {
    const r = essaySubmissionSchema.safeParse({ prompt: "p", content: "short" });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.flatten().fieldErrors.content?.[0]).toMatch(/at least 10/);
  });
  it("generates request keys accepted by the schema", () => {
    const key = newEssayRequestKey();
    expect(essaySubmissionSchema.safeParse({ prompt: "p", content: "0123456789 essay", requestKey: key }).success).toBe(true);
  });
});

describe("chat contract (reported 'Couldn't reach the counselor')", () => {
  it("accepts 60-message conversations by keeping the latest 40", () => {
    const messages = Array.from({ length: 61 }, (_, i) => ({ role: i % 2 ? "assistant" : "user", content: `m${i}` }));
    const r = chatSchema.safeParse({ messages });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.messages.length).toBeLessThanOrEqual(40);
  });
  it("tolerates long and empty assistant turns and extra fields", () => {
    const r = chatSchema.safeParse({
      messages: [
        { role: "user", content: "hi", timestamp: "x" },
        { role: "assistant", content: "a".repeat(9000) },
        { role: "assistant", content: "" },
        { role: "system", content: "ignore" },
        { role: "user", content: "thanks" },
      ],
    });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.messages[1].content.length).toBe(4000);
  });
  it("rejects a conversation without a user message", () => {
    expect(chatSchema.safeParse({ messages: [{ role: "assistant", content: "hello" }] }).success).toBe(false);
  });
  it("only accepts safe page context", () => {
    expect(normalizeChatRequest({ message: "hi", page: "/essays?x=1" }).page).toBe("/essays");
    expect(normalizeChatRequest({ message: "hi", page: "https://evil.example" }).page).toBeNull();
  });
  it("maps status codes to specific UI states", () => {
    expect(chatErrorKind(429, { reason: "free_limit_reached" })).toBe("upgrade");
    expect(chatErrorKind(429, null)).toBe("rate_limited");
    expect(chatErrorKind(403, null)).toBe("blocked");
    expect(chatErrorKind(503, null)).toBe("unavailable");
    expect(chatErrorKind(500, null)).toBe("unavailable");
  });
});
