"use client";

import { useEffect, useRef } from "react";

/**
 * Invisible component that preloads Clerk's JS bundle when the user
 * hovers over sign-in/sign-up CTAs. This shaves ~200-400ms off the
 * Clerk widget paint on the sign-in and sign-up pages.
 *
 * Usage: wrap any CTA link group with <ClerkPreload>:
 *   <ClerkPreload>
 *     <Link href="/sign-in">Sign in</Link>
 *     <Link href="/sign-up">Sign up</Link>
 *   </ClerkPreload>
 *
 * On first hover of any child, fires a single prefetch of the Clerk
 * frontend API domain. After that, the <link rel="preconnect"> remains
 * in the DOM for subsequent navigations.
 */
export function ClerkPreload({ children }: { children: React.ReactNode }) {
  const fired = useRef(false);

  function preload() {
    if (fired.current) return;
    fired.current = true;

    const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
    if (!key.startsWith("pk_")) return;
    if (key.includes("placeholder")) return;

    // Extract the Clerk frontend API domain from the publishable key.
    // Format: pk_test_<base64(domain)> or pk_live_<base64(domain)>
    try {
      const b64 = key.replace(/^pk_(test|live)_/, "");
      if (!b64) return;
      const domain = atob(b64).replace(/\$$/, "");
      if (!domain || domain.includes("localhost") || domain.includes("example.com")) return;

      // Preconnect to Clerk's frontend API
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = `https://${domain}`;
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);

      // Also DNS-prefetch as fallback for browsers that queue preconnect
      const dns = document.createElement("link");
      dns.rel = "dns-prefetch";
      dns.href = `https://${domain}`;
      document.head.appendChild(dns);
    } catch {
      // Non-fatal — Clerk will still load normally on navigation
    }
  }

  return (
    <span onMouseEnter={preload} onFocus={preload} style={{ display: "contents" }}>
      {children}
    </span>
  );
}
