import type { ReactNode } from "react";

/**
 * PullQuote — inline editorial pull-quote primitive.
 *
 * Discovery Labs style: hairline rules top + bottom (no giant decorative
 * quote glyphs), Lora italic 26px for the quote body, optional cite line
 * in tracked uppercase Inter. Uses existing CSS tokens only.
 *
 * Server-component-friendly. Drop directly inside <Prose> (it's marked
 * not-prose internally so Prose paragraph styles don't bleed in).
 */
export function PullQuote({
  children,
  cite,
  className = "",
}: {
  children: ReactNode;
  cite?: string;
  className?: string;
}) {
  return (
    <figure
      className={`not-prose ${className}`}
      style={{
        maxWidth: 480,
        margin: "32px auto",
        padding: "32px 0",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        textAlign: "center",
      }}
    >
      <blockquote
        style={{
          margin: 0,
          padding: 0,
          border: 0,
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: 26,
          lineHeight: 1.3,
          color: "var(--dl-text-primary, #1B2030)",
        }}
      >
        {children}
      </blockquote>
      {cite ? (
        <figcaption
          style={{
            marginTop: 16,
            fontFamily: "var(--font-inter)",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "var(--dl-text-muted, #5A6275)",
          }}
        >
          — {cite}
        </figcaption>
      ) : null}
    </figure>
  );
}

export default PullQuote;
