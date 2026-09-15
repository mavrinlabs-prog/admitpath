"use client";

import { useEffect } from "react";

/**
 * LenisProvider — smooth scroll provider.
 *
 * Skips initialisation entirely when the user has
 * `prefers-reduced-motion: reduce` set, preserving native scroll
 * behaviour. Also listens for live changes to the media query so that
 * toggling the OS setting mid-session takes immediate effect.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Defensive: SSR safety + missing-window guards. Lenis touches
    // document/window directly on construction. If anything in this chain
    // throws (e.g. a third-party script ate `requestAnimationFrame`, or the
    // user has reduce-motion + a Safari quirk), we'd otherwise bubble the
    // throw up through the React tree and trigger the segment error
    // boundary on whichever route the user happened to be on. The dashboard
    // is the longest page in the app, so it shows up there first.
    if (typeof window === "undefined") return;

    // Respect prefers-reduced-motion: skip Lenis entirely and let the
    // browser handle native scroll. This avoids fighting with OS-level
    // accessibility settings.
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    let lenis: any = null;
    let rafId = 0;

    async function initLenis() {
      try {
        const LenisModule = await import("lenis");
        const LenisClass = LenisModule.default || LenisModule;
        lenis = new LenisClass({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
        });
        const raf = (time: number) => {
          try {
            lenis?.raf(time);
          } catch (err) {
            console.error("[lenis-provider] raf failed (non-fatal):", err);
            return;
          }
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
      } catch (err) {
        console.error("[lenis-provider] init failed (non-fatal):", err);
      }
    }

    function destroyLenis() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      try { lenis?.destroy(); } catch { /* noop */ }
      lenis = null;
    }

    // Listen for live changes to the media query (user toggles the OS
    // setting while the page is open).
    function handleChange(e: MediaQueryListEvent) {
      if (e.matches) {
        destroyLenis();
      } else {
        initLenis();
      }
    }

    initLenis();
    mq.addEventListener("change", handleChange);

    return () => {
      mq.removeEventListener("change", handleChange);
      destroyLenis();
    };
  }, []);

  return <>{children}</>;
}
