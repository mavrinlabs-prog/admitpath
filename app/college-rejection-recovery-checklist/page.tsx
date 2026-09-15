import type { Metadata } from "next";
import {
  Clock,
  Heart,
  CheckSquare,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { Section } from "@/components/marketing/Section";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Rejection Recovery Checklist — Action Plan",
  description:
    "Structured checklist for recovering from college rejection. Day 1, Week 1, Week 2, Month 1, Month 2 actions. Decisional moments. Mental health checkpoints.",
  alternates: { canonical: `${BASE}/college-rejection-recovery-checklist` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Rejection Recovery Checklist — Action Plan",
    description: "Day 1 through Month 2 checklist for recovering from college rejection. Mental health checkpoints included.",
    url: `${BASE}/college-rejection-recovery-checklist`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Rejection+Recovery+Checklist&subtitle=Day+1+through+Month+2+action+plan`, width: 1200, height: 630, alt: "Rejection Recovery Checklist" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Rejection Recovery Checklist", description: "Day 1 through Month 2 checklist for recovering from college rejection.", images: [`${BASE}/api/og?title=Rejection+Recovery+Checklist&subtitle=Day+1+through+Month+2+action+plan`] },
};

const DAY_1 = [
  "Allow yourself to feel devastated. Cry if needed. Yell into pillow if needed.",
  "Don't make any big decisions today. You're in acute emotional state.",
  "Don't post on social media. Sit with the rejection privately first.",
  "Don't compare to friends' results. Their outcomes aren't commentary on yours.",
  "Don't read 'why I got into X' content. Triggering and unhelpful.",
  "Don't reach out to admissions. They will not change their mind.",
  "Don't escalate to harming yourself in any way. Reach out to 988 if needed.",
  "Spend time with people who can hold space for your feelings.",
  "Eat. Drink water. Sleep when tired.",
  "Allow yourself to feel — not over it, not minimized. Just feel.",
];

const WEEK_1 = [
  "Notice your inner narrative. Watch what you tell yourself ('I'm not enough,' 'I'm a failure'). These are distorted.",
  "Reframe what rejection means: institutional decision based on factors largely outside your control, not referendum on your worth.",
  "Allow grief to move at its own pace. Not linear. Don't expect to be 'over it' on a specific timeline.",
  "Limit triggering content. Mute social media accounts. Skip articles about top admits. Limit conversations about admissions.",
  "Move your body daily. Walk, run, swim, lift, yoga — whatever you have access to. Endorphins help.",
  "Talk to someone you trust who can listen, not solve.",
  "Reconnect with what made you you. Activities, interests, relationships before applications.",
  "If pain is severe (suicidal thoughts, persistent despair): contact 988 Lifeline or therapist.",
  "Attend school normally. Don't isolate.",
  "Begin to consider what you're feeling and what would help.",
];

const WEEK_2 = [
  "Begin engaging with your admits. Look at specific programs, classes, professors, opportunities at the schools that admitted you.",
  "Visit your admit school if possible. The physical reality often shifts the imagined reality.",
  "Talk to current students at your admit. They can share what's actually like.",
  "Notice growth in retrospect. Many students who were rejected from dream schools end up loving the school they actually attended.",
  "Ask yourself: what specifically made the rejected school 'the dream'? Often, the answer is generic prestige, not specific things.",
  "If you've been catastrophizing ('my life is over'), that's distorted. Most rejection-from-dream-school students go on to fulfilling lives.",
  "Make small daily plans. Don't try to plan your whole future yet.",
  "Begin reconnecting with friends, family, hobbies. Avoid isolation.",
  "Consider talking to a counselor or therapist if pain is persistent.",
  "Keep moving your body, sleeping, eating. Fundamentals matter most now.",
];

const MONTH_1 = [
  "Make plans for senior summer. Trips, projects, friends, meaningful work. Things to look forward to.",
  "Set 6-month goals at your admit school. What do you want to accomplish in first 6 months?",
  "Connect with people who attended the school you'll attend. Older students, recent graduates, alumni in your target field.",
  "Begin pre-college reading, learning, building. Use the months between graduation and college purposefully.",
  "If a transfer or gap year is the right path: research seriously now. Don't make this decision in acute emotional state.",
  "If you're appealing or pursuing waitlist: do it in week 1-2. By month 1, the active phase is over.",
  "Consider if rejection has revealed something about your priorities or path. Does it change how you think about your future?",
  "If pain has not lessened or is worsening: see a counselor or therapist. This is treatable.",
  "Engage with the community of students who chose your admit. Often there are Discord servers, Facebook groups for incoming class.",
  "Forgive yourself for what you couldn't control. Stop reviewing the application searching for what you could've done differently.",
];

const MONTH_2_3 = [
  "Wholehearted commitment to your admit. The school you'll attend is the school that wanted you — engage with that fully.",
  "Continue planning summer and pre-college preparation.",
  "Notice how the pain has shifted. Most students at this point can imagine attending their admit with genuine excitement.",
  "Build relationships with future classmates if possible.",
  "Set physical, mental, and academic habits that will support college success.",
  "If there's any persistent disengagement or hopelessness, see a counselor. Pain shouldn't last this long without support.",
  "If there are specific programs at your admit you didn't know about, learn about them.",
  "Engage with content that's about your future at this school — alumni profiles, career paths, etc.",
  "Trust that what feels like loss now will, in retrospect, look different.",
  "Stop ruminating about the rejected school. Mental rehearsal of the rejection doesn't help.",
];

const DECISION_MOMENTS = [
  {
    moment: "Should I appeal?",
    when: "Within 1-2 weeks of rejection",
    framework: "Some schools allow reconsideration appeals. Generally low success rate (1-3% at top schools). Worth pursuing if: you have substantively new information (major awards, research breakthroughs, dramatic change in circumstances). Not worth it if you just want to argue.",
  },
  {
    moment: "Should I transfer in 1-2 years?",
    when: "Around month 2-3, when you've engaged with your admit",
    framework: "Transfer pipeline is real (UC TAG, Cornell Transfer Option, USC Transfer, etc.). Make this decision based on your year at admit school: if you genuinely thrive, stay. If you persistently feel mismatched, transfer is real option. Don't decide pre-college.",
  },
  {
    moment: "Should I take a gap year?",
    when: "Within 1-2 weeks of all decisions in",
    framework: "Gap year done well (work, internship, travel with substantive learning, build a project) can position you to reapply. Gap year done badly (drift, inactivity) hurts. Worth considering if: rejection was from your only acceptable school AND you have strong gap year plans. Not worth it if you have other admits you'd attend.",
  },
  {
    moment: "Should I focus on transferring to my rejected dream school?",
    when: "Throughout first year of college",
    framework: "Possible but rarely smart. Transfer admit rates at top private schools are typically 3-7% (very low). Better to engage with current school; if you genuinely don't fit there, transfer to a school where you would, not specifically the rejected school.",
  },
];

const MENTAL_HEALTH_CHECKPOINTS = [
  "Are you sleeping? Eating? Maintaining basic functions?",
  "Are you having any thoughts of self-harm? (Contact 988 Lifeline if yes.)",
  "Has your friend or family relationship pattern changed dramatically?",
  "Are you isolating significantly?",
  "Has your sense of identity been radically destabilized?",
  "Are you experiencing persistent low mood beyond 4-6 weeks?",
  "Are you using substances (drugs, alcohol, screens) to numb feelings?",
  "Have you talked to a counselor or therapist?",
];

const PAGE_FAQS = [
  { q: "How long does it take to recover from a college rejection?", a: "Most students feel the acute pain for 1-2 weeks, with gradual improvement over 1-2 months. By September, the majority of students who felt devastated in March are genuinely happy at their school. If pain persists beyond 4-6 weeks with no improvement, seek support from a counselor or therapist." },
  { q: "Should I take a gap year after being rejected?", a: "Only if: your strongest admits don't feel like fits, you have strong gap year plans (paid work, internship, structured program), and your family supports it. A well-structured gap year can strengthen a re-application. An unstructured one hurts. If you have admits you'd attend, start there." },
  { q: "When should I seek professional help after a rejection?", a: "If you're experiencing persistent low mood beyond 4-6 weeks, thoughts of self-harm (call 988 immediately), significant isolation, inability to maintain basic functions (sleep, eating, attending school), or substance use to numb feelings. These are treatable and support is available." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/college-rejection-recovery-checklist#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Rejection Recovery Checklist", item: `${BASE}/college-rejection-recovery-checklist` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/college-rejection-recovery-checklist#page`,
      url: `${BASE}/college-rejection-recovery-checklist`,
      name: "College Rejection Recovery Checklist — Day-by-Day Action Plan",
      description: "Structured checklist for recovering from college rejection. Day 1, Week 1, Week 2, Month 1, Month 2 actions.",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/college-rejection-recovery-checklist#breadcrumb` },
      inLanguage: "en-US",
    },
    {
      "@type": "HowTo",
      "@id": `${BASE}/college-rejection-recovery-checklist#howto`,
      name: "How to Recover from College Rejection",
      description: "Day-by-day action plan for processing college rejection and moving forward.",
      step: [
        { "@type": "HowToStep", position: 1, name: "Day 1: Acute response", text: "Allow yourself to feel the rejection. Don't make decisions, post on social media, or compare to friends." },
        { "@type": "HowToStep", position: 2, name: "Week 1: Initial processing", text: "Reframe rejection as institutional decision. Limit triggering content. Move your body daily. Talk to trusted adults." },
        { "@type": "HowToStep", position: 3, name: "Week 2: Forward motion", text: "Begin engaging with your admits. Visit if possible. Talk to current students at your admit schools." },
        { "@type": "HowToStep", position: 4, name: "Month 1: New reality", text: "Make plans for summer. Set goals at your admit school. Connect with future classmates." },
        { "@type": "HowToStep", position: 5, name: "Month 2-3: Forward engagement", text: "Wholehearted commitment to your admit. Build relationships with future classmates." },
      ],
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

function CheckList({ items, color = "#4A6FA5" }: { items: string[]; color?: string }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-[14px] leading-relaxed">
          <CheckSquare className="mt-0.5 h-4 w-4 shrink-0" style={{ color }} />
          <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function CollegeRejectionRecoveryChecklistPage() {
  return (
    <MarketingLayout
      eyebrow="Recovery Checklist"
      title="College Rejection Recovery Checklist"
      description="A structured day-by-day action plan for processing college rejection and moving forward. Day 1 actions, Week 1 priorities, decisional moments, mental health checkpoints. Use this when you don't know what to do next."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section
        title="Day 1 — Acute response"
        Icon={Heart}
        description="The first 24 hours after rejection. Allow yourself to feel without making decisions."
      >
        <CheckList items={DAY_1} />
      </Section>

      <Section
        title="Week 1 — Initial processing"
        Icon={Clock}
        description="Beginning to process the rejection without forcing yourself to be 'over it.'"
      >
        <CheckList items={WEEK_1} />
      </Section>

      <Section
        title="Week 2 — Beginning forward motion"
        Icon={Clock}
        description="Engaging with your admits while still processing the rejection."
      >
        <CheckList items={WEEK_2} />
      </Section>

      <Section
        title="Month 1 — Settling in to new reality"
        Icon={Calendar}
        description="The pain begins to shift; new direction begins to feel real."
      >
        <CheckList items={MONTH_1} />
      </Section>

      <Section
        title="Month 2-3 — Forward engagement"
        Icon={Calendar}
        description="The rejection becomes part of your story rather than dominating it."
      >
        <CheckList items={MONTH_2_3} />
      </Section>

      <Section
        title="Decisional moments"
        Icon={AlertCircle}
        description="Decisions you may face during recovery. Frameworks for thinking through each."
      >
        <div className="space-y-3">
          {DECISION_MOMENTS.map((d) => (
            <article
              key={d.moment}
              className="dl-card-hover rounded-xl border p-4"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
            >
              <h3 className="mb-1 text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                {d.moment}
              </h3>
              <p className="mb-1 text-[12.5px] font-medium" style={{ color: "#4A6FA5" }}>
                When: {d.when}
              </p>
              <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {d.framework}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        title="Mental health checkpoints"
        Icon={Heart}
        description="Periodic check-in questions. If multiple are concerning, get professional support."
      >
        <ul className="space-y-2">
          {MENTAL_HEALTH_CHECKPOINTS.map((c, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[14px] leading-relaxed">
              <Heart className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "#4A6FA5" }} />
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{c}</span>
            </li>
          ))}
        </ul>
        <div
          className="mt-4 rounded-xl p-4"
          style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderLeft: "3px solid #4A6FA5" }}
        >
          <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            <strong>Crisis line</strong>: 988 Suicide and Crisis Lifeline (call or text 988). If
            you&apos;re having thoughts of self-harm or suicide, contact them
            immediately. The pain you&apos;re feeling is real, and treatable.
          </p>
        </div>
      </Section>

      <Section
        title="The 5-year view"
        Icon={Calendar}
      >
        <div
          className="rounded-2xl p-6"
          style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderLeft: "3px solid #4A6FA5" }}
        >
          <p className="mb-3 text-[14.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            In 5 years, the rejection will feel like an old memory. In 10, you may be grateful you didn&apos;t attend the school you initially wanted. In 20, the school you actually attended will be a meaningful part of who you became. Many people who had successful careers, fulfilling relationships, and meaningful lives went to schools they weren&apos;t initially excited about.
          </p>
          <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            The school you attend is one variable; what matters more is what you do there. Build the experience you want at the school you&apos;ll attend. Trust that your path leads forward, even if the route is different than you imagined.
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
        headline="Build a balanced list — fewer rejections to recover from."
        description="AdmitPath helps you build a balanced school list with realistic Likely tier so this scenario is rare. Free plan included. Pro $19.99/mo."
        buttonText="Build calibrated list"
      />

      {/* Related resources */}
      <nav className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3" aria-label="Related resources">
        <a href="/college-rejection-recovery" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Rejection recovery guide</div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Paths forward: best admit, gap year, transfer pipeline.</div>
        </a>
        <a href="/transfer-college-strategy" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Transfer strategy</div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Top transfer pipelines and the why-transfer essay.</div>
        </a>
        <a href="/honors-college-explained" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Honors colleges explained</div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Ivy-quality at lower cost through honors programs.</div>
        </a>
      </nav>
    </MarketingLayout>
  );
}
