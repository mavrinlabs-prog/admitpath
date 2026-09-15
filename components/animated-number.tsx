"use client";

import { useEffect, useState } from "react";
import { animate, useMotionValue } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  className?: string;
  /**
   * Whether to render the final value as initial text. Defaults to true so
   * SSR + non-JS users see the real number; the count-up only kicks in on
   * mount when JS hydrates.
   */
  ssrFallback?: boolean;
  /** Format the number with locale-specific thousands separators (e.g. 1,234). */
  formatted?: boolean;
  /** Suffix string appended after the number (e.g. "%", "+", "k"). */
  suffix?: string;
  /** Prefix string prepended before the number (e.g. "$"). */
  prefix?: string;
}

/**
 * Counts up from 0 to `value` over ~1.2s on mount with eased easing.
 * SSR-safe: renders the final number as initial text so it appears even
 * without JS — then transitions back to 0 and animates up once mounted.
 *
 * Honors prefers-reduced-motion: when the user opts out, snaps directly
 * to the final value with no animation.
 */
export function AnimatedNumber({
  value,
  duration = 1.2,
  className,
  ssrFallback = true,
  formatted = false,
  suffix = "",
  prefix = "",
}: AnimatedNumberProps) {
  // Defensive coercion: callers occasionally pass `unknown as number` (e.g.
  // pulling overallScore out of a Prisma JSON blob). NaN/undefined here would
  // throw inside framer-motion's `animate` call and trip the segment error
  // boundary — the user sees "Something went wrong here." Treat anything
  // non-finite as zero so the rest of the page still renders.
  const safe = Number.isFinite(value) ? (value as number) : 0;
  const motionValue = useMotionValue(safe);
  const [shown, setShown] = useState<number>(ssrFallback ? safe : 0);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setShown(safe);
      return;
    }

    motionValue.set(0);
    setShown(0);
    const controls = animate(motionValue, safe, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });
    const unsub = motionValue.on("change", (v) => setShown(Math.round(v)));
    return () => {
      controls.stop();
      unsub();
    };
  }, [safe, duration, motionValue]);

  const display = formatted ? shown.toLocaleString() : String(shown);
  return (
    <span className={className} aria-label={`${prefix}${display}${suffix}`}>
      {prefix}{display}{suffix}
    </span>
  );
}
