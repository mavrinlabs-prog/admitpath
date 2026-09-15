import { Skeleton } from "@/components/ui/skeleton";

/** Interview prep resource loading skeleton. Filter chips and question cards. */
export default function Loading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }} aria-busy="true">
      <div
        className="h-16 border-b"
        style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
      />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-9 w-44 rounded-xl" />
          <Skeleton className="h-5 w-80 rounded-md" />
        </div>
        <div className="flex flex-wrap gap-1.5 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-7 w-28 rounded-full" />
          ))}
        </div>
        <div className="space-y-4 pt-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-2xl border p-5"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
            >
              <Skeleton className="mb-2 h-4 w-48 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-3 w-5/6 rounded-md" />
                <Skeleton className="h-3 w-2/3 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">Loading interview prep...</p>
    </div>
  );
}
