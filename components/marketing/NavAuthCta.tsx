"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Exactly one auth CTA: "Get started" (account creation) for visitors,
 * "Dashboard" for signed-in users. Reads /api/auth/status so static
 * marketing pages stay cacheable.
 */
export function NavAuthCta({ className = "dl-btn dl-btn-primary dl-btn-sm" }: { className?: string }) {
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/status", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { userId?: string | null } | null) => {
        if (!cancelled) setSignedIn(Boolean(data?.userId));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);
  return (
    <Link href={signedIn ? "/dashboard" : "/sign-up"} prefetch={false} className={className}>
      {signedIn ? "Dashboard" : "Get started"}
    </Link>
  );
}
