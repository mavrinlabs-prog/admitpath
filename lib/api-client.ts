// Client-side fetch helper that normalizes auth/paywall/rate-limit errors.
// Use from "use client" components only.

export type ApiError = {
  status: number;
  message: string;
  upgrade?: string;
  feature?: string;
  isAuth: boolean;
  isPaywall: boolean;
  isRateLimited: boolean;
  isNetwork: boolean;
  isServerError: boolean;
};

type ApiErrorBody = {
  error?: string | { message?: string };
  message?: string;
  upgrade?: string;
  upgradeUrl?: string;
  feature?: string;
  reason?: string;
};

export function apiErrorMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object") return fallback;
  const payload = body as ApiErrorBody;
  const error = payload.error;
  if (typeof error === "string" && error.trim()) return error;
  if (error && typeof error === "object" && typeof error.message === "string" && error.message.trim()) {
    return error.message;
  }
  if (typeof payload.message === "string" && payload.message.trim()) return payload.message;
  return fallback;
}

function makeErr(partial: Partial<ApiError> & { status: number; message: string }): ApiError {
  return {
    status: partial.status,
    message: partial.message,
    upgrade: partial.upgrade,
    feature: partial.feature,
    isAuth: partial.status === 401,
    isPaywall: partial.status === 403,
    isRateLimited: partial.status === 429,
    isNetwork: partial.status === 0,
    isServerError: partial.status >= 500 && partial.status < 600,
  };
}

/**
 * Fetch JSON with consistent handling of 401 (auth), 403 (paywall), 429 (rate
 * limit) and network errors. Resolves to the parsed body on 2xx, throws an
 * ApiError otherwise. Callers can branch on err.isAuth/isPaywall/isRateLimited.
 */
export async function apiFetch<T = unknown>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  // GET requests are idempotent — a single retry on 5xx (or a network blip)
  // catches transient platform hiccups (DB cold-start, edge restart) before
  // they surface as a hard error to the user. Mutations (POST/PATCH/PUT/DELETE)
  // are NOT retried — re-running could double-bill, double-create, etc.
  const method = (init?.method ?? "GET").toUpperCase();
  const isIdempotent = method === "GET" || method === "HEAD";

  const attempt = async (): Promise<{ res: Response | null; netErr: boolean }> => {
    try {
      const res = await fetch(input, init);
      return { res, netErr: false };
    } catch {
      return { res: null, netErr: true };
    }
  };

  let { res, netErr } = await attempt();
  if (isIdempotent && (netErr || (res && res.status >= 500 && res.status < 600))) {
    await new Promise((r) => setTimeout(r, 800));
    ({ res, netErr } = await attempt());
  }

  if (netErr || !res) {
    throw makeErr({
      status: 0,
      message: "Network error — check your connection and try again.",
    });
  }

  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    // non-JSON body — leave null
  }

  if (res.ok) return body as T;

  const errBody = (body ?? {}) as ApiErrorBody;

  // Build a user-friendly message for common error codes
  let message = apiErrorMessage(errBody, `Request failed (${res.status})`);
  if (res.status === 429 && message === `Request failed (${res.status})`) {
    message = "You're doing that too fast. Please wait a moment and try again.";
  }
  if (res.status >= 500 && message === `Request failed (${res.status})`) {
    message = "Our servers encountered an error. Your data is safe. Please try again in a moment.";
  }

  throw makeErr({
    status: res.status,
    message,
    upgrade: errBody.upgrade || errBody.upgradeUrl,
    feature: errBody.feature,
  });
}

/**
 * Default redirect on auth error: send the user to sign-in with a redirect_url
 * back to where they came from. Safe to call from any client component.
 *
 * If a session cookie exists, the user IS signed in and should never be
 * bounced to /sign-in (the API 401 was likely a transient DB/parsing error).
 * In that case we reload the page instead of redirecting.
 */
export function redirectToSignIn(): void {
  if (typeof window === "undefined") return;
  // Check for session cookie on the client side
  const hasCookie =
    document.cookie.includes("session_user=") ||
    document.cookie.includes("session=");
  if (hasCookie) {
    // User is signed in but the API couldn't verify -- retry by reloading
    window.location.reload();
    return;
  }
  const here = window.location.pathname + window.location.search;
  // Same open-redirect guard the sign-in page uses.
  const safe = here.startsWith("/") && !here.startsWith("//") ? here : "/dashboard";
  window.location.href = `/sign-in?redirect_url=${encodeURIComponent(safe)}`;
}

/**
 * Default redirect on paywall: prefer the server-supplied upgrade URL, fall
 * back to /pricing.
 */
export function redirectToUpgrade(err: ApiError): void {
  if (typeof window === "undefined") return;
  window.location.href = err.upgrade || "/pricing";
}

export function isApiError(e: unknown): e is ApiError {
  return (
    typeof e === "object" &&
    e !== null &&
    "isAuth" in e &&
    "isPaywall" in e &&
    "isRateLimited" in e
  );
}
