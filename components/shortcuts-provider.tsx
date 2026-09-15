"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyboardShortcutsModal } from "./keyboard-shortcuts-modal";

/**
 * Global keyboard shortcuts:
 *   ?           — open shortcuts help modal
 *   g d/a/e/c/s/p — vim-style chord navigation
 *   Esc         — close any open modal/drawer/palette (delegated via event)
 *
 * Shortcuts are suppressed when the active element is INPUT, TEXTAREA, or
 * contentEditable so we never steal a keystroke from a typing user.
 */
function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  return false;
}

const G_ROUTES: Record<string, string> = {
  d: "/dashboard",
  a: "/analyze",
  e: "/essays",
  c: "/colleges",
  s: "/settings",
  p: "/profile/create",
};

export function ShortcutsProvider() {
  const router = useRouter();
  const [helpOpen, setHelpOpen] = useState(false);
  const gPendingRef = useRef(false);
  const gTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Always allow Escape to bubble. Listeners (palette, modals, drawers,
      // counselor) can handle their own Escape; we don't need to dispatch.
      if (isTypingTarget(e.target)) return;

      // `?` — open shortcuts modal (Shift+/ on US keyboards)
      if (e.key === "?" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setHelpOpen(true);
        return;
      }

      // chord: g + (d|a|e|c|s|p)
      if (gPendingRef.current) {
        const target = G_ROUTES[e.key.toLowerCase()];
        gPendingRef.current = false;
        if (gTimerRef.current) clearTimeout(gTimerRef.current);
        if (target) {
          e.preventDefault();
          router.push(target);
        }
        return;
      }

      if (e.key === "g" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        gPendingRef.current = true;
        if (gTimerRef.current) clearTimeout(gTimerRef.current);
        gTimerRef.current = setTimeout(() => {
          gPendingRef.current = false;
        }, 1200);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (gTimerRef.current) clearTimeout(gTimerRef.current);
    };
  }, [router]);

  return <KeyboardShortcutsModal open={helpOpen} onClose={() => setHelpOpen(false)} />;
}
