import Link from "next/link";
import type { Metadata } from "next";
import { Calendar, CheckCircle2 } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "College Application Timeline 2026",
  description:
    "A complete month-by-month timeline for college applications from freshman year through senior spring. Know exactly what to do and when.",
  alternates: { canonical: `${BASE}/timeline` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "College Application Timeline — Month-by-Month",
    description: "Complete month-by-month timeline from freshman year through senior spring. Know exactly what to do and when.",
    url: `${BASE}/timeline`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Application+Timeline&subtitle=Freshman+through+senior+spring`, width: 1200, height: 630, alt: "College Application Timeline" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "College Application Timeline — Month-by-Month", description: "Complete timeline from freshman year through senior spring.", images: [`${BASE}/api/og?title=Application+Timeline&subtitle=Freshman+through+senior+spring`] },
};

const TIMELINE = [
  {
    period: "Freshman Year (Grade 9)",
    months: [
      {
        label: "Fall–Spring",
        items: [
          "Focus on grades. Build the GPA foundation — it is nearly impossible to recover from a weak freshman year.",
          "Explore 4–5 extracurriculars. Join clubs, try new things. No commitment pressure yet.",
          "Start reading widely outside of school. Intellectual curiosity starts now.",
          "Talk to your guidance counselor about course planning for 4 years.",
        ],
      },
    ],
  },
  {
    period: "Sophomore Year (Grade 10)",
    months: [
      {
        label: "Fall",
        items: [
          "Take the PSAT (practice run — score does not count for National Merit yet).",
          "Narrow extracurriculars to 2–3 you care most about. Start taking leadership roles.",
          "Begin exploring summer program options for next summer.",
        ],
      },
      {
        label: "Spring",
        items: [
          "Register for AP/IB courses for junior year. Aim for 3–5 APs total by graduation.",
          "Apply to selective summer programs (RSI, MITES, TASP deadlines are Jan–Mar).",
          "Start a personal project related to your spike. Research, build, create.",
        ],
      },
    ],
  },
  {
    period: "Junior Year (Grade 11)",
    months: [
      {
        label: "September",
        items: [
          "Take the PSAT/NMSQT in October — this one counts for National Merit.",
          "Start test prep for SAT or ACT. Take a diagnostic to see where you stand.",
          "Identify 2 teachers for recommendation letters (one STEM, one humanities).",
        ],
      },
      {
        label: "October–November",
        items: [
          "Take the PSAT/NMSQT.",
          "Begin building your preliminary college list. Use AdmitPath's chances calculator.",
          "Attend college fairs and info sessions (virtual or in-person).",
        ],
      },
      {
        label: "December–January",
        items: [
          "Take the SAT or ACT for the first time.",
          "Research summer programs, internships, or research opportunities for the coming summer.",
          "Start brainstorming Common App essay topics. Keep a journal of ideas.",
        ],
      },
      {
        label: "February–March",
        items: [
          "Retake SAT/ACT if needed (most students see improvement on second attempt).",
          "Ask teachers for recommendation letters. Give them at least 6 weeks' notice.",
          "Visit colleges during spring break if possible. Virtual tours otherwise.",
        ],
      },
      {
        label: "April–May",
        items: [
          "Take AP exams.",
          "Finalize your college list: 2–3 reaches, 3–5 targets, 2–3 safeties.",
          "Write your first draft of the Common App personal essay.",
          "Ask a trusted adult or teacher to read your essay draft.",
        ],
      },
      {
        label: "Summer before Senior Year",
        items: [
          "Polish your Common App essay through multiple drafts.",
          "Start supplemental essays for early-round schools.",
          "Update your activity list — refine descriptions, quantify impact.",
          "Finalize test scores. Last SAT/ACT attempt should be by October at the latest.",
          "Run your profile through AdmitPath's analysis to identify gaps.",
        ],
      },
    ],
  },
  {
    period: "Senior Year (Grade 12)",
    months: [
      {
        label: "September",
        items: [
          "Finalize Common App personal essay.",
          "Submit FAFSA (opens October 1) and CSS Profile as soon as possible.",
          "Complete early-round supplemental essays.",
          "Confirm recommendation letters are submitted.",
          "Send official test scores to schools.",
        ],
      },
      {
        label: "October",
        items: [
          "Last SAT/ACT test date for early rounds.",
          "Complete and review all EA/ED/REA applications.",
          "Submit FAFSA and CSS Profile.",
          "Double-check all application components: transcripts, scores, essays, recommendations.",
        ],
      },
      {
        label: "November 1",
        items: [
          "EA/ED/REA applications due at most schools.",
          "Begin regular-decision supplemental essays immediately.",
          "Do not coast on grades — senior year transcript matters.",
        ],
      },
      {
        label: "December",
        items: [
          "Receive early-round decisions (typically mid-December).",
          "If deferred: write a Letter of Continued Interest (LOCI).",
          "If rejected ED: submit ED II application if you have a backup.",
          "Continue polishing regular-decision supplements.",
        ],
      },
      {
        label: "January 1–15",
        items: [
          "Regular decision and ED II applications due.",
          "Submit all remaining financial aid materials.",
          "Send mid-year school report through your counselor.",
        ],
      },
      {
        label: "February–March",
        items: [
          "Wait. Focus on grades and enjoy senior year.",
          "Apply for external scholarships (QuestBridge, Gates, Coca-Cola, etc.).",
          "Some schools send likely letters in February.",
          "Regular decision results arrive late March to early April.",
        ],
      },
      {
        label: "April",
        items: [
          "Review all admission and financial aid offers.",
          "Attend admitted students days (virtual or in-person).",
          "Compare net price across schools — not sticker price.",
          "If waitlisted: send a LOCI and any significant updates.",
        ],
      },
      {
        label: "May 1",
        items: [
          "National Decision Day — submit your enrollment deposit.",
          "Withdraw from all other schools.",
          "Send final transcript when available.",
          "Celebrate. You made it.",
        ],
      },
    ],
  },
];

const timelineSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${BASE}/timeline#page`,
      url: `${BASE}/timeline`,
      name: "College Application Timeline — Month-by-Month Guide",
      isPartOf: { "@id": `${BASE}/#website` },
      inLanguage: "en-US",
      mainEntity: { "@id": `${BASE}/timeline#howto` },
    },
    {
      "@type": "HowTo",
      "@id": `${BASE}/timeline#howto`,
      name: "College Application Timeline — Month by Month",
      description:
        "A complete month-by-month timeline for college applications from freshman year through senior spring.",
      totalTime: "P4Y",
      step: TIMELINE.flatMap((period, pi) =>
        period.months.map((m, mi) => ({
          "@type": "HowToStep",
          position: pi * 10 + mi + 1,
          name: `${period.period} — ${m.label}`,
          itemListElement: m.items.map((text, i) => ({
            "@type": "HowToDirection",
            position: i + 1,
            text,
          })),
        })),
      ),
    },
  ],
};

export default function TimelinePage() {
  return (
    <MarketingLayout
      eyebrow="Reference"
      title="Application Timeline"
      description="A month-by-month guide from freshman year through May 1 decision day. Knowing what to do — and when — is half the battle."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(timelineSchema) }}
      />

      {/* Quick nav */}
      <div className="mb-10 flex flex-wrap gap-1.5">
        {TIMELINE.map((section) => (
          <a
            key={section.period}
            href={`#${section.period.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            className="rounded-full border px-3 py-1 text-[12px] font-medium transition-colors hover:border-[color:#4A6FA5]"
            style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
          >
            {section.period}
          </a>
        ))}
      </div>

      {/* Timeline sections */}
      {TIMELINE.map((section) => (
        <section
          key={section.period}
          className="mb-12"
          id={section.period.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
        >
          <h2
            className="mb-5 flex items-center gap-2 text-[20px] font-semibold"
            style={{
              color: "var(--dl-text-primary, #1B2030)",
              fontFamily: "var(--font-inter)",
            }}
          >
            <Calendar className="h-5 w-5" style={{ color: "#4A6FA5" }} />
            {section.period}
          </h2>

          <div className="relative ml-2 border-l-2 pl-6 space-y-6" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
            {section.months.map((m, mi) => (
              <div key={mi} className="relative">
                {/* Dot on timeline */}
                <div
                  className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2"
                  style={{
                    borderColor: "#4A6FA5",
                    background: "var(--dl-bg-root, #D5DCE8)",
                  }}
                />
                <h3
                  className="text-[15px] font-semibold mb-2"
                  style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-instrument-sans)" }}
                >
                  {m.label}
                </h3>
                <ul className="space-y-1.5">
                  {m.items.map((item, ii) => (
                    <li key={ii} className="flex items-start gap-2 text-[14px] leading-relaxed">
                      <CheckCircle2
                        className="mt-0.5 h-3.5 w-3.5 shrink-0"
                        style={{ color: "var(--dl-text-muted, #5A6275)" }}
                      />
                      <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* CTA */}
      <div className="mt-8">
        <MarketingCTA
          headline="See exactly where you stand on this timeline"
          description="Create your free profile and get a personalized action plan based on where you are in the application cycle."
          buttonText="Create your free profile"
        />
      </div>
    </MarketingLayout>
  );
}
