"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Children, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  className?: string;
  threshold?: number;
}

export function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  className,
  threshold = 0.15,
}: ScrollRevealProps) {
  const prefersReduced = useReducedMotion();

  // When the user prefers reduced motion, skip transform animations
  // entirely and just render children visible immediately.
  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  const variants = {
    hidden: {
      opacity: 1,
      y: direction === "up" ? 28 : 0,
      x: direction === "left" ? -28 : direction === "right" ? 28 : 0,
    },
    visible: { opacity: 1, y: 0, x: 0 },
  };

  // Render visible first. The transform transition is decorative and must
  // never leave content hidden if viewport observation is unavailable.
  return (
    <motion.div
      className={className}
      initial={false}
      animate="visible"
      variants={variants}
      transition={{ duration: 0.45, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerMs?: number;
  threshold?: number;
}

export function StaggerContainer({
  children,
  className,
  staggerMs = 80,
  threshold = 0.15,
}: StaggerContainerProps) {
  const prefersReduced = useReducedMotion();

  // Skip stagger animations for reduced-motion users
  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: staggerMs / 1000 },
    },
  };

  const item = {
    hidden: { opacity: 1, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
  };

  return (
    <motion.div
      className={className}
      initial={false}
      animate="visible"
      variants={container}
    >
      {Children.toArray(children).map((child, i) => (
        <motion.div key={i} variants={item}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
