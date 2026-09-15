import { cookies } from "next/headers";
import { parseSessionCookieValue, type SessionUser } from "@/lib/session-cookie";

export type GoogleUser = SessionUser;

/**
 * Get the currently authenticated Google user from the session cookie.
 * Returns null if no valid session exists.
 */
export async function getGoogleUser(): Promise<GoogleUser | null> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session_user") || cookieStore.get("session");
    if (!session?.value) return null;

    return parseSessionCookieValue(session.value);
  } catch {
    return null;
  }
}

/**
 * Check whether a session cookie exists (without fully parsing it).
 * Use this to avoid redirecting to /sign-in when the user IS signed in
 * but the cookie couldn't be fully parsed (e.g. DB timeout, malformed
 * JSON). If the raw cookie string is present, the user previously
 * completed sign-in and should never see the sign-in page again.
 */
export async function hasSessionCookie(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const raw =
      cookieStore.get("session_user")?.value ||
      cookieStore.get("session")?.value;
    return Boolean(raw);
  } catch {
    return false;
  }
}

/**
 * Clear the session cookie (sign out).
 * DISABLED: permanent session policy — this function is a no-op.
 * The session persists for 1 year (set at login).
 */
export async function clearSession() {
  // No-op: sign-out is disabled. Session persists permanently.
}
