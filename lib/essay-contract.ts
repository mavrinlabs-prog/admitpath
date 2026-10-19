import { z } from "zod";

import { ESSAY_TYPE_VALUES } from "./essay-types";

const emptyOptionalString = (maxLength: number) =>
  z.preprocess(
    (value) => value === "" || value === null ? undefined : value,
    z.string().trim().max(maxLength).optional(),
  );

function normalizeEssaySubmission(raw: unknown): unknown {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return raw;

  const body = raw as Record<string, unknown>;
  return {
    ...body,
    content: body.content ?? body.essay ?? body.text ?? body.essayText,
  };
}

/**
 * Limits. Prompts were capped at 500 chars, which rejected real supplemental
 * prompts (several exceed 700 chars) and produced "/api/essay 400 Bad
 * Request". Drafts are saved more permissively than scored submissions so the
 * 3-second autosave (PATCH) never 400s while a student is still cutting words.
 */
export const ESSAY_LIMITS = {
  promptChars: 3000,
  contentChars: 12_000,
  draftPromptChars: 5000,
  draftContentChars: 60_000,
} as const;

/** Request keys must be opaque, URL-safe tokens (UUIDs from modern browsers, a
 * random fallback on older Safari that lacks crypto.randomUUID). */
const REQUEST_KEY_PATTERN = /^[A-Za-z0-9_-]{16,100}$/;

/** crypto.randomUUID is missing on Safari < 15.4 and on non-secure origins. */
export function newEssayRequestKey(): string {
  const c = (globalThis as { crypto?: Crypto }).crypto;
  if (c && typeof c.randomUUID === "function") return c.randomUUID();
  const bytes = new Uint8Array(16);
  if (c && typeof c.getRandomValues === "function") c.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export const essaySubmissionSchema = z.preprocess(
  normalizeEssaySubmission,
  z.object({
    essayId: emptyOptionalString(191),
    requestKey: z.preprocess(
      (value) => value === "" || value === null ? undefined : value,
      z.string().regex(REQUEST_KEY_PATTERN, "Request key is invalid. Refresh the page and try again.").optional().default(() => newEssayRequestKey()),
    ),
    prompt: z.string({ required_error: "Enter the essay prompt." })
      .trim()
      .min(1, "Enter the essay prompt.")
      .max(ESSAY_LIMITS.promptChars, "Essay prompt must be 3,000 characters or fewer."),
    content: z.string({ required_error: "Enter your essay." })
      .trim()
      .min(10, "Essay must be at least 10 characters.")
      .max(ESSAY_LIMITS.contentChars, "Essay must be 12,000 characters (about 2,000 words) or fewer. Trim it, then try again."),
    college: emptyOptionalString(200),
    essayType: z.preprocess(
      (value) => value === "" || value === null ? undefined : value,
      z.enum(ESSAY_TYPE_VALUES).optional(),
    ),
    wordLimit: z.preprocess(
      (value) => value === "" || value === null ? undefined : value,
      z.coerce.number()
        .int("Word limit must be a whole number.")
        .min(1, "Word limit must be at least 1.")
        .max(10_000, "Word limit must be 10,000 or fewer.")
        .optional(),
    ),
  }),
);

/** Lenient autosave contract: truncates instead of rejecting. */
export const essayDraftSchema = z.object({
  essayId: z.preprocess((v) => (v === "" || v === null ? undefined : v), z.string().max(191).optional()),
  prompt: z.preprocess((v) => (typeof v === "string" ? v.slice(0, ESSAY_LIMITS.draftPromptChars) : ""), z.string()),
  content: z.preprocess((v) => (typeof v === "string" ? v.slice(0, ESSAY_LIMITS.draftContentChars) : ""), z.string()),
  college: z.preprocess((v) => (typeof v === "string" && v.trim() ? v.trim().slice(0, 200) : undefined), z.string().optional()),
  essayType: z.preprocess(
    (v) => (typeof v === "string" && (ESSAY_TYPE_VALUES as readonly string[]).includes(v) ? v : undefined),
    z.enum(ESSAY_TYPE_VALUES).optional(),
  ),
});

export type EssaySubmission = z.infer<typeof essaySubmissionSchema>;
export type EssaySubmissionField = keyof z.input<typeof essaySubmissionSchema>;
export type EssayFieldErrors = Partial<Record<keyof EssaySubmission, string[]>>;

export type EssayReplayRecord = {
  content: string;
  essayId: string;
  feedback: unknown;
  essay: { userId: string };
};

export function getEssayReplayDecision(
  prior: EssayReplayRecord | null,
  userId: string,
  submission: Pick<EssaySubmission, "content" | "essayId">,
): "replay" | "conflict" | "none" {
  if (!prior) return "none";
  if (prior.essay.userId !== userId) return "conflict";

  const sameEssay = !submission.essayId || submission.essayId === prior.essayId;
  return sameEssay && submission.content === prior.content ? "replay" : "conflict";
}

export function isRequestKeyConflict(error: unknown): boolean {
  return (error as { code?: unknown } | null)?.code === "P2002";
}
