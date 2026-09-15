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

export const essaySubmissionSchema = z.preprocess(
  normalizeEssaySubmission,
  z.object({
    essayId: emptyOptionalString(191),
    requestKey: z.preprocess(
      (value) => value === "" || value === null ? undefined : value,
      z.string().uuid("Request key must be a UUID.").optional().default(() => crypto.randomUUID()),
    ),
    prompt: z.string({ required_error: "Enter the essay prompt." })
      .trim()
      .min(1, "Enter the essay prompt.")
      .max(500, "Essay prompt must be 500 characters or fewer."),
    content: z.string({ required_error: "Enter your essay." })
      .trim()
      .min(10, "Essay must be at least 10 characters.")
      .max(7000, "Essay must be 7,000 characters or fewer."),
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
