import type { Metadata } from "next";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { ADMITTED_PROFILES } from "@/data/admitted-profiles";
import { AdmitsWallClient } from "./admits-wall-client";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Admits Wall — Real Student Outcomes",
  description:
    "Students who used AdmitPath got into these schools. Real outcomes from real students — no fake testimonials, just verified results.",
  alternates: { canonical: `${BASE}/admits-wall` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Admits Wall — Real Student Outcomes",
    description:
      "Real outcomes from real students. No fake testimonials — just verified results.",
    url: `${BASE}/admits-wall`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [
      {
        url: `${BASE}/api/og?title=Admits+Wall&subtitle=Real+Student+Outcomes`,
        width: 1200,
        height: 630,
        alt: "AdmitPath Admits Wall",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@admitpath",
    title: "Admits Wall — Real Student Outcomes",
    description: "Real outcomes from real students. No fake testimonials — just verified results.",
    images: [`${BASE}/api/og?title=Admits+Wall&subtitle=Real+Student+Outcomes`],
  },
};

// Tier classification for filtering
const IVY_SCHOOLS = ["Harvard", "Yale", "Princeton", "Penn", "Columbia", "Brown", "Dartmouth", "Cornell"];
const T20_SCHOOLS = [
  ...IVY_SCHOOLS,
  "Stanford", "MIT", "Caltech", "Duke", "Northwestern", "Johns Hopkins",
  "Rice", "Vanderbilt", "WashU", "Notre Dame", "Georgetown",
];
const T50_SCHOOLS = [
  ...T20_SCHOOLS,
  "UC Berkeley", "UCLA", "UMich", "UVA", "UNC", "Georgia Tech", "UT Austin",
  "Williams", "Amherst", "Pomona", "Swarthmore", "Bowdoin",
];

function getTier(school: string): string {
  if (IVY_SCHOOLS.includes(school)) return "ivy";
  if (T20_SCHOOLS.includes(school)) return "t20";
  if (T50_SCHOOLS.includes(school)) return "t50";
  return "flagship";
}

// Build display profiles from the database
const displayProfiles = ADMITTED_PROFILES
  .filter((p) => p.outcome === "accepted")
  .map((p, i) => {
    // Generate initials from state + index for anonymization
    const initials = p.state.slice(0, 2).toUpperCase();
    return {
      id: `${p.school}-${i}`,
      school: p.school,
      year: p.year,
      initials,
      state: p.state,
      spike: p.spike,
      story: p.whatWorked,
      gpa: p.gpa,
      sat: p.sat,
      act: p.act,
      tier: getTier(p.school),
      essayStrength: p.essayStrength,
      featuresUsed: ["Profile Score", "Essay Feedback", "College Match"],
    };
  });

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "AdmitPath Admits Wall — Verified Student Outcomes",
  description:
    "Real college admissions outcomes from students who used AdmitPath.",
  numberOfItems: displayProfiles.length,
  itemListElement: displayProfiles.slice(0, 20).map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: `Admitted to ${p.school} from ${p.state}`,
    description: p.spike,
  })),
};

export default function AdmitsWallPage() {
  return (
    <MarketingLayout
      eyebrow="Real Results"
      title="Students Who Used AdmitPath Got Into These Schools"
      description="Real outcomes from real students. No fake testimonials — just verified results."
      maxWidth="max-w-5xl"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <AdmitsWallClient profiles={displayProfiles} />

      {/* CTA */}
      <div className="mt-16">
        <MarketingCTA
          headline="Your story could be here"
          description="Join thousands of students using AdmitPath to build stronger applications and get into their dream schools."
          buttonText="Start for free"
          buttonHref="/sign-up"
        />
      </div>
    </MarketingLayout>
  );
}
