import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ grade: string }>;
}

interface GradeData {
  grade: number;
  title: string;
  description: string;
  timeline: Array<{ month: string; task: string }>;
  keyTasks: string[];
  tips: string[];
}

const GRADES: Record<string, GradeData> = {
  "9": {
    grade: 9,
    title: "9th Grade College Prep",
    description:
      "Build the foundation for a strong college application. Freshman year sets your GPA trajectory, establishes extracurricular depth, and gives you time to explore interests before the pressure builds.",
    timeline: [
      { month: "August-September", task: "Choose challenging courses (Honors/AP where offered). Join 2-3 extracurriculars that genuinely interest you." },
      { month: "October-November", task: "Meet your school counselor. Start a simple activities spreadsheet to track hours and roles." },
      { month: "December-January", task: "Finish strong on first semester grades. GPA recovery is harder than GPA maintenance." },
      { month: "February-March", task: "Research summer programs and internships. Apply early -- the best programs have fall deadlines." },
      { month: "April-May", task: "Request teacher feedback on your strengths. Begin thinking about potential recommenders for junior year." },
      { month: "June-July", task: "Pursue a meaningful summer activity. Read broadly -- colleges value intellectual curiosity." },
    ],
    keyTasks: [
      "Choose a rigorous course schedule (highest rigor available to you)",
      "Join extracurriculars you care about -- depth over breadth",
      "Maintain a 3.5+ unweighted GPA from day one",
      "Meet your school counselor and build that relationship",
      "Start a simple activities log (hours, roles, impact)",
      "Explore interests through clubs, volunteering, or summer programs",
    ],
    tips: [
      "Freshman year GPA counts the same as junior year GPA in your cumulative average",
      "Colleges look for sustained involvement -- join activities you will stick with for 4 years",
      "It is never too early to start reading about colleges, but do not stress about choosing one yet",
    ],
  },
  "10": {
    grade: 10,
    title: "10th Grade College Prep",
    description:
      "Sophomore year is about deepening commitments, taking the PSAT for the first time, and beginning to shape the narrative of your application. Start thinking about what makes you distinctive.",
    timeline: [
      { month: "August-September", task: "Increase course rigor (add AP or dual enrollment). Take on leadership roles in existing activities." },
      { month: "October", task: "Take the PSAT. It does not count for National Merit until junior year, but the practice is invaluable." },
      { month: "November-December", task: "Research college types (liberal arts, research university, HBCU, state school). Visit nearby campuses if possible." },
      { month: "January-February", task: "Start SAT/ACT baseline prep. Identify which test format suits you better." },
      { month: "March-April", task: "Plan a productive summer: internship, research, camp, job, or personal project." },
      { month: "May-July", task: "Execute your summer plan. Begin a college list brainstorm (20+ schools, will narrow later)." },
    ],
    keyTasks: [
      "Take the PSAT in October -- treat it as a diagnostic",
      "Increase AP/Honors course load if GPA supports it",
      "Pursue leadership in 1-2 core extracurriculars",
      "Begin standardized test prep (SAT or ACT)",
      "Visit at least 2-3 colleges to calibrate preferences",
      "Start brainstorming your college list (safety/match/reach)",
    ],
    tips: [
      "The PSAT in 10th grade is a risk-free diagnostic -- no National Merit implications until 11th grade",
      "Colleges value upward trajectory -- if freshman year was rough, strong sophomore grades show growth",
      "Start thinking about your 'spike' -- what is the one area where you go deepest?",
    ],
  },
  "11": {
    grade: 11,
    title: "11th Grade College Prep",
    description:
      "Junior year is the most critical year for college admissions. Your GPA, test scores, activities, and essay foundations all crystallize now. This is when the application takes shape.",
    timeline: [
      { month: "August-September", task: "Take the most rigorous course schedule you can handle. Identify 2 teachers for recommendation letters." },
      { month: "October", task: "Take the PSAT/NMSQT (counts for National Merit). Begin SAT/ACT prep in earnest." },
      { month: "November-December", task: "Take your first SAT or ACT. Finalize college list to 10-15 schools. Attend college info sessions." },
      { month: "January-February", task: "Retake SAT/ACT if needed. Visit top-choice schools during winter break. Start Common App activities list." },
      { month: "March-April", task: "Request recommendation letters from teachers (give them 4+ weeks). Begin personal statement brainstorming." },
      { month: "May-June", task: "Take AP exams. Ask counselor for a counselor rec. Start drafting your personal statement." },
      { month: "July-August", task: "Finalize personal statement draft. Research supplemental essay prompts. Open Common App on August 1." },
    ],
    keyTasks: [
      "Take the SAT or ACT -- aim for a score above the 75th percentile of target schools",
      "Take the PSAT/NMSQT in October for National Merit eligibility",
      "Request teacher recommendation letters by March",
      "Finalize your college list (3 safety, 4-5 match, 3-4 reach)",
      "Draft your Common App personal statement over summer",
      "Research supplemental essay prompts for your target schools",
      "Complete the CSS Profile and FAFSA (if applicable, opens October 1)",
    ],
    tips: [
      "Junior year grades carry the most weight -- colleges see them on your mid-year report",
      "Ask for recommendation letters from teachers who know you well, not just teachers who gave you an A",
      "Start your personal statement early. The best essays go through 5+ drafts over several months.",
    ],
  },
  "12": {
    grade: 12,
    title: "12th Grade College Prep",
    description:
      "Senior year is about executing your application strategy, meeting deadlines, and finishing strong. Early Decision and Early Action deadlines hit in November. Regular Decision in January.",
    timeline: [
      { month: "August-September", task: "Finalize Common App, activities list, and personal statement. Start supplemental essays." },
      { month: "October", task: "Submit FAFSA and CSS Profile (opens October 1). Finalize Early Decision/Early Action applications." },
      { month: "November 1-15", task: "Submit ED/EA applications. Most deadlines are November 1 or 15." },
      { month: "December", task: "Receive EA/ED decisions. If deferred, send a Letter of Continued Interest. Finish RD supplemental essays." },
      { month: "January 1-15", task: "Submit Regular Decision applications. Most RD deadlines are January 1 or 15." },
      { month: "February-March", task: "Submit mid-year report (counselor sends transcript). Wait for decisions. Keep grades up." },
      { month: "April", task: "Receive RD decisions. Compare financial aid offers. Visit admitted student days." },
      { month: "May 1", task: "National Decision Day. Commit to your chosen school and submit your deposit." },
    ],
    keyTasks: [
      "Submit Early Decision/Early Action apps by November 1",
      "File FAFSA and CSS Profile in October",
      "Complete all supplemental essays (budget 2-3 hours per school)",
      "Submit Regular Decision applications by January 1-15",
      "Compare financial aid packages carefully",
      "Commit by May 1 (National Decision Day)",
      "Maintain your GPA -- colleges can rescind offers for senior slide",
    ],
    tips: [
      "Early Decision acceptance rates are typically 10-20 percentage points higher than RD -- but it is binding",
      "Do not let your grades slip. Colleges see your final transcript and can rescind admissions offers",
      "Financial aid packages are negotiable. If a comparable school offers more, contact the financial aid office.",
    ],
  },
};

const VALID_GRADES = ["9", "10", "11", "12"];

export async function generateStaticParams() {
  return VALID_GRADES.map((grade) => ({ grade }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { grade } = await params;
  const data = GRADES[grade];
  if (!data) return {};
  const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://admith.vercel.app").trim().replace(/\/+$/, "");
  return {
    title: `Grade ${grade} College Prep | AdmitPath`,
    description: data.description.slice(0, 160),
    alternates: { canonical: `/grade/${grade}` },
    openGraph: {
      title: `Grade ${grade} College Prep | AdmitPath`,
      description: data.description.slice(0, 160),
      url: `${APP_URL}/grade/${grade}`,
      siteName: "AdmitPath",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Grade ${grade} College Prep | AdmitPath`,
      description: data.description.slice(0, 160),
    },
  };
}

export default async function GradeHubPage({ params }: Props) {
  const { grade } = await params;
  if (!VALID_GRADES.includes(grade)) notFound();
  const data = GRADES[grade];
  if (!data) notFound();

  const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://admith.vercel.app").trim().replace(/\/+$/, "");

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: APP_URL },
      { "@type": "ListItem", position: 2, name: `Grade ${grade}`, item: `${APP_URL}/grade/${grade}` },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What should a ${grade}th grader do to prepare for college?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: data.keyTasks.join(" "),
        },
      },
      {
        "@type": "Question",
        name: `What is the college admissions timeline for ${grade}th grade?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: data.timeline.map((t) => `${t.month}: ${t.task}`).join(" "),
        },
      },
    ],
  };

  const ordinalGrade = grade === "9" ? "Freshman" : grade === "10" ? "Sophomore" : grade === "11" ? "Junior" : "Senior";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg, #D5DCE8)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <nav aria-label="Breadcrumb" className="mx-auto max-w-5xl px-4 pt-6 text-sm" style={{ color: "var(--color-text-muted, #8890A5)" }}>
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:underline">Home</Link></li>
          <li aria-hidden>/</li>
          <li style={{ color: "var(--color-text-primary, #1B2030)" }} className="font-medium">Grade {grade}</li>
        </ol>
      </nav>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* AI Summary Nugget */}
        <div className="mb-8 rounded-xl p-5" style={{ backgroundColor: "var(--color-surface-raised, #FFFFFF)", border: "1px solid rgba(0,0,0,0.06)" }}>
          <p className="text-sm font-medium" style={{ color: "var(--color-text-primary, #1B2030)" }}>
            {ordinalGrade} year ({grade}th grade) college prep: {data.keyTasks.length} key tasks, month-by-month timeline, and expert tips.
            {" "}AdmitPath scores your profile across 7 dimensions and generates a personalized action plan.
          </p>
        </div>

        <h1 className="mb-4 text-4xl font-bold" style={{ color: "var(--color-text-primary, #1B2030)" }}>
          {data.title}
        </h1>
        <p className="mb-10 text-lg max-w-3xl" style={{ color: "var(--color-text-secondary, #454B5E)" }}>
          {data.description}
        </p>

        {/* Key Tasks */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold" style={{ color: "var(--color-text-primary, #1B2030)" }}>
            Key Tasks for {grade}th Graders
          </h2>
          <div className="space-y-3">
            {data.keyTasks.map((task, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl p-4"
                style={{ backgroundColor: "var(--color-surface-raised, #FFFFFF)", border: "1px solid rgba(0,0,0,0.06)" }}
              >
                <span
                  className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: "#4A6FA5" }}
                >
                  {i + 1}
                </span>
                <p className="text-sm" style={{ color: "var(--color-text-secondary, #454B5E)" }}>{task}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold" style={{ color: "var(--color-text-primary, #1B2030)" }}>
            Month-by-Month Timeline
          </h2>
          <div className="space-y-3">
            {data.timeline.map((item) => (
              <div
                key={item.month}
                className="flex items-start gap-4 rounded-xl p-5"
                style={{ backgroundColor: "var(--color-surface-raised, #FFFFFF)", border: "1px solid rgba(0,0,0,0.06)" }}
              >
                <div className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold text-white" style={{ backgroundColor: "#2E4A6E" }}>
                  {item.month}
                </div>
                <p className="text-sm" style={{ color: "var(--color-text-secondary, #454B5E)" }}>{item.task}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold" style={{ color: "var(--color-text-primary, #1B2030)" }}>
            Expert Tips for {ordinalGrade} Year
          </h2>
          <div className="space-y-3">
            {data.tips.map((tip, i) => (
              <div
                key={i}
                className="rounded-xl p-5"
                style={{ backgroundColor: "rgba(74,111,165,0.06)", border: "1px solid rgba(74,111,165,0.12)" }}
              >
                <p className="text-sm" style={{ color: "var(--color-text-secondary, #454B5E)" }}>{tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl p-10 text-center text-white" style={{ backgroundColor: "#2E4A6E" }}>
          <h2 className="mb-3 text-2xl font-bold">Get your personalized {ordinalGrade} year plan</h2>
          <p className="mb-6 text-white/70">
            AdmitPath scores your profile across 7 dimensions and tells you exactly what to focus on. Start free.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold hover:opacity-90"
            style={{ backgroundColor: "#4A6FA5", color: "#FFFFFF" }}
          >
            Start Free Profile Analysis
          </Link>
        </section>

        {/* Other grades nav */}
        <section className="mt-12">
          <h2 className="mb-4 text-lg font-bold" style={{ color: "var(--color-text-primary, #1B2030)" }}>College Prep by Grade</h2>
          <div className="flex flex-wrap gap-2">
            {VALID_GRADES.filter((g) => g !== grade).map((g) => (
              <Link
                key={g}
                href={`/grade/${g}`}
                className="rounded-lg px-3 py-1.5 text-sm hover:underline"
                style={{ backgroundColor: "var(--color-surface-raised, #FFFFFF)", border: "1px solid rgba(0,0,0,0.06)", color: "var(--color-text-secondary, #454B5E)" }}
              >
                Grade {g}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
