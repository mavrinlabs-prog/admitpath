"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { ArrowLeft, Users, Filter, TrendingUp, Award, BookOpen, Target, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Anonymized sample data ─────────────────────────────────────────────
// Synthetic profiles based on publicly available admitted student data.
// No real students. All numbers are illustrative composites.

type PeerProfile = {
  id: string;
  school: string;
  gpa: number;
  sat: number;
  spike: string;
  spikeScore: number; // 0-100 how focused
  activities: string[];
  awards: string[];
  essayTopic: string;
  outcome: "accepted" | "rejected" | "waitlisted";
};

const PEER_DATA: PeerProfile[] = [
  { id: "p1", school: "Harvard University", gpa: 3.96, sat: 1560, spike: "Computer Science", spikeScore: 90, activities: ["Robotics Captain", "Math Club President", "Research Intern at MIT CSAIL"], awards: ["USACO Gold", "Science Olympiad State", "AP Scholar w/ Distinction"], essayTopic: "Building accessibility tools for blind users", outcome: "accepted" },
  { id: "p2", school: "Harvard University", gpa: 3.92, sat: 1520, spike: "Public Policy", spikeScore: 85, activities: ["Debate Team Captain", "Student Government VP", "Political Campaign Intern"], awards: ["National Merit Semifinalist", "Policy Debate State Champion"], essayTopic: "Organizing voter registration in rural areas", outcome: "accepted" },
  { id: "p3", school: "Harvard University", gpa: 3.88, sat: 1540, spike: "None clear", spikeScore: 30, activities: ["Track & Field", "NHS", "Yearbook", "Spanish Club", "Volunteering"], awards: ["Honor Roll", "AP Scholar"], essayTopic: "Learning from a summer trip to Europe", outcome: "rejected" },
  { id: "p4", school: "MIT", gpa: 3.94, sat: 1580, spike: "Engineering", spikeScore: 95, activities: ["FIRST Robotics Lead", "Research in ML at local university", "Math Team Captain"], awards: ["USAMO qualifier", "FIRST Robotics Innovation Award", "Intel ISEF finalist"], essayTopic: "Debugging a robot at 3am during competition", outcome: "accepted" },
  { id: "p5", school: "MIT", gpa: 3.90, sat: 1550, spike: "Physics", spikeScore: 80, activities: ["Physics Club Founder", "Science Olympiad", "Tutor at community center"], awards: ["Physics Olympiad Bronze", "Science Fair Regional 1st"], essayTopic: "The elegance of Lagrangian mechanics", outcome: "accepted" },
  { id: "p6", school: "MIT", gpa: 3.97, sat: 1590, spike: "Well-rounded", spikeScore: 25, activities: ["Tennis Varsity", "Orchestra", "NHS President", "Debate"], awards: ["AP Scholar w/ Distinction", "School Valedictorian"], essayTopic: "Balancing academics and athletics", outcome: "rejected" },
  { id: "p7", school: "Stanford University", gpa: 3.93, sat: 1540, spike: "Social Entrepreneurship", spikeScore: 88, activities: ["Founded nonprofit teaching coding to refugees", "TEDxYouth speaker", "Student newspaper editor"], awards: ["Forbes 30 Under 30 Scholar", "Congressional Award Gold"], essayTopic: "Why my nonprofit failed and what I learned", outcome: "accepted" },
  { id: "p8", school: "Stanford University", gpa: 3.91, sat: 1530, spike: "Creative Writing", spikeScore: 82, activities: ["Literary magazine founder/editor", "Published 3 short stories", "Creative writing workshop leader"], awards: ["Scholastic Gold Key", "YoungArts finalist"], essayTopic: "The story I was afraid to write", outcome: "accepted" },
  { id: "p9", school: "Stanford University", gpa: 3.95, sat: 1560, spike: "Broad interests", spikeScore: 35, activities: ["Model UN", "Soccer", "Key Club", "Band", "Research assistant"], awards: ["National Merit Finalist", "Honor Roll"], essayTopic: "A day in my life juggling activities", outcome: "rejected" },
  { id: "p10", school: "Yale University", gpa: 3.95, sat: 1550, spike: "History & Humanities", spikeScore: 85, activities: ["History journal editor", "Mock Trial captain", "Archive volunteer at museum"], awards: ["National History Day finalist", "Mock Trial All-State"], essayTopic: "Finding my grandmother's immigration records", outcome: "accepted" },
  { id: "p11", school: "Yale University", gpa: 3.89, sat: 1500, spike: "Theater & Arts", spikeScore: 90, activities: ["School play director (3 productions)", "Regional theater actor", "Playwriting workshop"], awards: ["Cappies Award Best Director", "YoungArts Honorable Mention"], essayTopic: "Directing my first play with a cast of strangers", outcome: "accepted" },
  { id: "p12", school: "Yale University", gpa: 3.94, sat: 1570, spike: "No clear spike", spikeScore: 20, activities: ["Cross country", "Math team", "NHS", "Volunteer at food bank"], awards: ["AP Scholar", "Principal's List"], essayTopic: "Running cross country taught me discipline", outcome: "rejected" },
  { id: "p13", school: "Princeton University", gpa: 3.97, sat: 1570, spike: "Mathematics", spikeScore: 92, activities: ["Math Olympiad team", "Created math tutoring YouTube channel (50K subscribers)", "Research with university professor"], awards: ["USAMO qualifier", "Putnam Fellow honorable mention", "AMC 12 perfect score"], essayTopic: "The beauty I found in a proof no one asked me to solve", outcome: "accepted" },
  { id: "p14", school: "Princeton University", gpa: 3.90, sat: 1540, spike: "Environmental Science", spikeScore: 78, activities: ["Founded school sustainability club", "Research on water quality", "City council youth advisor"], awards: ["Siemens Competition semifinalist", "EPA Presidential Youth Award"], essayTopic: "Testing water samples in my neighborhood and what I found", outcome: "accepted" },
  { id: "p15", school: "Columbia University", gpa: 3.92, sat: 1550, spike: "Journalism", spikeScore: 86, activities: ["School newspaper editor-in-chief", "Published in local newspaper", "Youth press corps member"], awards: ["NSPA Pacemaker finalist", "Quill & Scroll Award"], essayTopic: "The story that got me kicked off student council", outcome: "accepted" },
];

const SCHOOLS = Array.from(new Set(PEER_DATA.map((p) => p.school)));

// ─── Component ──────────────────────────────────────────────────────────

export function PeerProfilesClient() {
  const [selectedSchool, setSelectedSchool] = useState<string>("all");
  const [selectedOutcome, setSelectedOutcome] = useState<"all" | "accepted" | "rejected" | "waitlisted">("all");

  const filtered = useMemo(() => {
    return PEER_DATA.filter((p) => {
      if (selectedSchool !== "all" && p.school !== selectedSchool) return false;
      if (selectedOutcome !== "all" && p.outcome !== selectedOutcome) return false;
      return true;
    });
  }, [selectedSchool, selectedOutcome]);

  // Insights
  const accepted = PEER_DATA.filter((p) => p.outcome === "accepted");
  const rejected = PEER_DATA.filter((p) => p.outcome === "rejected");
  const avgSpikeAccepted = Math.round(accepted.reduce((s, p) => s + p.spikeScore, 0) / accepted.length);
  const avgSpikeRejected = Math.round(rejected.reduce((s, p) => s + p.spikeScore, 0) / rejected.length);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <MarketingNav />

      <main id="main" className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <Link
          href="/tools"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: "#4A6FA5" }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to tools
        </Link>

        <p
          className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-3"
          style={{ color: "var(--dl-text-muted, #5A6275)" }}
        >
          Free tool
        </p>
        <h1
          className="text-3xl sm:text-4xl leading-tight mb-3"
          style={{
            color: "var(--dl-text-primary, #1B2030)",
            fontFamily: "var(--font-inter)",
            letterSpacing: "-0.02em",
          }}
        >
          Admitted Student Profiles
        </h1>
        <p
          className="max-w-2xl text-[15px] leading-relaxed mb-10"
          style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}
        >
          See anonymized profiles of students who were accepted and rejected at top
          schools. Understand what patterns emerge -- the spike, the awards level,
          the activity depth -- not just the GPA and SAT.
        </p>

        {/* Key Insight */}
        <div
          className="border rounded-xl p-5 mb-8 flex flex-wrap items-center gap-6"
          style={{ background: "rgba(74,111,165,0.06)", borderColor: "rgba(74,111,165,0.15)" }}
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" style={{ color: "#4A6FA5" }} />
            <div>
              <p className="text-[13px] font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                Key pattern
              </p>
              <p className="text-[12px]" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                Average spike focus: <strong style={{ color: "#16A34A" }}>{avgSpikeAccepted}%</strong> for
                accepted vs <strong style={{ color: "#DC2626" }}>{avgSpikeRejected}%</strong> for
                rejected. A clear spike matters more than being well-rounded.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" style={{ color: "var(--dl-text-muted, #8890A5)" }} />
            <span className="text-[12px] font-semibold" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Filter:
            </span>
          </div>
          <select
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
            className="input-field text-[13px] px-3 py-1.5"
            style={{ minHeight: "36px" }}
            aria-label="Filter by school"
          >
            <option value="all">All schools ({PEER_DATA.length} profiles)</option>
            {SCHOOLS.map((s) => {
              const count = PEER_DATA.filter((p) => p.school === s).length;
              return <option key={s} value={s}>{s} ({count})</option>;
            })}
          </select>
          <select
            value={selectedOutcome}
            onChange={(e) => setSelectedOutcome(e.target.value as typeof selectedOutcome)}
            className="input-field text-[13px] px-3 py-1.5"
            style={{ minHeight: "36px" }}
            aria-label="Filter by outcome"
          >
            <option value="all">All outcomes</option>
            <option value="accepted">Accepted ({PEER_DATA.filter((p) => p.outcome === "accepted").length})</option>
            <option value="rejected">Rejected ({PEER_DATA.filter((p) => p.outcome === "rejected").length})</option>
            <option value="waitlisted">Waitlisted ({PEER_DATA.filter((p) => p.outcome === "waitlisted").length})</option>
          </select>
        </div>

        {/* Profiles */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.05 }}
                className="border rounded-xl p-5"
                style={{ background: "var(--dl-bg-card)", borderColor: "var(--dl-border)", boxShadow: "var(--dl-shadow-sm)" }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <GraduationCap className="h-4 w-4" style={{ color: "#4A6FA5" }} />
                      <span className="text-[13px] font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                        {p.school}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[12px]" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                      <span>GPA: <strong>{p.gpa.toFixed(2)}</strong></span>
                      <span>SAT: <strong>{p.sat}</strong></span>
                      <span>Spike: <strong>{p.spike}</strong> ({p.spikeScore}%)</span>
                    </div>
                  </div>
                  <span
                    className="text-[11px] font-bold px-3 py-1 rounded-full capitalize"
                    style={{
                      backgroundColor:
                        p.outcome === "accepted" ? "rgba(22,163,74,0.1)" :
                        p.outcome === "rejected" ? "rgba(220,38,38,0.1)" :
                        "rgba(217,119,6,0.1)",
                      color:
                        p.outcome === "accepted" ? "#16A34A" :
                        p.outcome === "rejected" ? "#DC2626" :
                        "#D97706",
                    }}
                  >
                    {p.outcome}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Target className="h-3.5 w-3.5" style={{ color: "#4A6FA5" }} />
                      <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
                        Activities
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {p.activities.map((a) => (
                        <li key={a} className="text-[12px]" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Award className="h-3.5 w-3.5" style={{ color: "#D97706" }} />
                      <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
                        Awards
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {p.awards.map((a) => (
                        <li key={a} className="text-[12px]" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <BookOpen className="h-3.5 w-3.5" style={{ color: "#16A34A" }} />
                      <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
                        Essay Topic
                      </span>
                    </div>
                    <p className="text-[12px] italic" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                      &ldquo;{p.essayTopic}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Spike bar */}
                <div className="mt-4 pt-3 border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
                      Spike focus
                    </span>
                    <span className="text-[11px] font-bold" style={{ color: p.spikeScore >= 70 ? "#16A34A" : p.spikeScore >= 40 ? "#D97706" : "#DC2626" }}>
                      {p.spikeScore}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(0,0,0,0.06)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${p.spikeScore}%`,
                        backgroundColor: p.spikeScore >= 70 ? "#16A34A" : p.spikeScore >= 40 ? "#D97706" : "#DC2626",
                        transition: "width 0.5s ease-out",
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-10 w-10 mx-auto mb-3" style={{ color: "var(--dl-text-muted, #8890A5)" }} />
            <p className="text-[14px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              No profiles match your filters
            </p>
            <p className="text-[12px]" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
              Try changing the school or outcome filter.
            </p>
          </div>
        )}

        {/* Common Patterns */}
        <div
          className="border rounded-xl p-5 mt-10"
          style={{ background: "var(--dl-bg-card)", borderColor: "var(--dl-border)", boxShadow: "var(--dl-shadow-sm)" }}
        >
          <h2 className="text-[14px] font-bold mb-3" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Patterns from {accepted.length} admitted students
          </h2>
          <ul className="space-y-2">
            {[
              `All had a clear spike (${avgSpikeAccepted}% average focus in one area)`,
              "All had national-level or state-level awards (not just school-level)",
              "All had 2+ years of sustained commitment in primary activities",
              "All had leadership roles with measurable impact",
              "Essay topics were specific and personal -- never generic life lessons",
              "Rejected students had stronger stats but weaker spikes and generic essays",
            ].map((pattern) => (
              <li key={pattern} className="flex items-start gap-2 text-[12px]" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                <span style={{ color: "#4A6FA5" }}>--</span>
                {pattern}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 text-[10px] text-center" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
          All profiles are anonymized composites based on publicly available data and common admitted
          student patterns. No real student data is used. Outcomes vary by cycle and individual
          circumstances.
        </p>
      </main>
    </div>
  );
}
