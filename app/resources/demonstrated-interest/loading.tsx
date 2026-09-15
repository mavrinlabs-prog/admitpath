import { Skeleton } from "@/components/ui/skeleton";

/** Demonstrated interest resource loading skeleton. Guides and tips layout. */
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
          <Skeleton className="h-9 w-72 rounded-xl" />
          <Skeleton className="h-5 w-96 rounded-md" />
        </div>
        {/* Two-column overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <div
            className="rounded-2xl border p-5"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
          >
            <Skeleton className="mb-3 h-5 w-28 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-full rounded-md" />
              <Skeleton className="h-3 w-5/6 rounded-md" />
              <Skeleton className="h-3 w-4/5 rounded-md" />
            </div>
            <Skeleton className="mt-4 h-32 w-full rounded-xl" />
          </div>
          <div
            className="rounded-2xl border p-5"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
          >
            <Skeleton className="mb-3 h-5 w-28 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-full rounded-md" />
              <Skeleton className="h-3 w-5/6 rounded-md" />
              <Skeleton className="h-3 w-4/5 rounded-md" />
            </div>
            <Skeleton className="mt-4 h-32 w-full rounded-xl" />
          </div>
        </div>
        {/* Guide sections */}
        <div className="space-y-4 pt-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border p-5"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
            >
              <Skeleton className="mb-3 h-5 w-56 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-3 w-5/6 rounded-md" />
                <Skeleton className="h-3 w-3/4 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">Loading demonstrated interest guide...</p>
    </div>
  );
}
