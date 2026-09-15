"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { ArrowRight, DollarSign, Shield, CheckCircle2 } from "lucide-react";
import netPriceData from "@/../../public/net-price-data.json";
import {
  type SchoolCost,
  estimateNetPrice,
  formatCurrency,
} from "@/lib/net-price";

export function NetPriceCalculator() {
  const [income, setIncome] = useState(100000);
  const [submitted, setSubmitted] = useState(false);
  const [validationMsg, setValidationMsg] = useState("");
  const schools = netPriceData as SchoolCost[];

  function handleEstimate() {
    if (!Number.isFinite(income) || income < 0) {
      setValidationMsg("Enter a valid household income.");
      return;
    }
    if (income > 1000000) {
      setValidationMsg("Income seems unusually high. Double-check and try again.");
      return;
    }
    setValidationMsg("");
    setSubmitted(true);
  }

  const results = useMemo(() => {
    return schools
      .map((s) => ({
        ...s,
        estimated: estimateNetPrice(s, income),
        savings: s.sticker - estimateNetPrice(s, income),
      }))
      .sort((a, b) => a.estimated - b.estimated);
  }, [income, schools]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <MarketingNav />

      <main id="main" className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        {/* Hero */}
        <div className="mb-10">
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
            Net Price Estimator
          </h1>
          <p
            className="max-w-2xl text-[15px] leading-relaxed"
            style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}
          >
            See what {schools.length} top colleges actually cost at your family income.
            These are estimates based on published net price data — always run the
            school&apos;s own calculator for a precise number.
          </p>
        </div>

        {/* Input */}
        <div
          className="mb-10 border p-5"
          style={{ background: "var(--dl-bg-card)", borderColor: "var(--dl-border)", borderRadius: "var(--dl-radius-lg)", boxShadow: "var(--dl-shadow-sm)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
        >
          <label
            className="mb-2 block text-[13px] font-semibold"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-instrument-sans)" }}
            htmlFor="income"
          >
            Family household income (before taxes)
          </label>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <DollarSign
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                style={{ color: "var(--dl-text-muted, #5A6275)" }}
              />
              <input
                id="income"
                type="number"
                min={0}
                max={500000}
                step={5000}
                value={income}
                onChange={(e) => setIncome(Number(e.target.value) || 0)}
                className="input-field w-full pl-9"
                style={{ minHeight: "44px" }}
              />
            </div>
            <button
              type="button"
              onClick={handleEstimate}
              className="dl-btn dl-btn-primary h-11 px-6 text-sm"
            >
              Estimate
            </button>
          </div>
          <input
            type="range"
            min={0}
            max={350000}
            step={5000}
            value={income}
            onChange={(e) => {
              setIncome(Number(e.target.value));
              setSubmitted(true);
            }}
            className="mt-3 w-full accent-[#4A6FA5]"
          />
          <div className="mt-1 flex justify-between text-[11px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            <span>$0</span>
            <span>$100K</span>
            <span>$200K</span>
            <span>$350K</span>
          </div>
        </div>

        {/* Results */}
        {submitted && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2
                className="text-[17px] font-semibold"
                style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-instrument-sans)" }}
              >
                Estimated net cost at {formatCurrency(income)} income
              </h2>
              <span className="text-[12px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                {results.length} schools · sorted by cost
              </span>
            </div>

            {/* Legend */}
            <div className="mb-6 flex flex-wrap gap-4 text-[12px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3" style={{ color: "#4A6FA5" }} />
                Need-blind
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" style={{ color: "#16A34A" }} />
                Meets full need
              </span>
              <span className="flex items-center gap-1">
                ✦ No-loan policy
              </span>
            </div>

            <div className="space-y-3">
              {results.map((r) => {
                const savingsPercent = Math.round((r.savings / r.sticker) * 100);
                return (
                  <div
                    key={r.slug}
                    className="dl-card-hover border p-4 sm:p-5"
                    style={{ background: "var(--dl-bg-card)", borderColor: "var(--dl-border)", borderRadius: "var(--dl-radius-lg)", boxShadow: "var(--dl-shadow-sm)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Link
                            href={`/college/${r.slug}`}
                            className="text-[15px] font-semibold transition-colors hover:text-[#4A6FA5]"
                            style={{ color: "var(--dl-text-primary, #1B2030)" }}
                          >
                            {r.school}
                          </Link>
                          {r.needBlind && (
                            <span className="flex items-center gap-0.5 text-[10px] font-medium" style={{ color: "#4A6FA5" }}>
                              <Shield className="h-3 w-3" /> Need-blind
                            </span>
                          )}
                          {r.meetsFullNeed && (
                            <span className="flex items-center gap-0.5 text-[10px] font-medium" style={{ color: "#16A34A" }}>
                              <CheckCircle2 className="h-3 w-3" /> Full need
                            </span>
                          )}
                          {r.noLoans && (
                            <span className="text-[10px] font-medium" style={{ color: "#4A6FA5" }}>
                              ✦ No loans
                            </span>
                          )}
                        </div>
                        <div className="flex items-baseline gap-3 text-[13px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                          <span className="line-through">{formatCurrency(r.sticker)}</span>
                          <span>sticker</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className="text-[22px] font-bold tabular-nums"
                          style={{
                            color: r.estimated === 0 ? "#16A34A" : "var(--dl-text-primary, #1B2030)",
                            fontFamily: "var(--font-inter)",
                          }}
                        >
                          {r.estimated === 0 ? "Free" : formatCurrency(r.estimated)}
                        </p>
                        <p className="text-[12px] tabular-nums" style={{ color: "#16A34A" }}>
                          Save {savingsPercent}% ({formatCurrency(r.savings)})
                        </p>
                      </div>
                    </div>

                    {/* Visual bar */}
                    <div className="mt-3 h-2 w-full rounded-full overflow-hidden" style={{ background: "var(--dl-bg-sunken, #E3E8F1)" }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(2, (r.estimated / r.sticker) * 100)}%`,
                          background: r.estimated === 0 ? "#16A34A" : "#4A6FA5",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Disclaimer */}
            <p
              className="mt-8 text-[12px] leading-relaxed text-center"
              style={{ color: "var(--dl-text-muted, #5A6275)" }}
            >
              Estimates based on published IPEDS net price data and institutional policies.
              Actual aid depends on assets, family size, and school-specific methodology.
              Always run each school&apos;s official Net Price Calculator for a precise estimate.
            </p>
          </>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm mb-3" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Want to see how your profile matches these schools?
          </p>
          <Link
            href="/sign-up"
            className="dl-btn dl-btn-primary inline-flex h-11 items-center gap-2 px-6 text-sm"
          >
            Create your free profile
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
