import type { Metadata } from "next";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { buildPageSchema } from "@/lib/seo-config";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app")
  .trim()
  .replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description:
    "AdmitPath is committed to digital accessibility. Our college admissions tools are designed for all students, including those who use assistive technologies.",
  alternates: { canonical: `${BASE}/accessibility` },
  robots: { index: true, follow: true },
};

export default function AccessibilityPage() {
  const schema = buildPageSchema("guide", {
    url: "/accessibility",
    title: "Accessibility Statement",
    description: metadata.description as string,
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Accessibility", url: "/accessibility" },
    ],
  });

  return (
    <MarketingLayout
      eyebrow="Legal"
      title="Accessibility Statement"
      description="AdmitPath is committed to making college admissions tools accessible to every student."
      maxWidth="max-w-3xl"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="prose prose-sm max-w-none" style={{ color: "var(--dl-text-secondary)" }}>
        <h2 style={{ color: "var(--dl-text-primary)" }}>Our Commitment</h2>
        <p>
          AdmitPath is committed to ensuring digital accessibility for people with
          disabilities. We continually improve the user experience for everyone and
          apply the relevant accessibility standards.
        </p>

        <h2 style={{ color: "var(--dl-text-primary)" }}>Standards</h2>
        <p>
          We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1
          at Level AA. These guidelines explain how to make web content more
          accessible for people with disabilities and more user-friendly for
          everyone.
        </p>

        <h2 style={{ color: "var(--dl-text-primary)" }}>Measures We Take</h2>
        <ul>
          <li>Semantic HTML for screen readers and assistive technologies</li>
          <li>Skip-to-main-content link on every page</li>
          <li>Keyboard-navigable interface throughout the application</li>
          <li>Sufficient color contrast ratios (minimum 4.5:1 for text)</li>
          <li>Alt text on all meaningful images</li>
          <li>ARIA labels on interactive elements</li>
          <li>Responsive design that works across screen sizes</li>
          <li>Focus indicators visible on all interactive elements</li>
        </ul>

        <h2 style={{ color: "var(--dl-text-primary)" }}>Known Limitations</h2>
        <p>
          Some interactive tools (such as the AI counselor chat and essay feedback
          editor) may have accessibility gaps we are actively working to resolve. We
          test with screen readers (VoiceOver, NVDA) and keyboard-only navigation
          on a regular basis.
        </p>

        <h2 style={{ color: "var(--dl-text-primary)" }}>Feedback</h2>
        <p>
          We welcome your feedback on the accessibility of AdmitPath. If you
          encounter accessibility barriers, please contact us at{" "}
          <a
            href="mailto:maestro.committee@gmail.com"
            style={{ color: "var(--dl-brand)" }}
          >
            maestro.committee@gmail.com
          </a>
          . We take accessibility reports seriously and will respond within 5
          business days.
        </p>

        <p className="mt-8 text-xs" style={{ color: "var(--dl-text-muted)" }}>
          Last updated: May 2026
        </p>
      </div>
    </MarketingLayout>
  );
}
