import type { Metadata } from "next";
import { WhatIfClient } from "./what-if-client";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "What-If Modeler — GPA & SAT Impact",
  description:
    "Model how improving your GPA, SAT score, or extracurriculars changes your admission odds at 102 top schools. Live scenario updates powered by real CDS data.",
  alternates: { canonical: `${BASE}/what-if` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "What-If Scenario Modeler — Admissions Impact Calculator",
    description: "See exactly how GPA, SAT, and activity changes affect your odds at 102 schools. Real CDS data.",
    url: `${BASE}/what-if`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [
      {
        url: `${BASE}/api/og?title=What-If+Scenario+Modeler&subtitle=See+how+your+changes+affect+admissions`,
        width: 1200,
        height: 630,
        alt: "AdmitPath What-If Scenario Modeler",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@admitpath",
    title: "What-If Scenario Modeler | AdmitPath",
    description: "Model how GPA, SAT, or activity changes affect your admissions odds. Free tool.",
    images: [`${BASE}/api/og?title=What-If+Scenario+Modeler&subtitle=See+how+your+changes+affect+admissions`],
  },
};

const whatIfSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${BASE}/what-if#app`,
      name: "What-If Scenario Modeler",
      url: `${BASE}/what-if`,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      description:
        "Interactive tool that models how changes to GPA, SAT scores, and extracurriculars affect college admission odds at 102 schools.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      creator: { "@id": `${BASE}/#organization` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Tools", item: `${BASE}/tools` },
        { "@type": "ListItem", position: 3, name: "What-If Modeler", item: `${BASE}/what-if` },
      ],
    },
  ],
};

export default function WhatIfPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(whatIfSchema) }}
      />
      <WhatIfClient />
    </>
  );
}
