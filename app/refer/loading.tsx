export default function Loading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <div className="h-16 border-b animate-shimmer" style={{ borderColor: "rgba(0,0,0,0.06)" }} />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-12">
          <div className="h-7 w-40 rounded-full animate-shimmer mx-auto mb-6" />
          <div className="h-10 w-80 rounded-xl animate-shimmer mx-auto mb-4" />
          <div className="h-5 w-96 rounded-lg animate-shimmer mx-auto" />
        </div>
        <div className="mx-auto max-w-2xl h-48 rounded-2xl animate-shimmer mb-10" />
        <div className="mx-auto max-w-2xl h-40 rounded-2xl animate-shimmer" />
      </div>
      <p className="sr-only" role="status" aria-live="polite">Loading referral page...</p>
    </div>
  );
}
