import { Skeleton } from "@/components/ui/skeleton";

/** Settings page loading skeleton. Form-like layout with labeled sections. */
export default function Loading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }} aria-busy="true">
      <div
        className="h-16 border-b"
        style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
      />
      <div className="mx-auto max-w-2xl px-4 py-12 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-3 w-16 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-xl" />
        </div>

        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-2xl border p-6"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
          >
            <Skeleton className="mb-4 h-4 w-24 rounded-md" />
            <div className="space-y-4">
              <div>
                <Skeleton className="mb-2 h-3 w-16 rounded-md" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div>
                <Skeleton className="mb-2 h-3 w-20 rounded-md" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="sr-only" role="status" aria-live="polite">Loading settings...</p>
    </div>
  );
}
