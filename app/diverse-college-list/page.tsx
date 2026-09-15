import Link from "next/link";
import type { Metadata } from "next";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { Section } from "@/components/marketing/Section";
import {
  Users,
  Heart,
  Award,
  Shield,
} from "lucide-react";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "First-Gen & FGLI Colleges",
  description:
    "Schools with strong first-gen, low-income, and URM support. Financial aid policies, dedicated programs, retention rates, and real outcomes.",
  alternates: { canonical: `${BASE}/diverse-college-list` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Colleges with Strong First-Gen & Diverse Support",
    description: "Schools with strong first-gen, low-income, and URM support. Aid policies, programs, retention, outcomes.",
    url: `${BASE}/diverse-college-list`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Diverse+College+List&subtitle=First-gen+%C2%B7+low-income+%C2%B7+URM+support`, width: 1200, height: 630, alt: "Diverse College List" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Colleges with Strong First-Gen & Diverse Support", description: "Schools with strong first-gen, low-income, and URM support.", images: [`${BASE}/api/og?title=Diverse+College+List&subtitle=First-gen+%C2%B7+low-income+%C2%B7+URM+support`] },
};

const FIRST_GEN_PROGRAMS = [
  { school: "Princeton University", details: "Princeton University Preparatory Program (PUPP), 1vyG (a national first-gen student conference founded at Princeton). Robust academic and social support; meets 100% of need with no loans." },
  { school: "Harvard University", details: "Harvard First-Generation Student Union, Harvard FGLI Foundation. Need-blind for all; meets 100% of need; $0 family contribution under $85K." },
  { school: "Yale University", details: "Yale First-Generation Low-Income (FGLI) Initiative, Cultural Connections pre-orientation. Need-blind for all; meets 100% of need; $0 family contribution under $75K." },
  { school: "Stanford University", details: "FLI Stanford (First-Gen and/or Low-Income), Leland Scholars Program (transfer support), Stanford First-Generation Low-Income Partnership. Need-blind for domestic; meets 100% of need." },
  { school: "Columbia University", details: "Center for the Core Curriculum FLI Programs, Columbia FLI Network. Strong first-gen alumni mentorship." },
  { school: "Brown University", details: "Mary Anne Lewis '80 Scholars Program, U-FLi Center, dedicated first-gen mentoring. Need-blind for international applicants since 2024." },
  { school: "Amherst College", details: "Amherst First-Generation Mentor Program, generous aid (no loans), small student body for sustained relationships." },
  { school: "Williams College", details: "First-Gen Williams (FGW), summer pre-orientation, Tyng Scholars Program. No-loan financial aid." },
  { school: "Pomona College", details: "Pomona-FGLI program, Bridges Program for transfer students from CCs. Strong cohort culture." },
  { school: "Vassar College", details: "Posse Scholars partnership, Transitions program for first-gen students." },
];

const QUEST_BRIDGE_PARTNERS = [
  "Princeton University", "Yale University", "Stanford University", "MIT", "Brown University",
  "Dartmouth College", "Columbia University", "Penn", "Northwestern", "Duke",
  "Notre Dame", "Pomona College", "Amherst College", "Williams College", "Bowdoin College",
  "Wesleyan University", "Vassar College", "Carleton College", "Grinnell College", "Macalester College",
  "Vanderbilt University", "Rice University", "Emory University", "Tufts University", "Wellesley College",
  "Swarthmore College", "Haverford College", "Smith College", "USC", "UVA",
  "Notre Dame", "Bates College", "Hamilton College", "Davidson College", "Caltech",
];

const HBCU_LIST = [
  { school: "Howard University", note: "Washington DC; rigorous academics across STEM, business, communications, and pre-professional programs. Strong alumni network in DC and government." },
  { school: "Spelman College", note: "Atlanta; women's HBCU with #1-ranked Black women's college outcomes. Strong pipelines to graduate and professional schools." },
  { school: "Morehouse College", note: "Atlanta; men's HBCU with prominent alumni in business, public service, and academia. Strong pre-law and pre-med pipelines." },
  { school: "Hampton University", note: "Virginia; strong nursing, computer science, and pre-med programs. Long-standing institution." },
  { school: "Florida A&M University (FAMU)", note: "Tallahassee; strong College of Pharmacy, business school, and architecture program." },
  { school: "North Carolina A&T", note: "Greensboro NC; #1 producer of Black engineers in the US. Strong STEM pipeline." },
  { school: "Tuskegee University", note: "Alabama; historic HBCU with strong veterinary medicine and architecture programs." },
];

const SUPPORT_PROGRAMS = [
  { name: "QuestBridge", desc: "Connects high-achieving low-income students to 50+ partner colleges. National College Match: a binding application process where matched students receive full 4-year scholarships. National Scholarship Award also available. Apply by late September of senior year." },
  { name: "Posse Foundation", desc: "Identifies leadership-oriented students from urban areas and matches them with partner colleges in cohorts of 10. Full 4-year scholarships at partner schools (NYU, Bryn Mawr, Pomona, Trinity, Vanderbilt, etc.)." },
  { name: "College Possible", desc: "Free intensive coaching and mentoring for low-income high school students. Available in select cities (Boston, Chicago, Milwaukee, Twin Cities, Omaha, Philadelphia, Portland)." },
  { name: "Matriculate", desc: "Free virtual mentoring for high-achieving low-income students. Each student is matched with an undergraduate Mentor for 1-on-1 support through application process. Application is competitive." },
  { name: "Bottom Line", desc: "Free college access and degree completion support for first-gen low-income students. Available in Boston, NYC, Worcester, Chicago, Cincinnati, Miami." },
  { name: "10,000 Degrees", desc: "Free college access services in California. First-gen and low-income focus." },
  { name: "uAspire", desc: "Free college affordability advising. National with Boston, NYC, and Bay Area concentrations." },
  { name: "Schuler Education Foundation", desc: "Provides scholarships and support for high-achieving low-income students attending Schuler partner schools." },
];

const SCHOOLS_MEETS_FULL_NEED = [
  "Harvard, Yale, Princeton, Stanford, MIT, Caltech, Columbia, Penn, Cornell, Dartmouth, Brown",
  "Amherst, Williams, Pomona, Bowdoin, Wellesley, Wesleyan, Vassar, Bryn Mawr, Smith, Mount Holyoke",
  "Duke, Chicago, Notre Dame, Northwestern, USC, Vanderbilt, Rice, JHU, Wash U",
  "Bates, Hamilton, Haverford, Carleton, Davidson, Swarthmore, Bowdoin, Grinnell, Middlebury",
  "Most state flagships meet 100% of need ONLY for in-state students with limited budgets",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/diverse-college-list#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Colleges with Strong First-Gen Support", item: `${BASE}/diverse-college-list` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/diverse-college-list#page`,
      url: `${BASE}/diverse-college-list`,
      name: "Colleges with Strong First-Gen, Low-Income & Diverse Support",
      description: "Schools known for strong support systems for first-generation, low-income, and underrepresented students. First-gen programs, financial aid commitment, partner programs (QuestBridge, Posse, etc.), and HBCU options.",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/diverse-college-list#breadcrumb` },
      inLanguage: "en-US",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Which colleges have the best first-generation student support?", acceptedAnswer: { "@type": "Answer", text: "Princeton (PUPP, 1vyG), Harvard (FGLI Foundation), Yale (Cultural Connections), Stanford (FLI Stanford), Brown (U-FLi Center), Amherst (First-Gen Mentor Program), and Williams (FGW) are among the strongest. All meet 100% of demonstrated need with no loans for qualifying families." } },
        { "@type": "Question", name: "What is QuestBridge and how does it work?", acceptedAnswer: { "@type": "Answer", text: "QuestBridge is a program connecting high-achieving, low-income students (generally family income under $65K for a family of 4) with full-scholarship admissions at 50+ partner schools. Students apply through the National College Match in September-October. If matched, it's a binding full-ride admission." } },
        { "@type": "Question", name: "Do HBCUs offer good financial aid?", acceptedAnswer: { "@type": "Answer", text: "Many HBCUs offer strong merit and need-based aid. Spelman, Morehouse, Howard, Hampton, and Tuskegee are known for competitive scholarships. The UNCF (United Negro College Fund) also provides scholarships specifically for HBCU students. HBCUs serve 10% of Black college students but produce 40% of Black STEM graduates." } },
      ],
    },
  ],
};

const PAGE_FAQS = [
  { q: "Which colleges have the best first-generation student support?", a: "Princeton (PUPP, 1vyG), Harvard (FGLI Foundation), Yale (Cultural Connections), Stanford (FLI Stanford), Brown (U-FLi Center), Amherst (First-Gen Mentor Program), and Williams (FGW) are among the strongest. All meet 100% of demonstrated need with no loans for qualifying families." },
  { q: "What is QuestBridge and how does it work?", a: "QuestBridge is a program connecting high-achieving, low-income students (generally family income under $65K for a family of 4) with full-scholarship admissions at 50+ partner schools. Students apply through the National College Match in September-October. If matched, it's a binding full-ride admission." },
  { q: "Do HBCUs offer good financial aid?", a: "Many HBCUs offer strong merit and need-based aid. Spelman, Morehouse, Howard, Hampton, and Tuskegee are known for competitive scholarships. The UNCF (United Negro College Fund) also provides scholarships specifically for HBCU students. HBCUs serve 10% of Black college students but produce 40% of Black STEM graduates." },
];

export default function DiverseCollegeListPage() {
  return (
    <MarketingLayout
      eyebrow="First-Gen & Low-Income Reference"
      title="Colleges with Strong First-Gen Support"
      description="Schools known for strong support systems for first-generation, low-income, and underrepresented students: financial aid that actually meets your need, dedicated first-gen programs, partner programs (QuestBridge, Posse), and HBCU options. With concrete program names and details."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Schools with strong first-gen programs */}
      <Section
        title="Schools with strong first-gen programs"
        Icon={Users}
        description="Schools with named first-generation student programs (not just informal support)."
      >
        <div className="space-y-3">
          {FIRST_GEN_PROGRAMS.map((p) => (
            <article
              key={p.school}
              className="dl-card-hover rounded-xl border p-4"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
            >
              <h3 className="mb-1 text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                {p.school}
              </h3>
              <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {p.details}
              </p>
            </article>
          ))}
        </div>
      </Section>

      {/* QuestBridge partners */}
      <Section title="QuestBridge partner schools" Icon={Award}>
        <p className="mb-3 text-[14px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          QuestBridge connects high-achieving low-income students to 50+ partner colleges. The National College Match (binding) provides full 4-year scholarships to matched students. Apply by late September of senior year.
        </p>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 rounded-xl border p-5 text-[13.5px]"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
        >
          {QUEST_BRIDGE_PARTNERS.map((s) => (
            <div key={s} style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{s}</div>
          ))}
        </div>
      </Section>

      {/* HBCUs */}
      <Section title="HBCUs with strong outcomes" Icon={Heart}>
        <p className="mb-3 text-[14px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          Historically Black Colleges and Universities offer strong outcomes for Black students. The list below highlights HBCUs with notable academic and career-pipeline strengths.
        </p>
        <div className="space-y-3">
          {HBCU_LIST.map((h) => (
            <article
              key={h.school}
              className="dl-card-hover rounded-xl border p-4"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
            >
              <h3 className="mb-1 text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                {h.school}
              </h3>
              <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {h.note}
              </p>
            </article>
          ))}
        </div>
      </Section>

      {/* National support programs */}
      <Section title="National support programs (free)" Icon={Shield}>
        <p className="mb-3 text-[14px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          Free college access programs for first-gen and low-income students. These often provide what hired counselors charge for: list construction, essay support, financial aid help.
        </p>
        <div className="space-y-3">
          {SUPPORT_PROGRAMS.map((p) => (
            <article
              key={p.name}
              className="dl-card-hover rounded-xl border p-4"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
            >
              <h3 className="mb-1 text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                {p.name}
              </h3>
              <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {p.desc}
              </p>
            </article>
          ))}
        </div>
      </Section>

      {/* Schools that meet 100% of need */}
      <section className="mb-12 rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderLeft: "3px solid #4A6FA5" }}>
        <h2
          className="mb-3 text-[20px] font-semibold"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          Schools that meet 100% of demonstrated need
        </h2>
        <p className="mb-3 text-[14px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          ~70 schools meet 100% of demonstrated need (with limited or no loans for low-income students). For first-gen and low-income students, applying to these schools is often the highest-leverage strategy:
        </p>
        <ul className="space-y-1.5">
          {SCHOOLS_MEETS_FULL_NEED.map((g, i) => (
            <li key={i} className="text-[13.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              • {g}
            </li>
          ))}
        </ul>
      </section>

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
        headline="Find your fit-aligned schools."
        description="AdmitPath surfaces schools with strong first-gen programs, generous aid, and supportive cohorts based on your profile. Free plan included. Pro $19.99/mo."
        buttonText="Build my list"
      />

      {/* Related */}
      <nav className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3" aria-label="Related resources">
        <a href="/need-blind-vs-need-aware-schools" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Need-blind vs need-aware</div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>How financial need affects admissions decisions.</div>
        </a>
        <a href="/scholarship-application-guide" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Scholarship guide</div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Timeline, strategy, and essay tips for scholarships.</div>
        </a>
        <a href="/fafsa-checklist" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>FAFSA checklist</div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>7-step filing guide with document list.</div>
        </a>
        <a href="/honors-college-explained" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Honors colleges explained</div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Ivy-quality academics at lower cost through honors programs.</div>
        </a>
      </nav>
    </MarketingLayout>
  );
}
