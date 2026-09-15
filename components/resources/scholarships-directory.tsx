"use client";

import { useMemo, useState } from "react";
import { Calendar, ExternalLink, Search, SearchX, Users, X } from "lucide-react";
import {
  filterScholarships,
  formatResourceCategory,
  type ScholarshipResource,
} from "@/lib/resource-filters";
import { HydrationSafeSelect } from "@/components/ui/hydration-safe-select";

const PAGE_SIZE = 24;

export function ScholarshipsDirectory({
  scholarships,
}: {
  scholarships: ScholarshipResource[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [renewableOnly, setRenewableOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const categories = useMemo(
    () => Array.from(new Set(scholarships.map((scholarship) => scholarship.category))).sort(),
    [scholarships],
  );
  const filteredScholarships = useMemo(
    () => filterScholarships(scholarships, { query, category, renewableOnly }),
    [scholarships, query, category, renewableOnly],
  );
  const visibleScholarships = filteredScholarships.slice(0, visibleCount);
  const hasFilters = Boolean(query || category !== "all" || renewableOnly);

  function updateQuery(value: string) {
    setQuery(value);
    setVisibleCount(PAGE_SIZE);
  }

  function updateCategory(value: string) {
    setCategory(value);
    setVisibleCount(PAGE_SIZE);
  }

  function updateRenewableOnly(value: boolean) {
    setRenewableOnly(value);
    setVisibleCount(PAGE_SIZE);
  }

  function resetFilters() {
    setQuery("");
    setCategory("all");
    setRenewableOnly(false);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <section aria-label="Scholarship directory">
      <div
        className="mb-5 rounded-lg border p-3 sm:p-4"
        style={{ background: "rgba(255,255,255,0.45)", borderColor: "rgba(0,0,0,0.08)" }}
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_170px_auto_auto]">
          <label className="relative min-w-0">
            <span className="sr-only">Search scholarships</span>
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
            <input
              type="search"
              value={query}
              onChange={(event) => updateQuery(event.target.value)}
              placeholder="Search scholarships"
              className="h-10 w-full rounded-md border bg-white/70 pl-9 pr-3 text-sm outline-none focus:border-[#4A6FA5] focus:ring-2 focus:ring-[#4A6FA5]/20"
              style={{ borderColor: "rgba(0,0,0,0.1)", color: "var(--dl-text-primary, #1B2030)" }}
            />
          </label>

          <label>
            <span className="sr-only">Filter by scholarship type</span>
            <HydrationSafeSelect
              value={category}
              onChange={(event) => updateCategory(event.target.value)}
              hydrationPlaceholder="All types"
              className="h-10 w-full rounded-md border bg-white/70 px-3 text-sm outline-none focus:border-[#4A6FA5] focus:ring-2 focus:ring-[#4A6FA5]/20"
              style={{ borderColor: "rgba(0,0,0,0.1)", color: "var(--dl-text-primary, #1B2030)" }}
            >
              <option value="all">All types</option>
              {categories.map((item) => <option key={item} value={item}>{formatResourceCategory(item)}</option>)}
            </HydrationSafeSelect>
          </label>

          <label
            className="flex h-10 cursor-pointer items-center gap-2 rounded-md border bg-white/70 px-3 text-sm"
            style={{ borderColor: "rgba(0,0,0,0.1)", color: "var(--dl-text-secondary, #454B5E)" }}
          >
            <input
              type="checkbox"
              checked={renewableOnly}
              onChange={(event) => updateRenewableOnly(event.target.checked)}
              className="h-4 w-4"
              style={{ accentColor: "#4A6FA5" }}
            />
            Renewable
          </label>

          <button
            type="button"
            onClick={resetFilters}
            disabled={!hasFilters}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md border px-3 text-sm font-medium transition-colors hover:bg-white/70 disabled:cursor-default disabled:opacity-40"
            style={{ borderColor: "rgba(0,0,0,0.1)", color: "var(--dl-text-secondary, #454B5E)" }}
          >
            <X aria-hidden="true" className="h-4 w-4" />
            Clear
          </button>
        </div>
        <p className="mt-3 text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }} aria-live="polite">
          Showing {Math.min(visibleCount, filteredScholarships.length)} of {filteredScholarships.length} matching scholarships
        </p>
      </div>

      {visibleScholarships.length > 0 ? (
        <div className="space-y-4">
          {visibleScholarships.map((scholarship) => (
            <article
              key={scholarship.id}
              className="dl-card-hover rounded-lg border p-4 sm:p-6"
              style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{scholarship.name}</h2>
                    <span className="rounded-md bg-[#4A6FA5]/10 px-2 py-1 text-[10px] font-semibold uppercase text-[#2E4A6E]">
                      {formatResourceCategory(scholarship.category)}
                    </span>
                    {scholarship.renewable ? (
                      <span className="rounded-md bg-emerald-600/10 px-2 py-1 text-[10px] font-semibold uppercase text-emerald-700">Renewable</span>
                    ) : null}
                  </div>
                  <p className="mb-2 text-xl font-bold tabular-nums" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{scholarship.amount}</p>
                  <p className="mb-3 text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{scholarship.description}</p>
                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                    <span className="flex items-center gap-1"><Calendar aria-hidden="true" className="h-3.5 w-3.5" />Deadline: {scholarship.deadline}</span>
                    <span className="flex items-start gap-1"><Users aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />{scholarship.eligibility}</span>
                  </div>
                </div>

                <a
                  href={scholarship.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors hover:border-[#4A6FA5] hover:text-[#2E4A6E]"
                  style={{ borderColor: "rgba(0,0,0,0.1)", color: "var(--dl-text-secondary, #454B5E)" }}
                >
                  View provider
                  <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed px-5 py-12 text-center" style={{ borderColor: "rgba(0,0,0,0.12)" }}>
          <SearchX aria-hidden="true" className="mx-auto mb-3 h-6 w-6 text-[#4A6FA5]" />
          <h2 className="text-base font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>No matching scholarships</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--dl-text-muted, #5A6275)" }}>Try a broader search or clear the filters.</p>
          <button type="button" onClick={resetFilters} className="mt-4 text-sm font-semibold text-[#2E4A6E] underline">Reset filters</button>
        </div>
      )}

      {visibleCount < filteredScholarships.length ? (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="rounded-md border bg-white/60 px-4 py-2.5 text-sm font-semibold text-[#2E4A6E] transition-colors hover:bg-white"
            style={{ borderColor: "rgba(0,0,0,0.1)" }}
          >
            Show more ({filteredScholarships.length - visibleCount} remaining)
          </button>
        </div>
      ) : null}
    </section>
  );
}
