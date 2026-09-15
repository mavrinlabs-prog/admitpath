import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Award,
  Lightbulb,
  Newspaper,
  Clock,
  AlertTriangle,
  BookOpen,
} from "lucide-react";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "This Week in Admissions",
  description:
    "Weekly admissions deadlines, scholarship alerts, tips, and news curated for college applicants. Stay ahead of the admissions cycle.",
  alternates: { canonical: `${BASE}/this-week` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "This Week in Admissions — Deadlines & Tips",
    description: "Weekly admissions deadlines, scholarship alerts, and actionable tips for college applicants.",
    url: `${BASE}/this-week`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [
      {
        url: `${BASE}/api/og?title=This+Week+in+Admissions&subtitle=Deadlines+%C2%B7+Scholarships+%C2%B7+Tips`,
        width: 1200,
        height: 630,
        alt: "This Week in Admissions — weekly college admissions updates",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@admitpath",
    title: "This Week in Admissions | AdmitPath",
    description: "Weekly admissions deadlines, scholarship alerts, and tips.",
    images: [`${BASE}/api/og?title=This+Week+in+Admissions&subtitle=Deadlines+%C2%B7+Scholarships+%C2%B7+Tips`],
  },
};

/* ── Content for the current week (in production, CMS-driven) ────── */
const WEEK_LABEL = "May 12 - May 18, 2026";

const DEADLINES = [
  {
    date: "May 15",
    title: "College Decision Day (extended)",
    detail:
      "Most schools have extended their deposit deadline to May 15. If you haven't committed yet, today is the day.",
  },
  {
    date: "May 17",
    title: "AP Exams wrap up",
    detail:
      "Final AP exams this week. Scores release in July. If you're a junior, these can strengthen your transcript narrative.",
  },
  {
    date: "May 18",
    title: "FAFSA Corrections Deadline (some states)",
    detail:
      "Several states close their FAFSA correction window this week. Double-check your Student Aid Report (SAR).",
  },
];

const SCHOLARSHIP_SPOTLIGHT = {
  name: "Gates Scholarship",
  amount: "Full ride",
  deadline: "September 15, 2026",
  eligibility: "High school seniors, Pell-eligible, minimum 3.3 GPA",
  link: "https://www.thegatesscholarship.org/",
  note: "Covers full cost of attendance at any accredited 4-year university. Applications open in August -- start preparing your essays now.",
};

const TIP_OF_THE_WEEK = {
  title: "The Power of Demonstrated Interest",
  body: "Students who visit campus are 15% more likely to be admitted at schools that track demonstrated interest. Can't visit? Attend virtual info sessions, email admissions officers with specific questions about programs, and engage with the school's social media. Many schools log every touchpoint.",
};

const DID_YOU_KNOW = {
  fact: "43% of admitted students at T20 schools had a research experience in high school.",
  source: "NACAC State of College Admissions Report",
};

const NEWS_ITEMS = [
  {
    headline: "Harvard reinstates standardized testing requirement for Class of 2031",
    summary:
      "After a 4-year test-optional period, Harvard announced that SAT/ACT scores will once again be required for applicants to the Class of 2031.",
  },
  {
    headline: "Common App reports record 8.2 million applications for 2025-26 cycle",
    summary:
      "Application volumes continue to rise, with the average student applying to 9.4 schools -- up from 7.8 five years ago.",
  },
];

function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border p-6 ${className}`}
      style={{
        background: "rgba(255,255,255,0.45)",
        backdropFilter: "blur(12px)",
        borderColor: "rgba(0,0,0,0.06)",
        borderRadius: "14px",
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({
  icon: Icon,
  label,
}: {
  icon: typeof Calendar;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span
        className="flex h-8 w-8 items-center justify-center rounded-lg"
        style={{ background: "rgba(74,111,165,0.1)", color: "#4A6FA5" }}
      >
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </span>
      <p
        className="text-[11px] uppercase"
        style={{ color: "#4A6FA5", fontWeight: 700, letterSpacing: "0.12em" }}
      >
        {label}
      </p>
    </div>
  );
}

const thisWeekSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${BASE}/this-week#page`,
      url: `${BASE}/this-week`,
      name: "This Week in Admissions — Deadlines, Tips & News",
      description: "Weekly admissions deadlines, scholarship alerts, tips, and news curated for college applicants.",
      isPartOf: { "@id": `${BASE}/#website` },
      inLanguage: "en-US",
      dateModified: new Date().toISOString(),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "This Week", item: `${BASE}/this-week` },
      ],
    },
  ],
};

export default function ThisWeekPage() {
  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(thisWeekSchema) }}
    />
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}
    >
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-medium mb-6 transition-colors hover:opacity-80"
            style={{ color: "var(--dl-brand, #4A6FA5)" }}
          >
            <ArrowRight
              className="h-3.5 w-3.5 rotate-180"
              strokeWidth={2}
            />
            Back to dashboard
          </Link>
          <p
            className="text-[11px] uppercase mb-2"
            style={{
              color: "#4A6FA5",
              fontWeight: 700,
              letterSpacing: "0.12em",
            }}
          >
            Weekly Briefing
          </p>
          <h1
            className="text-[36px] leading-[1.1] sm:text-[44px]"
            style={{
              color: "var(--dl-text-primary, #1B2030)",
              fontFamily: "var(--font-inter)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            This Week in Admissions
          </h1>
          <p
            className="mt-2 text-[15px]"
            style={{ color: "var(--dl-text-secondary, #454B5E)" }}
          >
            {WEEK_LABEL}
          </p>
        </div>

        <div className="space-y-6">
          {/* Deadlines */}
          <SectionCard>
            <SectionLabel icon={Clock} label="Deadlines this week" />
            <div className="space-y-4">
              {DEADLINES.map((d) => (
                <div
                  key={d.title}
                  className="flex gap-4"
                  style={{
                    paddingBottom: 16,
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="shrink-0 w-16">
                    <span
                      className="text-[13px] font-bold tabular-nums"
                      style={{
                        color: "#4A6FA5",
                        fontFamily: "var(--font-jetbrains-mono)",
                      }}
                    >
                      {d.date}
                    </span>
                  </div>
                  <div>
                    <p
                      className="text-[14px] font-bold"
                      style={{ color: "var(--dl-text-primary, #1B2030)" }}
                    >
                      {d.title}
                    </p>
                    <p
                      className="text-[13px] mt-1 leading-relaxed"
                      style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                    >
                      {d.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Scholarship Spotlight */}
          <SectionCard>
            <SectionLabel icon={Award} label="Scholarship spotlight" />
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <p
                  className="text-[18px] font-bold"
                  style={{
                    color: "var(--dl-text-primary, #1B2030)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {SCHOLARSHIP_SPOTLIGHT.name}
                </p>
                <div className="flex flex-wrap gap-3 mt-2">
                  <span
                    className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                    style={{
                      background: "rgba(22,163,74,0.1)",
                      color: "#16A34A",
                    }}
                  >
                    {SCHOLARSHIP_SPOTLIGHT.amount}
                  </span>
                  <span
                    className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                    style={{
                      background: "rgba(74,111,165,0.1)",
                      color: "#4A6FA5",
                    }}
                  >
                    Deadline: {SCHOLARSHIP_SPOTLIGHT.deadline}
                  </span>
                </div>
                <p
                  className="text-[12px] mt-2"
                  style={{ color: "var(--dl-text-muted, #5A6275)" }}
                >
                  Eligibility: {SCHOLARSHIP_SPOTLIGHT.eligibility}
                </p>
                <p
                  className="text-[13px] mt-3 leading-relaxed"
                  style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                >
                  {SCHOLARSHIP_SPOTLIGHT.note}
                </p>
              </div>
            </div>
          </SectionCard>

          {/* Tip of the Week */}
          <SectionCard>
            <SectionLabel icon={Lightbulb} label="Tip of the week" />
            <p
              className="text-[18px] font-bold mb-3"
              style={{
                color: "var(--dl-text-primary, #1B2030)",
                letterSpacing: "-0.02em",
              }}
            >
              {TIP_OF_THE_WEEK.title}
            </p>
            <p
              className="text-[14px] leading-relaxed"
              style={{ color: "var(--dl-text-secondary, #454B5E)" }}
            >
              {TIP_OF_THE_WEEK.body}
            </p>
          </SectionCard>

          {/* Admissions News */}
          <SectionCard>
            <SectionLabel icon={Newspaper} label="Admissions news" />
            <div className="space-y-4">
              {NEWS_ITEMS.map((item) => (
                <div
                  key={item.headline}
                  style={{
                    paddingBottom: 16,
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <p
                    className="text-[14px] font-bold"
                    style={{ color: "var(--dl-text-primary, #1B2030)" }}
                  >
                    {item.headline}
                  </p>
                  <p
                    className="text-[13px] mt-1 leading-relaxed"
                    style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                  >
                    {item.summary}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Did You Know */}
          <SectionCard className="text-center">
            <SectionLabel icon={BookOpen} label="Did you know?" />
            <p
              className="text-[20px] font-bold leading-snug max-w-lg mx-auto"
              style={{
                color: "var(--dl-text-primary, #1B2030)",
                letterSpacing: "-0.02em",
              }}
            >
              {DID_YOU_KNOW.fact}
            </p>
            <p
              className="text-[11px] mt-3"
              style={{ color: "var(--dl-text-muted, #5A6275)" }}
            >
              Source: {DID_YOU_KNOW.source}
            </p>
          </SectionCard>

          {/* CTA */}
          <div
            className="border p-6 text-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(74,111,165,0.06), rgba(74,111,165,0.03))",
              borderColor: "rgba(74,111,165,0.12)",
              borderRadius: "14px",
            }}
          >
            <p
              className="text-[18px] font-bold mb-2"
              style={{
                color: "var(--dl-text-primary, #1B2030)",
                letterSpacing: "-0.02em",
              }}
            >
              Stay ahead of the cycle
            </p>
            <p
              className="text-[14px] mb-5 mx-auto max-w-md"
              style={{ color: "var(--dl-text-secondary, #454B5E)" }}
            >
              Check back every week for fresh deadlines, tips, and news. Run
              your analysis to see how you stack up.
            </p>
            <Link href="/analyze" className="dl-btn dl-btn-primary">
              Run your analysis
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </Link>
          </div>

          {/* Related pages — internal linking for SEO */}
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              Explore more
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { href: "/deadlines", label: "All Deadlines" },
                { href: "/college-application-timeline-2026", label: "2026 Timeline" },
                { href: "/scholarship-match", label: "Scholarship Finder" },
                { href: "/fafsa-checklist", label: "FAFSA Checklist" },
                { href: "/college-application-checklist", label: "Application Checklist" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs px-3 py-1.5 rounded-full transition-colors hover:opacity-80"
                  style={{
                    background: "rgba(74,111,165,0.08)",
                    color: "#4A6FA5",
                    fontWeight: 600,
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
