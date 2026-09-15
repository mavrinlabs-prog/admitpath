import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, GraduationCap, HelpCircle, Clock, FileText } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { COLLEGE_SLUGS, findCollege, type College } from "@/data/colleges";
import { getCdsWeights, DIMENSION_LABEL, WEIGHT_LABEL, rankedFactorsFor } from "@/lib/cds-weights";
import { collegeProfileSchema } from "@/lib/seo-schema";

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return COLLEGE_SLUGS.map((slug) => ({ slug }));
}

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = findCollege(slug);
  if (!c) return { title: "School not found" };
  const title = `${c.shortName} Admissions Planning Record | AdmitPath`;
  const description = `${c.shortName} structured admissions record: approximate acceptance rate, SAT range, GPA, enrollment, and available CDS factors. Verify current figures with the school.`;
  const url = `${BASE}/colleges/${c.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: "AdmitPath",
      locale: "en_US",
      type: "article",
      images: [{
        url: `${BASE}/api/og?title=${encodeURIComponent(`${c.shortName} Admissions Record`)}&subtitle=${encodeURIComponent(`Verify current figures with the school`)}`,
        width: 1200, height: 630,
        alt: `How to get into ${c.shortName}`,
      }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@admitpath",
      title,
      description,
    },
  };
}

function collegeFaq(c: College) {
  return [
    { question: `What is ${c.shortName}'s acceptance rate?`, answer: `The AdmitPath record lists an approximate ${c.acceptanceRate}% acceptance rate from an available Common Data Set period. It can vary by year and application round; verify the current figure with the school.` },
    { question: `What SAT score do I need for ${c.shortName}?`, answer: `The middle 50% SAT range for ${c.shortName} is ${c.sat25}-${c.sat75}. Scoring above ${c.sat75} does not guarantee admission, and scoring below ${c.sat25} does not mean rejection — holistic review considers the full application.` },
    { question: `What GPA do I need to get into ${c.shortName}?`, answer: `The average unweighted GPA of admitted students at ${c.shortName} is approximately ${c.gpaAvg}. Course rigor (AP/IB/dual enrollment) matters as much as the GPA number itself.` },
    { question: `Does ${c.shortName} have Early Decision?`, answer: `Check ${c.shortName}'s admissions website at ${c.domain}/admissions for the most current information on early application options. Policies can change year to year.` },
    { question: `Is ${c.shortName} test-optional?`, answer: `${c.testPolicy ? `The AdmitPath record marks the policy as ${c.testPolicy}.` : `The AdmitPath record does not include a testing policy.`} Policies can change each cycle, so verify the current rule on the official admissions site.` },
    { question: `How many students attend ${c.shortName}?`, answer: `${c.name} has approximately ${c.enrollment.toLocaleString()} undergraduate students in this dataset. Verify the current enrollment with the institution.` },
    { question: `What is ${c.shortName} known for?`, answer: c.oneLiner },
  ];
}

function selectivityTier(rate: number): { label: string; color: string } {
  if (rate <= 5) return { label: "Most Selective", color: "#dc2626" };
  if (rate <= 10) return { label: "Extremely Selective", color: "#ea580c" };
  if (rate <= 20) return { label: "Highly Selective", color: "#d97706" };
  if (rate <= 35) return { label: "Very Selective", color: "#4A6FA5" };
  if (rate <= 50) return { label: "Selective", color: "#2563eb" };
  return { label: "Moderately Selective", color: "#16a34a" };
}

export default async function CollegeProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = findCollege(slug);
  if (!c) notFound();

  const faq = collegeFaq(c);
  const schema = collegeProfileSchema({
    collegeName: c.name,
    slug: c.slug,
    city: c.city,
    state: c.state,
    faq,
  });
  const tier = selectivityTier(c.acceptanceRate);
  const weights = getCdsWeights(c.slug);
  const topFactors = weights ? rankedFactorsFor(c).slice(0, 5) : [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <MarketingLayout
        eyebrow="COLLEGE PROFILE"
        title={`${c.shortName} Admissions Planning Record`}
        description={c.oneLiner}
        maxWidth="max-w-4xl"
        backHref="/college"
        backLabel="All Colleges"
      >
        {/* AI Summary Nugget — citation-worthy */}
        <div
          className="mb-10 rounded-xl border p-5"
          style={{
            backgroundColor: "var(--color-surface, #EFF2F8)",
            borderColor: "rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex items-start gap-3">
            <GraduationCap className="mt-0.5 h-5 w-5 flex-shrink-0" style={{ color: "#4A6FA5" }} />
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                Quick Answer
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {c.name} has a {c.acceptanceRate}% acceptance rate with a middle 50% SAT range of {c.sat25}-{c.sat75} and average GPA of {c.gpaAvg}. {c.oneLiner} Founded {c.founded} in {c.city}, {c.state}.
              </p>
            </div>
          </div>
        </div>

        {/* Admissions Snapshot Table */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Admissions Snapshot
          </h2>
          <div
            className="overflow-hidden rounded-xl border"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
          >
            <table className="w-full text-sm">
              <tbody>
                {[
                  { label: "Acceptance Rate", value: `${c.acceptanceRate}%`, extra: tier.label },
                  { label: "SAT Range (25th-75th)", value: `${c.sat25} - ${c.sat75}` },
                  { label: "Average GPA (Unweighted)", value: `${c.gpaAvg}` },
                  { label: "Undergraduate Enrollment", value: c.enrollment.toLocaleString() },
                  { label: "School Type", value: c.type === "private" ? "Private" : "Public" },
                  { label: "Location", value: `${c.city}, ${c.state}` },
                  { label: "Founded", value: `${c.founded}` },
                  ...(c.testPolicy ? [{ label: "Test Policy", value: c.testPolicy === "test-optional" ? "Test-Optional" : c.testPolicy === "test-blind" ? "Test-Blind" : "Required" }] : []),
                  ...(c.needBlind !== undefined ? [{ label: "Need-Blind", value: c.needBlind ? "Yes" : "No" }] : []),
                  ...(c.meetsFullNeed !== undefined ? [{ label: "Meets 100% Need", value: c.meetsFullNeed ? "Yes" : "No" }] : []),
                ].map((row, i) => (
                  <tr key={row.label} style={{ backgroundColor: i % 2 === 0 ? "var(--color-surface-raised, #FFFFFF)" : "var(--color-surface, #EFF2F8)" }}>
                    <td className="px-4 py-3 font-medium" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{row.label}</td>
                    <td className="px-4 py-3 text-right" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                      {row.value}
                      {row.extra && (
                        <span className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: `${tier.color}15`, color: tier.color }}>
                          {row.extra}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
            Data source: IPEDS College Navigator and institutional Common Data Set (most recent available year). Data lags approximately one year.
          </p>
        </section>

        {/* CDS Weights / What Matters Most */}
        {topFactors.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              What {c.shortName} Values Most (CDS Data)
            </h2>
            <div className="space-y-2">
              {topFactors.map(({ dimension, weight }) => (
                <div
                  key={dimension}
                  className="flex items-center justify-between rounded-lg border px-4 py-3"
                  style={{
                    backgroundColor: "var(--color-surface-raised, #FFFFFF)",
                    borderColor: "rgba(0,0,0,0.06)",
                  }}
                >
                  <span className="text-sm font-medium" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                    {DIMENSION_LABEL[dimension]}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: "#4A6FA5" }}>
                    {WEIGHT_LABEL[weight]}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Verify current application requirements
          </h2>
          <div className="rounded-xl border p-6" style={{ backgroundColor: "var(--color-surface-raised, #FFFFFF)", borderColor: "rgba(0,0,0,0.06)" }}>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              AdmitPath does not infer applicant archetypes, early-round advantages, essay prompts,
              or demonstrated-interest policy from a school&apos;s overall acceptance rate. Check the
              official admissions site for the current cycle before making application decisions.
            </p>
            <a href={"https://" + c.domain} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold hover:underline" style={{ color: "#4A6FA5" }}>
              Visit {c.shortName}&apos;s official website
            </a>
          </div>
        </section>


        {/* Worksheet CTA */}
        <section className="mb-10">
          <div
            className="rounded-xl border p-6"
            style={{
              backgroundColor: "var(--color-surface, #EFF2F8)",
              borderColor: "rgba(0,0,0,0.06)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4" style={{ color: "#4A6FA5" }} />
              <h2 className="text-lg font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                Use the {c.shortName} Fit Worksheet
              </h2>
            </div>
            <p className="text-sm mb-4" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Review your profile with AdmitPath&apos;s documented seven-dimension rubric. This is planning guidance, not a school-specific admission probability.
            </p>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "#4A6FA5" }}
            >
              Review Your Profile
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faq.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border p-5"
                style={{
                  backgroundColor: "var(--color-surface-raised, #FFFFFF)",
                  borderColor: "rgba(0,0,0,0.06)",
                }}
              >
                <h3 className="text-sm font-semibold mb-2 flex items-start gap-2" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                  <HelpCircle className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "#4A6FA5" }} />
                  {item.question}
                </h3>
                <p className="text-sm leading-relaxed pl-6" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
        <div className="mb-10">
          <h2 className="text-lg font-bold mb-3" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            More Resources
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            <a href={"https://" + c.domain} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg border p-3 text-sm hover:shadow-sm" style={{ backgroundColor: "var(--color-surface-raised, #FFFFFF)", borderColor: "rgba(0,0,0,0.06)", color: "#4A6FA5" }}>
              <ArrowRight className="h-3.5 w-3.5" /> Official {c.shortName} Website
            </a>
            <Link href="/colleges" className="flex items-center gap-2 rounded-lg border p-3 text-sm hover:shadow-sm" style={{ backgroundColor: "var(--color-surface-raised, #FFFFFF)", borderColor: "rgba(0,0,0,0.06)", color: "#4A6FA5" }}>
              <ArrowRight className="h-3.5 w-3.5" /> Browse College Records
            </Link>
            <Link href="/calculator" className="flex items-center gap-2 rounded-lg border p-3 text-sm hover:shadow-sm" style={{ backgroundColor: "var(--color-surface-raised, #FFFFFF)", borderColor: "rgba(0,0,0,0.06)", color: "#4A6FA5" }}>
              <ArrowRight className="h-3.5 w-3.5" /> Open Planning Calculator
            </Link>
            <Link href="/methodology" className="flex items-center gap-2 rounded-lg border p-3 text-sm hover:shadow-sm" style={{ backgroundColor: "var(--color-surface-raised, #FFFFFF)", borderColor: "rgba(0,0,0,0.06)", color: "#4A6FA5" }}>
              <ArrowRight className="h-3.5 w-3.5" /> Read the Methodology
            </Link>
          </div>
        </div>


        {/* Author & Last Updated */}
        <div
          className="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl border p-5"
          style={{
            backgroundColor: "var(--color-surface, #EFF2F8)",
            borderColor: "rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Prepared by AdmitPath
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
              The record compiles approximate public fields. The current dataset does not include a per-row publication date; verify every current figure with the institution.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
            <Clock className="h-3.5 w-3.5" />
            Verification required for the current cycle
          </div>
        </div>

        <MarketingCTA
          heading="Review your application profile"
          description="Use a documented seven-dimension rubric to organize next steps. Results are planning guidance, not admission probabilities."
          primaryLabel="Get Your Free Profile Score"
          primaryHref="/analyze"
          secondaryLabel="Build Your College List"
          secondaryHref="/worksheets/college-list-generator"
        />
      </MarketingLayout>
    </div>
  );
}
