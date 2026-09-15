import { Skeleton } from "@/components/ui/skeleton";

/** Resources hub loading skeleton. Category cards in a grid. */
export default function Loading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }} aria-busy="true">
      <div
        className="h-16 border-b"
        style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
      />
      <div className="mx-auto max-w-4xl px-4 py-16 sm:py-20 space-y-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-4 w-24 mx-auto rounded-full" />
          <Skeleton className="h-10 w-72 mx-auto rounded-xl" />
          <Skeleton className="h-5 w-96 mx-auto rounded-md" />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 pt-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border p-6"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
            >
              <Skeleton className="mb-4 h-10 w-10 rounded-xl" />
              <Skeleton className="mb-2 h-5 w-28 rounded-md" />
              <Skeleton className="h-3 w-full rounded-md" />
              <Skeleton className="mt-1.5 h-3 w-4/5 rounded-md" />
            </div>
          ))}
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">Loading resources...</p>
    </div>
  );
}
