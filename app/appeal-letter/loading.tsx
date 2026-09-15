import { Skeleton } from "@/components/ui/skeleton";

/** Appeal letter loading skeleton. Editor-style two-panel layout. */
export default function Loading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }} aria-busy="true">
      <div
        className="h-16 border-b"
        style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
      />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 space-y-6">
        {/* Page header */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-20 rounded-full" />
          <Skeleton className="h-8 w-48 rounded-xl" />
          <Skeleton className="h-4 w-72 rounded-md" />
        </div>

        {/* Form section */}
        <div
          className="rounded-2xl border p-6"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
        >
          <div className="space-y-5">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <Skeleton className="mb-2 h-3 w-24 rounded-md" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ))}
            <div>
              <Skeleton className="mb-2 h-3 w-20 rounded-md" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
            <Skeleton className="h-10 w-40 rounded-xl" />
          </div>
        </div>

        {/* Preview section */}
        <div
          className="rounded-2xl border p-6"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
        >
          <Skeleton className="mb-4 h-4 w-28 rounded-md" />
          <div className="space-y-3">
            <Skeleton className="h-3 w-full rounded-md" />
            <Skeleton className="h-3 w-full rounded-md" />
            <Skeleton className="h-3 w-5/6 rounded-md" />
            <Skeleton className="h-3 w-full rounded-md" />
            <Skeleton className="h-3 w-4/5 rounded-md" />
            <Skeleton className="h-3 w-2/3 rounded-md" />
          </div>
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">Loading appeal letter...</p>
    </div>
  );
}
