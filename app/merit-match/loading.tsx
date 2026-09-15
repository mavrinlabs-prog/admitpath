import { Skeleton } from "@/components/ui/skeleton";

/** Merit match loading skeleton. Summary card and match results list. */
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
          <Skeleton className="h-9 w-72 rounded-xl" />
          <Skeleton className="h-5 w-96 rounded-md" />
        </div>
        {/* Summary card */}
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
        >
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
        {/* Match result cards */}
        <div className="space-y-4 pt-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl border p-5 flex items-start gap-4"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
            >
              <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48 rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-3 w-3/4 rounded-md" />
              </div>
              <Skeleton className="h-8 w-20 rounded-lg shrink-0" />
            </div>
          ))}
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">Loading merit matches...</p>
    </div>
  );
}
