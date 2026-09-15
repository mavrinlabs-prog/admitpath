import type { ReactNode } from "react";

/**
 * Prose — long-form reading container.
 *
 * Discovery Labs typography:
 *  - Inter 15px body, line-height 1.7 (clean, readable)
 *  - Inter for all headings (DL canonical sans)
 *  - 680px max width clamp for ideal measure
 *  - H2 with ~64px top margin for strong section breaks
 *  - Blockquote with 3px left rule in --primary, italic OFF, weight 500
 *  - Inline code with subtle background tint
 *
 * Server-component-friendly. Composable via className.
 *
 * Uses existing CSS tokens only (no new colors).
 */
export function Prose({
  children,
  className = "",
  dropCap = false,
}: {
  children: ReactNode;
  className?: string;
  dropCap?: boolean;
}) {
  return (
    <div className={`prose-ap ${dropCap ? "drop-cap" : ""} ${className}`}>
      {children}
      <style dangerouslySetInnerHTML={{ __html: `
        .prose-ap {
          max-width: 680px;
          font-family: var(--font-inter);
          font-size: 15px;
          line-height: 1.7;
          color: var(--dl-text-secondary, #454B5E);
        }
        .prose-ap > * + * { margin-top: 1.25em; }
        .prose-ap p {
          font-family: var(--font-inter);
          font-size: 15px;
          line-height: 1.7;
          color: var(--dl-text-secondary, #454B5E);
        }
        .prose-ap h1 {
          font-family: var(--font-inter);
          color: var(--dl-text-primary, #1B2030);
          font-size: clamp(2.25rem, 4vw, 3.25rem);
          line-height: 1.08;
          letter-spacing: -0.01em;
          font-weight: 400;
          margin-top: 0;
          margin-bottom: 0.5em;
        }
        .prose-ap h2 {
          font-family: var(--font-inter);
          color: var(--dl-text-primary, #1B2030);
          font-size: 1.875rem;
          line-height: 1.2;
          letter-spacing: -0.005em;
          font-weight: 700;
          margin-top: 64px;
          margin-bottom: 16px;
          scroll-margin-top: 6rem;
        }
        .prose-ap h3 {
          font-family: var(--font-inter);
          color: var(--dl-text-primary, #1B2030);
          font-size: 1.375rem;
          line-height: 1.3;
          font-weight: 600;
          margin-top: 40px;
          margin-bottom: 12px;
        }
        .prose-ap a {
          color: #4A6FA5;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-thickness: 1px;
        }
        .prose-ap a:hover { color: #3A5F95; }
        .prose-ap strong { color: var(--dl-text-primary, #1B2030); font-weight: 600; }
        .prose-ap em { font-style: normal; font-weight: 500; color: var(--dl-text-primary, #1B2030); }
        .prose-ap blockquote {
          border-left: 3px solid #4A6FA5;
          padding-left: 1.5rem;
          margin: 1.75em 0;
          font-style: normal;
          font-weight: 500;
          color: var(--dl-text-primary, #1B2030);
          font-size: 1.125rem;
          line-height: 1.55;
        }
        .prose-ap blockquote p { color: var(--dl-text-primary, #1B2030); font-weight: 500; font-size: 1.125rem; }
        .prose-ap ul, .prose-ap ol {
          padding-left: 1.5rem;
          margin: 1em 0;
        }
        .prose-ap ul { list-style: disc; }
        .prose-ap ol { list-style: decimal; }
        .prose-ap li { margin: 0.5em 0; }
        .prose-ap li::marker { color: var(--dl-text-muted, #5A6275); }
        .prose-ap code {
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 0.92em;
          background: var(--dl-bg-sunken, #E3E8F1);
          color: var(--dl-text-primary, #1B2030);
          padding: 0.125em 0.375em;
          border-radius: 4px;
          border: 1px solid rgba(0,0,0,0.06);
        }
        .prose-ap pre {
          background: var(--dl-bg-sunken, #E3E8F1);
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 8px;
          padding: 1rem 1.25rem;
          overflow-x: auto;
          font-size: 0.9rem;
          line-height: 1.55;
        }
        .prose-ap pre code {
          background: transparent;
          border: 0;
          padding: 0;
        }
        .prose-ap hr {
          border: 0;
          height: 0;
          margin: 32px 0;
          text-align: center;
          overflow: visible;
        }
        .prose-ap hr::before {
          content: "* * *";
          color: var(--dl-text-muted, #5A6275);
          letter-spacing: 0.5em;
          font-size: 1rem;
          line-height: 1;
          font-family: var(--font-inter);
        }
        .prose-ap table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.75em 0;
          font-family: var(--font-inter);
          font-size: 15px;
          line-height: 1.5;
          color: var(--dl-text-secondary, #454B5E);
        }
        .prose-ap table th,
        .prose-ap table td {
          border: 1px solid rgba(0,0,0,0.06);
          padding: 12px 14px;
          text-align: left;
          vertical-align: top;
        }
        .prose-ap table th {
          background: var(--dl-bg-sunken, #E3E8F1);
          color: var(--dl-text-primary, #1B2030);
          font-weight: 600;
          font-variant: small-caps;
          letter-spacing: 0.04em;
        }
        .prose-ap ol > li::marker {
          font-family: var(--font-inter);
          font-style: italic;
          color: var(--dl-text-muted, #5A6275);
        }
        .prose-ap.drop-cap > article > p:first-of-type::first-letter,
        .prose-ap.drop-cap > p:first-of-type::first-letter {
          font-family: var(--font-inter);
          font-style: italic;
          float: left;
          font-size: 3em;
          line-height: 1;
          padding-right: 8px;
          padding-top: 4px;
          color: var(--dl-text-primary, #1B2030);
        }
      ` }} />
    </div>
  );
}

export default Prose;
