import type { Metadata } from "next";
import {
  Layers,
  CheckSquare,
  Eye,
  Edit3,
  Volume2,
  Scissors,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { Section } from "@/components/marketing/Section";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Essay Revision Checklist — 5-Pass Framework",
  description:
    "5-pass revision checklist for college essays: structural, content, language, voice, and final cuts. Actionable items for each pass.",
  alternates: { canonical: `${BASE}/college-essay-revision-checklist` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Essay Revision Checklist — 5-Pass Framework",
    description: "5-pass revision checklist: structural, content, language, voice, and final cuts.",
    url: `${BASE}/college-essay-revision-checklist`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Essay+Revision+Checklist&subtitle=5-pass+framework`, width: 1200, height: 630, alt: "Essay Revision Checklist" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Essay Revision Checklist — 5-Pass Framework", description: "5-pass revision checklist for college essays.", images: [`${BASE}/api/og?title=Essay+Revision+Checklist&subtitle=5-pass+framework`] },
};

const PRE_REVISION = [
  "Take 24 hours away from the draft. Fresh eyes catch what tired ones miss.",
  "Read the prompt again. Make sure you're answering it.",
  "Check word count. If wildly over or under, structural problem.",
  "Print out the essay or read on a different device — fresh perspective.",
  "Decide what kind of revision pass you're doing this session (don't try to fix everything at once).",
];

const STRUCTURAL_PASS = [
  "Does the opening hook reader within first 1-2 sentences?",
  "Does the second paragraph sustain momentum and add context?",
  "Is there a clear arc — beginning, middle, end?",
  "Does each paragraph earn its place? Cut any that don't.",
  "Is there a specific moment, image, or insight that anchors the essay?",
  "Is the conclusion specific and earned (not generic 'I learned')?",
  "If you removed any paragraph, would the essay still hold? If yes, that paragraph is weak.",
  "Are transitions natural? No 'firstly, secondly, in conclusion' jargon.",
  "Is the structure surprising or expected? Surprising structures often land stronger.",
];

const CONTENT_PASS = [
  "Are there enough specific details (sounds, smells, textures, names)?",
  "Are there moments of vulnerability, complexity, or contradiction?",
  "Does the essay reveal something about you that admissions wouldn't get from the rest of your application?",
  "Are there any vague generalizations? Replace with specifics.",
  "Are there any clichés? Replace with specifics.",
  "Is there a specific theme that runs through? (Implicit, not announced.)",
  "Does the essay show growth, change, or insight without explicitly stating?",
  "Is there evidence supporting any claims you make about yourself?",
  "Are there any 'admissions clichés' (mission trip, sports injury, immigrant family, building/starting, failure, identity, death)? If yes, what makes yours specifically yours?",
  "Are you showing or telling? Show wins.",
];

const LANGUAGE_PASS = [
  "Read aloud. Where do you stumble? Those sentences need work.",
  "Cut every 'I think,' 'I believe,' 'in my opinion' — your name is on the essay.",
  "Cut every 'really,' 'very,' 'truly,' 'literally' unless they earn their place.",
  "Replace adjectives with nouns where the noun does the work.",
  "Replace passive voice with active voice in 95% of cases.",
  "Find sentences over 25 words. Often two sentences in one.",
  "Find paragraphs over 6 sentences. Often two paragraphs.",
  "Use specific verbs ('marched,' 'paused,' 'whispered') not generic ones ('walked,' 'stopped,' 'said').",
  "Use specific nouns ('the cracked porcelain mug,' not 'the cup').",
  "Cut all hedges ('sort of,' 'kind of,' 'a bit') unless intentional.",
];

const VOICE_PASS = [
  "Does this sound like you talking, or like a 35-year-old who polished it?",
  "Are you using words you'd actually use in conversation?",
  "Is the rhythm right — short sentences and long sentences alternating?",
  "Are there moments of humor, intensity, or specific personality coming through?",
  "If a friend who knows you read it without your name on it, would they recognize you?",
  "If parents or teachers helped, did they accidentally polish away your voice? Restore it.",
  "Are you allowing yourself to be specific about what you actually think and feel?",
  "Are there moments where you flinched while writing? Keep those — they're often the most authentic.",
];

const FINAL_CUTS = [
  "Read it aloud one more time. Note any awkwardness.",
  "Cut any words that don't carry weight.",
  "Cut any sentences that don't add to the essay.",
  "Tighten the opening — first sentence should hook.",
  "Tighten the conclusion — should land.",
  "Make sure every paragraph earns its place.",
  "Final check: word count, prompt response, no typos.",
  "Get one final fresh-eyes read from someone who hasn't seen earlier drafts.",
  "Trust it. Stop editing once it's strong; further editing often introduces problems.",
];

const COMMON_REVISION_TRAPS = [
  "Over-revising until the essay loses its life. Stop when strong.",
  "Polishing away voice. Specific quirks that sound 'wrong' may be the most authentic parts.",
  "Adding more content to fill word count. Cut padding instead.",
  "Trying to address every piece of feedback. Some feedback should be ignored.",
  "Letting parents or teachers rewrite your voice. Take feedback selectively.",
  "Revising at the last minute. Each revision should serve the essay; rushed revisions often weaken.",
  "Comparing to other students' essays. Different writers, different essays.",
  "Forgetting the prompt during revision. Every revision should answer the question asked.",
];

const REVISION_STAGES = [
  { stage: "Stage 1: Big Picture", focus: "Structure, arc, content, big themes. Don't worry about word choice yet." },
  { stage: "Stage 2: Content Depth", focus: "Specifics, vulnerability, complexity. Add what's missing; remove generic content." },
  { stage: "Stage 3: Language", focus: "Sentence-level revision. Word choice, sentence rhythm, voice." },
  { stage: "Stage 4: Voice Check", focus: "Does it sound like you? Restore voice that revision may have polished away." },
  { stage: "Stage 5: Final Cuts", focus: "Tighten, trim, finalize. Stop when strong." },
];

const PAGE_FAQS = [
  { q: "How many times should I revise my college essay?", a: "Plan for 5-10 revision passes organized by focus area: structure first, then content depth, then language, then voice, then final cuts. Most strong essays go through 3-5 major revisions plus several polish passes. Stop when reading aloud reveals no awkwardness and a friend can recognize you in the writing." },
  { q: "Should I let my parents edit my college essay?", a: "Parents can read and react, but should not rewrite. The most common damage from parental editing is voice polishing — removing the specific quirks that make the essay sound like a 17-year-old. Take feedback selectively: if a parent flags confusion, that's useful. If they rewrite sentences to sound 'better,' restore your original voice." },
  { q: "How do I know when my essay is done?", a: "Your essay is done when: you've completed all 5 revision passes, reading aloud reveals no awkward spots, someone who knows you recognizes your voice in it, the opening hooks and the conclusion lands, and you'd be comfortable submitting it without another review. Further revision often introduces new problems." },
  { q: "What's the biggest mistake students make when revising essays?", a: "Over-revising until the essay loses its life. Students (and their parents and counselors) polish away the specific, authentic details that made the essay work in the first place. The second biggest mistake is trying to fix everything in a single pass instead of working through one dimension at a time." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/college-essay-revision-checklist#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Essay Revision Checklist", item: `${BASE}/college-essay-revision-checklist` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/college-essay-revision-checklist#page`,
      url: `${BASE}/college-essay-revision-checklist`,
      name: "College Essay Revision Checklist — 5-Pass Framework",
      description: "Structured 5-pass revision framework for college essays. Pre-revision, structural, content, language, voice, final cuts.",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/college-essay-revision-checklist#breadcrumb` },
      inLanguage: "en-US",
    },
    {
      "@type": "HowTo",
      "@id": `${BASE}/college-essay-revision-checklist#howto`,
      name: "How to Revise a College Essay (5-Pass Framework)",
      description: "Pass-by-pass revision framework for transforming a college essay draft into a strong final version.",
      step: REVISION_STAGES.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.stage,
        text: s.focus,
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

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-[14px] leading-relaxed">
          <CheckSquare className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "#4A6FA5" }} />
          <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function CollegeEssayRevisionChecklistPage() {
  return (
    <MarketingLayout
      eyebrow="Essay Revision"
      title="College Essay Revision Checklist"
      description="A structured 5-pass revision framework for transforming a draft into a final essay. Each pass focuses on one dimension. Don't try to fix everything at once — work systematically through each level."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section
        title="Pre-revision setup"
        Icon={Layers}
        description="Before you start revising, a few preparation steps."
      >
        <CheckList items={PRE_REVISION} />
      </Section>

      <Section
        title="Pass 1: Structural"
        Icon={Layers}
        description="Big picture: structure, arc, themes. Don't worry about word choice yet."
      >
        <CheckList items={STRUCTURAL_PASS} />
      </Section>

      <Section
        title="Pass 2: Content depth"
        Icon={Eye}
        description="Specifics, vulnerability, complexity. Add what's missing; remove what's generic."
      >
        <CheckList items={CONTENT_PASS} />
      </Section>

      <Section
        title="Pass 3: Language"
        Icon={Edit3}
        description="Sentence-level revision. Word choice, rhythm, clarity."
      >
        <CheckList items={LANGUAGE_PASS} />
      </Section>

      <Section
        title="Pass 4: Voice"
        Icon={Volume2}
        description="Does it sound like you? Restore voice that revision may have polished away."
      >
        <CheckList items={VOICE_PASS} />
      </Section>

      <Section
        title="Pass 5: Final cuts"
        Icon={Scissors}
        description="Tighten, trim, finalize. Stop when strong."
      >
        <CheckList items={FINAL_CUTS} />
      </Section>

      <Section
        title="Common revision traps"
        Icon={Eye}
        description="Pitfalls that weaken essays during revision."
      >
        <ul className="space-y-2">
          {COMMON_REVISION_TRAPS.map((t, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[14px] leading-relaxed">
              <Eye className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="When to stop revising"
        Icon={CheckSquare}
      >
        <div
          className="rounded-2xl p-6"
          style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderLeft: "3px solid #4A6FA5" }}
        >
          <p className="mb-3 text-[14.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Stop revising when: (1) you&apos;ve done all 5 passes, (2) reading aloud reveals no awkwardness, (3) someone who knows you can recognize you in it, (4) the essay reveals something specific to you, (5) the conclusion lands without lecturing, (6) you&apos;d be proud to send it without a parent or teacher reviewing again. Further revision often introduces problems.
          </p>
          <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Most essays go through 5-10 revisions before they&apos;re ready. Some need more; some need less. The key isn&apos;t the number of revisions but whether each revision serves the essay. Stop when revisions don&apos;t make it stronger anymore.
          </p>
        </div>
      </Section>

      {/* FAQ */}
      <section className="mb-12">
        <h2
          className="mb-5 text-[22px] font-semibold"
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

      <MarketingCTA
        headline="Revise with structure, not panic."
        description="AdmitPath helps you work through college essay revisions systematically — one dimension at a time, until your essay lands. Free plan included. Pro $19.99/mo."
        buttonText="Revise smarter"
      />

      {/* Related resources */}
      <nav className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3" aria-label="Related resources">
        <a href="/college-essay-examples" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Essay examples</div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>6 annotated excerpts with line-by-line analysis.</div>
        </a>
        <a href="/college-essay-topic-finder" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Essay topic finder</div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>8 categories of strong topics with prompts.</div>
        </a>
        <a href="/personal-statement-guide" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Personal statement guide</div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>15-day writing process and structure framework.</div>
        </a>
        <a href="/application-component-weighting" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>How schools weight your application</div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>CDS data on essay weight vs GPA, test scores, activities.</div>
        </a>
      </nav>
    </MarketingLayout>
  );
}
