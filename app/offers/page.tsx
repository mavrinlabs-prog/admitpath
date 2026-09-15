import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Check, GraduationCap, ShieldCheck } from "lucide-react";
import { LogoMark } from "@/components/admitpath-logo";
import { OfferCheckoutButton } from "@/components/offer-checkout-button";
import { ONE_TIME_OFFERS } from "@/lib/one-time-offers";

export const metadata: Metadata = {
  title: "Admissions Reviews and Test Prep",
  description: "One-time AdmitPath essay review, complete application review, and test-prep strategy services.",
  alternates: { canonical: "/offers" },
};

const resources = [
  { name: "Official SAT preparation", href: "https://satsuite.collegeboard.org/practice" },
  { name: "Free SAT practice on Khan Academy", href: "https://www.khanacademy.org/test-prep/sat" },
  { name: "Official ACT preparation", href: "https://www.act.org/content/act/en/products-and-services/the-act/test-preparation.html" },
];

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-[#EFF2F8] text-[#1B2030]">
      <header className="border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2 font-bold"><LogoMark size={32} /> AdmitPath</Link>
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link href="/pricing" className="text-[#454B5E] hover:text-[#1B2030]">Pricing</Link>
            <Link href="/offers/orders" className="text-[#454B5E] hover:text-[#1B2030]">My purchases</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase text-[#4A6FA5]">One-time support</p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Get focused help without another subscription.</h1>
          <p className="mt-5 text-lg leading-8 text-[#454B5E]">Each service is a single payment. Scope, next steps, and fulfillment are shown before checkout.</p>
        </div>

        <section className="mt-10 grid gap-5 lg:grid-cols-3" aria-label="One-time services">
          {Object.values(ONE_TIME_OFFERS).map((offer) => (
            <article key={offer.slug} id={offer.slug} className="flex flex-col rounded-lg border border-black/10 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-bold">{offer.name}</h2>
                <span className="text-2xl font-extrabold">{offer.priceLabel}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#454B5E]">{offer.summary}</p>
              <ul className="my-6 space-y-3 text-sm">
                {offer.includes.map((item) => <li key={item} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />{item}</li>)}
              </ul>
              <div className="mt-auto"><OfferCheckoutButton offerSlug={offer.slug} label={`Buy ${offer.name}`} /></div>
            </article>
          ))}
        </section>

        <section className="mt-12 grid gap-6 border-t border-black/10 pt-10 md:grid-cols-[1fr_1.3fr]">
          <div>
            <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-[#4A6FA5]" /><h2 className="text-xl font-bold">Clear purchase terms</h2></div>
            <p className="mt-3 text-sm leading-6 text-[#454B5E]">Payments use Stripe Checkout. These services do not create a recurring subscription. Scheduling and submission instructions appear after payment.</p>
          </div>
          <div>
            <div className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#4A6FA5]" /><h2 className="text-xl font-bold">Independent test-prep resources</h2></div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {resources.map((resource) => <a key={resource.href} href={resource.href} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-black/10 bg-white p-4 text-sm font-semibold hover:border-[#4A6FA5]">{resource.name}</a>)}
            </div>
            <p className="mt-3 text-xs text-[#5A6275]">External resources are provided for convenience. AdmitPath is not paid for these links.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
