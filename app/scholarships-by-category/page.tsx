import type { Metadata } from "next";
import { ExternalLink, Calendar, Users } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import scholarships from "@/../../public/scholarships.json";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Scholarships by Category — Merit, Need, STEM",
  description:
    "Browse 20 vetted scholarships organized by category: need-based, merit, minority, STEM, leadership, regional. Renewable, deadlines, and direct application links.",
  alternates: { canonical: `${BASE}/scholarships-by-category` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Scholarships by Category — Merit, Need, STEM",
    description: "Browse vetted scholarships by category: need-based, merit, minority, STEM, leadership, regional.",
    url: `${BASE}/scholarships-by-category`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Scholarships+by+Category&subtitle=Need-based+%C2%B7+merit+%C2%B7+STEM+%C2%B7+minority`, width: 1200, height: 630, alt: "Scholarships by Category" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Scholarships by Category", description: "Browse vetted scholarships: need-based, merit, minority, STEM, leadership.", images: [`${BASE}/api/og?title=Scholarships+by+Category&subtitle=Need-based+%C2%B7+merit+%C2%B7+STEM+%C2%B7+minority`] },
};

type Scholarship = {
  name: string;
  amount: string;
  deadline: string;
  eligibility: string;
  renewable: boolean;
  category: string;
  grades: string[];
  url: string;
  description: string;
};

// Map raw category strings to top-level group buckets. A scholarship may
// appear in multiple groups (Gates is both Need-Based and Minority/Merit).
type GroupKey = "need-based" | "merit" | "minority" | "stem" | "leadership" | "regional";

const GROUP_META: Record<GroupKey, { label: string; description: string; matchers: string[] }> = {
  "need-based": {
    label: "Need-Based",
    description:
      "For students from low- and middle-income families. Awards are based on demonstrated financial need rather than just academic performance.",
    matchers: ["Need-Based"],
  },
  "merit": {
    label: "Merit",
    description:
      "Awarded primarily on academic, test, or competitive achievement. Most don't have income requirements; some have minimum-GPA gates.",
    matchers: ["Merit", "Achievement"],
  },
  "minority": {
    label: "Minority and Underrepresented Backgrounds",
    description:
      "Targeted to students from racial, ethnic, or other underrepresented backgrounds. Eligibility criteria vary by program.",
    matchers: ["Minority"],
  },
  "stem": {
    label: "STEM and Research",
    description:
      "For students pursuing STEM majors or with demonstrated research achievement. Often includes research stipends or summer programs.",
    matchers: ["STEM"],
  },
  "leadership": {
    label: "Leadership",
    description:
      "Awarded for sustained leadership in school, community, or independent initiatives. Often heavily weighted toward holistic application narratives.",
    matchers: ["Leadership"],
  },
  "regional": {
    label: "Regional and State-Specific",
    description:
      "Restricted to students from specific states or geographic regions. Always check eligibility — some are open to specific high schools or counties only.",
    matchers: ["Regional"],
  },
};

function categorize(s: Scholarship): GroupKey[] {
  const cat = s.category;
  const groups: GroupKey[] = [];
  (Object.keys(GROUP_META) as GroupKey[]).forEach((key) => {
    if (GROUP_META[key].matchers.some((m) => cat.includes(m))) groups.push(key);
  });
  return groups;
}

const items = scholarships as Scholarship[];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/scholarships-by-category#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Resources", item: `${BASE}/resources` },
        { "@type": "ListItem", position: 3, name: "Scholarships by Category", item: `${BASE}/scholarships-by-category` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/scholarships-by-category#page`,
      url: `${BASE}/scholarships-by-category`,
      name: "Scholarships by Category — Need-Based, Merit, Minority, STEM",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/scholarships-by-category#breadcrumb` },
      inLanguage: "en-US",
      mainEntity: { "@id": `${BASE}/scholarships-by-category#list` },
    },
    {
      "@type": "ItemList",
      "@id": `${BASE}/scholarships-by-category#list`,
      name: "Scholarships organized by eligibility category",
      numberOfItems: items.length,
      itemListElement: items.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "MonetaryGrant",
          name: s.name,
          description: s.description,
          url: s.url,
          amount: { "@type": "MonetaryAmount", value: s.amount, currency: "USD" },
        },
      })),
    },
  ],
};

export default function ScholarshipsByCategoryPage() {
  const groups = (Object.keys(GROUP_META) as GroupKey[]).map((key) => ({
    key,
    meta: GROUP_META[key],
    items: items.filter((s) => categorize(s).includes(key)),
  }));

  return (
    <MarketingLayout
      eyebrow="Scholarships"
      title="Scholarships by Category"
      description={`${items.length} curated scholarships organized by who they serve. Each scholarship can appear in multiple categories — Gates is both need-based and minority-focused. Click any name to apply directly.`}
      backHref="/resources"
      backLabel="All resources"
      maxWidth="max-w-4xl"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

        {/* Quick nav */}
        <nav aria-label="Scholarship categories" className="mb-12 flex flex-wrap gap-1.5">
          {groups.map((g) => (
            <a
              key={g.key}
              href={`#${g.key}`}
              className="rounded-full border px-3 py-1 text-[12px] font-medium transition-colors hover:border-[color:#4A6FA5]"
              style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
            >
              {g.meta.label} ({g.items.length})
            </a>
          ))}
        </nav>

        {/* Sections */}
        {groups.map((g) => (
          <section key={g.key} id={g.key} className="mb-14 scroll-mt-24">
            <h2
              className="mb-2 text-[20px] font-semibold"
              style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
            >
              {g.meta.label}{" "}
              <span className="text-[14px] font-normal" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                ({g.items.length})
              </span>
            </h2>
            <p className="mb-5 text-[14px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              {g.meta.description}
            </p>

            <div className="space-y-3">
              {g.items.map((s) => (
                <div
                  key={s.name}
                  className="dl-card-hover rounded-xl border p-4 sm:p-5"
                  style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <h3
                          className="text-[15px] font-semibold"
                          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-instrument-sans)" }}
                        >
                          {s.name}
                        </h3>
                        {s.renewable && (
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                            style={{ color: "#16A34A", background: "rgba(22,163,74,0.1)" }}
                          >
                            Renewable
                          </span>
                        )}
                      </div>
                      <p
                        className="mb-2 text-[18px] font-bold tabular-nums"
                        style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                      >
                        {s.amount}
                      </p>
                      <p className="mb-2 text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                        {s.description}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Deadline: {s.deadline}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" /> {s.eligibility}
                        </span>
                      </div>
                    </div>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-[12px] font-medium transition-colors hover:border-[color:var(--dl-text-muted, #5A6275)]"
                      style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
                    >
                      Apply
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Scholarship Finder link */}
        <div
          className="mt-12 mb-8 rounded-2xl border p-6 text-center"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
        >
          <p className="text-[14px] font-semibold mb-1" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Want personalized matches?
          </p>
          <p className="text-[13px] mb-3 mx-auto max-w-md" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Filter the scholarship catalog by GPA, SAT, state, and background, then verify current requirements on each provider&apos;s official page.
          </p>
          <a
            href="/scholarship-match"
            className="btn-primary inline-flex h-10 items-center gap-2 px-5 text-sm"
          >
            Match scholarships to my profile
          </a>
        </div>

        {/* CTA */}
        <div>
          <MarketingCTA
            headline="Get personalized college guidance"
            description="Profile scoring, essay feedback, AI counselor chat, and a personalized action plan. Free plan included. Pro $19.99/mo."
            buttonText="Score my profile"
          />
        </div>
    </MarketingLayout>
  );
}
