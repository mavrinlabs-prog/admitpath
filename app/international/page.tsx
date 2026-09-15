import type { Metadata } from "next";
import Link from "next/link";
import {
  Globe,
  Shield,
  DollarSign,
  GraduationCap,
  BookOpen,
  ArrowRight,
  ExternalLink,
  FileText,
  Calendar,
  ClipboardCheck,
  Plane,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { Section } from "@/components/marketing/Section";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app")
  .trim()
  .replace(/\/+$/, "");

const PAGE_FAQS = [
  { q: "Which US colleges are need-blind for international students?", a: "Only Harvard, Yale, Princeton, MIT, and Amherst are need-blind for international applicants (as of 2026). All other US schools are need-aware for international students, meaning your financial need can affect your admissions decision." },
  { q: "Do international students need to take the TOEFL?", a: "Most US schools require English proficiency testing (TOEFL, IELTS, or Duolingo English Test) from non-native English speakers. Waivers are commonly available if you attend an English-medium school for 4+ years or score above a threshold on the SAT/ACT English sections. Check each school's specific requirements." },
  { q: "Can international students get financial aid from US colleges?", a: "Yes, but options are more limited than for domestic students. International students are not eligible for US federal aid (FAFSA). Many private schools offer institutional aid to internationals. Need-blind-for-internationals schools (Harvard, Yale, Princeton, MIT, Amherst) meet 100% of demonstrated need regardless of citizenship." },
  { q: "What SAT/ACT score do international students need?", a: "Score expectations are the same as domestic students — there is no separate international threshold. However, at need-aware schools, a strong test score can partially offset financial need concerns. MIT and Georgetown require test scores; most other top schools are test-optional as of 2026." },
  { q: "When should international students start the application process?", a: "Start 18 months before enrollment. Take the TOEFL/IELTS and SAT/ACT by spring of junior year (or the equivalent). Research CSS Profile deadlines carefully — some schools have international financial aid deadlines weeks before domestic ones. Begin visa paperwork immediately after acceptance." },
  { q: "Do international students need to file the FAFSA?", a: "No. International students are not eligible for US federal financial aid and cannot file the FAFSA. Instead, most private schools use the CSS Profile or their own institutional aid forms. Some state universities offer no financial aid to international students at all." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${BASE}/international#page`,
      url: `${BASE}/international`,
      name: "Applying to US Colleges as an International Student",
      description:
        "Complete guide for international students applying to US colleges. Need-blind schools, TOEFL/IELTS requirements, F-1 visa process, financial aid, and application timeline differences.",
      isPartOf: { "@id": `${BASE}/#website` },
      inLanguage: "en-US",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "International Students", item: `${BASE}/international` },
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

export const metadata: Metadata = {
  title: "International Student US College Guide 2026",
  description:
    "Need-blind vs need-aware schools, TOEFL/IELTS requirements, F-1 visa process, financial aid, and application timeline for international students.",
  alternates: { canonical: `${BASE}/international` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "International Student US College Guide",
    description:
      "Need-blind schools, TOEFL/IELTS, F-1 visa process, financial aid reality, and application timeline for international applicants.",
    url: `${BASE}/international`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [
      {
        url: `${BASE}/api/og?title=International+Students&subtitle=Applying+to+US+Colleges+from+Anywhere`,
        width: 1200,
        height: 630,
        alt: "International Students — AdmitPath",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@admitpath",
    title: "International Students — AdmitPath",
    description:
      "Need-blind schools, TOEFL/IELTS, F-1 visa, financial aid, and timeline for international applicants.",
    images: [
      `${BASE}/api/og?title=International+Students&subtitle=Applying+to+US+Colleges+from+Anywhere`,
    ],
  },
};

const NEED_BLIND_SCHOOLS = [
  { name: "Harvard University", slug: "harvard-university" },
  { name: "Yale University", slug: "yale-university" },
  { name: "Princeton University", slug: "princeton-university" },
  { name: "MIT", slug: "massachusetts-institute-of-technology" },
  { name: "Amherst College", slug: "amherst-college" },
];

const GENEROUS_SCHOOLS = [
  { name: "Stanford University", slug: "stanford-university", note: "Need-aware but meets 100% of need if admitted" },
  { name: "Columbia University", slug: "columbia-university", note: "Need-aware; meets 100% of need if admitted" },
  { name: "Duke University", slug: "duke-university", note: "Need-aware; meets 100% of need if admitted" },
  { name: "University of Chicago", slug: "university-of-chicago", note: "Need-aware; meets 100% of need if admitted" },
  { name: "Dartmouth College", slug: "dartmouth-college", note: "Need-aware; meets 100% of need if admitted" },
  { name: "Brown University", slug: "brown-university", note: "Need-aware; meets 100% of need if admitted" },
  { name: "Bowdoin College", slug: "bowdoin-college", note: "Need-aware; meets 100% of need if admitted" },
  { name: "Swarthmore College", slug: "swarthmore-college", note: "Need-aware; meets 100% of need if admitted" },
  { name: "Williams College", slug: "williams-college", note: "Need-aware; meets 100% of need if admitted" },
  { name: "Wellesley College", slug: "wellesley-college", note: "Need-aware; meets 100% of need if admitted" },
];

const TOEFL_REQUIREMENTS = [
  { tier: "Ivy League / MIT / Stanford", toefl: "100-110+", ielts: "7.0-7.5+", duolingo: "120-130+", note: "Some departments expect higher" },
  { tier: "Top-20 (Duke, Northwestern, etc.)", toefl: "100+", ielts: "7.0+", duolingo: "120+", note: "Waivers available at some" },
  { tier: "Top-50 (NYU, Boston U, etc.)", toefl: "90-100", ielts: "6.5-7.0", duolingo: "110-120", note: "Varies widely by school" },
  { tier: "State flagships / Top-100", toefl: "79-90", ielts: "6.0-6.5", duolingo: "100-110", note: "Conditional admission sometimes available" },
];

const VISA_STEPS = [
  { step: "1", title: "Accept your offer and pay deposit", detail: "Your college issues an I-20 form (Certificate of Eligibility) after you confirm enrollment and submit financial documentation." },
  { step: "2", title: "Pay the SEVIS fee", detail: "Pay the I-901 SEVIS fee ($350 as of 2026) at fmjfee.com. Keep the receipt — you need it for the visa interview." },
  { step: "3", title: "Complete the DS-160 visa application", detail: "Fill out the DS-160 online nonimmigrant visa application at ceac.state.gov. Upload a passport-style photo." },
  { step: "4", title: "Schedule a consular interview", detail: "Book an appointment at your nearest US embassy or consulate. Wait times vary from days to months depending on country — check early." },
  { step: "5", title: "Attend the visa interview", detail: "Bring your passport, I-20, SEVIS receipt, DS-160 confirmation, financial documents, and admission letter. The interview is typically 3-5 minutes." },
  { step: "6", title: "Receive your visa and enter the US", detail: "You can enter the US up to 30 days before your program start date. Your I-20 must remain valid throughout your studies." },
];

const TIMELINE_DIFFERENCES = [
  { when: "18 months before enrollment", domestic: "Begin college research", international: "Begin college research + register for TOEFL/IELTS + research visa timelines for your country" },
  { when: "Spring of junior year", domestic: "Take SAT/ACT", international: "Take SAT/ACT + TOEFL/IELTS. Retake if needed in summer/fall." },
  { when: "August-September", domestic: "Finalize college list, start essays", international: "Same + confirm which schools require CSS Profile for internationals + begin financial documentation" },
  { when: "October", domestic: "Submit ED/EA applications", international: "Same + note that some international financial aid deadlines are earlier than domestic ones" },
  { when: "January 1-15", domestic: "Submit RD applications + FAFSA", international: "Submit RD applications + CSS Profile (no FAFSA). Some schools have Jan 1 CSS deadlines for internationals." },
  { when: "March-April", domestic: "Receive decisions + compare aid", international: "Receive decisions + compare aid + immediately begin I-20 and visa process" },
  { when: "May-July", domestic: "Commit + orientation prep", international: "Commit + pay SEVIS fee + DS-160 + consular interview + housing + travel arrangements" },
];

export default function InternationalPage() {
  return (
    <MarketingLayout
      eyebrow="International Students"
      title="Applying to US Colleges as an International Student"
      description="International applicants face a different admissions landscape: need-aware policies, English proficiency tests, visa requirements, and financial documentation that domestic students never think about. This guide covers every difference that matters."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── What's different for international applicants ── */}
      <Section
        title="Key differences for international applicants"
        Icon={Globe}
      >
        <div
          className="rounded-2xl p-6 sm:p-8 space-y-5"
          style={{
            background: "var(--dl-bg-white, #fff)",
            border: "1px solid var(--dl-border, rgba(0,0,0,0.06))",
            boxShadow: "var(--dl-shadow-sm, 0 1px 4px rgba(0,0,0,0.06))",
            borderRadius: "var(--dl-radius-lg, 16px)",
          }}
        >
          <ul className="space-y-4">
            {[
              {
                label: "Need-aware vs. need-blind",
                detail:
                  "Most US colleges are need-aware for international students, meaning your ability to pay tuition factors into the admissions decision. Only 5 schools are fully need-blind for internationals: Harvard, Yale, Princeton, MIT, and Amherst. At need-aware schools, applying for aid can reduce your chances of admission.",
              },
              {
                label: "English proficiency testing (TOEFL / IELTS / DET)",
                detail:
                  "Nearly every US college requires proof of English proficiency from non-native speakers. Most top schools set a minimum of TOEFL 100+ (iBT), IELTS 7.0+, or Duolingo English Test 120+. Some waive the requirement if you've attended an English-medium school for 4+ years, but policies vary widely — always check.",
              },
              {
                label: "F-1 student visa",
                detail:
                  "Admitted international students need an F-1 student visa. This requires an I-20 form from your college, proof of financial support, a SEVIS fee payment, and a consular interview. Start the process immediately after acceptance — visa delays can affect enrollment.",
              },
              {
                label: "Financial documentation",
                detail:
                  "You'll need a bank statement or affidavit of support showing you can cover at least one year of tuition and living expenses (typically $70,000-$85,000 at private schools). Most private schools require the CSS Profile; some have their own institutional forms with earlier deadlines than domestic applicants.",
              },
              {
                label: "No access to federal aid",
                detail:
                  "International students cannot file the FAFSA and are not eligible for US federal grants, loans, or work-study. Your financial aid options are limited to institutional aid from the college itself, private scholarships, and aid from your home country.",
              },
              {
                label: "Test policy differences",
                detail:
                  "MIT and Georgetown require SAT/ACT scores from all applicants including internationals. Most other top schools are test-optional as of 2026. At need-aware schools, a strong test score can help offset financial need concerns. International students from certain countries may face test center availability issues — plan early.",
              },
            ].map((item) => (
              <li key={item.label} className="flex items-start gap-3">
                <div
                  className="mt-1 h-5 w-5 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: "rgba(74,111,165,0.10)",
                    color: "var(--dl-brand, #4A6FA5)",
                  }}
                >
                  <BookOpen className="h-3 w-3" />
                </div>
                <div>
                  <p
                    className="text-[14px] font-semibold"
                    style={{ color: "var(--dl-text-primary, #1B2030)" }}
                  >
                    {item.label}
                  </p>
                  <p
                    className="text-[13px] leading-relaxed mt-0.5"
                    style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                  >
                    {item.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── 5 need-blind schools ── */}
      <Section
        title="5 need-blind schools for international students"
        Icon={Shield}
        description="These are the only US schools that evaluate international applicants without considering their ability to pay. If admitted, they meet 100% of demonstrated financial need regardless of citizenship."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {NEED_BLIND_SCHOOLS.map((school) => (
            <Link
              key={school.slug}
              href={`/college/${school.slug}`}
              className="group rounded-xl p-4 flex items-center gap-3 transition-all duration-200"
              style={{
                background: "var(--dl-bg-white, #fff)",
                border: "1px solid var(--dl-border, rgba(0,0,0,0.06))",
                boxShadow: "var(--dl-shadow-sm, 0 1px 4px rgba(0,0,0,0.06))",
              }}
            >
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(74,111,165,0.10)",
                  color: "var(--dl-brand, #4A6FA5)",
                }}
              >
                <GraduationCap className="h-4 w-4" />
              </div>
              <span
                className="text-[14px] font-medium group-hover:text-[#4A6FA5] transition-colors"
                style={{ color: "var(--dl-text-primary, #1B2030)" }}
              >
                {school.name}
              </span>
              <ArrowRight
                className="h-3.5 w-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: "var(--dl-brand, #4A6FA5)" }}
              />
            </Link>
          ))}
        </div>
        <p
          className="mt-4 text-[12px]"
          style={{ color: "var(--dl-text-muted, #8890A5)" }}
        >
          Need-blind policies can change year to year. Always verify directly
          with admissions offices. Many other schools are need-blind for domestic but need-aware for international applicants.
        </p>
      </Section>

      {/* ── Schools that offer the most aid ── */}
      <Section
        title="Schools that offer the most aid to internationals"
        Icon={DollarSign}
        description="These need-aware schools are still among the most generous for international students. They meet 100% of demonstrated financial need if you are admitted — but your ability to pay may factor into the admissions decision."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {GENEROUS_SCHOOLS.map((school) => (
            <Link
              key={school.slug}
              href={`/college/${school.slug}`}
              className="group rounded-xl p-4 flex items-center gap-3 transition-all duration-200"
              style={{
                background: "var(--dl-bg-white, #fff)",
                border: "1px solid var(--dl-border, rgba(0,0,0,0.06))",
                boxShadow: "var(--dl-shadow-sm, 0 1px 4px rgba(0,0,0,0.06))",
              }}
            >
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(74,111,165,0.10)",
                  color: "var(--dl-brand, #4A6FA5)",
                }}
              >
                <GraduationCap className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span
                  className="text-[14px] font-medium group-hover:text-[#4A6FA5] transition-colors block"
                  style={{ color: "var(--dl-text-primary, #1B2030)" }}
                >
                  {school.name}
                </span>
                <span
                  className="text-[11px] block"
                  style={{ color: "var(--dl-text-muted, #8890A5)" }}
                >
                  {school.note}
                </span>
              </div>
              <ArrowRight
                className="h-3.5 w-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                style={{ color: "var(--dl-brand, #4A6FA5)" }}
              />
            </Link>
          ))}
        </div>
        <p
          className="mt-4 text-[12px]"
          style={{ color: "var(--dl-text-muted, #8890A5)" }}
        >
          &ldquo;Meets 100% of need&rdquo; means the school covers the gap between what they calculate you can pay and the total cost. The calculation is the school&rsquo;s, not yours. Verify current policies directly with admissions.
        </p>
      </Section>

      {/* ── TOEFL / IELTS requirements ── */}
      <Section
        title="TOEFL, IELTS, and Duolingo English Test requirements"
        Icon={FileText}
        description="Score requirements vary by school tier. These are typical minimums — scoring above them does not help your application, but scoring below can disqualify you."
      >
        <div
          className="overflow-x-auto rounded-xl border"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <table className="w-full text-left text-[13px]">
            <thead style={{ background: "var(--dl-bg-sunken, #E3E8F1)" }}>
              <tr>
                <th className="px-4 py-3 font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>School tier</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: "var(--dl-text-primary, #1B2030)" }}>TOEFL iBT</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: "var(--dl-text-primary, #1B2030)" }}>IELTS</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Duolingo</th>
                <th className="px-4 py-3 font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Note</th>
              </tr>
            </thead>
            <tbody>
              {TOEFL_REQUIREMENTS.map((row, i) => (
                <tr key={i} className="border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                  <td className="px-4 py-3 align-top font-medium" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{row.tier}</td>
                  <td className="px-4 py-3 align-top tabular-nums" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{row.toefl}</td>
                  <td className="px-4 py-3 align-top tabular-nums" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{row.ielts}</td>
                  <td className="px-4 py-3 align-top tabular-nums" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{row.duolingo}</td>
                  <td className="px-4 py-3 align-top text-[12px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className="mt-4 rounded-xl p-4"
          style={{
            background: "rgba(74,111,165,0.04)",
            border: "1px solid rgba(74,111,165,0.10)",
          }}
        >
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            <strong>Common waivers:</strong> Many schools waive English proficiency testing if you have attended an English-medium school for 4+ years, are a citizen of a majority-English-speaking country, or scored above a threshold on the SAT/ACT Evidence-Based Reading section (typically 650-700+). Always check each school&rsquo;s specific waiver policy.
          </p>
        </div>
      </Section>

      {/* ── F-1 visa process ── */}
      <Section
        title="F-1 student visa process"
        Icon={Plane}
        description="After you're admitted and commit to a school, you'll need an F-1 student visa to study in the US. Start this process immediately — wait times vary significantly by country."
      >
        <div className="space-y-3">
          {VISA_STEPS.map((item) => (
            <div
              key={item.step}
              className="flex gap-4 rounded-xl border p-4"
              style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-white"
                style={{ background: "#4A6FA5" }}
              >
                {item.step}
              </div>
              <div className="flex-1">
                <p
                  className="mb-1 text-[15px] font-semibold"
                  style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                >
                  {item.title}
                </p>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div
          className="mt-4 rounded-xl p-4"
          style={{
            background: "rgba(74,111,165,0.04)",
            border: "1px solid rgba(74,111,165,0.10)",
          }}
        >
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            <strong>Important:</strong> F-1 visa holders can work on-campus up to 20 hours/week during the academic year. Off-campus work requires CPT (Curricular Practical Training) or OPT (Optional Practical Training) authorization. After graduation, OPT allows 12 months of work (36 months for STEM fields).
          </p>
        </div>
      </Section>

      {/* ── Financial aid reality ── */}
      <Section
        title="Financial aid reality for international students"
        Icon={DollarSign}
        description="Funding is the single biggest challenge for international applicants. Understanding your options early is critical."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "What you can't access",
              description:
                "No FAFSA (US federal aid), no federal grants, no federal loans, no federal work-study. Many state universities offer zero financial aid to international students. Public universities are often full-price for internationals ($40,000-$65,000/year).",
            },
            {
              title: "What you can access",
              description:
                "Institutional aid from private colleges (via CSS Profile), merit scholarships that don't require US citizenship, private scholarships (Davis UWC Scholars, MasterCard Foundation Scholars, etc.), and aid from your home country's government or organizations.",
            },
            {
              title: "The CSS Profile difference",
              description:
                "Most private US colleges use the CSS Profile (not FAFSA) to evaluate international students for aid. The CSS Profile costs $25 for the first school and $16 per additional school. Some schools have their own institutional aid forms with separate deadlines.",
            },
            {
              title: "Strategic considerations",
              description:
                "At need-aware schools, applying for financial aid can reduce your admissions chances. Some students apply without aid to maximize admission odds, then negotiate after acceptance. This is risky — schools rarely add aid after admission for internationals.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl p-5 sm:p-6"
              style={{
                background: "var(--dl-bg-white, #fff)",
                border: "1px solid var(--dl-border, rgba(0,0,0,0.06))",
                boxShadow: "var(--dl-shadow-sm, 0 1px 4px rgba(0,0,0,0.06))",
                borderRadius: "var(--dl-radius-lg, 16px)",
              }}
            >
              <h3
                className="text-[15px] font-semibold mb-2"
                style={{ color: "var(--dl-text-primary, #1B2030)" }}
              >
                {card.title}
              </h3>
              <p
                className="text-[13px] leading-relaxed"
                style={{ color: "var(--dl-text-secondary, #454B5E)" }}
              >
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Application timeline differences ── */}
      <Section
        title="Application timeline: international vs. domestic"
        Icon={Calendar}
        description="International applicants have additional steps at nearly every stage. This timeline highlights what's different."
      >
        <div
          className="overflow-x-auto rounded-xl border"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <table className="w-full text-left text-[13px]">
            <thead style={{ background: "var(--dl-bg-sunken, #E3E8F1)" }}>
              <tr>
                <th className="px-4 py-3 font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>When</th>
                <th className="px-4 py-3 font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Domestic students</th>
                <th className="px-4 py-3 font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>International students</th>
              </tr>
            </thead>
            <tbody>
              {TIMELINE_DIFFERENCES.map((row, i) => (
                <tr key={i} className="border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                  <td className="px-4 py-3 align-top font-medium whitespace-nowrap" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{row.when}</td>
                  <td className="px-4 py-3 align-top" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{row.domestic}</td>
                  <td className="px-4 py-3 align-top" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{row.international}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ── How AdmitPath helps ── */}
      <Section
        title="How AdmitPath helps international students"
        Icon={ClipboardCheck}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Profile calibration for international context",
              description:
                "Our scoring framework accounts for different grading systems, international curricula (A-Levels, IB, national exams), and the higher bar international applicants face at need-aware schools.",
            },
            {
              title: "Financial aid comparison",
              description:
                "Compare net price estimates across schools, understand the difference between merit aid and need-based aid, and identify which schools are most generous to international students.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl p-5 sm:p-6"
              style={{
                background: "var(--dl-bg-white, #fff)",
                border: "1px solid var(--dl-border, rgba(0,0,0,0.06))",
                boxShadow: "var(--dl-shadow-sm, 0 1px 4px rgba(0,0,0,0.06))",
                borderRadius: "var(--dl-radius-lg, 16px)",
              }}
            >
              <h3
                className="text-[15px] font-semibold mb-2"
                style={{ color: "var(--dl-text-primary, #1B2030)" }}
              >
                {card.title}
              </h3>
              <p
                className="text-[13px] leading-relaxed"
                style={{ color: "var(--dl-text-secondary, #454B5E)" }}
              >
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Scholarship resources ── */}
      <Section title="Related resources" Icon={DollarSign}>
        <div
          className="rounded-2xl p-6 sm:p-8"
          style={{
            background: "var(--dl-bg-white, #fff)",
            border: "1px solid var(--dl-border, rgba(0,0,0,0.06))",
            boxShadow: "var(--dl-shadow-sm, 0 1px 4px rgba(0,0,0,0.06))",
            borderRadius: "var(--dl-radius-lg, 16px)",
          }}
        >
          <div className="flex flex-wrap gap-3">
            {[
              {
                label: "Scholarships by category",
                href: "/scholarships-by-category",
              },
              {
                label: "Scholarship application guide",
                href: "/scholarship-application-guide",
              },
              {
                label: "Financial aid appeal guide",
                href: "/financial-aid-appeal-guide",
              },
              {
                label: "Need-blind vs. need-aware explained",
                href: "/need-blind-vs-need-aware-schools",
              },
              { label: "Net price estimator", href: "/net-price" },
              { label: "Test-optional schools 2026", href: "/test-optional-schools-2026" },
              { label: "Test prep guide", href: "/test-prep-guide" },
              { label: "Application timeline 2026", href: "/college-application-timeline-2026" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors duration-200 hover:bg-[rgba(74,111,165,0.08)]"
                style={{
                  color: "var(--dl-brand, #4A6FA5)",
                  border: "1px solid rgba(74,111,165,0.20)",
                }}
              >
                {link.label}
                <ExternalLink className="h-3 w-3" />
              </Link>
            ))}
          </div>
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

      {/* ── CTA ── */}
      <MarketingCTA
        headline="Start your US college application"
        description="Get a personalized profile score calibrated for international applicants. See where you stand, find need-blind schools, and build a balanced list."
        buttonText="Get My Free Score"
        buttonHref="/sign-up"
      />
    </MarketingLayout>
  );
}
