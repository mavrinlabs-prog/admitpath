import type { Metadata } from "next";
import { AidComparisonClient } from "./aid-comparison-client";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Financial Aid Comparison Tool",
  description:
    "Compare financial aid packages from up to 5 schools side by side. See net cost, grant-to-loan ratio, and 4-year totals. Free.",
  alternates: { canonical: `${BASE}/aid-comparison` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Financial Aid Offer Comparison",
    description: "Compare aid packages side by side: net cost, grants vs loans, 4-year totals. Free tool.",
    url: `${BASE}/aid-comparison`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Aid+Comparison&subtitle=Compare+offers+side+by+side`, width: 1200, height: 630, alt: "Financial Aid Comparison" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Financial Aid Offer Comparison", description: "Compare aid packages side by side. Free.", images: [`${BASE}/api/og?title=Aid+Comparison&subtitle=Compare+offers+side+by+side`] },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${BASE}/aid-comparison#page`,
      url: `${BASE}/aid-comparison`,
      name: "Financial Aid Offer Comparison",
      isPartOf: { "@id": `${BASE}/#website` },
      inLanguage: "en-US",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${BASE}/aid-comparison#app`,
      name: "AdmitPath Aid Comparison Tool",
      description: "Compare financial aid packages from multiple schools side by side.",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      url: `${BASE}/aid-comparison`,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      isAccessibleForFree: true,
    },
  ],
};

export default function AidComparisonPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AidComparisonClient />
    </>
  );
}
