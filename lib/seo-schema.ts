/**
 * SEO Schema generators for JSON-LD structured data.
 * Produces Article + EducationalOrganization + FAQ + BreadcrumbList + HowTo
 * per the SEO playbook's mandatory schema markup requirements.
 */

const BASE = (process.env.NEXT_PUBLIC_APP_URL || "https://admith.vercel.app").trim().replace(/\/+$/, "");
const YEAR = new Date().getFullYear();

type FaqItem = { question: string; answer: string };
type BreadcrumbItem = { name: string; url: string };

/** Organization schema — shared across all pages */
function organizationSchema() {
  return {
    "@type": "EducationalOrganization",
    "@id": `${BASE}/#organization`,
    name: "AdmitPath",
    url: BASE,
    logo: { "@type": "ImageObject", url: `${BASE}/apple-icon`, width: 180, height: 180 },
    description: "AI-assisted college planning for high school students, with 100+ structured college records, essay guidance, admissions worksheets, Florida-specific guidance, and scholarship planning tools.",
    foundingDate: "2025",
  };
}

/** FAQ schema from an array of Q&A pairs */
function faqSchema(items: FaqItem[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/** BreadcrumbList schema */
function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${BASE}${item.url}`,
    })),
  };
}

/** Article schema for content pages */
function articleSchema(opts: {
  headline: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  description?: string;
}) {
  const fullUrl = opts.url.startsWith("http") ? opts.url : `${BASE}${opts.url}`;
  return {
    "@type": "Article",
    "@id": `${fullUrl}#article`,
    headline: opts.headline,
    url: fullUrl,
    datePublished: opts.datePublished || `${YEAR}-01-01`,
    dateModified: opts.dateModified || new Date().toISOString().split("T")[0],
    publisher: { "@id": `${BASE}/#organization` },
    author: { "@id": `${BASE}/#founder` },
    isPartOf: { "@id": `${BASE}/#website` },
    mainEntityOfPage: { "@type": "WebPage", "@id": fullUrl },
    image: {
      "@type": "ImageObject",
      url: `${BASE}/api/og?title=${encodeURIComponent(opts.headline)}`,
      width: 1200,
      height: 630,
    },
    inLanguage: "en-US",
    ...(opts.description ? { description: opts.description } : {}),
  };
}

/** HowTo schema for guide pages */
function howToSchema(opts: {
  name: string;
  description: string;
  steps: string[];
}) {
  return {
    "@type": "HowTo",
    name: opts.name,
    description: opts.description,
    step: opts.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step,
      text: step,
    })),
  };
}

/** SoftwareApplication schema for worksheet pages */
function softwareSchema(opts: {
  name: string;
  description: string;
  features: string[];
}) {
  return {
    "@type": "SoftwareApplication",
    name: opts.name,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    url: BASE,
    description: opts.description,
    featureList: opts.features,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      url: `${BASE}/pricing`,
      description: "Free tier available",
      availability: "https://schema.org/InStock",
    },
  };
}

// ============================================================================
// Composite page schemas — one function per page type from the playbook
// ============================================================================

/** College Profile Page: Article + EducationalOrganization + FAQ + BreadcrumbList */
export function collegeProfileSchema(opts: {
  collegeName: string;
  slug: string;
  city: string;
  state: string;
  faq: FaqItem[];
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      articleSchema({
        headline: `How to Get Into ${opts.collegeName} in ${YEAR}`,
        url: `/colleges/${opts.slug}`,
        description: `Complete admissions guide for ${opts.collegeName}. Acceptance rate, SAT/ACT ranges, essay strategy, and what it takes to get in.`,
      }),
      {
        "@type": "CollegeOrUniversity",
        name: opts.collegeName,
        address: {
          "@type": "PostalAddress",
          addressLocality: opts.city,
          addressRegion: opts.state,
        },
      },
      organizationSchema(),
      faqSchema(opts.faq),
      breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Colleges", url: "/colleges" },
        { name: opts.collegeName, url: `/colleges/${opts.slug}` },
      ]),
    ],
  };
}

/** Essay Guide Page: Article + HowTo + FAQ + BreadcrumbList + EducationalOrganization
 *  Per SEO playbook Section 7 mandatory schema: Essay Guide Page needs all five types. */
export function essayGuideSchema(opts: {
  collegeName: string;
  slug: string;
  promptNumber?: number;
  faq: FaqItem[];
  steps: string[];
}) {
  const title = opts.promptNumber
    ? `How to Write the ${opts.collegeName} Prompt #${opts.promptNumber} Supplemental Essay (${YEAR})`
    : `How to Write the ${opts.collegeName} Supplemental Essays (${YEAR})`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      articleSchema({
        headline: title,
        url: `/colleges/${opts.slug}/essays`,
        description: `Step-by-step guide to writing supplemental essays for ${opts.collegeName}. Prompt analysis, brainstorm angles, composite sample, and common mistakes.`,
      }),
      organizationSchema(),
      howToSchema({
        name: title,
        description: `Step-by-step guide to writing supplemental essays for ${opts.collegeName}.`,
        steps: opts.steps,
      }),
      faqSchema(opts.faq),
      breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Colleges", url: "/colleges" },
        { name: opts.collegeName, url: `/colleges/${opts.slug}` },
        { name: "Essays", url: `/colleges/${opts.slug}/essays` },
      ]),
    ],
  };
}

/** Pillar Guide Page: Article + HowTo + FAQ + BreadcrumbList + EducationalOrganization
 *  Per SEO playbook Section 7: "Pillar Guide → Article + HowTo + FAQ + BreadcrumbList" */
export function pillarGuideSchema(opts: {
  title: string;
  slug: string;
  description: string;
  faq: FaqItem[];
  steps: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      articleSchema({
        headline: opts.title,
        url: `/guides/${opts.slug}`,
        description: opts.description,
      }),
      organizationSchema(),
      howToSchema({
        name: opts.title,
        description: opts.description,
        steps: opts.steps,
      }),
      faqSchema(opts.faq),
      breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Guides", url: "/guides" },
        { name: opts.title, url: `/guides/${opts.slug}` },
      ]),
    ],
  };
}

/** Worksheet Page: Article + SoftwareApplication + FAQ + BreadcrumbList */
export function worksheetSchema(opts: {
  name: string;
  slug: string;
  description: string;
  features: string[];
  faq: FaqItem[];
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      articleSchema({
        headline: opts.name,
        url: `/worksheets/${opts.slug}`,
        description: opts.description,
      }),
      softwareSchema({
        name: opts.name,
        description: opts.description,
        features: opts.features,
      }),
      faqSchema(opts.faq),
      breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Worksheets", url: "/worksheets" },
        { name: opts.name, url: `/worksheets/${opts.slug}` },
      ]),
    ],
  };
}

/** Scholarship Page: Article + FAQ + BreadcrumbList */
export function scholarshipSchema(opts: {
  name: string;
  slug: string;
  amount: string;
  description: string;
  faq: FaqItem[];
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      articleSchema({
        headline: `${opts.name} Application Guide (${YEAR})`,
        url: `/scholarships/${opts.slug}`,
        description: opts.description,
      }),
      {
        "@type": "MonetaryGrant",
        name: opts.name,
        amount: { "@type": "MonetaryAmount", value: opts.amount },
        funder: { "@type": "Organization", name: opts.name.split(" ")[0] },
      },
      faqSchema(opts.faq),
      breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Scholarships", url: "/scholarships" },
        { name: opts.name, url: `/scholarships/${opts.slug}` },
      ]),
    ],
  };
}

/** Course schema for educational course pages */
export function generateCourseSchema(opts: {
  name: string;
  description: string;
  url: string;
  provider?: string;
  faq?: FaqItem[];
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Course",
        name: opts.name,
        description: opts.description,
        url: opts.url.startsWith("http") ? opts.url : `${BASE}${opts.url}`,
        provider: {
          "@type": "EducationalOrganization",
          name: opts.provider || "AdmitPath",
          url: BASE,
        },
        isAccessibleForFree: true,
        inLanguage: "en-US",
      },
      organizationSchema(),
      ...(opts.faq && opts.faq.length > 0 ? [faqSchema(opts.faq)] : []),
      breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: opts.name, url: opts.url },
      ]),
    ],
  };
}

/**
 * Event schema — per crawl analysis: CEG uses Event on 145 pages (webinars),
 * Niche uses Event on 3,495 pages (open houses, deadlines).
 * Use on deadline pages, webinar pages, and application timeline pages.
 */
export function eventSchema(opts: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  url: string;
  faq?: FaqItem[];
}) {
  const fullUrl = opts.url.startsWith("http") ? opts.url : `${BASE}${opts.url}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Event",
        name: opts.name,
        description: opts.description,
        startDate: opts.startDate,
        ...(opts.endDate ? { endDate: opts.endDate } : {}),
        eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        ...(opts.location
          ? { location: { "@type": "VirtualLocation", url: opts.location } }
          : {}),
        organizer: { "@id": `${BASE}/#organization` },
        url: fullUrl,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
      },
      organizationSchema(),
      ...(opts.faq && opts.faq.length > 0 ? [faqSchema(opts.faq)] : []),
      breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Deadlines", url: "/deadlines" },
        { name: opts.name, url: opts.url },
      ]),
    ],
  };
}

/**
 * Review/AggregateRating schema — per crawl analysis: Niche uses Review on
 * 9,686 pages (their moat). Use on testimonial pages when reviews exist.
 */
export function reviewSchema(opts: {
  itemName: string;
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
}) {
  return {
    "@type": "AggregateRating",
    itemReviewed: {
      "@type": "SoftwareApplication",
      name: opts.itemName,
    },
    ratingValue: opts.ratingValue,
    reviewCount: opts.reviewCount,
    bestRating: opts.bestRating ?? 5,
    worstRating: 1,
  };
}

/** Florida Page: Article + FAQ + BreadcrumbList */
export function floridaPageSchema(opts: {
  title: string;
  slug: string;
  city: string;
  faq: FaqItem[];
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      articleSchema({
        headline: opts.title,
        url: `/florida/${opts.slug}`,
        description: `College admissions guide for ${opts.city} high school students.`,
      }),
      faqSchema(opts.faq),
      breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Florida", url: "/florida/admissions-guide" },
        { name: opts.city, url: `/florida/${opts.slug}` },
      ]),
    ],
  };
}
