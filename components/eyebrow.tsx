import type { ReactNode } from "react";

/**
 * Eyebrow — small uppercase category label rendered above article H1s.
 *
 * Discovery Labs canonical: 11px Inter, letter-spacing +0.08em,
 * --text-muted color. Often paired with a date, e.g.
 * "STRATEGY · Apr 24, 2026".
 *
 * Server-component-friendly.
 */
export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`m-0 ${className}`}
      style={{
        fontFamily: "var(--font-inter)",
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--dl-text-muted, #5A6275)",
      }}
    >
      {children}
    </p>
  );
}

export default Eyebrow;
