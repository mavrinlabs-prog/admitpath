"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * Wraps a block in a subtle parallax effect — the child element
 * scrolls slightly slower than the page, creating depth.
 *
 * `strength` controls intensity: 0.05 = very subtle, 0.15 = noticeable.
 */
export function ParallaxWrapper({
  children,
  className,
  strength = 0.08,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Map scroll progress [0,1] to a vertical shift range
  const y = useTransform(scrollYProgress, [0, 1], [strength * 100, -strength * 100]);

  return (
    <div ref={ref} className={className} style={{ overflow: "hidden" }}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}
