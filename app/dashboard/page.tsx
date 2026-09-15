import { auth, currentUser } from "@/lib/clerk-shim-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { effectivePlan } from "@/lib/utils";
import { OnboardingCard } from "@/components/onboarding-card";
import { DashboardSocialProof } from "@/components/DashboardSocialProof";
import { ScoreProgress } from "@/components/ScoreProgress";
import { EmptyDashboard } from "@/components/illustrations/EmptyDashboard";
import {
  UserRoundPlus,
  ScanSearch,
  PenLine,
  GraduationCap,
  Award,
  Sun,
  Trophy,
  BookOpen,
  MessageCircle,
  CreditCard,
  ClipboardList,
  Mic,
  FileText as FileTextIcon,
  ArrowRight,
  Brain,
  CalendarDays,
} from "lucide-react";
import { CopyReferralButton } from "@/components/CopyReferralButton";
import { TrialUsageBar } from "@/components/TrialUsageBar";
import { buildReferralUrl } from "@/lib/site-url";
import { generateReferralCode } from "@/lib/referral";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };

/**
 * Dashboard — server-component-only edition.
 *
 * Background: the previous 850-line dashboard repeatedly tripped a server
 * component render error in production (digest 42889266) that no level of
 * try/catch around the body could absorb — strongly suggesting the throw
 * was at module-evaluation time inside one of the imported client widgets
 * (DashboardToolsGrid / OnboardingCard / ErrorBoundary). Verified by
 * stripping the page to a minimal version: minimal worked.
 *
 * This rebuild keeps everything the user actually NEEDED on the home tab
 * but drops every client component import. No framer-motion entrance,
 * no localStorage onboarding nudge, no class-based ErrorBoundary. Result
 * is a richer-than-minimal dashboard that physically can't trip the same
 * trap the old one did. The previous page is preserved as `_page.tsx.bak`.
 *
 * What's intentionally kept:
 *   - auth + redirect
 *   - server-side Prisma lookups (user / essays / colleges) — each in
 *     try/catch with sane fallbacks
 *   - latest score chip (from JSON column, defensively parsed)
 *   - completion-percentage progress bar
 *   - free-tier promo card
 *   - tools grid (server-only Link cards, no motion)
 *   - recent-analyses list (server-rendered)
 *
 * What's deferred to a follow-up:
 *   - the framer-motion staggered tools entrance
 *   - the AnimatedNumber count-up (we use raw integers)
 *
 * Re-added (Phase 13):
 *   - OnboardingCard (client island for localStorage dismiss gating)
 */
const DAILY_TIPS = [
  "Schools that track demonstrated interest weigh campus visits. Visiting in person shows genuine interest and helps your application.",
  "The most common essay mistake? Writing about what happened TO you instead of what you LEARNED from it.",
  "Schools weigh course rigor more than GPA. An A in regular classes is worth less than a B+ in AP.",
  "Admissions officers spend an average of 7-8 minutes on each application. Your spike needs to jump off the page.",
  "Early Decision applicants are accepted at 2-3x the regular decision rate at most selective schools.",
  "Students with a clear 'spike' (deep expertise in one area) are admitted at higher rates than well-rounded applicants.",
  "Teacher recommendations from junior year carry the most weight. Build those relationships NOW.",
  "The supplemental essay is where most students lose. Research the school deeply and be specific about WHY there.",
  "Financial aid tip: The FAFSA opens October 1. Filing in the first two weeks maximizes your aid package.",
  "Demonstrated interest matters at 40%+ of private schools. Track your interactions with each school.",
  "Students who apply to 8-12 schools have the best outcomes. Too few is risky. Too many dilutes essay quality.",
  "Your activities list should show depth, not breadth. 2-3 deep commitments beat 10 shallow ones.",
  "Community college transfer to a UC can have significantly higher acceptance rates than freshman admission at competitive UCs.",
  "Schools can see if you opened their emails. Every click is a data point for demonstrated interest.",
  "The average admitted student at a T20 school has 4+ years in their primary extracurricular.",
  "Test-optional doesn't mean test-blind. If your score is above the school's 25th percentile, submit it.",
  "Letters of continued interest after a waitlist decision are widely read by admissions committees. Always send one.",
  "Starting college prep before junior year gives you more time to build depth in extracurriculars and strengthen your profile.",
  "Merit scholarships peak at schools ranked 20-50. T10 schools rarely offer merit aid — it's all need-based.",
  "The best college list has 3 safeties, 4-5 targets, and 3-4 reaches. Imbalanced lists lead to disappointment.",
  "Interviews demonstrate interest and give you a chance to convey personality beyond the application. Always accept an interview offer.",
  "Your senior year grades matter. Colleges routinely rescind offers for significant grade drops.",
  "Research experience strengthens your spike and demonstrates intellectual curiosity. Start reaching out to professors now.",
  "The Common App allows 150 characters for activity descriptions. Every word must earn its place.",
  "Need-blind schools don't consider your ability to pay. But only 6% of US colleges are truly need-blind for all applicants.",
  "Summer programs at target schools don't significantly boost admissions — but the skills and projects you build there do.",
  "Admissions officers check social media. Google yourself and clean up anything that doesn't match your application narrative.",
  "Students who use the additional information section strategically (not as overflow) have stronger applications.",
  "The most competitive majors (CS, engineering, nursing) often have separate, lower admit rates. Factor this into your list.",
  "Waitlist conversion rates average 7-20%. Your letter of continued interest is the single biggest factor.",
  "Schools share applicant data. Applying to 5 schools in the same conference sends a clear signal about your preferences.",
  "First-generation applicants have a 5-10% admissions boost at most selective schools. Always check the box if eligible.",
  "The best recommenders aren't always from your best class — they're from the class where you grew the most.",
  "Gap years are increasingly accepted. Most schools that approve gap year requests will hold your spot for the following year.",
  "Your college essay should be about a moment, not a montage. Zoom in on one specific experience.",
  "Attending admitted student days helps you make a confident decision and signals strong intent to enroll, which schools track for yield.",
  "AP scores of 4-5 can save you a full semester of college tuition through course credits.",
  "Scholarship applications peak in November and February. Apply to at least 5-10 local scholarships with lower competition.",
  "The most effective demonstrated interest? Attending an info session, then emailing the regional admissions officer with a specific question.",
  "Your intended major signals matter. 'Undecided' is fine at most schools but hurts at specialized programs.",
  "Students who complete their applications 2+ weeks before the deadline have measurably stronger submissions.",
  "Net price calculators on school websites are accurate within 10%. Run them for every school on your list.",
  "Transfer acceptance rates are often higher than freshman rates at T20s. It's a viable strategic path.",
  "Schools value authenticity over perfection. The best essays reveal vulnerability and genuine self-reflection.",
  "Athletic recruitment timelines start sophomore year for many sports. If you're an athlete, don't wait.",
  "International students face different admit rates at most schools. Research school-specific international admission data.",
  "Work experience counts as an extracurricular. Students who work to support their family tell a compelling story.",
  "The 'Why Us' essay is a love letter to the school. Name specific professors, programs, clubs, and traditions.",
  "Your GPA trend matters as much as the number. An upward trend signals growth and resilience.",
  "Legacy status provides a measurable advantage at most private schools. If you have it, use it strategically.",
  "Students with strong AP English Language and Literature scores demonstrate writing ability that admissions readers value at writing-focused schools.",
  "Application fee waivers are available at nearly every school. Never let cost prevent you from applying.",
];

function DailyTipCard() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24),
  );
  const tipIndex = dayOfYear % DAILY_TIPS.length;
  const tip = DAILY_TIPS[tipIndex];

  return (
    <section
      className="mb-8 border p-5"
      style={{
        background: "rgba(255,255,255,0.45)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderColor: "rgba(0,0,0,0.06)",
        borderRadius: "14px",
      }}
    >
      <div className="flex items-start gap-4">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0"
          style={{ background: "rgba(77,166,122,0.12)", color: "#4DA67A" }}
        >
          <GraduationCap className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <p
            className="text-[11px] uppercase mb-1"
            style={{ color: "#4DA67A", fontWeight: 700, letterSpacing: "0.12em" }}
          >
            Today&apos;s college tip
          </p>
          <p
            className="text-[15px] leading-snug"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontWeight: 600 }}
          >
            {tip}
          </p>
          <div className="flex items-center gap-4 mt-3">
            <Link
              href="/this-week"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors hover:opacity-80"
              style={{ color: "#4A6FA5" }}
            >
              This Week in Admissions <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </Link>
            <Link
              href="/what-if"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors hover:opacity-80"
              style={{ color: "#4A6FA5" }}
            >
              What-If Modeler <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Greeting — Clerk is best-effort; never let a transient JWT blip kill the page.
  let firstName: string | null = null;
  try {
    const u = await currentUser();
    firstName = u?.firstName ?? null;
  } catch (err) {
    console.error("[dashboard] currentUser:", err);
  }

  // Wide try/catch around every server data fetch. Each Prisma call has its
  // own .catch fallback so a single dead query doesn't take the page down.
  type DashUser = {
    id: string;
    plan: string | null;
    stripeSubscriptionId: string | null;
    isInternal: boolean;
    trialStartedAt: Date | null;
    analysisCount: number;
    trialEssayCount: number;
    trialChatCount: number;
    profile: unknown;
    analyses: Array<{ id: string; type: string; createdAt: Date; result: unknown }>;
  };
  let user: DashUser | null = null;
  try {
    // findFirst + deletedAt: null on the User AND on the analyses include.
    // Without the include filter, a soft-deleted Analysis still appeared in
    // the dashboard "recent" list — the user already chose to remove it.
    // Without the User filter, a tombstoned account kept rendering the chrome
    // at /dashboard after delete.
    user = (await prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      include: {
        profile: true,
        analyses: {
          where: { deletedAt: null },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    })) as unknown as DashUser | null;
  } catch (err) {
    console.error("[dashboard] user.findFirst:", err);
  }

  // Auto-create a row if Clerk webhook hasn't run. Best-effort.
  if (!user) {
    try {
      const fallbackEmail = `${userId}@unknown.admitpath`;
      user = (await prisma.user.create({
        data: { id: userId, email: fallbackEmail, plan: "free" },
        include: { profile: true, analyses: { orderBy: { createdAt: "desc" }, take: 5 } },
      })) as unknown as DashUser | null;
    } catch (err) {
      console.error("[dashboard] user.create:", err);
    }
  }

  // Final fallback: synthesize a minimal user object so the page still renders.
  const safeUser: DashUser = user ?? {
    id: userId,
    plan: "free",
    stripeSubscriptionId: null,
    isInternal: false,
    trialStartedAt: null,
    analysisCount: 0,
    trialEssayCount: 0,
    trialChatCount: 0,
    profile: null,
    analyses: [],
  };

  if (!Array.isArray(safeUser.analyses)) safeUser.analyses = [];
  if (typeof safeUser.analysisCount !== "number" || !Number.isFinite(safeUser.analysisCount)) {
    safeUser.analysisCount = 0;
  }

  const [essayCount, collegeCount] = await Promise.all([
    prisma.essay.count({ where: { userId, deletedAt: null } }).catch(() => 0),
    prisma.collegeList.count({ where: { userId, deletedAt: null } }).catch(() => 0),
  ]);

  let eff = "free";
  try {
    eff = effectivePlan(safeUser);
  } catch (err) {
    console.error("[dashboard] effectivePlan:", err);
  }
  const isPaid = eff === "pro";
  const planLabel = eff === "free" ? "Free" : "Pro";
  const hasProfile = !!safeUser.profile;
  const hasAnalysis = safeUser.analysisCount > 0;

  // Latest score — defensive JSON parse.
  const latestAnalysis = safeUser.analyses[0] ?? null;
  let overallScore: number | null = null;
  try {
    const raw = latestAnalysis?.result as unknown;
    const obj =
      raw && typeof raw === "object"
        ? (raw as Record<string, unknown>)
        : typeof raw === "string"
          ? (JSON.parse(raw) as Record<string, unknown>)
          : null;
    const v = obj?.overallScore;
    if (typeof v === "number" && Number.isFinite(v)) overallScore = v;
    else if (typeof v === "string" && Number.isFinite(parseFloat(v))) {
      overallScore = parseFloat(v);
    }
  } catch { /* leave null */ }

  // Build analysis entries for ScoreProgress component
  const progressAnalyses = safeUser.analyses.map((a) => {
    let aScore: number | null = null;
    let aScores: Record<string, number> | undefined;
    try {
      const raw = a.result as unknown;
      const obj =
        raw && typeof raw === "object"
          ? (raw as Record<string, unknown>)
          : typeof raw === "string"
            ? (JSON.parse(raw) as Record<string, unknown>)
            : null;
      const v = obj?.overallScore;
      if (typeof v === "number" && Number.isFinite(v)) aScore = v;
      else if (typeof v === "string" && Number.isFinite(parseFloat(v))) {
        aScore = parseFloat(v);
      }
      const sc = obj?.scores;
      if (sc && typeof sc === "object") {
        aScores = sc as Record<string, number>;
      }
    } catch { /* skip */ }
    return {
      id: a.id,
      createdAt: a.createdAt instanceof Date ? a.createdAt.toISOString() : String(a.createdAt),
      overallScore: aScore,
      scores: aScores,
    };
  });

  // Force profile completion — if user has no profile, redirect to create one
  if (!hasProfile) {
    redirect("/profile/create");
  }

  const completionSteps = [
    { done: hasProfile, label: "Profile created", href: "/profile/create" },
    { done: hasAnalysis, label: "First analysis run", href: "/analyze" },
    { done: essayCount > 0, label: "Essay scored", href: "/essays" },
    { done: collegeCount > 0, label: "College list built", href: "/colleges" },
  ];
  const completionPct = Math.round(
    (completionSteps.filter((s) => s.done).length / completionSteps.length) * 100
  );

  const allTools = [
    {
      href: "/profile/create",
      label: hasProfile ? "Update profile" : "Create profile",
      desc: hasProfile
        ? "Keep your academic record current."
        : "Build the foundation we score against.",
      done: hasProfile,
      icon: UserRoundPlus,
      plusOnly: false,
    },
    {
      href: "/analyze",
      label: "Run analysis",
      desc: "Score your profile across the seven admissions dimensions.",
      done: hasAnalysis,
      icon: ScanSearch,
      plusOnly: false,
    },
    {
      href: "/essays",
      label: "Essay feedback",
      desc: "Line-by-line feedback against the six-dimension rubric.",
      done: essayCount > 0,
      icon: PenLine,
      plusOnly: false,
    },
    {
      href: "/colleges",
      label: "College list",
      desc: "Curate reach, target, and safety schools in one place.",
      done: collegeCount > 0,
      icon: GraduationCap,
      plusOnly: false,
    },
    {
      href: "/chat",
      label: "AI counselor",
      desc: "Ask anything — your counselor sees what you're working on.",
      done: false,
      icon: MessageCircle,
      plusOnly: false,
    },
    {
      href: "/resources",
      label: "Guides",
      desc: "Common App + supplemental essay prompts, deadlines, FAFSA.",
      done: false,
      icon: BookOpen,
      plusOnly: false,
    },
    {
      href: "/billing",
      label: "Plan & billing",
      desc: "Manage subscription, invoices, and your current usage.",
      done: false,
      icon: CreditCard,
      plusOnly: false,
    },
    {
      href: "/what-if",
      label: "What-If Modeler",
      desc: "See how changes to your GPA, SAT, or activities shift admission bands in real time.",
      done: false,
      icon: ScanSearch,
      plusOnly: true,
    },
    {
      href: "/this-week",
      label: "This Week in Admissions",
      desc: "Deadlines, scholarship alerts, tips, and news — updated weekly.",
      done: false,
      icon: BookOpen,
      plusOnly: true,
    },
    {
      href: "/outcomes",
      label: "Report outcomes",
      desc: "Tell us where you got in — your results improve scoring for future students.",
      done: false,
      icon: Trophy,
      plusOnly: true,
    },
    {
      href: "/tracker",
      label: "Application tracker",
      desc: "Track essays, recs, transcripts, and decisions for each school.",
      done: false,
      icon: ClipboardList,
      plusOnly: true,
    },
    {
      href: "/scholarships",
      label: "Scholarship matches",
      desc: "Personalized scholarship picks ranked against your profile.",
      done: false,
      icon: Award,
      plusOnly: true,
    },
    {
      href: "/summer",
      label: "Summer programs",
      desc: "Reach, target, and safety summer opportunities for your stats.",
      done: false,
      icon: Sun,
      plusOnly: true,
    },
    {
      href: "/competitions",
      label: "Competition matches",
      desc: "Spike-building competitions ranked by your major and grade.",
      done: false,
      icon: Trophy,
      plusOnly: true,
    },
    {
      href: "/interview-practice",
      label: "Interview practice",
      desc: "Mock interview with AI feedback on clarity, specificity, and authenticity.",
      done: false,
      icon: Mic,
      plusOnly: true,
    },
    {
      href: "/rec-letters",
      label: "Recommendation letters",
      desc: "Track recommenders, update status, and generate brag sheets for your teachers.",
      done: false,
      icon: FileTextIcon,
      plusOnly: true,
    },
    {
      href: "/parent",
      label: "Parent view",
      desc: "Share a read-only progress summary with your parents.",
      done: false,
      icon: UserRoundPlus,
      plusOnly: true,
    },
  ];

  // Sort: free features first, Pro-only features at the bottom (unless user is paid)
  const tools = isPaid
    ? allTools
    : [
        ...allTools.filter(t => !t.plusOnly),
        ...allTools.filter(t => t.plusOnly),
      ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <main id="main" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8" aria-label="Dashboard">

        {/* Header */}
        <header className="mb-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <CalendarDays className="h-3.5 w-3.5" style={{ color: "var(--dl-text-muted, #8890A5)" }} />
                <p
                  className="text-[12px]"
                  style={{ color: "var(--dl-text-muted, #8890A5)", fontFamily: "var(--font-inter)" }}
                >
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <p
                className="text-[11px] uppercase"
                style={{ color: "#4A6FA5", fontWeight: 700, letterSpacing: "0.12em" }}
              >
                {planLabel} plan
              </p>
              <h1
                className="mt-2 text-[40px] leading-[1.05] sm:text-[48px]"
                style={{
                  color: "var(--dl-text-primary, #1B2030)",
                  fontFamily: "var(--font-inter)",
                  letterSpacing: "-0.02em",
                }}
              >
                {hasAnalysis
                  ? firstName ? `Welcome back, ${firstName}.` : "Welcome back."
                  : firstName ? `Welcome, ${firstName}.` : "Welcome."}
              </h1>
              <p
                className="mt-3 max-w-xl text-[15px] leading-relaxed"
                style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}
              >
                {hasAnalysis
                  ? hasProfile
                    ? `You're making progress. Keep building your profile and improving your scores.`
                    : "You're getting stronger every time you come back. Pick up where you left off."
                  : hasProfile
                    ? "Your profile is saved. Run your first analysis to see where you stand."
                    : "This is where it begins. Build your profile, see your real score, and turn uncertainty into a plan."}
              </p>
            </div>

            {/* Quick usage stats */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-center">
                <p
                  className="text-[22px] font-extrabold tabular-nums leading-none"
                  style={{ color: "#4A6FA5", fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  {safeUser.analysisCount}
                </p>
                <p className="text-[11px] mt-1" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
                  Analyses
                </p>
              </div>
              <div
                className="h-8 w-px"
                style={{ background: "rgba(0,0,0,0.08)" }}
              />
              <div className="text-center">
                <p
                  className="text-[22px] font-extrabold tabular-nums leading-none"
                  style={{ color: "#4A6FA5", fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  {essayCount}
                </p>
                <p className="text-[11px] mt-1" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
                  Essays
                </p>
              </div>
              <div
                className="h-8 w-px"
                style={{ background: "rgba(0,0,0,0.08)" }}
              />
              <div className="text-center">
                <p
                  className="text-[22px] font-extrabold tabular-nums leading-none"
                  style={{ color: "#4A6FA5", fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  {collegeCount}
                </p>
                <p className="text-[11px] mt-1" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
                  Schools
                </p>
              </div>
            </div>

            {overallScore !== null && (
              <Link
                href="/analyze"
                className="dl-card-hover group inline-flex items-center gap-4 self-start border px-5 py-4 transition-all duration-200 hover:shadow-[0_2px_12px_rgba(74,111,165,0.08)]"
                style={{
                  background: "rgba(255,255,255,0.45)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderColor: "rgba(0,0,0,0.06)",
                  borderRadius: "14px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <div>
                  <p
                    className="text-[11px] uppercase"
                    style={{ color: "#4A6FA5", fontWeight: 700, letterSpacing: "0.12em" }}
                  >
                    Latest score
                  </p>
                  <p
                    className="mt-1 text-[34px] leading-none tabular-nums"
                    style={{
                      color: "#4A6FA5",
                      fontFamily: "var(--font-jetbrains-mono)",
                    }}
                  >
                    {Math.round(overallScore)}
                    <span
                      className="ml-1 align-top text-[13px]"
                      style={{ color: "#5A6275", fontFamily: "var(--font-inter)" }}
                    >
                      / 100
                    </span>
                  </p>
                </div>
              </Link>
            )}
          </div>
        </header>


        {/* Hook Model — Variable Reward: Daily insight that changes each visit */}
        <section
          className="mb-8 border p-5"
          style={{
            background: "linear-gradient(135deg, rgba(74,111,165,0.06), rgba(74,111,165,0.02))",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderColor: "rgba(74,111,165,0.12)",
            borderRadius: "14px",
          }}
        >
          <div className="flex items-start gap-4">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0"
              style={{ background: "rgba(74,111,165,0.12)", color: "#4A6FA5" }}
            >
              <Brain className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <p
                className="text-[11px] uppercase mb-1"
                style={{ color: "#4A6FA5", fontWeight: 700, letterSpacing: "0.12em" }}
              >
                Today&apos;s insight
              </p>
              <p
                className="text-[15px] leading-snug"
                style={{ color: "var(--dl-text-primary, #1B2030)", fontWeight: 600 }}
              >
                {hasAnalysis && overallScore !== null
                  ? overallScore >= 80
                    ? "You're in a strong position. Your future self will thank you for the work you've already put in. Now let's lock it in."
                    : overallScore >= 60
                      ? "You have real potential — and the gap between where you are and where you want to be is smaller than you think."
                      : "Every admitted student started somewhere. The fact that you're here means you're already ahead of most. Here's your next move."
                  : "Your college application starts with one click. Run your first analysis and see exactly where you stand — no guessing, no anxiety."}
              </p>
              {hasAnalysis && (
                <Link
                  href="/analyze"
                  className="inline-flex items-center gap-1.5 mt-2 text-[13px] font-semibold transition-colors hover:opacity-80"
                  style={{ color: "#4A6FA5" }}
                >
                  Re-run analysis to track progress <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Score Progress — THE retention mechanism */}
        <ScoreProgress analyses={progressAnalyses} />

        {/* Daily College Tip — rotates based on day of year for return visits */}
        <DailyTipCard />

        {/* Free-plan usage bar — concise "X of 5 analyses used" summary. */}
        {!isPaid && (
          <TrialUsageBar
            analysisCount={safeUser.analysisCount}
            essayCount={safeUser.trialEssayCount ?? 0}
            chatCount={safeUser.trialChatCount ?? 0}
            collegeCount={collegeCount}
          />
        )}

        {/* Onboarding nudge — client island for localStorage gating.
            Now shows for any user who hasn't completed all 3 getting-started
            steps, with dynamic check-off based on actual completion state. */}
        <OnboardingCard
          eligible={!hasProfile || !hasAnalysis || essayCount === 0}
          hasProfile={hasProfile}
          hasAnalysis={hasAnalysis}
          hasEssay={essayCount > 0}
        />

        {/* Hook Model — Investment: Show how much they've already invested */}
        {(hasProfile || hasAnalysis || essayCount > 0 || collegeCount > 0) && (
          <section
            className="mb-8 border p-5"
            style={{
              background: "rgba(255,255,255,0.45)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderColor: "rgba(0,0,0,0.06)",
              borderRadius: "14px",
            }}
          >
            <p
              className="text-[11px] uppercase mb-3"
              style={{ color: "#4A6FA5", fontWeight: 700, letterSpacing: "0.12em" }}
            >
              Your investment so far
            </p>
            <div className="flex flex-wrap gap-6">
              {[
                { label: "Analyses run", value: safeUser.analysisCount, show: safeUser.analysisCount > 0 },
                { label: "Essays scored", value: essayCount, show: essayCount > 0 },
                { label: "Schools saved", value: collegeCount, show: collegeCount > 0 },
              ].filter(i => i.show).map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span
                    className="text-[22px] leading-none tabular-nums"
                    style={{ color: "#4A6FA5", fontFamily: "var(--font-jetbrains-mono)", fontWeight: 700 }}
                  >
                    {item.value}
                  </span>
                  <span className="text-[12px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[12px]" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Look how far you&apos;ve come. Every step you take here is a step closer to the envelope that changes everything.
            </p>
          </section>
        )}

        {/* Free-tier usage + upgrade nudge — persistent subtle reminders */}
        {!isPaid && (
          <>
            {/* Usage tracker bar */}
            <section
              className="mb-6 border p-5"
              style={{
                background: "rgba(255,255,255,0.45)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderColor: "rgba(74,111,165,0.12)",
                borderRadius: "14px",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <p
                  className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                  style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                >
                  Free plan usage
                </p>
                <Link
                  href="/pricing"
                  className="text-[11px] font-bold uppercase tracking-wider transition-colors hover:opacity-80"
                  style={{ color: "#4A6FA5" }}
                >
                  Remove Free-plan caps
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border p-3" style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.5)" }}>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-[12px] font-medium" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Analyses</span>
                    <span className="text-[12px] font-bold tabular-nums" style={{ color: safeUser.analysisCount >= 5 ? "#EF4444" : "#4A6FA5" }}>
                      {safeUser.analysisCount} / 5
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (safeUser.analysisCount / 5) * 100)}%`,
                        background: safeUser.analysisCount >= 5 ? "#EF4444" : "#4A6FA5",
                      }}
                    />
                  </div>
                </div>
                <div className="rounded-xl border p-3" style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.5)" }}>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-[12px] font-medium" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Essays</span>
                    <span className="text-[12px] font-bold tabular-nums" style={{ color: essayCount >= 5 ? "#EF4444" : "#4A6FA5" }}>
                      {essayCount} / 5
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (essayCount / 5) * 100)}%`,
                        background: essayCount >= 5 ? "#EF4444" : "#4A6FA5",
                      }}
                    />
                  </div>
                </div>
                <div className="rounded-xl border p-3" style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.5)" }}>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-[12px] font-medium" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Schools</span>
                    <span className="text-[12px] font-bold tabular-nums" style={{ color: collegeCount >= 8 ? "#EF4444" : "#4A6FA5" }}>
                      {collegeCount} / 8
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (collegeCount / 8) * 100)}%`,
                        background: collegeCount >= 8 ? "#EF4444" : "#4A6FA5",
                      }}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Dimension teaser — what they're missing */}
            {hasAnalysis && (
              <section
                className="mb-6 border p-5"
                style={{
                  background: "linear-gradient(135deg, rgba(74,111,165,0.06), rgba(30,51,82,0.03))",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderColor: "rgba(74,111,165,0.15)",
                  borderRadius: "14px",
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0"
                    style={{ background: "rgba(74,111,165,0.12)", color: "#4A6FA5" }}
                  >
                    <ScanSearch className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-[15px] font-bold leading-snug mb-1"
                      style={{ color: "var(--dl-text-primary, #1B2030)" }}
                    >
                      Your free analysis covers the basics. Upgrade for the full 7-dimension breakdown.
                    </p>
                    <p className="text-[13px] leading-relaxed mb-3" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                      Paid plans unlock detailed scores across all seven dimensions, a complete roadmap,
                      and school-specific odds. The students who improve fastest see the full picture.
                    </p>
                    <Link
                      href="/pricing"
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors hover:opacity-80"
                      style={{ color: "#4A6FA5" }}
                    >
                      Unlock all 7 dimensions <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                    </Link>
                  </div>
                </div>
              </section>
            )}

            {/* Upgrade CTA card */}
            <section
              className="mb-12 border p-6"
              style={{
                background: "rgba(255,255,255,0.45)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderColor: "rgba(0,0,0,0.06)",
                borderRadius: "14px",
              }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                <div className="min-w-0">
                  <p
                    className="mt-2 text-[17px] leading-snug"
                    style={{
                      color: "var(--dl-text-primary, #1B2030)",
                      fontFamily: "var(--font-inter)",
                      fontWeight: 600,
                    }}
                  >
                    Remove the Free-plan analysis cap and unlock full dimension scores and planning details.
                  </p>
                  <p
                    className="mt-1 text-[14px] leading-relaxed"
                    style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}
                  >
                    Monthly access to the current Pro tools, subject to service availability and abuse safeguards.
                  </p>
                  <p
                    className="mt-2 text-[12px] font-medium"
                    style={{ color: "var(--dl-text-muted, #5A6275)" }}
                  >
                    Stripe-secured
                  </p>
                </div>
                <Link
                  href="/pricing"
                  className="dl-btn dl-btn-primary shrink-0"
                >
                  Upgrade now &rarr;
                </Link>
              </div>
            </section>
          </>
        )}

        {/* Profile completion */}
        <section
          className="mb-12 border p-6"
          style={{
            background: "rgba(255,255,255,0.45)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderColor: "rgba(0,0,0,0.06)",
            borderRadius: "14px",
          }}
        >
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <div>
              <p
                className="text-[11px] uppercase"
                style={{ color: "#4A6FA5", fontWeight: 700, letterSpacing: "0.12em" }}
              >
                Profile completion
              </p>
              <p
                className="mt-1 text-[14px]"
                style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}
              >
                {completionPct === 100
                  ? "All set. Re-run analysis any time to track progress."
                  : `${completionSteps.filter((s) => s.done).length} of ${completionSteps.length} milestones cleared.`}
              </p>
            </div>
            <span
              className="text-[28px] leading-none tabular-nums"
              style={{ color: "#4A6FA5", fontFamily: "var(--font-jetbrains-mono)" }}
            >
              {completionPct}
              <span className="text-[14px]" style={{ color: "#5A6275" }}>%</span>
            </span>
          </div>
          <div className="mb-5 h-1.5 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.45)" }}>
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${completionPct}%`, background: "#4A6FA5" }}
            />
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {completionSteps.map((step) => {
              const inner = (
                <>
                  <span
                    className="flex h-3.5 w-3.5 items-center justify-center rounded-full"
                    style={{
                      background: step.done ? "#4A6FA5" : "transparent",
                      border: step.done ? "none" : "1.5px solid rgba(0,0,0,0.12)",
                    }}
                    aria-hidden
                  >
                    {step.done && <span className="text-[8px] text-white">&#10003;</span>}
                  </span>
                  <span
                    className="text-[13px]"
                    style={{
                      color: step.done ? "var(--dl-text-primary, #1B2030)" : "var(--dl-text-muted, #5A6275)",
                      fontWeight: step.done ? 500 : 400,
                    }}
                  >
                    {step.label}
                  </span>
                </>
              );

              return step.done ? (
                <div key={step.label} className="flex items-center gap-2">
                  {inner}
                </div>
              ) : (
                <Link
                  key={step.label}
                  href={step.href}
                  className="flex items-center gap-2 transition-colors hover:opacity-80"
                >
                  {inner}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Tools */}
        <section className="mb-14">
          <p
            className="mb-5 text-[11px] uppercase"
            style={{ color: "#4A6FA5", fontWeight: 700, letterSpacing: "0.12em" }}
          >
            Workspace
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) => {
              const isLocked = !isPaid && t.plusOnly;
              const Icon = t.icon;
              const isNextStep = !t.done && !isLocked && t.href === "/profile/create" && !hasProfile;
              return (
                <Link
                  key={t.href}
                  href={isLocked ? "/pricing" : t.href}
                  className="dl-card-hover relative border p-6 transition-all duration-200 hover:border-[rgba(74,111,165,0.15)] hover:shadow-[0_2px_12px_rgba(74,111,165,0.08)]"
                  style={{
                    background: isNextStep
                      ? "rgba(74,111,165,0.06)"
                      : isLocked
                        ? "rgba(255,255,255,0.30)"
                        : "rgba(255,255,255,0.45)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    borderColor: isNextStep
                      ? "rgba(74,111,165,0.18)"
                      : "rgba(0,0,0,0.06)",
                    borderRadius: "14px",
                    opacity: isLocked ? 0.7 : 1,
                  }}
                >
                  {isLocked && (
                    <span
                      className="absolute right-4 top-4 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                      style={{
                        color: "#4A6FA5",
                        background: "rgba(74,111,165,0.08)",
                        border: "1px solid rgba(74,111,165,0.15)",
                      }}
                    >
                      Pro
                    </span>
                  )}
                  <div className="mb-3 flex items-center gap-3">
                    <span
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
                      style={{
                        background: isNextStep ? "rgba(74,111,165,0.12)" : "rgba(74,111,165,0.06)",
                        color: "#4A6FA5",
                      }}
                    >
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                    </span>
                    {t.done && (
                      <span
                        className="rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
                        style={{ color: "var(--success, #16A34A)", background: "var(--success-bg, rgba(22,163,74,0.1))" }}
                      >
                        Done
                      </span>
                    )}
                    {isNextStep && (
                      <span
                        className="rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
                        style={{ color: "#4A6FA5", background: "rgba(74,111,165,0.1)" }}
                      >
                        Start here
                      </span>
                    )}
                  </div>
                  <p
                    className="text-[18px] leading-tight"
                    style={{
                      color: isLocked ? "var(--dl-text-secondary, #454B5E)" : "#1B2030",
                      fontFamily: "var(--font-inter)",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {t.label}
                  </p>
                  <p
                    className="mt-1.5 text-[13.5px] leading-relaxed"
                    style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}
                  >
                    {t.desc}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Pro Preview — blurred insight cards for free users */}
        {!isPaid && (
          <section
            className="mb-14 border p-6"
            style={{
              background: "linear-gradient(135deg, rgba(30,51,82,0.04), rgba(74,111,165,0.03))",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderColor: "rgba(30,51,82,0.12)",
              borderRadius: "14px",
            }}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p
                  className="text-[11px] uppercase"
                  style={{ color: "#4A6FA5", fontWeight: 700, letterSpacing: "0.12em" }}
                >
                  With Pro, you&apos;d also see
                </p>
                <p className="mt-1 text-[13px]" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                  Insights that Pro members use to strengthen their applications
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                {
                  title: "Weekly Score Trend",
                  insight: "Your profile score increased 8 points over the last 3 weeks. Academic Rigor drove most of the gain. Leadership is your next highest-ROI dimension.",
                  label: "Score Analytics",
                },
                {
                  title: "School-Specific Gaps",
                  insight: "For MIT, your spike score needs to be 20+ points higher. Students admitted to MIT average 85+ in Activity Depth. Your current 62 puts you below the competitive range.",
                  label: "Gap Analysis",
                },
                {
                  title: "Deadline Countdown",
                  insight: "Early Action deadlines for 3 of your target schools are in 87 days. Your essay is not yet scored and your recommendation letters aren't tracked.",
                  label: "Timeline Intelligence",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="relative overflow-hidden rounded-xl border p-5"
                  style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.5)" }}
                >
                  <p
                    className="text-[10px] font-bold uppercase tracking-wider mb-2"
                    style={{ color: "#4A6FA5" }}
                  >
                    {card.label}
                  </p>
                  <p
                    className="text-[15px] font-bold leading-snug mb-2"
                    style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                  >
                    {card.title}
                  </p>
                  <p
                    className="text-[12px] leading-relaxed"
                    style={{
                      color: "var(--dl-text-secondary, #454B5E)",
                      filter: "blur(4px)",
                      WebkitFilter: "blur(4px)",
                      userSelect: "none",
                    }}
                  >
                    {card.insight}
                  </p>
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  >
                    <span
                      className="rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider"
                      style={{ background: "rgba(74,111,165,0.12)", color: "#4A6FA5", border: "1px solid rgba(74,111,165,0.15)" }}
                    >
                      Pro
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[12px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                  Analyses without the Free-plan cap, full dimension breakdowns, and progress history help you iterate.
                </p>
                <p className="text-[11px] mt-1" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                  Upgrade to remove the Free-plan analysis cap
                </p>
              </div>
              <Link
                href="/pricing"
                className="dl-btn dl-btn-primary dl-btn-sm shrink-0"
              >
                Unlock for $19.99/mo &rarr;
              </Link>
            </div>
          </section>
        )}

        {/* Recent analyses */}
        <section>
          <div className="mb-5 flex items-end justify-between">
            <p
              className="text-[11px] uppercase"
              style={{ color: "#4A6FA5", fontWeight: 700, letterSpacing: "0.12em" }}
            >
              Recent analyses
            </p>
            {safeUser.analyses.length > 0 && (
              <Link
                href="/analyze"
                className="text-[13px] font-semibold transition-colors hover:opacity-80"
                style={{ color: "#4A6FA5" }}
              >
                New analysis &rarr;
              </Link>
            )}
          </div>

          {safeUser.analyses.length > 0 ? (
            <div
              className="overflow-hidden border"
              style={{
                borderColor: "rgba(0,0,0,0.06)",
                background: "rgba(255,255,255,0.45)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderRadius: "14px",
              }}
            >
              {safeUser.analyses.map((a, i) => {
                let result: Record<string, unknown> | null = null;
                try {
                  const raw = a.result as unknown;
                  if (raw && typeof raw === "object") result = raw as Record<string, unknown>;
                  else if (typeof raw === "string") result = JSON.parse(raw) as Record<string, unknown>;
                } catch { /* null */ }
                const rs = result?.overallScore;
                const score =
                  typeof rs === "number" && Number.isFinite(rs)
                    ? rs
                    : typeof rs === "string" && Number.isFinite(parseFloat(rs))
                      ? parseFloat(rs)
                      : null;

                let dateLabel = "—";
                try {
                  const d = new Date(a.createdAt);
                  if (!Number.isNaN(d.getTime())) {
                    dateLabel = d.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      timeZone: "UTC",
                    });
                  }
                } catch { /* -- */ }

                return (
                  <Link
                    key={a.id}
                    href="/analyze"
                    className="flex items-center justify-between px-5 py-4 transition-all duration-200 hover:bg-[rgba(74,111,165,0.04)]"
                    style={{
                      borderBottom: i < safeUser.analyses.length - 1 ? "1px solid rgba(0,0,0,0.06)" : undefined,
                    }}
                  >
                    <div className="min-w-0">
                      <p
                        className="text-[14px] capitalize"
                        style={{
                          color: "var(--dl-text-primary, #1B2030)",
                          fontFamily: "var(--font-inter)",
                          fontWeight: 600,
                        }}
                      >
                        {a.type} analysis
                      </p>
                      <p className="mt-0.5 text-[12px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                        {dateLabel}
                      </p>
                    </div>
                    {score !== null && (
                      <span
                        className="text-[22px] leading-none tabular-nums"
                        style={{ color: "#4A6FA5", fontFamily: "var(--font-jetbrains-mono)" }}
                      >
                        {Math.round(score)}
                        <span className="ml-0.5 text-[12px]" style={{ color: "#5A6275" }}>/100</span>
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div
              className="flex flex-col items-center border px-6 py-12 text-center"
              style={{
                borderColor: "rgba(0,0,0,0.06)",
                background: "rgba(255,255,255,0.45)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderRadius: "14px",
              }}
            >
              <EmptyDashboard size={96} className="mb-5 text-[#8890A5]" />
              <p
                className="text-[16px] leading-snug"
                style={{
                  color: "var(--dl-text-primary, #1B2030)",
                  fontFamily: "var(--font-inter)",
                  fontWeight: 600,
                }}
              >
                Your college application starts here.
              </p>
              <p
                className="mt-1.5 max-w-sm text-[14px] leading-relaxed"
                style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}
              >
                {hasProfile
                  ? "Your profile is ready. One click, and you'll know exactly where you stand — across all 7 dimensions. No more guessing."
                  : "Five minutes to build your profile. Then we'll show you the truth about your chances — honest, specific, and with a plan to get better."}
              </p>
              <Link
                href={hasProfile ? "/analyze" : "/profile/create"}
                className="dl-btn dl-btn-primary mt-5"
              >
                {hasProfile ? "Run first analysis" : "Create profile"} &rarr;
              </Link>
            </div>
          )}
        </section>

        {/* Hook Model — Action: One clear next step, reduced friction */}
        <section
          className="mt-14 mb-8 border p-6 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(74,111,165,0.06), rgba(74,111,165,0.03))",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderColor: "rgba(74,111,165,0.12)",
            borderRadius: "14px",
          }}
        >
          <p
            className="text-[11px] uppercase mb-2"
            style={{ color: "#4A6FA5", fontWeight: 700, letterSpacing: "0.12em" }}
          >
            Your next step
          </p>
          <p
            className="text-[20px] leading-snug mb-1"
            style={{
              color: "var(--dl-text-primary, #1B2030)",
              fontFamily: "var(--font-inter)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            {/* hasProfile is always true here — the onboarding gate at
                line 328 redirects users without a profile to /profile/create */}
            {!hasAnalysis
              ? "Run your first 7-dimension analysis"
              : essayCount === 0
                ? "Score your first essay"
                : collegeCount === 0
                  ? "Build your college list"
                  : "Re-run your analysis to track progress"}
          </p>
          <p
            className="text-[14px] leading-relaxed mb-5 mx-auto"
            style={{ color: "var(--dl-text-secondary, #454B5E)", maxWidth: 460 }}
          >
            {!hasAnalysis
              ? "The moment you've been waiting for. See exactly where you stand — honestly, specifically, across all 7 dimensions."
              : essayCount === 0
                ? "Your essay is your voice. Paste your draft and we'll show you exactly what an admissions reader would think."
                : collegeCount === 0
                  ? "Dream big, plan smart. Add your schools and we'll show you your real odds at each one."
                  : "You're stronger than last time. Re-run and see how far you've come."}
          </p>
          <Link
            href={
              !hasAnalysis
                ? "/analyze"
                : essayCount === 0
                  ? "/essays"
                  : collegeCount === 0
                    ? "/colleges"
                    : "/analyze"
            }
            className="dl-btn dl-btn-primary"
          >
            {!hasAnalysis
              ? "Run analysis"
              : essayCount === 0
                ? "Score an essay"
                : collegeCount === 0
                  ? "Build college list"
                  : "Re-run analysis"}{" "}
            &rarr;
          </Link>
        </section>

        {/* Referral program — invite a friend, get a free month */}
        <section
          className="mt-14 border p-6"
          style={{
            background: "linear-gradient(135deg, rgba(74,111,165,0.04), rgba(30,51,82,0.03))",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderColor: "rgba(74,111,165,0.12)",
            borderRadius: "14px",
          }}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5 mb-2">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ background: "rgba(74,111,165,0.1)", color: "#4A6FA5" }}
                  aria-hidden
                >
                  <UserRoundPlus className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <p
                  className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                  style={{ color: "#4A6FA5" }}
                >
                  Referral program
                </p>
              </div>
              <p
                className="text-[20px] leading-snug"
                style={{
                  color: "var(--dl-text-primary, #1B2030)",
                  fontFamily: "var(--font-inter)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                Invite a friend, get a free month
              </p>
              <p
                className="mt-2 text-[14px] leading-relaxed"
                style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}
              >
                For every friend who upgrades to a paid plan, you get <strong>1 free month</strong> added to your subscription.
                Your friend gets <strong>1 free month</strong> too. No limit on how many months you can earn.
              </p>

              {/* How it works steps */}
              <div className="mt-4 flex flex-wrap gap-4">
                {[
                  { step: "1", text: "Share your unique link" },
                  { step: "2", text: "Friend signs up and upgrades" },
                  { step: "3", text: "You both get 1 free month" },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-2">
                    <span
                      className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ background: "#4A6FA5" }}
                    >
                      {item.step}
                    </span>
                    <span
                      className="text-[12px] font-medium"
                      style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:items-end shrink-0">
              <div
                className="flex items-center gap-2 rounded-lg border px-4 py-2.5"
                style={{
                  borderColor: "rgba(74,111,165,0.15)",
                  background: "rgba(255,255,255,0.6)",
                }}
              >
                <code
                  className="text-[13px] tabular-nums select-all"
                  style={{ color: "var(--dl-brand, #4A6FA5)", fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  {buildReferralUrl(generateReferralCode(userId)).replace(/^https?:\/\//, "")}
                </code>
                <CopyReferralButton url={buildReferralUrl(generateReferralCode(userId))} />
              </div>
              {/* Copy link is the only share action */}
              <p
                className="text-[11px] mt-1"
                style={{ color: "var(--dl-text-muted, #5A6275)" }}
              >
                Earn up to 12 referral months. Qualifying upgrades receive one month of credit.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Social proof toasts for logged-in users — friend scores + school activity */}
      <DashboardSocialProof />
    </div>
  );
}
