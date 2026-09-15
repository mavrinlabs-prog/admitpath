import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, GraduationCap, Users, MapPin, Calendar, BarChart3, Target } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { COMPARISON_PAIRS, parseComparisonSlug } from "@/data/comparison-pairs";
import { getCdsWeights, DIMENSION_LABEL, WEIGHT_LABEL, type CdsDimension } from "@/lib/cds-weights";
import type { College } from "@/data/colleges";

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return COMPARISON_PAIRS.map((p) => ({ slug: p.slug }));
}

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");
const YEAR = new Date().getFullYear();

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pair = parseComparisonSlug(slug);
  if (!pair) return { title: "Comparison not found" };
  const { a, b } = pair;
  const title = `${a.shortName} vs ${b.shortName}: Which Is Better? (${YEAR})`;
  const description = `${a.shortName} vs ${b.shortName} — compare acceptance rates (${a.acceptanceRate}% vs ${b.acceptanceRate}%), SAT ranges, GPA, enrollment, and admissions weights side by side. See which school is right for you.`;
  const url = `${BASE}/compare/${slug}`;
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
        url: `${BASE}/api/og?title=${encodeURIComponent(`${a.shortName} vs ${b.shortName}`)}&subtitle=${encodeURIComponent(`${a.acceptanceRate}% vs ${b.acceptanceRate}% acceptance`)}`,
        width: 1200, height: 630,
        alt: `${a.shortName} vs ${b.shortName} comparison`,
      }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@admitpath",
      title,
      description,
      images: [`${BASE}/api/og?title=${encodeURIComponent(`${a.shortName} vs ${b.shortName}`)}&subtitle=${encodeURIComponent(`${a.acceptanceRate}% vs ${b.acceptanceRate}% acceptance`)}`],
    },
  };
}

function jsonLd(a: College, b: College, slug: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${BASE}/compare/${slug}#page`,
        url: `${BASE}/compare/${slug}`,
        name: `${a.shortName} vs ${b.shortName}: Admissions Comparison ${YEAR}`,
        isPartOf: { "@id": `${BASE}/#website` },
        inLanguage: "en-US",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE },
          { "@type": "ListItem", position: 2, name: "Compare", item: `${BASE}/compare` },
          { "@type": "ListItem", position: 3, name: `${a.shortName} vs ${b.shortName}`, item: `${BASE}/compare/${slug}` },
        ],
      },
    ],
  };
}

function StatRow({ label, valueA, valueB, highlight }: { label: string; valueA: string; valueB: string; highlight?: "a" | "b" | null }) {
  return (
    <tr className="border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
      <td className="py-3 px-4 text-sm font-medium" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{label}</td>
      <td className={`py-3 px-4 text-sm text-center font-semibold ${highlight === "a" ? "" : ""}`} style={{ color: highlight === "a" ? "#4A6FA5" : "var(--dl-text-primary, #1B2030)" }}>{valueA}</td>
      <td className={`py-3 px-4 text-sm text-center font-semibold`} style={{ color: highlight === "b" ? "#4A6FA5" : "var(--dl-text-primary, #1B2030)" }}>{valueB}</td>
    </tr>
  );
}

export default async function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pair = parseComparisonSlug(slug);
  if (!pair) return notFound();
  const { a, b } = pair;

  const weightsA = getCdsWeights(a.slug);
  const weightsB = getCdsWeights(b.slug);

  const dimensions = Object.keys(DIMENSION_LABEL) as CdsDimension[];
  const weightDiffs = dimensions
    .filter((d) => weightsA[d] !== weightsB[d])
    .sort((x, y) => Math.abs(weightsB[y] - weightsA[y]) - Math.abs(weightsB[x] - weightsA[x]));

  return (
    <MarketingLayout
      eyebrow="College comparison"
      title={`${a.shortName} vs ${b.shortName}`}
      description={`Side-by-side admissions data for ${a.name} and ${b.name}. See which school matches your profile.`}
      backHref="/compare"
      backLabel="Compare tool"
      maxWidth="max-w-4xl"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(a, b, slug)) }}
      />

      {/* Breadcrumbs */}
      <div className="mb-8">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Compare", href: "/compare" },
          { label: `${a.shortName} vs ${b.shortName}` },
        ]} />
      </div>

      {/* Side-by-side stats table */}
      <section className="mb-12">
        <div
          className="rounded-2xl border overflow-hidden -mx-4 sm:mx-0"
          style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
        >
          <div className="overflow-x-auto">
          <table className="w-full min-w-[480px]">
            <thead>
              <tr style={{ background: "rgba(74,111,165,0.08)" }}>
                <th className="py-3 px-4 text-left text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--dl-text-muted, #5A6275)" }}>Metric</th>
                <th className="py-3 px-4 text-center text-sm font-bold" style={{ color: "#4A6FA5" }}>
                  <Link href={`/college/${a.slug}`} className="hover:underline">{a.shortName}</Link>
                </th>
                <th className="py-3 px-4 text-center text-sm font-bold" style={{ color: "#4A6FA5" }}>
                  <Link href={`/college/${b.slug}`} className="hover:underline">{b.shortName}</Link>
                </th>
              </tr>
            </thead>
            <tbody>
              <StatRow
                label="Acceptance Rate"
                valueA={`${a.acceptanceRate}%`}
                valueB={`${b.acceptanceRate}%`}
                highlight={a.acceptanceRate < b.acceptanceRate ? "a" : a.acceptanceRate > b.acceptanceRate ? "b" : null}
              />
              <StatRow
                label="SAT Range (25th-75th)"
                valueA={`${a.sat25}–${a.sat75}`}
                valueB={`${b.sat25}–${b.sat75}`}
              />
              <StatRow
                label="Average GPA"
                valueA={a.gpaAvg.toFixed(2)}
                valueB={b.gpaAvg.toFixed(2)}
                highlight={a.gpaAvg > b.gpaAvg ? "a" : a.gpaAvg < b.gpaAvg ? "b" : null}
              />
              <StatRow
                label="Undergrad Enrollment"
                valueA={a.enrollment.toLocaleString()}
                valueB={b.enrollment.toLocaleString()}
              />
              <StatRow label="Type" valueA={a.type === "private" ? "Private" : "Public"} valueB={b.type === "private" ? "Private" : "Public"} />
              <StatRow label="Location" valueA={`${a.city}, ${a.state}`} valueB={`${b.city}, ${b.state}`} />
              <StatRow label="Founded" valueA={String(a.founded)} valueB={String(b.founded)} />
              {a.testPolicy && b.testPolicy && (
                <StatRow
                  label="Test Policy"
                  valueA={a.testPolicy === "test-optional" ? "Test-Optional" : a.testPolicy === "test-blind" ? "Test-Blind" : "Required"}
                  valueB={b.testPolicy === "test-optional" ? "Test-Optional" : b.testPolicy === "test-blind" ? "Test-Blind" : "Required"}
                />
              )}
              {(a.needBlind !== undefined || b.needBlind !== undefined) && (
                <StatRow
                  label="Need-Blind"
                  valueA={a.needBlind ? "Yes" : "No"}
                  valueB={b.needBlind ? "Yes" : "No"}
                />
              )}
              {(a.meetsFullNeed !== undefined || b.meetsFullNeed !== undefined) && (
                <StatRow
                  label="Meets Full Need"
                  valueA={a.meetsFullNeed ? "Yes" : "No"}
                  valueB={b.meetsFullNeed ? "Yes" : "No"}
                />
              )}
            </tbody>
          </table>
          </div>
        </div>
      </section>

      {/* Which is right for you? — CDS weight differences */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>
          Which is right for you?
        </h2>
        <p className="text-base leading-relaxed mb-6" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          {a.shortName} and {b.shortName} weight admissions factors differently. Understanding these differences helps you decide which school better fits your strengths.
        </p>

        {weightDiffs.length > 0 ? (
          <div className="space-y-3 mb-6">
            {weightDiffs.map((dim) => {
              const diff = weightsA[dim] - weightsB[dim];
              const favors = diff > 0 ? a.shortName : b.shortName;
              return (
                <div
                  key={dim}
                  className="rounded-xl border p-4"
                  style={{ background: "rgba(255,255,255,0.45)", borderColor: "rgba(0,0,0,0.06)" }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{DIMENSION_LABEL[dim]}</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(74,111,165,0.12)", color: "#4A6FA5" }}>
                      {favors} values this more
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                    <span>{a.shortName}: {WEIGHT_LABEL[weightsA[dim]]}</span>
                    <span>{b.shortName}: {WEIGHT_LABEL[weightsB[dim]]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm mb-6" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            Both schools weight admissions factors similarly according to CDS data. The difference comes down to your personal fit, campus culture, and academic interests.
          </p>
        )}

        {/* Quick summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-2xl border p-5" style={{ background: "rgba(255,255,255,0.45)", borderColor: "rgba(0,0,0,0.06)" }}>
            <h3 className="font-bold mb-2" style={{ color: "#4A6FA5" }}>{a.shortName}</h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              {a.oneLiner}
            </p>
            <Link
              href={`/college/${a.slug}`}
              className="inline-flex items-center gap-1 text-sm font-medium mt-3"
              style={{ color: "#4A6FA5" }}
            >
              Full profile <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="rounded-2xl border p-5" style={{ background: "rgba(255,255,255,0.45)", borderColor: "rgba(0,0,0,0.06)" }}>
            <h3 className="font-bold mb-2" style={{ color: "#4A6FA5" }}>{b.shortName}</h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              {b.oneLiner}
            </p>
            <Link
              href={`/college/${b.slug}`}
              className="inline-flex items-center gap-1 text-sm font-medium mt-3"
              style={{ color: "#4A6FA5" }}
            >
              Full profile <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Internal links for SEO */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>
          Related pages
        </h2>
        <div className="flex flex-wrap gap-2">
          {[a, b].map((c) => (
            <Link
              key={c.slug}
              href={`/acceptance-rate/${c.slug}`}
              className="text-sm font-medium px-3 py-1.5 rounded-full border transition-colors hover:bg-white/60"
              style={{ borderColor: "rgba(0,0,0,0.06)", color: "#4A6FA5" }}
            >
              {c.shortName} acceptance rate
            </Link>
          ))}
          {[a, b].map((c) => (
            <Link
              key={`how-${c.slug}`}
              href={`/how-to-get-into/${c.slug}`}
              className="text-sm font-medium px-3 py-1.5 rounded-full border transition-colors hover:bg-white/60"
              style={{ borderColor: "rgba(0,0,0,0.06)", color: "#4A6FA5" }}
            >
              How to get into {c.shortName}
            </Link>
          ))}
          {[a, b].map((c) => (
            <Link
              key={`college-${c.slug}`}
              href={`/college/${c.slug}`}
              className="text-sm font-medium px-3 py-1.5 rounded-full border transition-colors hover:bg-white/60"
              style={{ borderColor: "rgba(0,0,0,0.06)", color: "#4A6FA5" }}
            >
              {c.shortName} full profile
            </Link>
          ))}
        </div>
      </section>

      <MarketingCTA
        headline={`See your odds at both ${a.shortName} and ${b.shortName}`}
        description="AdmitPath scores your profile across 7 dimensions and shows you, honestly, where you stand at each school."
        buttonText="Get your free score"
      />
    </MarketingLayout>
  );
}
