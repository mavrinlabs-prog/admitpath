"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { ArrowLeft, CheckCircle2, Circle, ExternalLink, AlertTriangle, Clock, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ──────────────────────────────────────────────────────────────

type ChecklistItem = {
  id: string;
  step: number;
  title: string;
  description: string;
  details: string[];
  link?: { label: string; url: string };
  warning?: string;
  timeEstimate?: string;
};

const CHECKLIST: ChecklistItem[] = [
  {
    id: "fsa-id",
    step: 1,
    title: "Create FSA IDs (student AND one parent)",
    description: "Both the student and one parent need separate FSA IDs to sign the FAFSA electronically.",
    details: [
      "Go to studentaid.gov and click 'Create Account'",
      "Use a personal email address (not school email)",
      "Each person needs their own unique email",
      "Write down your username and password -- you will need them every year",
      "The parent FSA ID is required to sign the application",
    ],
    link: { label: "Create FSA ID", url: "https://studentaid.gov/fsa-id/create-account/launch" },
    warning: "FSA ID can take up to 3 days to verify. Create it BEFORE you start the FAFSA.",
    timeEstimate: "15 minutes per person",
  },
  {
    id: "gather-docs",
    step: 2,
    title: "Gather required documents",
    description: "Have these ready before you start. Searching for documents mid-form is the #1 reason people abandon the FAFSA.",
    details: [
      "Social Security numbers (student + parents)",
      "Driver's license (if you have one)",
      "Federal tax returns from 2 years prior (e.g., 2024 taxes for 2026-27 FAFSA)",
      "W-2 forms and other records of income",
      "Bank statements (checking, savings, investment balances)",
      "Records of untaxed income (child support, interest income, etc.)",
      "List of schools you want to receive your FAFSA (up to 20)",
    ],
    warning: "The FAFSA uses tax data from TWO years prior. For the 2026-27 FAFSA, you need 2024 tax returns.",
    timeEstimate: "30 minutes to gather",
  },
  {
    id: "irs-drt",
    step: 3,
    title: "Use the IRS Data Retrieval Tool (DRT)",
    description: "The DRT auto-fills your tax information directly from the IRS. This is faster AND reduces verification risk.",
    details: [
      "When you reach the financial section, choose 'Link to IRS'",
      "It will redirect you to the IRS site to verify identity",
      "Tax data is pulled automatically -- less chance of errors",
      "If DRT is unavailable, manually enter from your tax return",
      "DRT reduces your chance of being selected for verification by ~60%",
    ],
    warning: "If you or your parents filed an amended return, the DRT may not be available. You will need to enter tax info manually.",
    timeEstimate: "5 minutes",
  },
  {
    id: "fill-fafsa",
    step: 4,
    title: "Complete the FAFSA form",
    description: "Fill out each section carefully. The form has 5 main sections.",
    details: [
      "Section 1: Student demographics (name, DOB, SSN, citizenship)",
      "Section 2: School selection (add up to 20 schools -- order does NOT matter)",
      "Section 3: Dependency status (most students under 24 are 'dependent')",
      "Section 4: Parent information (income, assets, household size)",
      "Section 5: Student financials (your income, savings, investments)",
      "Review all entries before signing -- especially income numbers",
    ],
    link: { label: "Start FAFSA", url: "https://studentaid.gov/h/apply-for-aid/fafsa" },
    timeEstimate: "30-45 minutes",
  },
  {
    id: "sign-submit",
    step: 5,
    title: "Sign and submit",
    description: "Both the student and one parent must sign using their FSA IDs.",
    details: [
      "Student signs first with their FSA ID",
      "Parent signs second with their FSA ID",
      "Both signatures are required for a dependent student",
      "You will receive a confirmation number -- save it",
      "Confirmation email arrives within 24-48 hours",
    ],
    warning: "Unsigned FAFSAs are the most common processing delay. Make sure BOTH sign.",
    timeEstimate: "5 minutes",
  },
  {
    id: "review-sar",
    step: 6,
    title: "Review your Student Aid Report (SAR)",
    description: "3-5 days after submission, you will receive the SAR with your Student Aid Index (SAI).",
    details: [
      "SAR arrives via email or is available at studentaid.gov",
      "Check for errors -- especially income, household size, school list",
      "The SAI (Student Aid Index) replaces the old EFC",
      "Lower SAI = more need-based aid eligibility",
      "If there are errors, correct and resubmit ASAP",
    ],
    timeEstimate: "15 minutes to review",
  },
  {
    id: "compare-offers",
    step: 7,
    title: "Compare financial aid offers",
    description: "Schools will send award letters 2-4 weeks after receiving your FAFSA. Compare carefully.",
    details: [
      "Separate grants (free money) from loans (debt)",
      "Calculate the true net cost at each school",
      "Check if the school meets full demonstrated need",
      "Look for merit scholarships on top of need-based aid",
      "Use AdmitPath's Aid Comparison tool for side-by-side analysis",
    ],
    link: { label: "Compare aid offers", url: "/aid-comparison" },
    timeEstimate: "1-2 hours",
  },
];

const STORAGE_KEY = "admitpath:fafsa-checklist";

// ─── Component ──────────────────────────────────────────────────────────

export function FAFSAChecklistClient() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  // Load from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCompleted(new Set(JSON.parse(raw)));
    } catch {
      // ignore
    }
  }, []);

  function toggle(id: string) {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
        }
      } catch {
        // localStorage might be full or disabled in private browsing
      }
      return next;
    });
  }

  function resetChecklist() {
    setCompleted(new Set());
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch { /* ignore */ }
  }

  const pct = CHECKLIST.length > 0 ? Math.round((completed.size / CHECKLIST.length) * 100) : 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <MarketingNav />

      <main id="main" className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
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
          FAFSA Filing Checklist
        </h1>
        <p
          className="max-w-2xl text-[15px] leading-relaxed mb-6"
          style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}
        >
          Step-by-step guide to filing the FAFSA. Check off each step as you
          complete it. Your progress is saved locally.
        </p>

        {/* Progress bar */}
        <div
          className="border rounded-xl p-4 mb-8"
          style={{ background: "var(--dl-bg-card)", borderColor: "var(--dl-border)", boxShadow: "var(--dl-shadow-sm)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-semibold" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Progress: {completed.size} / {CHECKLIST.length} steps
            </span>
            <span className="text-[12px] font-bold" style={{ color: pct === 100 ? "#16A34A" : "#4A6FA5" }}>
              {pct}%
            </span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(0,0,0,0.06)" }}>
            <motion.div
              className="h-full rounded-full"
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ backgroundColor: pct === 100 ? "#16A34A" : "#4A6FA5" }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {CHECKLIST.map((item) => {
            const done = completed.has(item.id);
            return (
              <motion.div
                key={item.id}
                layout
                className="border rounded-xl overflow-hidden"
                style={{
                  background: done ? "rgba(22,163,74,0.03)" : "var(--dl-bg-card)",
                  borderColor: done ? "rgba(22,163,74,0.2)" : "var(--dl-border)",
                  boxShadow: "var(--dl-shadow-sm)",
                }}
              >
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full text-left flex items-start gap-3 p-5"
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {done ? (
                      <CheckCircle2 className="h-5 w-5" style={{ color: "#16A34A" }} />
                    ) : (
                      <Circle className="h-5 w-5" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[11px] font-bold px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: "rgba(74,111,165,0.1)", color: "#4A6FA5" }}
                      >
                        Step {item.step}
                      </span>
                      {item.timeEstimate && (
                        <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                          <Clock className="h-3 w-3" />
                          {item.timeEstimate}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-[14px] font-bold mb-1 ${done ? "line-through" : ""}`}
                      style={{ color: done ? "var(--dl-text-muted, #5A6275)" : "var(--dl-text-primary, #1B2030)" }}
                    >
                      {item.title}
                    </p>
                    <p className="text-[12px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                      {item.description}
                    </p>
                  </div>
                </button>

                {/* Details (always visible) */}
                <div className="px-5 pb-5 pl-14">
                  <ul className="space-y-1.5 mb-3">
                    {item.details.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-[12px]" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                        <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#4A6FA5" }} />
                        {d}
                      </li>
                    ))}
                  </ul>

                  {item.warning && (
                    <div
                      className="flex items-start gap-2 p-3 rounded-lg mb-3"
                      style={{ background: "rgba(217,119,6,0.06)" }}
                    >
                      <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" style={{ color: "#D97706" }} />
                      <p className="text-[11px]" style={{ color: "#D97706" }}>{item.warning}</p>
                    </div>
                  )}

                  {item.link && (
                    <a
                      href={item.link.url}
                      target={item.link.url.startsWith("http") ? "_blank" : undefined}
                      rel={item.link.url.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-1.5 text-[12px] font-semibold transition-opacity hover:opacity-70"
                      style={{ color: "#4A6FA5" }}
                    >
                      {item.link.label}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Completion message */}
        <AnimatePresence>
          {pct === 100 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 border rounded-xl p-6 text-center"
              style={{ background: "rgba(22,163,74,0.06)", borderColor: "rgba(22,163,74,0.2)" }}
            >
              <CheckCircle2 className="h-8 w-8 mx-auto mb-3" style={{ color: "#16A34A" }} />
              <p className="text-[15px] font-bold mb-2" style={{ color: "#16A34A" }}>
                FAFSA checklist complete
              </p>
              <p className="text-[13px] mb-4" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                Now compare your aid offers side by side to find the best deal.
              </p>
              <Link
                href="/aid-comparison"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white"
                style={{ backgroundColor: "#4A6FA5" }}
              >
                Compare aid offers
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
