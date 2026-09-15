"use client";

// Root-layout fallback. Triggers only when an error escapes app/layout.tsx.
// Must declare its own <html> + <body> because the normal layout failed —
// CSS variables from globals.css aren't guaranteed at this level, so the
// inline color literals match the values --primary / --background /
// --text-primary / --text-muted / --border resolve to (Discovery Labs blue).

import { useEffect } from "react";
import { Error500 } from "@/components/illustrations/Error500";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.error("[global-error]", error);
    }
  }, [error]);

  return (
    <html lang="en">
      <head>
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .ge-card { animation: fadeInUp 500ms cubic-bezier(0.16, 1, 0.3, 1) both; }
          .ge-btn:hover { filter: brightness(0.9); }
          .ge-btn-secondary:hover { background: #F5F7FA !important; border-color: #4A6FA5 !important; color: #2E4A6E !important; }
          @media (prefers-reduced-motion: reduce) { .ge-card { animation: none; } }
        `}</style>
      </head>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#D5DCE8",
          color: "#1B2030",
          fontFamily:
            "'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
          padding: "16px",
        }}
      >
        <main
          role="alert"
          className="ge-card"
          style={{
            maxWidth: 448,
            width: "100%",
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: 16,
            padding: "32px 28px",
            textAlign: "center",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              margin: "0 auto 24px",
              display: "flex",
              justifyContent: "center",
              color: "#4A6FA5",
            }}
            aria-hidden
          >
            <Error500 size={140} />
          </div>
          <h1
            style={{
              fontSize: 24,
              margin: "0 0 8px",
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              letterSpacing: "-0.01em",
              fontWeight: 400,
            }}
          >
            Something on our end broke.
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#454B5E",
              margin: "0 0 24px",
              lineHeight: 1.6,
              fontFamily: "'Lora', Georgia, serif",
            }}
          >
            This wasn&apos;t your fault. The error has been logged. You can retry or head to
            your dashboard.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button
              type="button"
              onClick={reset}
              className="ge-btn"
              style={{
                appearance: "none",
                border: 0,
                cursor: "pointer",
                background: "#4A6FA5",
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
                padding: "10px 18px",
                borderRadius: 10,
                minHeight: 44,
                width: "100%",
                transition: "filter 200ms ease, transform 200ms ease",
              }}
            >
              Try again
            </button>
            <a
              href="/dashboard"
              className="ge-btn-secondary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#FFFFFF",
                color: "#1B2030",
                border: "1.5px solid #E5E7EB",
                fontWeight: 600,
                fontSize: 14,
                padding: "10px 18px",
                borderRadius: 10,
                textDecoration: "none",
                minHeight: 44,
                width: "100%",
                transition: "all 200ms ease",
              }}
            >
              Go to dashboard
            </a>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- global-error renders without the root layout; a plain anchor is the reliable escape hatch */}
            <a
              href="/"
              style={{
                display: "block",
                marginTop: 4,
                fontSize: 12,
                color: "#5A6275",
                textDecoration: "underline",
                textUnderlineOffset: "2px",
              }}
            >
              Or return to the home page
            </a>
          </div>
          {error?.digest && (
            <p
              style={{
                marginTop: 24,
                fontSize: 11,
                color: "#5A6275",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                wordBreak: "break-all",
              }}
            >
              Ref: {error.digest}
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
