export default function Loading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <div className="h-16 border-b animate-shimmer" style={{ borderColor: "rgba(0,0,0,0.06)" }} />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <div className="text-center mb-10">
          <div className="h-4 w-32 rounded-lg animate-shimmer mx-auto mb-3" />
          <div className="h-12 w-96 rounded-xl animate-shimmer mx-auto mb-3" />
          <div className="h-5 w-80 rounded-lg animate-shimmer mx-auto" />
        </div>
        <div className="h-48 rounded-2xl animate-shimmer mb-8" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-2xl animate-shimmer" />
          ))}
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">Loading scholarship finder...</p>
    </div>
  );
}
