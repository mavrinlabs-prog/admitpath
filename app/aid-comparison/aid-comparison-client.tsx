"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { Plus, X, ArrowLeft, DollarSign, TrendingDown, TrendingUp, AlertTriangle, CheckCircle2, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ──────────────────────────────────────────────────────────────

type AidPackage = {
  id: string;
  schoolName: string;
  costOfAttendance: number;
  grants: number;        // free money (grants + scholarships)
  loans: number;         // borrowed money
  workStudy: number;     // work-study
};

function genId() {
  return `a${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function fmt(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function netCost(p: AidPackage): number {
  return Math.max(0, p.costOfAttendance - p.grants);
}

function outOfPocket(p: AidPackage): number {
  return Math.max(0, p.costOfAttendance - p.grants - p.loans - p.workStudy);
}

function fourYearTotal(p: AidPackage): number {
  return netCost(p) * 4;
}

function grantPct(p: AidPackage): number {
  if (p.costOfAttendance === 0) return 0;
  return Math.round((p.grants / p.costOfAttendance) * 100);
}

// ─── Component ──────────────────────────────────────────────────────────

export function AidComparisonClient() {
  const [packages, setPackages] = useState<AidPackage[]>([
    { id: "p1", schoolName: "", costOfAttendance: 0, grants: 0, loans: 0, workStudy: 0 },
    { id: "p2", schoolName: "", costOfAttendance: 0, grants: 0, loans: 0, workStudy: 0 },
  ]);

  function addPackage() {
    if (packages.length >= 5) return;
    setPackages([
      ...packages,
      { id: genId(), schoolName: "", costOfAttendance: 0, grants: 0, loans: 0, workStudy: 0 },
    ]);
  }

  function removePackage(id: string) {
    if (packages.length <= 2) return;
    setPackages(packages.filter((p) => p.id !== id));
  }

  function update(id: string, field: keyof AidPackage, value: string | number) {
    setPackages(
      packages.map((p) =>
        p.id === id ? { ...p, [field]: field === "schoolName" ? value : Number(value) || 0 } : p
      )
    );
  }

  const valid = packages.filter((p) => p.schoolName.trim() && p.costOfAttendance > 0);
  const sorted = useMemo(
    () => [...valid].sort((a, b) => netCost(a) - netCost(b)),
    [valid]
  );
  const cheapest = sorted[0];
  const mostExpensive = sorted[sorted.length - 1];
  const savings = cheapest && mostExpensive ? netCost(mostExpensive) - netCost(cheapest) : 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <MarketingNav />

      <main id="main" className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
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
          Financial Aid Offer Comparison
        </h1>
        <p
          className="max-w-2xl text-[15px] leading-relaxed mb-10"
          style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}
        >
          Enter each school&apos;s aid package side by side. See the real net cost,
          the grant-to-loan ratio, and the 4-year total at each school.
          Not all aid is equal -- grants are free, loans are debt.
        </p>

        {/* Aid Package Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="border rounded-xl p-5 relative"
              style={{ background: "var(--dl-bg-card)", borderColor: "var(--dl-border)", boxShadow: "var(--dl-shadow-sm)" }}
            >
              {packages.length > 2 && (
                <button
                  onClick={() => removePackage(pkg.id)}
                  className="absolute top-3 right-3 p-1 rounded hover:bg-red-50 transition-colors"
                  aria-label="Remove"
                >
                  <X className="h-3.5 w-3.5 text-red-400" />
                </button>
              )}

              <input
                type="text"
                value={pkg.schoolName}
                onChange={(e) => update(pkg.id, "schoolName", e.target.value)}
                placeholder="School name"
                className="w-full bg-transparent outline-none text-[15px] font-bold mb-4 border-b pb-2"
                style={{ color: "var(--dl-text-primary, #1B2030)", borderColor: "rgba(0,0,0,0.06)" }}
              />

              {[
                { label: "Cost of Attendance (COA)", field: "costOfAttendance" as const, tip: "Tuition + room & board + fees" },
                { label: "Grants & Scholarships", field: "grants" as const, tip: "Free money (does NOT need to be repaid)" },
                { label: "Federal/Private Loans", field: "loans" as const, tip: "Borrowed money (must be repaid with interest)" },
                { label: "Work-Study", field: "workStudy" as const, tip: "Part-time campus job earnings" },
              ].map(({ label, field, tip }) => (
                <div key={field} className="mb-3">
                  <label className="block text-[12px] font-semibold mb-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                    {label}
                  </label>
                  <div className="relative">
                    <DollarSign
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5"
                      style={{ color: "var(--dl-text-muted, #8890A5)" }}
                    />
                    <input
                      type="number"
                      min={0}
                      step={100}
                      value={pkg[field] || ""}
                      onChange={(e) => update(pkg.id, field, e.target.value)}
                      placeholder="0"
                      className="input-field w-full pl-7 text-[13px]"
                      style={{ minHeight: "38px" }}
                    />
                  </div>
                  <p className="text-[10px] mt-0.5" style={{ color: "var(--dl-text-muted, #8890A5)" }}>{tip}</p>
                </div>
              ))}

              {/* Mini summary */}
              {pkg.schoolName.trim() && pkg.costOfAttendance > 0 && (
                <div className="mt-4 pt-3 border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                  <div className="flex justify-between text-[12px] mb-1">
                    <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Net cost/year</span>
                    <span className="font-bold" style={{ color: "#16A34A" }}>{fmt(netCost(pkg))}</span>
                  </div>
                  <div className="flex justify-between text-[12px] mb-1">
                    <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Out of pocket</span>
                    <span className="font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{fmt(outOfPocket(pkg))}</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Grant coverage</span>
                    <span className="font-bold" style={{ color: "#4A6FA5" }}>{grantPct(pkg)}%</span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {packages.length < 5 && (
            <button
              onClick={addPackage}
              className="border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-[13px] font-medium transition-colors hover:border-[#4A6FA5] hover:text-[#4A6FA5]"
              style={{ borderColor: "rgba(0,0,0,0.1)", color: "var(--dl-text-muted, #5A6275)", minHeight: 280 }}
            >
              <Plus className="h-5 w-5" />
              Add another school
            </button>
          )}
        </div>

        {/* Comparison Results */}
        <AnimatePresence>
          {sorted.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Summary Banner */}
              <div
                className="border rounded-xl p-5 mb-6 flex flex-wrap items-center gap-6"
                style={{ background: "rgba(74,111,165,0.06)", borderColor: "rgba(74,111,165,0.15)" }}
              >
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" style={{ color: "#D97706" }} />
                  <div>
                    <p className="text-[13px] font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                      Lowest net cost: {cheapest?.schoolName}
                    </p>
                    <p className="text-[12px]" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                      {fmt(netCost(cheapest!))} / year
                    </p>
                  </div>
                </div>
                {savings > 0 && (
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5" style={{ color: "#16A34A" }} />
                    <div>
                      <p className="text-[13px] font-bold" style={{ color: "#16A34A" }}>
                        You save {fmt(savings)}/yr vs most expensive
                      </p>
                      <p className="text-[12px]" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                        {fmt(savings * 4)} over 4 years
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Comparison Table */}
              <div
                className="overflow-x-auto border rounded-xl mb-6"
                style={{ borderColor: "var(--dl-border)", boxShadow: "var(--dl-shadow-sm)" }}
              >
                <table className="w-full text-[13px]">
                  <thead>
                    <tr style={{ background: "var(--dl-bg-sunken, #E3E8F1)" }}>
                      <th className="sticky left-0 px-4 py-3 text-left font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)", background: "var(--dl-bg-sunken, #E3E8F1)", minWidth: 180 }}>
                        Metric
                      </th>
                      {sorted.map((p) => (
                        <th key={p.id} className="px-4 py-3 text-center font-semibold whitespace-nowrap" style={{ color: "var(--dl-text-primary, #1B2030)", minWidth: 130 }}>
                          {p.schoolName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: "Cost of Attendance", fn: (p: AidPackage) => fmt(p.costOfAttendance) },
                      { label: "Grants & Scholarships", fn: (p: AidPackage) => fmt(p.grants), green: true },
                      { label: "Loans offered", fn: (p: AidPackage) => fmt(p.loans), warn: true },
                      { label: "Work-study", fn: (p: AidPackage) => fmt(p.workStudy) },
                      { label: "Net cost / year", fn: (p: AidPackage) => fmt(netCost(p)), bold: true },
                      { label: "Out of pocket / year", fn: (p: AidPackage) => fmt(outOfPocket(p)), bold: true },
                      { label: "4-year total net cost", fn: (p: AidPackage) => fmt(fourYearTotal(p)), bold: true },
                      { label: "Grant coverage %", fn: (p: AidPackage) => `${grantPct(p)}%` },
                    ].map((row, i) => (
                      <tr key={row.label} style={{ background: i % 2 === 0 ? "var(--dl-bg-card)" : "rgba(0,0,0,0.02)" }}>
                        <td
                          className="sticky left-0 px-4 py-2.5 font-medium"
                          style={{
                            color: "var(--dl-text-primary, #1B2030)",
                            background: i % 2 === 0 ? "var(--dl-bg-card, #fff)" : "rgba(239,242,248,0.7)",
                          }}
                        >
                          {row.label}
                        </td>
                        {sorted.map((p) => {
                          const isLowest = row.bold && netCost(p) === netCost(sorted[0]);
                          return (
                            <td
                              key={p.id}
                              className={`px-4 py-2.5 text-center ${row.bold ? "font-bold" : ""}`}
                              style={{
                                color: isLowest
                                  ? "#16A34A"
                                  : row.green
                                  ? "#16A34A"
                                  : row.warn && p.loans > 0
                                  ? "#D97706"
                                  : "var(--dl-text-primary, #1B2030)",
                              }}
                            >
                              {row.fn(p)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Warnings */}
              {sorted.some((p) => p.loans > p.grants) && (
                <div
                  className="flex items-start gap-3 border rounded-xl p-4 mb-6"
                  style={{ background: "rgba(217,119,6,0.06)", borderColor: "rgba(217,119,6,0.2)" }}
                >
                  <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: "#D97706" }} />
                  <div>
                    <p className="text-[13px] font-bold mb-1" style={{ color: "#D97706" }}>
                      Warning: some packages are loan-heavy
                    </p>
                    <p className="text-[12px]" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                      {sorted.filter((p) => p.loans > p.grants).map((p) => p.schoolName).join(", ")} offered more
                      in loans than grants. Loans must be repaid with interest. A $30,000/yr loan
                      package means ~$120,000 in debt at graduation (plus interest). Consider
                      appealing for more grant aid.
                    </p>
                  </div>
                </div>
              )}

              {sorted.some((p) => grantPct(p) >= 75) && (
                <div
                  className="flex items-start gap-3 border rounded-xl p-4 mb-6"
                  style={{ background: "rgba(22,163,74,0.06)", borderColor: "rgba(22,163,74,0.2)" }}
                >
                  <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: "#16A34A" }} />
                  <div>
                    <p className="text-[13px] font-bold mb-1" style={{ color: "#16A34A" }}>
                      Strong aid package detected
                    </p>
                    <p className="text-[12px]" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                      {sorted.filter((p) => grantPct(p) >= 75).map((p) => p.schoolName).join(", ")} covers
                      75%+ of costs with free money. That is a strong offer.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <div
          className="border rounded-xl p-6 text-center mt-8"
          style={{ background: "rgba(74,111,165,0.04)", borderColor: "rgba(74,111,165,0.15)" }}
        >
          <p className="text-[14px] font-semibold mb-2" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Need to appeal for more aid?
          </p>
          <p className="text-[13px] mb-4" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Our Appeal Letter Guide walks you through the 6 valid grounds and the 7-step letter framework.
          </p>
          <Link
            href="/financial-aid-appeal-guide"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#4A6FA5" }}
          >
            Read the appeal guide
          </Link>
        </div>
      </main>
    </div>
  );
}
