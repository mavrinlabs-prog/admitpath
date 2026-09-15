"use client";

import { AlertCircle, Clock3, FileWarning, Compass } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/**
 * Problems / "Sound Familiar?" — Discovery Labs `.dl-features` 4-up clone.
 *
 * Layout mirrors the DL pattern in frontend_template/src/index.css:
 *   <section class="dl-features">
 *     <div class="dl-features-inner">
 *       header (.dl-section-eyebrow + .dl-section-heading + .dl-section-sub)
 *       <div class="dl-features-grid">  ← override to 4 cols
 *         .dl-feature-card × 4 with .dl-feature-icon
 *
 * One deliberate divergence from DL's reference: 4-up grid (not 3-up) so
 * the four-friction-points narrative arc reads as a single unit. Tailwind
 * grid override enforces that on lg+ since the base .dl-features-grid is
 * 3-col. Each card uses .dl-feature-card and .dl-feature-icon verbatim so
 * the hover gradient bar + icon scale-rotate animations stay consistent
 * with the rest of the DL surface.
 */
const PROBLEMS = [
  {
    icon: Compass,
    title: "I have no idea where I stand.",
    body:
      "GPA, SAT, activities, awards — every blog says something different. You can't fix what you can't measure.",
    fix: "7-dimension AI score",
  },
  {
    icon: FileWarning,
    title: "My essay sounds like everyone else's.",
    body:
      "Generic, hedged, voice-less. You know it's a problem but you can't see what to change line-by-line.",
    fix: "Live essay coach",
  },
  {
    icon: Clock3,
    title: "I'm losing weeks to deadlines and decisions.",
    body:
      "ED vs EA, supplements, recs, FAFSA, CSS Profile, demonstrated interest. The list never stops.",
    fix: "Auto-prioritized action plan",
  },
  {
    icon: AlertCircle,
    title: "My counselor sees me 4 times a year.",
    body:
      "Reliable admissions help can be hard to access exactly when a question comes up.",
    fix: "Self-service AI planning chat",
  },
];

export function ProblemsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef as React.RefObject<Element>, {
    once: true,
    margin: "-10%",
  });

  return (
    <section ref={sectionRef} className="dl-features" aria-labelledby="problems-heading">
      <div className="dl-features-inner">
        <div className="text-center" style={{ marginBottom: 56 }}>
          <p className="dl-section-eyebrow">Sound familiar?</p>
          <h2 id="problems-heading" className="dl-section-heading">
            The four things that <em>stall every applicant</em>
          </h2>
          <p className="dl-section-sub">
            Every one of these has a fix inside AdmitPath — paired below each card.
          </p>
        </div>

        {/* lg:grid-cols-4 override — base .dl-features-grid is 3-col. */}
        <div className="dl-features-grid lg:!grid-cols-4">
          {PROBLEMS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.article
                key={p.title}
                className="dl-feature-card"
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: i * 0.1,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <div className="dl-feature-icon">
                  <Icon size={22} strokeWidth={1.75} aria-hidden />
                </div>
                <h3 className="dl-feature-title">{p.title}</h3>
                <p className="dl-feature-desc">{p.body}</p>
                <p
                  style={{
                    marginTop: 16,
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--dl-brand)",
                    fontFamily: "var(--font-jetbrains-mono)",
                    letterSpacing: "0.02em",
                  }}
                >
                  <span aria-hidden>→</span> {p.fix}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
