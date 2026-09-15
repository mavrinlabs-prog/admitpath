import type { Metadata } from "next";
import { FAFSAChecklistClient } from "./fafsa-checklist-client";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "FAFSA Checklist 2026",
  description:
    "Interactive 7-step FAFSA filing checklist for 2026: create FSA ID, gather documents, use IRS DRT, complete the form, and compare offers. Free.",
  alternates: { canonical: `${BASE}/fafsa-checklist` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "FAFSA Filing Checklist",
    description: "Interactive 7-step FAFSA checklist with time estimates, document list, and tips. Free.",
    url: `${BASE}/fafsa-checklist`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=FAFSA+Checklist&subtitle=7+steps+%C2%B7+interactive+%C2%B7+free`, width: 1200, height: 630, alt: "FAFSA Filing Checklist" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "FAFSA Filing Checklist", description: "Interactive 7-step FAFSA checklist. Free.", images: [`${BASE}/api/og?title=FAFSA+Checklist&subtitle=7+steps+%C2%B7+interactive+%C2%B7+free`] },
};

const FAFSA_FAQS = [
  { q: "When does the FAFSA open?", a: "The FAFSA typically opens October 1 for the following academic year. In some years (like the 2024-25 cycle), the opening was delayed to December due to form updates. Check studentaid.gov for the current year's opening date." },
  { q: "Do I need to file FAFSA if my family makes too much money?", a: "Yes. Many private schools meet 100% of demonstrated need for families earning up to $250K+. Filing costs nothing and takes about an hour. Even if you don't qualify for federal grants, you may qualify for institutional aid, subsidized loans, or work-study." },
  { q: "What's the difference between FAFSA and CSS Profile?", a: "FAFSA is the federal form used by all schools for federal aid. The CSS Profile is used by about 250 schools (mostly private) for institutional aid. The CSS Profile is more detailed and captures home equity, business assets, and non-custodial parent income." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/fafsa-checklist#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "FAFSA Checklist", item: `${BASE}/fafsa-checklist` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/fafsa-checklist#page`,
      url: `${BASE}/fafsa-checklist`,
      name: "FAFSA Filing Checklist",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/fafsa-checklist#breadcrumb` },
      inLanguage: "en-US",
    },
    {
      "@type": "HowTo",
      "@id": `${BASE}/fafsa-checklist#howto`,
      name: "How to File the FAFSA",
      description: "Step-by-step guide to filing the FAFSA for federal financial aid.",
      totalTime: "PT90M",
      step: [
        { "@type": "HowToStep", position: 1, name: "Create FSA IDs", text: "Both the student and one parent need separate FSA IDs at studentaid.gov." },
        { "@type": "HowToStep", position: 2, name: "Gather documents", text: "Collect SSNs, tax returns, W-2s, and bank statements." },
        { "@type": "HowToStep", position: 3, name: "Use IRS Data Retrieval Tool", text: "Auto-fill tax data directly from the IRS to reduce errors." },
        { "@type": "HowToStep", position: 4, name: "Complete the FAFSA form", text: "Fill out all 5 sections of the FAFSA at studentaid.gov." },
        { "@type": "HowToStep", position: 5, name: "Sign and submit", text: "Both student and parent sign with FSA IDs." },
        { "@type": "HowToStep", position: 6, name: "Review SAR", text: "Check your Student Aid Report for errors within 3-5 days of submission." },
        { "@type": "HowToStep", position: 7, name: "Compare aid offers", text: "Compare financial aid packages from each school once offers arrive." },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAFSA_FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function FAFSAChecklistPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="sr-only">FAFSA Checklist 2026</h1>
      <FAFSAChecklistClient />
    </>
  );
}
