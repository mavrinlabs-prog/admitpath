// LEGAL REVIEW NEEDED (2026-10-18): confirm cookie inventory and consent model per jurisdiction.
import type { Metadata } from "next";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { buildPageSchema } from "@/lib/seo-config";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app")
  .trim()
  .replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How AdmitPath uses cookies. Essential cookies for authentication and preferences, analytics cookies with consent, and how to manage your choices.",
  alternates: { canonical: `${BASE}/cookie-policy` },
  robots: { index: true, follow: true },
};

export default function CookiePolicyPage() {
  const schema = buildPageSchema("guide", {
    url: "/cookie-policy",
    title: "Cookie Policy",
    description: metadata.description as string,
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Cookie Policy", url: "/cookie-policy" },
    ],
  });

  return (
    <MarketingLayout
      eyebrow="Legal"
      title="Cookie Policy"
      description="How AdmitPath uses cookies and how you can manage your preferences."
      maxWidth="max-w-3xl"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="prose prose-sm max-w-none" style={{ color: "var(--dl-text-secondary)" }}>
        <h2 style={{ color: "var(--dl-text-primary)" }}>What Are Cookies</h2>
        <p>
          Cookies are small text files stored on your device when you visit a
          website. They help the site remember your preferences and understand how
          you use the service.
        </p>

        <h2 style={{ color: "var(--dl-text-primary)" }}>Essential Cookies</h2>
        <p>
          These cookies are required for AdmitPath to function. They handle
          authentication, session management, and security. You cannot opt out of
          essential cookies because the application will not work without them.
        </p>
        <ul>
          <li><strong>session / session_user</strong> &mdash; signed, httpOnly cookies that keep you signed in (30 days)</li>
          <li><strong>oauth_state, oauth_return_to, oauth_email_consent</strong> &mdash; protect Google sign-in against forgery and remember where to return (10 minutes)</li>
          <li><strong>ref</strong> &mdash; referral attribution when you arrive from a friend&apos;s link (30 days)</li>
          <li><strong>ap_device</strong> &mdash; random, httpOnly device token used only to detect duplicate accounts and referral abuse (1 year; we store only a hash)</li>
          <li><strong>Cookie consent and theme</strong> &mdash; remember your choices</li>
        </ul>

        <h2 style={{ color: "var(--dl-text-primary)" }}>Browser storage</h2>
        <p>
          We use local and session storage (not cookies) for conveniences such as
          essay drafts saved on your device and how often a sign-up prompt has been
          shown, so we can limit it to once per session and once per week.
        </p>
        <h2 style={{ color: "var(--dl-text-primary)" }}>Analytics Cookies</h2>
        <p>
          With your consent, we use Vercel Analytics and Speed Insights to
          understand how students use AdmitPath. These cookies help us improve
          features that matter most. No analytics cookies are set until you click
          &ldquo;Accept&rdquo; on the cookie banner.
        </p>

        <h2 style={{ color: "var(--dl-text-primary)" }}>Third-Party Cookies</h2>
        <p>
          AdmitPath uses Stripe for payment processing. Stripe may set its own
          cookies during checkout. We do not control Stripe&apos;s cookies &mdash;
          see{" "}
          <a
            href="https://stripe.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--dl-brand)" }}
          >
            Stripe&apos;s privacy policy
          </a>{" "}
          for details.
        </p>

        <h2 style={{ color: "var(--dl-text-primary)" }}>Managing Cookies</h2>
        <p>
          You can manage cookie preferences through the cookie banner that appears
          on your first visit. You can also clear cookies at any time through your
          browser settings. Note that disabling essential cookies will prevent
          sign-in and core features from working.
        </p>

        <h2 style={{ color: "var(--dl-text-primary)" }}>CCPA / California Residents</h2>
        <p>
          AdmitPath does not sell personal information. Analytics data is used
          solely to improve the product. California residents may request deletion
          of their data by emailing{" "}
          <a
            href="mailto:maestro.committee@gmail.com"
            style={{ color: "var(--dl-brand)" }}
          >
            maestro.committee@gmail.com
          </a>
          .
        </p>

        <p className="mt-8 text-xs" style={{ color: "var(--dl-text-muted)" }}>
          Last updated: October 18, 2026
        </p>
      </div>
    </MarketingLayout>
  );
}
