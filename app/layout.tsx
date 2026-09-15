import type { Metadata, Viewport } from "next";
import { Inter, Lora, JetBrains_Mono } from "next/font/google";
// ClerkProvider removed — auth is now Google OAuth via /api/auth/google
import { ThemeProvider } from "next-themes";
// CounselorWidget removed from global layout per user request
import { ToastProvider } from "@/components/ui/toast";
import { CommandPalette } from "@/components/ui/command-palette";
import { ShortcutsProvider } from "@/components/shortcuts-provider";
import { LenisProvider } from "@/components/lenis-provider";
import { CookieBanner } from "@/components/cookie-banner";
import { ConsentAnalytics } from "@/components/consent-analytics";
import { getPublicAppUrl } from "@/lib/site-url";
import "./globals.css";

// Discovery Labs design system — Inter is the canonical sans across
// headings + UI + body. Lora stays as the editorial serif for accents
// (per DL's --dl-font-script). JetBrains Mono for code/brag-sheet blocks.
//
// CSS-variable names retained: --font-dm-serif and --font-instrument-sans
// are aliased in globals.css so dozens of components don't need a
// find/replace. Both resolve to Inter; --font-lora and --font-jetbrains-mono
// resolve to their real fonts.
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// Use `||` not `??` — an empty-string env var ("") satisfies the nullish
// check and crashes `new URL("")` during static page collection.
// Trim + strip trailing slashes because Vercel's env-var UI sometimes
// captures a trailing newline, which leaks into JSON-LD URLs as
// "https://admith.vercel.app\n" — verified in the live page source.
const APP_URL = getPublicAppUrl();

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "College Admissions AI Counselor | AdmitPath",
    template: "%s | AdmitPath",
  },
  description:
    "Plan your college application with a documented 7-dimension profile review, essay feedback, college research, and application-planning tools.",
  // Meta keywords are ignored by modern search engines. Keep them out of the
  // rendered document instead of publishing a long, low-signal list.
  keywords: undefined,
  /* Legacy keyword inventory retained temporarily for editorial reference.
  keywords: [
    "college admissions counselor",
    "college fit calculator",
    "7-dimension scoring",
    "college admissions",
    "college counseling",
    "AI college counselor",
    "college application",
    "how to write a college essay",
    "common app essay prompts 2026",
    "college essay examples",
    "how to get into harvard",
    "how to get into mit",
    "how to get into stanford",
    "how to get into yale",
    "how to get into uf",
    "how to get into princeton",
    "how to write supplemental essay",
    "college application timeline",
    "early decision vs early action",
    "activities list common app",
    "college essay help",
    "SAT prep",
    "Ivy League",
    "college admissions calculator",
    "college list builder",
    "college application checklist",
    "admission probability",
    "extracurricular profile review",
    "college readiness score",
    "Common Data Set",
    "financial aid calculator",
    "bright futures scholarship",
    "college fit assessment",
    "safety match reach colleges",
    "how many colleges to apply to",
    "why this college essay",
    "college interview questions",
    "letter of recommendation guide",
    "high school resume",
    "college admissions for florida students",
    "college essay word count",
    "ap vs ib for college admissions",
    "dual enrollment for college admissions",
    "how to write personal statement",
    "college essay topics to avoid",
    "showing not telling college essay",
    "essay hook examples college",
    "spike vs well rounded admissions",
    "coalition app vs common app",
    "common app activities character limit",
    "how to ask for a letter of rec",
    "college application timeline 2026",
    "how to choose a college",
    "scholarship application guide",
    "fafsa checklist 2026",
    "financial aid appeal",
    "net price calculator",
    "college decision day",
    "test optional schools 2026",
    "college tour checklist",
    "coca cola scholars program",
    "davidson fellows scholarship",
    "regeneron science talent search",
    "college admissions calendar",
    "college application timeline",
    "college fit assessment",
    "college list builder",
    "how to get into college",
    "admissions worksheets",
    "college essay brainstorm",
    "activities list optimizer",
    "supplemental essay strategy",
    "college admissions data 2026",
    // Search terms for the product category.
    "college admissions AI",
    "college counselor AI",
    "AI college essay feedback",
    "college application AI tool",
    "college chances calculator",
    "college admissions planner",
    // Surprise 4: CEG mega-page pattern: /blog/college-essay-examples = 15,413 keywords
    "personal statement examples",
    "statement of purpose examples",
    "ivy league schools list",
    "college essay structure",
    "college essay brainstorming",
    "college essay examples",
    "ivy league schools",
    "letter of recommendation for student",
    "international baccalaureate diploma",
    "college resume examples",
    "essay structure",
    "naviance alternative",
    "extracurricular activities for college",
    "summer programs for high school students",
    "best colleges for pre med",
    "boston college vs boston university",
    // Surprise 8: Named direct competitors — AdmitPath's competitive set
    "college advisor alternative",
    "ivy coach alternative",
    "crimson education alternative",
    // Florida hyper-local (Surprise 3: Niche's college pages are weak vs city pages)
    "UF admissions 2026",
    "FSU admissions 2026",
    "UCF admissions 2026",
    "USF admissions 2026",
    "uf acceptance rate",
    "fsu acceptance rate",
    "ucf acceptance rate",
    "usf acceptance rate",
    "florida acceptance rate",
    "UF essay prompts 2027",
    "Pine View School college results",
    "Florida Bright Futures requirements 2026",
    "FAFSA 2026 deadlines",
    "net price calculator",
    "college ROI calculator",
    // Surprise 4: High-value CEG keywords to target
    "stanford acceptance rate",
    "yale admission rate",
    "highest lsat score",
    // AI Search / GEO optimization keywords
    "AI college counselor",
    "college admissions help",
    "college application strategy",
    "how to get into ivy league",
    "college essay help free",
  ],
  */
  openGraph: {
    title: "AI College Counselor for High School Students | AdmitPath",
    description: "Plan your application with a documented 7-dimension profile review, essay feedback, college research, and application-planning tools.",
    url: APP_URL,
    siteName: "AdmitPath",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${APP_URL}/api/og`,
        width: 1200,
        height: 630,
        alt: "AdmitPath — AI college counseling: 7-dimension profile scoring, essay feedback, and college list builder. Pro $19.99/mo.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI College Counselor for High School Students | AdmitPath",
    description: "Score your college application across 7 dimensions using a documented rubric informed by available CDS data. Includes essay feedback and college-list planning.",
    site: "@admitpath",
    creator: "@admitpath",
    images: [
      {
        url: `${APP_URL}/api/og`,
        alt: "AdmitPath — college admissions counseling.",
      },
    ],
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  applicationName: "AdmitPath",
  authors: [{ name: "AdmitPath team", url: APP_URL }],
  creator: "AdmitPath",
  publisher: "AdmitPath",
  category: "Education",
  formatDetection: { email: false, address: false, telephone: false },
  appleWebApp: {
    capable: true,
    title: "AdmitPath",
    statusBarStyle: "default",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "AdmitPath",
  },
};

// Site-wide entities only. Page-specific breadcrumbs, FAQs, articles, events,
// and how-to markup belong on the routes where that content is visible.
const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": `${APP_URL}/#organization`,
      name: "AdmitPath",
      url: APP_URL,
      logo: { "@type": "ImageObject", url: `${APP_URL}/apple-icon` },
      description:
        "AdmitPath provides web-based college application planning, essay feedback, college research, and scholarship resources.",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "maestro.committee@gmail.com",
        availableLanguage: "English",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${APP_URL}/#website`,
      url: APP_URL,
      name: "AdmitPath",
      publisher: { "@id": `${APP_URL}/#organization` },
      inLanguage: "en-US",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${APP_URL}/#software`,
      name: "AdmitPath",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      url: APP_URL,
      description:
        "A college application planning workspace with profile review, essay feedback, college-list planning, and counselor chat.",
      offers: [
        { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD", url: `${APP_URL}/pricing` },
        {
          "@type": "Offer",
          name: "Pro",
          price: "19.99",
          priceCurrency: "USD",
          url: `${APP_URL}/pricing`,
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "19.99",
            priceCurrency: "USD",
            billingDuration: "P1M",
          },
        },
      ],
    },
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#D5DCE8" },
    { media: "(prefers-color-scheme: dark)", color: "#0F0E0D" },
  ],
  colorScheme: "light",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": `${APP_URL}/#organization`,
      name: "AdmitPath",
      url: APP_URL,
      logo: { "@type": "ImageObject", url: `${APP_URL}/apple-icon`, width: 180, height: 180 },
      image: `${APP_URL}/api/og`,
      description:
        "AdmitPath builds college admissions tools that score student profiles across 7 dimensions and turn the results into prioritized action plans.",
      foundingDate: "2025",
      educationalLevel: ["HighSchool", "Undergraduate"],
      audience: {
        "@type": "EducationalAudience",
        educationalRole: "student",
        audienceType: "High school students applying to college",
      },
      knowsAbout: [
        "College admissions",
        "College essay editing",
        "College list building",
        "Extracurricular profile development",
        "Standardized testing strategy",
        "Common Application",
        "Supplemental essays",
        "Financial aid",
        "FAFSA",
        "Common Data Set analysis",
        "IPEDS data",
        "College Scorecard",
        "Florida college admissions",
        "Early Decision vs Early Action",
        "Test-optional admissions",
        "Scholarship applications",
        "Letter of recommendation strategy",
        "College interview preparation",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "maestro.committee@gmail.com",
        availableLanguage: ["English"],
      },
      // sameAs links the Organization entity to its other web identities so
      // Google can build a unified Knowledge Graph entry. Stays empty array
      // when handles aren't set yet — emitting an empty array is preferable
      // to omitting the field entirely (signals intent to add later).
      sameAs: [
        "https://twitter.com/admitpath",
        "https://www.linkedin.com/company/admitpath",
        "https://github.com/admitpath",
        "https://competeai.app",
      ],
    },
    {
      "@type": "Person",
      "@id": `${APP_URL}/#founder`,
      name: "AdmitPath Founder",
      url: `${APP_URL}/about`,
      description:
        "Builder of AI college counseling tools focused on application strategy, essays, college lists, and financial-aid planning.",
      knowsAbout: [
        "College admissions",
        "College essay writing",
        "Supplemental essays",
        "Common Application",
        "College application strategy",
        "Florida college admissions",
        "University of Florida admissions",
        "Financial aid",
        "FAFSA",
        "Extracurricular profile building",
        "Common Data Set analysis",
        "IPEDS data interpretation",
        "College Scorecard data",
        "Early Decision vs Early Action",
        "Test-optional admissions",
        "Activities list optimization",
        "Letter of recommendation strategy",
      ],
      alumniOf: [
        { "@type": "EducationalOrganization", name: "Pine View School", address: { "@type": "PostalAddress", addressLocality: "Osprey", addressRegion: "FL" } },
        { "@type": "CollegeOrUniversity", name: "State College of Florida" },
        { "@type": "CollegeOrUniversity", name: "USF Sarasota-Manatee" },
      ],
      worksFor: { "@id": `${APP_URL}/#organization` },
    },
    {
      "@type": "WebSite",
      "@id": `${APP_URL}/#website`,
      url: APP_URL,
      name: "AdmitPath",
      description: "Web-based college admissions planning software.",
      publisher: { "@id": `${APP_URL}/#organization` },
      inLanguage: "en-US",
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${APP_URL}/?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${APP_URL}/#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: APP_URL },
        { "@type": "ListItem", position: 2, name: "Essays", item: `${APP_URL}/guides` },
        { "@type": "ListItem", position: 3, name: "Colleges", item: `${APP_URL}/colleges` },
        { "@type": "ListItem", position: 4, name: "Scholarships", item: `${APP_URL}/scholarships` },
        { "@type": "ListItem", position: 5, name: "Pricing", item: `${APP_URL}/pricing` },
        { "@type": "ListItem", position: 6, name: "Blog", item: `${APP_URL}/blog` },
      ],
    },
    {
      "@type": "Event",
      name: "Common App Opens 2026",
      startDate: "2026-08-01",
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      description: "The Common Application opens for the 2026-2027 admissions cycle. AdmitPath helps students prepare essays, activities lists, and college lists before submission.",
      organizer: { "@type": "Organization", name: "Common Application Inc." },
    },
    {
      "@type": "HowTo",
      "@id": `${APP_URL}/#howto`,
      name: "How to Build Your College Application Strategy with AdmitPath",
      description: "Score your profile across 7 dimensions calibrated to real CDS data, get AI essay feedback, and build a balanced college list in under 10 minutes.",
      totalTime: "PT10M",
      step: [
        { "@type": "HowToStep", position: 1, name: "Enter your profile", text: "Input your GPA, test scores, activities, and awards. AdmitPath scores you across 7 dimensions (academic rigor, leadership, awards, activity depth, spike, essay quality, recommendations) calibrated to real Common Data Set admissions data." },
        { "@type": "HowToStep", position: 2, name: "Get your action plan", text: "Receive a prioritized action plan showing exactly which dimensions to strengthen. See how your profile compares to admitted students at your target schools." },
        { "@type": "HowToStep", position: 3, name: "Build your college list", text: "Use the AI counselor to build a balanced reach/target/safety list. Get essay feedback, supplement guides, and scholarship matches tailored to your profile." },
      ],
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${APP_URL}/#software`,
      name: "AdmitPath",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      url: APP_URL,
      description:
        "College admissions counseling platform that scores student profiles across 7 dimensions and generates a prioritized action plan.",
      featureList: [
        "7-dimension profile scoring",
        "AI college essay feedback",
        "AI counselor chat",
        "College list builder",
        "Personalized action plan",
        "Interview prep",
        "Structured admissions planning tools",
        "100+ structured college records",
        "Supplemental essay guidance",
        "Net price calculator with IPEDS data",
        "Activities list optimizer",
        "Essay brainstorm generator",
        "College fit quiz",
        "Scholarship match finder",
        "Florida-specific admissions guidance",
        "PDF export for parents and counselors",
      ],
      offers: [
        {
          "@type": "Offer",
          name: "Free",
          price: "0",
          priceCurrency: "USD",
          url: `${APP_URL}/pricing`,
          description:
            "Free plan — 5 profile analyses, 5 essay reviews, 5 counselor chat messages, and up to 8 saved colleges.",
          availability: "https://schema.org/InStock",
          category: "Free",
        },
        {
          "@type": "Offer",
          name: "Pro",
          price: "19.99",
          priceCurrency: "USD",
          url: `${APP_URL}/pricing`,
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "19.99",
            priceCurrency: "USD",
            billingDuration: "P1M",
            unitText: "MONTH",
          },
          description: "Profile analyses, all 7 scoring dimensions, action plan, essay feedback with line edits, college list builder, and AI counselor chat without the Free-plan caps.",
          availability: "https://schema.org/InStock",
        },
      ],
    },
  ],
};

// Force all pages to be server-rendered at request time instead of statically
// generated at build time. This prevents prerender errors from components that
// require runtime context (Clerk auth, environment-specific config, etc.).
// On Vercel, pages are still cached at the edge via ISR / stale-while-revalidate.
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const inner = (
    <html
      lang="en-US"
      suppressHydrationWarning
      className={`${inter.variable} ${lora.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Preconnect to third-party origins that block FCP/LCP. Order
            matters: Clerk auth widget paints first on signed-out landing,
            Stripe loads on /pricing + checkout, fonts ship via next/font
            but the gstatic origin still benefits from preconnect, Vercel
            Analytics is best-effort. dns-prefetch is a hint-only fallback
            for browsers that ignore preconnect. */}
        {/* Clerk preconnect removed — using Google OAuth now */}
        <link rel="preconnect" href="https://js.stripe.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.stripe.com" />
        <link rel="dns-prefetch" href="https://api.groq.com" />
        <link rel="dns-prefetch" href="https://api.cerebras.ai" />
        <link rel="dns-prefetch" href="https://api.vercel-insights.com" />
        {/* OpenSearch description: lets users add AdmitPath to their browser
            address bar / search providers. Tiny file, but it's a discoverable
            "yes, we're a real product" signal Edge/Firefox/Safari surface. */}
        <link rel="author" href="/about" />
        <link
          rel="search"
          type="application/opensearchdescription+xml"
          title="AdmitPath"
          href="/opensearch.xml"
        />
        {/* RSS feed for the blog. Standard discoverability — RSS readers
            and Feedly-style aggregators auto-detect via this link tag. */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="AdmitPath Blog"
          href="/blog/feed.xml"
        />
        {/* Google Search Console verification — env-driven so it can be filled
            after registering the property without a code change. Also accepts a
            DNS-TXT verification as an alternative. */}
        {process.env.GOOGLE_SITE_VERIFICATION ? (
          <meta name="google-site-verification" content={process.env.GOOGLE_SITE_VERIFICATION} />
        ) : null}
        {/* Bing Webmaster Tools verification — required for ChatGPT Search visibility.
            Per SEO playbook: "ChatGPT Search uses Bing's index. If AdmitPath is not
            in Bing, ChatGPT will never cite it." Fill after registering at
            bing.com/webmasters */}
        {process.env.BING_VERIFICATION ? (
          <meta name="msvalidate.01" content={process.env.BING_VERIFICATION} />
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
      </head>
      <body data-canonical-url={APP_URL.replace(/^https?:\/\//, "")}>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#4A6FA5] focus:text-white focus:font-semibold focus:text-sm">Skip to main content</a>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <LenisProvider>
          <ToastProvider>
            <div id="main">{children}</div>
            <CommandPalette />
            <ShortcutsProvider />
            {/* CounselorWidget removed — chat accessible via /counselor page instead */}
            <CookieBanner />
            <ConsentAnalytics />
          </ToastProvider>
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );

  return inner;
}
