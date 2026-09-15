"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";

/**
 * "Back to home" that respects auth state. Per owner email feedback (R34):
 * "If they say back to home it means back to dashboard, not home."
 *
 * Logic:
 * - Signed in → /dashboard
 * - Signed out → /
 *
 * Auth detection uses /api/me, the same account-state endpoint used by the
 * dashboard and paywall surfaces.
 *
 * Renders as a regular Next <Link> with whatever children/className the
 * caller passes — drop-in replacement for `<Link href="/">Back to home</Link>`.
 */
export function SmartHomeLink({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    // /api/me is the canonical auth-state endpoint (used by TrialChip,
    // dashboard, paywall logic). Returns authenticated:false when signed out
    // and a user payload when signed in. Cheaper than dynamically importing Clerk when
    // Clerk-key validity isn't guaranteed (demo mode).
    fetch("/api/me", { cache: "no-store" })
      .then(async (r) => {
        if (!mounted) return;
        if (!r.ok) {
          setIsSignedIn(false);
          return;
        }
        const data = (await r.json()) as { authenticated?: boolean };
        setIsSignedIn(data.authenticated !== false);
      })
      .catch(() => {
        if (mounted) setIsSignedIn(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // While the auth check is in flight, render the link with href="/" so
  // the static HTML is correct and crawlers see the marketing route. Once
  // we know the user is signed in we re-route to /dashboard.
  const href = isSignedIn === true ? "/dashboard" : "/";

  return (
    <Link
      href={href}
      className={className}
      style={style}
      // Prefetch the target route for instant navigation once resolved.
      prefetch={isSignedIn !== null}
    >
      {children}
    </Link>
  );
}
