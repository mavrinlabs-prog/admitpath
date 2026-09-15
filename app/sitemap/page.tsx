import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sitemap — AdmitPath",
  description: "Browse all pages on AdmitPath. College profiles, essay guides, worksheets, scholarships, blog, and more.",
  alternates: { canonical: "/sitemap" },
};

const SECTIONS = [
  {
    heading: "Main",
    links: [
      { href: "/", label: "Home" },
      { href: "/pricing", label: "Pricing" },
      { href: "/about", label: "About" },
      { href: "/faq", label: "FAQ" },
      { href: "/blog", label: "Blog" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/essays", label: "Essay Tools" },
      { href: "/worksheets", label: "Worksheets" },
      { href: "/scholarships", label: "Scholarships" },
      { href: "/guides", label: "Guides" },
    ],
  },
  {
    heading: "Florida Colleges",
    links: [
      { href: "/colleges/uf", label: "University of Florida" },
      { href: "/colleges/fsu", label: "Florida State University" },
      { href: "/colleges/ucf", label: "University of Central Florida" },
      { href: "/colleges/usf", label: "University of South Florida" },
      { href: "/colleges/fiu", label: "Florida International University" },
      { href: "/colleges/uf/essays", label: "UF Essays" },
      { href: "/colleges/fsu/essays", label: "FSU Essays" },
      { href: "/colleges/ucf/essays", label: "UCF Essays" },
    ],
  },
  {
    heading: "Guides",
    links: [
      { href: "/guides/common-app", label: "Common App Guide" },
      { href: "/guides/college-essay", label: "College Essay Guide" },
      { href: "/guides/financial-aid", label: "Financial Aid Guide" },
      { href: "/guides/early-decision", label: "Early Decision Guide" },
      { href: "/guides/test-optional", label: "Test-Optional Guide" },
      { href: "/guides/activities-list", label: "Activities List Guide" },
      { href: "/guides/letters-of-recommendation", label: "Letters of Rec Guide" },
    ],
  },
  {
    heading: "Tools & Resources",
    links: [
      { href: "/college-essay-examples", label: "College Essay Examples" },
      { href: "/college-application-timeline-2026", label: "Application Timeline 2026" },
      { href: "/college-application-checklist", label: "Application Checklist" },
      { href: "/college-tour-checklist", label: "College Tour Checklist" },
      { href: "/fafsa-checklist", label: "FAFSA Checklist" },
      { href: "/glossary", label: "Admissions Glossary" },
      { href: "/for-schools", label: "For Schools" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/accessibility", label: "Accessibility" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1
          className="text-3xl font-bold tracking-tight mb-2"
          style={{ color: "var(--dl-text-primary, #1B2030)" }}
        >
          Sitemap
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          All pages on AdmitPath, organized by section.
        </p>
        <div className="grid gap-10 md:grid-cols-2">
          {SECTIONS.map((section) => (
            <div key={section.heading}>
              <h2
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--dl-text-primary, #1B2030)" }}
              >
                {section.heading}
              </h2>
              <ul className="space-y-1.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:underline"
                      style={{ color: "#4A6FA5" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
