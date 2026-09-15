import { Skeleton } from "@/components/ui/skeleton";

/** Interview practice loading skeleton. Question cards with practice interface. */
export default function Loading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }} aria-busy="true">
      <div
        className="h-16 border-b"
        style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
      />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20 rounded-full" />
          <Skeleton className="h-9 w-56 rounded-xl" />
          <Skeleton className="h-5 w-80 rounded-md" />
        </div>

        {/* Category selector */}
        <div className="flex gap-2 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-8 w-28 rounded-full" />
          ))}
        </div>

        {/* Practice area */}
        <div
          className="rounded-2xl border p-6"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
        >
          <Skeleton className="mb-4 h-5 w-48 rounded-md" />
          <div className="space-y-3">
            <Skeleton className="h-3 w-full rounded-md" />
            <Skeleton className="h-3 w-5/6 rounded-md" />
            <Skeleton className="h-3 w-4/5 rounded-md" />
          </div>
          <Skeleton className="mt-6 h-32 w-full rounded-xl" />
          <div className="flex gap-3 mt-4">
            <Skeleton className="h-10 w-28 rounded-xl" />
            <Skeleton className="h-10 w-24 rounded-xl" />
          </div>
        </div>

        {/* Tips section */}
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
        >
          <Skeleton className="mb-3 h-4 w-24 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-full rounded-md" />
            <Skeleton className="h-3 w-5/6 rounded-md" />
            <Skeleton className="h-3 w-2/3 rounded-md" />
          </div>
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">Loading interview practice...</p>
    </div>
  );
}
