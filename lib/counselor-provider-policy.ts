export type CounselorProviderFailureAction = "retry-key" | "fallback" | "fail";

type ProviderErrorShape = {
  status?: number;
  message?: string;
  code?: string;
  error?: { message?: string; code?: string; type?: string };
};

export function isOversizedProviderRequest(error: unknown): boolean {
  const providerError = error as ProviderErrorShape | null;
  if (providerError?.status === 413) return true;

  const detail = [
    providerError?.code,
    providerError?.message,
    providerError?.error?.code,
    providerError?.error?.message,
    providerError?.error?.type,
  ].filter(Boolean).join(" ").toLowerCase();
  return /context[_ -]?length|too many tokens|request too large|payload too large|maximum context/.test(detail);
}

export function counselorProviderFailureAction(
  error: unknown,
  state: { hasYielded: boolean; aborted: boolean },
): CounselorProviderFailureAction {
  if (state.aborted || state.hasYielded || isOversizedProviderRequest(error)) return "fail";

  const status = (error as ProviderErrorShape | null)?.status;
  if (status === 401 || status === 429) return "retry-key";
  if (status == null || status === 0 || status === 408 || status >= 500) return "fallback";
  return "fail";
}
