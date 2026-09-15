import { redirect } from "next/navigation";
import { getGoogleUser, hasSessionCookie } from "@/lib/google-auth";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  MapPin,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import {
  recommendPrograms,
  type ProgramRow,
  type ProgramSignals,
  type ProgramMatch,
  type Tier,
} from "@/lib/summer-program-matcher";
import programsRaw from "@/../../public/summer-programs.json";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Summer Program Matches",
  description: "Reach / target / safety summer programs ranked against your profile.",
  robots: { index: false, follow: false },
};

const TIER_LABELS: Record<Tier, { label: string; bg: string; fg: string }> = {
  reach: { label: "Reach", bg: "rgba(156,46,46,0.08)", fg: "#9C2E2E" },
  target: { label: "Target", bg: "rgba(74,111,165,0.08)", fg: "#4A6FA5" },
  safety: { label: "Safety", bg: "#D1FAE5", fg: "#047857" },
};

function ProgramCard({ m }: { m: ProgramMatch }) {
  return (
    <div
      className="dl-card-hover rounded-2xl border p-5"
      style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-1.5">
        <h3
          className="text-[15px] font-semibold"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-instrument-sans)" }}
        >
          {m.program.name}
        </h3>
        <span
          className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-mono font-semibold tabular-nums"
          style={{ color: "var(--dl-text-muted, #5A6275)", background: "rgba(255,255,255,0.45)" }}
        >
          {m.matchScore}/100
        </span>
      </div>

      <p className="text-[12px] mb-2" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
        {m.program.host}
      </p>

      <p
        className="text-[13px] leading-relaxed mb-3"
        style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}
      >
        {m.program.description}
      </p>

      {m.reasons.slice(0, 2).map((r, ri) => (
        <p key={ri} className="flex items-start gap-1.5 text-[11px] mb-1" style={{ color: "#047857" }}>
          <Sparkles className="h-3 w-3 mt-0.5 shrink-0" /> {r}
        </p>
      ))}
      {m.flags.slice(0, 1).map((f, fi) => (
        <p key={fi} className="flex items-start gap-1.5 text-[11px] mb-1" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
          <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" /> {f}
        </p>
      ))}

      <div
        className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]"
        style={{ color: "var(--dl-text-muted, #5A6275)" }}
      >
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" /> {m.program.location}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" /> {m.program.deadline}
        </span>
        <span className="font-mono">{m.program.cost}</span>
      </div>

      <a
        href={m.program.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium"
        style={{ color: "#4A6FA5" }}
      >
        Learn more
        <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}

function TierColumn({
  tier,
  matches,
}: {
  tier: Tier;
  matches: ProgramMatch[];
}) {
  const cfg = TIER_LABELS[tier];
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span
          className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest"
          style={{ background: cfg.bg, color: cfg.fg }}
        >
          {cfg.label}
        </span>
        <span className="text-[11px] font-mono" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
          {matches.length} {matches.length === 1 ? "program" : "programs"}
        </span>
      </div>
      <div className="space-y-3">
        {matches.length === 0 ? (
          <p className="text-[12px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            No matches in this tier yet.
          </p>
        ) : (
          matches.map((m, i) => <ProgramCard key={i} m={m} />)
        )}
      </div>
    </div>
  );
}

export default async function SummerDashboardPage() {
  const googleUser = await getGoogleUser();
  if (!googleUser && !(await hasSessionCookie())) redirect("/sign-in");
  if (!googleUser) redirect("/sign-in");
  const userId = googleUser.id;

  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { grade: true, gpa: true, satScore: true, intendedMajor: true },
  });

  const signals: ProgramSignals = {
    grade: profile?.grade ?? null,
    gpa: profile?.gpa ?? null,
    satScore: profile?.satScore ?? null,
    intendedMajor: profile?.intendedMajor ?? null,
  };

  const profileComplete =
    signals.grade !== null && (signals.gpa !== null || signals.satScore !== null);

  const buckets = recommendPrograms(programsRaw as ProgramRow[], signals);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <main id="main" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium"
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
          Summer programs.
        </h1>
        <p
          className="max-w-2xl text-[15px] leading-relaxed mb-10"
          style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}
        >
          Reach, target, and safety bucketed against your profile strength. Apply to one of each.
        </p>

        {!profileComplete && (
          <div
            className="mb-8 rounded-2xl border p-5 flex items-start gap-3"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" style={{ color: "#92400E" }} />
            <div>
              <p className="text-[14px] font-semibold mb-1" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                Add GPA + grade for accurate tiering.
              </p>
              <p className="text-[13px]" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                Without test/GPA signals, every program lands in target by default.{" "}
                <Link href="/profile/create" className="underline" style={{ color: "#4A6FA5" }}>
                  Update profile →
                </Link>
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TierColumn tier="reach" matches={buckets.reach} />
          <TierColumn tier="target" matches={buckets.target} />
          <TierColumn tier="safety" matches={buckets.safety} />
        </div>
      </main>
    </div>
  );
}
