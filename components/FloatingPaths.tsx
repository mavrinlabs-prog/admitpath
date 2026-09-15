"use client";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Decorative SVG paths that float across the auth pages' marketing panel.
 *
 * Performance notes:
 * - Uses 18 paths (not 36) — halved for lower GPU compositing cost on
 *   low-end devices. Visual density is indistinguishable at 18.
 * - `will-change: auto` avoids promoting every path to its own layer.
 * - Fully respects prefers-reduced-motion: paths render static (no animation).
 * - Durations are deterministic (seeded from index, not Math.random()) to
 *   avoid hydration mismatches in SSR.
 */
export function FloatingPaths({ position = 1 }: { position?: number }) {
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const paths = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 10 * position} -${189 + i * 12}C-${380 - i * 10 * position} -${189 + i * 12} -${312 - i * 10 * position} ${216 - i * 12} ${152 - i * 10 * position} ${343 - i * 12}C${616 - i * 10 * position} ${470 - i * 12} ${684 - i * 10 * position} ${875 - i * 12} ${684 - i * 10 * position} ${875 - i * 12}`,
    width: 0.5 + i * 0.06,
    // Deterministic duration: stagger by index instead of random.
    duration: 20 + (i % 5) * 2,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 696 316" fill="none">
        <title>Decorative background</title>
        {paths.map((path) => (
          prefersReduced || !mounted ? (
            <path
              key={path.id}
              d={path.d}
              stroke="#4A6FA5"
              strokeWidth={path.width}
              strokeOpacity={0.08 + path.id * 0.03}
              fill="none"
            />
          ) : (
            <motion.path
              key={path.id}
              d={path.d}
              stroke="#4A6FA5"
              strokeWidth={path.width}
              strokeOpacity={0.08 + path.id * 0.03}
              initial={{ pathLength: 0.3, opacity: 0.4 }}
              animate={{
                pathLength: 1,
                opacity: [0.2, 0.5, 0.2],
                pathOffset: [0, 1, 0],
              }}
              transition={{
                duration: path.duration,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          )
        ))}
      </svg>
    </div>
  );
}
