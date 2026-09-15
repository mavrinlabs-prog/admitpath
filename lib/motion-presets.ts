/**
 * Centralized framer-motion animation presets — Discovery Labs design system.
 *
 * Usage:
 *   import { fadeInUp, stagger } from "@/lib/motion-presets";
 *   <motion.div {...fadeInUp}>
 *   <motion.div variants={stagger(100)}>
 */
import type { Transition, Variants } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Easing curves                                                      */
/* ------------------------------------------------------------------ */

/** Material Design standard easing */
const ease = [0.4, 0, 0.2, 1] as const;
/** Deceleration — entering elements */
const easeOut = [0, 0, 0.2, 1] as const;
/** Acceleration — exiting elements */
const easeIn = [0.4, 0, 1, 1] as const;

/* ------------------------------------------------------------------ */
/*  Preset objects (spread directly onto <motion.*> elements)          */
/* ------------------------------------------------------------------ */

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3, ease: [...ease] },
} as const;

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.25, ease: [...easeOut] },
} as const;

export const slideInLeft = {
  initial: { opacity: 0, x: -24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -16 },
  transition: { duration: 0.3, ease: [...ease] },
} as const;

export const slideInRight = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 16 },
  transition: { duration: 0.3, ease: [...ease] },
} as const;

export const slideDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: { duration: 0.3, ease: [...ease] },
} as const;

export const scaleIn = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.25, ease: [...ease] },
} as const;

/* ------------------------------------------------------------------ */
/*  Stagger container variant                                          */
/* ------------------------------------------------------------------ */

/**
 * Returns a `variants` object for a staggered-children container.
 *
 * ```tsx
 * <motion.ul variants={stagger(80)} initial="hidden" animate="show">
 *   <motion.li variants={staggerChild}>…</motion.li>
 * </motion.ul>
 * ```
 */
export function stagger(staggerMs = 80): Variants {
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren: staggerMs / 1000,
      },
    },
  };
}

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [...ease] } },
};

/* ------------------------------------------------------------------ */
/*  Gesture helpers                                                    */
/* ------------------------------------------------------------------ */

export const cardHover = {
  whileHover: { y: -6 },
  whileTap: { scale: 0.98 },
  transition: { type: "spring" as const, stiffness: 300, damping: 24 },
} as const;

export const buttonPress = {
  whileTap: { scale: 0.97 },
} as const;

/* ------------------------------------------------------------------ */
/*  Spring configs                                                     */
/* ------------------------------------------------------------------ */

export const springBounce: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 20,
};

export const springGentle: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 26,
};

/** Snappy pop — used for badges and small elements that need attention.
 *  damping:20 prevents visible oscillation while keeping the pop feel. */
export const springPop: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 20,
};

/* ------------------------------------------------------------------ */
/*  Scale-in with fade — reveal containers with a slight scale-up     */
/* ------------------------------------------------------------------ */

export const revealScaleUp = {
  initial: { opacity: 0, y: 16, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.98 },
  transition: { duration: 0.5, ease: [...ease] },
} as const;

/* ------------------------------------------------------------------ */
/*  Page transition — route changes                                    */
/* ------------------------------------------------------------------ */

export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: [...easeOut] },
} as const;
