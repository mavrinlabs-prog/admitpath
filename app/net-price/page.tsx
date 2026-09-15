import type { Metadata } from "next";
import { NetPriceCalculator } from "./net-price-client";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Net Price Estimator — College Cost Calculator",
  description:
    "Estimate your real cost at 24 top colleges based on family income. See which schools meet full need, go no-loans, and offer need-blind admissions.",
  alternates: { canonical: `${BASE}/net-price` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Net Price Estimator — College Cost Calculator",
    description: "Estimate real cost at 24 top colleges by family income. Need-blind and no-loans badges. Free.",
    url: `${BASE}/net-price`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Net+Price+Estimator&subtitle=Real+cost+at+24+top+colleges`, width: 1200, height: 630, alt: "Net Price Estimator" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Net Price Estimator — College Cost Calculator", description: "Estimate real cost at 24 top colleges by family income. Free.", images: [`${BASE}/api/og?title=Net+Price+Estimator&subtitle=Real+cost+at+24+top+colleges`] },
};

const netPriceFaqs = [
  { q: "How much does college really cost?", a: "The sticker price at top private universities is $80,000-$90,000 per year, but most families pay far less. The net price (what you actually pay after grants and scholarships) depends on your family income, assets, and each school's financial aid policy. At schools that meet full demonstrated need, families earning under $75K often pay $0-$5,000 per year." },
  { q: "What is net price vs. sticker price?", a: "Sticker price is the published cost of attendance (tuition + room + board + fees). Net price is what your family actually pays after subtracting grants, scholarships, and institutional aid. At many top private schools, the net price for middle-income families is lower than the sticker price at public state universities." },
  { q: "What does need-blind admissions mean?", a: "Need-blind means the admissions office does not consider your ability to pay when making admissions decisions. Your financial situation has no impact on whether you are admitted. About 20 US colleges are fully need-blind for domestic applicants." },
  { q: "What does it mean when a college meets full need?", a: "It means the school commits to covering 100% of your demonstrated financial need through grants, scholarships, work-study, and sometimes loans. Demonstrated need equals cost of attendance minus your Expected Family Contribution (EFC) as calculated from the FAFSA and CSS Profile." },
  { q: "How do I estimate my college costs?", a: "Use each school's official net price calculator (federally required on every college website). Enter your family income, assets, and household size to get an estimated net cost. Run it for every school on your list — net prices vary dramatically even among similarly priced schools." },
];

const netPriceSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${BASE}/net-price#page`,
      url: `${BASE}/net-price`,
      name: "Net Price Estimator",
      isPartOf: { "@id": `${BASE}/#website` },
      inLanguage: "en-US",
      mainEntity: { "@id": `${BASE}/net-price#app` },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${BASE}/net-price#app`,
      name: "AdmitPath Net Price Estimator",
      description:
        "Family income → estimated net cost at 24 top colleges with need-blind, meets-full-need, and no-loans badges.",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      url: `${BASE}/net-price`,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      isAccessibleForFree: true,
    },
    {
      "@type": "FAQPage",
      mainEntity: netPriceFaqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function NetPricePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(netPriceSchema) }}
      />
      <h1 className="sr-only">Net Price Calculator</h1>
      <NetPriceCalculator />
    </>
  );
}
