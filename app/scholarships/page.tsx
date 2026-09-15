import { redirect } from "next/navigation";
import { getGoogleUser, hasSessionCookie } from "@/lib/google-auth";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import {
  recommendScholarships,
  type ScholarshipRow,
  type StudentSignals,
} from "@/lib/scholarship-matcher";
import scholarshipsRaw from "@/../../public/scholarships.json";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Scholarship Matches",
  description: "Personalized scholarship recommendations matched against your profile.",
  robots: { index: false, follow: false },
};

export default async function ScholarshipsDashboardPage() {
  const googleUser = await getGoogleUser();
  if (!googleUser && !(await hasSessionCookie())) redirect("/sign-in");
  if (!googleUser) redirect("/sign-in");
  const userId = googleUser.id;

  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: {
      grade: true,
      gpa: true,
      satScore: true,
      intendedMajor: true,
      householdIncome: true,
      state: true,
    },
  });

  const signals: StudentSignals = {
    grade: profile?.grade ?? null,
    gpa: profile?.gpa ?? null,
    satScore: profile?.satScore ?? null,
    intendedMajor: profile?.intendedMajor ?? null,
    householdIncome: profile?.householdIncome ?? null,
    state: profile?.state ?? null,
  };

  const profileComplete =
    signals.grade !== null &&
    (signals.gpa !== null || signals.intendedMajor !== null || signals.householdIncome !== null);

  const matches = recommendScholarships(scholarshipsRaw as ScholarshipRow[], signals, 12);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <main id="main" className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: "#4A6FA5" }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to dashboard
        </Link>

        <h1
          className="text-3xl sm:text-4xl leading-tight mb-3"
          style={{
            color: "var(--dl-text-primary, #1B2030)",
            fontFamily: "var(--font-inter)",
            letterSpacing: "-0.02em",
          }}
        >
          Scholarship matches.
        </h1>
        <p
          className="max-w-2xl text-[15px] leading-relaxed mb-10"
          style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}
        >
          Ranked against your profile signals: grade, GPA, SAT, intended major, household income,
          and state. Apply to the top-scoring matches first.
        </p>

        {!profileComplete && (
          <div
            className="mb-8 rounded-2xl border p-5 flex items-start gap-3"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" style={{ color: "#92400E" }} />
            <div>
              <p className="text-[14px] font-semibold mb-1" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                Profile incomplete — matches are weak right now.
              </p>
              <p className="text-[13px]" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                Add at least your grade plus one of GPA / major / household income for personalized
                ranking.{" "}
                <Link href="/profile/create" className="underline" style={{ color: "#4A6FA5" }}>
                  Update profile →
                </Link>
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {matches.map((m, i) => (
            <div
              key={i}
              className="dl-card-hover rounded-2xl border p-5 sm:p-6"
              style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h2
                      className="text-[16px] font-semibold"
                      style={{
                        color: "var(--dl-text-primary, #1B2030)",
                        fontFamily: "var(--font-instrument-sans)",
                      }}
                    >
                      {m.scholarship.name}
                    </h2>
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-mono font-semibold tabular-nums"
                      style={{
                        color: m.matchScore >= 70 ? "#047857" : m.matchScore >= 40 ? "#4A6FA5" : "var(--dl-text-muted, #5A6275)",
                        background: m.matchScore >= 70 ? "#D1FAE5" : m.matchScore >= 40 ? "rgba(74,111,165,0.08)" : "rgba(255,255,255,0.45)",
                      }}
                    >
                      {m.matchScore}/100
                    </span>
                  </div>

                  <p
                    className="text-[20px] font-bold mb-2 tabular-nums"
                    style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                  >
                    {m.scholarship.amount}
                  </p>

                  <p
                    className="text-[14px] leading-relaxed mb-3"
                    style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}
                  >
                    {m.scholarship.description}
                  </p>

                  {m.reasons.length > 0 && (
                    <ul className="mb-2 space-y-1">
                      {m.reasons.map((r, ri) => (
                        <li
                          key={ri}
                          className="flex items-start gap-1.5 text-[12px]"
                          style={{ color: "#047857" }}
                        >
                          <Sparkles className="h-3 w-3 mt-0.5 shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  )}

                  {m.flags.length > 0 && (
                    <ul className="mb-2 space-y-1">
                      {m.flags.map((f, fi) => (
                        <li
                          key={fi}
                          className="flex items-start gap-1.5 text-[12px]"
                          style={{ color: "var(--dl-text-muted, #5A6275)" }}
                        >
                          <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}

                  {m.scoreMeaning && (
                    <p className="mt-2 text-[11px] leading-relaxed" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                      {m.scoreMeaning} Verify the current deadline and eligibility on the official program page.
                    </p>
                  )}

                  {m.nextAction && (
                    <p className="mt-2 text-[12px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                      <span className="font-semibold">Next action:</span> {m.nextAction}
                    </p>
                  )}

                  <div
                    className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px]"
                    style={{ color: "var(--dl-text-muted, #5A6275)" }}
                  >
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Deadline: {m.scholarship.deadline}
                    </span>
                  </div>
                </div>

                <a
                  href={m.scholarship.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-[12px] font-medium"
                  style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
                >
                  Apply
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
