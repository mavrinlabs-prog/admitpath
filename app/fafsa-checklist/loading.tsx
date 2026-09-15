import { Skeleton } from "@/components/ui/skeleton";

/** FAFSA checklist loading skeleton. Checklist items with progress bar. */
export default function Loading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }} aria-busy="true">
      <div
        className="h-16 border-b"
        style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 space-y-6">
        {/* Page header */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-20 rounded-full" />
          <Skeleton className="h-8 w-52 rounded-xl" />
          <Skeleton className="h-4 w-72 rounded-md" />
        </div>

        {/* Progress bar */}
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-4 w-12 rounded-md" />
          </div>
          <Skeleton className="h-3 w-full rounded-full" />
        </div>

        {/* Checklist items */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-2xl border p-5 flex items-start gap-4"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
          >
            <Skeleton className="h-6 w-6 rounded-md shrink-0 mt-0.5" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-3 w-full rounded-md" />
              <Skeleton className="h-3 w-2/3 rounded-md" />
            </div>
          </div>
        ))}
      </div>
      <p className="sr-only" role="status" aria-live="polite">Loading FAFSA checklist...</p>
    </div>
  );
}
