import "server-only";

import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getOneTimeOffer, getOfferPriceId } from "@/lib/one-time-offers";
import { buildOneTimeCommerceEvent } from "@/lib/analytics";
import { logEvent } from "@/lib/log-error";

function expandableId(value: string | { id: string } | null): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

export async function persistOneTimePurchase(sessionInput: Stripe.Checkout.Session) {
  const session = await stripe.checkout.sessions.retrieve(sessionInput.id, {
    expand: ["line_items.data.price"],
  });
  const userId = session.metadata?.userId;
  const offer = getOneTimeOffer(session.metadata?.offerSlug);
  const lineItem = session.line_items?.data[0];
  const priceId = typeof lineItem?.price === "string" ? lineItem.price : lineItem?.price?.id;
  const expectedPriceId = offer ? getOfferPriceId(offer) : null;
  const customerId = expandableId(session.customer);
  const paymentIntentId = expandableId(session.payment_intent);

  if (
    !userId ||
    !offer ||
    !expectedPriceId ||
    priceId !== expectedPriceId ||
    session.mode !== "payment" ||
    session.payment_status !== "paid" ||
    session.client_reference_id !== userId ||
    session.amount_total !== offer.amount ||
    session.currency !== "usd" ||
    !customerId ||
    !paymentIntentId
  ) {
    throw new Error("Invalid one-time checkout contract");
  }

  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    select: { id: true, stripeCustomerId: true },
  });
  if (!user || (user.stripeCustomerId && user.stripeCustomerId !== customerId)) {
    throw new Error("One-time checkout ownership verification failed");
  }

  if (!user.stripeCustomerId) {
    await prisma.user.update({ where: { id: userId }, data: { stripeCustomerId: customerId } });
  }

  const purchase = await prisma.oneTimePurchase.upsert({
    where: { checkoutSessionId: session.id },
    update: { status: "paid", paymentIntentId, customerId },
    create: {
      userId,
      checkoutSessionId: session.id,
      paymentIntentId,
      offerSlug: offer.slug,
      amountTotal: offer.amount,
      currency: "usd",
      status: "paid",
      customerId,
    },
  });

  const event = buildOneTimeCommerceEvent("purchase_completed", {
    offerSlug: offer.slug,
    amount: offer.amount,
    currency: "usd",
    surface: "stripe_checkout",
    authority: "server",
    eventId: purchase.id,
  });
  logEvent(event.name, { eventId: event.id, ...event.properties });

  return purchase;
}

export async function markOneTimePurchaseStatus(
  paymentIntentId: string | null,
  status: "refunded" | "disputed",
) {
  if (!paymentIntentId) return 0;
  const result = await prisma.oneTimePurchase.updateMany({
    where: { paymentIntentId },
    data: { status },
  });
  return result.count;
}
