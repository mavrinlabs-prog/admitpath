import Link from "next/link";

/**
 * Shared site footer -- dark background (#1B2030), white text, links to all
 * required pages (terms, privacy, blog, resources, contact).
 * Extracted from the landing-page inline footer so every marketing page gets it.
 */
export function SiteFooter() {
  return (
    <footer
      className="py-10 sm:py-12 lg:py-14"
      style={{
        backgroundColor: "var(--dl-text-primary, #1B2030)",
        borderTop: "1px solid var(--color-surface-sunken, #2A3040)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:gap-16">
          {/* Col 1 -- Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              prefetch={false}
              className="mb-4 inline-flex items-center gap-2.5 transition-transform duration-200 ease-out hover:scale-[1.02]"
            >
              <span className="text-base font-bold text-white">AdmitPath</span>
            </Link>
            <p
              className="max-w-[220px] text-sm"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              The 7-dimension profile score, calibrated to real T20 admit rates.
            </p>
            <p
              className="mt-4 text-xs"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Pro $19.99/mo
            </p>
          </div>

          {/* Col 2 -- Guides and tools */}
          <div className="space-y-2.5">
            <p
              className="mb-4 text-[10px] font-bold uppercase tracking-[0.14em]"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Guides &amp; Tools
            </p>
            {[
              { href: "/guides", label: "All guides" },
              { href: "/guides/how-to-write-college-essay", label: "How to write a college essay" },
              { href: "/guides/common-app-prompts-2026", label: "Common App prompts 2026" },
              { href: "/guides/ed-vs-ea", label: "Early Decision vs Early Action" },
              { href: "/guides/supplemental-essay-guide", label: "Supplemental essay guide" },
              { href: "/tools", label: "All tools" },
              { href: "/college-essay-topic-finder", label: "Essay topic finder" },
              { href: "/calculator", label: "Admissions calculator" },
            ].map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                prefetch={false}
                className="block text-sm transition-colors duration-200 hover:text-[#4A6FA5]"
                style={{ color: "rgba(255,255,255,0.85)" }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Col 3 -- Colleges & Scholarships */}
          <div className="space-y-2.5">
            <p
              className="mb-4 text-[10px] font-bold uppercase tracking-[0.14em]"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Colleges &amp; Scholarships
            </p>
            {[
              { href: "/college", label: "College profiles" },
              { href: "/blog", label: "Blog" },
              { href: "/scholarships/bright-futures", label: "Bright Futures scholarship" },
              { href: "/scholarships/coca-cola-scholars", label: "Coca-Cola Scholars" },
              { href: "/scholarships/regeneron-sts", label: "Regeneron STS" },
              { href: "/florida/admissions-guide", label: "Florida admissions guide" },
              { href: "/guides/application-timeline", label: "Application timeline" },
              { href: "/guides/application-checklist", label: "Application checklist" },
              { href: "/resources", label: "Resources" },
              { href: "/faq", label: "FAQ" },
              { href: "/glossary", label: "Glossary" },
              { href: "/help", label: "Help center" },
            ].map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                prefetch={false}
                className="block text-sm transition-colors duration-200 hover:text-[#4A6FA5]"
                style={{ color: "rgba(255,255,255,0.85)" }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Col 4 -- Company / Legal */}
          <div className="space-y-2.5">
            <p
              className="mb-4 text-[10px] font-bold uppercase tracking-[0.14em]"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Company
            </p>
            {[
              { href: "/about", label: "About" },
              { href: "/pricing", label: "Pricing" },
              { href: "/methodology", label: "Methodology" },
              { href: "/for-schools", label: "For schools" },
              { href: "/counselor-toolkit", label: "For counselors" },
              { href: "/pricing-comparison", label: "Plan comparison" },
              { href: "/press", label: "Press" },
              { href: "/contact", label: "Contact" },
              { href: "/site-map", label: "Sitemap" },
              { href: "/privacy", label: "Privacy" },
              { href: "/terms", label: "Terms" },
              { href: "/security", label: "Security" },
              { href: "/accessibility", label: "Accessibility" },
              { href: "/cookie-policy", label: "Cookie Policy" },
            ].map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                prefetch={false}
                className="block text-sm transition-colors duration-200 hover:text-[#4A6FA5]"
                style={{ color: "rgba(255,255,255,0.85)" }}
              >
                {label}
              </Link>
            ))}
            {/* Cross-product flywheel links (SEO entity boost).
                Per SEO playbook: "Both sites can link to each other from author
                bio + footer — same entity boost." */}
          </div>
        </div>

        <div
          className="mt-12 flex flex-col items-center justify-between gap-3 border-t pt-8 sm:flex-row"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
            &copy; {new Date().getFullYear()} AdmitPath. All rights reserved.
            {" "}
            <a
              href="mailto:maestro.committee@gmail.com"
              className="transition-colors duration-200 hover:text-[#4A6FA5]"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              maestro.committee@gmail.com
            </a>
          </p>
          <p
            className="flex items-center gap-2 text-xs"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: "#4DA67A" }}
              aria-hidden
            />
            Support available
          </p>
        </div>
      </div>
    </footer>
  );
}
