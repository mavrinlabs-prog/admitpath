/**
 * Drop-in replacement for `@clerk/nextjs/server`.
 * Clerk has been replaced with Google OAuth. This shim provides
 * compatible auth(), currentUser() functions that read from the
 * session cookie set by /api/auth/google/callback.
 */

import { cookies } from "next/headers";
import { parseSessionCookieValue, type SessionUser } from "@/lib/session-cookie";

type GoogleUser = SessionUser;

async function getSessionUser(): Promise<GoogleUser | null> {
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
 * Clerk-compatible auth() shim.
 */
export async function auth(): Promise<{ userId: string | null }> {
  const user = await getSessionUser();
  return { userId: user?.id ?? null };
}

/**
 * Clerk-compatible currentUser() shim.
 */
export async function currentUser(): Promise<{
  id: string;
  emailAddresses: Array<{ emailAddress: string }>;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  imageUrl: string;
  primaryEmailAddress?: { emailAddress: string };
} | null> {
  const user = await getSessionUser();
  if (!user) return null;
  const nameParts = (user.name || "").split(" ");
  return {
    id: user.id,
    emailAddresses: [{ emailAddress: user.email }],
    firstName: nameParts[0] || null,
    lastName: nameParts.slice(1).join(" ") || null,
    fullName: user.name || null,
    imageUrl: user.picture || "",
    primaryEmailAddress: { emailAddress: user.email },
  };
}

/**
 * clerkClient() shim — no-op since users are no longer managed in Clerk.
 */
export async function clerkClient() {
  return {
    users: {
      deleteUser: async (_id: string) => {},
      getUser: async (_id: string) => null,
    },
  };
}
