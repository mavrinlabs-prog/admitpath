/**
 * Drop-in replacement for `@clerk/nextjs` (client-side imports).
 * Clerk has been replaced with Google OAuth.
 */

"use client";

import { useEffect, useState, useCallback } from "react";

/**
 * useAuth() shim.
 */
export function useAuth(): { isSignedIn: boolean; userId: string | null } {
  const [state, setState] = useState<{ isSignedIn: boolean; userId: string | null }>({
    isSignedIn: false,
    userId: null,
  });

  useEffect(() => {
    fetch("/api/auth/status")
      .then((r) => (r.ok ? r.json() : { userId: null }))
      .then((data) => {
        setState({
          isSignedIn: !!data.userId,
          userId: data.userId ?? null,
        });
      })
      .catch(() => {
        setState({ isSignedIn: false, userId: null });
      });
  }, []);

  return state;
}

export function useUser() {
  const { isSignedIn, userId } = useAuth();
  return { isSignedIn, user: isSignedIn ? { id: userId } : null };
}

export function UserButton() {
  return null;
}

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

/**
 * SignedIn — renders children only when signed in.
 */
export function SignedIn({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useAuth();
  if (!isSignedIn) return null;
  return <>{children}</>;
}

/**
 * SignedOut — renders children only when signed out.
 */
export function SignedOut({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useAuth();
  // During initial load (before status check), show signed-out content
  if (isSignedIn) return null;
  return <>{children}</>;
}

/**
 * useClerk() shim -- provides signOut and other Clerk methods.
 */
/**
 * useClerk() shim -- signOut is a no-op (permanent session policy).
 */
export function useClerk() {
  const signOut = useCallback(async (_callback?: () => void) => {
    // No-op: sign-out is disabled. Session persists permanently.
  }, []);

  return { signOut };
}

export function SignIn() { return null; }
export function SignUp() { return null; }
