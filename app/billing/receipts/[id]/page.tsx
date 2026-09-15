/**
 * Server-rendered Stripe receipt at /billing/receipts/[id].
 *
 * `id` accepts either a Stripe charge id (`ch_...` / `py_...`) or a
 * payment_intent id (`pi_...`); we resolve to a single charge regardless.
 * Ownership is verified against Clerk auth → user.stripeCustomerId so
 * one user can never read another user's charge by guessing an id.
 *
 * Designed to print cleanly: AppNav and FAB are hidden by the global
 * `@media print` rule (header/nav/.no-print → display:none), so the
 * printed page is just the receipt card.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { getGoogleUser, hasSessionCookie } from "@/lib/google-auth";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { ReceiptPrintButton } from "./print-button";

export const metadata: Metadata = {
  title: "Receipt",
  description: "AdmitPath payment receipt.",
  robots: { index: false, follow: false },
};

type Params = { id: string };

function formatAmount(cents: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(cents / 100);
  } catch {
    return `$${(cents / 100).toFixed(2)}`;
  }
}

function formatDate(unixSec: number): string {
  return new Date(unixSec * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function ReceiptPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const googleUser = await getGoogleUser();
  if (!googleUser) {
    if (!(await hasSessionCookie())) redirect("/sign-in");
    notFound();
  }
  const userId = googleUser.id;

  const dbUser = await prisma.user.findUnique({
    where: { id: userId! },
    select: { stripeCustomerId: true },
  });
  if (!dbUser?.stripeCustomerId) notFound();

  // Resolve `id` to a charge. Accept charge ids and payment_intent ids.
  let charge: Stripe.Charge | null = null;
  let paymentIntentId: string | null = id.startsWith("pi_") ? id : null;
  try {
    if (id.startsWith("pi_")) {
      const pi = (await stripe.paymentIntents.retrieve(id, {
        expand: ["latest_charge"],
      })) as Stripe.PaymentIntent;
      const latest = pi.latest_charge;
      if (latest && typeof latest === "object") {
        charge = latest as Stripe.Charge;
      } else if (typeof latest === "string") {
        charge = (await stripe.charges.retrieve(latest)) as Stripe.Charge;
      }
    } else {
      charge = (await stripe.charges.retrieve(id)) as Stripe.Charge;
      paymentIntentId =
        typeof charge.payment_intent === "string"
          ? charge.payment_intent
          : charge.payment_intent?.id ?? null;
    }
  } catch {
    notFound();
  }
  if (!charge) notFound();

  // Ownership verification — charge.customer must match the signed-in user.
  if (charge.customer !== dbUser.stripeCustomerId) notFound();

  const userEmail = googleUser.email ?? charge.billing_details?.email ?? "";

  // Best-effort plan + period extraction. Receipts created from a subscription
  // invoice expose those via `invoice` → fetch lazily; otherwise leave blank.
  let planLabel = "";
  let periodLabel = "";
  if (paymentIntentId) {
    try {
      const invoicePayments = await stripe.invoicePayments.list({
        limit: 1,
        payment: { type: "payment_intent", payment_intent: paymentIntentId },
      });
      const invoiceRef = invoicePayments.data[0]?.invoice;
      const invoiceId = typeof invoiceRef === "string" ? invoiceRef : invoiceRef?.id;
      if (!invoiceId) throw new Error("No invoice found for payment");
      const invoice = (await stripe.invoices.retrieve(invoiceId, {
        expand: ["lines.data.pricing.price_details.price"],
      })) as Stripe.Invoice;
      const line = invoice.lines.data[0];
      if (line) {
        const productId = line.pricing?.price_details?.product;
        if (productId) {
          const product = await stripe.products.retrieve(productId);
          if (!product.deleted) planLabel = product.name;
        }
        if (line.period?.start && line.period?.end) {
          periodLabel = `${formatDate(line.period.start)} – ${formatDate(line.period.end)}`;
        }
      }
    } catch {
      // non-fatal — receipt still renders without plan/period
    }
  }

  return (
    <div
      className="min-h-screen px-4 py-12"
      style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}
    >
      <div className="mx-auto w-full max-w-xl">
        <div className="no-print mb-6 flex justify-end">
          <ReceiptPrintButton />
        </div>

        <article
          className="rounded-2xl border p-8 sm:p-10 dl-card-hover overflow-hidden"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
        >
          <header className="mb-6">
            <p
              className="text-[11px] font-medium uppercase"
              style={{
                letterSpacing: "0.08em",
                color: "var(--dl-text-muted, #5A6275)",
                fontFamily: "var(--font-inter)",
              }}
            >
              AdmitPath · admith.vercel.app
            </p>
          </header>

          <p
            className="mb-3 text-[11px] font-medium uppercase"
            style={{
              letterSpacing: "0.08em",
              color: "var(--dl-text-muted, #5A6275)",
              fontFamily: "var(--font-inter)",
            }}
          >
            Receipt
          </p>

          <h1
            className="mb-8 text-2xl sm:text-3xl"
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 400,
              letterSpacing: "-0.01em",
              color: "var(--dl-text-primary, #1B2030)",
            }}
          >
            {formatAmount(charge.amount, charge.currency)}
          </h1>

          <div
            className="my-6 h-px w-full"
            style={{ background: "rgba(0,0,0,0.06)" }}
            aria-hidden
          />

          <dl className="grid grid-cols-1 gap-y-3 text-sm" style={{ fontFamily: "var(--font-inter)" }}>
            <div className="flex justify-between gap-4">
              <dt style={{ color: "var(--dl-text-muted, #5A6275)" }}>Date</dt>
              <dd style={{ color: "var(--dl-text-primary, #1B2030)" }}>{formatDate(charge.created)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt style={{ color: "var(--dl-text-muted, #5A6275)" }}>Amount</dt>
              <dd style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                {formatAmount(charge.amount, charge.currency)}
              </dd>
            </div>
            {planLabel ? (
              <div className="flex justify-between gap-4">
                <dt style={{ color: "var(--dl-text-muted, #5A6275)" }}>Plan</dt>
                <dd style={{ color: "var(--dl-text-primary, #1B2030)" }}>{planLabel}</dd>
              </div>
            ) : null}
            {periodLabel ? (
              <div className="flex justify-between gap-4">
                <dt style={{ color: "var(--dl-text-muted, #5A6275)" }}>Period</dt>
                <dd style={{ color: "var(--dl-text-primary, #1B2030)" }}>{periodLabel}</dd>
              </div>
            ) : null}
            {userEmail ? (
              <div className="flex justify-between gap-4">
                <dt style={{ color: "var(--dl-text-muted, #5A6275)" }}>Billed to</dt>
                <dd style={{ color: "var(--dl-text-primary, #1B2030)" }}>{userEmail}</dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-4">
              <dt style={{ color: "var(--dl-text-muted, #5A6275)" }}>Status</dt>
              <dd style={{ color: "var(--dl-text-primary, #1B2030)" }}>{charge.status}</dd>
            </div>
          </dl>

          <div
            className="my-6 h-px w-full"
            style={{ background: "rgba(0,0,0,0.06)" }}
            aria-hidden
          />

          <p
            className="text-xs"
            style={{ color: "var(--dl-text-muted, #5A6275)", fontFamily: "var(--font-inter)" }}
          >
            Charge ID: {charge.id}
          </p>
          <p
            className="mt-2 text-xs"
            style={{ color: "var(--dl-text-muted, #5A6275)", fontFamily: "var(--font-inter)" }}
          >
            Questions? Email{" "}
            <a href="mailto:maestro.committee@gmail.com" className="underline" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              maestro.committee@gmail.com
            </a>
            .
          </p>
        </article>
      </div>
    </div>
  );
}
