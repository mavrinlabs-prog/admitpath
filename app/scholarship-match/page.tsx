"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search, Filter, DollarSign, Calendar, ExternalLink, ChevronDown,
  Award, Sparkles, ArrowUpRight, X, Check,
} from "lucide-react";
import { MarketingNav, MarketingCTA } from "@/components/marketing";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SCHOLARSHIPS, parseAmountForSort, type Scholarship } from "@/data/scholarships-db";

/* ── US States for dropdown ─────────────────────────────────────────── */
const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

const MAJOR_OPTIONS = [
  "Computer Science", "Engineering", "Biology", "Chemistry", "Physics",
  "Mathematics", "Pre-Med", "Nursing", "Business", "Finance", "Economics",
  "English", "History", "Political Science", "Psychology", "Art", "Music",
  "Undecided",
];

const DEMOGRAPHIC_OPTIONS: { value: string; label: string }[] = [
  { value: "first-gen", label: "First-generation college student" },
  { value: "low-income", label: "Low-income / Pell-eligible" },
  { value: "female", label: "Female" },
  { value: "URM", label: "Underrepresented minority" },
  { value: "LGBTQ+", label: "LGBTQ+" },
];

const TYPE_OPTIONS: { value: Scholarship["type"]; label: string }[] = [
  { value: "merit", label: "Merit" },
  { value: "need", label: "Need-based" },
  { value: "identity", label: "Identity-based" },
  { value: "essay", label: "Essay" },
  { value: "community", label: "Community service" },
  { value: "stem", label: "STEM" },
  { value: "athletic", label: "Athletic" },
];

/* ── Matching logic ─────────────────────────────────────────────────── */
function matchScholarship(s: Scholarship, profile: {
  gpa: number | null;
  sat: number | null;
  state: string;
  major: string;
  demographics: string[];
}): { score: number; reasons: string[] } {
  let score = 50; // baseline
  const reasons: string[] = [];

  // GPA match
  if (s.gpaMin != null && profile.gpa != null) {
    if (profile.gpa >= s.gpaMin) {
      score += 15;
      reasons.push(`GPA ${profile.gpa} meets ${s.gpaMin} minimum`);
    } else {
      score -= 20;
    }
  }

  // SAT match
  if (s.satMin != null && profile.sat != null) {
    if (profile.sat >= s.satMin) {
      score += 10;
      reasons.push(`SAT ${profile.sat} meets ${s.satMin} minimum`);
    } else {
      score -= 15;
    }
  }

  // State match
  if (profile.state && s.states && !s.states.includes("all")) {
    if (s.states.includes(profile.state)) {
      score += 20;
      reasons.push(`Available in ${profile.state}`);
    } else {
      score -= 30; // regional scholarship, wrong state
    }
  }

  // Major match
  if (profile.major && s.majors && !s.majors.includes("all")) {
    const majorLower = profile.major.toLowerCase();
    const matched = s.majors.some((m) => majorLower.includes(m.toLowerCase()) || m.toLowerCase().includes(majorLower));
    if (matched) {
      score += 15;
      reasons.push(`Matches your major: ${profile.major}`);
    } else {
      score -= 10;
    }
  }

  // Demographic match
  if (profile.demographics.length > 0 && s.demographic && s.demographic.length > 0) {
    const overlap = s.demographic.filter((d) => profile.demographics.includes(d));
    if (overlap.length > 0) {
      score += 20;
      reasons.push(`Matches: ${overlap.join(", ")}`);
    }
  }

  // Renewability bonus
  if (s.renewability === "renewable") {
    score += 5;
    reasons.push("Renewable across years");
  }

  return { score: Math.max(0, Math.min(100, score)), reasons };
}

/* ── Deadline proximity helper ──────────────────────────────────────── */
const MONTH_ORDER: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

function deadlineMonthIndex(deadline: string): number {
  const lower = deadline.toLowerCase();
  for (const [month, idx] of Object.entries(MONTH_ORDER)) {
    if (lower.includes(month)) return idx;
  }
  return 99; // rolling / varies → sort last
}

/* ── Format currency ────────────────────────────────────────────────── */
function formatPotentialTotal(scholarships: Scholarship[]): string {
  let total = 0;
  for (const s of scholarships) {
    total += parseAmountForSort(s.amount);
  }
  if (total >= 1_000_000) return `$${(total / 1_000_000).toFixed(1)}M+`;
  if (total >= 1_000) return `$${Math.round(total / 1_000)}K+`;
  return `$${total.toLocaleString()}`;
}

/* ── Page component ─────────────────────────────────────────────────── */
const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export default function ScholarshipMatchPage() {
  // Profile inputs
  const [gpa, setGpa] = useState<string>("");
  const [sat, setSat] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [major, setMajor] = useState<string>("");
  const [demographics, setDemographics] = useState<string[]>([]);

  // Filters
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Profile values
  const gpaNum = gpa ? parseFloat(gpa) : null;
  const satNum = sat ? parseInt(sat, 10) : null;
  const hasProfile = gpaNum !== null || satNum !== null || state !== "" || major !== "" || demographics.length > 0;

  const toggleDemographic = (d: string) => {
    setDemographics((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  // Match and sort
  const results = useMemo(() => {
    let pool = SCHOLARSHIPS;

    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      pool = pool.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.eligibility.toLowerCase().includes(q)
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      pool = pool.filter((s) => s.type === typeFilter);
    }

    const profile = {
      gpa: gpaNum,
      sat: satNum,
      state,
      major,
      demographics,
    };

    const matched = pool.map((s) => {
      const { score, reasons } = matchScholarship(s, profile);
      return { scholarship: s, matchScore: score, reasons };
    });

    // Sort: match score desc, then amount desc, then deadline proximity
    matched.sort((a, b) => {
      if (hasProfile) {
        const scoreDiff = b.matchScore - a.matchScore;
        if (scoreDiff !== 0) return scoreDiff;
      }
      const amountDiff = parseAmountForSort(b.scholarship.amount) - parseAmountForSort(a.scholarship.amount);
      if (amountDiff !== 0) return amountDiff;
      return deadlineMonthIndex(a.scholarship.deadline) - deadlineMonthIndex(b.scholarship.deadline);
    });

    return matched;
  }, [gpaNum, satNum, state, major, demographics, typeFilter, searchQuery, hasProfile]);

  const potentialTotal = formatPotentialTotal(results.map((r) => r.scholarship));

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <MarketingNav />

      <main id="main" className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        {/* Hero */}
        <ScrollReveal>
          <header className="mb-10 text-center">
            <p className="dl-section-eyebrow">Scholarship Finder</p>
            <h1
              className="mb-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.08]"
              style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
            >
              {SCHOLARSHIPS.length} scholarships.{" "}
              <em style={{ fontFamily: "var(--font-inter)", fontStyle: "italic" }}>Matched to you.</em>
            </h1>
            <p
              className="mx-auto max-w-2xl text-base sm:text-lg leading-relaxed"
              style={{ color: "var(--dl-text-secondary, #454B5E)" }}
            >
              Enter your profile below and we will rank every scholarship by how well it fits.
              No account needed.
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Catalog details can change. Confirm eligibility, deadlines, award amounts, and application links on each provider&apos;s official site before applying.
            </p>
          </header>
        </ScrollReveal>

        {/* Profile form */}
        <ScrollReveal>
          <div
            className="mb-8 rounded-2xl border p-5 sm:p-6"
            style={{
              background: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(16px)",
              borderColor: "rgba(0,0,0,0.06)",
            }}
          >
            <h2
              className="mb-4 text-lg font-bold"
              style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
            >
              Your profile
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* GPA */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                  GPA (unweighted)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4.0"
                  placeholder="e.g. 3.8"
                  value={gpa}
                  onChange={(e) => setGpa(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
                  style={{ borderColor: "rgba(0,0,0,0.08)", backgroundColor: "var(--dl-bg-surface, #EFF2F8)" }}
                />
              </div>

              {/* SAT */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                  SAT Score
                </label>
                <input
                  type="number"
                  step="10"
                  min="400"
                  max="1600"
                  placeholder="e.g. 1450"
                  value={sat}
                  onChange={(e) => setSat(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
                  style={{ borderColor: "rgba(0,0,0,0.08)", backgroundColor: "var(--dl-bg-surface, #EFF2F8)" }}
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                  Home State
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
                  style={{ borderColor: "rgba(0,0,0,0.08)", backgroundColor: "var(--dl-bg-surface, #EFF2F8)" }}
                >
                  <option value="">Select state</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Major */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                  Intended Major
                </label>
                <select
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
                  style={{ borderColor: "rgba(0,0,0,0.08)", backgroundColor: "var(--dl-bg-surface, #EFF2F8)" }}
                >
                  <option value="">Select major</option>
                  {MAJOR_OPTIONS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Demographics */}
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                Background (select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {DEMOGRAPHIC_OPTIONS.map((d) => {
                  const active = demographics.includes(d.value);
                  return (
                    <button
                      key={d.value}
                      onClick={() => toggleDemographic(d.value)}
                      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all"
                      style={{
                        borderColor: active ? "#4A6FA5" : "rgba(0,0,0,0.08)",
                        backgroundColor: active ? "rgba(74,111,165,0.1)" : "transparent",
                        color: active ? "#4A6FA5" : "var(--dl-text-secondary, #454B5E)",
                      }}
                    >
                      {active && <Check className="h-3 w-3" />}
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Stats bar */}
        <ScrollReveal>
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <span
                  className="text-2xl sm:text-3xl font-extrabold tabular-nums"
                  style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                >
                  {results.length}
                </span>
                <span className="ml-1.5 text-sm" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
                  scholarships matched
                </span>
              </div>
              <div
                className="h-8 w-px"
                style={{ backgroundColor: "rgba(0,0,0,0.06)" }}
              />
              <div>
                <span
                  className="text-2xl sm:text-3xl font-extrabold tabular-nums"
                  style={{ color: "#047857", fontFamily: "var(--font-inter)" }}
                >
                  {potentialTotal}
                </span>
                <span className="ml-1.5 text-sm" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
                  potential total
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "var(--dl-text-muted, #8890A5)" }} />
                <input
                  type="text"
                  placeholder="Search scholarships..."
                  aria-label="Search scholarships by name, description, or eligibility"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-56 rounded-lg border pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
                  style={{ borderColor: "rgba(0,0,0,0.08)", backgroundColor: "rgba(255,255,255,0.55)" }}
                />
              </div>

              {/* Filter toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                aria-expanded={showFilters}
                aria-label="Toggle scholarship type filters"
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all"
                style={{
                  borderColor: showFilters ? "#4A6FA5" : "rgba(0,0,0,0.08)",
                  backgroundColor: showFilters ? "rgba(74,111,165,0.1)" : "rgba(255,255,255,0.55)",
                  color: showFilters ? "#4A6FA5" : "var(--dl-text-secondary, #454B5E)",
                }}
              >
                <Filter className="h-3.5 w-3.5" />
                Filter
                <ChevronDown className={`h-3 w-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Filters panel */}
        {showFilters && (
          <div
            className="mb-6 rounded-2xl border p-4"
            style={{
              background: "rgba(255,255,255,0.45)",
              backdropFilter: "blur(12px)",
              borderColor: "rgba(0,0,0,0.06)",
            }}
          >
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTypeFilter("all")}
                className="rounded-full border px-3 py-1.5 text-xs font-medium transition-all"
                style={{
                  borderColor: typeFilter === "all" ? "#4A6FA5" : "rgba(0,0,0,0.08)",
                  backgroundColor: typeFilter === "all" ? "rgba(74,111,165,0.1)" : "transparent",
                  color: typeFilter === "all" ? "#4A6FA5" : "var(--dl-text-secondary, #454B5E)",
                }}
              >
                All types
              </button>
              {TYPE_OPTIONS.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTypeFilter(t.value)}
                  className="rounded-full border px-3 py-1.5 text-xs font-medium transition-all"
                  style={{
                    borderColor: typeFilter === t.value ? "#4A6FA5" : "rgba(0,0,0,0.08)",
                    backgroundColor: typeFilter === t.value ? "rgba(74,111,165,0.1)" : "transparent",
                    color: typeFilter === t.value ? "#4A6FA5" : "var(--dl-text-secondary, #454B5E)",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <p className="mb-3 text-sm text-[var(--dl-text-secondary,#454B5E)]">
            Relevance scores are not eligibility decisions or award probabilities. Verify current
            requirements and deadlines on each scholarship&apos;s official site before applying.
          </p>
        )}
        <div className="space-y-3">
          {results.map((m, i) => {
            const s = m.scholarship;
            const typeColors: Record<string, { bg: string; text: string }> = {
              merit: { bg: "rgba(74,111,165,0.08)", text: "#4A6FA5" },
              need: { bg: "#D1FAE5", text: "#047857" },
              identity: { bg: "#EDE9FE", text: "#6D28D9" },
              essay: { bg: "#FEF3C7", text: "#92400E" },
              community: { bg: "#DBEAFE", text: "#1D4ED8" },
              stem: { bg: "#CFFAFE", text: "#0E7490" },
              athletic: { bg: "#FEE2E2", text: "#991B1B" },
            };
            const tc = typeColors[s.type] || typeColors.merit;

            return (
              <div
                key={s.id}
                className="dl-card-hover rounded-2xl border p-5 sm:p-6 transition-all"
                style={{
                  background: "rgba(255,255,255,0.45)",
                  backdropFilter: "blur(12px)",
                  borderColor: "rgba(0,0,0,0.06)",
                }}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    {/* Header row */}
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h2
                        className="text-[15px] sm:text-[16px] font-semibold"
                        style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                      >
                        {s.name}
                      </h2>
                      {hasProfile && (
                        <span
                          className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-mono font-semibold tabular-nums"
                          style={{
                            color: m.matchScore >= 70 ? "#047857" : m.matchScore >= 50 ? "#4A6FA5" : "var(--dl-text-muted, #5A6275)",
                            background: m.matchScore >= 70 ? "#D1FAE5" : m.matchScore >= 50 ? "rgba(74,111,165,0.08)" : "rgba(0,0,0,0.04)",
                          }}
                        >
                          {m.matchScore}/100 relevance
                        </span>
                      )}
                      <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize"
                        style={{ background: tc.bg, color: tc.text }}
                      >
                        {s.type}
                      </span>
                      {s.renewability === "renewable" && (
                        <span
                          className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                          style={{ background: "#D1FAE5", color: "#047857" }}
                        >
                          Renewable
                        </span>
                      )}
                    </div>

                    {/* Amount */}
                    <p
                      className="text-xl sm:text-2xl font-bold mb-2 tabular-nums"
                      style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                    >
                      {s.amount}
                    </p>

                    {/* Description */}
                    <p
                      className="text-[13px] sm:text-[14px] leading-relaxed mb-2"
                      style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                    >
                      {s.description}
                    </p>

                    {/* Eligibility */}
                    <p
                      className="text-[12px] leading-relaxed mb-2"
                      style={{ color: "var(--dl-text-muted, #8890A5)" }}
                    >
                      <span className="font-semibold" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Eligibility:</span>{" "}
                      {s.eligibility}
                    </p>

                    {/* Match reasons */}
                    {hasProfile && m.reasons.length > 0 && (
                      <ul className="mb-2 space-y-0.5">
                        {m.reasons.map((r, ri) => (
                          <li
                            key={ri}
                            className="flex items-start gap-1.5 text-[11px] sm:text-[12px]"
                            style={{ color: "#047857" }}
                          >
                            <Sparkles className="h-3 w-3 mt-0.5 shrink-0" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Meta row */}
                    <div
                      className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] sm:text-[12px]"
                      style={{ color: "var(--dl-text-muted, #8890A5)" }}
                    >
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Deadline: {s.deadline}
                      </span>
                      {s.gpaMin && (
                        <span className="flex items-center gap-1">
                          GPA: {s.gpaMin}+
                        </span>
                      )}
                      {s.satMin && (
                        <span className="flex items-center gap-1">
                          SAT: {s.satMin}+
                        </span>
                      )}
                      {s.states && !s.states.includes("all") && (
                        <span className="flex items-center gap-1">
                          States: {s.states.join(", ")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Apply button */}
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-[12px] sm:text-[13px] font-semibold transition-all hover:opacity-90"
                    style={{ backgroundColor: "#4A6FA5", color: "#fff" }}
                  >
                    Apply
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {results.length === 0 && (
          <div
            className="rounded-2xl border p-8 text-center"
            style={{ background: "rgba(255,255,255,0.45)", borderColor: "rgba(0,0,0,0.06)" }}
          >
            <Award className="mx-auto h-10 w-10 mb-3" style={{ color: "var(--dl-text-muted, #8890A5)" }} />
            <p className="text-sm font-medium" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              No scholarships match your current filters. Try broadening your search.
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12">
          <ScrollReveal>
            <MarketingCTA
              headline="Save matches to your profile"
              description="Create an AdmitPath account to save your scholarship matches, track deadlines, and get personalized application guidance. Free plan included. Pro $19.99/mo."
              buttonText="Create free account"
            />
          </ScrollReveal>
        </div>
      </main>
    </div>
  );
}
