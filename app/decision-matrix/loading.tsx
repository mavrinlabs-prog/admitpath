import { Skeleton } from "@/components/ui/skeleton";

/** Decision matrix loading skeleton. Table-like layout with header row and data rows. */
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
          <Skeleton className="h-8 w-56 rounded-xl" />
          <Skeleton className="h-4 w-80 rounded-md" />
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-40 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
          <div className="flex-1" />
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>

        {/* Matrix table skeleton */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
        >
          {/* Header row */}
          <div className="flex gap-4 p-4 border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
            <Skeleton className="h-4 w-32 rounded-md" />
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-4 w-20 rounded-md flex-1" />
            ))}
          </div>
          {/* Data rows */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 border-b last:border-b-0"
              style={{ borderColor: "rgba(0,0,0,0.04)" }}
            >
              <Skeleton className="h-4 w-32 rounded-md" />
              {[1, 2, 3, 4].map((j) => (
                <Skeleton key={j} className="h-8 w-20 rounded-lg flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">Loading decision matrix...</p>
    </div>
  );
}
