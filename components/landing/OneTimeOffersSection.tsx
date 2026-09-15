import Link from "next/link";
import { ArrowRight, FileText, GraduationCap, Target } from "lucide-react";

const offers = [
  { icon: FileText, name: "Essay Deep Review", price: "$49", text: "Focused feedback on one college essay." },
  { icon: GraduationCap, name: "Complete Application Review", price: "$149", text: "Holistic profile, college-list, and strategy review." },
  { icon: Target, name: "Test Prep Strategy", price: "$59", text: "SAT or ACT plan with tutor-fit guidance." },
];

export function OneTimeOffersSection() {
  return (
    <section className="border-y border-black/5 bg-white/55 py-16" aria-labelledby="one-time-offers-title">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-2xl"><p className="text-xs font-bold uppercase text-[#4A6FA5]">One-time support</p><h2 id="one-time-offers-title" className="mt-2 text-3xl font-extrabold text-[#1B2030]">Get a focused review without changing plans.</h2><p className="mt-3 text-[#454B5E]">Single-payment services with clear scope and fulfillment steps.</p></div>
          <Link href="/offers" className="inline-flex items-center gap-2 text-sm font-bold text-[#2E4A6E]">See all one-time services <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">{offers.map(({ icon: Icon, ...offer }) => <article key={offer.name} className="rounded-lg border border-black/10 bg-white p-5"><div className="flex items-start justify-between gap-4"><Icon className="h-5 w-5 text-[#4A6FA5]" /><span className="text-lg font-extrabold text-[#1B2030]">{offer.price}</span></div><h3 className="mt-4 font-bold text-[#1B2030]">{offer.name}</h3><p className="mt-2 text-sm leading-6 text-[#5A6275]">{offer.text}</p></article>)}</div>
      </div>
    </section>
  );
}
