import { Skeleton } from "@/components/ui/skeleton";

/** Glossary loading skeleton. Alphabetical index with definition cards. */
export default function Loading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }} aria-busy="true">
      <div
        className="h-16 border-b"
        style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-9 w-56 rounded-xl" />
          <Skeleton className="h-5 w-80 rounded-md" />
        </div>
        {/* Alphabet index */}
        <div className="flex gap-1 pt-2">
          {Array.from({ length: 15 }, (_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-md" />
          ))}
        </div>
        {/* Definition cards */}
        <div className="space-y-3 pt-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="rounded-2xl border p-4"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
            >
              <Skeleton className="mb-2 h-4 w-32 rounded-md" />
              <Skeleton className="h-3 w-full rounded-md" />
              <Skeleton className="mt-1.5 h-3 w-4/5 rounded-md" />
            </div>
          ))}
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">Loading glossary...</p>
    </div>
  );
}
