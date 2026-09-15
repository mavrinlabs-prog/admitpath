import { Skeleton } from "@/components/ui/skeleton";

/** Deadlines page loading skeleton. Calendar-style layout with upcoming items. */
export default function Loading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }} aria-busy="true">
      <div
        className="h-16 border-b"
        style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
      />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-9 w-64 rounded-xl" />
          <Skeleton className="h-5 w-96 rounded-md" />
        </div>
        <div className="flex gap-4 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-4 w-32 rounded-md" />
          ))}
        </div>
        <Skeleton className="h-[400px] rounded-xl mt-8" />
      </div>
      <p className="sr-only" role="status" aria-live="polite">Loading deadlines...</p>
    </div>
  );
}
