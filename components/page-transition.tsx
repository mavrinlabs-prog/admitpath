"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * Lightweight page transition wrapper. Fades + nudges children up when the
 * pathname changes. Cheap (10px / 200ms) so it reads as polish, not theatre.
 *
 * Wraps the children server tree on the client side via a pathname key --
 * works inside layouts without owning routing.
 *
 * Honors prefers-reduced-motion: if the user has opted out of animations,
 * the transition snaps immediately (no fade, no slide) to prevent nausea
 * or disorientation. This is a WCAG 2.1 Level AAA requirement.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (reducedMotion) {
    // No animation wrapper at all -- prevents layout shift from AnimatePresence
    return <div key={pathname}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
