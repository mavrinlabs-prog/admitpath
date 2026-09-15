import Link from "next/link";
import type { Metadata } from "next";
import { AlertCircle, Download } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import deadlines from "@/../../public/deadlines.json";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "College Application Deadlines 2026-2027",
  description:
    "Every college application deadline for 2026-2027: Early Decision, Early Action, Regular Decision, and financial aid dates. Searchable and sortable.",
  alternates: { canonical: `${BASE}/deadlines` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "College Application Deadlines 2026-2027",
    description: "ED, EA, REA, and RD deadlines for 50 top colleges with supplement counts and financial aid dates.",
    url: `${BASE}/deadlines`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Application+Deadlines&subtitle=50+top+colleges+%C2%B7+ED+EA+RD+dates`, width: 1200, height: 630, alt: "College Application Deadlines 2026-2027" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "College Application Deadlines 2026-2027", description: "ED, EA, REA, and RD deadlines for 50 top colleges.", images: [`${BASE}/api/og?title=Application+Deadlines&subtitle=50+top+colleges+%C2%B7+ED+EA+RD+dates`] },
};

type Deadline = {
  school: string;
  slug: string;
  ed: string | null;
  ea: string | null;
  rd: string;
  rea: boolean;
  supplements: number;
  portalOpens: string;
  finAid: string;
};

function isoDateForCycle(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const parsed = new Date(`${dateStr.replace(/,?\s*\d{4}$/, "")}, 2026`);
  if (isNaN(parsed.getTime())) return null;
  const month = parsed.getMonth();
  const year = month >= 8 ? 2026 : 2027;
  const d = new Date(parsed.setFullYear(year));
  return d.toISOString().slice(0, 10);
}

function buildEventsSchema(items: Deadline[]) {
  const events: Record<string, unknown>[] = [];
  for (const d of items.slice(0, 25)) {
    if (d.ed) {
      const date = isoDateForCycle(d.ed);
      if (date) {
        events.push({
          "@type": "Event",
          name: `${d.school} — Early Decision deadline`,
          startDate: date,
          eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
          eventStatus: "https://schema.org/EventScheduled",
          location: { "@type": "VirtualLocation", url: `${BASE}/college/${d.slug}` },
          organizer: { "@type": "EducationalOrganization", name: d.school },
          description: `Binding Early Decision application deadline for ${d.school}, 2026–2027 admissions cycle.`,
        });
      }
    }
    if (d.rd) {
      const date = isoDateForCycle(d.rd);
      if (date) {
        events.push({
          "@type": "Event",
          name: `${d.school} — Regular Decision deadline`,
          startDate: date,
          eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
          eventStatus: "https://schema.org/EventScheduled",
          location: { "@type": "VirtualLocation", url: `${BASE}/college/${d.slug}` },
          organizer: { "@type": "EducationalOrganization", name: d.school },
          description: `Regular Decision application deadline for ${d.school}, 2026–2027 admissions cycle.`,
        });
      }
    }
  }
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${BASE}/deadlines#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE },
          { "@type": "ListItem", position: 2, name: "Deadlines", item: `${BASE}/deadlines` },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${BASE}/deadlines#page`,
        url: `${BASE}/deadlines`,
        name: "College Application Deadlines 2026-2027",
        isPartOf: { "@id": `${BASE}/#website` },
        inLanguage: "en-US",
        description: "Common App deadlines for 50 top colleges with ED, EA, REA, and RD dates.",
      },
      ...events,
    ],
  };
}

export default function DeadlinesPage() {
  const items = deadlines as Deadline[];
  const eventsSchema = buildEventsSchema(items);

  const rea = items.filter((d) => d.rea && d.ea);
  const edOnly = items.filter((d) => d.ed && !d.rea);
  const eaOnly = items.filter((d) => d.ea && !d.rea && !d.ed);
  const rdOnly = items.filter((d) => !d.ed && !d.ea);

  const groups = [
    { label: "Restrictive Early Action (REA)", items: rea, color: "#2E4A6E", desc: "Apply to one school early. Non-binding." },
    { label: "Early Decision (ED)", items: edOnly, color: "#DC2626", desc: "Binding commitment. Apply to only one ED school." },
    { label: "Early Action (EA)", items: eaOnly, color: "#4A6FA5", desc: "Non-binding early application. Apply to multiple." },
    { label: "Regular Decision Only", items: rdOnly, color: "#6B7280", desc: "Single deadline, no early option." },
  ];

  return (
    <MarketingLayout
      eyebrow="Reference"
      title="Application Deadlines"
      description={`${items.length} schools with ED, EA, REA, and Regular Decision dates for the 2026–2027 application cycle. Supplement counts and financial aid deadlines included.`}
      maxWidth="max-w-5xl"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsSchema) }}
      />

      {items.length > 0 ? (
        <a
          href="/api/deadlines/ics"
          className="mb-8 inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-[13px] font-medium transition-colors hover:border-[color:#4A6FA5] hover:text-[color:#4A6FA5]"
          style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
          download="admitpath-deadlines.ics"
        >
          <Download className="h-3.5 w-3.5" />
          Download all deadlines (.ics calendar)
        </a>
      ) : (
        <div className="mb-8 rounded-lg border p-4 text-sm" style={{ borderColor: "rgba(74,111,165,0.2)", background: "rgba(74,111,165,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}>
          Verified 2026-2027 dates are being added as colleges publish them. Use the application timeline while the calendar is updated.
          <Link href="/college-application-timeline-2026" className="ml-1 font-semibold underline" style={{ color: "#4A6FA5" }}>
            View the application timeline
          </Link>
        </div>
      )}

      {/* Legend */}
      <div className="mb-10 flex flex-wrap gap-4 text-[12px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "#2E4A6E" }} />
          REA (Restrictive Early Action)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "#DC2626" }} />
          ED (Early Decision — binding)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "#4A6FA5" }} />
          EA (Early Action)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "#6B7280" }} />
          RD Only
        </span>
      </div>

      {/* Alert */}
      <div
        className="mb-10 flex items-start gap-3 rounded-xl border p-4"
        style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
      >
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          Deadlines are approximate and based on the 2025–2026 cycle.
          Always confirm on each school&apos;s admissions website before submitting.
          Some schools offer ED II rounds (typically Jan 1–Jan 15) not listed here.
        </p>
      </div>

      {/* Groups */}
      {groups.map((g) => {
        if (g.items.length === 0) return null;
        return (
          <section key={g.label} className="mb-12">
            <div className="mb-4 flex items-center gap-2.5">
              <span className="inline-block h-3 w-3 rounded-full" style={{ background: g.color }} />
              <h2
                className="text-[18px] font-semibold"
                style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-instrument-sans)" }}
              >
                {g.label}
              </h2>
              <span className="text-[13px] font-normal" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                ({g.items.length})
              </span>
            </div>
            <p className="mb-4 text-[13px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              {g.desc}
            </p>

            <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "rgba(0,0,0,0.06)" }} role="region" aria-label={`${g.label} deadline table`} tabIndex={0}>
              <table className="w-full text-left text-[13px]" aria-label={`${g.label} deadlines`}>
                <thead>
                  <tr style={{ background: "var(--dl-bg-sunken, #E3E8F1)" }}>
                    <th className="px-4 py-2.5 font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-instrument-sans)" }}>School</th>
                    {g.items[0]?.ed !== undefined && g.items.some((d) => d.ed) && (
                      <th className="px-4 py-2.5 font-semibold whitespace-nowrap" style={{ color: "var(--dl-text-primary, #1B2030)" }}>ED</th>
                    )}
                    {g.items.some((d) => d.ea) && (
                      <th className="px-4 py-2.5 font-semibold whitespace-nowrap" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                        {g.items[0]?.rea ? "REA" : "EA"}
                      </th>
                    )}
                    <th className="px-4 py-2.5 font-semibold whitespace-nowrap" style={{ color: "var(--dl-text-primary, #1B2030)" }}>RD</th>
                    <th className="px-4 py-2.5 font-semibold whitespace-nowrap" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Supps</th>
                    <th className="px-4 py-2.5 font-semibold whitespace-nowrap" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Fin Aid</th>
                  </tr>
                </thead>
                <tbody>
                  {g.items.map((d) => (
                    <tr
                      key={d.slug}
                      className="border-t transition-colors hover:bg-[color:var(--dl-bg-sunken, #E3E8F1)]"
                      style={{ borderColor: "rgba(0,0,0,0.06)" }}
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/college/${d.slug}`}
                          className="font-medium transition-colors hover:text-[#4A6FA5]"
                          style={{ color: "var(--dl-text-primary, #1B2030)" }}
                        >
                          {d.school}
                        </Link>
                      </td>
                      {g.items.some((x) => x.ed) && (
                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: d.ed ? "var(--dl-text-primary, #1B2030)" : "var(--dl-text-muted, #5A6275)" }}>
                          {d.ed ?? "—"}
                        </td>
                      )}
                      {g.items.some((x) => x.ea) && (
                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: d.ea ? "var(--dl-text-primary, #1B2030)" : "var(--dl-text-muted, #5A6275)" }}>
                          {d.ea ?? "—"}
                        </td>
                      )}
                      <td className="px-4 py-3 whitespace-nowrap font-medium" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                        {d.rd}
                      </td>
                      <td className="px-4 py-3 tabular-nums" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                        {d.supplements}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                        {d.finAid}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}

      {/* CTA */}
      <div className="mt-8">
        <MarketingCTA
          headline="Want a personalized deadline calendar?"
          description="Create your free profile and get a deadline calendar based on your specific college list."
          buttonText="Create your free profile"
        />
      </div>
    </MarketingLayout>
  );
}
