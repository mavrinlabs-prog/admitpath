export default function Loading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <div className="h-16 border-b animate-shimmer" style={{ borderColor: "rgba(0,0,0,0.06)" }} />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-10">
          <div className="h-7 w-36 rounded-full animate-shimmer mx-auto mb-5" />
          <div className="h-10 w-72 rounded-xl animate-shimmer mx-auto mb-3" />
          <div className="h-5 w-80 rounded-lg animate-shimmer mx-auto" />
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8 mx-auto max-w-xl">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl animate-shimmer" />
          ))}
        </div>
        <div className="h-96 rounded-2xl animate-shimmer mb-8" />
      </div>
      <p className="sr-only" role="status" aria-live="polite">Loading score comparison...</p>
    </div>
  );
}
