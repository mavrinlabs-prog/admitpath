import type { Metadata } from "next";
import { HelpCircle, ShieldCheck } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { Section } from "@/components/marketing/Section";
import { COLLEGES } from "@/data/colleges";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Pricing FAQ — Billing & Plans",
  description:
    "Honest answers to every pricing question we get: how Free vs Pro differ, refund policy, cancellation, family billing, and student verification.",
  alternates: { canonical: `${BASE}/pricing-faq` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Pricing FAQ — Billing, Refunds, Plans",
    description: "Honest answers to every pricing question: Free vs Pro, refund policy, cancellation, and billing.",
    url: `${BASE}/pricing-faq`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Pricing+FAQ&subtitle=Billing+%C2%B7+refunds+%C2%B7+cancellation`, width: 1200, height: 630, alt: "AdmitPath Pricing FAQ" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Pricing FAQ — Billing, Refunds, Plans", description: "Honest answers: Free vs Pro, refunds, cancellation.", images: [`${BASE}/api/og?title=Pricing+FAQ&subtitle=Billing+%C2%B7+refunds+%C2%B7+cancellation`] },
};

type SectionType = { name: string; id: string; faqs: { q: string; a: string }[] };

const SECTIONS: SectionType[] = [
  {
    name: "Plans and what's included",
    id: "plans",
    faqs: [
      {
        q: "Is AdmitPath actually free? What's the catch?",
        a: `The Free plan is genuinely free. You get 5 profile analyses, 5 essay feedback runs, 5 counselor chat messages, and up to 8 saved colleges. Public tools like deadlines, glossary, FAQ, and calculators stay open to everyone. The free plan never expires — it is usage-capped, not time-capped.`,
      },
      {
        q: "What does Pro ($19.99/mo) include?",
        a: "Pro removes the Free-plan caps for profile analyses, essay feedback, counselor chat, and college saves. It also includes the current interview practice, personalized planning, progress history, and college-list tools.",
      },
      {
        q: "Can I switch between plans?",
        a: "Yes. Upgrade from Free to Pro instantly. Manage your subscription through the Stripe Customer Portal. You keep access until the end of the billing period, then revert to Free.",
      },
      {
        q: "How do I get started?",
        a: "The Free plan uses Google sign-in and does not require a payment card. Upgrade to Pro when you are ready to remove the Free-plan usage caps.",
      },
    ],
  },
  {
    name: "Billing and renewal",
    id: "billing",
    faqs: [
      {
        q: "When am I charged?",
        a: "On the date you upgrade to a paid plan, then on the same date each month thereafter. Stripe sends a receipt to your email after every charge.",
      },
      {
        q: "Can I cancel at any time?",
        a: "Yes. Manage or cancel your monthly Pro subscription from billing settings. You keep Pro access through the end of the current billing period.",
      },
      {
        q: "Will my price ever go up?",
        a: "Locked-in pricing for the duration of your subscription. If we change pricing for new customers, existing customers stay on the price they signed up at unless they cancel and re-subscribe.",
      },
      {
        q: "Can a parent pay for a student's account?",
        a: "Yes. The student creates their own account, then a parent can pay using their card on the student's account. We do not require billing email and account email to match. Most families do this. Parental access to the account itself is the student's choice.",
      },
    ],
  },
  {
    name: "Refunds and cancellation",
    id: "refunds",
    faqs: [
      {
        q: "What's the refund policy?",
        a: "Manage your subscription from billing settings. You keep full access through the end of your billing period. If you have a billing issue, email maestro.committee@gmail.com with your account email and we'll sort it out within 24 hours.",
      },
      {
        q: "How do I cancel?",
        a: "From your account settings → Billing → Manage subscription. This opens the Stripe Customer Portal where you can cancel in one click. Your access continues until the end of the billing period; no further charges. We do not gate cancellation behind a phone call.",
      },
      {
        q: "What happens to my data if I cancel?",
        a: "Your account converts to Free. All your data (profile, essays, college list, score history) is preserved — you can return anytime. If you delete your account entirely (also one click), everything is permanently removed within 30 days per GDPR Article 17.",
      },
      {
        q: "I forgot to cancel before the renewal — can I still get a refund?",
        a: "Email maestro.committee@gmail.com within 7 days of the renewal charge and we'll refund the renewal in full. We don't try to keep your money on a renewal you didn't intend.",
      },
    ],
  },
  {
    name: "Eligibility and student verification",
    id: "eligibility",
    faqs: [
      {
        q: "Who is AdmitPath for?",
        a: `Primarily U.S. high school students applying to four-year U.S. colleges. The chances calculator covers ${COLLEGES.length} schools, mostly U.S. selective and flagship schools. International applicants applying to U.S. colleges can use it; the school-specific data is U.S.-only for now.`,
      },
      {
        q: "Is there a student discount?",
        a: "AdmitPath Pro is $19.99/month. We do not currently offer an additional student discount. Check the pricing page for the current Free and Pro entitlements.",
      },
      {
        q: "Do you offer financial aid for the subscription?",
        a: "Yes. The Free plan covers the most-asked-for features (profile score, college list builder, all public guides). For students who need Pro features and have demonstrated financial need (Pell-eligible families), email maestro.committee@gmail.com with proof of FAFSA EFC ≤ $5,000 and we'll comp Pro for the year.",
      },
      {
        q: "Can a school or counselor buy AdmitPath for multiple students?",
        a: "Yes. We have an Educator plan for high schools and counseling organizations — one bulk seat license covers all your students. Email maestro.committee@gmail.com with your school name and student count for pricing.",
      },
    ],
  },
  {
    name: "Privacy and security",
    id: "privacy",
    faqs: [
      {
        q: "Will my application data be sold or shared?",
        a: "Never. We don't sell user data. We don't share it with third parties for marketing. Your essays, scores, and application data are encrypted at rest, accessible only to you and the AdmitPath systems that scored them. See /security for the full posture.",
      },
      {
        q: "Will my essays be used to train AI models?",
        a: "Training-data collection is off by default. If you explicitly enable product-improvement consent in Settings, selected analyses and feedback may be stored after direct identifiers are removed. AI requests are processed by the providers described in our Privacy Policy.",
      },
      {
        q: "Can colleges see my AdmitPath account?",
        a: "No. AdmitPath is not connected to any college's admissions system. Your scores and analyses are private to you. We do not share data with admissions offices.",
      },
      {
        q: "What happens to my data when I delete my account?",
        a: "Permanently deleted within 30 days, including database records, encrypted backups, and any cached LLM-side context. We comply with GDPR Article 17 (Right to Erasure) and CCPA. Confirmation email sent on completion.",
      },
    ],
  },
];

const ALL_FAQS = SECTIONS.flatMap((s) => s.faqs);

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/pricing-faq#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Pricing", item: `${BASE}/pricing` },
        { "@type": "ListItem", position: 3, name: "Pricing FAQ", item: `${BASE}/pricing-faq` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/pricing-faq#page`,
      url: `${BASE}/pricing-faq`,
      name: "Pricing FAQ — Billing, Refunds, Cancellation, Plans",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/pricing-faq#breadcrumb` },
      inLanguage: "en-US",
      mainEntity: { "@id": `${BASE}/pricing-faq#faq` },
    },
    {
      "@type": "FAQPage",
      "@id": `${BASE}/pricing-faq#faq`,
      mainEntity: ALL_FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function PricingFAQPage() {
  return (
    <MarketingLayout
      eyebrow="Pricing"
      title="Pricing FAQ"
      description={`Honest answers to every billing, refund, and plan question we get. ${ALL_FAQS.length} questions across ${SECTIONS.length} categories.`}
      backHref="/pricing"
      backLabel="Back to pricing"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Trust callout */}
      <div
        className="mb-12 flex items-start gap-3 rounded-xl border p-4"
        style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
      >
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "#16A34A" }} />
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          <span className="font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Our pricing promise:
          </span>{" "}
          One-click cancel via Stripe Customer
          Portal, no price increases on existing subscribers, and a
          financial-aid path for Pell-eligible students.
        </p>
      </div>

      {/* Quick nav */}
      <nav aria-label="FAQ sections" className="mb-12 flex flex-wrap gap-1.5">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded-full border px-3 py-1 text-[12px] font-medium transition-colors hover:border-[color:#4A6FA5]"
            style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
          >
            {s.name}
          </a>
        ))}
      </nav>

      {/* Sections */}
      {SECTIONS.map((section) => (
        <Section key={section.id} title={section.name} Icon={HelpCircle}>
          <div id={section.id} className="scroll-mt-24 space-y-4">
            {section.faqs.map((f, i) => (
              <details
                key={i}
                className="group dl-card-hover rounded-xl border p-4 transition-colors hover:border-[color:var(--dl-text-muted, #5A6275)]"
                style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
              >
                <summary
                  className="cursor-pointer list-none text-[15px] font-semibold flex items-start justify-between gap-3"
                  style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-instrument-sans)" }}
                >
                  <span className="flex-1">{f.q}</span>
                  <span
                    className="shrink-0 text-[18px] leading-none transition-transform group-open:rotate-45"
                    aria-hidden
                    style={{ color: "var(--dl-text-muted, #5A6275)" }}
                  >
                    +
                  </span>
                </summary>
                <p
                  className="mt-3 text-[14px] leading-relaxed"
                  style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}
                >
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </Section>
      ))}

      {/* CTA */}
      <MarketingCTA
        headline="Still have a question?"
        description="Start with the Free plan. Upgrade anytime."
        buttonText="Start with the Free plan"
      />
    </MarketingLayout>
  );
}
