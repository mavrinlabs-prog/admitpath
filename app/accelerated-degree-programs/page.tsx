import type { Metadata } from "next";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { Section } from "@/components/marketing/Section";
import {
  GraduationCap,
  Layers,
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Accelerated Degree Programs — Full Guide",
  description:
    "Guide to accelerated degree programs: 3-year bachelor's, 4+1 master's, 3+2 engineering, BS/MD, and dual-degree paths. Costs, benefits, tradeoffs.",
  alternates: { canonical: `${BASE}/accelerated-degree-programs` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Accelerated Degree Programs — Full Guide",
    description: "3-year bachelor's, 4+1 master's, BS/MD, and dual-degree paths. Costs, benefits, tradeoffs.",
    url: `${BASE}/accelerated-degree-programs`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Accelerated+Degree+Programs&subtitle=3-year+%C2%B7+4%2B1+%C2%B7+BS%2FMD+%C2%B7+dual-degree`, width: 1200, height: 630, alt: "Accelerated Degree Programs" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Accelerated Degree Programs — Full Guide", description: "3-year bachelor's, 4+1 master's, BS/MD, and dual-degree paths.", images: [`${BASE}/api/og?title=Accelerated+Degree+Programs&subtitle=3-year+%C2%B7+4%2B1+%C2%B7+BS%2FMD+%C2%B7+dual-degree`] },
};

const PROGRAM_TYPES = [
  {
    type: "3-year bachelor's degree",
    desc: "Complete a standard bachelor's in 3 years instead of 4. Save one year of tuition and entry-into-workforce time. Requires AP/IB credit transferring + heavy course loads OR specific 3-year programs.",
    examples: "Some schools offer 3-year tracks: Northeastern, Wesleyan, Quinnipiac. Many liberal arts colleges allow this informally.",
    note: "Best for students with significant AP/IB credit and clear academic direction.",
  },
  {
    type: "4+1 Master's program",
    desc: "Earn bachelor's + master's in 5 years instead of 6. Take graduate courses senior year that count toward both degrees.",
    examples: "Common at: Northeastern (PlusOne MS), Northwestern (Combined Bachelors-Masters), Stanford (Coterminal), Penn (Submatriculation), Princeton, MIT.",
    note: "Best for students wanting research depth or transitioning into a specific master's-required field. Significantly faster than separate enrollment.",
  },
  {
    type: "3+2 Engineering",
    desc: "Spend 3 years at a liberal arts college, then 2 years at an engineering school. Earn BA + BS in 5 years.",
    examples: "Many partnerships exist: Columbia + LACs (e.g., Reed, Bard), Washington University + LACs, Caltech + LACs, USC + LACs.",
    note: "Best for students wanting strong liberal arts education + engineering career path.",
  },
  {
    type: "BS/MD combined medical programs",
    desc: "Combined undergraduate-medical school programs. 7-8 years total instead of 8.",
    examples: "Brown PLME, Northwestern HPME, Penn AMSA, Case PPSP, Rice/Baylor MS, BU 7-year, Drexel.",
    note: "2-5% admit rates from already-strong applicant pools. See our BS/MD article for details.",
  },
  {
    type: "Penn M&T (Management & Technology)",
    desc: "Dual degree: BAS from Penn Engineering + BS Economics from Wharton. ~30 students/year. 4-5 years.",
    examples: "Penn M&T specifically. Similar dual programs: Northwestern MMSS (Math, Management & Systems), USC IBEAR.",
    note: "Highly selective. Designed for students at intersection of business + technology. Generally 4 years for strong students.",
  },
  {
    type: "Huntsman Program (Penn)",
    desc: "Dual degree: BS Economics from Wharton + BA in International Studies. 4 years. ~25 students/year.",
    examples: "Penn Huntsman. Similar: Northwestern's IGS combined with social sciences.",
    note: "Designed for students at intersection of business + international affairs.",
  },
  {
    type: "Cornell BA + BS dual degree",
    desc: "Combined degree from Cornell College of Arts & Sciences + Cornell College of Engineering or other professional school.",
    examples: "Cornell BA/BS dual degree program. 5 years usually.",
    note: "Substantial credit overload required.",
  },
  {
    type: "Joint JD/MBA, JD/MD, JD/PhD",
    desc: "Combined graduate-graduate degrees. JD/MBA typically 4 years instead of 5; JD/MD 6-7 years; JD/PhD 6-8 years.",
    examples: "Most top universities offer joint degrees with their professional schools.",
    note: "Decided in graduate admissions, not undergraduate.",
  },
];

const BENEFITS = [
  "Time savings: 1-2 years of academic time saved across the path.",
  "Cost savings: 1-2 years of tuition saved, often substantial ($30K-$70K depending on institution).",
  "Earlier workforce entry: 1-2 years more of earning potential.",
  "Demonstrated rigor: completing accelerated programs signals capability and discipline.",
  "Specialized credential: dual-degree (M&T, Huntsman, BS/MD) provides combined expertise hard to achieve separately.",
  "Coursework efficiency: courses count toward multiple credentials, reducing redundancy.",
];

const TRADEOFFS = [
  "Heavier course load. Most accelerated programs require 18+ credit semesters or summer coursework.",
  "Less time for exploration. Standard 4-year track allows more major-switching, intellectual breadth, and personal growth.",
  "Less time for non-academic pursuits. Internships, study abroad, athletics, gap years all become harder.",
  "Higher stress. Sustained academic intensity across the program.",
  "Locked-in career path. 3+2 engineering and BS/MD lock you to specific fields; switching becomes costly.",
  "Limited graduate school options. Some grad schools prefer standard 4-year applicants.",
  "Risk of burnout. Especially in BS/MD and combined-degree programs.",
];

const WHO_FITS = [
  "Students with significant AP/IB credit who can accelerate without overload.",
  "Students with clear career direction and confidence in their major choice.",
  "Students who genuinely thrive in heavy course loads.",
  "Families where 1-2 years of saved tuition is financially significant.",
  "Students entering specific master's-required fields (engineering with MS, public policy with MA).",
  "Students applying to dual-degree programs designed for them (M&T, Huntsman, BS/MD).",
];

const WHO_DOESNT_FIT = [
  "Students who'd benefit from exploration and major-switching freedom.",
  "Students who want substantial study abroad, gap year, or non-academic pursuits.",
  "Students whose families can comfortably afford the additional year of tuition.",
  "Students whose intended career requires extensive PhD or extensive professional degrees (where the +1 doesn't save time).",
  "Students with unclear academic direction.",
  "Students who'd burn out under sustained academic intensity.",
];

const APPLICATION_STRATEGY = [
  "Most accelerated tracks are decided AFTER undergraduate admission, not during. Apply to the school first; pursue acceleration once enrolled.",
  "Exceptions: BS/MD, M&T, Huntsman, structured 3-year programs — these have separate admissions tracks.",
  "Be explicit about wanting acceleration on these structured-program applications. Don't be coy; admissions wants applicants who explicitly want what they're offering.",
  "For BS/MD: 100+ hours of clinical experience is the bar. Plus separate medical-specific essays.",
  "For Penn M&T or similar: demonstrate quantitative capability + business interest with substantive evidence.",
  "Have a balanced backup list. Acceleration programs are highly selective; don't apply only to combined programs.",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/accelerated-degree-programs#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Accelerated Degree Programs", item: `${BASE}/accelerated-degree-programs` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/accelerated-degree-programs#page`,
      url: `${BASE}/accelerated-degree-programs`,
      name: "Accelerated Degree Programs — 3-Year, 5-Year Combined, Dual Degree",
      description: "Comprehensive guide to 8 types of accelerated degree programs: 3-year bachelor's, 4+1 master's, 3+2 engineering, BS/MD, Penn M&T, Huntsman, Cornell BA/BS, joint JD programs. Benefits, tradeoffs, and application strategy.",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/accelerated-degree-programs#breadcrumb` },
      inLanguage: "en-US",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "What are BS/MD programs?", acceptedAnswer: { "@type": "Answer", text: "BS/MD programs admit students directly from high school into a combined undergraduate and medical school track, typically 6-8 years total instead of 8+. They're extremely competitive (often 1-3% admit rates). Examples: Brown PLME (8 years), Northwestern HPME (7 years), Rice/Baylor (8 years), UMKC (6 years)." } },
        { "@type": "Question", name: "Can I finish college in 3 years?", acceptedAnswer: { "@type": "Answer", text: "Yes, if you have significant AP/IB credit that transfers and take heavier course loads. Some schools offer formal 3-year tracks (Northeastern, Wesleyan, Quinnipiac). You'll save one year of tuition but lose a year of campus life, internship time, and social development. Best for students with clear academic direction." } },
        { "@type": "Question", name: "What is a 4+1 master's program?", acceptedAnswer: { "@type": "Answer", text: "A 4+1 program lets you earn both a bachelor's and master's in 5 years instead of 6. You take graduate courses senior year that count toward both degrees. Common at Northeastern (PlusOne MS), Stanford (Coterminal), Penn (Submatriculation), and Northwestern (Combined). Saves time and often tuition." } },
      ],
    },
  ],
};

const PAGE_FAQS = [
  { q: "What are BS/MD programs?", a: "BS/MD programs admit students directly from high school into a combined undergraduate and medical school track, typically 6-8 years total instead of 8+. They're extremely competitive (often 1-3% admit rates). Examples: Brown PLME (8 years), Northwestern HPME (7 years), Rice/Baylor (8 years), UMKC (6 years)." },
  { q: "Can I finish college in 3 years?", a: "Yes, if you have significant AP/IB credit that transfers and take heavier course loads. Some schools offer formal 3-year tracks (Northeastern, Wesleyan, Quinnipiac). You'll save one year of tuition but lose a year of campus life, internship time, and social development. Best for students with clear academic direction." },
  { q: "What is a 4+1 master's program?", a: "A 4+1 program lets you earn both a bachelor's and master's in 5 years instead of 6. You take graduate courses senior year that count toward both degrees. Common at Northeastern (PlusOne MS), Stanford (Coterminal), Penn (Submatriculation), and Northwestern (Combined). Saves time and often tuition." },
];

export default function AcceleratedDegreeProgramsPage() {
  return (
    <MarketingLayout
      eyebrow="Degree Strategy"
      title="Accelerated Degree Programs"
      description="8 types of accelerated and combined-degree programs that compress your education timeline — from 3-year bachelor's to 4+1 master's to 7-year BS/MD. Benefits, tradeoffs, and the structured programs (Penn M&T, Huntsman, BS/MD) that have their own admissions tracks."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section title="8 types of accelerated programs" Icon={Layers}>
        <div className="space-y-3">
          {PROGRAM_TYPES.map((p) => (
            <article
              key={p.type}
              className="dl-card-hover rounded-xl border p-4"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
            >
              <h3 className="mb-1 text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                {p.type}
              </h3>
              <p className="mb-1.5 text-[13.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {p.desc}
              </p>
              <p className="mb-1.5 text-[13px]" style={{ color: "#4A6FA5", fontWeight: 500 }}>
                Examples: {p.examples}
              </p>
              <p className="text-[13px]" style={{ color: "var(--dl-text-muted, #5A6275)", fontStyle: "italic" }}>
                {p.note}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Benefits" Icon={Briefcase}>
        <ul className="space-y-2">
          {BENEFITS.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-[14.5px] leading-relaxed">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "#4A6FA5" }} />
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{b}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Tradeoffs" Icon={AlertCircle}>
        <ul className="space-y-2">
          {TRADEOFFS.map((t, i) => (
            <li key={i} className="flex items-start gap-2 text-[14.5px] leading-relaxed">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Who fits accelerated programs" Icon={Clock}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            className="rounded-xl border p-5"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <h3 className="mb-3 text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Good fit
            </h3>
            <ul className="space-y-2">
              {WHO_FITS.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-[13.5px] leading-relaxed">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "#4A6FA5" }} />
                  <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{w}</span>
                </li>
              ))}
            </ul>
          </div>
          <div
            className="rounded-xl border p-5"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <h3 className="mb-3 text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Not the right fit
            </h3>
            <ul className="space-y-2">
              {WHO_DOESNT_FIT.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-[13.5px] leading-relaxed">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
                  <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Application strategy" Icon={Briefcase}>
        <ul className="space-y-2">
          {APPLICATION_STRATEGY.map((a, i) => (
            <li key={i} className="flex items-start gap-3 text-[14.5px] leading-relaxed">
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                style={{ background: "#4A6FA5" }}
              >
                {i + 1}
              </span>
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{a}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="mb-5 text-[22px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>
          Frequently asked questions
        </h2>
        <div className="space-y-3">
          {PAGE_FAQS.map(({ q, a }) => (
            <details key={q} className="dl-card-hover rounded-2xl border p-5" style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}>
              <summary className="cursor-pointer font-bold text-base" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{q}</summary>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}>{a}</p>
            </details>
          ))}
        </div>
      </section>

      <MarketingCTA
        headline="Find accelerated programs aligned with your goals."
        description="AdmitPath surfaces accelerated programs (BS/MD, dual-degree, 4+1 master's) that match your profile and intended career path. Free plan included. Pro $19.99/mo."
        buttonText="Find accelerated paths"
      />
    </MarketingLayout>
  );
}
