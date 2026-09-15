import { z } from "zod";
import { NextResponse } from "next/server";
import { requireUser, parseJsonBody } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getAppBaseUrl } from "@/lib/app-url";
import { rateLimitAPI, getClientIp } from "@/lib/rate-limit";
import { getOneTimeOffer, getOfferPriceId } from "@/lib/one-time-offers";
import { buildOneTimeCommerceEvent } from "@/lib/analytics";
import { logEvent } from "@/lib/log-error";

const requestSchema = z.object({ offerSlug: z.string().min(1).max(80) });

export async function POST(req: Request) {
  const authed = await requireUser();
  if ("response" in authed) return authed.response;

  const limited = await rateLimitAPI(`one-time-checkout:${authed.userId}:${getClientIp(req)}`);
  if (!limited.allowed) {
    return NextResponse.json(
      { error: "Too many checkout attempts. Try again in a minute." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  const parsed = await parseJsonBody(req, requestSchema);
  if ("response" in parsed) return parsed.response;
  const offer = getOneTimeOffer(parsed.data.offerSlug);
  if (!offer) return NextResponse.json({ error: "Offer not found." }, { status: 404 });

  const priceId = getOfferPriceId(offer);
  if (!priceId) {
    console.error("[stripe/one-time-checkout] missing configured price", { offerSlug: offer.slug });
    return NextResponse.json({ error: "Checkout is temporarily unavailable." }, { status: 503 });
  }

  try {
    const price = await stripe.prices.retrieve(priceId);
    if (!price.active || price.type !== "one_time" || price.currency !== "usd" || price.unit_amount !== offer.amount) {
      console.error("[stripe/one-time-checkout] price contract mismatch", { offerSlug: offer.slug });
      return NextResponse.json({ error: "Checkout is temporarily unavailable." }, { status: 503 });
    }

    let customerId = authed.user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: authed.user.email,
        metadata: { userId: authed.userId, app: "admith" },
      });
      customerId = customer.id;
      await prisma.user.update({ where: { id: authed.userId }, data: { stripeCustomerId: customerId } });
    }

    const appUrl = getAppBaseUrl();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      client_reference_id: authed.userId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/offers/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/offers?checkout=cancelled`,
      metadata: { userId: authed.userId, offerSlug: offer.slug, app: "admith" },
      allow_promotion_codes: true,
      consent_collection: { terms_of_service: "required" },
      custom_text: {
        submit: { message: "You will receive fulfillment instructions after payment." },
        terms_of_service_acceptance: { message: `I agree to the [AdmitPath Terms](${appUrl}/terms).` },
      },
    }, { idempotencyKey: `admith-offer:${authed.userId}:${offer.slug}:${Math.floor(Date.now() / 600_000)}` });

    if (!session.url) throw new Error("Checkout session URL missing");
    const event = buildOneTimeCommerceEvent("checkout_created", {
      offerSlug: offer.slug,
      amount: offer.amount,
      currency: "usd",
      surface: "offers_catalog",
      authority: "server",
    });
    logEvent(event.name, event.properties);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[stripe/one-time-checkout] failed", {
      offerSlug: offer.slug,
      name: error instanceof Error ? error.name : "UnknownError",
    });
    return NextResponse.json({ error: "Checkout is temporarily unavailable." }, { status: 502 });
  }
}
