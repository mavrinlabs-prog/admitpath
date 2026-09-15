import type { Metadata } from "next";
import {
  Mail,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { Section } from "@/components/marketing/Section";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Acceptance Letter Decoder — Phrases Explained",
  description:
    "Decoded guide to college admission letters: acceptance, deferral, waitlist, rejection, and Likely Letters. What each phrase actually signals.",
  alternates: { canonical: `${BASE}/college-acceptance-letter-decoder` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Acceptance Letter Decoder — Phrases Explained",
    description: "What each admission letter phrase actually signals: acceptance, deferral, waitlist, rejection, Likely Letters.",
    url: `${BASE}/college-acceptance-letter-decoder`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Acceptance+Letter+Decoder&subtitle=What+each+phrase+signals`, width: 1200, height: 630, alt: "Acceptance Letter Decoder" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Acceptance Letter Decoder — Phrases Explained", description: "What each admission letter phrase signals: acceptance, deferral, waitlist.", images: [`${BASE}/api/og?title=Acceptance+Letter+Decoder&subtitle=What+each+phrase+signals`] },
};

const ACCEPTANCE_LANGUAGE = [
  {
    phrase: "We are delighted to inform you...",
    meaning: "Standard acceptance language. Universal across schools. Doesn't signal anything specific beyond admission.",
    signal: "Neutral acceptance.",
  },
  {
    phrase: "Likely Letter (Ivy League athletes)",
    meaning: "Sent in October-December to recruited Ivy athletes. Indicates you'll be admitted in RD round if your stats and academic engagement remain consistent. Not technically an admission letter — but functionally one.",
    signal: "Strong commitment from school. Plan for RD admit.",
  },
  {
    phrase: "Distinguished/Top Scholar admit",
    meaning: "Schools sometimes designate top admits with merit-aid attached. Indicates the school sees you as among their most-wanted admits.",
    signal: "School wants you. Aid likely strong. Yield management priority.",
  },
  {
    phrase: "Welcome to [School Name] Class of [Year]",
    meaning: "Standard celebratory language. No additional signal.",
    signal: "Neutral acceptance.",
  },
  {
    phrase: "We're pleased to offer you admission and a scholarship...",
    meaning: "Acceptance with merit aid attached. The merit aid amount tells you where you stand among admits — substantial merit signals you're among the top admits.",
    signal: "Strong fit. School wants you. Compare to other offers.",
  },
];

const DEFERRAL_LANGUAGE = [
  {
    phrase: "Your application has been deferred to Regular Decision review",
    meaning: "Standard deferral. School isn't admitting you in ED but isn't rejecting you either. You'll be reconsidered with the RD pool. Most deferred applicants are eventually rejected.",
    signal: "Borderline. Submit LOCI within 1-2 weeks. Reconfigure RD list.",
  },
  {
    phrase: "Deferred for further consideration",
    meaning: "Same as above, with slightly different wording. Same outcome.",
    signal: "Borderline. Same playbook as above.",
  },
  {
    phrase: "We are unable to offer you admission at this time, but...",
    meaning: "Soft rejection presented as deferral. The school is unlikely to admit you in RD; they're letting you down gently.",
    signal: "Read this as effective rejection. Plan accordingly.",
  },
];

const WAITLIST_LANGUAGE = [
  {
    phrase: "We are offering you a place on our waitlist",
    meaning: "School is interested but doesn't have a spot now. May admit you if other admits don't enroll. Typical waitlist admit rate: 5-15% at top private schools, 10-20% at LACs, 15-30% at mid-tier privates, highly variable at state flagships.",
    signal: "Borderline interest. Submit LOCI within 1-2 weeks if you'd attend if admitted. Commit to backup school by May 1.",
  },
  {
    phrase: "You have been placed on our waitlist for the [Year] entering class",
    meaning: "Same as above. Standard waitlist language.",
    signal: "Same playbook.",
  },
  {
    phrase: "We have placed you on our priority waitlist",
    meaning: "Some schools rank waitlists. Priority waitlist signals slightly stronger interest, but admission still depends on yield.",
    signal: "Slightly higher chance of admission than non-priority waitlist. Same playbook applies.",
  },
];

const REJECTION_LANGUAGE = [
  {
    phrase: "Unfortunately, we are unable to offer you admission",
    meaning: "Standard rejection. School has decided you won't be admitted. No further action will change this for the current cycle.",
    signal: "Final rejection. Move forward with other admits.",
  },
  {
    phrase: "After careful consideration, we are unable to offer you admission",
    meaning: "Same as above. The 'careful consideration' language is standard padding to soften the rejection.",
    signal: "Final rejection.",
  },
  {
    phrase: "We received many qualified applications and were unable to admit all...",
    meaning: "Same rejection. The 'many qualified applications' language is institutional softening, not signal.",
    signal: "Final rejection.",
  },
  {
    phrase: "We encourage you to consider applying as a transfer student",
    meaning: "School thinks you're qualified but couldn't admit this cycle. Transfer is a real path; this signals your application was competitive.",
    signal: "Strong rejection (no admit), but soft door open for transfer if you commit to a community college or other 4-year and want to transfer in 1-2 years.",
  },
];

const SIGNALS_BETWEEN_LINES = [
  {
    pattern: "Aid package included with admission",
    interpretation: "Strong yield management priority. School wants you and is investing in you. Compare aid carefully across schools.",
  },
  {
    pattern: "No aid package, just admission",
    interpretation: "School admitted you but isn't competing for you specifically. Standard admit. Submit FAFSA/CSS to receive package separately.",
  },
  {
    pattern: "Honors college admit included",
    interpretation: "Strong signal. School admitted you to their selective honors track, indicating you're among top admits academically.",
  },
  {
    pattern: "Scholarship committee will review separately",
    interpretation: "Admission first, scholarship decision pending. You're admitted; merit aid is a separate decision often made later.",
  },
  {
    pattern: "Specific program admit (e.g., 'admitted to BS/MD program')",
    interpretation: "Highly competitive separate admit. Distinguish this from general university admission.",
  },
  {
    pattern: "Pre-major or undecided admit",
    interpretation: "School admitted you to a general track, not your intended major. At admit-by-major schools, this can affect course access.",
  },
  {
    pattern: "Admission contingent on senior year grades",
    interpretation: "Standard for all admits. Schools see Final Report (May-June) and can rescind admits for severe grade drops or course drops.",
  },
];

const COMMON_MISREADS = [
  "Treating 'we encourage transfer' as serious encouragement to transfer. It's mostly institutional politeness; the real signal is 'rejected.' Transfer is a real path but rare.",
  "Reading 'After careful consideration' as evidence of long deliberation. It's standard rejection language across all schools.",
  "Assuming a 'priority waitlist' is dramatically better than regular waitlist. The advantage is small.",
  "Not reading deferral as effective rejection. Most deferred applicants are eventually rejected. Plan accordingly.",
  "Believing 'congratulatory mood' in the letter signals enthusiasm. All admit letters are enthusiastic.",
  "Comparing letter language between schools to gauge enthusiasm. Most language is template.",
  "Missing the financial aid signals. Aid package language matters more than admit letter language.",
];

const PAGE_FAQS = [
  { q: "What does it mean to be deferred from a college?", a: "Deferred means your early-round application was moved to the regular decision pool for re-review in February-March. It's not a rejection, but most deferred applicants are eventually rejected. Accept rate from deferred pool is typically 5-15% at top schools. Submit a LOCI within 1-2 weeks and reconfigure your RD strategy." },
  { q: "What is a Likely Letter?", a: "A Likely Letter is sent by some Ivy League schools and other selective institutions to applicants they particularly want -- usually recruited athletes, top scholarship candidates, or extraordinary applicants. It signals you'll be admitted in the RD round if your grades and conduct remain consistent. Functionally an early admission." },
  { q: "What should I do if I'm waitlisted?", a: "Submit a Letter of Continued Interest (200-300 words) within 2-3 weeks. Include 1-2 substantive new updates and one specific reason you fit the school. Commit to your best non-waitlist school by May 1. Typical waitlist admit rates: 5-15% at top privates, though some schools admit 0% in a given year." },
  { q: "Can a college rescind my acceptance?", a: "Yes. Rescission is rare (<1% of admits) but real. It's triggered by significant senior-year GPA drops (typically D or F grades), disciplinary actions, criminal charges, or material misrepresentation on the application. Maintain your academic performance and conduct through graduation." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/college-acceptance-letter-decoder#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Acceptance Letter Decoder", item: `${BASE}/college-acceptance-letter-decoder` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/college-acceptance-letter-decoder#page`,
      url: `${BASE}/college-acceptance-letter-decoder`,
      name: "College Acceptance Letter Decoder — What Each Phrase Actually Means",
      description: "Decoded guide to college admission letter language: acceptance, deferral, waitlist, rejection, Likely Letters.",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/college-acceptance-letter-decoder#breadcrumb` },
      inLanguage: "en-US",
    },
    {
      "@type": "FAQPage",
      mainEntity: PAGE_FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

function PhraseList({ items }: { items: { phrase: string; meaning: string; signal: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article
          key={item.phrase}
          className="dl-card-hover rounded-xl border p-4"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
        >
          <h3 className="mb-1 text-[14.5px] font-semibold italic" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            &quot;{item.phrase}&quot;
          </h3>
          <p className="mb-1.5 text-[13.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            {item.meaning}
          </p>
          <p className="text-[13px]" style={{ color: "#4A6FA5", fontWeight: 500 }}>
            Signal: {item.signal}
          </p>
        </article>
      ))}
    </div>
  );
}

export default function CollegeAcceptanceLetterDecoderPage() {
  return (
    <MarketingLayout
      eyebrow="Letter Decoder"
      title="College Acceptance Letter Decoder"
      description="Most admission letters use template language designed to soften. Here's the decoder: what each phrase actually signals about the school's position on you, how to read between the lines, and common misreads that lead families astray."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section
        title="Acceptance language"
        Icon={CheckCircle2}
        description="Standard acceptance phrases and what each signals beyond admission."
      >
        <PhraseList items={ACCEPTANCE_LANGUAGE} />
      </Section>

      <Section
        title="Deferral language"
        Icon={Clock}
        description="What deferral actually means — usually less than students hope."
      >
        <PhraseList items={DEFERRAL_LANGUAGE} />
      </Section>

      <Section
        title="Waitlist language"
        Icon={AlertCircle}
        description="The honest math behind waitlist letters."
      >
        <PhraseList items={WAITLIST_LANGUAGE} />
      </Section>

      <Section
        title="Rejection language"
        Icon={XCircle}
        description="Different rejection phrases, all with the same outcome."
      >
        <PhraseList items={REJECTION_LANGUAGE} />
      </Section>

      <Section
        title="Signals to read between the lines"
        Icon={Mail}
        description="Beyond the letter itself, what other elements signal about the school's position."
      >
        <div className="space-y-3">
          {SIGNALS_BETWEEN_LINES.map((s) => (
            <article
              key={s.pattern}
              className="dl-card-hover rounded-xl border p-4"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
            >
              <h3 className="mb-1 text-[14.5px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                {s.pattern}
              </h3>
              <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {s.interpretation}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Common misreads" Icon={AlertCircle}>
        <ul className="space-y-2">
          {COMMON_MISREADS.map((m, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[14px] leading-relaxed">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{m}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="What the letter doesn't tell you"
        Icon={Mail}
      >
        <div
          className="rounded-2xl p-6"
          style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderLeft: "3px solid #4A6FA5" }}
        >
          <p className="mb-3 text-[14.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            The admissions decision letter conveys yes/no/maybe. It doesn&apos;t convey: how strong your application was relative to other admits, whether you were a top-choice admit or a borderline yes, what specific factors tipped the decision, what you could have done differently. Most schools won&apos;t share these specifics even if you ask, because their decision matrix is institutionally protected.
          </p>
          <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            The letter is a binary signal with some institutional context. The real story of your admission is partly outside your knowledge. This is structurally true and not changeable. Use the letter for what it tells you (admit/deferred/waitlist/reject) and don&apos;t over-interpret the language beyond that.
          </p>
        </div>
      </Section>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="mb-5 text-[22px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>
          Frequently asked questions
        </h2>
        <div className="space-y-3">
          {PAGE_FAQS.map(({ q, a }) => (
            <details key={q} className="dl-card-hover rounded-2xl border p-5" style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}>
              <summary className="cursor-pointer font-bold text-base" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{q}</summary>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}>{a}</p>
            </details>
          ))}
        </div>
      </section>

      <MarketingCTA
        headline="Make sense of every decision letter."
        description="AdmitPath helps you interpret admission letters in context — what each school's decision means for your real options. Free plan included. Pro $19.99/mo."
        buttonText="Decode your decisions"
      />

      {/* Related resources */}
      <nav className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3" aria-label="Related resources">
        <a href="/college-decision-day" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Decision day guide</div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Compare offers, negotiate aid, commit by May 1.</div>
        </a>
        <a href="/college-rejection-recovery" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Rejection recovery</div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Processing rejections and the paths forward.</div>
        </a>
        <a href="/financial-aid-appeal-guide" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Financial aid appeal guide</div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>6 valid grounds and the letter framework.</div>
        </a>
        <a href="/admissions-jargon-decoder" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Admissions jargon decoder</div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>50+ terms explained in plain language.</div>
        </a>
      </nav>
    </MarketingLayout>
  );
}
