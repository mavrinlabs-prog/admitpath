import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ALL_STATES,
  STATE_SUBPAGES,
  STATE_SUBPAGE_META,
  getAllStateSubpageParams,
} from "@/data/seo-combo-pages";

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://admith.vercel.app")
  .trim()
  .replace(/\/+$/, "");

interface PageProps {
  params: Promise<{ state: string; subpage: string }>;
}

export function generateStaticParams() {
  return getAllStateSubpageParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state, subpage } = await params;
  const stateData = ALL_STATES.find((s) => s.slug === state);
  const meta = STATE_SUBPAGE_META[subpage as keyof typeof STATE_SUBPAGE_META];
  if (!stateData || !meta) return { title: "Page Not Found" };

  const title = `${stateData.name} ${meta.titleSuffix} | AdmitPath`;
  const description = meta.descTemplate
    .replace(/\{state\}/g, stateData.name)
    .replace(/\{abbr\}/g, stateData.abbr);

  return {
    title,
    description,
    alternates: { canonical: `${APP_URL}/states/${state}/${subpage}` },
    openGraph: {
      title,
      description,
      url: `${APP_URL}/states/${state}/${subpage}`,
      siteName: "AdmitPath",
      type: "article",
    },
  };
}

export default async function StateSubPage({ params }: PageProps) {
  const { state, subpage } = await params;
  const stateData = ALL_STATES.find((s) => s.slug === state);
  const meta = STATE_SUBPAGE_META[subpage as keyof typeof STATE_SUBPAGE_META];

  if (
    !stateData ||
    !meta ||
    !STATE_SUBPAGES.includes(subpage as (typeof STATE_SUBPAGES)[number])
  ) {
    notFound();
  }

  const description = meta.descTemplate
    .replace(/\{state\}/g, stateData.name)
    .replace(/\{abbr\}/g, stateData.abbr);
  const h1 = `${stateData.name} ${meta.titleSuffix}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: h1,
    description,
    url: `${APP_URL}/states/${state}/${subpage}`,
    publisher: {
      "@type": "Organization",
      name: "AdmitPath",
      url: APP_URL,
    },
    about: {
      "@type": "State",
      name: stateData.name,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: APP_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "States",
        item: `${APP_URL}/states`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: stateData.name,
        item: `${APP_URL}/states/${state}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: meta.titleSuffix,
        item: `${APP_URL}/states/${state}/${subpage}`,
      },
    ],
  };

  const otherSubpages = STATE_SUBPAGES.filter((sp) => sp !== subpage);
  const nearbyStates = ALL_STATES.filter((s) => s.slug !== state).slice(0, 6);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:underline">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/states" className="hover:underline">States</Link>
          </li>
          <li>/</li>
          <li>
            <Link href={`/states/${state}`} className="hover:underline">
              {stateData.name}
            </Link>
          </li>
          <li>/</li>
          <li className="font-medium text-foreground">{meta.titleSuffix}</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{h1}</h1>

      <section className="mt-6">
        <p className="text-lg leading-relaxed text-muted-foreground">
          {description}
        </p>
      </section>

      {/* Subpage content */}
      {subpage === "colleges" && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">
            Top Colleges in {stateData.name}
          </h2>
          <p className="mt-3 leading-relaxed">
            Explore the best 4-year universities in {stateData.name}, including
            public flagships, private institutions, and liberal arts colleges.
            Compare acceptance rates, test scores, and tuition costs to find
            your best fit.
          </p>
        </section>
      )}
      {subpage === "admissions-guide" && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">
            Applying from {stateData.name}
          </h2>
          <p className="mt-3 leading-relaxed">
            A complete admissions guide for {stateData.name} ({stateData.abbr})
            residents. Learn about in-state advantages, state university
            requirements, common application platforms, and strategies to
            maximize your chances.
          </p>
        </section>
      )}
      {subpage === "scholarships" && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">
            {stateData.name} Scholarships
          </h2>
          <p className="mt-3 leading-relaxed">
            Find scholarships available to {stateData.name} students, including
            state-funded grants, merit scholarships, and need-based aid
            programs. FAFSA tips for {stateData.abbr} residents included.
          </p>
        </section>
      )}
      {subpage === "deadlines" && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">
            Application Deadlines in {stateData.name}
          </h2>
          <p className="mt-3 leading-relaxed">
            Stay on track with college application deadlines for{" "}
            {stateData.name} universities. Early Decision, Early Action, Regular
            Decision, and financial aid dates for the 2026-2027 cycle.
          </p>
        </section>
      )}

      {/* CTA */}
      <section className="mt-10 rounded-xl border bg-muted/30 p-6 text-center">
        <h2 className="text-lg font-semibold">
          Build Your College List for {stateData.name}
        </h2>
        <p className="mt-1 text-muted-foreground">
          AI-powered admissions assessment for {stateData.abbr} students. Free
          to start.
        </p>
        <Link
          href="/sign-up"
          className="mt-4 inline-block rounded-lg bg-[#4A6FA5] px-6 py-2.5 font-medium text-white hover:bg-[#3D5F8F]"
        >
          Start Free Analysis
        </Link>
      </section>

      {/* Other subpages */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">
          More for {stateData.name} Students
        </h2>
        <ul className="mt-3 space-y-2">
          {otherSubpages.map((sp) => (
            <li key={sp}>
              <Link
                href={`/states/${state}/${sp}`}
                className="text-[#4A6FA5] hover:underline"
              >
                {stateData.name}{" "}
                {STATE_SUBPAGE_META[sp as keyof typeof STATE_SUBPAGE_META]
                  ?.titleSuffix || sp}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Other states */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold">Explore Other States</h2>
        <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {nearbyStates.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/states/${s.slug}/${subpage}`}
                className="text-sm text-[#4A6FA5] hover:underline"
              >
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
