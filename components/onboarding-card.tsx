"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, UserRoundPlus, ScanSearch, PenLine, Check, ArrowRight } from "lucide-react";
import { ResumeQuickImport } from "@/components/resume-quick-import";

const DISMISS_KEY = "admitpath:onboarding-dismissed:v1";

/**
 * First-time-user onboarding card with a 3-step getting-started checklist.
 * Steps dynamically check off based on server-provided completion state.
 *
 * Hydration-safe: we never render anything until `mounted` flips on, so the
 * SSR HTML and the post-hydration tree always agree (the server can't read
 * localStorage). Dismissal is permanent per browser.
 */
export function OnboardingCard({
  eligible,
  hasProfile = false,
  hasAnalysis = false,
  hasEssay = false,
}: {
  eligible: boolean;
  hasProfile?: boolean;
  hasAnalysis?: boolean;
  hasEssay?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
    } catch { /* noop */ }
    setMounted(true);
  }, []);

  function dismiss() {
    try { localStorage.setItem(DISMISS_KEY, "1"); } catch { /* noop */ }
    setDismissed(true);
  }

  // Auto-dismiss after all 3 steps are complete (user has experienced the full flow)
  const allDone = hasProfile && hasAnalysis && hasEssay;
  useEffect(() => {
    if (allDone && mounted && !dismissed) {
      // Give user a moment to see the final "3/3" state before auto-dismissing
      const timer = setTimeout(() => {
        dismiss();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [allDone, mounted, dismissed]);

  if (!eligible || !mounted || dismissed) return null;

  const steps = [
    {
      n: 1,
      title: "Complete your profile",
      description: "Tell us about your grades, activities, and goals",
      href: "/profile/create",
      done: hasProfile,
      icon: UserRoundPlus,
    },
    {
      n: 2,
      title: "Run your first analysis",
      description: "Get scored across 7 admissions dimensions",
      href: "/analyze",
      done: hasAnalysis,
      icon: ScanSearch,
    },
    {
      n: 3,
      title: "Get essay feedback",
      description: "Line-by-line feedback on voice, insight, and specificity",
      href: "/essays",
      done: hasEssay,
      icon: PenLine,
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const nextStep = steps.find((s) => !s.done);

  return (
    <section
      className="relative mb-10 overflow-hidden border"
      aria-label={`Getting started: ${completedCount} of ${steps.length} steps complete`}
      style={{
        background: "linear-gradient(135deg, rgba(74,111,165,0.06), rgba(255,255,255,0.45))",
        borderColor: "rgba(74,111,165,0.15)",
        borderRadius: "14px",
      }}
    >
      {/* Decorative gradient accent */}
      <div
        className="absolute top-0 left-0 h-1 w-full"
        style={{ background: "linear-gradient(90deg, #4A6FA5, #2E4A6E, #1E3352)" }}
      />

      <div className="p-6 sm:p-8">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss onboarding"
          className="absolute right-4 top-5 inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-[color:rgba(255,255,255,0.45)]"
          style={{ color: "var(--dl-text-muted, #5A6275)" }}
        >
          <X className="h-4 w-4" strokeWidth={1.75} />
        </button>

        <p
          className="text-[11px] font-bold uppercase tracking-[0.12em] mb-2"
          style={{ color: "#4A6FA5" }}
        >
          Getting started
        </p>
        <h2
          className="text-[28px] leading-tight"
          style={{
            color: "var(--dl-text-primary, #1B2030)",
            letterSpacing: "-0.02em",
            fontFamily: "var(--font-inter)",
            fontWeight: 700,
          }}
        >
          Welcome to AdmitPath!
        </h2>
        <p
          className="mt-2 max-w-xl text-[15px] leading-relaxed"
          style={{ color: "var(--dl-text-secondary, #454B5E)" }}
        >
          Here&apos;s your personalized roadmap to getting started. Complete these three steps and you&apos;ll have a clear picture of where you stand.
        </p>

        {/* Progress indicator */}
        <div className="mt-5 flex items-center gap-3">
          <div
            className="flex-1 h-1.5 overflow-hidden rounded-full"
            style={{ background: "rgba(74,111,165,0.12)" }}
            role="progressbar"
            aria-valuenow={completedCount}
            aria-valuemin={0}
            aria-valuemax={steps.length}
            aria-label={`Onboarding progress: ${completedCount} of ${steps.length} steps complete`}
          >
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(completedCount / steps.length) * 100}%`, background: "#4A6FA5" }}
            />
          </div>
          <span
            className="text-[12px] font-semibold tabular-nums shrink-0"
            style={{ color: "#4A6FA5" }}
            aria-hidden="true"
          >
            {completedCount}/{steps.length}
          </span>
        </div>

        <ol className="mt-6 space-y-3">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <li key={s.n}>
                <Link
                  href={s.href}
                  className="flex items-center gap-4 rounded-xl border p-4 transition-all duration-200 hover:border-[rgba(74,111,165,0.25)] hover:shadow-sm"
                  style={{
                    borderColor: s.done ? "rgba(22,163,74,0.2)" : "rgba(0,0,0,0.06)",
                    background: s.done ? "rgba(22,163,74,0.04)" : "rgba(255,255,255,0.6)",
                  }}
                >
                  {/* Status indicator */}
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: s.done ? "rgba(22,163,74,0.1)" : "rgba(74,111,165,0.08)",
                      color: s.done ? "#16A34A" : "#4A6FA5",
                    }}
                  >
                    {s.done ? (
                      <Check className="h-5 w-5" strokeWidth={2.5} />
                    ) : (
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    )}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[14px] font-semibold leading-snug"
                      style={{
                        color: s.done ? "var(--dl-text-muted, #5A6275)" : "var(--dl-text-primary, #1B2030)",
                        textDecoration: s.done ? "line-through" : "none",
                      }}
                    >
                      {s.title}
                    </p>
                    <p className="mt-0.5 text-[12px] leading-snug" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                      {s.description}
                    </p>
                  </div>

                  {!s.done && (
                    <ArrowRight className="h-4 w-4 shrink-0" style={{ color: "#4A6FA5" }} />
                  )}
                </Link>
              </li>
            );
          })}
        </ol>

        {!hasProfile && (
          <div className="mt-5">
            <ResumeQuickImport context="dashboard" onImported={() => window.location.reload()} />
          </div>
        )}

        {nextStep && (
          <div className="mt-5">
            <Link
              href={nextStep.href}
              className="dl-btn dl-btn-primary inline-flex items-center gap-2 px-6 py-2.5 text-sm"
            >
              {nextStep.title}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
