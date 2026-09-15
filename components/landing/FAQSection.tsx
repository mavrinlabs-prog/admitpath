"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What is AdmitPath?",
    a: "AdmitPath is an AI college-planning platform that reviews an application across seven dimensions, including academic rigor, leadership, awards, activity depth, focus, essay quality, and recommendations. It combines structured planning tools, college profiles, essay guidance, and Florida-specific resources. Its scores are planning estimates, not admissions predictions.",
  },
  {
    q: "What grades does AdmitPath support?",
    a: "AdmitPath supports students in grades 7-12, from early profile building in middle school through final application submission senior year. The same 7-dimension framework works at every stage — it shows different gaps depending on how far you are along.",
  },
  {
    q: "How does the 7-dimension scoring work?",
    a: "Each of the 7 dimensions (academic rigor, leadership, awards, activity depth, spike, essay quality, recommendations) is scored 0-100 using documented rubric rules. Published Common Data Set Section C7 factors inform school-specific weighting where data is available; the result is guidance, not an admission probability.",
  },
  {
    q: "What data sources does AdmitPath use?",
    a: "AdmitPath uses available fields from sources such as IPEDS College Navigator, institutional Common Data Set reports, College Scorecard, and official admissions pages. Coverage and publication dates vary, so current figures should be verified with each institution.",
  },
  {
    q: "How much does AdmitPath cost?",
    a: "AdmitPath offers a free plan with 5 profile analyses, 5 essay reviews, 5 counselor chat messages, and 8 saved colleges. The Pro plan is $19.99/month and removes those Free-plan caps while adding the current essay, college-list, and counselor-chat tools.",
  },
  {
    q: "Is AdmitPath better than a private college counselor?",
    a: "AdmitPath provides structured, worksheet-driven planning informed by published Common Data Set factors. It can supplement a qualified school or private counselor, but it does not replace a counselor's judgment or guarantee comparable outcomes.",
  },
  {
    q: "Does AdmitPath help with college essays?",
    a: "Yes. AdmitPath provides essay feedback across 6 dimensions: voice authenticity, narrative structure, self-reflection depth, specificity, emotional resonance, and admissions alignment. It also includes a topic finder, revision checklist, Common App prompt guides, supplemental-essay guidance, and a brainstorm worksheet.",
  },
  {
    q: "How accurate is the AI scoring?",
    a: "AdmitPath's scoring is calibrated against publicly available admissions data — admit rates, CDS Section C7 factor weights, score thresholds, and the kinds of profiles top schools historically accept. It produces directional, comparative scores to help you spot weaknesses and prioritize improvements. It does not predict acceptance and does not guarantee any outcome — admissions involves human judgment no model can replace.",
  },
  {
    q: "What planning tools are included?",
    a: "AdmitPath includes profile analysis, college-list planning, essay feedback, counselor chat, application timelines, scholarship matching, interview practice, and decision-comparison tools. Availability and Free-plan limits are shown in the product and on the pricing page.",
  },
  {
    q: "Who built AdmitPath?",
    a: "AdmitPath was built from a student perspective by someone currently navigating the college-planning process. The product is independent and is designed for students and families rather than for institutional admissions decisions.",
  },
  {
    q: "Will my data be shared or sold?",
    a: "AdmitPath does not sell personal information. Relevant data is shared with the service providers described in the Privacy Policy when needed to operate a feature. Account deletion is available from Settings, subject to the retention exceptions described in that policy.",
  },
  {
    q: "How do I manage my subscription?",
    a: "Manage your subscription from your billing settings. Your access stays active until the end of the current billing period. You will not be charged again after any changes take effect.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  // Keyboard navigation for FAQ accordion (WCAG: Arrow keys between
  // accordion headers per WAI-ARIA Accordion Pattern)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let target: number | null = null;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        target = index < faqs.length - 1 ? index + 1 : 0;
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        target = index > 0 ? index - 1 : faqs.length - 1;
      } else if (e.key === "Home") {
        e.preventDefault();
        target = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        target = faqs.length - 1;
      }
      if (target !== null) {
        const btn = document.getElementById(`faq-btn-${target}`);
        btn?.focus();
      }
    },
    [],
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <section className="dl-features" id="faq" aria-labelledby="faq-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto" style={{ maxWidth: 800, padding: "0 36px" }}>
        <div className="text-center" style={{ marginBottom: 48 }}>
          <p className="dl-section-eyebrow">Answers</p>
          <h2 id="faq-heading" className="dl-section-heading">
            Frequently asked <em>questions</em>
          </h2>
          <p style={{ fontSize: 15, color: "var(--dl-text-secondary)" }}>
            Couldn&apos;t find your answer?{" "}
            <a
              href="mailto:maestro.committee@gmail.com"
              style={{ color: "var(--dl-brand)", fontWeight: 600, textDecoration: "underline" }}
            >
              Email support
            </a>
            .
          </p>
        </div>

        <div className="stagger-children" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                style={{
                  borderRadius: "var(--dl-radius-lg)",
                  border: `1px solid ${isOpen ? "rgba(74,111,165,0.30)" : "rgba(0,0,0,0.06)"}`,
                  background: "rgba(255,255,255,0.45)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  boxShadow: isOpen
                    ? "0 4px 24px rgba(74,111,165,0.10)"
                    : "0 1px 2px rgba(0,0,0,0.05)",
                  transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  id={`faq-btn-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  className="faq-toggle"
                  style={{
                    width: "100%",
                    padding: "18px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    textAlign: "left",
                    background: "transparent",
                    border: "1px solid rgba(0,0,0,0.06)",
                    borderRadius: 12,
                    cursor: "pointer",
                  }}
                >
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      lineHeight: 1.4,
                      color: "var(--dl-text-primary)",
                      margin: 0,
                    }}
                  >
                    {faq.q}
                  </h3>
                  <span
                    style={{
                      flexShrink: 0,
                      display: "flex",
                      width: 28,
                      height: 28,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "999px",
                      background: isOpen ? "#4A6FA5" : "rgba(74,111,165,0.08)",
                      color: isOpen ? "#fff" : "var(--dl-text-muted)",
                      transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                    }}
                    aria-hidden
                  >
                    <ChevronDown size={14} strokeWidth={2.25} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-btn-${i}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <p
                        style={{
                          padding: "0 24px 20px",
                          fontSize: 14,
                          lineHeight: 1.65,
                          color: "var(--dl-text-secondary)",
                          margin: 0,
                        }}
                      >
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
