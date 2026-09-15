export const COUNSELOR_PROVIDER_TIMEOUT_MS = 25_000;
export const COUNSELOR_CLIENT_TIMEOUT_MS = 35_000;

export function createCounselorDeadline(
  timeoutMs: number,
  parentSignal?: AbortSignal,
) {
  const controller = new AbortController();
  let timedOut = false;

  const abortFromParent = () => {
    controller.abort(parentSignal?.reason ?? new DOMException("Request aborted", "AbortError"));
  };
  if (parentSignal?.aborted) abortFromParent();
  else parentSignal?.addEventListener("abort", abortFromParent, { once: true });

  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort(new DOMException(`Counselor request timed out after ${timeoutMs}ms`, "AbortError"));
  }, timeoutMs);

  return {
    signal: controller.signal,
    abort: () => controller.abort(new DOMException("Request aborted", "AbortError")),
    didTimeOut: () => timedOut,
    dispose: () => {
      clearTimeout(timer);
      parentSignal?.removeEventListener("abort", abortFromParent);
    },
  };
}

export function restoreFailedCounselorDraft(currentDraft: string, submittedText: string): string {
  if (!currentDraft.trim()) return submittedText;
  if (currentDraft.trim() === submittedText.trim()) return currentDraft;
  return `${submittedText}\n${currentDraft}`;
}

export function rollbackFailedCounselorTurn<T>(
  messages: T[],
  assistantAppended: boolean,
): T[] {
  const removeCount = assistantAppended ? 2 : 1;
  return messages.slice(0, Math.max(0, messages.length - removeCount));
}

export function buildSameOriginCounselorUrl(
  baseUrl: string,
  destination: string,
  fallbackPath: string,
): URL {
  const base = new URL(baseUrl);
  let target: URL;
  try {
    target = new URL(destination, base);
  } catch {
    return new URL(fallbackPath, base);
  }
  return target.origin === base.origin ? target : new URL(fallbackPath, base);
}
