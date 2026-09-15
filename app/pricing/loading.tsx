import { Skeleton } from "@/components/ui/skeleton";

/** Pricing page loading skeleton. 3-column pricing card grid. */
export default function Loading() {
  return (
    <div
      className="min-h-screen px-4 py-16"
      style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}
      aria-busy="true"
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-10 w-72 rounded-2xl" />
          <Skeleton className="h-4 w-96 max-w-full rounded-xl" />
        </div>
        {/* 3-column pricing grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-3xl border p-6"
              style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)" }}
            >
              <Skeleton className="h-6 w-24 rounded-xl" />
              <Skeleton className="mt-3 h-10 w-32 rounded-xl" />
              <div className="mt-6 space-y-2.5">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
                <Skeleton className="h-4 w-4/6 rounded-md" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
              </div>
              <Skeleton className="mt-6 h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">Loading pricing...</p>
    </div>
  );
}
