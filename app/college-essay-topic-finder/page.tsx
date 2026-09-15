import Link from "next/link";
import type { Metadata } from "next";
import {
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { Section } from "@/components/marketing/Section";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "College Essay Topic Finder — Best Topics",
  description:
    "Framework for finding strong college essay topics. 8 topic categories, prompts to surface ideas, common traps, and how to test your topic.",
  alternates: { canonical: `${BASE}/college-essay-topic-finder` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "College Essay Topic Finder",
    description:
      "Structured framework for finding strong college essay topics. 8 categories of strong topics, prompts to surface ideas, common topic traps, and how to test whether a topic will produce a strong essay.",
    url: `${BASE}/college-essay-topic-finder`,
    type: "website",
    images: [{
      url: `${BASE}/api/og?title=Essay+Topic+Finder&subtitle=8+categories+%C2%B7+prompts+%C2%B7+traps`,
      width: 1200,
      height: 630,
      alt: "AdmitPath Essay Topic Finder — 8 categories, prompts, and traps to avoid",
    }],
    locale: "en_US",
    siteName: "AdmitPath",
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "College Essay Topic Finder", description: "8 categories of strong topics, prompts to surface ideas, and common traps.", images: [`${BASE}/api/og?title=Essay+Topic+Finder&subtitle=8+categories+%C2%B7+prompts+%C2%B7+traps`] },
};

const TOPIC_CATEGORIES = [
  {
    category: "Moments of genuine surprise",
    description: "Times you realized something you hadn't expected. A shift in perspective. The moment where what you assumed turned out wrong.",
    prompts: [
      "What's a time you were completely wrong about something important?",
      "When did you realize a person you'd judged was different from what you assumed?",
      "What's a skill or interest you stumbled into that you never planned?",
    ],
    why: "Surprise reveals depth of thinking. Admissions readers see self-awareness and intellectual growth.",
  },
  {
    category: "Small things that mean more than they should",
    description: "Objects, rituals, habits, places that carry disproportionate emotional weight. A specific recipe. A worn object. A daily walk.",
    prompts: [
      "What's an object you'd save if your house were on fire?",
      "What daily habit would feel wrong to skip?",
      "What place do you return to that most people wouldn't notice?",
    ],
    why: "Small-specific beats big-generic. Details reveal character. Readers remember specifics, not generalities.",
  },
  {
    category: "Things you're still figuring out",
    description: "Questions you haven't answered yet. Tensions you live with. Contradictions you notice in yourself.",
    prompts: [
      "What question do you keep returning to that you haven't answered?",
      "Where do your beliefs contradict each other?",
      "What do you pretend to have figured out but actually haven't?",
    ],
    why: "Unresolved thinking signals intellectual maturity. Admissions readers value honest uncertainty over performed wisdom.",
  },
  {
    category: "Moments of genuine connection",
    description: "Times when you connected with someone (or something) in a way that changed you. A conversation. A shared experience. A relationship that shifted your understanding.",
    prompts: [
      "Who's the person whose perspective is most different from yours that you genuinely respect?",
      "What conversation changed how you think about something?",
      "When did you feel genuinely understood by someone?",
    ],
    why: "Connection reveals empathy, humility, and interpersonal depth — traits that predict community contribution.",
  },
  {
    category: "Times you failed or got it wrong",
    description: "Not catastrophic failure — specific moments where you tried something and it didn't work, and what you learned from the gap between expectation and reality.",
    prompts: [
      "What's something you worked hard at that still didn't succeed?",
      "When did your plan fall apart and you had to adapt?",
      "What's a mistake you made that you'd make again (because the learning was worth it)?",
    ],
    why: "How you handle failure reveals character more than how you handle success. Growth from failure is genuine.",
  },
  {
    category: "Things you do when no one's watching",
    description: "Activities, interests, habits that you pursue without external validation. The things you'd do even if no one knew.",
    prompts: [
      "What do you do in your free time that you don't put on your resume?",
      "What would you study if it had no career value?",
      "What skill are you building that no one has asked you to build?",
    ],
    why: "Intrinsic motivation signals genuine engagement. These topics often produce the most authentic essays.",
  },
  {
    category: "Family dynamics and cultural specifics",
    description: "Specific traditions, tensions, rituals, or observations from your family or cultural context. Not generic identity — specific details.",
    prompts: [
      "What's a family tradition that outsiders wouldn't understand?",
      "What's something your family does that's different from most families you know?",
      "What did your parents teach you that you've now questioned?",
    ],
    why: "Specific cultural and family details are deeply personal and can't be replicated by other applicants. They reveal who you are in context.",
  },
  {
    category: "Intellectual obsessions",
    description: "Ideas, questions, or subjects that genuinely fascinate you. Not 'I'm passionate about X' but specific ideas you've pursued deeply.",
    prompts: [
      "What's a book/article/idea that you've returned to multiple times?",
      "What question in your field of interest keeps you up at night?",
      "What's something you've explained to friends multiple times because you find it so interesting?",
    ],
    why: "Genuine intellectual engagement is rare and visible. Admissions readers can tell when curiosity is real.",
  },
];

const TOPIC_TRAPS = [
  {
    trap: "The 'impressive' topic",
    problem: "Choosing a topic because it sounds impressive rather than because it genuinely matters to you. Research, leadership, awards — impressive on paper but often produce generic essays.",
    fix: "Ask: would I write about this if no one were reading? If no, find a different topic.",
  },
  {
    trap: "The generic challenge",
    problem: "'I overcame adversity' without specific, honest complexity. The challenge essay where the lesson is 'I learned I'm stronger than I thought.'",
    fix: "If your challenge essay has a generic lesson, the topic isn't specific enough. Go deeper into what specifically happened and what specifically you learned.",
  },
  {
    trap: "The mission trip / volunteer story",
    problem: "Writing about helping others in a way that centers you as savior. 'I went to [country] and learned to appreciate what I have.'",
    fix: "If you write about service, focus on what surprised you, what you got wrong, what you learned about yourself — not about the people you 'helped.'",
  },
  {
    trap: "The activity highlight reel",
    problem: "Summarizing your best activity rather than reflecting on a specific moment within it. 'I'm captain of the debate team and we won regionals.'",
    fix: "Pick one specific moment within the activity that reveals something about you. Not what you did — what it meant.",
  },
  {
    trap: "The 'I'm different' identity essay",
    problem: "'I'm proud of being [identity]' without specific depth. Generic identity statements don't differentiate.",
    fix: "Go specific. One tradition, one tension, one moment where your identity shaped a decision or interaction. The specifics make it yours.",
  },
  {
    trap: "The trauma-as-strategy essay",
    problem: "Writing about trauma because you think it'll gain sympathy or admissions advantage rather than because it genuinely shaped you.",
    fix: "Write about trauma only if you've processed it and it reveals who you are now. See our article on when to write about trauma.",
  },
  {
    trap: "The 'I want to change the world' essay",
    problem: "Grand aspirational statements without specific evidence or grounding. 'I want to solve climate change' without demonstrated engagement.",
    fix: "Replace aspiration with action. What have you already done? What specific thing would you do? Grand statements without specifics are empty.",
  },
  {
    trap: "The topic someone else chose for you",
    problem: "Parents, counselors, or friends suggested a topic that doesn't genuinely resonate. Writing about someone else's idea of what's important.",
    fix: "The essay should feel like yours. If you're writing because someone told you to, the inauthenticity will show. Choose your own topic.",
  },
];

const TOPIC_TESTS = [
  "Could many other applicants write this same essay? If yes, it's not specific enough to you.",
  "Does the topic make you feel something when you think about it? If no, it may not produce authentic writing.",
  "Can you identify 3+ specific sensory details from this topic? If no, you may not have enough material.",
  "Does the topic reveal something about you that admissions couldn't learn from the rest of your application?",
  "Would a friend who knows you well recognize you in an essay about this topic?",
  "Does the topic allow for complexity, not just a clean narrative arc?",
  "Can you write about this topic in your natural voice, or does it force you into a different register?",
  "Is this the topic you'd choose if admissions weren't reading? If yes, it's probably authentic.",
];

const PAGE_FAQS = [
  { q: "What is the best topic for a college essay?", a: "There is no single best topic. The best topics are ones genuinely specific to you, ones that produce authentic voice and concrete detail. A 'common' topic (cooking, family, sports) written with real specificity beats an 'impressive' topic written generically. The test: if your essay could belong to any other applicant, it's not specific enough." },
  { q: "Should I write about something impressive for my essay?", a: "No. Choosing a topic because it sounds impressive (research, leadership, awards) often produces generic essays. Choose a topic because it genuinely matters to you. The best essays come from moments of surprise, small things that carry disproportionate weight, or things you're still figuring out." },
  { q: "How do I know if my essay topic is good?", a: "Run 8 tests: Could many others write this same essay? Does it make you feel something? Can you identify 3+ sensory details? Does it reveal something not in your activities list? Would a friend recognize you in it? Does it allow for complexity? Can you write it in your natural voice? Would you choose this topic if admissions weren't reading?" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/college-essay-topic-finder#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Essay Topic Finder", item: `${BASE}/college-essay-topic-finder` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/college-essay-topic-finder#page`,
      url: `${BASE}/college-essay-topic-finder`,
      name: "College Essay Topic Finder — Framework for Finding Your Best Topic",
      description: "Structured framework for finding strong college essay topics. 8 categories, prompts, traps, and topic tests.",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/college-essay-topic-finder#breadcrumb` },
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

export default function CollegeEssayTopicFinderPage() {
  return (
    <MarketingLayout
      eyebrow="Essay Topics"
      title="College Essay Topic Finder"
      description="Most students struggle with choosing their essay topic more than writing the essay itself. Here's the structured framework: 8 categories of topics that produce strong essays, prompts to surface your specific ideas, 8 common traps to avoid, and tests to verify your topic will work before you invest in drafting."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section
        title="8 categories of strong essay topics"
        Icon={Lightbulb}
        description="Each category produces naturally specific, authentic essays. Use the prompts to surface your own ideas."
      >
        <div className="space-y-4">
          {TOPIC_CATEGORIES.map((tc) => (
            <article
              key={tc.category}
              className="dl-card-hover rounded-xl border p-5"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
            >
              <h3 className="mb-1 text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                {tc.category}
              </h3>
              <p className="mb-2.5 text-[13.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {tc.description}
              </p>
              <div className="mb-2.5">
                <p className="mb-1 text-[12.5px] font-medium" style={{ color: "#4A6FA5" }}>Prompts to try:</p>
                <ul className="space-y-1 ml-3">
                  {tc.prompts.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                      <HelpCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "#4A6FA5" }} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-[12.5px] italic" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                Why it works: {tc.why}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        title="8 topic traps to avoid"
        Icon={AlertCircle}
        description="Topics that seem strong but often produce weak essays."
      >
        <div className="space-y-3">
          {TOPIC_TRAPS.map((tt) => (
            <article
              key={tt.trap}
              className="dl-card-hover rounded-xl border p-4"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
            >
              <h3 className="mb-1 text-[14.5px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                {tt.trap}
              </h3>
              <p className="mb-1 text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {tt.problem}
              </p>
              <p className="text-[12.5px]" style={{ color: "#4A6FA5", fontWeight: 500 }}>
                Fix: {tt.fix}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        title="Topic test — before you draft"
        Icon={CheckCircle2}
        description="Run your topic through these 8 tests before investing in a full draft."
      >
        <ul className="space-y-2">
          {TOPIC_TESTS.map((t, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[14px] leading-relaxed">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "#4A6FA5" }} />
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="The honest truth about essay topics"
        Icon={Lightbulb}
      >
        <div
          className="rounded-2xl p-6"
          style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderLeft: "3px solid #4A6FA5" }}
        >
          <p className="mb-3 text-[14.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            There are no inherently bad essay topics. There are topics
            written generically vs topics written specifically. The same
            topic — &quot;cooking with my grandmother&quot; — can produce the
            strongest or weakest essay depending on how it&apos;s written.
            The topic is a vehicle; the quality is in the specificity,
            voice, and depth of reflection.
          </p>
          <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Choose a topic that&apos;s genuinely yours. Write it in your
            voice. Include the uncomfortable specifics. Trust that authentic
            specificity beats generic eloquence every time. The admissions
            reader who processes thousands of essays can tell the difference
            in seconds.
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

      {/* Related resources */}
      <section className="mt-10 mb-10">
        <h2
          className="mb-3 text-[17px] font-semibold"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          Related resources
        </h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/college-essay-revision-checklist"
            className="rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors hover:border-[#4A6FA5] hover:text-[#4A6FA5]"
            style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
          >
            Essay revision checklist
          </Link>
          <Link
            href="/personal-statement-guide"
            className="rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors hover:border-[#4A6FA5] hover:text-[#4A6FA5]"
            style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
          >
            Personal statement guide
          </Link>
          <Link
            href="/college-essay-examples"
            className="rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors hover:border-[#4A6FA5] hover:text-[#4A6FA5]"
            style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
          >
            College essay examples
          </Link>
        </div>
      </section>

      <MarketingCTA
        headline="Find the essay topic that's genuinely yours."
        description="AdmitPath helps you find, develop, and write college essays that sound like you — not like everyone else. Free plan included. Pro $19.99/mo."
        buttonText="Find your topic"
      />
    </MarketingLayout>
  );
}
