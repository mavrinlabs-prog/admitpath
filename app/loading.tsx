export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#D5DCE8" }}>
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: "#4A6FA5", borderTopColor: "transparent" }} />
        <p className="text-sm" style={{ color: "#8890A5" }}>Loading...</p>
      </div>
    </div>
  );
}
