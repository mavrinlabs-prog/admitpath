import { Skeleton } from "@/components/ui/skeleton";

/** Quiz loading skeleton. Progress bar with question and answer options. */
export default function Loading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }} aria-busy="true">
      <div
        className="h-16 border-b"
        style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
      />
      <div className="mx-auto max-w-xl px-4 py-16 sm:py-20 space-y-6">
        {/* Progress dots */}
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-1.5 flex-1 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-3 w-24 rounded-md" />
        <Skeleton className="h-8 w-64 rounded-xl" />
        {/* Answer option cards */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-xl border p-4"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
            >
              <Skeleton className="h-8 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">Loading quiz...</p>
    </div>
  );
}
