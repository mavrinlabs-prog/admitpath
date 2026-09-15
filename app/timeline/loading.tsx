import { Skeleton } from "@/components/ui/skeleton";

/** Timeline loading skeleton. Vertical timeline with milestone entries. */
export default function Loading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }} aria-busy="true">
      <div
        className="h-16 border-b"
        style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-9 w-56 rounded-xl" />
          <Skeleton className="h-5 w-80 rounded-md" />
        </div>
        <div className="flex gap-1.5 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-7 w-32 rounded-full" />
          ))}
        </div>
        <div className="space-y-8 pt-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-6 w-48 rounded-md" />
              <div className="ml-8 space-y-2">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="h-4 w-full rounded-md" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">Loading timeline...</p>
    </div>
  );
}
