import { Skeleton } from "@/components/ui/skeleton";

/**
 * Colleges list loading skeleton. Shows a search bar placeholder and
 * college card outlines so the layout doesn't shift on load.
 */
export default function Loading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }} aria-busy="true">
      {/* Top bar */}
      <div
        className="h-16 border-b"
        style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
      />

      <div className="mx-auto max-w-4xl px-4 py-12 space-y-6">
        {/* Search / filter bar */}
        <div
          className="rounded-2xl border p-4 flex items-center gap-3"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
        >
          <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
          <Skeleton className="h-10 flex-1 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl shrink-0" />
        </div>

        {/* College cards */}
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border p-5"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
          >
            <div className="flex items-start gap-4">
              <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48 rounded-md" />
                <Skeleton className="h-3 w-72 rounded-md" />
                <div className="flex gap-3 mt-3">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="sr-only" role="status" aria-live="polite">Loading colleges...</p>
    </div>
  );
}
