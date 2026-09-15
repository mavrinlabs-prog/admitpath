import { Skeleton } from "@/components/ui/skeleton";

/** Chat loading skeleton. Alternating bubble shapes match the real chat layout. */
export default function Loading() {
  return (
    <div
      className="flex h-screen flex-col"
      style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}
      aria-busy="true"
    >
      {/* Top bar */}
      <div
        className="h-16 border-b"
        style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
      />
      {/* Message stream skeleton */}
      <div className="flex-1 overflow-hidden px-4 py-8">
        <div className="mx-auto flex max-w-2xl flex-col gap-5">
          <Skeleton className="self-start h-16 w-3/4 rounded-2xl" />
          <Skeleton className="self-end h-10 w-1/2 rounded-2xl" />
          <Skeleton className="self-start h-24 w-4/5 rounded-2xl" />
          <Skeleton className="self-end h-10 w-2/5 rounded-2xl" />
        </div>
      </div>
      {/* Composer skeleton */}
      <div className="border-t px-4 py-4" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
        <Skeleton className="mx-auto h-12 max-w-2xl rounded-2xl" />
      </div>
      <p className="sr-only" role="status" aria-live="polite">Loading chat...</p>
    </div>
  );
}
