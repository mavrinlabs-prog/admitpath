"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Error500 } from "@/components/illustrations/Error500";

/**
 * Shared segment-level error boundary. Per Next.js conventions, each
 * `app/**\/error.tsx` catches render errors inside its segment without
 * unmounting the parent layout (so the AppNav stays in place). We render
 * one component everywhere so future tweaks are a single-file change.
 *
 * Copy: "This section hit an error — your data is saved." Confirms
 * auto-save and provides contact email per U9 requirements.
 */
export function SegmentError({
  error,
  reset,
  backHref = "/dashboard",
  backLabel = "Back to dashboard",
}: {
  error: Error & { digest?: string };
  reset: () => void;
  backHref?: string;
  backLabel?: string;
}) {
  useEffect(() => {
    // Surface for Vercel/observability without blowing up the client.
    console.error("[segment-error]", error);
  }, [error]);

  return (
    <div
      className="animate-fade-in-up mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center"
      style={{ color: "var(--dl-text-primary, #1B2030)" }}
    >
      <div
        className="mb-5 flex items-center justify-center"
        style={{ color: "#4A6FA5" }}
      >
        <Error500 size={120} />
      </div>
      <h1
        className="text-2xl mb-2 tracking-tight"
        style={{
          color: "var(--dl-text-primary, #1B2030)",
          letterSpacing: "-0.01em",
        }}
      >
        This section hit an error.
      </h1>
      <p
        className="text-sm leading-relaxed"
        style={{ color: "var(--dl-text-secondary, #454B5E)" }}
      >
        Your data is saved. Try refreshing, or contact{" "}
        <a
          href="mailto:maestro.committee@gmail.com"
          className="underline"
          style={{ color: "#4A6FA5" }}
        >
          maestro.committee@gmail.com
        </a>{" "}
        if it persists.
      </p>
      <div className="mt-6 flex flex-col gap-2 w-full">
        <button
          onClick={reset}
          className="btn-primary w-full py-2.5 text-sm"
        >
          Try again
        </button>
        <Link href={backHref} className="btn-secondary py-2.5 text-sm">
          {backLabel}
        </Link>
        {backHref !== "/" && (
          <Link
            href="/"
            className="text-xs underline mt-1"
            style={{ color: "var(--dl-text-muted, #5A6275)" }}
          >
            Or return to the home page
          </Link>
        )}
      </div>
      {error.digest && (
        <p
          className="mt-6 text-[11px] font-mono break-all"
          style={{ color: "var(--dl-text-muted, #5A6275)" }}
        >
          Ref: {error.digest}
        </p>
      )}
    </div>
  );
}
