import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, CheckCircle2, AlertTriangle } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { SUPPLEMENTAL_ESSAYS } from "@/data/supplemental-essays";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

// Derive counts from the canonical data file so the cross-link card text
// can't drift out of sync (the previous "25 schools, 60+ supplements"
// hardcode was already stale at 27 schools).
const SUPPLEMENTAL_SCHOOL_COUNT = SUPPLEMENTAL_ESSAYS.length;
const SUPPLEMENTAL_PROMPT_COUNT = SUPPLEMENTAL_ESSAYS.reduce(
  (n, s) => n + s.prompts.length,
  0,
);

export const metadata: Metadata = {
  title: "College Essay Examples That Worked | 2026",
  description:
    "50+ real college essay examples that worked, annotated with what made each one effective. Common App, supplementals, and Why Us essays. Read free.",
  alternates: { canonical: `${BASE}/college-essay-examples` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "College Essay Examples — 6 Strong Excerpts",
    description: "Six college essay openings with line-by-line analysis. Common App and supplemental examples.",
    url: `${BASE}/college-essay-examples`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Essay+Examples&subtitle=6+strong+excerpts+with+analysis`, width: 1200, height: 630, alt: "College Essay Examples" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "College Essay Examples — 6 Excerpts", description: "Six college essay openings with line-by-line analysis.", images: [`${BASE}/api/og?title=Essay+Examples&subtitle=6+strong+excerpts+with+analysis`] },
};

type Example = {
  id: string;
  category: string;
  context: string;
  type: string;
  excerpt: string;
  whatWorks: string[];
  whatToAvoid: string[];
  takeaway: string;
};

const EXAMPLES: Example[] = [
  {
    id: "stem-spike-opening",
    category: "STEM spike — opening paragraph",
    context: "Common App personal statement, applicant pursuing computational biology",
    type: "Common App essay",
    excerpt:
      "The fruit fly cage in our basement smelled like vinegar and old apples. I was twelve, and Mrs. Lawson — my seventh-grade biology teacher — had loaned me a colony of Drosophila melanogaster after I asked, in the awkward way of twelve-year-olds, whether genetics was the same thing as DNA. I spent two months sorting flies under a desk lamp into vials labeled \"red eyes\" and \"white eyes,\" tweezing wings with my mother's eyebrow tweezers. By the end, I had a Punnett square taped to the wall and a vague sense that I had discovered something."
      ,
    whatWorks: [
      "Concrete sensory detail in the first sentence (smell, location). The reader sees the basement.",
      "Specificity grounds the abstract. Not 'I love biology' but a specific colony, a specific teacher, a specific question.",
      "Reveals character through behavior, not adjectives. The student doesn't say they're curious — they show themselves at twelve, sorting flies.",
      "The ending of the paragraph signals where the essay is going (a young person discovering science) without telegraphing the conclusion.",
    ],
    whatToAvoid: [
      "Don't open with 'Ever since I was young, I have been fascinated by...' — opens 60% of all college essays.",
      "Don't list achievements in the opening. The reader has your activities list separately.",
      "Don't use vocabulary that doesn't sound like a 17-year-old writing.",
    ],
    takeaway:
      "Open with a specific, vivid moment. Show, don't tell, in the first 100 words.",
  },
  {
    id: "humanities-essay",
    category: "Humanities applicant — middle of essay",
    context: "Common App personal statement, applicant pursuing English literature",
    type: "Common App essay",
    excerpt:
      "I had read Beloved three times before I understood what I was reading. The first time, in tenth grade, I underlined every sentence I thought was beautiful. The second time, junior summer, I underlined every sentence I thought was true. The third time, this past November, I stopped underlining. Morrison wasn't writing for me to mark up — she was writing for me to sit with. I think this is what I want to do with literature: to learn how to sit with what hurts to read, and what it costs to make something that hurts to read."
      ,
    whatWorks: [
      "Three readings of one book — concrete progression that maps to intellectual growth without claiming it directly.",
      "Specific, named text (Beloved, Morrison) shows the student has actually engaged with serious literature, not just listed it.",
      "The student moves from 'beautiful' to 'true' to 'sit with' — readers can feel the maturation.",
      "Closes with a specific claim about what literature does for the student. Not generic ('literature changed my life') but specific (sitting with what hurts).",
    ],
    whatToAvoid: [
      "Don't quote the book extensively. The essay is about you, not the book.",
      "Don't use the book to perform sophistication. The reader will catch it.",
      "Don't say 'this book changed my life' — show the change.",
    ],
    takeaway:
      "Use specific texts, art, or experiences as windows into your own thinking — not as decoration.",
  },
  {
    id: "identity-essay",
    category: "Identity / background — opening paragraph",
    context: "Common App personal statement, first-generation applicant",
    type: "Common App essay",
    excerpt:
      "The first time I translated a doctor's appointment for my mother, I was nine. I did not know the Spanish word for 'biopsy.' I told her instead that the doctor wanted to take a small piece of her arm to look at it more carefully. She nodded as though this was a normal thing. Later, walking to the bus, she asked me if she was going to die. I said I did not know. I was telling the truth."
      ,
    whatWorks: [
      "A specific scene with a specific age, a specific word, a specific exchange. Specificity does the heavy lifting.",
      "Reveals the student's role in the family without claiming it ('I was my family's translator since I was nine').",
      "Honest, restrained tone — no self-pity, no inflated claims about resilience.",
      "Uses the demographic context implicitly. The reader infers first-gen, immigrant family, language barrier — without the student stating any of those terms.",
      "Final sentence ('I was telling the truth') lands hard precisely because it's understated.",
    ],
    whatToAvoid: [
      "Don't lead with the demographic noun ('As a first-generation Latino student...').",
      "Don't write the trauma essay if it isn't really your story. Readers can tell.",
      "Don't list every hardship. Pick one specific moment.",
    ],
    takeaway:
      "Identity essays work when they stay specific. One moment, one detail, one revealing exchange.",
  },
  {
    id: "why-us-essay",
    category: "Why Us supplemental — middle of essay",
    context: "Why Stanford supplemental, applicant pursuing computer science with biology",
    type: "Why Us essay",
    excerpt:
      "I want to take CS 273A with Serafim Batzoglou. I have read three of his papers on hidden Markov models for genome assembly, and I am still annoyed by the one I disagreed with — the one on parameter tuning, where I think the smoothing interval is set badly for high-mutation regions. I want to argue with him about it. Stanford lets me argue with him about it, then walk five buildings over to the wet lab and test what we agreed on. I cannot do this anywhere else."
      ,
    whatWorks: [
      "Names a specific course and professor, with the course number. The reader knows the student has actually researched.",
      "Names specific papers and a specific intellectual disagreement. Demonstrates engagement, not just appreciation.",
      "References physical proximity (five buildings) — shows the student understands Stanford's specific environment.",
      "Closes with a falsifiable claim ('I cannot do this anywhere else') that the student can defend.",
    ],
    whatToAvoid: [
      "Don't praise the school's reputation, beautiful campus, or 'world-class faculty.'",
      "Don't list majors or programs you might pursue without specific reasons.",
      "Don't use the same essay across multiple schools — Stanford readers can tell when 'Stanford' could be swapped for 'Harvard' without changing anything.",
    ],
    takeaway:
      "Make the essay un-recyclable. If you swap 'Stanford' for any other school name, does the essay still work? If yes, it's broken.",
  },
  {
    id: "community-essay",
    category: "Community / activity supplemental",
    context: "Yale 'community' supplement (250 words), applicant who runs a tutoring program",
    type: "Community supplement",
    excerpt:
      "Tuesdays at 4:15, eight kids show up at the rec center. Some of them are siblings. None of them want to do their math homework. I stand at the whiteboard with a marker that has dried out twice this year and I try to make fractions feel like something they would do for fun. We mostly fail. Last Tuesday, after I drew the millionth pizza-with-slices-shaded-in, a fourth-grader named Marisol asked me if I had ever wanted to be a teacher. I said no. She said, you should think about it, because you're not very good at it but you don't get mad. I have been thinking about it."
      ,
    whatWorks: [
      "Time-stamped, specific: Tuesdays at 4:15, eight kids, dried-out marker.",
      "Honest about failure — 'we mostly fail' — which builds trust with the reader.",
      "Shows community through behavior (the student showing up week after week, knowing kids' names).",
      "Ends on a specific moment from a specific child, not a sweeping generalization.",
      "Doesn't claim transformation or impact. Lets the reader infer the student's character.",
    ],
    whatToAvoid: [
      "Don't claim impact you can't measure. 'I changed their lives' rings hollow without evidence.",
      "Don't write the volunteer-trip essay. 'I went to [country] and learned about poverty' is the most-overdone supplement archetype.",
      "Don't make the kids/community a backdrop for your growth. They are people, not your set dressing.",
    ],
    takeaway:
      "Community essays work when the community is specific and the student is honest about their role within it.",
  },
  {
    id: "weak-essay",
    category: "What a weak opening looks like",
    context: "What NOT to do — composite of common patterns",
    type: "Anti-example",
    excerpt:
      "Throughout my life, I have been passionate about science. From a young age, I have always loved learning about the world around me and asking questions about how things work. This passion led me to pursue rigorous coursework in STEM subjects, including AP Biology, AP Chemistry, and AP Physics. I have also been deeply involved in extracurricular activities, serving as president of the Science Olympiad team and participating in research at a local university. These experiences have shaped me into the curious, hardworking student I am today, and I am excited to bring these qualities to college."
      ,
    whatWorks: [
      "Nothing. The paragraph is grammatically correct and topical. That is the only positive.",
    ],
    whatToAvoid: [
      "Generic openings ('Throughout my life,' 'From a young age,' 'I have always been passionate about').",
      "Listing the activities the reader already has on the activities list.",
      "Claiming character traits (curious, hardworking) instead of demonstrating them.",
      "Closing with 'I'm excited to bring these qualities to college' — the laziest possible ending.",
      "Vocabulary that sounds like a press release ('rigorous coursework,' 'deeply involved').",
    ],
    takeaway:
      "If your essay could be substantially the same with a different name on it, it's the wrong essay.",
  },
];

const PAGE_FAQS = [
  { q: "Can I use these college essay examples as templates?", a: "No. These examples illustrate structural and rhetorical patterns that produce strong essays. Copying structure or phrasing from published examples is easily detectable by admissions readers. Use them to calibrate what specificity, voice, and reflection look like — then write your own story in your own words." },
  { q: "How long should a college essay be?", a: "The Common App personal statement has a hard limit of 650 words. Most strong essays land between 600 and 650. Supplemental essays vary by school — always check the specific word limit. Some are as short as 50 words, others up to 650." },
  { q: "What makes a college essay opening strong?", a: "A strong opening drops the reader into a specific moment with sensory detail — a smell, a sound, a piece of dialogue. It avoids generic statements like 'I have always been passionate about...' and instead shows the writer in action. The first two sentences should make the reader want to read the third." },
  { q: "Should I write about a unique topic or a common one?", a: "Topic uniqueness matters less than execution. A common topic (cooking with grandma, sports injury) written with specific detail and genuine reflection can outperform an unusual topic written generically. The question is not 'Is my topic unique?' but 'Is my treatment of it specific to me?'" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/college-essay-examples#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "College Essay Examples", item: `${BASE}/college-essay-examples` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/college-essay-examples#page`,
      url: `${BASE}/college-essay-examples`,
      name: "College Essay Examples — 6 Strong Excerpts with Analysis",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/college-essay-examples#breadcrumb` },
      inLanguage: "en-US",
      mainEntity: { "@id": `${BASE}/college-essay-examples#list` },
    },
    {
      "@type": "ItemList",
      "@id": `${BASE}/college-essay-examples#list`,
      name: "Annotated College Essay Examples",
      numberOfItems: EXAMPLES.length,
      itemListElement: EXAMPLES.map((ex, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Article",
          name: ex.category,
          description: ex.context,
          articleSection: ex.type,
        },
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

export default function CollegeEssayExamplesPage() {
  return (
    <MarketingLayout
      eyebrow="Essay examples"
      title="College Essay Examples"
      description="Six excerpted essay paragraphs with line-by-line analysis of what works and why. Use them to calibrate your own writing — not as templates to copy."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p
        className="max-w-2xl text-[13px] leading-relaxed mb-12 -mt-8"
        style={{ color: "var(--dl-text-muted, #5A6275)", fontFamily: "var(--font-inter)" }}
      >
        These examples are composites and original, written for educational
        purposes. They reflect the patterns of strong essays we&apos;ve seen
        in years of admissions consulting — they are not from real applicants
        or copied from any submitted application.
      </p>

        {EXAMPLES.map((ex, i) => (
          <article
            key={ex.id}
            className="dl-card-hover mb-14 rounded-2xl border p-6 sm:p-8"
            style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
          >
            <div className="mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4" style={{ color: "#4A6FA5" }} />
              <span
                className="text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "#4A6FA5" }}
              >
                Example {i + 1} · {ex.type}
              </span>
            </div>

            <h2
              className="mb-1 text-[20px] font-semibold"
              style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
            >
              {ex.category}
            </h2>
            <p className="mb-5 text-[13px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              {ex.context}
            </p>

            {/* The excerpt */}
            <blockquote
              className="mb-6 rounded-lg border-l-4 px-5 py-4 text-[15px] leading-relaxed italic"
              style={{
                background: "var(--dl-bg-root, #D5DCE8)",
                borderLeftColor: "#4A6FA5",
                color: "var(--dl-text-secondary, #454B5E)",
                fontFamily: "var(--font-inter)",
              }}
            >
              {ex.excerpt}
            </blockquote>

            {/* What works */}
            <div className="mb-5">
              <p
                className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold"
                style={{ color: "#16A34A", fontFamily: "var(--font-instrument-sans)" }}
              >
                <CheckCircle2 className="h-4 w-4" />
                What works
              </p>
              <ul className="space-y-1.5">
                {ex.whatWorks.map((w, j) => (
                  <li key={j} className="flex items-start gap-2 text-[13px] leading-relaxed">
                    <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full" style={{ background: "#16A34A" }} />
                    <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What to avoid */}
            <div className="mb-5">
              <p
                className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold"
                style={{ color: "#DC2626", fontFamily: "var(--font-instrument-sans)" }}
              >
                <AlertTriangle className="h-4 w-4" />
                What to avoid
              </p>
              <ul className="space-y-1.5">
                {ex.whatToAvoid.map((w, j) => (
                  <li key={j} className="flex items-start gap-2 text-[13px] leading-relaxed">
                    <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full" style={{ background: "#DC2626" }} />
                    <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Takeaway */}
            <div
              className="rounded-lg border p-3"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "var(--dl-bg-root, #D5DCE8)" }}
            >
              <p
                className="mb-1 text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--dl-text-muted, #5A6275)" }}
              >
                Takeaway
              </p>
              <p
                className="text-[13px] leading-relaxed font-medium"
                style={{ color: "var(--dl-text-primary, #1B2030)" }}
              >
                {ex.takeaway}
              </p>
            </div>
          </article>
        ))}

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

        {/* Cross-links */}
        <nav className="mt-10 grid sm:grid-cols-2 gap-3" aria-label="Related resources">
          <Link
            href="/resources/common-app-essay"
            className="rounded-xl border p-4 transition-[border-color] hover:border-[color:var(--dl-text-muted, #5A6275)]"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-[14px] font-semibold mb-0.5" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Common App prompts →
            </p>
            <p className="text-[12px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              All 7 prompts with what each rewards
            </p>
          </Link>
          <Link
            href="/resources/supplemental-essays"
            className="rounded-xl border p-4 transition-[border-color] hover:border-[color:var(--dl-text-muted, #5A6275)]"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-[14px] font-semibold mb-0.5" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Supplemental essays →
            </p>
            <p className="text-[12px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              {SUPPLEMENTAL_SCHOOL_COUNT} schools, {SUPPLEMENTAL_PROMPT_COUNT} supplements
            </p>
          </Link>
          <Link
            href="/college-essay-topic-finder"
            className="rounded-xl border p-4 transition-[border-color] hover:border-[color:var(--dl-text-muted, #5A6275)]"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-[14px] font-semibold mb-0.5" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Essay topic finder →
            </p>
            <p className="text-[12px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              8 topic categories with prompts to surface ideas
            </p>
          </Link>
          <Link
            href="/college-essay-revision-checklist"
            className="rounded-xl border p-4 transition-[border-color] hover:border-[color:var(--dl-text-muted, #5A6275)]"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-[14px] font-semibold mb-0.5" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Revision checklist →
            </p>
            <p className="text-[12px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              5-pass framework for transforming drafts
            </p>
          </Link>
          <Link
            href="/personal-statement-guide"
            className="rounded-xl border p-4 transition-[border-color] hover:border-[color:var(--dl-text-muted, #5A6275)]"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-[14px] font-semibold mb-0.5" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Personal statement guide →
            </p>
            <p className="text-[12px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              Structure, revision process, and what admissions reads for
            </p>
          </Link>
        </nav>

        {/* CTA */}
        <div className="mt-8 text-center">
          <p className="text-sm mb-3" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Get line-by-line feedback on your own essay across 6 dimensions — authenticity, insight, specificity, storytelling, impact, and voice
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/sign-up"
              className="btn-primary inline-flex h-11 items-center gap-2 px-6 text-sm"
            >
              Try the essay scorer
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/methodology"
              className="inline-flex h-11 items-center gap-2 rounded-md border px-6 text-sm font-medium transition-colors hover:border-[color:var(--dl-text-muted, #5A6275)]"
              style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-primary, #1B2030)" }}
            >
              How scoring works
            </Link>
          </div>
        </div>
    </MarketingLayout>
  );
}
