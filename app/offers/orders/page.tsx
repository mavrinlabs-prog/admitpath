import Link from "next/link";
import { redirect } from "next/navigation";
import { getGoogleUser } from "@/lib/google-auth";
import { prisma } from "@/lib/prisma";
import { getOneTimeOffer } from "@/lib/one-time-offers";

export default async function OrdersPage() {
  const user = await getGoogleUser();
  if (!user) redirect("/sign-in?redirect_url=%2Foffers%2Forders");
  const purchases = await prisma.oneTimePurchase.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });

  return (
    <main className="min-h-screen bg-[#EFF2F8] px-5 py-14 text-[#1B2030]">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-bold uppercase text-[#4A6FA5]">Account</p><h1 className="mt-2 text-3xl font-extrabold">One-time purchases</h1></div><Link href="/offers" className="text-sm font-semibold text-[#2E4A6E]">Browse services</Link></div>
        <div className="mt-8 space-y-4">
          {purchases.length === 0 ? <div className="rounded-lg border border-black/10 bg-white p-6"><p>No one-time purchases yet.</p></div> : purchases.map((purchase) => {
            const offer = getOneTimeOffer(purchase.offerSlug);
            return <article key={purchase.id} className="rounded-lg border border-black/10 bg-white p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="font-bold">{offer?.name ?? purchase.offerSlug}</h2><p className="mt-1 text-sm text-[#5A6275]">Purchased {purchase.createdAt.toLocaleDateString()}</p></div><span className="rounded-full bg-[#EFF2F8] px-3 py-1 text-xs font-bold uppercase">{purchase.fulfilledAt ? "fulfilled" : purchase.status}</span></div>{offer ? <Link href={offer.nextPath} className="mt-4 inline-block text-sm font-semibold text-[#2E4A6E]">{offer.nextLabel}</Link> : null}</article>;
          })}
        </div>
      </div>
    </main>
  );
}
