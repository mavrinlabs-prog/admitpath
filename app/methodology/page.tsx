import Link from "next/link";
import type { Metadata } from "next";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: { absolute: "Methodology — How AdmitPath Scores Profiles" },
  description:
    "How AdmitPath scores profiles: 7 dimensions, data sources, calibration process, and what AdmitPath does NOT claim to predict.",
  alternates: { canonical: `${BASE}/methodology` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "AdmitPath Methodology",
    description: "How the 7-dimension score is calculated, with data sources and calibration sources.",
    url: `${BASE}/methodology`,
    type: "article",
    images: [
      {
        url: `${BASE}/api/og?title=AdmitPath+Methodology&subtitle=How+the+7-dimension+score+is+calculated`,
        width: 1200,
        height: 630,
        alt: "AdmitPath methodology",
      },
    ],
    locale: "en_US",
    siteName: "AdmitPath",
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "AdmitPath Methodology", description: "How the 7-dimension score is calculated, with data sources and calibration.", images: [`${BASE}/api/og?title=AdmitPath+Methodology&subtitle=How+the+7-dimension+score+is+calculated`] },
};

const methodologySchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${BASE}/methodology#page`,
      url: `${BASE}/methodology`,
      name: "AdmitPath Methodology",
      description:
        "Full methodology document for the 7-dimension college admissions profile score, including weighting tables and data sources.",
      isPartOf: { "@id": `${BASE}/#website` },
      inLanguage: "en-US",
      primaryImageOfPage: `${BASE}/api/og?title=AdmitPath+Methodology&subtitle=How+the+7-dimension+score+is+calculated`,
      mainEntity: { "@id": `${BASE}/methodology#article` },
    },
    {
      "@type": "TechArticle",
      "@id": `${BASE}/methodology#article`,
      headline: "AdmitPath Scoring Methodology",
      description:
        "Full methodology document for the 7-dimension college admissions profile score, including weighting tables and data sources.",
      datePublished: "2026-05-05",
      dateModified: "2026-05-05",
      url: `${BASE}/methodology`,
      author: { "@id": `${BASE}/about#editorial-team` },
      publisher: { "@id": `${BASE}/#organization` },
      isPartOf: { "@id": `${BASE}/#website` },
      inLanguage: "en-US",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Methodology", item: `${BASE}/methodology` },
      ],
    },
  ],
};

const DIMENSIONS = [
  {
    name: "Academic Rigor",
    weight: "20%",
    body:
      "Course-load strength relative to what your school offers. The rigor scorer detects and weights AP courses, IB (Higher/Standard Level), dual enrollment (DE) college courses, and honors sections separately. Calibrated against your school's `apsOffered` value (default 12 if unknown) so 5 APs at a 5-AP school scores like 12 APs at a 30-AP school. Junior-year courseload is weighted 1.4x freshman-year because admissions reads recent rigor more heavily. IB HL courses are treated as AP-equivalent; DE courses weighted 0.8x AP.",
    sources: ["Common Data Set Section C7 — academic rigor weight per school", "Per-school course catalogs", "School profiles submitted by counselors", "AP/IB/DE detection engine"],
  },
  {
    name: "Leadership",
    weight: "15%",
    body:
      "Roles held + scope + duration. President of a 30-member club for 3 years > captain of a varsity team for one season. Self-started initiatives (founded the X club, launched the Y program) score higher than inherited roles. Family responsibility (caring for siblings, supporting a family business) counts as leadership.",
    sources: ["Common App activities position/leadership field", "Brag-sheet narratives", "Recommendation letter signals"],
  },
  {
    name: "Awards",
    weight: "10%",
    body:
      "Tiered: international > national > regional > state > school. Selectivity matters more than count: 1 international award beats 5 school awards. Research awards (Regeneron STS, ISEF) score very high. Participation 'awards' (NHS membership) score zero.",
    sources: ["Common App honors section", "Verifiable from external rosters where available"],
  },
  {
    name: "Activity Depth",
    weight: "20%",
    body:
      "Time + commitment + verticality across the activities list. Five years of one violin teacher + state-level performances reads as depth. Eight clubs joined freshman year reads as breadth. Calibrated to favor longer commitments and increasing scope of action year-over-year.",
    sources: ["Common App activities list (hours/week + weeks/year fields)", "Activity narrative coherence with essays + recs"],
  },
  {
    name: "Spike",
    weight: "15%",
    body:
      "The single deepest vertical in the profile, scored on (1) clarity of focus, (2) artifact strength (research paper, app, novel, founded org, etc.), (3) trajectory (increasing depth year-over-year). Profiles without a clear spike score lower at T20 schools where spike is preferred over breadth.",
    sources: ["Activity portfolio analysis", "Essay narrative reading", "External artifacts (publications, products, organizations)"],
  },
  {
    name: "Essay Quality",
    weight: "15%",
    body:
      "6-dimension sub-score (authenticity, insight, specificity, storytelling, impact, voice). Authenticity weighted highest (0.20) because admissions readers can detect heavily edited essays. Voice weighted 0.10 and evaluated via a 4-axis voice rubric based on the College Essay Guy framework: place (grounding in a physical location with proper nouns and sensory details), detail (sentence-level craft, specific objects, dialogue, sentence-length variance), vulnerability (honest self-disclosure, admission of doubt, willingness to sit in discomfort), and surprise (unexpected connections, intellectual tension, position-taking). These 4 voice axes plus 2 additional axes map into the full 6-dimension essay score. Place and detail are the strongest signals of a genuine essay.",
    sources: ["Per-essay live coach (lib/voice-rubric.ts + lib/why-us-scorer.ts)", "4-axis voice rubric engine (place, detail, vulnerability, surprise)", "Master prompts in lib/prompts/essay-coach.ts"],
  },
  {
    name: "Recommendations",
    weight: "5%",
    body:
      "Weighted lower because students have less control over rec quality once submitted. Score reflects (1) breadth of teacher contact, (2) brag-sheet quality (a proxy for rec quality), (3) counselor-relationship signals. The dimension exists to remind students to invest in teacher relationships early.",
    sources: ["Brag-sheet templates", "Common App teacher list", "Counselor narrative coherence"],
  },
];

const NOT_PREDICTED = [
  "Hooks (recruited athlete, legacy at hook-tracking schools, development case, faculty kid).",
  "Institutional priorities in any given year (e.g., school needs more violinists this cycle).",
  "Year-to-year shifts in admissions yield management.",
  "Whether your specific essay reads true to a specific human reader on a specific day.",
  "Whether the school is over-enrolled in your demographic that year.",
];

export default function MethodologyPage() {
  return (
    <MarketingLayout
      eyebrow="Methodology"
      title="How the 7-dimension score is calculated."
      description="The complete methodology behind every score AdmitPath generates — including which sources we use, how we weight each dimension, and what the score deliberately does NOT claim to predict."
      backHref="/about"
      backLabel="About"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(methodologySchema) }}
      />

      {/* Composite formula */}
      <section className="mb-12 sm:mb-16">
        <h2
          className="mb-4 text-2xl sm:text-3xl font-extrabold tracking-tight"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          The composite
        </h2>
        <p className="mb-6 text-base leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          The 0–100 composite score is a weighted average of seven sub-scores. Weights are not equal — they reflect what selective US admissions committees actually weigh per the Common Data Set Section C7. The weights below are the AdmitPath defaults; per-school overlay tunes these for all 102 schools where we have school-specific CDS C7 data.
        </p>
        <ul className="space-y-3">
          {DIMENSIONS.map((d) => (
            <li
              key={d.name}
              className="dl-card-hover rounded-xl border p-5"
              style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)" }}
            >
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <h3
                  className="text-base font-bold"
                  style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                >
                  {d.name}
                </h3>
                <span
                  className="text-sm font-bold"
                  style={{ color: "#4A6FA5", fontFamily: "var(--font-jetbrains-mono, monospace)" }}
                >
                  {d.weight}
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {d.body}
              </p>
              <div>
                <p
                  className="text-[11px] font-bold uppercase tracking-wider mb-1.5"
                  style={{ color: "var(--dl-text-muted, #5A6275)" }}
                >
                  Sources
                </p>
                <ul className="space-y-1">
                  {d.sources.map((src) => (
                    <li
                      key={src}
                      className="text-xs leading-snug pl-3 border-l-2"
                      style={{ color: "var(--dl-text-secondary, #454B5E)", borderColor: "rgba(74,111,165,0.25)" }}
                    >
                      {src}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Per-school calibration */}
      <section className="mb-12 sm:mb-16">
        <h2
          className="mb-4 text-2xl sm:text-3xl font-extrabold tracking-tight"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          Per-school calibration
        </h2>
        <div className="prose prose-lg max-w-none" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          <p>
            The default weights above are reasonable for the average T50 US college. For all 102 schools in AdmitPath&apos;s database with publicly available Common Data Set Section C7 data, AdmitPath overlays the school-specific weights on top of the default. Example: Yale weights &quot;character/personal qualities&quot; as <em>very important</em>, so the leadership + spike + essay-quality sub-scores are weighted higher in Yale-specific composite calculations. Caltech weights &quot;test scores&quot; as <em>not considered</em> after the 2025 pivot, so the rigor sub-score absorbs that weight in Caltech-specific calculations.
          </p>
          <p>
            All 102 schools in AdmitPath have school-specific C7 weights. Schools added in the future without published CDS data would use the defaults until their CDS is sourced. We refresh weights at the start of each application cycle (September–October) when schools publish their updated CDS sections.
          </p>
        </div>
      </section>

      {/* Band predictor */}
      <section className="mb-12 sm:mb-16">
        <h2
          className="mb-4 text-2xl sm:text-3xl font-extrabold tracking-tight"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          Why bands instead of percentages
        </h2>
        <div className="prose prose-lg max-w-none" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          <p>
            AdmitPath&apos;s per-school predictor returns one of four bands — Very Likely, Possible, Long Shot, Hail Mary — instead of a precise percentage like &quot;63%.&quot; Internally, the admit-rate engine uses 4-tier probability curves that map composite scores to conditional admit-rate ranges for each school.
          </p>
          <p>
            This is deliberate. Selective US admissions has too much hidden state (institutional priorities, hooks, year-to-year yield management, individual reader subjectivity) for any model to claim two-decimal accuracy. False precision misleads users into treating a 63% as &quot;I&apos;ll probably get in&quot; when the actual underlying uncertainty is much wider.
          </p>
          <p>
            The 4-tier probability curves are calibrated against published per-school admit rates (from CDS Section C) plus the applicant&apos;s composite score relative to admitted-class medians. The bands map roughly:
          </p>
          <ul>
            <li><strong>Very Likely</strong>: composite well above admitted-class median; published admit rate &gt; 30% for similar profiles.</li>
            <li><strong>Possible</strong>: composite at or near admitted-class median; published admit rate 10–30%.</li>
            <li><strong>Long Shot</strong>: composite below admitted-class median; published admit rate 3–10%.</li>
            <li><strong>Hail Mary</strong>: composite well below admitted-class median; published admit rate &lt; 3%.</li>
          </ul>
        </div>
      </section>

      {/* What we DON'T predict */}
      <section className="mb-12 sm:mb-16">
        <h2
          className="mb-4 text-2xl sm:text-3xl font-extrabold tracking-tight"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          What this score does NOT predict
        </h2>
        <p className="mb-5 text-base leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          Honesty about the model&apos;s limits is part of the methodology. The score deliberately excludes:
        </p>
        <ul className="space-y-2.5">
          {NOT_PREDICTED.map((item) => (
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
        <p className="mt-6 text-sm leading-relaxed" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
          These factors can swing individual decisions significantly. Use the score to identify gaps and prioritize work — not as an oracle.
        </p>
      </section>

      {/* Visual scoring pipeline diagram */}
      <section className="mb-12 sm:mb-16">
        <h2
          className="mb-4 text-2xl sm:text-3xl font-extrabold tracking-tight"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          The 7-dimension scoring pipeline
        </h2>
        <p className="mb-6 text-base leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          Every profile runs through the same deterministic pipeline. No black boxes, no hidden variables — you can trace every number back to a source.
        </p>
        <div
          className="rounded-2xl border p-6 sm:p-8 overflow-x-auto"
          style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)" }}
        >
          {/* Pipeline stages */}
          <div className="flex flex-col gap-4 min-w-[500px]">
            {/* Stage 1: Data ingestion */}
            <div className="flex items-center gap-3">
              <div
                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ background: "linear-gradient(135deg, #4A6FA5, #1E3352)", color: "#fff", fontFamily: "var(--font-jetbrains-mono, monospace)" }}
              >
                1
              </div>
              <div
                className="flex-1 rounded-xl px-4 py-3"
                style={{ background: "rgba(74,111,165,0.06)", border: "1px solid rgba(74,111,165,0.12)" }}
              >
                <p className="text-sm font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Profile Ingestion</p>
                <p className="text-xs mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>GPA, courses, activities, awards, essays, recommendations entered by student</p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-px h-4" style={{ background: "rgba(74,111,165,0.25)" }} />
            </div>

            {/* Stage 2: Normalization */}
            <div className="flex items-center gap-3">
              <div
                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ background: "linear-gradient(135deg, #4A6FA5, #1E3352)", color: "#fff", fontFamily: "var(--font-jetbrains-mono, monospace)" }}
              >
                2
              </div>
              <div
                className="flex-1 rounded-xl px-4 py-3"
                style={{ background: "rgba(74,111,165,0.06)", border: "1px solid rgba(74,111,165,0.12)" }}
              >
                <p className="text-sm font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>School-Context Normalization</p>
                <p className="text-xs mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Rigor scaled against school&apos;s AP offering count. 5 APs at a 5-AP school = 12 APs at a 30-AP school</p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-px h-4" style={{ background: "rgba(74,111,165,0.25)" }} />
            </div>

            {/* Stage 3: 7-dimension scoring */}
            <div className="flex items-center gap-3">
              <div
                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ background: "linear-gradient(135deg, #4A6FA5, #1E3352)", color: "#fff", fontFamily: "var(--font-jetbrains-mono, monospace)" }}
              >
                3
              </div>
              <div
                className="flex-1 rounded-xl px-4 py-3"
                style={{ background: "rgba(74,111,165,0.06)", border: "1px solid rgba(74,111,165,0.12)" }}
              >
                <p className="text-sm font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>7-Dimension Sub-Scoring</p>
                <p className="text-xs mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Each dimension scored 0-100 independently: Academic Rigor (20%) + Leadership (15%) + Awards (10%) + Activity Depth (20%) + Spike (15%) + Essay Quality (15%) + Recommendations (5%)</p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-px h-4" style={{ background: "rgba(74,111,165,0.25)" }} />
            </div>

            {/* Stage 4: CDS overlay */}
            <div className="flex items-center gap-3">
              <div
                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ background: "linear-gradient(135deg, #4A6FA5, #1E3352)", color: "#fff", fontFamily: "var(--font-jetbrains-mono, monospace)" }}
              >
                4
              </div>
              <div
                className="flex-1 rounded-xl px-4 py-3"
                style={{ background: "rgba(74,111,165,0.06)", border: "1px solid rgba(74,111,165,0.12)" }}
              >
                <p className="text-sm font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>CDS C7 School-Specific Overlay</p>
                <p className="text-xs mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>For all 102 schools, weights are adjusted to match what that specific school values per CDS Section C7 reports</p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-px h-4" style={{ background: "rgba(74,111,165,0.25)" }} />
            </div>

            {/* Stage 5: Composite */}
            <div className="flex items-center gap-3">
              <div
                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ background: "linear-gradient(135deg, #4A6FA5, #1E3352)", color: "#fff", fontFamily: "var(--font-jetbrains-mono, monospace)" }}
              >
                5
              </div>
              <div
                className="flex-1 rounded-xl px-4 py-3"
                style={{ background: "rgba(74,111,165,0.06)", border: "1px solid rgba(74,111,165,0.12)" }}
              >
                <p className="text-sm font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Weighted Composite Score (0-100)</p>
                <p className="text-xs mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Final composite = weighted average of 7 sub-scores, anti-inflated to correlate with real admit outcomes</p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-px h-4" style={{ background: "rgba(74,111,165,0.25)" }} />
            </div>

            {/* Stage 6: Band output */}
            <div className="flex items-center gap-3">
              <div
                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ background: "linear-gradient(135deg, #4A6FA5, #1E3352)", color: "#fff", fontFamily: "var(--font-jetbrains-mono, monospace)" }}
              >
                6
              </div>
              <div
                className="flex-1 rounded-xl px-4 py-3"
                style={{ background: "rgba(74,111,165,0.06)", border: "1px solid rgba(74,111,165,0.12)" }}
              >
                <p className="text-sm font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Per-School Band Prediction</p>
                <p className="text-xs mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Composite mapped to 4 honest bands: Very Likely / Possible / Long Shot / Hail Mary. No false-precision percentages</p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-px h-4" style={{ background: "rgba(74,111,165,0.25)" }} />
            </div>

            {/* Stage 7: Action plan */}
            <div className="flex items-center gap-3">
              <div
                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ background: "linear-gradient(135deg, #4A6FA5, #1E3352)", color: "#fff", fontFamily: "var(--font-jetbrains-mono, monospace)" }}
              >
                7
              </div>
              <div
                className="flex-1 rounded-xl px-4 py-3"
                style={{ background: "rgba(74,111,165,0.06)", border: "1px solid rgba(74,111,165,0.12)" }}
              >
                <p className="text-sm font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Personalized Action Plan</p>
                <p className="text-xs mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Gap analysis generates a prioritized 30/60/90-day plan targeting the dimensions that will move your composite the most</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our data sources */}
      <section className="mb-12 sm:mb-16">
        <h2
          className="mb-4 text-2xl sm:text-3xl font-extrabold tracking-tight"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          Our data sources
        </h2>
        <p className="mb-6 text-base leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          Every number in AdmitPath traces back to a verifiable source. We don&apos;t manufacture data — we ingest it from institutions that publish it.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: "CDS Section C7",
              subtitle: "102 schools with school-specific weights",
              body: "The Common Data Set Section C7 is where each university self-reports how much weight it places on academics, activities, character, and other factors. We pull these annually to calibrate per-school scoring overlays.",
            },
            {
              title: "College Scorecard API",
              subtitle: "U.S. Department of Education",
              body: "Net price by income band, median earnings 10 years post-graduation, student-loan repayment rates, and completion rates. Used as planning context where those fields are available.",
            },
            {
              title: "IPEDS / NCES",
              subtitle: "Federal enrollment & outcomes data",
              body: "Integrated Postsecondary Education Data System — enrollment figures, retention rates, graduation rates, and demographic breakdowns. The same dataset behind College Navigator.",
            },
            {
              title: "Common App Statistics",
              subtitle: "Application volume & activity norms",
              body: "Aggregate application trends, activity categorization patterns, and essay submission statistics that help us benchmark what 'normal' looks like across the applicant pool.",
            },
          ].map((source) => (
            <article
              key={source.title}
              className="rounded-xl border p-5"
              style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)" }}
            >
              <p
                className="text-sm font-bold mb-0.5"
                style={{ color: "#4A6FA5", fontFamily: "var(--font-inter)" }}
              >
                {source.title}
              </p>
              <p
                className="text-[11px] font-semibold uppercase tracking-wider mb-2"
                style={{ color: "var(--dl-text-muted, #5A6275)" }}
              >
                {source.subtitle}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {source.body}
              </p>
            </article>
          ))}
        </div>
        <p
          className="mt-4 text-xs leading-relaxed"
          style={{ color: "var(--dl-text-muted, #5A6275)" }}
        >
          All data is refreshed at the start of each admissions cycle (September&ndash;October) when schools publish updated CDS sections and the Department of Education releases new Scorecard data.
        </p>
      </section>

      {/* How we calibrate — anti-inflation */}
      <section className="mb-12 sm:mb-16">
        <h2
          className="mb-4 text-2xl sm:text-3xl font-extrabold tracking-tight"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          How we calibrate: the anti-inflation approach
        </h2>
        <div className="prose prose-lg max-w-none" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          <p>
            Most admissions tools inflate scores to make users feel good. A student with a 3.5 GPA and mid-tier extracurriculars gets told they have a &quot;78% chance&quot; at Stanford. This is dishonest — and it leads to heartbreak.
          </p>
          <p>
            AdmitPath does the opposite. Our scoring is deliberately <strong style={{ color: "var(--dl-text-primary, #1B2030)" }}>calibrated to correlate with actual admit outcomes</strong>, not to flatter users. This means:
          </p>
        </div>
        <ul className="mt-4 space-y-3">
          {[
            {
              title: "Score compression at the top",
              body: "A composite of 90+ requires genuine national-level achievements. You can't get there with good-but-not-exceptional credentials.",
            },
            {
              title: "School-context normalization",
              body: "5 APs at a school that offers 5 means something very different than 5 APs at a school that offers 30. We normalize for opportunity, not raw count.",
            },
            {
              title: "Participation ≠ achievement",
              body: "NHS membership scores zero in awards. 'Volunteering' without measurable impact scores low in activity depth. We reward substance, not resume padding.",
            },
            {
              title: "No score inflation over time",
              body: "If your profile hasn't meaningfully improved, your score shouldn't go up. We resist the temptation to gamify progress with artificial score bumps.",
            },
          ].map((item) => (
            <li
              key={item.title}
              className="rounded-xl border p-5"
              style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)" }}
            >
              <p className="text-sm font-bold mb-1" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>
                {item.title}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Current product scope and boundaries */}
      <section className="mb-12 sm:mb-16">
        <h2
          className="mb-4 text-2xl sm:text-3xl font-extrabold tracking-tight"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          What AdmitPath currently implements
        </h2>
        <p className="mb-6 text-base leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          Product behavior, plan limits, and important boundaries in one place.
        </p>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)" }}>
          <table className="w-full text-sm" style={{ minWidth: 640 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                <th className="text-left px-4 py-3 font-bold" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)", width: "22%" }}>&nbsp;</th>
                <th className="text-center px-3 py-3 font-bold" style={{ color: "#4A6FA5", fontFamily: "var(--font-inter)" }}>Current behavior</th>
                <th className="text-center px-3 py-3 font-bold" style={{ color: "var(--dl-text-muted, #5A6275)", fontFamily: "var(--font-inter)" }}>Free</th>
                <th className="text-center px-3 py-3 font-bold" style={{ color: "var(--dl-text-muted, #5A6275)", fontFamily: "var(--font-inter)" }}>Pro</th>
                <th className="text-center px-3 py-3 font-bold" style={{ color: "var(--dl-text-muted, #5A6275)", fontFamily: "var(--font-inter)" }}>Boundary</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: "Profile analysis", ap: "Seven planning dimensions", cv: "5 analyses", ni: "No Free-plan count cap", pc: "Not an admission prediction" },
                { feature: "Essay feedback", ap: "Structured rubric and revision notes", cv: "5 reviews", ni: "No Free-plan count cap", pc: "Student remains the author" },
                { feature: "Counselor chat", ap: "Account-aware planning responses", cv: "5 messages", ni: "No Free-plan count cap", pc: "Not a human counselor" },
                { feature: "Saved colleges", ap: "Account-scoped college list", cv: "Up to 8", ni: "No Free-plan count cap", pc: "Verify records on official sites" },
                { feature: "Published sources", ap: "CDS, IPEDS, and College Scorecard where available", cv: "Included", ni: "Included", pc: "Coverage and publication dates vary" },
                { feature: "Methodology", ap: "Public scoring and probability-band explanation", cv: "Included", ni: "Included", pc: "Heuristic planning model" },
                { feature: "Web access", ap: "Self-service browser application", cv: "Included", ni: "Included", pc: "No uptime guarantee" },
                { feature: "Human support", ap: "Software plus support contact", cv: "Standard", ni: "Standard", pc: "Does not replace qualified counseling" },
              ].map((row, i) => (
                <tr key={row.feature} style={{ borderBottom: i < 7 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
                  <td className="px-4 py-2.5 font-semibold text-xs" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{row.feature}</td>
                  <td className="px-3 py-2.5 text-center text-xs font-semibold" style={{ color: "#4A6FA5" }}>{row.ap}</td>
                  <td className="px-3 py-2.5 text-center text-xs" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{row.cv}</td>
                  <td className="px-3 py-2.5 text-center text-xs" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{row.ni}</td>
                  <td className="px-3 py-2.5 text-center text-xs" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{row.pc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Related resources */}
      <section className="mb-10">
        <h2
          className="mb-3 text-[17px] font-semibold"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          Related resources
        </h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/college-rankings-explained"
            className="rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors hover:border-[#4A6FA5] hover:text-[#4A6FA5]"
            style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
          >
            Rankings Explained
          </Link>
          <Link
            href="/application-component-weighting"
            className="rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors hover:border-[#4A6FA5] hover:text-[#4A6FA5]"
            style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
          >
            Component Weighting
          </Link>
          <Link
            href="/glossary"
            className="rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors hover:border-[#4A6FA5] hover:text-[#4A6FA5]"
            style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
          >
            Admissions Glossary
          </Link>
          <Link
            href="/faq"
            className="rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors hover:border-[#4A6FA5] hover:text-[#4A6FA5]"
            style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
          >
            Admissions FAQ
          </Link>
        </div>
      </section>

      {/* CTA */}
      <MarketingCTA
        headline="See your score against the methodology"
        description="Run a free analysis and see which of the 7 dimensions are pulling your composite up -- and which are dragging it down."
        buttonText="Score my profile"
      />
    </MarketingLayout>
  );
}
