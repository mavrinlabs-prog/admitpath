import type { Metadata } from "next";
import { GraduationCap, BookOpen, Target, ShieldCheck, Sparkles, Users, Award, Newspaper } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: { absolute: "About AdmitPath | Built by a Current HS Student" },
  description:
    "AdmitPath is an AI college counseling workspace for application strategy, essays, college lists, and planning. Meet the team.",
  alternates: { canonical: `${BASE}/about` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "About AdmitPath",
    description: "Methodology, calibration sources, and the editorial team behind AdmitPath.",
    url: `${BASE}/about`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [
      {
        url: `${BASE}/api/og?title=About+AdmitPath&subtitle=Methodology+%C2%B7+Sources+%C2%B7+Editorial+team`,
        width: 1200,
        height: 630,
        alt: "About AdmitPath",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@admitpath",
    title: "About AdmitPath",
    description: "Methodology, calibration sources, and the editorial team behind AdmitPath.",
    images: [`${BASE}/api/og?title=About+AdmitPath&subtitle=Methodology+%C2%B7+Sources+%C2%B7+Editorial+team`],
  },
};

const aboutSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["WebPage", "AboutPage"],
      "@id": `${BASE}/about#page`,
      url: `${BASE}/about`,
      name: "About AdmitPath",
      description:
        "Methodology, calibration sources, and the editorial team behind AdmitPath.",
      isPartOf: { "@id": `${BASE}/#website` },
      about: { "@id": `${BASE}/#organization` },
      inLanguage: "en-US",
      primaryImageOfPage: `${BASE}/api/og?title=About+AdmitPath&subtitle=Methodology+%C2%B7+Sources+%C2%B7+Editorial+team`,
    },
    {
      "@type": "Person",
      "@id": `${BASE}/about#editorial-team`,
      name: "AdmitPath Editorial Team",
      url: `${BASE}/about`,
      jobTitle: "Editorial Team",
      worksFor: { "@id": `${BASE}/#organization` },
      knowsAbout: [
        "College admissions",
        "Common Application essays",
        "Ivy League admissions",
        "College list strategy",
        "Financial aid",
        "Standardized testing",
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "About", item: `${BASE}/about` },
      ],
    },
  ],
};

const SOURCES = [
  {
    label: "Common Data Set (CDS)",
    body: "Each university's annual Common Data Set Section C7 — the official admissions-factor weighting that schools self-report. Drives the per-school 'What this school weighs' overlay on every college detail page.",
  },
  {
    label: "IPEDS / NCES",
    body: "Federal Integrated Postsecondary Education Data System for enrollment, sticker price, retention, graduation rates, and demographic breakdowns. The same dataset powering College Navigator.",
  },
  {
    label: "College Scorecard",
    body: "U.S. Department of Education dataset for net price by income band, median earnings 10 years out, and student-loan repayment rates. Used as planning context where those fields are available.",
  },
  {
    label: "FairTest + each school's official policy page",
    body: "Test-optional, test-blind, and required policies cross-referenced from FairTest plus each registrar's official admissions page (rechecked at the start of every cycle).",
  },
  {
    label: "Hoxby & Avery (2013)",
    body: "Brookings paper on undermatching — high-stat low-income students systematically under-applying to T20 schools that would cost them less than their state flagship. Powers the /undermatch self-check.",
  },
];

const PRINCIPLES = [
  {
    icon: Target,
    title: "Calibrated, not generic",
    body: "Our 7-dimension scoring framework uses the published admissions-factor criteria in the 102 college records currently maintained by AdmitPath. Coverage and publication dates vary, so students should verify current requirements with each school.",
  },
  {
    icon: ShieldCheck,
    title: "Honest about limits",
    body: "We surface a 4-band predictor (Very Likely / Possible / Long Shot / Hail Mary), not a precise percentage. Admissions has too much hidden state — institutional priorities, hooks, year-to-year shifts in yield management — for any model to claim 87.3%-grade accuracy. Honest bands beat false precision.",
  },
  {
    icon: BookOpen,
    title: "Built for the student, not the parent",
    body: "Every UI choice is aimed at a 16-to-18-year-old reading on their phone at 11 PM. No shame, no scarcity drips, no 'limited time' fake-urgency. The hard part is the application itself; we don't add cognitive load.",
  },
  {
    icon: Sparkles,
    title: "AI as augmentation, not replacement",
    body: "AI scores essays across 6 dimensions and surfaces patterns. It doesn't write the essay. We display each school's AI-use policy directly on its detail page and steer students toward editing tools, not generation tools.",
  },
];

export default function AboutPage() {
  return (
    <MarketingLayout
      eyebrow="About AdmitPath"
      title="We built the tool we wish we'd had."
      description="AdmitPath reviews a college application using documented planning dimensions, then turns the submitted information into a prioritized to-do list."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />

        {/* Mission */}
        <section className="mb-12 sm:mb-16">
          <h2
            className="mb-5 text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
            Why this exists
          </h2>
          <div className="prose prose-lg max-w-none" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            <p>
              College-planning support ranges from school and community resources to independent counselors and online tools. Cost, availability, and depth vary widely.
            </p>
            <p>
              School counselors bring essential local context, while their available time and caseload vary by school. Digital tools can help students organize questions and prepare for those conversations.
            </p>
            <p>
              AdmitPath exists to provide an accessible, structured supplement to qualified counseling without promising equivalent outcomes.
            </p>
          </div>
        </section>

        {/* Methodology principles */}
        <section className="mb-12 sm:mb-16">
          <h2
            className="mb-6 text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
            How we approach the problem
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PRINCIPLES.map((p) => {
              const Icon = p.icon;
              return (
                <article key={p.title} className="card-hover">
                  <div
                    className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{
                      background: "linear-gradient(135deg, #E8EFF8, #D5E0EE)",
                      color: "#4A6FA5",
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3
                    className="mb-2 text-lg font-bold"
                    style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                  >
                    {p.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                    {p.body}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Data sources */}
        <section className="mb-12 sm:mb-16">
          <h2
            className="mb-2 text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
            Where the numbers come from
          </h2>
          <p className="mb-6 text-base leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Every score, every band, every &quot;this school weighs X&quot; overlay is sourced. We don&apos;t manufacture admissions data; we ingest it from authoritative sources and refresh at the start of each application cycle.
          </p>
          <ul className="space-y-4">
            {SOURCES.map((s) => (
              <li
                key={s.label}
                className="rounded-xl border p-5"
                style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)" }}
              >
                <p
                  className="mb-1.5 text-sm font-bold"
                  style={{ color: "#4A6FA5", fontFamily: "var(--font-inter)" }}
                >
                  {s.label}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                  {s.body}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Founder / team */}
        <section className="mb-12 sm:mb-16">
          <h2
            className="mb-5 text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
            Who built this
          </h2>
          <div
            className="rounded-2xl border p-6 sm:p-8"
            style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)" }}
          >
            <p className="text-base leading-relaxed mb-4" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Built from the perspective of students navigating the college admissions process now. AdmitPath focuses on practical planning, transparent assumptions, and tools that make application strategy more accessible.
            </p>
            <p className="text-base leading-relaxed mb-4" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Students have very different levels of access to admissions support. AdmitPath is designed to make structured, data-informed planning more accessible while supplementing, not replacing, qualified human counseling.
            </p>
            <p className="text-base leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Our mission is simple: <strong style={{ color: "var(--dl-text-primary, #1B2030)" }}>transparent, data-informed college admissions guidance that students can access.</strong> The scoring rubric uses available Common Data Set admissions factors, IPEDS fields, College Scorecard data, and official school sources where present. Scores are planning guidance rather than admission probabilities, and current requirements should always be verified with each college.
            </p>
          </div>
        </section>

        {/* Editorial team */}
        <section className="mb-12 sm:mb-16">
          <h2
            className="mb-5 text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
            Editorial team
          </h2>
          <div
            className="rounded-2xl border p-6 sm:p-8"
            style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)" }}
          >
            <div className="flex items-start gap-4 sm:gap-5">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: "linear-gradient(135deg, #4A6FA5, #1E3352)",
                  color: "#fff",
                }}
              >
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h3
                  className="mb-1 text-xl font-bold"
                  style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                >
                  AdmitPath Editorial Team
                </h3>
                <p className="mb-3 text-sm font-semibold" style={{ color: "#4A6FA5" }}>
                  Authors of every guide, blog post, and methodology page on this site
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                  Articles are maintained by the AdmitPath editorial team. Guides identify primary sources such as Common Data Set reports, IPEDS, College Scorecard, and official admissions pages where available. Current requirements should always be verified with the institution.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Built by students, for students */}
        <section className="mb-12 sm:mb-16">
          <h2
            className="mb-5 text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
            Built by students, for students
          </h2>
          <div
            className="rounded-2xl border p-6 sm:p-8"
            style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)" }}
          >
            <p className="text-base leading-relaxed mb-4" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              AdmitPath was built from the perspective of students navigating an opaque and stressful college-planning process. Access to qualified admissions support varies widely by school and family.
            </p>
            <p className="text-base leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              That&apos;s why every design decision is aimed at the student, not the parent. No shame tactics, no artificial urgency, no hiding information behind a paywall. The hard part is the application itself — we don&apos;t add to the stress.
            </p>
          </div>
        </section>

        {/* The AdmitPath team */}
        <section className="mb-12 sm:mb-16">
          <h2
            className="mb-5 text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
            The team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Users,
                role: "Product & Engineering",
                description: "The core team that designs, builds, and ships the platform. Obsessed with making complex admissions data understandable at 11 PM on a phone screen.",
              },
              {
                icon: BookOpen,
                role: "Editorial & Content",
                description: "Admissions guides link to primary sources such as CDS, IPEDS, and official school pages where available.",
              },
              {
                icon: Award,
                role: "Scoring & Calibration",
                description: "The team that maintains the 7-dimension scoring engine, updates available public data, and checks the implementation against the published methodology.",
              },
            ].map((member) => {
              const Icon = member.icon;
              return (
                <article
                  key={member.role}
                  className="rounded-xl border p-5"
                  style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)" }}
                >
                  <div
                    className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: "linear-gradient(135deg, #E8EFF8, #D5E0EE)", color: "#4A6FA5" }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-1 text-base font-bold" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>
                    {member.role}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                    {member.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Advisory board */}
        <section className="mb-12 sm:mb-16">
          <h2
            className="mb-5 text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
            Advisory board
          </h2>
          <div
            className="rounded-2xl border p-6 sm:p-8"
            style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)" }}
          >
            <p className="text-base leading-relaxed mb-4" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              AdmitPath&apos;s methodology and editorial content are reviewed by advisors with direct admissions experience at selective institutions.
            </p>
            <ul className="space-y-3">
              {[
                "We use available Common Data Set admissions-factor data across 102 maintained college records",
                "Our scoring methodology is calibrated against publicly available admissions statistics",
                "Education data scientists experienced in enrollment modeling and outcomes analysis",
                "First-generation college students who understand the information gap firsthand",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm leading-relaxed"
                  style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                >
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: "#4A6FA5" }}
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Press & recognition */}
        <section className="mb-12 sm:mb-16">
          <h2
            className="mb-5 text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
            Press & recognition
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: Newspaper,
                title: "Featured in education technology coverage",
                body: "Recognized as a next-generation admissions tool that makes data-driven guidance accessible beyond affluent families.",
              },
              {
                icon: Award,
                title: "Built on open admissions data",
                body: "Our commitment to citing sources (CDS, IPEDS, College Scorecard) and publishing our full methodology sets us apart from competitors who treat their algorithms as black boxes.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-xl border p-5"
                  style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)" }}
                >
                  <div
                    className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: "linear-gradient(135deg, #E8EFF8, #D5E0EE)", color: "#4A6FA5" }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-1 text-base font-bold" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                    {item.body}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Platform at a glance */}
        <section className="mb-12 sm:mb-16">
          <h2
            className="mb-5 text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
            Platform at a glance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { stat: "102", label: "Maintained college records" },
              { stat: "7", label: "Dimensions scored per student profile" },
              { stat: "200+", label: "Free expert articles on admissions" },
            ].map((item) => (
              <div
                key={item.stat}
                className="text-center rounded-xl border p-5"
                style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)" }}
              >
                <p
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: "#4A6FA5",
                    fontFamily: "var(--font-jetbrains-mono, monospace)",
                    letterSpacing: "-0.02em",
                    marginBottom: 4,
                  }}
                >
                  {item.stat}
                </p>
                <p className="text-xs leading-snug" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>
          <div
            className="rounded-2xl border p-6 sm:p-8"
            style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)" }}
          >
            <p className="text-base leading-relaxed mb-4" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              AdmitPath provides profile scoring, essay feedback, college-list building, and AI-assisted planning. The rubric uses available Common Data Set admissions-factor weightings and presents specific next steps with important limitations.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/how-it-works"
                className="text-sm font-semibold hover:underline"
                style={{ color: "#4A6FA5" }}
              >
                How it works →
              </a>
              <a
                href="/methodology"
                className="text-sm font-semibold hover:underline"
                style={{ color: "#4A6FA5" }}
              >
                Full methodology →
              </a>
              <a
                href="/vs-college-counselor"
                className="text-sm font-semibold hover:underline"
                style={{ color: "#4A6FA5" }}
              >
                vs. private counselor →
              </a>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-12">
          <MarketingCTA
            headline="Try the score yourself"
            description="Free profile analysis. See exactly where you stand on each of the 7 dimensions in under a minute."
            buttonText="Score my profile"
          />
        </section>
    </MarketingLayout>
  );
}
