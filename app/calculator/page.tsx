import type { Metadata } from "next";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { ChancesCalculator } from "./calculator-client";

export const revalidate = 86400;

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "College Admissions Calculator | Free Tool",
  description: "Free college admissions calculator calibrated to real CDS data. Enter GPA, test scores, and activities to see your chances at 102+ schools. Try it now.",
  alternates: { canonical: `${BASE}/calculator` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "College Chances Calculator (Free)",
    description: "Free college admissions chances calculator. See your odds at top US universities.",
    url: `${BASE}/calculator`,
    type: "website",
    images: [{ url: `${BASE}/api/og?title=${encodeURIComponent("Free College Chances Calculator")}&subtitle=${encodeURIComponent("GPA + SAT + ECs \u2192 your odds at every top school")}`, width: 1200, height: 630, alt: "Free College Chances Calculator" }],
    locale: "en_US",
    siteName: "AdmitPath",
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "College Chances Calculator (Free)", description: "Free college admissions chances calculator. See your odds at top US universities.", images: [`${BASE}/api/og?title=${encodeURIComponent("Free College Chances Calculator")}&subtitle=${encodeURIComponent("GPA + SAT + ECs \u2192 your odds at every top school")}`] },
};

export default function CalculatorPage() {
  return (
    <div style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebApplication",
                name: "AdmitPath College Chances Calculator",
                url: `${BASE}/calculator`,
                applicationCategory: "EducationalApplication",
                operatingSystem: "Web",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
                description:
                  "Free college admissions chances calculator. Estimates odds at top US universities based on GPA, SAT, and extracurriculars.",
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: BASE },
                  { "@type": "ListItem", position: 2, name: "Chances Calculator", item: `${BASE}/calculator` },
                ],
              },
              {
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "How accurate is a college chances calculator?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Chances calculators give a rough probability based on the gap between your stats and the school's middle 50%. They cannot account for essays, recommendations, hooks, or institutional priorities. Treat the number as directional, not predictive.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Is this calculator free?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes. The basic chances calculator is free to use without an account. AdmitPath's full 7-dimension AI analysis (which factors in essays, course rigor, awards, leadership, and more) requires a free account.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "What does the chances calculator look at?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "This calculator uses your unweighted GPA, SAT score, and a self-rated extracurriculars score to estimate odds at each school. It compares your numbers against each school's published Common Data Set ranges.",
                    },
                  },
                ],
              },
            ],
          }),
        }}
      />

      <MarketingNav />

      <main className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li aria-hidden>/</li>
            <li aria-current="page" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Chances Calculator</li>
          </ol>
        </nav>

        <header className="mb-10">
          <p className="section-label">Free tool</p>
          <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight mb-4" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>
            College Chances Calculator
          </h1>
          <p className="text-lg" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Free, no sign-up required. Enter your stats, get your estimated admissions odds at 30+ top US universities.
          </p>
        </header>

        <ChancesCalculator />

        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-3 tracking-tight" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>How this works</h2>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            This calculator compares your unweighted GPA, SAT, and self-rated extracurricular strength against each school&apos;s published Common Data Set ranges. It gives you a directional probability — Reach, Target, or Likely — not a guarantee.
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Real admissions decisions depend on factors no calculator can score: essays, recommendations, hooks (legacy, athletic, first-gen), institutional priorities, and how your transcript reads in context. For a real assessment that includes those, run AdmitPath&apos;s 7-dimension analysis.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-5 tracking-tight" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>FAQ</h2>
          <div className="space-y-3">
            {[
              { q: "How accurate is this calculator?", a: "It's directional, not predictive. The numbers tell you whether your stats are competitive -- they don't account for essays, recommendations, hooks, or fit." },
              { q: "Is it free?", a: "Yes, completely free, no sign-up required." },
              { q: "What's the difference vs. AdmitPath's full analysis?", a: "This calculator looks at GPA + SAT + a self-rated EC score. AdmitPath's full 7-dimension analysis covers academic rigor, leadership, awards, activity depth, spike, essay quality, and recommendations -- and reads each in the context of your target schools. Free plan included, no time limit." },
            ].map(({ q, a }) => (
              <details key={q} className="dl-card-hover rounded-2xl border p-5" style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}>
                <summary className="cursor-pointer font-bold text-base" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{q}</summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div
          className="mt-12 rounded-2xl border p-8 text-center"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
        >
          <h2 className="text-lg font-bold mb-2" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Want a deeper analysis?
          </h2>
          <p className="text-sm mb-4" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            The full 7-dimension AI analysis factors in essays, course rigor, awards, leadership, and more. Free plan included. Pro $19.99/mo.
          </p>
          <Link
            href="/sign-up"
            className="btn-primary inline-flex h-11 items-center gap-2 px-6 text-sm"
          >
            Get my full analysis
          </Link>
        </div>

        {/* Related tools */}
        <nav className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3" aria-label="Related tools">
          <Link
            href="/quiz"
            className="rounded-xl border p-4 transition-shadow hover:shadow-md"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
          >
            <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Chances Quiz
            </div>
            <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              5-question guided assessment with tier breakdown.
            </div>
          </Link>
          <Link
            href="/college-list-builder"
            className="rounded-xl border p-4 transition-shadow hover:shadow-md"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
          >
            <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              College List Builder
            </div>
            <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              The 4-band probability framework for a balanced list.
            </div>
          </Link>
          <Link
            href="/test-prep-guide"
            className="rounded-xl border p-4 transition-shadow hover:shadow-md"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
          >
            <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Test Prep Guide
            </div>
            <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              12-week SAT/ACT plan for 100-200 point gains.
            </div>
          </Link>
          <Link
            href="/tools"
            className="rounded-xl border p-4 transition-shadow hover:shadow-md"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
          >
            <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              All Tools
            </div>
            <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Calculators and planning references for the application process.
            </div>
          </Link>
        </nav>
      </main>
    </div>
  );
}
