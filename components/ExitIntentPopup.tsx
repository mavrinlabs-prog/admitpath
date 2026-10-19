"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, AlertTriangle } from "lucide-react";
import { POPUP_STORAGE, readNumber, safeStorage, shouldShowPopup, writeValue } from "@/lib/popup-policy";

/**
 * ExitIntentPopup — captures leaving visitors with a high-conversion popup.
 *
 * Desktop: Detects mouse leaving the viewport (mouseleave on document).
 * Mobile: intentionally disabled; scroll gestures are too ambiguous.
 *
 * Trigger rules live in lib/popup-policy.ts (time on page AND scroll depth,
 * or desktop exit intent; once per session; once per 7 days; 30 days after a
 * dismissal; never for signed-in users or on auth/checkout/legal pages).
 * system glassmorphism overlay pattern.
 */
export function ExitIntentPopup({ signedIn = false }: { signedIn?: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (signedIn) return;
    const local = safeStorage("local");
    const session = safeStorage("session");
    const startedAt = Date.now();
    let maxScroll = 0;
    let decided = false;
    const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const evaluate = (exitIntent: boolean) => {
      if (decided) return;
      const decision = shouldShowPopup({
        pathname: window.location.pathname,
        signedIn,
        secondsOnPage: (Date.now() - startedAt) / 1000,
        scrollDepth: maxScroll,
        exitIntent,
        isDesktop,
        now: Date.now(),
        lastShownAt: readNumber(local, POPUP_STORAGE.lastShown),
        dismissedAt: readNumber(local, POPUP_STORAGE.dismissed),
        shownThisSession: readNumber(session, POPUP_STORAGE.session) !== null,
      });
      if (!decision.show) {
        if (["signed_in", "suppressed_page", "session_cap", "dismissed", "frequency_cap"].includes(decision.reason)) decided = true;
        return;
      }
      decided = true;
      writeValue(local, POPUP_STORAGE.lastShown, String(Date.now()));
      writeValue(session, POPUP_STORAGE.session, String(Date.now()));
      setShow(true);
    };

    function handleScroll() {
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      maxScroll = Math.max(maxScroll, window.scrollY / scrollable);
    }
    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY <= 5) evaluate(true);
    }

    evaluate(false); // resolves caps/suppression immediately; never shows on first paint
    window.addEventListener("scroll", handleScroll, { passive: true });
    if (isDesktop) document.addEventListener("mouseleave", handleMouseLeave);
    const interval = setInterval(() => evaluate(false), 5_000);
    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [signedIn]);

  const modalRef = useRef<HTMLDivElement>(null);

  const dismiss = useCallback(() => {
    writeValue(safeStorage("local"), POPUP_STORAGE.dismissed, String(Date.now()));
    setShow(false);
  }, []);

  // Focus trap + Escape key
  useEffect(() => {
    if (!show || !modalRef.current) return;

    const modal = modalRef.current;
    const focusable = modal.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first?.focus();

    function trapFocus(e: KeyboardEvent) {
      if (e.key === "Escape") {
        dismiss();
        return;
      }
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }

    document.addEventListener("keydown", trapFocus);
    return () => document.removeEventListener("keydown", trapFocus);
  }, [show, dismiss]);

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={dismiss}
            className="fixed inset-0 z-[200]"
            style={{
              background: "rgba(27, 32, 48, 0.55)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Get your free score before you go"
            ref={modalRef}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-[calc(100%-2rem)] max-w-lg rounded-3xl border p-6 sm:p-10"
            style={{
              background: "rgba(255, 255, 255, 0.92)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderColor: "rgba(0,0,0,0.06)",
              boxShadow:
                "0 32px 96px rgba(0,0,0,0.20), 0 8px 32px rgba(74,111,165,0.12)",
            }}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={dismiss}
              aria-label="Close"
              className="absolute top-4 right-4 rounded-full p-2 transition-colors hover:bg-black/5"
              style={{ color: "var(--dl-text-muted, #5A6275)" }}
            >
              <X className="h-5 w-5" />
            </button>

            {/* Icon */}
            <div
              className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{
                background: "linear-gradient(135deg, var(--dl-brand, #4A6FA5), var(--dl-brand-dark, #2E4A6E))",
              }}
            >
              <AlertTriangle className="h-7 w-7 text-white" strokeWidth={1.75} />
            </div>

            {/* Copy */}
            <h2
              className="text-center text-xl font-extrabold mb-2"
              style={{
                color: "var(--dl-text-primary, #1B2030)",
                letterSpacing: "-0.02em",
              }}
            >
              See where your application stands
            </h2>
            <p
              className="text-center text-sm mb-6"
              style={{ color: "var(--dl-text-secondary, #454B5E)", lineHeight: 1.6 }}
            >
              Students who know their weak spots early can focus on what matters most.
              See your 7-dimension score before you go &mdash; calibrated to real CDS data.
            </p>

            {/* Stats strip */}
            <div
              className="flex items-center justify-center gap-6 mb-6 py-3 rounded-xl"
              style={{ background: "rgba(74,111,165,0.06)" }}
            >
              {[
                { value: "102", label: "Schools' data" },
                { value: "7", label: "Score dimensions" },
                { value: "5 min", label: "To get scored" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p
                    className="text-sm font-extrabold"
                    style={{
                      color: "var(--dl-brand, #4A6FA5)",
                      fontFamily: "var(--dl-font-mono, monospace)",
                    }}
                  >
                    {s.value}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="/sign-up"
              onClick={dismiss}
              className="dl-btn dl-btn-primary dl-btn-lg w-full justify-center"
            >
              Get My Free Score <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>

            <p
              className="text-center text-xs mt-3"
              style={{ color: "var(--dl-text-muted, #5A6275)" }}
            >
              Takes 5 minutes. Calibrated to real CDS data.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
