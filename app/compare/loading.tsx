import { Skeleton } from "@/components/ui/skeleton";

/** Compare page loading skeleton. Header with filter chips and comparison table. */
export default function Loading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }} aria-busy="true">
      <div
        className="h-16 border-b"
        style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
      />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-3 w-16 rounded-full" />
          <Skeleton className="h-9 w-52 rounded-xl" />
          <Skeleton className="h-5 w-80 rounded-md" />
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-28 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-[300px] rounded-xl mt-4" />
      </div>
      <p className="sr-only" role="status" aria-live="polite">Loading comparison...</p>
    </div>
  );
}
