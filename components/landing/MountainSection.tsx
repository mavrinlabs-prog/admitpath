"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ClipboardList, Target, PenLine, Trophy, GraduationCap, type LucideIcon } from "lucide-react";

type Milestone = {
  level: string;
  description: string;
  Icon: LucideIcon;
  x: string;
  y: string;
};

// Five stages of the application climb. The final stage was previously
// labeled "Summit" — we relabeled to "Target School" because the literal goal
// the student is climbing toward IS their target school, not an abstract peak.
// Keeping the climb metaphor in surrounding copy ("path", "altitude") so the
// visual still works.
const milestones: Milestone[] = [
  { level: "Base Camp",   description: "Complete your profile + first AI analysis",                         Icon: ClipboardList, x: "8%",  y: "78%" },
  { level: "Camp 1",      description: "Build your college list (reach / target / safety)",                  Icon: Target,        x: "26%", y: "58%" },
  { level: "Camp 2",      description: "Draft + score your Common App essay",                                Icon: PenLine,       x: "46%", y: "40%" },
  { level: "Camp 3",      description: "Strengthen extracurriculars + apply for competitions",               Icon: Trophy,        x: "66%", y: "24%" },
  { level: "Target School",description: "Submit applications with a complete, competitive profile",           Icon: GraduationCap, x: "86%", y: "8%"  },
];

function MilestoneMarker({
  milestone,
  index,
}: {
  milestone: (typeof milestones)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const isSummit = index === milestones.length - 1;

  return (
    <motion.g
      ref={ref}
      initial={false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.15, ease: "backOut" }}
    >
      {/* Outer glow ring */}
      <motion.circle
        cx="50%"
        cy="50%"
        r={isSummit ? 22 : 18}
        fill="none"
        stroke={isSummit ? "#4A6FA5" : "rgba(74,111,165,0.4)"}
        strokeWidth={isSummit ? 2 : 1.5}
        animate={
          isInView
            ? {
                r: isSummit ? [22, 28, 22] : [18, 24, 18],
                opacity: [0.8, 0.2, 0.8],
              }
            : {}
        }
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
      />
      {/* Inner dot */}
      <circle cx="50%" cy="50%" r={isSummit ? 12 : 9} fill={isSummit ? "#4A6FA5" : "#fff"} stroke="#4A6FA5" strokeWidth={isSummit ? 0 : 2.5} />
      {/* Dream-school marker uses a hand-drawn star path so it renders as a
          true vector at any scale — earlier code used a unicode ★ glyph
          which rasterized differently across OS/browser font stacks and
          read as "AI-generated" placeholder. */}
      {isSummit && (
        <path
          d="M0,-6 L1.76,-1.85 L6.18,-1.31 L2.91,1.71 L3.71,6.06 L0,3.85 L-3.71,6.06 L-2.91,1.71 L-6.18,-1.31 L-1.76,-1.85 Z"
          fill="#fff"
          stroke="#fff"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
      )}
    </motion.g>
  );
}

export function MountainSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-5%" });

  // SVG viewBox: 0 0 1000 500
  // Mountain path: rises diagonally from bottom-left to top-right
  const mountainPath =
    "M0,500 L0,420 C50,410 80,390 120,370 C180,340 220,300 280,270 C340,240 380,210 440,185 C500,158 540,135 600,115 C660,95 700,75 760,58 C820,42 860,30 910,20 C940,14 970,10 1000,8 L1000,500 Z";

  const mountainOutline =
    "M0,420 C50,410 80,390 120,370 C180,340 220,300 280,270 C340,240 380,210 440,185 C500,158 540,135 600,115 C660,95 700,75 760,58 C820,42 860,30 910,20 C940,14 970,10 1000,8";

  // Milestone positions on the mountain path (x, y in viewBox coords)
  const markerPositions = [
    { x: 100, y: 380 },
    { x: 270, y: 278 },
    { x: 450, y: 188 },
    { x: 650, y: 108 },
    { x: 880, y: 28 },
  ];

  return (
    <section
      className="relative overflow-hidden py-28"
      style={{
        background: "linear-gradient(180deg, #EEF3FA 0%, #E8EFF8 40%, #D5DCE8 100%)",
      }}
    >
      {/* Decorative radial behind mountain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 80% 80%, rgba(74,111,165,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center" ref={sectionRef}>
          <motion.p
            className="section-label"
            initial={false}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45 }}
          >
            How AdmitPath works
          </motion.p>
          <motion.h2
            className="mb-5 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
            style={{ color: "var(--dl-text-primary, #1B2030)", lineHeight: 1.08 }}
            initial={false}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            The path to your{" "}
            <span
              style={{
                fontStyle: "italic",
                background: "linear-gradient(135deg, #1E3352 0%, #4A6FA5 50%, #2E4A6E 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              target school
            </span>
          </motion.h2>
          <motion.p
            className="mx-auto max-w-2xl text-lg leading-relaxed"
            style={{ color: "var(--dl-text-secondary, #454B5E)" }}
            initial={false}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            Every application is a climb. AdmitPath maps your exact position on the mountain, shows your
            altitude relative to top schools, and tells you precisely what to do next.
          </motion.p>
        </div>

        {/* Mountain SVG visual */}
        <motion.div
          className="relative w-full"
          initial={false}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.25 }}
        >
          <svg
            viewBox="0 0 1000 500"
            className="w-full"
            style={{ display: "block", overflow: "visible" }}
            aria-label="Mountain path showing the 5 stages of college application"
          >
            <defs>
              <linearGradient id="mountainFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4A6FA5" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#4A6FA5" stopOpacity="0.04" />
              </linearGradient>
              <linearGradient id="mountainStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#D5E0EE" />
                <stop offset="50%" stopColor="#4A6FA5" />
                <stop offset="100%" stopColor="#1E3352" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Mountain fill */}
            <motion.path
              d={mountainPath}
              fill="url(#mountainFill)"
              initial={false}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            />

            {/* Mountain outline — animated draw */}
            <motion.path
              d={mountainOutline}
              fill="none"
              stroke="url(#mountainStroke)"
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="url(#glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 1.4, delay: 0.4, ease: "easeInOut" }}
            />

            {/* Dashed grid lines for altitude feel */}
            {[100, 200, 300, 400].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="1000"
                y2={y}
                stroke="rgba(74,111,165,0.08)"
                strokeWidth="1"
                strokeDasharray="8 12"
              />
            ))}

            {/* Milestone markers */}
            {markerPositions.map((pos, i) => (
              <g key={milestones[i].level} transform={`translate(${pos.x}, ${pos.y})`}>
                <MilestoneMarker milestone={milestones[i]} index={i} />
              </g>
            ))}
          </svg>

          {/* Milestone labels — positioned absolutely over SVG */}
          <div className="absolute inset-0 pointer-events-none">
            {milestones.map((m, i) => {
              const pos = markerPositions[i];
              const pctX = (pos.x / 1000) * 100;
              const pctY = (pos.y / 500) * 100;
              const isSummit = i === milestones.length - 1;
              // Alternate label above/below
              const labelBelow = i % 2 === 0 && !isSummit;

              return (
                <motion.div
                  key={m.level}
                  className="absolute"
                  style={{
                    left: `${pctX}%`,
                    top: `${pctY}%`,
                    transform: "translate(-50%, 0)",
                  }}
                  initial={false}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.6 + i * 0.15 }}
                >
                  <div
                    className={`w-36 rounded-2xl border px-3 py-2.5 text-center shadow-md ${
                      labelBelow ? "mt-8" : "mb-8 -translate-y-full"
                    } ${isSummit ? "border-[#4A6FA5] border-2" : ""}`}
                    style={{
                      background: isSummit
                        ? "linear-gradient(135deg, #4A6FA5, #1E3352)"
                        : "rgba(255,255,255,0.45)",
                      borderColor: isSummit ? "#4A6FA5" : "rgba(0,0,0,0.06)",
                      boxShadow: isSummit
                        ? "0 8px 32px rgba(74,111,165,0.30)"
                        : "var(--shadow-md)",
                    }}
                  >
                    <p
                      className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: isSummit ? "rgba(255,255,255,0.85)" : "#4A6FA5" }}
                    >
                      <m.Icon className="h-3 w-3" strokeWidth={2.25} aria-hidden />
                      {m.level}
                    </p>
                    <p
                      className="mt-1 text-[10px] leading-tight"
                      style={{ color: isSummit ? "rgba(255,255,255,0.9)" : "var(--dl-text-secondary, #454B5E)" }}
                    >
                      {m.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom CTA strip */}
        <motion.div
          className="mt-16 mx-auto max-w-2xl rounded-3xl border-2 p-8 text-center"
          style={{
            background: "linear-gradient(135deg, #E8EFF8, #D5E0EE)",
            borderColor: "#D5E0EE",
            boxShadow: "0 12px 48px rgba(74,111,165,0.12)",
          }}
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <p className="text-2xl font-bold mb-2" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Where are you on the mountain?
          </p>
          <p className="text-sm mb-6" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            AdmitPath pinpoints your exact position and builds a custom route to your target school.
          </p>
          {/* Dream-school CTA: dark slate-grey gradient (per design lock —
              keeps it visually distinct from the primary blue Plus/Pro
              buttons elsewhere on the page so the eye doesn't read three
              identical CTAs in a row). */}
          <Link
            href="/sign-up"
            className="px-8 py-3 text-sm inline-flex items-center gap-2 rounded-xl font-semibold text-white transition-all hover:-translate-y-px"
            style={{
              background: "linear-gradient(135deg, #2A3040 0%, #1B2030 100%)",
              boxShadow: "0 6px 24px rgba(26,26,24,0.28), inset 0 1px 0 rgba(255,255,255,0.08)",
              letterSpacing: "-0.005em",
            }}
          >
            Get started
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
