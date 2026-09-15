import { Skeleton } from "@/components/ui/skeleton";

/**
 * Analyze page loading skeleton. Two-panel layout: input form on the left,
 * results preview on the right.
 */
export default function Loading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }} aria-busy="true">
      <div
        className="h-16 border-b"
        style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
      />
      <div className="skeleton mx-auto max-w-4xl px-4 py-12 space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20 rounded-full" />
          <Skeleton className="h-8 w-44 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Input form panel */}
          <div
            className="rounded-2xl border p-6"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
          >
            <div className="space-y-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <Skeleton className="mb-2 h-3 w-20 rounded-md" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              ))}
              <Skeleton className="h-10 w-full rounded-xl mt-2" />
            </div>
          </div>

          {/* Results preview panel */}
          <div
            className="rounded-2xl border p-6"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
          >
            <Skeleton className="mb-4 h-4 w-24 rounded-md" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-3 w-3/4 rounded-md" />
                    <Skeleton className="mt-2 h-2 w-full rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">Loading analysis...</p>
    </div>
  );
}
