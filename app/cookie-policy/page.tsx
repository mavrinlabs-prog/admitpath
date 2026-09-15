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
          <li><strong>Session cookie</strong> &mdash; keeps you signed in</li>
          <li><strong>CSRF token</strong> &mdash; protects against cross-site request forgery</li>
          <li><strong>Cookie consent</strong> &mdash; remembers your cookie preferences</li>
          <li><strong>Theme preference</strong> &mdash; light or dark mode selection</li>
        </ul>

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
          Last updated: May 2026
        </p>
      </div>
    </MarketingLayout>
  );
}
