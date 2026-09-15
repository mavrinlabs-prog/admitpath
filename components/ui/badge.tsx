import React from "react";

type BadgeVariant = "brand" | "success" | "warning" | "danger" | "neutral" | "outline";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  icon?: React.ReactNode;
}

const SIZE_STYLES: Record<BadgeSize, { height: number; fontSize: number; px: number; iconSize: number }> = {
  sm: { height: 20, fontSize: 11, px: 8, iconSize: 12 },
  md: { height: 24, fontSize: 12, px: 10, iconSize: 14 },
  lg: { height: 28, fontSize: 13, px: 12, iconSize: 16 },
};

const VARIANT_STYLES: Record<BadgeVariant, { bg: string; color: string; border: string; dotColor: string }> = {
  brand:   { bg: "rgba(74,111,165,0.10)",  color: "#4A6FA5", border: "transparent",       dotColor: "#4A6FA5" },
  success: { bg: "rgba(22,163,74,0.10)",    color: "#16a34a", border: "transparent",       dotColor: "#16a34a" },
  warning: { bg: "rgba(234,88,12,0.10)",    color: "#ea580c", border: "transparent",       dotColor: "#ea580c" },
  danger:  { bg: "rgba(220,38,38,0.10)",    color: "#dc2626", border: "transparent",       dotColor: "#dc2626" },
  neutral: { bg: "rgba(136,144,165,0.12)",  color: "#454B5E", border: "transparent",       dotColor: "#8890A5" },
  outline: { bg: "transparent",             color: "#454B5E", border: "rgba(0,0,0,0.12)",  dotColor: "#8890A5" },
};

export function Badge({ children, variant = "brand", size = "md", dot, icon }: BadgeProps) {
  const s = SIZE_STYLES[size];
  const v = VARIANT_STYLES[variant];

  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap font-medium leading-none"
      style={{
        height: s.height,
        paddingLeft: s.px,
        paddingRight: s.px,
        fontSize: s.fontSize,
        borderRadius: 999,
        backgroundColor: v.bg,
        color: v.color,
        border: v.border === "transparent" ? "none" : `1px solid ${v.border}`,
        fontFamily: "var(--font-inter, Inter, sans-serif)",
      }}
    >
      {dot && (
        <span
          className="relative flex shrink-0"
          style={{ width: 6, height: 6 }}
        >
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{ backgroundColor: v.dotColor, opacity: 0.4 }}
          />
          <span
            className="relative inline-block rounded-full"
            style={{ width: 6, height: 6, backgroundColor: v.dotColor }}
          />
        </span>
      )}
      {icon && (
        <span className="flex shrink-0 items-center" style={{ width: s.iconSize, height: s.iconSize }}>
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}
