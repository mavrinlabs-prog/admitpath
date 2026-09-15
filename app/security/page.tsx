import type { Metadata } from "next";
import { CreditCard, Database, KeyRound, Lock, Mail, ShieldCheck } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Section } from "@/components/marketing/Section";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: { absolute: "Security and Data Handling | AdmitPath" },
  description: "A factual overview of AdmitPath authentication, payments, data controls, AI processing, and current security limitations.",
  alternates: { canonical: `${BASE}/security` },
  robots: { index: true, follow: true },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${BASE}/security#page`,
  url: `${BASE}/security`,
  name: "Security and Data Handling",
  description: "Implemented security and data-handling controls for AdmitPath.",
  isPartOf: { "@id": `${BASE}/#website` },
  inLanguage: "en-US",
};

const rows = [
  {
    icon: Lock,
    title: "Authentication and sessions",
    body: "AdmitPath uses Google OAuth. After Google returns a verified account identifier and email, AdmitPath creates an HTTP-only, Secure, SameSite=Lax signed session cookie with a 30-day expiration. Production signing requires a dedicated secret of at least 32 characters.",
  },
  {
    icon: Database,
    title: "Stored account data",
    body: "Profile details, essays, analyses, college lists, and application tracking records are scoped to the authenticated user in Postgres. Account export and confirmed account deletion are available from Settings. Deleted records are filtered from normal authenticated reads.",
  },
  {
    icon: ShieldCheck,
    title: "Request safeguards",
    body: "State-changing API requests are checked for cross-site browser requests. Responses use a restrictive framing policy, MIME-sniffing protection, HSTS, a Content Security Policy, and no-store caching for APIs. Cost-bearing routes use per-account and per-IP throttles; distributed enforcement requires the configured Redis service.",
  },
  {
    icon: CreditCard,
    title: "Payments",
    body: "Subscription checkout and plan management are hosted by Stripe. AdmitPath stores Stripe customer and subscription identifiers, not card numbers. Webhook signatures are verified before subscription state is changed, and unknown prices do not grant paid access.",
  },
  {
    icon: KeyRound,
    title: "AI processing and email",
    body: "Text submitted for AI features is sent to the configured model provider to produce the requested result. Optional product email requires consent, and signed one-click unsubscribe links turn that consent off. See the Privacy Policy for the current provider and retention disclosures.",
  },
];

export default function SecurityPage() {
  return (
    <MarketingLayout
      eyebrow="Security and data handling"
      title="Implemented controls, without certification claims"
      description="This page describes the controls currently present in the application. AdmitPath does not claim its own SOC 2 certification, school-district SSO, MFA, FERPA certification, or an independently audited security program."
      maxWidth="max-w-4xl"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="space-y-10">
        {rows.map((row) => (
          <Section key={row.title} title={row.title} Icon={row.icon}>
            <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              {row.body}
            </p>
          </Section>
        ))}
      </div>
      <Section title="Report a security issue" Icon={Mail} description="Please do not include passwords, session cookies, API keys, or sensitive student records in the first message.">
        <a href="mailto:maestro.committee@gmail.com?subject=AdmitPath%20security%20report" className="dl-btn dl-btn-primary dl-btn-lg">
          Email the security contact
        </a>
      </Section>
    </MarketingLayout>
  );
}
