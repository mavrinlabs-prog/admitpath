import type { Metadata } from "next";
import { CompareClient } from "./compare-client";
import { COLLEGES } from "@/data/colleges";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Compare Colleges Side by Side",
  description:
    `Compare acceptance rates, SAT 25/75 ranges, average GPA, enrollment, and test policies across ${COLLEGES.length} top US colleges side by side. Free, instant, no sign-up required.`,
  alternates: { canonical: `${BASE}/compare` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Compare Colleges Side by Side",
    description: `Compare acceptance rates, SAT ranges, GPA, and more across ${COLLEGES.length} top US colleges. Free.`,
    url: `${BASE}/compare`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Compare+Colleges&subtitle=Side-by-side+admissions+data`, width: 1200, height: 630, alt: "Compare Colleges Side by Side" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Compare Colleges Side by Side", description: "Side-by-side admissions data for top US colleges. Free.", images: [`${BASE}/api/og?title=Compare+Colleges&subtitle=Side-by-side+admissions+data`] },
};

const compareSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${BASE}/compare#page`,
      url: `${BASE}/compare`,
      name: "Compare Colleges Side by Side",
      isPartOf: { "@id": `${BASE}/#website` },
      inLanguage: "en-US",
      mainEntity: { "@id": `${BASE}/compare#app` },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${BASE}/compare#app`,
      name: "AdmitPath College Comparison Tool",
      description:
        "Compare up to 5 colleges side by side: acceptance rate, SAT 25/75, GPA, enrollment, type, location, founded year.",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      url: `${BASE}/compare`,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      isAccessibleForFree: true,
    },
  ],
};

export default function ComparePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(compareSchema) }}
      />
      <CompareClient />
    </>
  );
}
