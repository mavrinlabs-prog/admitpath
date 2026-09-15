"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { COLLEGES } from "@/data/colleges";
import { ArrowRight, X, Search, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CompareClient() {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return COLLEGES.slice(0, 20);
    const q = search.toLowerCase();
    return COLLEGES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.shortName.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
    ).slice(0, 20);
  }, [search]);

  const selectedSchools = selected
    .map((slug) => COLLEGES.find((c) => c.slug === slug))
    .filter(Boolean) as typeof COLLEGES[number][];

  function addSchool(slug: string) {
    if (selected.length >= 5) return;
    if (!selected.includes(slug)) {
      setSelected([...selected, slug]);
    }
    setSearch("");
    setShowPicker(false);
  }

  function removeSchool(slug: string) {
    setSelected(selected.filter((s) => s !== slug));
  }

  function handlePickerKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setShowPicker(false);
      setSearch("");
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <MarketingNav />

      <main id="main" className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
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
          Compare Colleges
        </h1>
        <p
          className="max-w-2xl text-[15px] leading-relaxed mb-8"
          style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}
        >
          Select up to 5 schools to compare side by side. See acceptance rates,
          test score ranges, GPA averages, and more.
        </p>

        {/* School picker */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-3">
            <AnimatePresence mode="popLayout">
              {selectedSchools.map((c) => (
                <motion.span
                  key={c.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium"
                  style={{ borderColor: "#4A6FA5", color: "#4A6FA5", background: "rgba(74,111,165,0.08)" }}
                >
                  {c.shortName}
                  <button
                    onClick={() => removeSchool(c.slug)}
                    className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-[rgba(74,111,165,0.2)]"
                    aria-label={`Remove ${c.name}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
            {selected.length < 5 && (
              <button
                onClick={() => setShowPicker(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-dashed px-3 py-1.5 text-[13px] font-medium transition-colors hover:border-[color:#4A6FA5] hover:text-[#4A6FA5] hover:bg-[rgba(74,111,165,0.04)]"
                style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-muted, #5A6275)" }}
              >
                <Plus className="h-3 w-3" />
                Add school
              </button>
            )}
          </div>

          <AnimatePresence>
            {showPicker && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className="border p-4 overflow-hidden"
                style={{ background: "var(--dl-bg-card)", borderColor: "var(--dl-border)", borderRadius: "var(--dl-radius-lg)", boxShadow: "var(--dl-shadow-sm)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
                onKeyDown={handlePickerKeyDown}
                role="dialog"
                aria-label="Search and add colleges"
              >
                <div className="relative mb-3">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                    style={{ color: "var(--dl-text-muted, #5A6275)" }}
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search colleges..."
                    className="input-field w-full pl-9"
                    style={{ minHeight: "44px" }}
                    autoFocus
                  />
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {filtered.map((c) => {
                    const isSelected = selected.includes(c.slug);
                    return (
                      <button
                        key={c.slug}
                        onClick={() => !isSelected && addSchool(c.slug)}
                        disabled={isSelected}
                        className="w-full text-left rounded-md px-3 py-2 text-[13px] transition-colors hover:bg-[color:var(--dl-bg-sunken, #E3E8F1)] disabled:opacity-40"
                        style={{ color: "var(--dl-text-primary, #1B2030)" }}
                      >
                        <span className="font-medium">{c.name}</span>
                        <span className="ml-2 text-[11px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                          {c.city}, {c.state} · {c.acceptanceRate}%
                        </span>
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setShowPicker(false)}
                  className="mt-2 text-[12px] font-medium"
                  style={{ color: "var(--dl-text-muted, #5A6275)" }}
                >
                  Close
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Comparison table */}
        <AnimatePresence>
          {selectedSchools.length >= 2 && (
            <motion.div
              className="overflow-x-auto border"
              style={{ borderColor: "var(--dl-border)", borderRadius: "var(--dl-radius-lg)", boxShadow: "var(--dl-shadow-sm)" }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            >
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr style={{ background: "var(--dl-bg-sunken, #E3E8F1)" }}>
                    <th
                      className="sticky left-0 px-4 py-3 font-semibold"
                      style={{
                        color: "var(--dl-text-primary, #1B2030)",
                        background: "var(--dl-bg-sunken, #E3E8F1)",
                        fontFamily: "var(--font-instrument-sans)",
                        minWidth: 140,
                      }}
                    >
                      Metric
                    </th>
                    {selectedSchools.map((c) => (
                      <th
                        key={c.slug}
                        className="px-4 py-3 font-semibold whitespace-nowrap"
                        style={{ color: "var(--dl-text-primary, #1B2030)", minWidth: 140 }}
                      >
                        <Link href={`/college/${c.slug}`} className="hover:text-[#4A6FA5] transition-colors">
                          {c.shortName}
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      label: "Acceptance Rate",
                      render: (c: typeof COLLEGES[number]) => `${c.acceptanceRate}%`,
                    },
                    {
                      label: "SAT 25th",
                      render: (c: typeof COLLEGES[number]) => c.sat25.toLocaleString(),
                    },
                    {
                      label: "SAT 75th",
                      render: (c: typeof COLLEGES[number]) => c.sat75.toLocaleString(),
                    },
                    {
                      label: "SAT Mid-50%",
                      render: (c: typeof COLLEGES[number]) =>
                        `${c.sat25}–${c.sat75}`,
                    },
                    {
                      label: "Avg GPA",
                      render: (c: typeof COLLEGES[number]) => c.gpaAvg.toFixed(2),
                    },
                    {
                      label: "Enrollment",
                      render: (c: typeof COLLEGES[number]) =>
                        c.enrollment.toLocaleString(),
                    },
                    {
                      label: "Type",
                      render: (c: typeof COLLEGES[number]) =>
                        c.type === "private" ? "Private" : "Public",
                    },
                    {
                      label: "Founded",
                      render: (c: typeof COLLEGES[number]) => c.founded.toString(),
                    },
                    {
                      label: "Location",
                      render: (c: typeof COLLEGES[number]) => `${c.city}, ${c.state}`,
                    },
                  ].map((row, i) => (
                    <motion.tr
                      key={row.label}
                      className="border-t transition-colors hover:bg-[color:var(--dl-bg-sunken, #E3E8F1)]"
                      style={{ borderColor: "var(--dl-border)" }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25, delay: i * 0.03 }}
                    >
                      <td
                        className="sticky left-0 px-4 py-3 font-medium"
                        style={{ color: "var(--dl-text-primary, #1B2030)", background: "var(--dl-bg-card)" }}
                      >
                        {row.label}
                      </td>
                      {selectedSchools.map((c) => (
                        <td
                          key={c.slug}
                          className="px-4 py-3 tabular-nums"
                          style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                        >
                          {row.render(c)}
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>

        {selectedSchools.length < 2 && (
          <div
            className="border p-8 text-center"
            style={{ borderColor: "var(--dl-border)", background: "var(--dl-bg-card)", borderRadius: "var(--dl-radius-lg)", boxShadow: "var(--dl-shadow-sm)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
          >
            <p className="text-[15px] mb-1" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Select at least 2 schools to compare
            </p>
            <p className="text-[13px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              Choose from {COLLEGES.length} colleges in our database
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm mb-3" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Want to see your chances at these schools?
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
