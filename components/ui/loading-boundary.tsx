"use client";

import React, { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";

type LoadingVariant = "card" | "text" | "full" | "spinner";
type SpinnerSize = "sm" | "md" | "lg";

interface LoadingBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  variant?: LoadingVariant;
}

interface SpinnerProps {
  size?: SpinnerSize;
  color?: string;
}

const SPINNER_SIZES: Record<SpinnerSize, number> = { sm: 16, md: 24, lg: 40 };
const SPINNER_BORDER: Record<SpinnerSize, number> = { sm: 2, md: 2.5, lg: 3 };

export function Spinner({ size = "md", color = "#4A6FA5" }: SpinnerProps) {
  const s = SPINNER_SIZES[size];
  const b = SPINNER_BORDER[size];

  return (
    <span
      className="inline-block"
      role="status"
      aria-label="Loading"
      style={{
        width: s,
        height: s,
        position: "relative",
      }}
    >
      {/* Outer ring */}
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `${b}px solid rgba(0,0,0,0.06)`,
        }}
      />
      {/* Spinning ring */}
      <span
        className="animate-spin"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `${b}px solid transparent`,
          borderTopColor: color,
          borderRightColor: color,
          animation: "spin 0.8s linear infinite",
        }}
      />
    </span>
  );
}

function SkeletonBlock({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`animate-shimmer rounded-lg ${className ?? ""}`} style={style} />;
}

function CardFallback() {
  return (
    <div
      className="rounded-2xl border p-6"
      style={{
        borderColor: "rgba(0,0,0,0.06)",
        background: "rgba(255,255,255,0.45)",
      }}
    >
      <SkeletonBlock className="mb-4 h-4 w-32" />
      <div className="space-y-3">
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-5/6" />
        <SkeletonBlock className="h-3 w-2/3" />
      </div>
      <SkeletonBlock className="mt-5 h-10 w-full rounded-xl" />
    </div>
  );
}

function TextFallback() {
  return (
    <div className="space-y-2.5">
      <SkeletonBlock className="h-3 w-full" />
      <SkeletonBlock className="h-3 w-5/6" />
      <SkeletonBlock className="h-3 w-3/4" />
      <SkeletonBlock className="h-3 w-1/2" />
    </div>
  );
}

function FullFallback() {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <span
          className="text-sm font-medium"
          style={{
            color: "var(--dl-text-muted, #8890A5)",
            fontFamily: "var(--font-inter, Inter, sans-serif)",
          }}
        >
          Loading...
        </span>
      </div>
    </div>
  );
}

function SpinnerFallback() {
  return (
    <span className="inline-flex items-center justify-center p-2">
      <Spinner size="md" />
    </span>
  );
}

const VARIANT_FALLBACKS: Record<LoadingVariant, React.ReactNode> = {
  card: <CardFallback />,
  text: <TextFallback />,
  full: <FullFallback />,
  spinner: <SpinnerFallback />,
};

function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function LoadingBoundary({ children, fallback, variant = "card" }: LoadingBoundaryProps) {
  const resolvedFallback = fallback ?? VARIANT_FALLBACKS[variant];

  return (
    <Suspense fallback={resolvedFallback}>
      <FadeIn>{children}</FadeIn>
    </Suspense>
  );
}
