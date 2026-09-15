import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  PenLine,
  CheckCircle2,
  XCircle,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Personal Statement Guide 2026",
  description:
    "How to write a Common App personal statement: 5 structure frameworks, what admissions officers look for, and strong essay patterns.",
  alternates: { canonical: `${BASE}/personal-statement-guide` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Personal Statement Guide — Structure & Revision",
    description: "How to write a Common App personal statement: structure, what admissions reads for, and revision process.",
    url: `${BASE}/personal-statement-guide`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Personal+Statement+Guide&subtitle=Structure+%C2%B7+examples+%C2%B7+revision`, width: 1200, height: 630, alt: "Personal Statement Guide" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Personal Statement Guide", description: "How to write a Common App personal statement: structure, examples, revision.", images: [`${BASE}/api/og?title=Personal+Statement+Guide&subtitle=Structure+%C2%B7+examples+%C2%B7+revision`] },
};

const STAGES = [
  {
    name: "1. Brainstorm",
    days: "Days 1-3",
    icon: Sparkles,
    body: "Don't open a blank document. Open a text file and list 10 specific moments from the past two years that you remember vividly — not achievements, moments. The dinner table. The bus ride. The fight. The realization.",
    actions: [
      "List 10+ specific moments. One sentence each.",
      "For each, write one sentence about why you still remember it.",
      "Identify the one with the strongest 'why' — that's your essay.",
      "Don't pick the prompt yet. The story comes first.",
    ],
  },
  {
    name: "2. First draft",
    days: "Days 4-6",
    icon: PenLine,
    body: "Write 600-800 words about the moment you picked. Don't worry about the prompt. Don't worry about word limit. Don't worry about whether it's good. Just write.",
    actions: [
      "Open with a specific sensory detail — smell, sound, exact dialogue.",
      "Keep the scene before the reflection. Show the moment. THEN explain what it taught you.",
      "End with a forward-pointing thought, not a tied-up bow.",
      "Save the draft. Don't edit yet. Walk away for 24 hours.",
    ],
  },
  {
    name: "3. Read and react",
    days: "Day 7",
    icon: CheckCircle2,
    body: "Read your draft out loud. Mark every sentence that sounds like something you'd never actually say. Mark every paragraph where the reflection doesn't earn its emotional weight.",
    actions: [
      "Read it aloud. Aloud. Not in your head.",
      "Highlight the 3 strongest sentences and the 3 weakest.",
      "Show it to one person who will read carefully (not 5 people who will give conflicting feedback).",
      "Match the prompt to your essay, not the other way around.",
    ],
  },
  {
    name: "4. Major revision",
    days: "Days 8-12",
    icon: PenLine,
    body: "This is where most of the actual essay work happens. Cut weak sentences ruthlessly. Replace abstractions with specific details. Tighten the structure so each paragraph earns its place.",
    actions: [
      "Cut anything that could be in someone else's essay. The hallmarks of generic openings: 'Throughout my life,' 'Ever since I was young,' 'I have always been passionate about.'",
      "Replace adjectives with behavior. Don't say 'I'm curious' — show yourself being curious.",
      "Verify the 'so what.' Every paragraph should change something the reader knows about you.",
      "Trim toward 600-650 words. Tightness is a virtue.",
    ],
  },
  {
    name: "5. Polish",
    days: "Days 13-15",
    icon: Sparkles,
    body: "After major revisions, the essay is structurally sound. Now you make it sing. Voice, cadence, punctuation, transitions. Minor edits that compound into a different reader experience.",
    actions: [
      "Vary sentence length. Short. Then medium-length. Then a longer sentence that earns its breath because the previous two were short.",
      "Read aloud one more time. Smooth out any awkward rhythms.",
      "Check first and last sentences. Both should be memorable.",
      "Have one trusted reader review the final draft. Stop editing.",
    ],
  },
];

const SIX_THINGS_ADMISSIONS_READS_FOR = [
  {
    name: "Specificity",
    description:
      "Concrete details, named moments, particular images. Specificity is the strongest signal that the writer has actually thought about and lived the experience.",
  },
  {
    name: "Reflection (not just narrative)",
    description:
      "The story is the vehicle; the insight is the cargo. Most weak essays describe events without ever telling the reader what they changed.",
  },
  {
    name: "Voice",
    description:
      "Sounds like a 17-year-old, not a press release. Plain language, real sentences. Don't flex vocabulary.",
  },
  {
    name: "Self-awareness",
    description:
      "Including how you think about your own mistakes. The strongest essays demonstrate that the writer can hold contradictions in their head.",
  },
  {
    name: "Movement",
    description:
      "Something has to change between the start of the essay and the end. The change can be small, but the reader should feel it.",
  },
  {
    name: "Authenticity",
    description:
      "The voice in your essay should match the voice in your activities, supplements, and recommendations. Voice mismatch is the most common signal of inauthenticity.",
  },
];

const KILLERS = [
  "Generic opening ('Throughout my life,' 'Ever since I was young,' 'I have always been passionate about').",
  "The thesaurus essay — vocabulary that sounds like a 17-year-old swallowed an SAT prep book.",
  "The sports-injury-built-character essay (most-overdone archetype).",
  "The mission-trip essay (treating someone else's community as your character development).",
  "The list essay — listing achievements the reader already has on the activity list.",
  "The trauma essay you didn't actually live (admissions readers are very good at recognizing this).",
  "The bow ending ('And that's how I learned the meaning of friendship.').",
  "Quoting another author at length and treating their words as your insight.",
  "Opening with a quote you didn't say.",
  "Editing out your voice in pursuit of polish — over-edited essays sound dead.",
];

const STRUCTURE = [
  {
    label: "The Moment",
    description:
      "Specific scene. Sensory details. The reader sees what you saw, hears what you heard. ~100-150 words.",
  },
  {
    label: "The Context",
    description:
      "Brief background — who, when, why this moment matters. Don't dwell. ~75-100 words.",
  },
  {
    label: "The Action",
    description:
      "What you did, thought, said in the moment. The active part of the essay. ~150-200 words.",
  },
  {
    label: "The Reflection",
    description:
      "What it taught you. Specific, not generic. Connected to something larger than the moment. ~150-200 words.",
  },
  {
    label: "The Forward",
    description:
      "How this is still alive in your thinking. NOT a bow. A pointer to who you're becoming. ~50-100 words.",
  },
];

const PAGE_FAQS = [
  { q: "How long should a college essay be?", a: "The Common App personal statement has a hard limit of 650 words. Most strong essays land between 600 and 650. Anything under 500 reads as undercooked. Supplemental essays vary by school — always check the specific word limit. Some are as short as 100 words, others up to 650." },
  { q: "What makes a college essay stand out?", a: "Specificity, authentic voice, genuine reflection, and self-awareness. The best essays use concrete details (a specific conversation, a precise moment) rather than abstract claims. Admissions readers value essays that sound like a real 17-year-old wrote them, not a press release." },
  { q: "How many drafts should I write?", a: "Plan for 3-5 major revisions over 15 days. The first draft captures the story. The second and third drafts refine structure and voice. Final passes focus on polish — sentence rhythm, transitions, and cutting anything generic." },
  { q: "Should I write about a hardship or trauma?", a: "Only if it genuinely shaped who you are AND you can write about it with reflection, not just narrative. Trauma essays work when they reveal resilience and growth. They fail when the trauma becomes the whole essay with no reflection, or when the hardship isn't actually yours." },
  { q: "Can I reuse my personal statement for multiple schools?", a: "Yes — the Common App personal statement is automatically sent to every Common App school. Supplemental essays (the 'Why Us,' 'Why This Major,' etc.) are separate and must be tailored to each school." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/personal-statement-guide#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Personal Statement Guide", item: `${BASE}/personal-statement-guide` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/personal-statement-guide#page`,
      url: `${BASE}/personal-statement-guide`,
      name: "Personal Statement Guide — Structure, Examples, Revision",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/personal-statement-guide#breadcrumb` },
      inLanguage: "en-US",
      mainEntity: { "@id": `${BASE}/personal-statement-guide#howto` },
    },
    {
      "@type": "HowTo",
      "@id": `${BASE}/personal-statement-guide#howto`,
      name: "How to Write a Common App Personal Statement",
      description: "5-stage revision process from brainstorm to polished final draft.",
      totalTime: "P15D",
      step: STAGES.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.name,
        text: s.body,
      })),
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

export default function PersonalStatementGuidePage() {
  return (
    <MarketingLayout
      eyebrow="Personal statement"
      title="The Common App personal statement, written well"
      description="A 15-day revision process, the 5-paragraph structure that works, and the 10 most common things that kill an otherwise-strong essay."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

        {/* The 6 things admissions reads for */}
        <section className="mb-14">
          <h2
            className="mb-3 text-[20px] font-semibold"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
            The 6 things admissions reads for
          </h2>
          <p className="mb-5 text-[14px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            These are the 6 dimensions of AdmitPath&apos;s essay rubric, drawn
            from what internal admissions training materials consistently
            emphasize. The{" "}
            <Link href="/methodology" className="underline" style={{ color: "#4A6FA5" }}>
              scoring methodology
            </Link>{" "}
            weights authenticity highest (0.20) and uses a separate 4-axis
            voice rubric (specificity, cadence, stance, self-disclosure) to
            evaluate whether the essay sounds like a real person wrote it.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SIX_THINGS_ADMISSIONS_READS_FOR.map((d, i) => (
              <div
                key={i}
                className="rounded-xl border p-4"
                style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
              >
                <p
                  className="mb-1.5 text-[14px] font-semibold"
                  style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-instrument-sans)" }}
                >
                  {d.name}
                </p>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                  {d.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Structure */}
        <section className="mb-14">
          <h2
            className="mb-3 text-[20px] font-semibold"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
            The 5-part structure that works
          </h2>
          <p className="mb-5 text-[14px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Most strong essays follow this rough shape. It&apos;s not a rigid
            template — it&apos;s a description of how the genuinely strong
            essays we&apos;ve seen tend to flow.
          </p>
          <div className="space-y-3">
            {STRUCTURE.map((s, i) => (
              <div
                key={i}
                className="flex gap-4 rounded-xl border p-4"
                style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-white"
                  style={{ background: "#4A6FA5" }}
                >
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p
                    className="mb-1 text-[15px] font-semibold"
                    style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-instrument-sans)" }}
                  >
                    {s.label}
                  </p>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* The 5-stage revision */}
        <section className="mb-14">
          <h2
            className="mb-3 text-[20px] font-semibold"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
            The 15-day revision process
          </h2>
          <p className="mb-5 text-[14px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Stronger essays come from time, not from talent. 15 days of
            structured revision beats 3 hours the night before. Here&apos;s
            the cadence we recommend.
          </p>
          {STAGES.map((s, i) => {
            const Icon = s.icon;
            return (
              <article
                key={i}
                className="dl-card-hover mb-4 rounded-2xl border p-5"
                style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
              >
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: "rgba(74,111,165,0.08)" }}
                  >
                    <Icon className="h-5 w-5" style={{ color: "#4A6FA5" }} />
                  </div>
                  <div>
                    <p
                      className="text-[15px] font-semibold"
                      style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                    >
                      {s.name}
                    </p>
                    <p className="text-[12px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                      {s.days}
                    </p>
                  </div>
                </div>
                <p className="mb-3 text-[14px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                  {s.body}
                </p>
                <ul className="space-y-1.5">
                  {s.actions.map((a, j) => (
                    <li key={j} className="flex items-start gap-2 text-[13px] leading-relaxed">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
                      <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{a}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </section>

        {/* The 10 killers */}
        <section className="mb-14">
          <h2
            className="mb-3 flex items-center gap-2 text-[20px] font-semibold"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
            <AlertTriangle className="h-5 w-5" style={{ color: "#4A6FA5" }} />
            The 10 things that kill an otherwise-strong essay
          </h2>
          <ul className="space-y-2">
            {KILLERS.map((k, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[14px] leading-relaxed">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "#DC2626" }} />
                <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{k}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="mb-14">
          <h2
            className="mb-5 text-[20px] font-semibold"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
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

        {/* CTA */}
        <div
          className="mt-8 rounded-2xl border p-8 text-center"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
        >
          <p className="text-sm mb-3" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            See your essay scored across 6 admissions rubrics in 30 seconds
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/sign-up"
              className="btn-primary inline-flex h-11 items-center gap-2 px-6 text-sm"
            >
              Try the essay tool
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/college-essay-examples"
              className="inline-flex h-11 items-center gap-2 rounded-md border px-6 text-sm font-medium transition-colors hover:border-[color:var(--dl-text-muted, #5A6275)]"
              style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-primary, #1B2030)" }}
            >
              See annotated examples
            </Link>
          </div>
        </div>
    </MarketingLayout>
  );
}
