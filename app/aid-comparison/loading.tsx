import { Skeleton } from "@/components/ui/skeleton";

/** Aid comparison loading skeleton. Side-by-side comparison cards. */
export default function Loading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }} aria-busy="true">
      <div
        className="h-16 border-b"
        style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
      />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-6">
        {/* Page header */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-20 rounded-full" />
          <Skeleton className="h-8 w-52 rounded-xl" />
          <Skeleton className="h-4 w-80 rounded-md" />
        </div>

        {/* Comparison cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl border p-6"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
            >
              <Skeleton className="mb-4 h-5 w-32 rounded-md" />
              <Skeleton className="mb-6 h-8 w-28 rounded-lg" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex items-center justify-between">
                    <Skeleton className="h-3 w-24 rounded-md" />
                    <Skeleton className="h-3 w-16 rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Summary section */}
        <div
          className="rounded-2xl border p-6"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
        >
          <Skeleton className="mb-4 h-4 w-28 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-full rounded-md" />
            <Skeleton className="h-3 w-5/6 rounded-md" />
            <Skeleton className="h-3 w-3/4 rounded-md" />
          </div>
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">Loading aid comparison...</p>
    </div>
  );
}
