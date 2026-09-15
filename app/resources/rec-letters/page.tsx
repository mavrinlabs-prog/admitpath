import type { Metadata } from "next";
import { RecLettersClient } from "./rec-letters-client";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Recommendation Letters — Who to Ask & How",
  description:
    "Pick the right recommenders, build a brag sheet, and send asks that get strong letters. Free tools included.",
  alternates: { canonical: `${BASE}/resources/rec-letters` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Recommendation Letters — Who to Ask & How",
    description: "Pick the right recommenders, build a brag sheet, and send asks that get strong letters. Free tools.",
    url: `${BASE}/resources/rec-letters`,
    type: "article",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=${encodeURIComponent("Recommendation Letters")}&subtitle=${encodeURIComponent("Pick recommenders + brag sheet generator")}`, width: 1200, height: 630, alt: "Recommendation Letters Guide" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Recommendation Letters — Who to Ask & How", description: "Pick the right recommenders, build a brag sheet, and get stronger letters. Free tools.", images: [`${BASE}/api/og?title=${encodeURIComponent("Recommendation Letters")}&subtitle=${encodeURIComponent("Pick recommenders + brag sheet generator")}`] },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/resources/rec-letters#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Resources", item: `${BASE}/resources` },
        { "@type": "ListItem", position: 3, name: "Recommendation Letters", item: `${BASE}/resources/rec-letters` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/resources/rec-letters#page`,
      url: `${BASE}/resources/rec-letters`,
      name: "Recommendation Letters — Who to Ask and How",
      description:
        "Pick the right teachers and hand them a brag sheet that gets you a stronger letter.",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/resources/rec-letters#breadcrumb` },
      inLanguage: "en-US",
      mainEntity: { "@id": `${BASE}/resources/rec-letters#howto` },
    },
    {
      "@type": "HowTo",
      "@id": `${BASE}/resources/rec-letters#howto`,
      name: "How to Get Strong Recommendation Letters",
      description: "Step-by-step process for choosing recommenders and preparing brag sheets that lead to compelling letters.",
      totalTime: "PT30M",
      step: [
        { "@type": "HowToStep", position: 1, name: "Choose your recommenders", text: "Pick teachers from junior-year core academics who know you well and saw you grow. Prioritize rigor, recency, and personal connection over grade alone." },
        { "@type": "HowToStep", position: 2, name: "Build a brag sheet", text: "Give each teacher a one-page summary of your accomplishments, goals, and specific moments from their class. This gives them concrete material to write about." },
        { "@type": "HowToStep", position: 3, name: "Ask early and in person", text: "Ask at least 4-6 weeks before the earliest deadline. Ask in person, not by email. Give them an easy out if they cannot write a strong letter." },
        { "@type": "HowToStep", position: 4, name: "Follow up and thank them", text: "Send a polite reminder two weeks before the deadline. After decisions arrive, send a handwritten thank-you note regardless of outcomes." },
      ],
    },
  ],
};

export default function RecLettersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RecLettersClient />
    </>
  );
}
