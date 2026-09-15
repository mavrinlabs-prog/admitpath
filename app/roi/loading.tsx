import { Skeleton } from "@/components/ui/skeleton";

/** ROI calculator loading skeleton. Chart area and result breakdown. */
export default function Loading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }} aria-busy="true">
      <div
        className="h-16 border-b"
        style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
      />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-3 w-16 rounded-full" />
          <Skeleton className="h-9 w-64 rounded-xl" />
          <Skeleton className="h-5 w-96 rounded-md" />
        </div>
        {/* Chart area */}
        <div
          className="rounded-2xl border p-6"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
        >
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
        {/* Result breakdown */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border p-5"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
            >
              <Skeleton className="mb-2 h-3 w-20 rounded-md" />
              <Skeleton className="h-7 w-24 rounded-lg" />
              <Skeleton className="mt-2 h-3 w-full rounded-md" />
            </div>
          ))}
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">Loading ROI calculator...</p>
    </div>
  );
}
