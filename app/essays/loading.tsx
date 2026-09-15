import { Skeleton } from "@/components/ui/skeleton";

/**
 * Essays page loading skeleton. Two-panel layout matching the editor view:
 * prompt/instructions on the left, essay content on the right.
 */
export default function Loading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }} aria-busy="true">
      {/* Top bar */}
      <div
        className="h-16 border-b"
        style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
      />

      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-8 space-y-2">
          <Skeleton className="h-3 w-16 rounded-full" />
          <Skeleton className="h-8 w-40 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left panel - prompt / instructions */}
          <div
            className="rounded-2xl border p-6"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
          >
            <Skeleton className="mb-4 h-4 w-28 rounded-md" />
            <div className="space-y-3">
              <Skeleton className="h-3 w-full rounded-md" />
              <Skeleton className="h-3 w-5/6 rounded-md" />
              <Skeleton className="h-3 w-4/5 rounded-md" />
              <Skeleton className="h-3 w-2/3 rounded-md" />
            </div>
            <Skeleton className="mt-6 h-10 w-32 rounded-xl" />
          </div>

          {/* Right panel - essay content */}
          <div
            className="rounded-2xl border p-6"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
          >
            <div className="space-y-3">
              <Skeleton className="h-3 w-full rounded-md" />
              <Skeleton className="h-3 w-full rounded-md" />
              <Skeleton className="h-3 w-5/6 rounded-md" />
              <Skeleton className="h-3 w-full rounded-md" />
              <Skeleton className="h-3 w-4/5 rounded-md" />
              <Skeleton className="h-3 w-3/4 rounded-md" />
              <Skeleton className="h-3 w-full rounded-md" />
              <Skeleton className="h-3 w-2/3 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">Loading essays...</p>
    </div>
  );
}
