import { routeLlmCall, type RouteOptions } from "./llm-router";

type EssayMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type EssayProvider = typeof routeLlmCall;

export class EssayProviderTimeoutError extends Error {
  constructor(message = "Essay providers timed out") {
    super(message);
    this.name = "EssayProviderTimeoutError";
  }
}

class EssayProviderAttemptTimeoutError extends Error {}

function withTimeout<T>(work: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new EssayProviderAttemptTimeoutError(`Provider timed out after ${timeoutMs}ms`)),
      timeoutMs,
    );
  });

  return Promise.race([work, timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

export async function callEssayProviderWithFallback(
  messages: EssayMessage[],
  options: RouteOptions,
  config: {
    provider?: EssayProvider;
    primaryTimeoutMs?: number;
    fallbackTimeoutMs?: number;
  } = {},
): Promise<string> {
  const provider = config.provider ?? routeLlmCall;
  const primaryTimeoutMs = config.primaryTimeoutMs ?? 16_000;
  const fallbackTimeoutMs = config.fallbackTimeoutMs ?? 8_000;

  let primaryError: unknown;
  try {
    const result = await withTimeout(provider(messages, options), primaryTimeoutMs);
    return result.text;
  } catch (error) {
    primaryError = error;
  }

  try {
    const result = await withTimeout(
      provider(messages, { ...options, minTier: 1, callerLabel: `${options.callerLabel ?? "essay"}-fallback` }),
      fallbackTimeoutMs,
    );
    return result.text;
  } catch (fallbackError) {
    if (
      primaryError instanceof EssayProviderAttemptTimeoutError ||
      fallbackError instanceof EssayProviderAttemptTimeoutError
    ) {
      throw new EssayProviderTimeoutError();
    }
    throw fallbackError;
  }
}
