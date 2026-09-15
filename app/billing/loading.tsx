import { Skeleton } from "@/components/ui/skeleton";

/**
 * Billing page loading skeleton. Shows plan card placeholders matching the
 * two-column billing layout.
 */
export default function Loading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }} aria-busy="true">
      <div
        className="h-16 border-b"
        style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
      />
      <div className="mx-auto max-w-3xl px-4 py-12 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-3 w-14 rounded-full" />
          <Skeleton className="h-8 w-32 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl border p-6"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
            >
              <Skeleton className="mb-3 h-5 w-20 rounded-md" />
              <Skeleton className="mb-6 h-8 w-28 rounded-lg" />
              <div className="space-y-2.5">
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-3 w-5/6 rounded-md" />
                <Skeleton className="h-3 w-3/4 rounded-md" />
              </div>
              <Skeleton className="mt-6 h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">Loading billing...</p>
    </div>
  );
}
