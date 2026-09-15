import { Skeleton } from "@/components/ui/skeleton";

/** Profile creation loading skeleton. Wizard-style form with progress bar. */
export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}
      aria-busy="true"
    >
      <div className="w-full max-w-2xl space-y-6">
        {/* Progress bar */}
        <Skeleton className="h-2 rounded-full" />

        {/* Form card */}
        <div
          className="rounded-2xl border p-6 sm:p-8 space-y-6"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
        >
          <div className="space-y-2">
            <Skeleton className="h-6 w-40 rounded-lg" />
            <Skeleton className="h-3 w-64 rounded-md" />
          </div>
          <div className="space-y-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <Skeleton className="mb-2 h-3 w-24 rounded-md" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-10 w-24 rounded-xl" />
            <Skeleton className="h-10 w-28 rounded-xl" />
          </div>
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">Loading profile setup...</p>
    </div>
  );
}
