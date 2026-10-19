import type { Metadata } from "next";
import Link from "next/link";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Privacy Policy — Data Protection Practices",
  description:
    "How AdmitPath collects, uses, shares, and protects account, profile, billing, analytics, and AI request data.",
  alternates: { canonical: `${BASE}/privacy` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Privacy Policy — AdmitPath",
    description: "How AdmitPath collects, uses, and protects your data. We never sell your information.",
    url: `${BASE}/privacy`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Privacy+Policy&subtitle=Data+protection+practices`, width: 1200, height: 630, alt: "AdmitPath Privacy Policy" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Privacy Policy — AdmitPath", description: "How AdmitPath protects your data. We never sell your information.", images: [`${BASE}/api/og?title=Privacy+Policy&subtitle=Data+protection+practices`] },
};

const privacySchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${BASE}/privacy#page`,
      url: `${BASE}/privacy`,
      name: "Privacy Policy — AdmitPath",
      isPartOf: { "@id": `${BASE}/#website` },
      inLanguage: "en-US",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Privacy Policy", item: `${BASE}/privacy` },
      ],
    },
  ],
};

// LEGAL REVIEW NEEDED (2026-10-18): FERPA/COPPA/state student-privacy,
// retention periods, and processor list must be confirmed by counsel and
// against current vendor contracts before publication is relied upon.
const sections = [
  {
    h: "1. What we collect",
    p: "Account data from Google sign-in (name, email, profile image, Google account ID). Content you enter or upload: grades, test scores, activities, awards, courses, essays, college lists, uploaded resumes (PDF, DOCX, TXT — we extract the text and do not keep the original file), and counselor-chat messages. Billing data is collected by Stripe; we receive your Stripe customer and subscription IDs, never full card numbers. School inquiry forms collect contact details you provide.",
  },
  {
    h: "2. How we use it",
    p: "To provide analyses, essay feedback, planning tools, the AI counselor, billing, support, security, and abuse prevention. The AI counselor uses your saved profile, plan level, activity counts (for example how many essays you have saved), and the page you opened it from to tailor answers. We do not sell personal information or use it for third-party advertising.",
  },
  {
    h: "3. AI model providers",
    p: "Relevant profile, essay, or chat content may be sent to Groq, Cerebras, and (when configured) Anthropic to generate responses. Providers process requests under their own terms. Avoid entering sensitive information a feature does not need (for example health, disciplinary, or immigration details).",
  },
  {
    h: "4. Anti-abuse signals",
    p: "To prevent duplicate accounts and referral abuse we store a normalized form of your email, a random device token in an httpOnly cookie (we store only a hash of it), and a salted hash of your IP address at sign-up. We do not collect hardware identifiers such as MAC addresses and do not use browser fingerprinting. These signals are used only for security review.",
  },
  {
    h: "5. Referrals",
    p: "If you join through a referral link we record which account referred you, the status of your discount, and whether the referrer received a reward. The referrer does not see your profile, essays, or scores.",
  },
  {
    h: "6. Cookies & analytics",
    p: "Essential cookies keep you signed in, protect OAuth sign-in, store referral attribution (30 days), and the anti-abuse device token. Analytics load only after consent. See the Cookie Policy for the full list.",
  },
  {
    h: "7. Students, schools, FERPA and COPPA",
    p: "AdmitPath is for students 13 and older and is not directed to children under 13. Individual students use AdmitPath directly; we are not acting on behalf of a school unless a written agreement says so. Where a school or district contracts with us, student records are handled under that agreement and applicable law, including FERPA and state student-privacy laws. Do not upload other students' records.",
  },
  {
    h: "8. Storage, retention, and providers",
    p: "Data is stored in our Postgres database and the app is hosted on Vercel. Resend sends transactional and consented emails. We keep account data while your account is active and delete it after an account-deletion request, except records we must retain for billing, tax, security, or legal reasons.",
  },
  {
    h: "9. Your rights: access, export, deletion",
    p: "Export your data or delete your account from Settings at any time. You can also email maestro.committee@gmail.com; we respond within 30 days. Depending on where you live (for example California), you may have additional rights to know, correct, or delete personal information.",
  },
  {
    h: "10. Optional product-improvement data",
    p: "Training-data collection is off by default. If you opt in under Settings, selected de-identified analyses and feedback may be used to improve AdmitPath. You can withdraw consent for future collection at any time.",
  },
  {
    h: "11. Changes and contact",
    p: "We will update the effective date for any change and email subscribers about material changes. Questions: maestro.committee@gmail.com.",
  },
];

export default function PrivacyPage() {
  return (
    <MarketingLayout
      eyebrow={`Legal · ${new Date("2026-10-18").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
      title="Privacy Policy"
      description="How AdmitPath collects, uses, and protects your data. We never sell your information."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacySchema) }}
      />

      <div className="space-y-8">
        {sections.map((s) => (
          <section
            key={s.h}
            className="dl-card-hover rounded-xl border p-5"
            style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)" }}
          >
            <h2
              className="text-base font-bold mb-2"
              style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
            >
              {s.h}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              {s.p}
            </p>
          </section>
        ))}
      </div>

      <div className="mt-12 pt-6 border-t flex flex-wrap gap-4" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
        <Link href="/terms" className="text-sm font-medium" style={{ color: "#4A6FA5" }}>
          Terms of Service →
        </Link>
        <Link href="/security" className="text-sm font-medium" style={{ color: "#4A6FA5" }}>
          Security & Privacy →
        </Link>
        <Link href="/sign-up" className="text-sm font-medium" style={{ color: "#4A6FA5" }}>
          Create your free account →
        </Link>
      </div>
    </MarketingLayout>
  );
}
