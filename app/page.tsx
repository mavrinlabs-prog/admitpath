import type { Metadata } from "next";
import Link from "next/link";
import { getGoogleUser } from "@/lib/google-auth";

// Inline the Clerk-key check here so this server component doesn't import
// a non-component function from a "use client" module (Next.js disallows
// that — calling such a function from server code throws at runtime).
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/landing/HeroSection";

// Each dynamic import uses `.then(m => m.default ?? m.X)` so that if the
// named export is ever undefined (rename, move, failed chunk load) the
// import resolves to the module's default export or `undefined` — which
// next/dynamic handles by showing nothing instead of crashing the tree.
import { PressBar } from "@/components/landing/PressBar";
import { TrustBar } from "@/components/landing/TrustBar";
// Below-the-fold landing sections are framer-motion heavy. Code-splitting
// them into separate chunks keeps hero TTI fast. Default next/dynamic in a
// server component still SSRs the markup, so SEO content + JSON-LD remain
// in the initial HTML; only the client hydration JS is deferred.
const FAQSection = dynamic(() =>
  import("@/components/landing/FAQSection").then((m) => ({
    default: m.FAQSection,
  })),
);
const StatsBar = dynamic(() =>
  import("@/components/landing/StatsBar").then((m) => ({
    default: m.StatsBar,
  })),
);
import { MobileNav } from "@/components/mobile-nav";
import { StickyMobileCTA } from "@/components/sticky-mobile-cta";
import { LandingClientEffects } from "@/components/landing-client-effects";
import { ScrollReveal, StaggerContainer } from "@/components/scroll-reveal";
const ParallaxWrapper = dynamic(() =>
  import("@/components/landing/ParallaxWrapper").then((m) => ({
    default: m.ParallaxWrapper,
  })),
);
import { LogoMark } from "@/components/admitpath-logo";
import { OneTimeOffersSection } from "@/components/landing/OneTimeOffersSection";
import {
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Crown,
  Trophy,
  Target,
  Zap,
  PenLine,
  Handshake,
  Brain,
  GraduationCap,
  ShieldCheck,
  Lock,
  Database,
} from "lucide-react";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").replace(/^﻿/, "").trim().replace(/\/+$/, "");

const homepageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${BASE}/#website`,
      url: BASE,
      name: "AdmitPath",
      description: "AI college counseling for high school students. 7-dimension profile scoring calibrated to real CDS data from 102+ schools. Free AI counselor, essay feedback, and college list builder.",
      inLanguage: "en-US",
      publisher: { "@id": `${BASE}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/#page`,
      url: BASE,
      name: "College Admissions AI Counselor | AdmitPath",
      description: "Score your college application across 7 dimensions calibrated to real CDS data from 102 schools. Free AI counselor, essay feedback, and college list builder.",
      isPartOf: { "@id": `${BASE}/#website` },
      about: { "@id": `${BASE}/#organization` },
      inLanguage: "en-US",
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/#breadcrumb-home`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${BASE}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "What is AdmitPath?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "AdmitPath is an AI college counseling platform that scores your application across 7 dimensions — academic rigor, leadership, awards, activity depth, spike, essay quality, and recommendations — using available Common Data Set (CDS) admissions data where available. It includes structured admissions worksheets, college profiles, supplemental essay guides, and Florida-specific guidance.",
          },
        },
        {
          "@type": "Question",
          name: "How much does AdmitPath cost?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "AdmitPath offers a free plan with 5 profile analyses, 5 essay reviews, 5 counselor chat messages, and 8 saved colleges. The Pro plan is $19.99/month and removes those Free-plan caps while adding the current essay, college-list, and counselor-chat tools.",
          },
        },
        {
          "@type": "Question",
          name: "Is AdmitPath better than a private college counselor?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "AdmitPath provides structured, worksheet-driven planning informed by published Common Data Set factors. It can supplement a qualified school or private counselor, but it does not replace a counselor's judgment or guarantee comparable outcomes.",
          },
        },
        {
          "@type": "Question",
          name: "What data sources does AdmitPath use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "AdmitPath pulls from IPEDS College Navigator for enrollment and demographic data, each college's official Common Data Set (CDS) for admissions-factor weights, the College Scorecard API from the U.S. Department of Education for net price and earnings data, and Common App aggregate statistics. All data is cited with publication year and source.",
          },
        },
        {
          "@type": "Question",
          name: "How does the 7-dimension scoring work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Each of the 7 dimensions (academic rigor, leadership, awards, activity depth, spike, essay quality, recommendations) is scored 0-100 using documented rubric rules. Published Common Data Set Section C7 factors inform school-specific weighting where data is available; the result is guidance, not an admission probability.",
          },
        },
        {
          "@type": "Question",
          name: "Does AdmitPath help with college essays?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. AdmitPath provides essay feedback across 6 dimensions: voice authenticity, narrative structure, self-reflection depth, specificity, emotional resonance, and admissions alignment. It also includes a topic finder, revision checklist, Common App prompt guides, supplemental-essay guidance, and a brainstorm worksheet.",
          },
        },
        {
          "@type": "Question",
          name: "What planning tools are included?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "AdmitPath includes profile analysis, college-list planning, essay feedback, counselor chat, application timelines, scholarship matching, interview practice, and decision-comparison tools. Availability and Free-plan limits are shown in the product and on the pricing page.",
          },
        },
        {
          "@type": "Question",
          name: "Who built AdmitPath?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "AdmitPath was built as an AI college counseling workspace for students who need practical application strategy, essay feedback, college-list planning, and financial-aid guidance.",
          },
        },
      ],
    },
  ],
};

export const metadata: Metadata = {
  title: { absolute: "College Admissions AI Counselor | AdmitPath" },
  description:
    "Score your college app across 7 dimensions calibrated to CDS data from 102 schools. Free AI counselor, essay feedback, and list builder.",
  alternates: { canonical: BASE },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: {
    title: "AdmitPath — AI College Admissions",
    description:
      "Get a personalized 7-dimension profile score and action plan to stand out at your target schools.",
    url: BASE,
    siteName: "AdmitPath",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${BASE}/api/og`,
        width: 1200,
        height: 630,
        alt: "AdmitPath — college admissions counseling: 7-dimension profile scoring, essay feedback, and college list builder.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@admitpath",
    title: "AdmitPath — AI College Admissions",
    description: "Get a personalized 7-dimension profile score and action plan to stand out at your target schools.",
    images: [`${BASE}/api/og`],
  },
};

const dimensions = [
  { Icon: BookOpen,      name: "Academic Rigor", description: "GPA calibration, AP/IB course load, grade trends over time" },
  { Icon: Crown,         name: "Leadership",     description: "Club offices, team captain roles, founding organizations" },
  { Icon: Trophy,        name: "Awards",         description: "State, national, and international recognition" },
  { Icon: Target,        name: "Activity Depth", description: "Extracurricular breadth, hours committed, sustained engagement" },
  { Icon: Zap,           name: "Spike",          description: "Your single most compelling differentiator and passion area", featured: true },
  { Icon: PenLine,       name: "Essay Quality",  description: "Authentic voice, compelling narrative, and clear self-reflection" },
  { Icon: Handshake,     name: "Recommendations",description: "Depth of teacher/counselor relationship and advocacy quality" },
];

const steps = [
  {
    step: "01",
    title: "Tell us about yourself",
    description: "Enter your GPA, test scores, activities, awards, and intended major. Takes just 5 minutes.",
    detail: "GPA · SAT/ACT · Extracurriculars · Awards · Major",
  },
  {
    step: "02",
    title: "See exactly where you stand",
    description: "Get a documented 0–100 rubric score across all 7 dimensions and see which profile areas deserve attention next.",
    detail: "Calibrated to real admissions patterns",
  },
  {
    step: "03",
    title: "Get your personalized 90-day plan",
    description: "Receive a prioritized action plan built around your actual gaps — not generic advice, but specific steps with deadlines to maximize your odds.",
    detail: "30 / 60 / 90-day action plans",
  },
];

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "mo",
    description: "See where you stand — takes 5 minutes.",
    features: [
      "5 profile analyses",
      "5 essay feedback runs",
      "5 counselor chat messages",
      "Save up to 8 colleges",
    ],
    cta: "Get My Free Score",
    highlighted: false,
    tier: "free" as const,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19.99",
    period: "mo",
    description: "Everything you need to build a competitive application, all in one place.",
    features: [
      "Profile analyses without the Free-plan cap",
      "All 7 scoring dimensions",
      "Personalized action plan",
      "Essay feedback with line edits",
      "College list builder",
      "Counselor chat without the Free-plan cap",
      "Weekly progress check-ins",
    ],
    cta: "Start Pro — $19.99/mo",
    highlighted: true,
    tier: "pro" as const,
  },
];

const testimonials = [
  {
    name: "A.C.",
    detail: "Class of 2026, New York",
    text: "AdmitPath showed me my spike score was 45 — brutally honest, but exactly what I needed to hear junior fall. I spent the summer building my research portfolio instead of padding my resume. Got into Cornell ED.",
    icon: Target,
  },
  {
    name: "S.R.",
    detail: "Class of 2026, Washington",
    text: "The essay feedback caught three clichés I didn’t even realize were clichés. My counselor at school just said ‘looks good.’ AdmitPath’s line-by-line feedback was more useful than the $5,000 my friend spent on a private consultant.",
    icon: PenLine,
  },
  {
    name: "M.J.",
    detail: "Class of 2026, Tennessee",
    text: "As a first-gen student, I had no idea about demonstrated interest or yield protection. The AI counselor explained everything in plain language and helped me build a balanced list. I got into 4 of my 5 target schools.",
    icon: GraduationCap,
  },
];

// Calibration sources must be ones the analyzer actually pulls from. Previous
// list claimed "Naviance benchmarks" (we don't license Naviance data) and
// "Common App data" (vague — what data?). Trimmed to sources the prompt and
// data/colleges.ts genuinely reference.



export default async function LandingPage() {
  const signedIn = Boolean(await getGoogleUser());
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd) }}
      />

      {/* ── Nav — Discovery Labs `.dl-landing-nav` clone ── */}
      <header>
      <nav aria-label="Main navigation" className="dl-landing-nav" id="dl-landing-nav">
        <div className="dl-landing-nav-inner">
          <Link href="/" className="dl-landing-logo">
            <span className="inline-flex">
              <LogoMark size={28} />
            </span>
            AdmitPath
          </Link>

          <MobileNav signedIn={signedIn} />

          <div className="dl-landing-nav-links hidden md:flex">
            <a href="#how-it-works">How it works</a>
            <a href="#parents">For parents</a>
            <Link href="/for-schools">For schools</Link>
            <Link href="/counselor">For counselors</Link>
            <Link href="/tools">Tools</Link>
            <a href="#pricing">Pricing</a>
            <Link href="/blog">Blog</Link>
            <Link href={signedIn ? "/dashboard" : "/sign-up"} className="dl-btn dl-btn-primary dl-btn-sm" style={{ color: "#FFFFFF" }}>
              {signedIn ? "Open dashboard" : "Get Started"} <ArrowRight size={14} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </nav>
      </header>


      {/* ── Hero ── */}
      <main id="main">
      <HeroSection signedIn={signedIn} />

      {/* ── Social proof counter ── */}
      <div
        className="py-4 text-center"
        style={{ background: "rgba(74,111,165,0.06)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}
      >
        <p
          className="text-sm font-semibold"
          style={{ color: "var(--dl-text-secondary, #454B5E)" }}
        >
          Built for ambitious students worldwide &mdash; calibrated to real CDS admissions data from{" "}
          <span style={{ color: "var(--dl-brand, #4A6FA5)", fontFamily: "var(--dl-font-mono)", fontWeight: 700 }}>
            102
          </span>{" "}
          schools
        </p>
      </div>


      {/* ── Press / social proof bar (Discovery Labs replication) ── */}
      <PressBar />

      <div className="dl-section-divider" />

      {/* ── Stats bar (animated count-ups) ── */}
      <StatsBar />


      <div className="dl-section-divider" />

      {/* ── 7 Scoring Dimensions — DL `.dl-features` 4-up grid ── */}
      <section className="dl-features" aria-label="7 scoring dimensions">
        <div className="dl-features-inner">
          <ScrollReveal>
          <div className="text-center mb-14">
            <p className="dl-section-eyebrow" style={{ letterSpacing: "0.14em", fontSize: 11, fontWeight: 700 }}>The framework</p>
            <h2 className="dl-section-heading" style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, letterSpacing: "-0.03em" }}>
              <em>7 dimensions</em> that define your application
            </h2>
            <p className="dl-section-sub" style={{ fontSize: 16, lineHeight: 1.65, maxWidth: 560 }}>
              Admissions officers weigh far more than grades. We score every
              dimension that moves the needle and show you exactly where to improve.
            </p>
            <p
              className="mt-4 text-xs"
              style={{ color: "var(--dl-text-muted)", letterSpacing: "0.02em" }}
            >
              Scoring calibrated to CDS Section C7 admissions-factor weights from 102 schools
            </p>
          </div>
          </ScrollReveal>

          <StaggerContainer
            className="dl-features-grid lg:!grid-cols-4"
            staggerMs={80}
          >
            {dimensions.map((dim) => (
              <div
                key={dim.name}
                className="dl-feature-card"
                style={
                  dim.featured
                    ? {
                        borderColor: "var(--dl-brand)",
                        borderWidth: 2,
                        boxShadow: "0 4px 24px rgba(74,111,165,0.14)",
                      }
                    : undefined
                }
              >
                {dim.featured && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "3px 10px",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--dl-brand)",
                      background: "rgba(74,111,165,0.10)",
                      borderRadius: "var(--dl-radius-pill)",
                      fontFamily: "var(--dl-font-mono)",
                      marginBottom: 12,
                    }}
                  >
                    Most impactful
                  </span>
                )}
                <div
                  className="dl-feature-icon"
                  style={
                    dim.featured
                      ? {
                          background:
                            "linear-gradient(135deg, var(--dl-brand) 0%, var(--dl-brand-dark) 100%)",
                          color: "white",
                        }
                      : undefined
                  }
                >
                  <dim.Icon size={22} strokeWidth={1.75} aria-hidden />
                </div>
                <h3 className="dl-feature-title">{dim.name}</h3>
                <p className="dl-feature-desc">{dim.description}</p>
              </div>
            ))}

            {/* 8th card — inline CTA in DL feature-card style */}
            <div
              className="dl-feature-card"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                background:
                  "linear-gradient(135deg, rgba(74,111,165,0.08), rgba(74,111,165,0.04))",
                borderStyle: "dashed",
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--dl-brand)",
                  marginBottom: 6,
                }}
              >
                Ready to see your scores?
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--dl-text-muted)",
                  marginBottom: 16,
                }}
              >
                Takes 5 minutes to get scored.
              </p>
              <Link href="/sign-up" className="dl-btn dl-btn-primary dl-btn-sm">
                Get My Free Score
                <ArrowRight size={14} strokeWidth={2} />
              </Link>
            </div>
          </StaggerContainer>
        </div>
      </section>

      <div className="dl-section-divider" />

      {/* ── Inside the product — Dashboard preview (DL header, kept dark mockup) ── */}
      <section className="dl-features" style={{ background: "var(--dl-bg-page)" }} aria-label="Product preview">
        <div className="dl-features-inner">
          <ScrollReveal>
          <div className="text-center mb-14">
            <p className="dl-section-eyebrow">Inside the product</p>
            <h2 className="dl-section-heading">
              Your command center for <em>college admissions.</em>
            </h2>
            <p className="dl-section-sub">
              Every tool you need, in one place. Profile builder, AI scoring,
              essay feedback, college list — all connected.
            </p>
          </div>
          </ScrollReveal>

          {/* Dashboard mockup card */}
          <ScrollReveal delay={0.15}>
          <ParallaxWrapper strength={0.06}>
          <div
            role="img"
            aria-label="Example AdmitPath dashboard showing 7-dimension profile score, strengths, gaps, and priority actions"
            className="relative w-full overflow-hidden rounded-3xl border"
            style={{
              background: "#FFFFFF",
              borderColor: "rgba(0,0,0,0.08)",
              boxShadow: "0 32px 96px rgba(0,0,0,0.08), 0 8px 32px rgba(74,111,165,0.06)",
            }}
          >
            {/* Light nav bar mockup */}
            <div
              className="flex items-center justify-between px-6 py-4 border-b"
              style={{ borderColor: "rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500 opacity-70" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400 opacity-70" />
                  <div className="h-3 w-3 rounded-full bg-green-400 opacity-70" />
                </div>
                <div
                  className="hidden sm:flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium"
                  style={{ background: "var(--dl-bg-root, #EFF2F8)", color: "var(--dl-text-secondary, #454B5E)" }}
                >
                  <span>admith.vercel.app/dashboard</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full" style={{ background: "linear-gradient(135deg, var(--dl-brand, #4A6FA5), var(--dl-brand-deep, #1E3352))" }} />
                <span className="text-xs font-medium hidden sm:inline" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Maya R.</span>
              </div>
            </div>

            {/* Dashboard content mockup */}
            <div className="p-6 md:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left — score + tools */}
                <div className="lg:col-span-2 space-y-5">
                  {/* Welcome + score */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--dl-brand, #4A6FA5)" }}>
                        Good morning
                      </p>
                      <h3 className="text-2xl font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                        Welcome back, Maya
                      </h3>
                    </div>
                    <div
                      className="sm:ml-auto flex items-center gap-4 rounded-2xl px-5 py-3"
                      style={{ background: "var(--dl-bg-root, #EFF2F8)", border: "1px solid rgba(0,0,0,0.06)" }}
                    >
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--dl-text-muted, #5A6275)" }}>Overall Score</p>
                        <p className="text-3xl font-extrabold leading-none" style={{ color: "var(--dl-brand, #4A6FA5)" }}>81</p>
                      </div>
                      <div className="h-10 w-px" style={{ background: "rgba(0,0,0,0.08)" }} />
                      <div>
                        <p className="text-[10px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>out of 100</p>
                        <p className="text-xs font-semibold mt-0.5" style={{ color: "var(--dl-brand, #4A6FA5)" }}>Top 18% ↑</p>
                      </div>
                    </div>
                  </div>

                  {/* Score bars grid */}
                  <div
                    className="rounded-2xl p-5 space-y-3"
                    style={{ background: "var(--dl-bg-root, #EFF2F8)", border: "1px solid rgba(0,0,0,0.06)" }}
                  >
                    <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                      7-Dimension Breakdown
                    </p>
                    {[
                      { label: "Academic Rigor", score: 88 },
                      { label: "Leadership", score: 74 },
                      { label: "Awards", score: 91 },
                      { label: "Activity Depth", score: 67 },
                      { label: "Spike", score: 82 },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <span className="w-28 shrink-0 text-[10px] font-medium" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{item.label}</span>
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.08)" }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${item.score}%`,
                              background: "linear-gradient(90deg, var(--dl-brand, #4A6FA5), var(--dl-brand-dark, #2E4A6E))",
                            }}
                          />
                        </div>
                        <span className="w-7 shrink-0 text-xs font-bold" style={{ color: "var(--dl-brand, #4A6FA5)" }}>{item.score}</span>
                      </div>
                    ))}
                  </div>

                  {/* Quick action tiles */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { Icon: Brain,          label: "Run Analysis",   tint: "var(--dl-brand-dark, #2E4A6E)" },
                      { Icon: PenLine,        label: "Essay Feedback", tint: "var(--dl-brand-light, #7A99C9)" },
                      { Icon: GraduationCap,  label: "College List",   tint: "var(--dl-brand, #4A6FA5)" },
                    ].map((action) => (
                      <div
                        key={action.label}
                        className="rounded-2xl p-4 flex flex-col gap-3"
                        style={{ background: "var(--dl-bg-root, #EFF2F8)", border: "1px solid rgba(0,0,0,0.06)" }}
                      >
                        <div
                          className="h-9 w-9 rounded-xl flex items-center justify-center"
                          style={{ background: "rgba(74,111,165,0.10)", color: action.tint }}
                        >
                          <action.Icon className="h-4 w-4" strokeWidth={1.75} />
                        </div>
                        <p className="text-xs font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{action.label}</p>
                        <div className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: action.tint }}>
                          Open <ArrowRight className="h-2.5 w-2.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right — action plan */}
                <div
                  className="rounded-2xl p-5 flex flex-col gap-4"
                  style={{ background: "var(--dl-bg-root, #EFF2F8)", border: "1px solid rgba(0,0,0,0.06)" }}
                >
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                    Your Action Plan
                  </p>
                  <div className="space-y-3 flex-1">
                    {[
                      { text: "Join 2 more clubs in a leadership role", priority: "high", done: false },
                      { text: "Apply for Science Olympiad regionals", priority: "high", done: false },
                      { text: "Revise Common App essay — add specifics", priority: "medium", done: false },
                      { text: "Request recommendation from Mr. Torres", priority: "medium", done: true },
                      { text: "Add 3 more reach schools to college list", priority: "low", done: true },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div
                          className="mt-0.5 h-4 w-4 rounded-full flex items-center justify-center shrink-0"
                          style={{
                            background: item.done ? "var(--dl-green, #22C55E)" : "transparent",
                            border: item.done ? "none" : `1.5px solid ${item.priority === "high" ? "var(--dl-brand, #4A6FA5)" : item.priority === "medium" ? "var(--dl-brand-dark, #2E4A6E)" : "var(--dl-text-muted, #8890A5)"}`,
                          }}
                        >
                          {item.done && <span className="text-[8px] text-white font-bold">&#10003;</span>}
                        </div>
                        <p
                          className="text-xs leading-snug"
                          style={{
                            color: item.done ? "var(--dl-text-muted, #8890A5)" : "var(--dl-text-secondary, #454B5E)",
                            textDecoration: item.done ? "line-through" : "none",
                          }}
                        >
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div
                    className="rounded-xl px-4 py-3 text-center"
                    style={{ background: "rgba(74,111,165,0.08)", border: "1px solid rgba(74,111,165,0.15)" }}
                  >
                    <p className="text-xs font-bold" style={{ color: "var(--dl-brand, #4A6FA5)" }}>Profile 68% complete</p>
                    <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.08)" }}>
                      <div className="h-full rounded-full" style={{ width: "68%", background: "linear-gradient(90deg, var(--dl-brand, #4A6FA5), var(--dl-brand-dark, #2E4A6E))" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle bottom edge for editorial feel */}
            <div
              className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
              style={{ background: "linear-gradient(to top, rgba(255,255,255,0.9), transparent)" }}
            />
          </div>
          </ParallaxWrapper>
          </ScrollReveal>

          <ScrollReveal delay={0.25}>
          <div className="mt-8 text-center">
            <Link href="/sign-up" className="dl-btn dl-btn-primary px-8 py-3.5 text-sm">
              Get My Free Score &mdash; Takes 5 Minutes
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-3">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium" style={{ color: "var(--dl-text-muted)" }}>
                <Lock size={11} strokeWidth={2.5} />
                Secure sessions and documented data controls
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium" style={{ color: "var(--dl-text-muted)" }}>
                <ShieldCheck size={11} strokeWidth={2.5} />
                Payments handled by Stripe
              </span>
            </div>
          </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── How it works — StoryBrand Element 4: The Plan (3 simple steps) ── */}
      <section
        className="dl-features"
        id="how-it-works"
        aria-label="How it works"
        style={{ background: "rgba(255,255,255,0.55)", borderTop: "2px solid rgba(74,111,165,0.12)", borderBottom: "2px solid rgba(74,111,165,0.12)" }}
      >
        <div className="dl-features-inner">
          <ScrollReveal>
          <div className="text-center mb-14">
            <p className="dl-section-eyebrow" style={{ letterSpacing: "0.14em", fontSize: 11, fontWeight: 700 }}>How it works</p>
            <h2 className="dl-section-heading" style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, letterSpacing: "-0.03em" }}>
              Three steps to <em>a stronger application</em>
            </h2>
            <p className="dl-section-sub" style={{ fontSize: 16, lineHeight: 1.65, maxWidth: 540 }}>
              Five minutes to get scored. Walk away knowing exactly where
              you stand and what to do next.
            </p>
          </div>
          </ScrollReveal>

          <StaggerContainer className="dl-features-grid" staggerMs={120}>
            {steps.map((step) => (
              <div key={step.step} className="dl-feature-card dl-card-hover dl-reveal">
                <span className="dl-feature-step">{step.step}</span>
                <h3 className="dl-feature-title">{step.title}</h3>
                <p className="dl-feature-desc">{step.description}</p>
                <p
                  className="mt-4"
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--dl-brand)",
                    fontFamily: "var(--dl-font-mono)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {step.detail}
                </p>
              </div>
            ))}
          </StaggerContainer>

          <ScrollReveal delay={0.1}>
          <div className="text-center mt-14">
            <Link href={signedIn ? "/analyze" : "/sign-up"} className="dl-btn dl-btn-primary dl-btn-xl">
              {signedIn ? "Run an analysis" : "Get My Free Score"} <ArrowRight size={16} strokeWidth={2} />
            </Link>
            <p className="mt-3" style={{ fontSize: 12, color: "var(--dl-text-muted)" }}>
              Calibrated to real CDS admissions data from 102 schools.
            </p>
          </div>
          </ScrollReveal>
        </div>
      </section>



      {/* ── Trust signals before pricing — reduces purchase friction ── */}
      <ScrollReveal>
      <TrustBar />
      </ScrollReveal>


      {/* ── FOR PARENTS — conversion section targeting buying decision-maker ── */}
      <ScrollReveal>
      <section className="dl-features" style={{ background: "var(--dl-bg-page)" }} aria-label="For parents" id="parents">
        <div className="dl-features-inner">
          <div className="text-center mb-10">
            <p className="dl-section-eyebrow">For parents</p>
            <h2 className="dl-section-heading">
              Give your child <em>every advantage.</em>
            </h2>
            <p className="dl-section-sub" style={{ maxWidth: 600 }}>
              You want the best for your child. But college admissions has changed
              since you applied.
            </p>
          </div>

          {/* Pain points — 3-column stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            {[
              { stat: "7", text: "documented profile dimensions" },
              { stat: "5", text: "free analyses, essay reviews, and chat messages" },
              { stat: "105", text: "structured college records in the current dataset" },
            ].map((item) => (
              <div
                key={item.stat}
                className="text-center p-6"
                style={{
                  background: "rgba(255,255,255,0.45)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "var(--dl-radius-lg)",
                  border: "1px solid var(--dl-border, rgba(0,0,0,0.06))",
                }}
              >
                <p
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    color: "var(--dl-brand-deep, #1E3352)",
                    fontFamily: "var(--dl-font-mono)",
                    letterSpacing: "-0.02em",
                    marginBottom: 8,
                  }}
                >
                  {item.stat}
                </p>
                <p style={{ fontSize: 14, color: "var(--dl-text-secondary, #454B5E)", lineHeight: 1.6 }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          {/* Value prop + what parents see */}
          <div
            className="mx-auto max-w-3xl p-8 md:p-10"
            style={{
              background: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(16px)",
              borderRadius: "var(--dl-radius-lg)",
              border: "1px solid var(--dl-border, rgba(0,0,0,0.06))",
              boxShadow: "var(--dl-shadow-sm)",
            }}
          >
            <p
              className="text-center mb-8"
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "var(--dl-text-primary, #1B2030)",
                lineHeight: 1.5,
              }}
            >
              AdmitPath provides structured college-planning tools for <strong style={{ color: "var(--dl-brand, #4A6FA5)" }}>$1/day</strong>.
            </p>

            <p
              className="mb-4"
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--dl-text-muted, #5A6275)",
              }}
            >
              What parents see
            </p>
            <div className="space-y-3 mb-8">
              {[
                "Your child's 7-dimension score vs admitted students",
                "Specific weekly action items (not vague advice)",
                "Essay feedback that catches what you can't",
                "Financial aid optimization that saves thousands",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    size={16}
                    strokeWidth={2.25}
                    style={{ color: "#4DA67A", flexShrink: 0, marginTop: 2 }}
                  />
                  <span style={{ fontSize: 14, color: "var(--dl-text-secondary, #454B5E)", lineHeight: 1.55 }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Parent testimonial */}
            <div
              className="p-5 mb-8"
              style={{
                background: "rgba(74,111,165,0.04)",
                borderRadius: "var(--dl-radius-md)",
                borderLeft: "3px solid var(--dl-brand, #4A6FA5)",
              }}
            >
              <p
                style={{
                  fontSize: 15,
                  fontStyle: "italic",
                  color: "var(--dl-text-secondary, #454B5E)",
                  lineHeight: 1.65,
                  marginBottom: 8,
                }}
              >
                &ldquo;I wish this existed when my older child was applying. The
                clarity it gives is worth 10x the price.&rdquo;
              </p>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--dl-text-muted, #5A6275)",
                }}
              >
                &mdash; Parent of 2026 applicant
              </p>
            </div>

            <div className="text-center">
              <Link href="/sign-up" className="dl-btn dl-btn-primary dl-btn-lg">
                Get your child started &mdash; Free
                <ArrowRight size={14} strokeWidth={2} />
              </Link>
              </div>
          </div>
        </div>
      </section>
      </ScrollReveal>


      {/* ── Acceptance Letter Visualization — just above pricing per AP-005 ── */}
      <ScrollReveal>
      <section className="dl-features" style={{ background: "var(--dl-bg-page)" }} aria-label="Acceptance letter visualization">
        <div className="dl-features-inner">
          <div className="text-center mb-10">
            <p className="dl-section-eyebrow">Visualize your future</p>
            <h2 className="dl-section-heading">Imagine opening <em>this letter.</em></h2>
            <p className="dl-section-sub" style={{ maxWidth: 560 }}>Every detail of your application matters. AdmitPath helps you build the profile that earns this moment.</p>
          </div>
          <div className="mx-auto" style={{ maxWidth: 540 }}>
            <div className="relative overflow-hidden" style={{ background: "#FFFFFF", borderRadius: "var(--dl-radius-lg, 16px)", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 24px 80px rgba(0,0,0,0.12), 0 8px 24px rgba(74,111,165,0.08)", padding: "40px 36px 36px" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full shrink-0" style={{ background: "linear-gradient(135deg, var(--dl-brand-deep, #1E3352), var(--dl-brand, #4A6FA5))" }}><GraduationCap className="h-6 w-6 text-white" strokeWidth={1.5} /></div>
                <div><p style={{ fontSize: 14, fontWeight: 700, color: "var(--dl-text-primary, #1B2030)", letterSpacing: "-0.01em" }}>Office of Undergraduate Admissions</p><p style={{ fontSize: 11, color: "var(--dl-text-muted, #5A6275)" }}>Your Top-Choice University</p></div>
              </div>
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 20 }}>
                <p style={{ fontSize: 13, color: "var(--dl-text-secondary, #454B5E)", marginBottom: 16 }}>Dear <span style={{ fontWeight: 600, color: "var(--dl-brand, #4A6FA5)" }}>[Your Name]</span>,</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--dl-text-primary, #1B2030)", lineHeight: 1.7, marginBottom: 16 }}>It is with great pleasure that I inform you of your <span style={{ color: "var(--dl-brand, #4A6FA5)", fontWeight: 700 }}>admission</span> to the Class of 2031. Your application stood out among a remarkable pool of candidates.</p>
                <p style={{ fontSize: 13, color: "var(--dl-text-secondary, #454B5E)", lineHeight: 1.65, marginBottom: 16 }}>The committee was particularly impressed by the depth of your extracurricular engagement and the authenticity of your personal essay. Your academic record demonstrates both rigor and intellectual curiosity.</p>
                <p style={{ fontSize: 13, color: "var(--dl-text-secondary, #454B5E)", lineHeight: 1.65, marginBottom: 24 }}>We look forward to welcoming you to campus this fall.</p>
                <p style={{ fontSize: 13, fontStyle: "italic", color: "var(--dl-text-muted, #5A6275)" }}>Warmest congratulations,</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--dl-text-primary, #1B2030)", marginTop: 4 }}>The Admissions Committee</p>
              </div>
              <div className="absolute top-6 right-6 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: "rgba(77,166,122,0.10)", border: "2px solid rgba(77,166,122,0.25)" }}><CheckCircle2 className="h-8 w-8" style={{ color: "#4DA67A" }} strokeWidth={1.5} /></div>
            </div>
            <div className="text-center mt-8"><Link href="/sign-up" className="dl-btn dl-btn-primary dl-btn-lg">Start building your path <ArrowRight size={14} strokeWidth={2} /></Link></div>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* ── Pricing — $100M Offers Grand Slam + Discovery Labs ── */}
      <section className="dl-features" id="pricing" aria-label="Pricing plans">
        <div className="dl-features-inner">
          <ScrollReveal>
          <div className="text-center mb-14">
            <p className="dl-section-eyebrow" style={{ letterSpacing: "0.14em", fontSize: 11, fontWeight: 700 }}>Pricing</p>
            <h2 className="dl-section-heading" style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, letterSpacing: "-0.03em" }}>
              Simple, <em>transparent</em> pricing
            </h2>
            <p className="dl-section-sub" style={{ fontSize: 16, lineHeight: 1.65, maxWidth: 520 }}>
              No hidden fees. Start free, upgrade when you are ready.
            </p>
          </div>
          </ScrollReveal>

          {/* Urgency banner */}
          <ScrollReveal delay={0.05}>
          <div
            className="mx-auto text-center"
            style={{
              maxWidth: 540,
              marginBottom: 32,
              padding: "14px 24px",
              background: "linear-gradient(90deg, rgba(74,111,165,0.08), rgba(74,111,165,0.04))",
              borderRadius: "var(--dl-radius-lg)",
              border: "1px solid rgba(74,111,165,0.12)",
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--dl-text-primary)", margin: 0 }}>
              Application deadlines are approaching &mdash; start now
            </p>
            <p style={{ fontSize: 11, color: "var(--dl-text-muted)", marginTop: 4, marginBottom: 0 }}>
              Starting earlier gives you more time to review requirements, revise drafts, and verify deadlines.
            </p>
          </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
          <div
            className="mx-auto text-center"
            style={{
              maxWidth: 720,
              marginBottom: 48,
              padding: "24px 28px",
              background: "var(--dl-bg-white)",
              border: "1px solid var(--dl-border)",
              borderRadius: "var(--dl-radius-lg)",
              boxShadow: "var(--dl-shadow-sm)",
            }}
          >
            <p style={{ fontSize: 22, fontWeight: 700, color: "var(--dl-brand)", fontFamily: "var(--dl-font-mono)" }}>
              $19.99/month
            </p>
            <p style={{ fontSize: 13, color: "var(--dl-text-secondary)", marginTop: 8 }}>
              Monthly-only Pro billing. Manage or cancel through Stripe&apos;s billing portal.
            </p>
          </div>
          </ScrollReveal>


          {/* Plan cards — 3-column grid with visual hierarchy */}
          <StaggerContainer
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-[760px] mx-auto"
            staggerMs={120}
          >
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="pricing-card dl-card-hover"
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  padding: plan.highlighted ? "40px 28px 32px" : "32px 28px",
                  borderRadius: "var(--dl-radius-lg, 16px)",
                  background: "var(--dl-bg-white, #fff)",
                  border: plan.highlighted
                    ? "2px solid var(--dl-brand)"
                    : plan.tier === "free"
                      ? "1px solid rgba(0,0,0,0.06)"
                      : "1px solid var(--dl-border, rgba(0,0,0,0.08))",
                  boxShadow: plan.highlighted
                    ? "0 16px 64px rgba(74,111,165,0.18), 0 4px 16px rgba(74,111,165,0.08)"
                    : "var(--dl-shadow-sm, 0 1px 4px rgba(0,0,0,0.06))",
                  transform: plan.highlighted ? "scale(1.02)" : "none",
                  transition: "transform 200ms ease, box-shadow 200ms ease",
                  zIndex: plan.highlighted ? 2 : 1,
                  opacity: plan.tier === "free" ? 0.92 : 1,
                }}
              >
                {plan.highlighted && (
                  <span
                    style={{
                      position: "absolute",
                      top: -13,
                      left: "50%",
                      transform: "translateX(-50%)",
                      padding: "5px 18px",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "white",
                      background:
                        "linear-gradient(90deg, var(--dl-brand), var(--dl-brand-dark))",
                      borderRadius: "var(--dl-radius-pill, 999px)",
                      letterSpacing: "0.06em",
                      whiteSpace: "nowrap",
                      boxShadow: "0 4px 14px rgba(74,111,165,0.40)",
                      textTransform: "uppercase",
                    }}
                  >
                    Pro Plan
                  </span>
                )}

                {/* Plan name */}
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: plan.highlighted ? "var(--dl-brand)" : "var(--dl-text-muted)",
                    marginBottom: 8,
                    fontFamily: "var(--dl-font-mono, monospace)",
                  }}
                >
                  {plan.name}
                </p>

                {/* Price */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 4,
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: plan.tier === "free" ? 38 : 44,
                      fontWeight: 800,
                      lineHeight: 1,
                      color: "var(--dl-text-primary)",
                      fontFamily: "var(--dl-font-mono, monospace)",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {plan.price}
                  </span>
                  <span style={{ fontSize: 14, color: "var(--dl-text-muted)" }}>
                    /{plan.period}
                  </span>
                </div>

                {/* Description */}
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: "var(--dl-text-secondary)",
                    marginBottom: 24,
                    minHeight: 44,
                  }}
                >
                  {plan.description}
                </p>

                {/* Divider */}
                <div
                  style={{
                    height: 1,
                    background: plan.highlighted
                      ? "linear-gradient(90deg, transparent, var(--dl-brand), transparent)"
                      : "var(--dl-border, rgba(0,0,0,0.06))",
                    marginBottom: 20,
                    opacity: plan.highlighted ? 0.35 : 1,
                  }}
                />

                {/* Features */}
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", flex: 1 }}>
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        fontSize: 13.5,
                        lineHeight: 1.5,
                        color: "var(--dl-text-secondary)",
                        padding: "7px 0",
                      }}
                    >
                      <CheckCircle2
                        size={15}
                        strokeWidth={2.25}
                        style={{
                          color: plan.tier === "free"
                            ? "var(--dl-text-muted, #5A6275)"
                            : "var(--dl-green, #4DA67A)",
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {plan.tier === "free" ? (
                  <Link
                    href="/sign-up"
                    className="pricing-cta-free"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      width: "100%",
                      padding: "12px 20px",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--dl-text-secondary)",
                      background: "transparent",
                      border: "1px solid var(--dl-border, rgba(0,0,0,0.10))",
                      borderRadius: "var(--dl-radius-md, 10px)",
                      textDecoration: "none",
                      transition: "background 200ms ease, color 200ms ease, border-color 200ms ease",
                    }}
                  >
                    {plan.cta}
                  </Link>
                ) : plan.highlighted ? (
                  <Link
                    href={`/sign-up?plan=${plan.id}`}
                    className="dl-btn dl-btn-primary dl-btn-lg hover:-translate-y-0.5 hover:shadow-lg"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    {plan.cta}
                    <ArrowRight size={14} strokeWidth={2} />
                  </Link>
                ) : (
                  <Link
                    href={`/sign-up?plan=${plan.id}`}
                    className="pricing-cta-outline"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      width: "100%",
                      padding: "12px 20px",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--dl-brand)",
                      background: "transparent",
                      border: "1.5px solid var(--dl-brand)",
                      borderRadius: "var(--dl-radius-md, 10px)",
                      textDecoration: "none",
                      transition: "background 200ms ease, color 200ms ease",
                    }}
                  >
                    {plan.cta}
                    <ArrowRight size={14} strokeWidth={2} />
                  </Link>
                )}
              </div>
            ))}
          </StaggerContainer>

          <ScrollReveal delay={0.1}>
          <p
            style={{
              marginTop: 32,
              textAlign: "center",
              fontSize: 13,
              color: "var(--dl-text-muted)",
            }}
          >
            Stripe-secured checkout
          </p>
          <div
            style={{
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium" style={{ color: "var(--dl-text-muted)" }}>
              <Lock size={11} strokeWidth={2.5} />
              Secure sessions and documented data controls
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium" style={{ color: "var(--dl-text-muted)" }}>
              <ShieldCheck size={11} strokeWidth={2.5} />
              Payments handled by Stripe
            </span>
          </div>
          </ScrollReveal>

          {/* Backed-by-data trust element */}
          <ScrollReveal delay={0.15}>
          <div
            style={{
              marginTop: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "6px 0",
            }}
          >
            {[
              "Calibrated against 102 schools",
              "CDS Section C7 data",
              "Admissions guides and planning tools",
            ].map((item, i, arr) => (
              <span key={item} style={{ display: "inline-flex", alignItems: "center" }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--dl-text-muted)",
                    fontFamily: "var(--dl-font-sans)",
                  }}
                >
                  {item}
                </span>
                {i < arr.length - 1 && (
                  <span
                    style={{
                      display: "inline-block",
                      width: 3,
                      height: 3,
                      borderRadius: "50%",
                      background: "var(--dl-text-muted)",
                      opacity: 0.5,
                      margin: "0 12px",
                    }}
                    aria-hidden="true"
                  />
                )}
              </span>
            ))}
          </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Testimonials removed per owner feedback ── */}

      {/* NOTE: testimonials data is still defined above in case needed in the future, but the section is removed from the landing page per owner instructions. */}

      {/* ── Data sources credibility section (moved toward end per AP-005) ── */}
      <ScrollReveal>
      <section className="dl-features" style={{ background: "var(--dl-bg-page)" }} aria-label="Data sources">
        <div className="dl-features-inner">
          <div className="text-center mb-10">
            <p className="dl-section-eyebrow">The foundation</p>
            <h2 className="dl-section-heading">
              Built on <em>real admissions data</em>, not guesswork
            </h2>
            <p className="dl-section-sub">
              Every score traces back to verifiable, published data sources. Updated for the 2026 admissions cycle.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {[
              { title: "CDS Section C7 Weights", body: "Official admissions-factor weights self-reported by each university and used where the repository includes them.", badge: "Institution data" },
              { title: "College Scorecard API", body: "U.S. Department of Education dataset: net price by income, median earnings, student-loan repayment rates.", badge: "Federal data" },
              { title: "IPEDS Enrollment Data", body: "Federal enrollment, retention, graduation rates, and demographic breakdowns powering College Navigator.", badge: "NCES verified" },
              { title: "Common App Statistics", body: "Public aggregate application trends used as contextual background, not as school-specific applicant records.", badge: "Aggregate context" },
            ].map((source) => (
              <div key={source.title} className="dl-feature-card" style={{ textAlign: "left" }}>
                <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--dl-brand)", background: "rgba(74,111,165,0.10)", borderRadius: "var(--dl-radius-pill)", fontFamily: "var(--dl-font-mono)", marginBottom: 12 }}>{source.badge}</span>
                <h3 className="dl-feature-title">{source.title}</h3>
                <p className="dl-feature-desc">{source.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </ScrollReveal>

      <OneTimeOffersSection />

      {/* ── FAQ ── */}
      <ScrollReveal>
      <FAQSection />
      </ScrollReveal>

      {/* Placeholder to skip removed testimonials content */}
      {(() => { void testimonials; return null; })()}

      {/* ── Final CTA — DL slate-blue tri-stop ── */}
      <ScrollReveal>
      <section
        className="py-20 sm:py-32 lg:py-40 relative overflow-hidden"
        aria-label="Call to action"
        style={{
          background: "linear-gradient(135deg, var(--dl-brand-deep, #1E3352) 0%, var(--dl-brand-deep, #1E3352) 40%, var(--dl-brand, #4A6FA5) 75%, var(--dl-brand-dark, #2E4A6E) 100%)",
        }}
      >
        {/* Background layered depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 80% at 30% 50%, rgba(255,255,255,0.08), transparent)" }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 40% 60% at 80% 30%, rgba(74,111,165,0.25), transparent)" }}
        />
        {/* Subtle noise */}
        <div className="absolute inset-0 pointer-events-none noise-overlay opacity-50" />

        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold mb-6"
            style={{ background: "rgba(255,255,255,0.18)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)" }}
          >
            Application deadlines are approaching
          </div>
          <h2
            className="mb-5 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
            style={{ color: "#FFFFFF", lineHeight: 1.1, letterSpacing: "-0.04em" }}
          >
            Don&rsquo;t leave your future
            <br />
            <em
              style={{
                fontStyle: "italic",
                fontWeight: 600,
                color: "rgba(255,255,255,0.95)",
              }}
            >
              to chance.
            </em>
          </h2>
          <p className="mb-10 text-lg" style={{ color: "rgba(255,255,255,0.80)" }}>
            Every year, thousands of qualified students get rejected because they didn&rsquo;t know
            what admissions officers actually look for. Turn that
            uncertainty into a clear plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={signedIn ? "/dashboard" : "/sign-up"} className="inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-base px-10 py-4 cta-white-btn transition-[background-color,filter] duration-150 ease-out hover:brightness-95" style={{ background: "#fff", color: "#4A6FA5", boxShadow: "0 8px 32px rgba(0,0,0,0.20)" }}>
              {signedIn ? "Go to dashboard" : "Get My Free Score Now"} <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </Link>
            <Link href={signedIn ? "/analyze" : "#how-it-works"} className="inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-sm px-8 py-4 cta-outline-dark-btn transition-[background-color,border-color] duration-150 ease-out" style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.30)" }}>
              {signedIn ? "Run a new analysis" : "See how it works"}
            </Link>
          </div>
          <p className="mt-6 text-sm" style={{ color: "rgba(255,255,255,0.60)" }}>
            Calibrated to real CDS admissions data from 102 schools.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.50)" }}>
              <Lock size={11} strokeWidth={2.5} />
              Secure session cookies and account-scoped data
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.50)" }}>
              <ShieldCheck size={11} strokeWidth={2.5} />
              Stripe-secured payments
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.50)" }}>
              <Database size={11} strokeWidth={2.5} />
              Calibrated to 2026 admissions data
            </span>
          </div>
        </div>
      </section>
      </ScrollReveal>

      </main>

      {/* ── Footer — compact, max 320px desktop ── */}
      <footer className="py-8 sm:py-10" style={{ backgroundColor: "#1B2030" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8">
            <div>
              <Link href="/" className="inline-flex items-center gap-2 mb-2">
                <LogoMark size={22} />
                <span className="font-semibold text-sm text-white">AdmitPath</span>
              </Link>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>AI college counseling calibrated to real admissions data.</p>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-[13px]" style={{ color: "rgba(255,255,255,0.7)" }}>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              <Link href="/resources" className="hover:text-white transition-colors">Resources</Link>
              <a href="mailto:maestro.committee@gmail.com" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-6 border-t pt-5 flex flex-col sm:flex-row items-center justify-between gap-2" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>&copy; 2026 AdmitPath. All rights reserved.</p>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>maestro.committee@gmail.com</p>
          </div>
        </div>
      </footer>

      <StickyMobileCTA signedIn={signedIn} />

      {/* Viral growth: exit-intent popup + social proof toasts (signed-out only) */}
      {!signedIn && <LandingClientEffects />}
    </div>
  );
}
