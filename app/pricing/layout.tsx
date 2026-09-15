import type { Metadata } from "next";

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

const pricingJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "AdmitPath",
  description:
    "College admissions counseling: 7-dimension profile scoring, essay feedback, AI counselor chat, and a prioritized action plan.",
  brand: { "@type": "Brand", name: "AdmitPath" },
  offers: [
    {
      "@type": "Offer",
      name: "Free",
      price: "0",
      priceCurrency: "USD",
      url: `${APP_URL}/pricing`,
      description:
        "Free plan — 5 profile analyses, 5 essay reviews, 5 counselor chat messages, 8 saved colleges.",
      availability: "https://schema.org/InStock",
    },
    {
      "@type": "Offer",
      name: "Pro",
      price: "19.99",
      priceCurrency: "USD",
      url: `${APP_URL}/pricing?plan=pro`,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "19.99",
        priceCurrency: "USD",
        billingDuration: "P1M",
        unitText: "MONTH",
      },
      description:
        "Profile analyses, essay feedback, AI counselor chat, personalized planning, progress history, and college-list tools without the Free-plan caps.",
      availability: "https://schema.org/InStock",
    },
  ],
};

/**
 * FAQPage schema mirrors the pricingFAQs array on the page itself. Google
 * uses this to render rich-result Q&A boxes under the pricing URL. Keep
 * the questions/answers in sync if either changes — this is a verbatim
 * copy of the on-page FAQ.
 */
const pricingFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${APP_URL}/pricing#faq`,
  mainEntity: [
    {
      "@type": "Question",
      name: "What does the Free plan include?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sign up with just an email. You get 5 profile analyses, 5 essay reviews, 5 counselor chat messages, and up to 8 saved colleges — no time limit.",
      },
    },
    {
      "@type": "Question",
      name: "What does Pro include?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pro removes the Free-plan caps for analyses, essay feedback, counselor chat, and college saves, and includes the current personalized planning tools.",
      },
    },
    {
      "@type": "Question",
      name: "How does the Free plan work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Free plan has no time limit and includes 5 analyses, 5 essay reviews, 5 counselor chat messages, and 8 saved colleges. Pro is a monthly subscription and can be canceled anytime.",
      },
    },
    {
      "@type": "Question",
      name: "How do I manage my subscription?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Manage your Pro subscription directly from your billing settings. You keep access until the end of the billing period.",
      },
    },
    {
      "@type": "Question",
      name: "What happens when I hit my Free plan limits?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You'll see a paywall with the option to upgrade. Your data, college list, and past scores are preserved — nothing is deleted if you stay on the Free plan.",
      },
    },
    {
      "@type": "Question",
      name: "Is my payment info stored on AdmitPath's servers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. All payments are processed by Stripe. AdmitPath never touches your card number — only a Stripe customer ID is stored in our database.",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "Pricing — Free + Pro $19.99/mo",
  description:
    "AdmitPath pricing: Free (5 analyses, 5 essays, 5 chat, and 8 saved colleges) or Pro at $19.99/month without those Free-plan caps.",
  alternates: { canonical: `${APP_URL}/pricing` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "AdmitPath Pricing — Free + Pro $19.99/mo",
    description: "AI college admissions counseling. Start free — Pro $19.99/mo.",
    url: `${APP_URL}/pricing`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [
      {
        url: `${APP_URL}/api/og?title=Simple%2C+transparent+pricing&subtitle=Free+%C2%B7+Pro+%2419.99%2Fmo`,
        width: 1200,
        height: 630,
        alt: "AdmitPath pricing — Free and Pro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@admitpath",
    title: "AdmitPath Pricing — Free + Pro $19.99/mo",
    description: "AI college admissions counseling. Start free — Pro $19.99/mo.",
    images: [`${APP_URL}/api/og?title=Simple%2C+transparent+pricing&subtitle=Free+%C2%B7+Pro+%2419.99%2Fmo`],
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Page-level Product/Offer JSON-LD so Google can surface the
          pricing card in SERP rich results. The root layout's
          SoftwareApplication offers cover the homepage; this one is
          targeted at the pricing URL specifically. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingFaqJsonLd) }}
      />
      {children}
    </>
  );
}
