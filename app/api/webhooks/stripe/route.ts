import { NextResponse } from "next/server";
import { stripe, resolvePlan } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendPaymentConfirmationEmail, sendPaymentFailedEmail, sendWinBackEmail } from "@/lib/email";
import { creditReferral } from "@/lib/referral";
import { markOneTimePurchaseStatus, persistOneTimePurchase } from "@/lib/one-time-purchases";
import {
  ENTITLEMENT_SOURCE,
  hasProtectedManualEntitlement,
} from "@/lib/utils";
import type Stripe from "stripe";

/**
 * Stripe moved `current_period_start` / `current_period_end` off the Subscription
 * root onto each `Subscription.items.data[i]` in newer API versions. Read from
 * either location so we keep working across SDK upgrades.
 */
function periodStart(sub: Stripe.Subscription): number {
  const item = sub.items?.data?.[0] as unknown as { current_period_start?: number } | undefined;
  return item?.current_period_start ?? (sub as unknown as { current_period_start?: number }).current_period_start ?? Math.floor(Date.now() / 1000);
}
function periodEnd(sub: Stripe.Subscription): number {
  const item = sub.items?.data?.[0] as unknown as { current_period_end?: number } | undefined;
  return item?.current_period_end ?? (sub as unknown as { current_period_end?: number }).current_period_end ?? Math.floor(Date.now() / 1000);
}

function expandableId(value: string | { id: string } | null): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

type ReconcileOptions = {
  statusOverride?: string;
  deletedAt?: Date | null;
};

async function reconcileSubscriptionSnapshot(
  sub: Stripe.Subscription,
  userId: string,
  planId: string,
  options: ReconcileOptions = {},
) {
  const status = options.statusOverride ?? sub.status;
  const priceId = sub.items.data[0]?.price.id ?? "";
  const customerId = expandableId(sub.customer as string | { id: string } | null);
  if (!customerId) throw new Error("Subscription customer is missing");

  return prisma.$transaction(async (tx) => {
    const [user, legacyTrial] = await Promise.all([
      tx.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          plan: true,
          isInternal: true,
          stripeSubscriptionId: true,
          entitlementSource: true,
          entitlementExpiresAt: true,
        },
      }),
      tx.entitlement.findFirst({
        where: {
          stripeSubscriptionId: sub.id,
          source: ENTITLEMENT_SOURCE.LEGACY_TRIAL,
          status: "ACTIVE",
        },
        orderBy: { createdAt: "asc" },
      }),
    ]);
    if (!user) throw new Error("Subscription user does not exist");

    await tx.subscription.upsert({
      where: { stripeSubId: sub.id },
      create: {
        userId,
        stripeSubId: sub.id,
        stripePriceId: priceId,
        stripeCustomerId: customerId,
        status,
        plan: planId,
        currentPeriodStart: new Date(periodStart(sub) * 1000),
        currentPeriodEnd: new Date(periodEnd(sub) * 1000),
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        deletedAt: options.deletedAt ?? null,
      },
      update: {
        stripePriceId: priceId,
        stripeCustomerId: customerId,
        status,
        plan: planId,
        currentPeriodStart: new Date(periodStart(sub) * 1000),
        currentPeriodEnd: new Date(periodEnd(sub) * 1000),
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        deletedAt: options.deletedAt ?? null,
      },
    });

    const manualProtected = hasProtectedManualEntitlement(user);
    let accessGranted = false;
    let legacyTrialGranted = false;
    let userData: Record<string, unknown>;

    if (manualProtected) {
      accessGranted = true;
      userData = {
        stripeSubscriptionId: status === "active" ? sub.id : null,
      };
    } else if (status === "active") {
      accessGranted = true;
      userData = {
        plan: planId,
        stripeSubscriptionId: sub.id,
        entitlementSource: ENTITLEMENT_SOURCE.STRIPE_SUBSCRIPTION,
        entitlementExpiresAt: null,
        trialStartedAt: null,
      };
      if (legacyTrial) {
        await tx.entitlement.update({
          where: { id: legacyTrial.id },
          data: { status: "CONVERTED" },
        });
      }
    } else if (status === "trialing" && legacyTrial?.endsAt) {
      const remoteTrialEndSeconds = sub.trial_end ?? periodEnd(sub);
      const remoteTrialEnd = new Date(remoteTrialEndSeconds * 1000);
      // Never extend the entitlement beyond the expiry captured during the
      // grandfathering migration, even if Stripe later reports a later date.
      const originalTrialEnd = legacyTrial.endsAt < remoteTrialEnd
        ? legacyTrial.endsAt
        : remoteTrialEnd;
      if (originalTrialEnd > new Date()) {
        accessGranted = true;
        legacyTrialGranted = true;
        userData = {
          plan: "pro",
          stripeSubscriptionId: sub.id,
          entitlementSource: ENTITLEMENT_SOURCE.LEGACY_TRIAL,
          entitlementExpiresAt: originalTrialEnd,
        };
        if (originalTrialEnd.getTime() !== legacyTrial.endsAt.getTime()) {
          await tx.entitlement.update({
            where: { id: legacyTrial.id },
            data: { endsAt: originalTrialEnd },
          });
        }
      } else {
        userData = {
          plan: "free",
          stripeSubscriptionId: null,
          entitlementSource: null,
          entitlementExpiresAt: null,
          trialStartedAt: null,
        };
        await tx.entitlement.update({
          where: { id: legacyTrial.id },
          data: { status: "EXPIRED" },
        });
      }
    } else {
      userData = {
        plan: "free",
        stripeSubscriptionId: null,
        entitlementSource: null,
        entitlementExpiresAt: null,
        trialStartedAt: null,
      };
      if (legacyTrial) {
        await tx.entitlement.update({
          where: { id: legacyTrial.id },
          data: { status: "EXPIRED" },
        });
      }
    }

    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: userData,
      select: { email: true, name: true },
    });
    return { ...updatedUser, manualProtected, accessGranted, legacyTrialGranted };
  });
}

async function revokeStripeAccessPreservingManual(userId: string): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { isInternal: true, entitlementSource: true },
    });
    if (!user || hasProtectedManualEntitlement(user)) return false;
    await tx.user.update({
      where: { id: userId },
      data: {
        plan: "free",
        stripeSubscriptionId: null,
        entitlementSource: null,
        entitlementExpiresAt: null,
      },
    });
    await tx.entitlement.updateMany({
      where: {
        userId,
        status: "ACTIVE",
        source: { in: [ENTITLEMENT_SOURCE.STRIPE_SUBSCRIPTION, ENTITLEMENT_SOURCE.LEGACY_TRIAL] },
      },
      data: { status: "REVOKED", revokedAt: new Date() },
    });
    return true;
  });
}

// ─── All handled event types (explicit for type safety) ─────────────
const HANDLED_EVENTS = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.paused",
  "customer.subscription.resumed",
  "customer.subscription.pending_update_applied",
  "customer.subscription.pending_update_expired",
  "customer.subscription.trial_will_end",
  "invoice.payment_failed",
  "invoice.paid",
  "invoice.payment_action_required",
  "charge.dispute.created",
  "charge.refunded",
  "customer.updated",
  "payment_intent.payment_failed",
] as const;

type HandledEventType = (typeof HANDLED_EVENTS)[number];

function isHandledEvent(type: string): type is HandledEventType {
  return (HANDLED_EVENTS as readonly string[]).includes(type);
}

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    console.warn("[stripe/webhook] missing stripe-signature header");
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  // Fail fast if STRIPE_WEBHOOK_SECRET is missing
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[stripe/webhook] STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook misconfigured" },
      { status: 500 },
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("[stripe/webhook] signature verification failed:", String(err));
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Audit log every event
  console.log("[stripe/webhook]", {
    eventId: event.id,
    eventType: event.type,
    timestamp: new Date().toISOString(),
    handled: isHandledEvent(event.type),
  });

  // Reserve the event before any side effect. A read-then-write idempotency
  // check allows two concurrent Stripe deliveries to both pass the read and
  // send duplicate emails/referral credits. The primary key makes this insert
  // the single atomic admission point. Failed processing releases the
  // reservation so Stripe can retry.
  try {
    await prisma.stripeWebhookEvent.create({
      data: { eventId: event.id, type: event.type },
    });
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    if (code === "P2002") {
      console.log("[stripe/webhook] duplicate event, skipping", { eventId: event.id });
      return NextResponse.json({ received: true, duplicate: true });
    }
    console.warn("[stripe/webhook] idempotency reservation failed", {
      name: err instanceof Error ? err.name : "UnknownError",
    });
    return NextResponse.json({ error: "Webhook persistence unavailable" }, { status: 503 });
  }

  const releaseReservation = async () => {
    await prisma.stripeWebhookEvent
      .delete({ where: { eventId: event.id } })
      .catch(() => undefined);
  };

  // Track whether the handler ran cleanly. If a prisma write fails mid-flight,
  // we skip the idempotency record so Stripe's next retry actually re-runs us.
  let processedCleanly = true;

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode === "payment") {
        try {
          await persistOneTimePurchase(session);
          console.log("[stripe/webhook] one-time checkout processed", {
            sessionId: session.id,
            offerSlug: session.metadata?.offerSlug,
          });
        } catch (err) {
          console.error("[stripe/webhook] one-time checkout failed", {
            sessionId: session.id,
            name: err instanceof Error ? err.name : "UnknownError",
          });
          processedCleanly = false;
        }
        break;
      }
      const userId = session.metadata?.userId;
      const planId = session.metadata?.planId;
      if (!userId || planId !== "pro") {
        console.warn("[stripe/webhook] checkout.session.completed missing metadata", {
          userId, planId, sessionId: session.id,
        });
        await releaseReservation();
        return NextResponse.json({ error: "Missing checkout metadata" }, { status: 500 });
      }

      // Also persist the subscription ID. effectivePlan() only grants paid
      // access when BOTH plan is plus/pro AND stripeSubscriptionId is set.
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id ?? null;
      if (!subscriptionId) {
        await releaseReservation();
        return NextResponse.json({ error: "Missing checkout subscription" }, { status: 500 });
      }

      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id ?? null;
      if (
        session.mode !== "subscription" ||
        !["paid", "no_payment_required"].includes(session.payment_status) ||
        !customerId
      ) {
        console.error("[stripe/webhook] checkout contract validation failed", {
          sessionId: session.id,
          mode: session.mode,
          paymentStatus: session.payment_status,
          hasCustomer: Boolean(customerId),
        });
        await releaseReservation();
        return NextResponse.json({ error: "Invalid checkout contract" }, { status: 500 });
      }

      try {
        const [subscription, targetUser] = await Promise.all([
          stripe.subscriptions.retrieve(subscriptionId),
          prisma.user.findFirst({
            where: { id: userId, deletedAt: null },
            select: { id: true, stripeCustomerId: true },
          }),
        ]);
        const subscriptionCustomerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;
        const subscriptionPriceId = subscription.items.data[0]?.price.id;
        const subscriptionPlan = resolvePlan(subscriptionPriceId);
        if (
          !targetUser ||
          targetUser.stripeCustomerId !== customerId ||
          subscriptionCustomerId !== customerId ||
          subscription.status !== "active" ||
          subscription.metadata?.userId !== userId ||
          subscription.metadata?.planId !== "pro" ||
          subscriptionPlan !== "pro"
        ) {
          console.error("[stripe/webhook] checkout ownership or price validation failed", {
            sessionId: session.id,
            subscriptionId,
            userFound: Boolean(targetUser),
            customerMatches: targetUser?.stripeCustomerId === customerId && subscriptionCustomerId === customerId,
            subscriptionStatus: subscription.status,
            metadataMatches: subscription.metadata?.userId === userId && subscription.metadata?.planId === "pro",
            priceRecognized: subscriptionPlan === "pro",
          });
          await releaseReservation();
          return NextResponse.json({ error: "Checkout verification failed" }, { status: 500 });
        }

        await prisma.user.update({
          where: { id: userId },
          data: { stripeCustomerId: customerId },
        });
        await reconcileSubscriptionSnapshot(subscription, userId, planId);
        console.log("[stripe/webhook] checkout.session.completed processed", {
          userId, planId, subscriptionId,
        });

        // Referral credit: if this user was referred, credit both parties
        await creditReferral(userId).catch((err) => {
          console.error("[stripe/webhook] referral credit failed:", String(err));
        });
      } catch (err) {
        console.error("[stripe/webhook] checkout.session.completed DB failed:", String(err));
        processedCleanly = false;
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.pending_update_applied":
    case "customer.subscription.pending_update_expired":
    case "customer.subscription.created": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.userId ?? (await getUserIdFromCustomer(sub.customer as string));
      if (!userId) {
        console.warn("[stripe/webhook] subscription event: no userId found", {
          customerId: sub.customer, subId: sub.id,
        });
        await releaseReservation();
        return NextResponse.json({ error: "Subscription account mapping unavailable" }, { status: 500 });
      }

      const priceId = sub.items.data[0]?.price.id;
      const planId = resolvePlan(priceId);
      if (!planId) {
        // Unknown price — return 500 so Stripe retries
        console.error("[stripe/webhook] unknown price ID, refusing upgrade", {
          priceId, userId, subId: sub.id,
        });
        await releaseReservation();
        return NextResponse.json(
          { error: "Unknown price ID" },
          { status: 500 },
        );
      }

      try {
        const updatedUser = await reconcileSubscriptionSnapshot(sub, userId, planId);

        if (sub.status === "active" && updatedUser.email) {
          await sendPaymentConfirmationEmail(updatedUser.email, planId).catch((err) => {
            console.error("[stripe/webhook] payment confirmation email failed:", err);
          });
        }
        console.log("[stripe/webhook] subscription created/updated processed", {
          userId, planId, status: sub.status, subId: sub.id,
        });
      } catch (err) {
        console.error("[stripe/webhook] subscription created/updated DB failed:", String(err));
        processedCleanly = false;
      }
      break;
    }

    case "customer.subscription.deleted": {
      try {
        const sub = event.data.object as Stripe.Subscription;
        const userId = await getUserIdFromCustomer(sub.customer as string);
        if (!userId) {
          console.warn("[stripe/webhook] subscription.deleted: no userId found", {
            customerId: sub.customer, subId: sub.id,
          });
          break;
        }
        const priceId = sub.items.data[0]?.price.id;
        const planId = resolvePlan(priceId) ?? "pro";
        const cancelledUser = await reconcileSubscriptionSnapshot(sub, userId, planId, {
          statusOverride: "canceled",
          deletedAt: new Date(),
        });
        if (!cancelledUser.manualProtected && cancelledUser.email) {
          const firstName = (cancelledUser.name ?? "").split(" ")[0] || "there";
          await sendWinBackEmail(cancelledUser.email, firstName).catch((err) => {
            console.error("[stripe/webhook] win-back email failed:", err);
          });
        }
        console.log("[stripe/webhook] subscription.deleted processed", { userId, subId: sub.id });
      } catch (err) {
        console.error("[stripe/webhook] subscription.deleted DB failed:", String(err));
        processedCleanly = false;
      }
      break;
    }

    case "customer.subscription.paused": {
      try {
        const sub = event.data.object as Stripe.Subscription;
        const userId = await getUserIdFromCustomer(sub.customer as string);
        if (!userId) break;
        const priceId = sub.items.data[0]?.price.id;
        const planId = resolvePlan(priceId) ?? "pro";
        await reconcileSubscriptionSnapshot(sub, userId, planId, { statusOverride: "paused" });
        console.log("[stripe/webhook] subscription.paused processed", { userId, subId: sub.id });
      } catch (err) {
        console.error("[stripe/webhook] subscription.paused failed:", String(err));
        processedCleanly = false;
      }
      break;
    }

    case "customer.subscription.resumed": {
      try {
        const sub = event.data.object as Stripe.Subscription;
        const userId = await getUserIdFromCustomer(sub.customer as string);
        if (!userId) break;
        const priceId = sub.items.data[0]?.price.id;
        const planId = resolvePlan(priceId);
        if (!planId) break;
        await reconcileSubscriptionSnapshot(sub, userId, planId);
        console.log("[stripe/webhook] subscription.resumed processed", { userId, planId });
      } catch (err) {
        console.error("[stripe/webhook] subscription.resumed failed:", String(err));
        processedCleanly = false;
      }
      break;
    }

    case "customer.subscription.trial_will_end": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.userId ?? (await getUserIdFromCustomer(sub.customer as string));
      const planId = resolvePlan(sub.items.data[0]?.price.id);
      if (userId && planId) {
        try {
          const result = await reconcileSubscriptionSnapshot(sub, userId, planId);
          console.log("[stripe/webhook] legacy trial approaching original expiry", {
            subId: sub.id,
            userId,
            grandfathered: result.legacyTrialGranted,
          });
        } catch (err) {
          console.error("[stripe/webhook] trial_will_end reconciliation failed", String(err));
          processedCleanly = false;
        }
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      const failedUser = await prisma.user.findFirst({
        where: { stripeCustomerId: customerId, deletedAt: null },
        select: { id: true, email: true, name: true },
      });
      if (failedUser?.email) {
        const firstName = (failedUser.name ?? "").split(" ")[0] || "there";
        await sendPaymentFailedEmail(failedUser.email, firstName).catch((err) => {
          console.error("[stripe/webhook] payment-failed email failed:", err);
        });
      }
      console.log("[stripe/webhook] invoice.payment_failed processed", {
        customerId, userId: failedUser?.id, invoiceId: invoice.id,
      });
      break;
    }

    case "invoice.payment_action_required": {
      // 3D Secure or other action required — log for monitoring
      const invoice = event.data.object as Stripe.Invoice;
      console.log("[stripe/webhook] invoice.payment_action_required", {
        invoiceId: invoice.id,
        customerId: invoice.customer,
      });
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const subscription = invoice.parent?.subscription_details?.subscription;
      const subId = expandableId(subscription ?? null);
      if (!subId) break;
      try {
        const sub = await stripe.subscriptions.retrieve(subId);
        const priceId = sub.items.data[0]?.price.id;
        const planId = resolvePlan(priceId);
        if (!planId) {
          console.error("[stripe/webhook] invoice.paid unknown price ID", { priceId, subId });
          await releaseReservation();
          return NextResponse.json({ error: "Unknown subscription price" }, { status: 500 });
        }
        const userId =
          sub.metadata?.userId ?? (await getUserIdFromCustomer(sub.customer as string));
        if (!userId) {
          await releaseReservation();
          return NextResponse.json({ error: "Invoice account mapping unavailable" }, { status: 500 });
        }
        const result = await reconcileSubscriptionSnapshot(sub, userId, planId);
        if (sub.status !== "active") {
          console.warn("[stripe/webhook] invoice.paid did not grant Stripe access", {
            subId,
            userId,
            subscriptionStatus: sub.status,
            manualEntitlementPreserved: result.manualProtected,
          });
          break;
        }
        console.log("[stripe/webhook] invoice.paid processed", { subId, planId, userId });
      } catch (err) {
        console.error("[stripe/webhook] invoice.paid handler failed:", String(err));
        processedCleanly = false;
      }
      break;
    }

    case "charge.dispute.created": {
      // Chargeback/dispute — immediately revoke paid access while dispute is
      // open, and log at error level for manual investigation.
      const dispute = event.data.object as Stripe.Dispute;
      const disputeChargeId = typeof dispute.charge === "string" ? dispute.charge : (dispute.charge as Stripe.Charge)?.id;
      if (disputeChargeId) {
        try {
          const disputeCharge = await stripe.charges.retrieve(disputeChargeId);
          const oneTimePurchaseCount = await markOneTimePurchaseStatus(
            expandableId(disputeCharge.payment_intent),
            "disputed",
          );
          const disputeCustomerId = disputeCharge.customer as string | null;
          if (oneTimePurchaseCount === 0 && disputeCustomerId) {
            const disputedUser = await prisma.user.findFirst({
              where: { stripeCustomerId: disputeCustomerId, deletedAt: null },
              select: { id: true },
            });
            if (disputedUser) {
              await revokeStripeAccessPreservingManual(disputedUser.id);
            }
          }
        } catch (err) {
          console.error("[stripe/webhook] dispute user downgrade failed:", String(err));
          processedCleanly = false;
        }
      }
      console.error("[stripe/webhook] DISPUTE CREATED", {
        disputeId: dispute.id,
        chargeId: disputeChargeId,
        amount: dispute.amount,
        reason: dispute.reason,
        status: dispute.status,
      });
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      const refundCustomerId = charge.customer as string | null;
      const oneTimePurchaseCount = charge.refunded
        ? await markOneTimePurchaseStatus(expandableId(charge.payment_intent), "refunded")
        : 0;
      // Full refund: downgrade user back to free tier. Partial refunds are
      // logged but leave the plan intact (handled manually in Stripe dashboard).
      if (charge.refunded && oneTimePurchaseCount === 0 && refundCustomerId) {
        try {
          const refundedUser = await prisma.user.findFirst({
            where: { stripeCustomerId: refundCustomerId, deletedAt: null },
            select: { id: true, email: true, name: true, isInternal: true, entitlementSource: true },
          });
          if (refundedUser) {
            const revoked = await revokeStripeAccessPreservingManual(refundedUser.id);
            if (revoked && refundedUser.email) {
              const firstName = (refundedUser.name ?? "").split(" ")[0] || "there";
              await sendWinBackEmail(refundedUser.email, firstName).catch((err) => {
                console.error("[stripe/webhook] refund win-back email failed:", err);
              });
            }
          }
        } catch (err) {
          console.error("[stripe/webhook] charge.refunded DB failed:", String(err));
          processedCleanly = false;
        }
      }
      console.log("[stripe/webhook] charge.refunded", {
        chargeId: charge.id,
        amount: charge.amount_refunded,
        customerId: refundCustomerId,
        fullRefund: charge.refunded,
      });
      break;
    }

    case "customer.updated": {
      const customer = event.data.object as Stripe.Customer;
      console.log("[stripe/webhook] customer.updated", {
        customerId: customer.id,
      });
      break;
    }

    case "payment_intent.payment_failed": {
      const pi = event.data.object as Stripe.PaymentIntent;
      console.warn("[stripe/webhook] payment_intent.payment_failed", {
        piId: pi.id,
        customerId: pi.customer,
        errorCode: pi.last_payment_error?.code ?? null,
      });
      break;
    }

    default: {
      // Log unhandled event types for visibility
      console.log("[stripe/webhook] unhandled event type", { type: event.type, eventId: event.id });
      break;
    }
  }

  if (!processedCleanly) {
    await releaseReservation();
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function getUserIdFromCustomer(customerId: string): Promise<string | null> {
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId, deletedAt: null },
  });
  return user?.id ?? null;
}
