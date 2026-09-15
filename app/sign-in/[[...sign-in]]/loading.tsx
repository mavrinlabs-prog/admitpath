import { Skeleton } from "@/components/ui/skeleton";

/** Sign-in loading skeleton. Centered auth card. */
export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}
      aria-busy="true"
    >
      <div
        className="w-full max-w-sm rounded-2xl border p-8 space-y-6"
        style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
      >
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-6 w-28 rounded-lg" />
          <Skeleton className="h-3 w-48 rounded-md" />
        </div>
        <div className="space-y-4">
          <div>
            <Skeleton className="mb-2 h-3 w-14 rounded-md" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div>
            <Skeleton className="mb-2 h-3 w-18 rounded-md" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
        <Skeleton className="h-3 w-40 mx-auto rounded-md" />
      </div>
      <p className="sr-only" role="status" aria-live="polite">Loading sign in...</p>
    </div>
  );
}
