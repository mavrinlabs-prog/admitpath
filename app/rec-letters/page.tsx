import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getGoogleUser, hasSessionCookie } from "@/lib/google-auth";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { RecLetterTracker } from "@/components/RecLetterTracker";

export const metadata: Metadata = {
  title: "Recommendation Letters",
  robots: { index: false, follow: false },
};

export default async function RecLettersPage() {
  const googleUser = await getGoogleUser();
  if (!googleUser && !(await hasSessionCookie())) redirect("/sign-in");

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <main id="main" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors hover:opacity-80"
          style={{ color: "#4A6FA5" }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Dashboard
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: "rgba(74,111,165,0.1)", color: "#4A6FA5" }}
            >
              <FileText className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <div>
              <p
                className="text-[11px] uppercase"
                style={{ color: "#4A6FA5", fontWeight: 700, letterSpacing: "0.12em" }}
              >
                Recommendation Letters
              </p>
            </div>
          </div>
          <h1
            className="text-[32px] sm:text-[40px] leading-[1.05]"
            style={{
              color: "var(--dl-text-primary, #1B2030)",
              fontFamily: "var(--font-inter)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            Track your recommendation letters
          </h1>
          <p
            className="mt-3 text-[15px] leading-relaxed max-w-xl"
            style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}
          >
            Add your recommenders, track their status, and generate a brag sheet to give them. Most competitive schools require 2 teacher recommendations and 1 counselor letter.
          </p>
        </header>

        {/* Tips card */}
        <div
          className="mb-8 border p-5"
          style={{
            background: "linear-gradient(135deg, rgba(74,111,165,0.04), rgba(30,51,82,0.03))",
            borderColor: "rgba(74,111,165,0.12)",
            borderRadius: "14px",
          }}
        >
          <p className="text-[11px] uppercase mb-2" style={{ color: "#4A6FA5", fontWeight: 700, letterSpacing: "0.12em" }}>
            Tips
          </p>
          <ul className="space-y-1.5 text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            <li>Ask junior-year teachers in core academic subjects (math, science, English, history).</li>
            <li>Ask at least 6 weeks before your earliest deadline.</li>
            <li>Give each teacher a brag sheet so they can write a specific, personal letter.</li>
            <li>Follow up politely 2 weeks before the deadline if they haven&apos;t submitted.</li>
          </ul>
        </div>

        {/* Tracker component */}
        <RecLetterTracker />

        {/* Quick links */}
        <div
          className="mt-10 border p-5"
          style={{
            background: "linear-gradient(135deg, rgba(74,111,165,0.04), rgba(30,51,82,0.03))",
            borderColor: "rgba(74,111,165,0.12)",
            borderRadius: "14px",
          }}
        >
          <p className="text-[11px] uppercase mb-3" style={{ color: "#4A6FA5", fontWeight: 700, letterSpacing: "0.12em" }}>
            Next steps
          </p>
          <div className="space-y-2.5">
            <Link
              href="/resources/rec-letters"
              className="flex items-center gap-3 rounded-xl border p-3 transition-all duration-200 hover:border-[rgba(74,111,165,0.25)] hover:shadow-sm"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.6)" }}
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ background: "rgba(74,111,165,0.10)", color: "#4A6FA5" }}
              >
                <FileText className="h-3.5 w-3.5" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-[12px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Read the full recommendation letter guide</p>
                <p className="text-[11px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>How to ask, who to choose, and what makes a strong letter</p>
              </div>
            </Link>
            <Link
              href="/tracker"
              className="flex items-center gap-3 rounded-xl border p-3 transition-all duration-200 hover:border-[rgba(74,111,165,0.25)] hover:shadow-sm"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.6)" }}
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ background: "rgba(74,111,165,0.10)", color: "#4A6FA5" }}
              >
                <FileText className="h-3.5 w-3.5" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-[12px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Track application progress</p>
                <p className="text-[11px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>Mark recs as requested and submitted for each school</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
