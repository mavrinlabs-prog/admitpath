import type { Metadata } from "next";
import {
  CheckSquare,
  Calendar,
  MapPin,
  Eye,
  PenLine,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { Section } from "@/components/marketing/Section";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "College Tour Checklist",
  description:
    "Campus visit checklist: what to do before, during, and after. Questions to ask, hidden things to look for, and post-visit notes.",
  alternates: { canonical: `${BASE}/college-tour-checklist` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "College Tour Checklist — Campus Visit Guide",
    description: "Campus visit checklist: what to do before, during, and after. Questions to ask and hidden things to look for.",
    url: `${BASE}/college-tour-checklist`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=College+Tour+Checklist&subtitle=Pre+%C2%B7+during+%C2%B7+after+visit`, width: 1200, height: 630, alt: "College Tour Checklist" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "College Tour Checklist", description: "Campus visit checklist: before, during, and after.", images: [`${BASE}/api/og?title=College+Tour+Checklist&subtitle=Pre+%C2%B7+during+%C2%B7+after+visit`] },
};

const PRE_VISIT = [
  "Email a current student in your intended major (department coordinator can connect you).",
  "Check the campus events calendar; schedule visit around an event you'd attend if enrolled.",
  "Read r/[School Name] subreddit, sorting by 'top of the year' for honest student opinion.",
  "Identify 1-2 specific classes you'd want to sit in on — email departments a week ahead.",
  "Plan dining-hall meals (twice if possible — different times of day reveal different cultures).",
  "Skip the morning admissions info session unless you've never heard of the school. Most info is on the website.",
  "Bring a small notebook for real-time notes (you'll forget more than you'd expect).",
  "Wear comfortable walking shoes. Most tours are 60-90 minutes of walking.",
];

const DURING_VISIT_TOUR = [
  "Take the tour — but treat the official tour as one data point, not the visit.",
  "Note what your tour guide DOESN'T mention. The omissions reveal pain points.",
  "Ask your tour guide a specific question: \"What's the worst thing about being here?\" Watch for the honest answer vs the rehearsed one.",
];

const DURING_VISIT_FOOD = [
  "Eat in the dining hall during a normal meal time (lunch is best — most students there).",
  "Notice what students are eating. The food quality hints at how the school treats students.",
  "Notice who's sitting with whom. Diverse mixing or self-segregated cliques?",
  "Notice noise level. Lively or library-quiet?",
];

const DURING_VISIT_CLASS = [
  "Sit in on one class in your intended major (email department a week ahead to arrange).",
  "Watch the dynamic: are students engaged or scrolling phones?",
  "Is the professor teaching from a textbook, or from their own research?",
  "Are there grad students teaching, or the professor of record?",
];

const DURING_VISIT_DORM = [
  "Walk through a residential hall — not just the show dorm.",
  "Ask to see a typical first-year double, not the upperclass-suite-with-balcony.",
  "Observe how students socialize in common areas.",
];

const DURING_VISIT_EVENING = [
  "Stay for an evening on campus if you can.",
  "Friday night vibe tells you what student social life is actually like.",
  "Saturday morning library tells you about academic culture.",
  "Walk around the campus after dark. Does it feel safe? Are people out?",
];

const QUESTIONS = [
  "What's the worst thing about being here?",
  "What did you assume about this school before you came that turned out to be wrong?",
  "If you had to do college over, would you come here? Why or why not?",
  "What kind of student is happiest here? What kind of student should NOT come here?",
  "What's something the admissions tour doesn't mention that I should know?",
  "Where do most students live during their junior/senior year?",
  "How do students in your major get internships? Is it self-driven or organized?",
  "Who's the best professor in [my intended department]? Who should I avoid?",
  "How would you describe the social scene? What's the alternative if I don't drink?",
  "Have you ever wanted to transfer? Why didn't you?",
];

const POST_VISIT = [
  "Write notes that same day. Memory degrades fast.",
  "Note: what surprised you (positively or negatively)?",
  "Note: what specific moments stood out?",
  "Note: did you see yourself there? Be honest with yourself.",
  "Note: who would you not want to be friends with that you saw?",
  "Note: questions you still have that you'd email a current student about.",
  "Compare your notes across schools when decision time arrives.",
  "Don't decide based on a single visit — but use the visit data when you decide.",
];

const VIRTUAL_SUBSTITUTES = [
  { name: "YouTube vlogs from current students", url: "Search '[School] day in the life' or 'why I chose [School]'" },
  { name: "r/[School Name] subreddit", url: "Filter by 'top of year' for honest perspective" },
  { name: "Email a current student directly", url: "Through department coordinators or club advisors" },
  { name: "Niche video reviews", url: "Student-recorded, unscripted, often more revealing than tours" },
  { name: "Virtual tours via the school's website", url: "Less useful than the above — but covers physical campus" },
];

const TOUR_FAQS = [
  { q: "When is the best time to visit colleges?", a: "During the regular school year when classes are in session -- not during breaks or summer. Spring of junior year and fall of senior year are most common. Admitted student days in April are the best for final decisions." },
  { q: "How many colleges should I visit?", a: "Visit your top 5-8 choices if possible. Prioritize schools you're seriously considering, especially your ED choice if applicable. Virtual alternatives can supplement but not replace in-person visits for your top picks." },
  { q: "Does visiting help my admissions chances?", a: "At schools that track demonstrated interest (Tulane, Northeastern, NYU, Wake Forest), visiting can help. Most Ivies, MIT, and Stanford do not track visits. Check each school's policy -- the Common Data Set Section C7 lists whether demonstrated interest is considered." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/college-tour-checklist#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "College Tour Checklist", item: `${BASE}/college-tour-checklist` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/college-tour-checklist#page`,
      url: `${BASE}/college-tour-checklist`,
      name: "College Tour Checklist — Pre, During, After Visit",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/college-tour-checklist#breadcrumb` },
      inLanguage: "en-US",
    },
    {
      "@type": "HowTo",
      "@id": `${BASE}/college-tour-checklist#howto`,
      name: "How to Get the Most from a College Visit",
      description: "Step-by-step guide to making college campus visits productive and informative.",
      step: [
        { "@type": "HowToStep", position: 1, name: "Pre-visit research", text: "Email current students, check campus events, identify classes to sit in on, and plan dining hall meals." },
        { "@type": "HowToStep", position: 2, name: "Take the official tour", text: "Note what the tour guide doesn't mention. Ask specific questions about challenges." },
        { "@type": "HowToStep", position: 3, name: "Eat in the dining hall", text: "Observe student social dynamics, food quality, and campus culture during a normal meal time." },
        { "@type": "HowToStep", position: 4, name: "Sit in on a class", text: "Attend a class in your intended major. Watch student engagement and teaching quality." },
        { "@type": "HowToStep", position: 5, name: "Explore dorms and evening life", text: "Walk through residential halls and stay for an evening if possible." },
        { "@type": "HowToStep", position: 6, name: "Take notes the same day", text: "Write detailed observations while they're fresh. Compare notes across schools later." },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: TOUR_FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

function ChecklistSection({
  title,
  Icon,
  items,
}: {
  title: string;
  Icon: typeof CheckSquare;
  items: string[];
}) {
  return (
    <section className="mb-8">
      <h3
        className="mb-3 flex items-center gap-2 text-[16px] font-semibold"
        style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
      >
        <Icon className="h-4 w-4" style={{ color: "#4A6FA5" }} />
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[14px] leading-relaxed">
            <CheckSquare className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
            <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function CollegeTourChecklistPage() {
  return (
    <MarketingLayout
      eyebrow="Campus Visits"
      title="College Tour Checklist"
      description="What to do before, during, and after a campus visit. Plus the questions actually worth asking, and what to do if you can't visit in person."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Pre-visit */}
      <Section title="Before you go" Icon={Calendar}>
        <ChecklistSection title="Pre-visit prep" Icon={CheckSquare} items={PRE_VISIT} />
      </Section>

      {/* During visit */}
      <Section title="During the visit" Icon={MapPin}>
        <ChecklistSection title="The official tour" Icon={CheckSquare} items={DURING_VISIT_TOUR} />
        <ChecklistSection title="The dining hall" Icon={CheckSquare} items={DURING_VISIT_FOOD} />
        <ChecklistSection title="A class in your intended major" Icon={CheckSquare} items={DURING_VISIT_CLASS} />
        <ChecklistSection title="The dorms" Icon={CheckSquare} items={DURING_VISIT_DORM} />
        <ChecklistSection title="An evening on campus" Icon={CheckSquare} items={DURING_VISIT_EVENING} />
      </Section>

      {/* Questions to ask */}
      <Section title="Questions to ask current students" Icon={PenLine}
        description='Skip generic questions ("What do you like about [school]?") — students give the rehearsed answer. Try these instead. Honest answers reveal more than the official tour does.'
      >
        <div
          className="rounded-xl border p-5"
          style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
        >
          <ol className="space-y-2.5">
            {QUESTIONS.map((q, i) => (
              <li key={i} className="flex items-start gap-3 text-[14px] leading-relaxed">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                  style={{ background: "#4A6FA5" }}
                >
                  {i + 1}
                </span>
                <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{q}</span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Post visit */}
      <Section title="After the visit" Icon={PenLine}>
        <ChecklistSection title="Take notes the same day" Icon={CheckSquare} items={POST_VISIT} />
      </Section>

      {/* Virtual substitutes */}
      <Section title="If you can't visit in person" Icon={Eye}
        description="Virtual visits cover physical campus but miss the vibe. The best substitutes for real visits are unscripted student content."
      >
        <ul className="space-y-2.5">
          {VIRTUAL_SUBSTITUTES.map((v, i) => (
            <li
              key={i}
              className="dl-card-hover rounded-xl border p-4"
              style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
            >
              <p
                className="mb-1 text-[14px] font-semibold"
                style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
              >
                {v.name}
              </p>
              <p className="text-[13px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                {v.url}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* FAQ */}
      <Section title="Frequently asked questions" Icon={PenLine}>
        <div className="space-y-3">
          {TOUR_FAQS.map(({ q, a }) => (
            <details key={q} className="dl-card-hover rounded-2xl border p-5" style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}>
              <summary className="cursor-pointer font-bold text-base" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{q}</summary>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}>{a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <MarketingCTA
        headline="Track your campus visits"
        description="Keep post-visit notes per school in AdmitPath's college list builder."
        buttonText="Build your college list"
      />
    </MarketingLayout>
  );
}
