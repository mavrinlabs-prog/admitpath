import type { ReactNode } from "react";

/**
 * Aside — inline callout primitive usable outside <Prose>.
 *
 * Mirrors the blockquote spec from `components/prose.tsx`:
 *   - border-left: 3px solid #4A6FA5
 *   - font-style: normal  (italic OFF — Anthropic restraint)
 *   - font-weight: 500    (visual weight comes from weight, not italic)
 *   - padding-left: 1.5rem
 *   - color: var(--dl-text-primary, #1B2030)
 *   - font-size: 1.125rem
 *   - line-height: 1.55
 *
 * Use this when you need a blockquote-flavored callout in a UI surface
 * (cards, dashboards, modals) where <Prose> styles don't apply.
 *
 * Variants tone the left rule only — no background fill, no shadow,
 * no border-radius. Restraint over decoration.
 */
type Tone = "primary" | "muted" | "success" | "warning" | "error";

const toneToVar: Record<Tone, string> = {
  primary: "#4A6FA5",
  muted: "var(--border-strong)",
  success: "var(--success)",
  warning: "var(--warning)",
  error: "var(--error)",
};

export function Aside({
  children,
  tone = "primary",
  className = "",
  as: Tag = "aside",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  as?: "aside" | "div" | "blockquote";
}) {
  // Provide role="note" for div-rendered asides so screen readers
  // still identify the callout semantics. <aside> and <blockquote>
  // already carry implicit roles.
  const extraProps = Tag === "div" ? { role: "note" as const } : {};

  return (
    <Tag
      {...extraProps}
      className={className}
      style={{
        borderLeft: `3px solid ${toneToVar[tone]}`,
        paddingLeft: "1.5rem",
        margin: "1.75em 0",
        fontStyle: "normal",
        fontWeight: 500,
        color: "var(--dl-text-primary, #1B2030)",
        fontSize: "1.125rem",
        lineHeight: 1.55,
      }}
    >
      {children}
    </Tag>
  );
}

export default Aside;
