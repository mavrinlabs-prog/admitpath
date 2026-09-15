"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { LogoMark } from "@/components/admitpath-logo";
import { findCollegeByName } from "@/data/colleges";
import { ArrowRight, DollarSign, Shield, CheckCircle2, AlertCircle } from "lucide-react";
import netPriceData from "@/../../public/net-price-data.json";

type IncomeThreshold = { max: number; netPrice: number };
type SchoolCost = {
  slug: string;
  school: string;
  sticker: number;
  avgNetPrice: number;
  needBlind: boolean;
  meetsFullNeed: boolean;
  noLoans: boolean;
  incomeThresholds: IncomeThreshold[];
};
type Props = {
  profile: {
    householdIncome: number | null;
  } | null;
  collegeList: { collegeName: string; category: string }[];
};

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function estimateNetPrice(school: SchoolCost, income: number): number {
  for (const t of school.incomeThresholds) {
    if (income <= t.max) return t.netPrice;
  }
  const last = school.incomeThresholds[school.incomeThresholds.length - 1];
  if (!last) return school.avgNetPrice;
  const ratio = Math.min((income - last.max) / (300000 - last.max), 1);
  return Math.round(last.netPrice + ratio * (school.sticker - last.netPrice));
}

export function MoneyClient({ profile, collegeList }: Props) {
  const [income, setIncome] = useState(profile?.householdIncome?.toString() ?? "");
  const incomeNum = Number(income) || 0;
  const schools = netPriceData as SchoolCost[];

  // Resolve user's college list to net-price-data rows by slug.
  const myList = useMemo(() => {
    return collegeList
      .map((c) => {
        const matched = findCollegeByName(c.collegeName);
        if (!matched) return null;
        const cost = schools.find((s) => s.slug === matched.slug);
        if (!cost) return null;
        return { college: matched, cost, category: c.category };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [collegeList, schools]);

  const rows = useMemo(() => {
    return myList
      .map((row) => {
        const estimated = incomeNum > 0
          ? estimateNetPrice(row.cost, incomeNum)
          : row.cost.avgNetPrice;
        return { ...row, estimated };
      })
      .sort((a, b) => a.estimated - b.estimated);
  }, [myList, incomeNum]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <nav
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: "rgba(213,220,232,0.88)",
          borderColor: "rgba(0,0,0,0.06)",
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[68px] items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <LogoMark size={32} />
              <span className="text-lg font-bold" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>
                AdmitPath
              </span>
            </Link>
            <Link href="/dashboard" className="text-sm font-medium" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main id="main" className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
          Personalized for you
        </p>
        <h1 className="text-3xl sm:text-4xl leading-tight mb-3" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)", letterSpacing: "-0.02em" }}>
          My Net Price
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed mb-8" style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}>
          Approximate net-cost projection for the schools on your list using
          stored income-band data. Confirm every estimate with the college.
        </p>

        {!profile && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border p-4" style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}>
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              No profile yet. <Link href="/profile/create" className="font-semibold" style={{ color: "#4A6FA5" }}>Build your profile</Link> to save household information for planning.
            </p>
          </div>
        )}

        {/* Local planning input; this does not alter the saved profile. */}
        <div className="mb-8 rounded-xl border p-5" style={{ background: "rgba(255,255,255,0.45)", borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="max-w-sm">
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider" style={{ color: "var(--dl-text-muted, #5A6275)" }} htmlFor="m-income">
                Household income
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
                <input id="m-income" type="number" value={income} onChange={(e) => setIncome(e.target.value)} className="input-field w-full pl-9" style={{ minHeight: "44px" }} placeholder="80000" />
              </div>
            </div>
          </div>
        </div>

        {/* Empty list */}
        {myList.length === 0 && (
          <div className="rounded-xl border p-8 text-center" style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}>
            <p className="text-[15px] mb-2" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              No schools on your list yet.
            </p>
            <p className="text-[13px] mb-4" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              Add schools to your list to see personalized net cost.
            </p>
            <Link href="/colleges" className="btn-primary inline-flex h-10 items-center gap-2 px-5 text-sm">
              Build college list <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        {/* Personalized rows */}
        {myList.length > 0 && (
          <div className="space-y-3">
            {rows.map((r) => {
              const savingsPct = Math.round(((r.cost.sticker - r.estimated) / r.cost.sticker) * 100);
              return (
                <div key={r.college.slug} className="rounded-xl border p-5" style={{ background: "rgba(255,255,255,0.45)", borderColor: "rgba(0,0,0,0.06)" }}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Link href={`/college/${r.college.slug}`} className="text-[15px] font-semibold transition-colors hover:text-[#4A6FA5]" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                          {r.college.name}
                        </Link>
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider" style={{ background: "rgba(74,111,165,0.08)", color: "#4A6FA5" }}>
                          {r.category}
                        </span>
                        {r.cost.needBlind && (
                          <span className="flex items-center gap-0.5 text-[10px] font-medium" style={{ color: "#4A6FA5" }}>
                            <Shield className="h-3 w-3" /> Need-blind
                          </span>
                        )}
                        {r.cost.meetsFullNeed && (
                          <span className="flex items-center gap-0.5 text-[10px] font-medium" style={{ color: "#16A34A" }}>
                            <CheckCircle2 className="h-3 w-3" /> Full need
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-3 text-[12px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                        <span className="line-through">{formatCurrency(r.cost.sticker)}</span>
                        <span>sticker</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[22px] font-bold tabular-nums" style={{ color: r.estimated === 0 ? "#16A34A" : "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>
                        {r.estimated === 0 ? "$0 estimate" : formatCurrency(r.estimated)}
                      </p>
                      <p className="text-[11px] tabular-nums" style={{ color: "#16A34A" }}>
                        {savingsPct}% off sticker
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="mt-8 text-[12px] leading-relaxed text-center" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
          Estimates only. This tool does not apply sibling, residency, merit,
          special-circumstance, or school-specific aid adjustments. Always run
          each school&apos;s official Net Price Calculator before relying on a number.
        </p>
      </main>
    </div>
  );
}
