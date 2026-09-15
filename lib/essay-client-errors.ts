import type { EssayFieldErrors } from "./essay-contract";

export type EssayErrorBody = {
  error?: string;
  message?: string;
  reason?: string;
  fieldErrors?: EssayFieldErrors;
};

export function getEssaySubmissionError(status: number, body: EssayErrorBody): string {
  if (body.reason === "free_limit_reached") {
    return body.error ?? "You've used all Free-plan essay reviews. Upgrade to Pro to continue.";
  }
  if (status === 429) {
    return body.error ?? "Too many requests. Please wait a minute and try again.";
  }
  if (status === 403) {
    return body.error ?? "Upgrade to Pro to continue reviewing essays.";
  }
  if (status === 400) {
    return body.message ?? body.error ?? "Check the highlighted fields and try again.";
  }
  return body.error ?? "Feedback failed. Try again.";
}

export function firstEssayFieldError(
  fieldErrors: EssayFieldErrors,
  field: keyof EssayFieldErrors,
): string | undefined {
  return fieldErrors[field]?.[0];
}
