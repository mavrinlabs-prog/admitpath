"use client";

import { motion } from "framer-motion";

type ProgressVariant = "brand" | "success" | "warning" | "danger";
type ProgressSize = "sm" | "md" | "lg";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
  variant?: ProgressVariant;
  size?: ProgressSize;
}

const SIZE_HEIGHT: Record<ProgressSize, number> = {
  sm: 4,
  md: 8,
  lg: 12,
};

const VARIANT_FILL: Record<ProgressVariant, string> = {
  brand: "linear-gradient(90deg, #4A6FA5 0%, #6B8FC5 100%)",
  success: "#16a34a",
  warning: "#ea580c",
  danger: "#dc2626",
};

const VARIANT_GLOW: Record<ProgressVariant, string> = {
  brand: "rgba(74,111,165,0.35)",
  success: "rgba(22,163,74,0.30)",
  warning: "rgba(234,88,12,0.30)",
  danger: "rgba(220,38,38,0.30)",
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercent = false,
  variant = "brand",
  size = "md",
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const h = SIZE_HEIGHT[size];

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span
              className="text-xs font-medium"
              style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter, Inter, sans-serif)" }}
            >
              {label}
            </span>
          )}
          {showPercent && (
            <span
              className="text-xs font-semibold tabular-nums"
              style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter, Inter, sans-serif)" }}
            >
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}

      {/* Track */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          height: h,
          borderRadius: 999,
          background: "rgba(255,255,255,0.45)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || `Progress: ${Math.round(pct)}%`}
        aria-valuetext={`${Math.round(pct)} percent`}
      >
        {/* Fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 60, damping: 18, mass: 0.8 }}
          style={{
            height: "100%",
            borderRadius: 999,
            background: VARIANT_FILL[variant],
            boxShadow: `0 0 ${h}px ${VARIANT_GLOW[variant]}`,
          }}
        />
      </div>
    </div>
  );
}
