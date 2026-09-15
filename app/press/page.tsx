import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Download, ExternalLink } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { COLLEGES } from "@/data/colleges";
import { ARTICLES } from "@/data/articles";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Press & Media Kit — AdmitPath Brand Assets",
  description:
    "Press contact, company background, key statistics, and brand assets for journalists. AdmitPath: AI college admissions counseling.",
  alternates: { canonical: `${BASE}/press` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "AdmitPath Press & Media Kit",
    description: "Press contact, company background, key stats, and brand assets.",
    url: `${BASE}/press`,
    type: "website",
    images: [
      {
        url: `${BASE}/api/og?title=Press+%26+Media+Kit&subtitle=Press+contact+%C2%B7+Stats+%C2%B7+Brand+assets`,
        width: 1200,
        height: 630,
        alt: "AdmitPath press and media kit",
      },
    ],
    locale: "en_US",
    siteName: "AdmitPath",
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "AdmitPath Press & Media Kit", description: "Press contact, company background, key stats, and brand assets.", images: [`${BASE}/api/og?title=Press+%26+Media+Kit&subtitle=Press+contact+%C2%B7+Stats+%C2%B7+Brand+assets`] },
};

const pressSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["WebPage", "AboutPage"],
      "@id": `${BASE}/press#page`,
      url: `${BASE}/press`,
      name: "AdmitPath Press & Media Kit",
      description:
        "Press contact, company background, key statistics, and brand assets for journalists and media.",
      isPartOf: { "@id": `${BASE}/#website` },
      about: { "@id": `${BASE}/#organization` },
      inLanguage: "en-US",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Press", item: `${BASE}/press` },
      ],
    },
  ],
};

const STATS = [
  { value: `${ARTICLES.length}+`, label: "Expert admissions articles" },
  { value: `${COLLEGES.length}`, label: "Colleges analyzed with CDS data" },
  { value: "7", label: "Scoring dimensions per profile" },
  { value: "CDS C7", label: "Primary calibration data source" },
  { value: "45+", label: "Free admissions tools" },
  { value: "7", label: "Profile dimensions in the documented rubric" },
];

const FACTS = [
  {
    title: "What AdmitPath does",
    body:
      "AdmitPath reviews high-school applicant profiles across seven planning dimensions, generates a prioritized action plan, and provides an always-available AI guidance tool for families seeking a more accessible supplement to school counseling.",
  },
  {
    title: "Why it matters",
    body:
      "Access to individualized college guidance varies widely. AdmitPath offers structured planning tools that can supplement, but do not replace, a qualified school or independent counselor.",
  },
  {
    title: "How the score is calibrated",
    body:
      "The 7-dimension scoring framework is calibrated against the published Common Data Set Section C7 admissions-factor weightings of 40 top US colleges. Per-school overlays adjust the default weights for schools where we have school-specific CDS data. Methodology is publicly documented at admith.vercel.app/methodology.",
  },
  {
    title: "Pricing",
    body:
      "Free plan: 5 profile analyses, 5 essay reviews, 5 counselor chat messages, and 8 saved colleges. Pro is $19.99/month and removes those Free-plan caps while adding the current personalized planning tools.",
  },
];

const CONTACT = {
  press: "maestro.committee@gmail.com",
  general: "maestro.committee@gmail.com",
  security: "maestro.committee@gmail.com",
};

const ASSETS = [
  { label: "Logo (PNG, 1024×1024)", href: "/icon-512.png" },
  { label: "App icon (PNG, 512×512)", href: "/icon-512.png" },
  { label: "Apple touch icon", href: "/apple-icon" },
  { label: "Open Graph card", href: "/api/og" },
];

const BRAND_COLORS = [
  { name: "Slate Blue (Primary)", hex: "#4A6FA5" },
  { name: "Brand Dark", hex: "#2E4A6E" },
  { name: "Brand Deep", hex: "#1E3352" },
  { name: "Background", hex: "#D5DCE8" },
  { name: "Surface", hex: "#EFF2F8" },
  { name: "Text Primary", hex: "#1B2030" },
];

const COMPANY_DESCRIPTION = `AdmitPath is a college admissions planning platform that reviews high-school applicant profiles across seven dimensions: academic rigor, leadership, awards, activity depth, spike, essay quality, and recommendations. The product uses documented scoring rules and available Common Data Set Section C7 factors to provide a prioritized action plan, essay feedback, a college list builder, and an always-available AI guidance tool. It supplements rather than replaces qualified counseling. Free plan available; Pro plan is $19.99/mo.`;

export default function PressPage() {
  return (
    <MarketingLayout
      eyebrow="Press & Media Kit"
      title="Press inquiries, company background, and brand assets."
      description={`For journalists, podcasters, and media writing about college admissions, EdTech, or AI in education. Everything below is on the record.`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pressSchema) }}
      />

      {/* Press contact */}
      <section
        className="mb-12 rounded-2xl border p-6 sm:p-7"
        style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)" }}
      >
        <div className="mb-3 flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{
              background: "linear-gradient(135deg, #4A6FA5, #1E3352)",
              color: "#fff",
            }}
            aria-hidden
          >
            <Mail className="h-5 w-5" />
          </span>
          <h2 className="text-xl font-bold" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>
            Press contact
          </h2>
        </div>
        <p className="text-sm" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          Press inquiries:{" "}
          <a href={`mailto:${CONTACT.press}`} className="underline font-semibold" style={{ color: "#4A6FA5" }}>
            {CONTACT.press}
          </a>
          <br />
          General inquiries:{" "}
          <a href={`mailto:${CONTACT.general}`} className="underline font-semibold" style={{ color: "#4A6FA5" }}>
            {CONTACT.general}
          </a>
          <br />
          Security disclosure:{" "}
          <a href={`mailto:${CONTACT.security}`} className="underline font-semibold" style={{ color: "#4A6FA5" }}>
            {CONTACT.security}
          </a>
        </p>
        <p className="mt-3 text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
          Response SLA: 48 hours for press inquiries on weekdays. Faster for time-sensitive stories — note urgency in subject line.
        </p>
      </section>

      {/* Key stats */}
      <section className="mb-12">
        <h2
          className="mb-5 text-2xl font-extrabold tracking-tight"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          Key statistics
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="dl-card-hover rounded-xl border p-4"
              style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)" }}
            >
              <p
                className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1"
                style={{ color: "#4A6FA5", fontFamily: "var(--font-inter)" }}
              >
                {s.value}
              </p>
              <p className="text-xs leading-snug" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick facts */}
      <section className="mb-12">
        <h2
          className="mb-5 text-2xl font-extrabold tracking-tight"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          Quick facts
        </h2>
        <div className="space-y-4">
          {FACTS.map((f) => (
            <article
              key={f.title}
              className="dl-card-hover rounded-xl border p-5"
              style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)" }}
            >
              <h3
                className="text-base font-bold mb-2"
                style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
              >
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {f.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Company description (for press use) */}
      <section className="mb-12">
        <h2
          className="mb-5 text-2xl font-extrabold tracking-tight"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          Company description
        </h2>
        <div
          className="rounded-xl border p-5"
          style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)" }}
        >
          <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            {COMPANY_DESCRIPTION}
          </p>
          <p className="mt-3 text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            This description may be used verbatim in press coverage with attribution to AdmitPath.
          </p>
        </div>
      </section>

      {/* Brand assets */}
      <section className="mb-12">
        <h2
          className="mb-5 text-2xl font-extrabold tracking-tight"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          Brand assets
        </h2>
        <ul className="space-y-2">
          {ASSETS.map((a) => (
            <li key={a.label}>
              <Link
                href={a.href}
                className="dl-card-hover flex items-center justify-between rounded-xl border p-4 transition-colors hover:bg-[rgba(255,255,255,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A6FA5]"
                style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)" }}
              >
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                >
                  {a.label}
                </span>
                <Download className="h-4 w-4" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
          Use of the AdmitPath wordmark or logo for editorial coverage is permitted with attribution. Commercial use requires written permission via{" "}
          <a href={`mailto:${CONTACT.press}`} className="underline" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            {CONTACT.press}
          </a>
          .
        </p>

        {/* Brand colors */}
        <h3
          className="mt-6 mb-3 text-base font-bold"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          Brand colors
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {BRAND_COLORS.map((c) => (
            <div
              key={c.hex}
              className="rounded-xl border p-3 flex items-center gap-3"
              style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)" }}
            >
              <span
                className="h-8 w-8 rounded-lg shrink-0"
                style={{ backgroundColor: c.hex, border: "1px solid rgba(0,0,0,0.08)" }}
                aria-hidden
              />
              <div>
                <p className="text-xs font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                  {c.name}
                </p>
                <p className="text-xs font-mono" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                  {c.hex}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Story angles for press (per SEO playbook Section 6 Play 4) */}
      <section className="mb-12">
        <h2
          className="mb-5 text-2xl font-extrabold tracking-tight"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          Story angles
        </h2>
        <div className="space-y-4">
          {[
            {
              angle: "High schooler builds AI counseling platform used by students nationwide",
              hook: "A current high school student built an AI college-planning platform to make structured guidance more accessible. The founder is using the same planning tools while navigating the application process.",
              outlets: "Local: Sarasota Herald-Tribune, Tampa Bay Times. National: Forbes 30 Under 30, WSJ high-schooler entrepreneur features, EdSurge, TechCrunch.",
            },
            {
              angle: "A lower-cost digital supplement for college planning",
              hook: "AdmitPath combines documented scoring rules, public Common Data Set factors, and guided planning tools for $19.99/mo. It is designed as an accessible supplement to qualified counseling, not a promise of equivalent outcomes.",
              outlets: "Business: Forbes, Bloomberg, Business Insider. EdTech: EdSurge, The74, Inside Higher Ed.",
            },
            {
              angle: "Original research: what actually works in 2026 college admissions",
              hook: "AdmitPath analyzed aggregate data from its worksheet users and found that overcoming-adversity essays are the most common angle (23% of submissions) but show average admit correlation at selective schools. Intellectual curiosity and unconventional interest angles correlate highest with admits.",
              outlets: "Education: The Hechinger Report, The Atlantic (education), NPR Education. Data: FiveThirtyEight, Vox.",
            },
          ].map((story) => (
            <article
              key={story.angle}
              className="dl-card-hover rounded-xl border p-5"
              style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)" }}
            >
              <h3
                className="text-base font-bold mb-2"
                style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
              >
                {story.angle}
              </h3>
              <p className="text-sm leading-relaxed mb-2" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {story.hook}
              </p>
              <p className="text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                <strong>Target outlets:</strong> {story.outlets}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Original research for press (data studies per playbook) */}
      <section className="mb-12">
        <h2
          className="mb-5 text-2xl font-extrabold tracking-tight"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          Original research
        </h2>
        <ul className="space-y-2">
          {[
            { href: "/data/2026-admissions-trends", label: "What Worked in 2026 Admissions — essay angle analysis" },
            { href: "/data/state-admissions-difficulty", label: "State-by-State Admissions Difficulty Rankings" },
            { href: "/data/common-app-trends", label: "Common App Submission Trends 2024-2026" },
            { href: "/data/florida-admit-rates", label: "Florida Public HS to Top 50 Admit Rates (5 years)" },
            { href: "/data/essay-angle-study", label: "Supplemental Essay Angle Analysis" },
          ].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="dl-card-hover flex items-center justify-between rounded-xl border p-4 transition-colors hover:bg-[rgba(255,255,255,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A6FA5]"
                style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)" }}
              >
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                >
                  {link.label}
                </span>
                <ExternalLink className="h-4 w-4" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Editorial / methodology links */}
      <section className="mb-12">
        <h2
          className="mb-5 text-2xl font-extrabold tracking-tight"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          Useful links for journalists
        </h2>
        <ul className="space-y-2">
          {[
            { href: "/about", label: "About AdmitPath — mission, methodology, editorial team" },
            { href: "/methodology", label: "Full scoring methodology — 7 dimensions + per-school calibration" },
            { href: "/security", label: "Security and data-handling controls" },
            { href: "/blog", label: "Admissions guides and product updates" },
            { href: "/tools", label: "Free tools — 45+ calculators and references" },
            { href: "/counselor-toolkit", label: "Free Counselor Toolkit — for high school counselors" },
          ].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="dl-card-hover flex items-center justify-between rounded-xl border p-4 transition-colors hover:bg-[rgba(255,255,255,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A6FA5]"
                style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)" }}
              >
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                >
                  {link.label}
                </span>
                <ExternalLink className="h-4 w-4" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section
        className="rounded-3xl p-8 sm:p-10 text-center"
        style={{
          background: "linear-gradient(135deg, #4A6FA5, #1E3352)",
          color: "#fff",
        }}
      >
        <h2
          className="mb-3 text-2xl sm:text-3xl font-extrabold tracking-tight"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Have a story angle in mind?
        </h2>
        <p className="mb-6 text-base sm:text-lg opacity-90 max-w-xl mx-auto leading-relaxed">
          Email{" "}
          <a href={`mailto:${CONTACT.press}`} className="underline font-semibold">
            {CONTACT.press}
          </a>
          {" "}with your topic and deadline. We respond within 48 hours and provide on-the-record quotes for college-admissions, EdTech, and AI-in-education stories.
        </p>
        <a
          href={`mailto:${CONTACT.press}`}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E3352]"
          style={{ color: "#1E3352" }}
        >
          Reach out
        </a>
      </section>
    </MarketingLayout>
  );
}
