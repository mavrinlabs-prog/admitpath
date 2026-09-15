"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import {
  ArrowLeft,
  ClipboardList,
  DollarSign,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Lock,
  GraduationCap,
  FileText,
  Users,
  Loader2,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────

type ParentData = {
  studentName: string;
  profileCompletePct: number;
  overallScore: number | null;
  collegeCount: number;
  essayCount: number;
  analysisCount: number;
  plan: string;
  missingSteps: string[];
  colleges: Array<{ name: string; matchScore: number | null; category: string }>;
  recentActivity: Array<{ action: string; date: string }>;
};

// ─── Component ──────────────────────────────────────────────────────────

export function ParentDashboardClient() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<ParentData | null>(null);
  const [shareCode, setShareCode] = useState("");
  const [connected, setConnected] = useState(false);

  // In a full implementation, a parent would link via share code.
  // For now, the parent dashboard reads from the currently-logged-in
  // user's data as a read-only view. Future: separate parent auth.
  useEffect(() => {
    function calculateProfilePct(profile: Record<string, unknown>): number {
      let filled = 0;
      let total = 0;
      const fields = ["gpa", "satScore", "actScore", "grade", "activities", "awards", "courses"];
      for (const f of fields) {
        total++;
        const v = profile[f];
        if (v !== null && v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0)) {
          filled++;
        }
      }
      return total > 0 ? Math.round((filled / total) * 100) : 0;
    }

    function getMissingSteps(profile: Record<string, unknown> | null): string[] {
      const missing: string[] = [];
      if (!profile) return ["Create profile"];
      if (!profile.gpa) missing.push("Add GPA");
      if (!profile.satScore && !profile.actScore) missing.push("Add test scores");
      if (!Array.isArray(profile.activities) || profile.activities.length === 0)
        missing.push("Add extracurricular activities");
      if (!Array.isArray(profile.awards) || profile.awards.length === 0)
        missing.push("Add awards and honors");
      if (!Array.isArray(profile.courses) || profile.courses.length === 0)
        missing.push("Add courses taken");
      return missing;
    }

    async function fetchParentData() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/me");
        if (!res.ok) {
          setError("Please sign in to view the parent dashboard.");
          setLoading(false);
          return;
        }
        const me = await res.json();
        if (me.authenticated === false) {
          setError("Please sign in to view the parent dashboard.");
          setLoading(false);
          return;
        }

        const profile = me.profile;
        const profilePct = profile ? calculateProfilePct(profile) : 0;
        const missing = getMissingSteps(profile);

        const colleges = Array.isArray(me.colleges)
          ? me.colleges.map((c: { collegeName: string; matchScore?: number; category?: string }) => ({
              name: c.collegeName,
              matchScore: c.matchScore ?? null,
              category: c.category ?? "target",
            }))
          : [];

        setData({
          studentName: me.name || "Your child",
          profileCompletePct: profilePct,
          overallScore: me.latestScore ?? null,
          collegeCount: colleges.length,
          essayCount: me.essayCount ?? 0,
          analysisCount: me.analysisCount ?? 0,
          plan: me.plan ?? "free",
          missingSteps: missing,
          colleges,
          recentActivity: [],
        });
        setConnected(true);
      } catch {
        setError("Unable to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchParentData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#4A6FA5" }} />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
        <MarketingNav />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <Lock className="h-12 w-12 mx-auto mb-4" style={{ color: "var(--dl-text-muted, #8890A5)" }} />
          <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Parent Dashboard
          </h2>
          <p className="text-[14px] mb-6" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            {error}
          </p>
          <Link
            href="/sign-in?redirect_url=/parent"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white"
            style={{ backgroundColor: "#4A6FA5" }}
          >
            Sign in
          </Link>
        </main>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <MarketingNav />

      <main id="main" className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: "#4A6FA5" }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <Eye className="h-5 w-5" style={{ color: "#4A6FA5" }} />
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "#4A6FA5" }}>
            Parent View (read-only)
          </p>
        </div>
        <h1
          className="text-3xl sm:text-4xl leading-tight mb-3"
          style={{
            color: "var(--dl-text-primary, #1B2030)",
            fontFamily: "var(--font-inter)",
            letterSpacing: "-0.02em",
          }}
        >
          {data.studentName}&apos;s Progress
        </h1>
        <p
          className="max-w-2xl text-[15px] leading-relaxed mb-10"
          style={{ color: "var(--dl-text-secondary, #454B5E)" }}
        >
          A summary of your child&apos;s college application progress. This view
          is read-only -- only your child can edit their profile and essays.
        </p>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            {
              label: "Profile Complete",
              value: `${data.profileCompletePct}%`,
              icon: ClipboardList,
              color: data.profileCompletePct >= 80 ? "#16A34A" : data.profileCompletePct >= 50 ? "#D97706" : "#DC2626",
            },
            {
              label: "Overall Score",
              value: data.overallScore !== null ? `${data.overallScore}/100` : "Not yet scored",
              icon: BarChart3,
              color: data.overallScore && data.overallScore >= 70 ? "#16A34A" : "#4A6FA5",
            },
            {
              label: "Target Schools",
              value: `${data.collegeCount}`,
              icon: GraduationCap,
              color: "#4A6FA5",
            },
            {
              label: "Essays Written",
              value: `${data.essayCount}`,
              icon: FileText,
              color: "#4A6FA5",
            },
          ].map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="border rounded-xl p-5"
              style={{ background: "var(--dl-bg-card)", borderColor: "var(--dl-border)", boxShadow: "var(--dl-shadow-sm)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-4 w-4" style={{ color }} />
                <span className="text-[12px] font-semibold" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                  {label}
                </span>
              </div>
              <p className="text-xl font-extrabold" style={{ color }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Profile Completion Progress Bar */}
        <div
          className="border rounded-xl p-5 mb-8"
          style={{ background: "var(--dl-bg-card)", borderColor: "var(--dl-border)", boxShadow: "var(--dl-shadow-sm)" }}
        >
          <h2 className="text-[14px] font-bold mb-3" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Profile Completion
          </h2>
          <div className="h-3 rounded-full overflow-hidden mb-3" style={{ backgroundColor: "rgba(0,0,0,0.06)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${data.profileCompletePct}%`, backgroundColor: data.profileCompletePct >= 80 ? "#16A34A" : "#4A6FA5" }}
            />
          </div>
          {data.missingSteps.length > 0 && (
            <div>
              <p className="text-[12px] font-semibold mb-2" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                Still needed:
              </p>
              <ul className="space-y-1">
                {data.missingSteps.map((step) => (
                  <li key={step} className="flex items-center gap-2 text-[12px]" style={{ color: "#D97706" }}>
                    <AlertCircle className="h-3.5 w-3.5" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {data.missingSteps.length === 0 && (
            <div className="flex items-center gap-2 text-[12px]" style={{ color: "#16A34A" }}>
              <CheckCircle2 className="h-3.5 w-3.5" />
              Profile is complete
            </div>
          )}
        </div>

        {/* College List */}
        {data.colleges.length > 0 && (
          <div
            className="border rounded-xl p-5 mb-8"
            style={{ background: "var(--dl-bg-card)", borderColor: "var(--dl-border)", boxShadow: "var(--dl-shadow-sm)" }}
          >
            <h2 className="text-[14px] font-bold mb-3" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Target Schools ({data.colleges.length})
            </h2>
            <div className="space-y-2">
              {data.colleges.map((c) => (
                <div
                  key={c.name}
                  className="flex items-center justify-between px-3 py-2 rounded-lg"
                  style={{ background: "rgba(0,0,0,0.02)" }}
                >
                  <span className="text-[13px] font-medium" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                    {c.name}
                  </span>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize"
                      style={{
                        backgroundColor:
                          c.category === "safety" ? "rgba(22,163,74,0.1)" :
                          c.category === "target" ? "rgba(74,111,165,0.1)" :
                          "rgba(217,119,6,0.1)",
                        color:
                          c.category === "safety" ? "#16A34A" :
                          c.category === "target" ? "#4A6FA5" :
                          "#D97706",
                      }}
                    >
                      {c.category}
                    </span>
                    {c.matchScore !== null && (
                      <span className="text-[12px] font-bold" style={{ color: "#4A6FA5" }}>
                        {c.matchScore}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Financial Aid Resources for Parents */}
        <div
          className="border rounded-xl p-5 mb-8"
          style={{ background: "var(--dl-bg-card)", borderColor: "var(--dl-border)", boxShadow: "var(--dl-shadow-sm)" }}
        >
          <h2 className="text-[14px] font-bold mb-3" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Resources for Parents
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { href: "/resources/financial-aid", label: "Financial Aid Guide", desc: "FAFSA, CSS Profile, and the timeline" },
              { href: "/aid-comparison", label: "Compare Aid Offers", desc: "Side-by-side aid package comparison" },
              { href: "/net-price", label: "Net Price Estimator", desc: "What each school actually costs" },
              { href: "/financial-aid-appeal-guide", label: "Appeal Guide", desc: "How to negotiate more aid" },
              { href: "/decision-matrix", label: "Decision Matrix", desc: "Weighted school comparison" },
              { href: "/fafsa-checklist", label: "FAFSA Checklist", desc: "Step-by-step filing guide" },
            ].map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-[rgba(74,111,165,0.04)]"
              >
                <DollarSign className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "#4A6FA5" }} />
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{r.label}</p>
                  <p className="text-[11px]" style={{ color: "var(--dl-text-muted, #8890A5)" }}>{r.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-[11px] text-center" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
          This is a read-only view. Only the student can modify their profile, essays, and school list.
          Parent accounts with separate login and invitation codes are coming soon.
        </p>
      </main>
    </div>
  );
}
