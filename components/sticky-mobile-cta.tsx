"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { ArrowRight, X } from "lucide-react";

/**
 * Sticky CTA bar — appears on landing page after user scrolls past the hero.
 * Shows on both mobile and desktop for signed-out users. Dismissible.
 */
export function StickyMobileCTA({ signedIn = false }: { signedIn?: boolean }) {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Show after ~600px of scroll (past the hero on most viewports)
          setShow(window.scrollY > 600);
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
  }, []);

  const visible = show && !dismissed && !signedIn;

  const bar = (
    <div
      aria-hidden={!visible}
      role="complementary"
      aria-label="Sign up prompt"
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-3 transition-transform duration-300"
      style={{
        transform: visible ? "translateY(0)" : "translateY(110%)",
        background: "linear-gradient(to top, rgba(213,220,232,1) 70%, rgba(213,220,232,0))",
        paddingBottom: "calc(1rem + env(safe-area-inset-bottom))",
        /* Prevent CTA from overlapping scrollable content — iOS Safari
           safe-area-inset-bottom already handles the home indicator bar */
      }}
    >
      {/* Desktop: centered card with max-width; mobile: full-width */}
      <div
        className="mx-auto max-w-lg flex items-center justify-between gap-3 rounded-2xl border px-4 py-3"
        style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)", boxShadow: "0 12px 32px rgba(0,0,0,0.12)" }}
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold leading-tight" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Analyze my profile free
          </p>
          <p className="text-[11px] truncate" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            Takes 5 minutes &middot; 102 schools&rsquo; data
          </p>
        </div>
        <Link href="/sign-up" className="dl-btn dl-btn-primary dl-btn-sm shrink-0 inline-flex items-center gap-1.5 text-sm" style={{ whiteSpace: "nowrap" }}>
          Start free <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="shrink-0 rounded-xl p-1.5 transition-colors hover:bg-black/5"
          style={{ color: "var(--dl-text-muted, #5A6275)", fontWeight: 600 }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return bar;
}
