export default function Loading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="h-4 w-24 rounded-lg animate-shimmer mb-8" />
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-xl animate-shimmer" />
          <div className="h-4 w-40 rounded-lg animate-shimmer" />
        </div>
        <div className="h-10 w-96 rounded-xl animate-shimmer mb-3" />
        <div className="h-5 w-80 rounded-lg animate-shimmer mb-10" />
        <div className="h-32 rounded-2xl animate-shimmer mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl animate-shimmer" />
          ))}
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">Loading recommendation letters...</p>
    </div>
  );
}
