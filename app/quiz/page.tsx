import type { Metadata } from "next";
import { QuizClient } from "./quiz-client";
import { COLLEGES } from "@/data/colleges";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");
const COLLEGE_COUNT = COLLEGES.length;

export const metadata: Metadata = {
  title: "What Are My Chances? — Free Admissions Quiz",
  description:
    `Answer 5 quick questions about your profile and see your admissions tier at ${COLLEGE_COUNT} colleges. Free — no sign-up required.`,
  alternates: { canonical: `${BASE}/quiz` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "What Are My Chances? — Free Admissions Quiz",
    description: `5-question quiz shows your admissions tier at ${COLLEGE_COUNT} colleges. Free, no sign-up.`,
    url: `${BASE}/quiz`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=College+Chances+Quiz&subtitle=5+questions+%C2%B7+free+%C2%B7+no+sign-up`, width: 1200, height: 630, alt: "College Chances Quiz" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "What Are My Chances? — Free Admissions Quiz", description: `5-question quiz at ${COLLEGE_COUNT} colleges. Free.`, images: [`${BASE}/api/og?title=College+Chances+Quiz&subtitle=5+questions+%C2%B7+free+%C2%B7+no+sign-up`] },
};

const quizFaqs = [
  { q: "What does the admissions quiz measure?", a: "The quiz evaluates your admissions competitiveness across three key inputs: GPA, test scores, and extracurricular depth. It then sorts schools into four tiers — Likely, Target, Reach, and Hard Reach — based on how your profile compares to each school's admitted student data (SAT 25th/75th percentile ranges and average GPA)." },
  { q: "How accurate is the admissions quiz?", a: "The quiz uses published Common Data Set statistics and historical admissions data. It gives a directional tier classification, not a precise probability. Real admissions decisions depend on essays, recommendations, institutional priorities, and other factors no quiz can evaluate." },
  { q: "Do I need an account to take the quiz?", a: "No. The quiz is completely free with no sign-up required. You can take it as many times as you want. Creating a free AdmitPath account unlocks a deeper 7-dimension AI analysis." },
  { q: "How is this different from the chances calculator?", a: "The quiz is a guided 5-question assessment that categorizes schools into four tiers (Likely, Target, Reach, Hard Reach). The calculator lets you input specific stats and see estimated admit probabilities at individual schools. Both are free — the quiz is faster, the calculator is more granular." },
];

const quizSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/quiz#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Free Tools", item: `${BASE}/tools` },
        { "@type": "ListItem", position: 3, name: "Chances Quiz", item: `${BASE}/quiz` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/quiz#page`,
      url: `${BASE}/quiz`,
      name: "What Are My Chances? — Free Admissions Quiz",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/quiz#breadcrumb` },
      inLanguage: "en-US",
      mainEntity: { "@id": `${BASE}/quiz#app` },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${BASE}/quiz#app`,
      name: "AdmitPath College Admissions Quiz",
      description:
        `5-question college admissions chances assessment across ${COLLEGE_COUNT} schools.`,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      url: `${BASE}/quiz`,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      isAccessibleForFree: true,
    },
    {
      "@type": "FAQPage",
      mainEntity: quizFaqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function QuizPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(quizSchema) }}
      />
      <h1 className="sr-only">College Chances Quiz</h1>
      <QuizClient />
    </>
  );
}
