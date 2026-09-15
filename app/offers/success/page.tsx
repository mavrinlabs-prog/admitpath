import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { getGoogleUser } from "@/lib/google-auth";
import { stripe } from "@/lib/stripe";
import { persistOneTimePurchase } from "@/lib/one-time-purchases";
import { getOneTimeOffer } from "@/lib/one-time-offers";

export default async function OfferSuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const user = await getGoogleUser();
  if (!user) redirect("/sign-in?redirect_url=%2Foffers%2Fsuccess");
  const sessionId = (await searchParams).session_id;
  if (!sessionId) redirect("/offers");

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.metadata?.userId !== user.id) redirect("/offers");
  await persistOneTimePurchase(session);
  const offer = getOneTimeOffer(session.metadata?.offerSlug);
  if (!offer) redirect("/offers");

  return (
    <main className="min-h-screen bg-[#EFF2F8] px-5 py-16 text-[#1B2030]">
      <div className="mx-auto max-w-2xl rounded-lg border border-black/10 bg-white p-8 shadow-sm">
        <CheckCircle2 className="h-10 w-10 text-green-700" />
        <p className="mt-5 text-sm font-bold uppercase text-green-700">Payment confirmed</p>
        <h1 className="mt-2 text-3xl font-extrabold">{offer.name} is ready for next steps.</h1>
        <p className="mt-4 leading-7 text-[#454B5E]">Your purchase is saved to your account. Complete the linked preparation step so the AdmitPath team has the information needed to fulfill the service.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href={offer.nextPath} className="rounded-lg bg-[#2E4A6E] px-5 py-3 text-sm font-semibold text-white">{offer.nextLabel}</Link>
          <Link href="/offers/orders" className="rounded-lg border border-black/10 px-5 py-3 text-sm font-semibold">View purchase</Link>
        </div>
      </div>
    </main>
  );
}
