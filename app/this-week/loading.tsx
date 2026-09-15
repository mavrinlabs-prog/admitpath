export default function Loading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="h-4 w-20 rounded-lg animate-shimmer mb-6" />
        <div className="h-4 w-32 rounded-lg animate-shimmer mb-2" />
        <div className="h-10 w-80 rounded-xl animate-shimmer mb-2" />
        <div className="h-5 w-48 rounded-lg animate-shimmer mb-10" />
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 rounded-2xl animate-shimmer" />
          ))}
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">Loading weekly briefing...</p>
    </div>
  );
}
