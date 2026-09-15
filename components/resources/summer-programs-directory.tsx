"use client";

import { useMemo, useState } from "react";
import {
  Calendar,
  Clock,
  DollarSign,
  ExternalLink,
  MapPin,
  Search,
  SearchX,
  X,
} from "lucide-react";
import {
  filterSummerPrograms,
  type SummerProgramResource,
} from "@/lib/resource-filters";
import { HydrationSafeSelect } from "@/components/ui/hydration-safe-select";

export function SummerProgramsDirectory({
  programs,
}: {
  programs: SummerProgramResource[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [grade, setGrade] = useState("all");

  const categories = useMemo(
    () => Array.from(new Set(programs.map((program) => program.category))).sort(),
    [programs],
  );
  const grades = useMemo(
    () => Array.from(new Set(programs.flatMap((program) => program.grades))).sort(),
    [programs],
  );
  const filteredPrograms = useMemo(
    () => filterSummerPrograms(programs, { query, category, grade }),
    [programs, query, category, grade],
  );
  const hasFilters = Boolean(query || category !== "all" || grade !== "all");

  function resetFilters() {
    setQuery("");
    setCategory("all");
    setGrade("all");
  }

  return (
    <section aria-label="Summer program directory">
      <div
        className="mb-5 rounded-lg border p-3 sm:p-4"
        style={{
          background: "rgba(255,255,255,0.45)",
          borderColor: "rgba(0,0,0,0.08)",
        }}
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(150px,0.55fr)_110px_auto]">
          <label className="relative min-w-0">
            <span className="sr-only">Search summer programs</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: "var(--dl-text-muted, #5A6275)" }}
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search programs"
              className="h-10 w-full rounded-md border bg-white/70 pl-9 pr-3 text-sm outline-none focus:border-[#4A6FA5] focus:ring-2 focus:ring-[#4A6FA5]/20"
              style={{ borderColor: "rgba(0,0,0,0.1)", color: "var(--dl-text-primary, #1B2030)" }}
            />
          </label>

          <label>
            <span className="sr-only">Filter by category</span>
            <HydrationSafeSelect
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              hydrationPlaceholder="All categories"
              className="h-10 w-full rounded-md border bg-white/70 px-3 text-sm outline-none focus:border-[#4A6FA5] focus:ring-2 focus:ring-[#4A6FA5]/20"
              style={{ borderColor: "rgba(0,0,0,0.1)", color: "var(--dl-text-primary, #1B2030)" }}
            >
              <option value="all">All categories</option>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </HydrationSafeSelect>
          </label>

          <label>
            <span className="sr-only">Filter by grade</span>
            <HydrationSafeSelect
              value={grade}
              onChange={(event) => setGrade(event.target.value)}
              hydrationPlaceholder="All grades"
              className="h-10 w-full rounded-md border bg-white/70 px-3 text-sm outline-none focus:border-[#4A6FA5] focus:ring-2 focus:ring-[#4A6FA5]/20"
              style={{ borderColor: "rgba(0,0,0,0.1)", color: "var(--dl-text-primary, #1B2030)" }}
            >
              <option value="all">All grades</option>
              {grades.map((item) => <option key={item} value={item}>Grade {item}</option>)}
            </HydrationSafeSelect>
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
        <p
          className="mt-3 text-xs"
          style={{ color: "var(--dl-text-muted, #5A6275)" }}
          aria-live="polite"
        >
          Showing {filteredPrograms.length} of {programs.length} programs
        </p>
      </div>

      {filteredPrograms.length > 0 ? (
        <div className="space-y-4">
          {filteredPrograms.map((program) => (
            <article
              key={`${program.name}-${program.url}`}
              className="dl-card-hover rounded-lg border p-4 sm:p-6"
              style={{
                background: "rgba(255,255,255,0.45)",
                backdropFilter: "blur(12px)",
                borderColor: "rgba(0,0,0,0.06)",
              }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                      {program.name}
                    </h2>
                    <span className="rounded-md bg-[#4A6FA5]/10 px-2 py-1 text-[10px] font-semibold uppercase text-[#2E4A6E]">
                      {program.category}
                    </span>
                  </div>
                  <p className="mb-3 text-[13px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                    {program.host}
                  </p>
                  <p className="mb-3 text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                    {program.description}
                  </p>

                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                    <span className="flex items-center gap-1"><MapPin aria-hidden="true" className="h-3.5 w-3.5" />{program.location}</span>
                    <span className="flex items-center gap-1"><Clock aria-hidden="true" className="h-3.5 w-3.5" />{program.duration}</span>
                    <span className="flex items-center gap-1"><Calendar aria-hidden="true" className="h-3.5 w-3.5" />Deadline: {program.deadline}</span>
                    <span className="flex items-center gap-1"><DollarSign aria-hidden="true" className="h-3.5 w-3.5" />{program.cost}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded-md border px-2 py-1 text-[11px] font-medium" style={{ borderColor: "rgba(0,0,0,0.08)", color: "var(--dl-text-secondary, #454B5E)" }}>
                      {program.selectivity}
                    </span>
                    {program.grades.map((item) => (
                      <span key={item} className="rounded-md bg-white/60 px-2 py-1 text-[11px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                        Grade {item}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href={program.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors hover:border-[#4A6FA5] hover:text-[#2E4A6E]"
                  style={{ borderColor: "rgba(0,0,0,0.1)", color: "var(--dl-text-secondary, #454B5E)" }}
                >
                  Visit program
                  <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed px-5 py-12 text-center" style={{ borderColor: "rgba(0,0,0,0.12)" }}>
          <SearchX aria-hidden="true" className="mx-auto mb-3 h-6 w-6 text-[#4A6FA5]" />
          <h2 className="text-base font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>No matching programs</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--dl-text-muted, #5A6275)" }}>Try a broader search or clear the filters.</p>
          <button type="button" onClick={resetFilters} className="mt-4 text-sm font-semibold text-[#2E4A6E] underline">
            Reset filters
          </button>
        </div>
      )}
    </section>
  );
}
