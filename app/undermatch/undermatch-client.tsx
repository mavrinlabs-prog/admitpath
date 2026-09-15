"use client";

import { useState } from "react";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { UndermatchingNudge } from "@/components/undermatching-nudge";
import { ArrowRight } from "lucide-react";

export function UndermatchClient() {
  const [gpa, setGpa] = useState("3.9");
  const [sat, setSat] = useState("1450");
  const [income, setIncome] = useState("60000");
  const [submitted, setSubmitted] = useState(false);
  const [validationMsg, setValidationMsg] = useState("");

  function handleSubmit() {
    const gpaNum = Number(gpa);
    const satNum = Number(sat);
    const incomeNum = Number(income);
    if (!gpaNum || gpaNum < 1 || gpaNum > 4) {
      setValidationMsg("Enter a GPA between 1.0 and 4.0.");
      return;
    }
    if (satNum && (satNum < 400 || satNum > 1600)) {
      setValidationMsg("SAT must be between 400 and 1600.");
      return;
    }
    if (incomeNum < 0) {
      setValidationMsg("Income cannot be negative.");
      return;
    }
    setValidationMsg("");
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <MarketingNav />

      <main id="main" className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-3"
          style={{ color: "var(--dl-text-muted, #5A6275)" }}
        >
          Free check
        </p>
        <h1
          className="text-3xl sm:text-4xl leading-tight mb-3"
          style={{
            color: "var(--dl-text-primary, #1B2030)",
            fontFamily: "var(--font-inter)",
            letterSpacing: "-0.02em",
          }}
        >
          Are you undermatching?
        </h1>
        <p
          className="max-w-2xl text-[15px] leading-relaxed mb-8"
          style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}
        >
          Research from Hoxby & Avery shows that high-achieving low-income
          students systematically miss top private schools where they&apos;d (a)
          be admitted, and (b) pay LESS than their state flagship after aid.
          Run the check below.
        </p>

        <div
          className="mb-6 border p-5 sm:p-6 space-y-4"
          style={{ background: "var(--dl-bg-card)", borderColor: "var(--dl-border)", borderRadius: "var(--dl-radius-lg)", boxShadow: "var(--dl-shadow-sm)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wider" style={{ color: "var(--dl-text-muted, #5A6275)" }} htmlFor="um-gpa">
                Unweighted GPA
              </label>
              <input id="um-gpa" type="number" step={0.01} value={gpa} onChange={(e) => setGpa(e.target.value)} className="input-field w-full" style={{ minHeight: "44px" }} />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wider" style={{ color: "var(--dl-text-muted, #5A6275)" }} htmlFor="um-sat">
                SAT
              </label>
              <input id="um-sat" type="number" value={sat} onChange={(e) => setSat(e.target.value)} className="input-field w-full" style={{ minHeight: "44px" }} />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wider" style={{ color: "var(--dl-text-muted, #5A6275)" }} htmlFor="um-income">
                Household income
              </label>
              <input id="um-income" type="number" value={income} onChange={(e) => setIncome(e.target.value)} className="input-field w-full" style={{ minHeight: "44px" }} />
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="dl-btn dl-btn-primary h-11 px-6 text-sm"
            type="button"
          >
            Check
          </button>
          {validationMsg && (
            <p className="text-[12px] font-medium mt-2" style={{ color: "#DC2626" }}>
              {validationMsg}
            </p>
          )}
        </div>

        {submitted && (
          <UndermatchingNudge
            gpa={Number(gpa) || 0}
            sat={Number(sat) || 0}
            householdIncome={Number(income) || 0}
            listLooksRegional
          />
        )}

        {submitted && Number(gpa) > 0 && (Number(gpa) < 3.7 || Number(sat) < 1400 || Number(income) >= 80000) && (
          <div
            className="border p-5"
            style={{ background: "var(--dl-bg-card)", borderColor: "var(--dl-border)", borderRadius: "var(--dl-radius-lg)", boxShadow: "var(--dl-shadow-sm)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
          >
            <p className="text-[14px]" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Based on these numbers, undermatching isn&apos;t your immediate risk —
              but you can still benefit from running the
              {" "}
              <Link href="/net-price" className="font-semibold underline" style={{ color: "#4A6FA5" }}>
                net price estimator
              </Link>
              {" "}
              to see what schools actually cost at your income.
            </p>
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-sm mb-3" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Want a personalized college list balanced for your finances?
          </p>
          <Link href="/sign-up" className="dl-btn dl-btn-primary inline-flex h-11 items-center gap-2 px-6 text-sm">
            Create your free profile <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
