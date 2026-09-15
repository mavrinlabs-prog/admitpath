"use client";
import Link from "next/link";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <div className="text-center p-8">
        <h2 className="text-xl font-bold mb-4" style={{ color: "var(--dl-text-primary)" }}>We hit a snag</h2>
        <button onClick={reset} className="dl-btn dl-btn-primary dl-btn-sm mr-3">Try again</button>
        <Link href="/" className="text-sm" style={{ color: "#4A6FA5" }}>Go home</Link>
      </div>
    </div>
  );
}
