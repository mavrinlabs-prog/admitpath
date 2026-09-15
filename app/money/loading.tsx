import { Skeleton } from "@/components/ui/skeleton";

/** Money / financial aid loading skeleton. Summary and breakdowns. */
export default function Loading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }} aria-busy="true">
      <div
        className="h-16 border-b"
        style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
      />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24 rounded-full" />
          <Skeleton className="h-9 w-44 rounded-xl" />
          <Skeleton className="h-5 w-96 rounded-md" />
        </div>
        {/* Overview card */}
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
        >
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
        {/* Breakdown items */}
        <div className="space-y-3 pt-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="rounded-2xl border p-4 flex items-center gap-4"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
            >
              <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-36 rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
              </div>
              <Skeleton className="h-6 w-20 rounded-lg shrink-0" />
            </div>
          ))}
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">Loading financial overview...</p>
    </div>
  );
}
