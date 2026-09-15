"use client";

/**
 * Clerk compatibility layer — Clerk has been removed.
 * These components now pass through or hide children unconditionally.
 * Once all callers are migrated to Google OAuth session checks,
 * this file can be deleted.
 */

/** Always false — Clerk is removed. */
export function isClerkAvailable(): boolean {
  return false;
}

/**
 * Renders nothing. Since Clerk is removed and Google OAuth session state
 * is not wired in yet, treat all visitors as signed-out.
 * TODO: Replace with Google OAuth session check.
 */
export function SafeSignedIn({ children }: { children: React.ReactNode }) {
  return null;
}

/**
 * Renders children unconditionally. Since Clerk is removed, treat all
 * visitors as signed-out for the purposes of conditional UI rendering.
 * TODO: Replace with Google OAuth session check.
 */
export function SafeSignedOut({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export { SafeSignedIn as ClerkSignedIn, SafeSignedOut as ClerkSignedOut };
