"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const payload = {
        message: error.message,
        digest: error.digest,
        timestamp: new Date().toISOString(),
      };
      fetch("/api/log-client-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: "#D5DCE8" }}>
      <div className="text-center max-w-md bg-white rounded-2xl p-8 shadow-sm border" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest" style={{ color: "#4A6FA5" }}>Error</p>
        <h2 className="text-2xl font-bold mb-3" style={{ color: "#1B2030" }}>Something went wrong</h2>
        <p className="text-sm mb-4" style={{ color: "#454B5E" }}>
          {error.message || "An unexpected error occurred. Your data is safe."}
        </p>
        {error.digest && (
          <p className="text-xs mb-4 font-mono" style={{ color: "#8890A5" }}>Reference: {error.digest}</p>
        )}
        <p className="text-xs mb-6" style={{ color: "#8890A5" }}>
          If this keeps happening, email{" "}
          <a href="mailto:maestro.committee@gmail.com" className="underline" style={{ color: "#4A6FA5" }}>
            maestro.committee@gmail.com
          </a>{" "}
          with the reference code above.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset} className="inline-flex items-center justify-center gap-2 rounded-lg text-white font-semibold px-5 py-2.5 text-sm transition-colors" style={{ backgroundColor: "#4A6FA5" }}>Try again</button>
          <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-lg border font-semibold px-5 py-2.5 text-sm transition-colors" style={{ borderColor: "rgba(0,0,0,0.06)", color: "#454B5E" }}>Back to home</Link>
        </div>
      </div>
    </div>
  );
}
