import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

/**
 * Dashboard loading skeleton. Mirrors the dashboard layout with stat cards,
 * a main content area, and sidebar so the transition feels intentional.
 */
export default function Loading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }} aria-busy="true">
      {/* Top bar */}
      <div
        className="h-16 border-b"
        style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
      />

      <div className="skeleton mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
        {/* Page title */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-20 rounded-full" />
          <Skeleton className="h-8 w-48 rounded-xl" />
        </div>

        {/* Stat cards row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl border p-5"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
            >
              <Skeleton className="mb-3 h-3 w-20 rounded-full" />
              <Skeleton className="h-7 w-16 rounded-lg" />
            </div>
          ))}
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Primary panel */}
          <div
            className="lg:col-span-2 rounded-2xl border p-6"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
          >
            <Skeleton className="mb-5 h-4 w-32 rounded-md" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-3/4 rounded-md" />
                    <Skeleton className="h-3 w-1/2 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar panel */}
          <div
            className="rounded-2xl border p-6"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
          >
            <Skeleton className="mb-5 h-4 w-24 rounded-md" />
            <SkeletonText lines={3} />
            <Skeleton className="h-20 w-full rounded-xl mt-4" />
          </div>
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">Loading dashboard...</p>
    </div>
  );
}
