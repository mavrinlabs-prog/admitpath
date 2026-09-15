import type { Metadata } from "next";
import { DecisionMatrixClient } from "./decision-matrix-client";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "College Decision Matrix",
  description:
    "Score your admitted schools on 8+ factors, weight by importance, and see which college wins objectively. Free weighted decision matrix for college admits.",
  alternates: { canonical: `${BASE}/decision-matrix` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "College Decision Matrix",
    description: "Score admitted schools on cost, major, career, culture, and more. Free weighted decision tool.",
    url: `${BASE}/decision-matrix`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Decision+Matrix&subtitle=Score+%C2%B7+weight+%C2%B7+decide`, width: 1200, height: 630, alt: "College Decision Matrix" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "College Decision Matrix", description: "Score admitted schools on 8+ weighted factors. Free.", images: [`${BASE}/api/og?title=Decision+Matrix&subtitle=Score+%C2%B7+weight+%C2%B7+decide`] },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${BASE}/decision-matrix#page`,
      url: `${BASE}/decision-matrix`,
      name: "College Decision Matrix",
      isPartOf: { "@id": `${BASE}/#website` },
      inLanguage: "en-US",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${BASE}/decision-matrix#app`,
      name: "AdmitPath College Decision Matrix",
      description: "Weighted comparison tool for choosing between college acceptances.",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      url: `${BASE}/decision-matrix`,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      isAccessibleForFree: true,
    },
  ],
};

export default function DecisionMatrixPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="sr-only">College Decision Matrix</h1>
      <DecisionMatrixClient />
    </>
  );
}
