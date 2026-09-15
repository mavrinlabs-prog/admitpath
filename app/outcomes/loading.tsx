export default function Loading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="h-4 w-32 rounded-lg animate-shimmer mb-6" />
        <div className="h-10 w-64 rounded-xl animate-shimmer mb-3" />
        <div className="h-5 w-96 rounded-lg animate-shimmer mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl animate-shimmer" />
          ))}
        </div>
        <div className="h-80 rounded-2xl animate-shimmer mb-8" />
      </div>
      <p className="sr-only" role="status" aria-live="polite">Loading outcomes...</p>
    </div>
  );
}
