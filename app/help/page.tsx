"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ArrowRight, Mail, MessageCircle } from "lucide-react";

const faqCategories = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "How do I start using AdmitPath?",
        a: "Sign up free at admitpath.com. The free plan includes 5 college analyses, 5 essay reviews, 5 AI counselor chats, and 8 college profiles.",
      },
      {
        q: "What does AdmitPath do?",
        a: "AdmitPath is a smart college admissions platform. It scores your profile across 7 dimensions (academic rigor, leadership, awards, activity depth, spike, essay quality, recommendations), matches you to colleges, reviews your essays, and provides AI counselor chat.",
      },
      {
        q: "Do I need to install anything?",
        a: "No. AdmitPath runs entirely in your browser on any device -- desktop, tablet, or phone. No downloads required.",
      },
    ],
  },
  {
    category: "College Matching & Analysis",
    questions: [
      {
        q: "How does the 7-dimension scoring work?",
        a: "AdmitPath evaluates your profile across 7 calibrated dimensions: Academic Rigor, Leadership, Awards, Activity Depth, Spike (distinctive strength), Essay Quality, and Recommendations. Each dimension scores 0-100 against real admissions standards -- no grade inflation.",
      },
      {
        q: "How accurate are the admissions predictions?",
        a: "Predictions are based on publicly available admissions data, acceptance rates, and historical trends. They are directional estimates -- actual admissions decisions depend on many factors including holistic review, institutional priorities, and yield management.",
      },
      {
        q: "How does essay feedback work?",
        a: "Upload or paste your essay, and the AI evaluator scores it across 6 dimensions with specific line-by-line feedback. It identifies strengths, weaknesses, and concrete revision suggestions -- not generic advice.",
      },
      {
        q: "Can I compare colleges?",
        a: "Yes. The comparison tool lets you compare admissions stats, financial aid, outcomes, and fit metrics side-by-side for any colleges in the database.",
      },
    ],
  },
  {
    category: "Pricing & Billing",
    questions: [
      {
        q: "Is there a free plan?",
        a: "Yes. The free plan includes 5 analyses, 5 essay reviews, 5 AI counselor chats, and 8 college profiles. No time limit.",
      },
      {
        q: "How much does Pro cost?",
        a: "$19.99/month. Pro removes the Free-plan caps for analyses, essay reviews, AI counselor chat, and college saves, and includes the current planning tools.",
      },
      {
        q: "How do I cancel?",
        a: "Go to Settings and cancel in one click. You keep access through the end of the billing period. No retention push, no hassle.",
      },
    ],
  },
  {
    category: "Account & Privacy",
    questions: [
      {
        q: "Is my data private?",
        a: "AdmitPath does not sell personal information. Signed Google OAuth sessions protect account access, Stripe hosts payment collection, and relevant content is shared with the service providers described in the Privacy Policy when needed to operate a feature.",
      },
      {
        q: "Can I delete my account?",
        a: "Yes. Use the account deletion control in Settings or contact maestro.committee@gmail.com. See the Privacy Policy for the current deletion timeframe and exceptions required by law or billing records.",
      },
      {
        q: "I forgot my password. How do I reset it?",
        a: "AdmitPath uses Google sign-in and does not store an AdmitPath password. Use Google's account recovery process if you cannot access your Google account.",
      },
    ],
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t first:border-t-0" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
      <button
        className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-[15px] font-semibold"
        style={{ color: "var(--dl-text-primary, #1B2030)" }}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={`help-answer-${index}`}
      >
        {q}
        <ChevronDown
          size={16}
          className={`flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          style={{ color: "var(--dl-text-muted, #8890A5)" }}
        />
      </button>
      {open && (
        <div
          id={`help-answer-${index}`}
          className="px-6 pb-4 text-[14.5px] leading-relaxed"
          style={{ color: "var(--dl-text-secondary, #454B5E)" }}
        >
          {a}
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  let questionIndex = 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            name: "AdmitPath Help Center",
            url: "https://admitpath.com/help",
            mainEntity: faqCategories.flatMap((cat) =>
              cat.questions.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: { "@type": "Answer", text: faq.a },
              }))
            ),
          }),
        }}
      />

      {/* Nav */}
      <nav aria-label="Primary" className="sticky top-0 z-50 border-b backdrop-blur-md" style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.8)" }}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>AdmitPath</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="text-sm" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Sign in</Link>
            <Link href="/sign-up">
              <button className="rounded-full px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: "#4A6FA5" }}>Start free</button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm" style={{ borderColor: "rgba(74,111,165,0.2)", backgroundColor: "rgba(74,111,165,0.06)", color: "#4A6FA5" }}>
            Help Center
          </div>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            How can we help?
          </h1>
          <p className="mx-auto max-w-lg text-lg" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Find answers to common questions about AdmitPath, college admissions analysis, pricing, and your account.
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-10">
          {faqCategories.map((cat) => (
            <div key={cat.category}>
              <h2 className="mb-4 text-lg font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{cat.category}</h2>
              <div className="overflow-hidden rounded-2xl border shadow-[0_1px_3px_rgba(0,0,0,0.04)]" style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}>
                {cat.questions.map((faq) => {
                  const idx = questionIndex++;
                  return <FAQItem key={faq.q} q={faq.q} a={faq.a} index={idx} />;
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact section */}
        <div className="mt-16 rounded-2xl border p-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]" style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}>
          <h2 className="mb-3 text-2xl font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Still have questions?
          </h2>
          <p className="mb-6" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            We typically respond within two business days.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="mailto:maestro.committee@gmail.com"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
              style={{ backgroundColor: "#4A6FA5" }}
            >
              <Mail size={16} /> Email us
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold"
              style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-primary, #1B2030)", background: "rgba(255,255,255,0.45)" }}
            >
              <MessageCircle size={16} /> Contact page
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-3xl p-12 text-center text-white" style={{ background: "linear-gradient(135deg, #4A6FA5, #2E4A6E)" }}>
          <h2 className="mb-4 text-3xl font-bold">
            Ready to find your best-fit colleges?
          </h2>
          <p className="mx-auto mb-8 max-w-md text-white/85">
            5 free analyses. 7-dimension scoring. Smart essay feedback. Pro $19.99/mo.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-bold shadow-[0_4px_14px_rgba(0,0,0,0.18)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(0,0,0,0.22)]"
            style={{ color: "#1B2030" }}
          >
            Get started free <ArrowRight size={16} />
          </Link>
        </div>
      </main>

      <footer className="border-t" style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}>
        <div className="mx-auto max-w-6xl px-6 py-6 text-center text-xs" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
          <p>&copy; {new Date().getFullYear()} AdmitPath. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
