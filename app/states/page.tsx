import type { Metadata } from "next";
import Link from "next/link";
import { STATES } from "@/data/seo-states";

export const metadata: Metadata = {
  title: "College Admissions Guides by State",
  description: "College admissions guides for all 50 states, including flagship universities, merit scholarships, and state-specific application strategy.",
  alternates: { canonical: "/states" },
};

export default function StatesPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-sm font-semibold uppercase" style={{ color: "#4A6FA5", letterSpacing: "0.08em" }}>State guides</p>
      <h1 className="mt-2 text-4xl font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>College admissions by state</h1>
      <p className="mt-4 max-w-3xl text-base" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
        Compare public flagships, private colleges, merit aid, and application strategy for students in every state.
      </p>
      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {STATES.map((state) => (
          <Link key={state.slug} href={`/states/${state.slug}`} className="border bg-white p-4 transition-colors hover:border-[#4A6FA5]" style={{ borderColor: "rgba(0,0,0,0.08)", borderRadius: 8 }}>
            <span className="font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{state.name}</span>
            <span className="mt-1 block text-sm" style={{ color: "var(--dl-text-muted, #5A6275)" }}>{state.topPublics.slice(0, 2).join(" and ")}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
