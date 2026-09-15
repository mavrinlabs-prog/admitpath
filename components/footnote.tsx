import type { ReactNode } from "react";

/**
 * Footnote primitives — array-based (RSC-friendly).
 *
 * Usage:
 *   const notes = [
 *     "Per the Common Data Set.",
 *     "Harvard CDS 2024–2025."
 *   ];
 *   <p>Acceptance is ~3.6%<FootnoteRef n={1} />, well below MIT<FootnoteRef n={2} />.</p>
 *   ...
 *   <Footnotes notes={notes} />
 *
 * Renders bidirectional anchors:
 *   - inline marker:  <sup id="fnref-{n}"><a href="#fn-{n}">n</a></sup>
 *   - bottom list:    <li id="fn-{n}">… <a href="#fnref-{n}">↩</a></li>
 *
 * Smooth-scroll already global via app/globals.css.
 *
 * Picked array-based over Context: this codebase's articles are
 * data-driven (data/articles.ts), and an array maps cleanly onto an
 * Article.footnotes field while keeping Footnotes itself a pure RSC.
 */

export function FootnoteRef({ n }: { n: number }) {
  return (
    <sup
      id={`fnref-${n}`}
      style={{
        fontSize: "0.7em",
        lineHeight: 0,
        marginLeft: "0.1em",
        verticalAlign: "super",
      }}
    >
      <a
        href={`#fn-${n}`}
        aria-label={`Jump to footnote ${n}`}
        className="focus-ring"
        style={{
          color: "#4A6FA5",
          textDecoration: "none",
          fontWeight: 600,
          borderRadius: "2px",
        }}
      >
        {n}
      </a>
    </sup>
  );
}

export function Footnotes({
  notes,
  className = "",
}: {
  notes: ReactNode[];
  className?: string;
}) {
  if (!notes || notes.length === 0) return null;
  return (
    <section
      aria-label="Footnotes"
      className={`not-prose ${className}`}
      style={{
        marginTop: 48,
        paddingTop: 24,
        borderTop: "1px solid rgba(0,0,0,0.06)",
        fontSize: 14,
        lineHeight: 1.6,
        color: "var(--dl-text-secondary, #454B5E)",
      }}
    >
      <p
        style={{
          margin: "0 0 12px 0",
          fontFamily: "var(--font-inter)",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--dl-text-muted, #5A6275)",
        }}
      >
        Footnotes
      </p>
      <ol style={{ margin: 0, paddingLeft: "1.25rem", listStyle: "decimal" }}>
        {notes.map((note, i) => {
          const n = i + 1;
          return (
            <li
              key={n}
              id={`fn-${n}`}
              style={{ margin: "0.5em 0", scrollMarginTop: "6rem" }}
            >
              <span>{note}</span>{" "}
              <a
                href={`#fnref-${n}`}
                aria-label={`Return to footnote ${n} reference`}
                style={{
                  color: "#4A6FA5",
                  textDecoration: "none",
                  marginLeft: 4,
                }}
              >
                ↩
              </a>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default Footnotes;
