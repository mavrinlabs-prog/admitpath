import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ audience: string }>;
}

interface AudienceData {
  slug: string;
  name: string;
  heading: string;
  description: string;
  valueProps: Array<{ title: string; detail: string }>;
  cta: string;
  ctaHref: string;
}

const AUDIENCES: Record<string, AudienceData> = {
  parents: {
    slug: "parents",
    name: "Parents",
    heading: "College admissions guidance your family can trust",
    description:
      "AdmitPath gives parents a clear view of where their student stands and what to focus on next. No more guessing whether the essay is strong enough, the college list is balanced, or the application strategy makes sense.",
    valueProps: [
      {
        title: "7-dimension profile scoring",
        detail: "See exactly where your student excels and where they need work across academics, leadership, awards, activity depth, spike, essay quality, and recommendations.",
      },
      {
        title: "Actionable college list",
        detail: "A balanced safety/match/reach list built from real admissions data (Common Data Set, IPEDS) -- not guesswork or brand prestige.",
      },
      {
        title: "Essay feedback you can understand",
        detail: "Essay reviews that score across 6 dimensions and explain exactly what to improve in plain language.",
      },
      {
        title: "Financial aid guidance",
        detail: "Net price comparisons, FAFSA checklist, scholarship matching, and aid appeal strategies so you can make informed financial decisions.",
      },
      {
        title: "Structured planning support",
        detail: "Accessible tools for profile review, essay feedback, college-list planning, and next-step organization.",
      },
    ],
    cta: "Start Free Family Analysis",
    ctaHref: "/sign-up",
  },
  students: {
    slug: "students",
    name: "Students",
    heading: "AI-assisted college planning on your schedule",
    description:
      "AdmitPath scores your profile, reviews your essays, builds your college list, and creates a step-by-step action plan. It supplements qualified human guidance rather than replacing it.",
    valueProps: [
      {
        title: "Know exactly where you stand",
        detail: "Get scored across 7 dimensions calibrated to real admissions data from 102+ schools. No inflated grades -- honest, actionable feedback.",
      },
      {
        title: "AI essay feedback in minutes",
        detail: "Submit your personal statement or supplemental and get line-by-line feedback scored against the same dimensions admissions readers use.",
      },
      {
        title: "Build the right college list",
        detail: "A balanced list of safety, match, and reach schools based on your actual profile -- not US News rankings or name recognition.",
      },
      {
        title: "Chat with your AI counselor anytime",
        detail: "Ask questions about admissions strategy, essay brainstorming, activity list optimization, or related planning topics when the service is available.",
      },
      {
        title: "Step-by-step action plan",
        detail: "A prioritized checklist tailored to your grade, timeline, and profile strengths. No generic advice -- every recommendation is specific to you.",
      },
    ],
    cta: "Get Started Free",
    ctaHref: "/sign-up",
  },
  counselors: {
    slug: "counselors",
    name: "School Counselors",
    heading: "Scale your college counseling with AI",
    description:
      "AdmitPath gives students self-directed profile planning, essay feedback, and college-list tools that can supplement guidance from a qualified school counselor.",
    valueProps: [
      {
        title: "Every student gets personalized guidance",
        detail: "Students can access 7-dimension profile scoring, essay reviews, and college list building on their own schedule. No more bottleneck at your office door.",
      },
      {
        title: "Data-driven college lists",
        detail: "Lists use available CDS and IPEDS fields to support balanced planning. Students should verify current requirements and make final choices with qualified guidance.",
      },
      {
        title: "Supplement, not replace, your expertise",
        detail: "AdmitPath handles the repeatable, data-heavy work so you can spend your time on the human side: motivation, family dynamics, and edge cases.",
      },
      {
        title: "Planning tools for structured prep",
        detail: "Profile, college-list, essay, timeline, scholarship, interview, and decision tools support self-paced application planning.",
      },
      {
        title: "Available to individual students",
        detail: "Counselors can share the public resources or recommend that students evaluate the Free plan. Centralized counselor reporting is not generally available.",
      },
    ],
    cta: "School Partnership Information",
    ctaHref: "/for-schools",
  },
  international: {
    slug: "international",
    name: "International Students",
    heading: "Navigate US college admissions from anywhere",
    description:
      "Applying to US colleges from abroad adds layers of complexity: credential evaluation, English proficiency, financial documentation, and visa requirements. AdmitPath provides the same strategic guidance a US-based student gets, calibrated for international applicants.",
    valueProps: [
      {
        title: "Profile scoring calibrated for international applicants",
        detail: "Your 7-dimension score accounts for the different context of international education systems, extracurriculars, and grading scales.",
      },
      {
        title: "Essay guidance for cross-cultural narratives",
        detail: "AI feedback that helps you write essays that communicate your unique background to US admissions readers who may not know your school system.",
      },
      {
        title: "Financial aid for international students",
        detail: "Identify colleges that offer need-based and merit-based aid to international students. Not all schools are created equal for international financial aid.",
      },
      {
        title: "Application timeline adjusted for your timezone",
        detail: "Deadline reminders and action plans that account for time zone differences, credential evaluation timelines, and visa processing windows.",
      },
      {
        title: "English proficiency strategy",
        detail: "Guidance on TOEFL vs. IELTS, score targets by school, and when to submit or waive English proficiency requirements.",
      },
    ],
    cta: "Start Free International Profile",
    ctaHref: "/sign-up",
  },
};

const VALID_AUDIENCES = ["parents", "students", "counselors", "international"];

export async function generateStaticParams() {
  return VALID_AUDIENCES.map((audience) => ({ audience }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { audience } = await params;
  const data = AUDIENCES[audience];
  if (!data) return {};
  const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://admith.vercel.app").trim().replace(/\/+$/, "");
  return {
    title: `AdmitPath for ${data.name}`,
    description: data.description.slice(0, 160),
    alternates: { canonical: `/for/${audience}` },
    openGraph: {
      title: `AdmitPath for ${data.name}`,
      description: data.description.slice(0, 160),
      url: `${APP_URL}/for/${audience}`,
      siteName: "AdmitPath",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `AdmitPath for ${data.name}`,
      description: data.description.slice(0, 160),
    },
  };
}

export default async function AudienceHubPage({ params }: Props) {
  const { audience } = await params;
  if (!VALID_AUDIENCES.includes(audience)) notFound();
  const data = AUDIENCES[audience];
  if (!data) notFound();

  const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://admith.vercel.app").trim().replace(/\/+$/, "");

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: APP_URL },
      { "@type": "ListItem", position: 2, name: `For ${data.name}`, item: `${APP_URL}/for/${audience}` },
    ],
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg, #D5DCE8)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <nav aria-label="Breadcrumb" className="mx-auto max-w-5xl px-4 pt-6 text-sm" style={{ color: "var(--color-text-muted, #8890A5)" }}>
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:underline">Home</Link></li>
          <li aria-hidden>/</li>
          <li style={{ color: "var(--color-text-primary, #1B2030)" }} className="font-medium">For {data.name}</li>
        </ol>
      </nav>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* AI Summary Nugget */}
        <div className="mb-8 rounded-xl p-5" style={{ backgroundColor: "var(--color-surface-raised, #FFFFFF)", border: "1px solid rgba(0,0,0,0.06)" }}>
          <p className="text-sm font-medium" style={{ color: "var(--color-text-primary, #1B2030)" }}>
            AdmitPath for {data.name.toLowerCase()}: {data.valueProps.length} key features including {data.valueProps.slice(0, 2).map((v) => v.title.toLowerCase()).join(" and ")}.
            {" "}AI college counseling scored across 7 dimensions. Start free.
          </p>
        </div>

        <h1 className="mb-4 text-4xl font-bold" style={{ color: "var(--color-text-primary, #1B2030)" }}>
          {data.heading}
        </h1>
        <p className="mb-10 text-lg max-w-3xl" style={{ color: "var(--color-text-secondary, #454B5E)" }}>
          {data.description}
        </p>

        {/* Value Props */}
        <section className="mb-12">
          <div className="space-y-4">
            {data.valueProps.map((prop, i) => (
              <div
                key={i}
                className="rounded-xl p-6"
                style={{ backgroundColor: "var(--color-surface-raised, #FFFFFF)", border: "1px solid rgba(0,0,0,0.06)" }}
              >
                <h2 className="mb-2 text-lg font-bold" style={{ color: "var(--color-text-primary, #1B2030)" }}>{prop.title}</h2>
                <p className="text-sm" style={{ color: "var(--color-text-secondary, #454B5E)" }}>{prop.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl p-10 text-center text-white" style={{ backgroundColor: "#2E4A6E" }}>
          <h2 className="mb-3 text-2xl font-bold">Ready to get started?</h2>
          <p className="mb-6 text-white/70">
            Free plan included. 5 profile analyses, 5 essay reviews. Pro $19.99/mo.
          </p>
          <Link
            href={data.ctaHref}
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold hover:opacity-90"
            style={{ backgroundColor: "#4A6FA5", color: "#FFFFFF" }}
          >
            {data.cta}
          </Link>
        </section>

        {/* Other audiences */}
        <section className="mt-12">
          <h2 className="mb-4 text-lg font-bold" style={{ color: "var(--color-text-primary, #1B2030)" }}>AdmitPath For</h2>
          <div className="flex flex-wrap gap-2">
            {VALID_AUDIENCES.filter((a) => a !== audience).map((a) => (
              <Link
                key={a}
                href={`/for/${a}`}
                className="rounded-lg px-3 py-1.5 text-sm capitalize hover:underline"
                style={{ backgroundColor: "var(--color-surface-raised, #FFFFFF)", border: "1px solid rgba(0,0,0,0.06)", color: "var(--color-text-secondary, #454B5E)" }}
              >
                {a === "international" ? "International Students" : a}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
