import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";

// ─── Strongly-typed Clerk webhook payloads ──────────────────────────
type ClerkEmailAddress = {
  id: string;
  email_address: string;
  verification: { status: string } | null;
};

type ClerkUserData = {
  id: string;
  email_addresses: ClerkEmailAddress[];
  primary_email_address_id: string | null;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  created_at: number;
  updated_at: number;
  banned: boolean;
  locked: boolean;
  has_image: boolean;
  username: string | null;
  external_id: string | null;
};

type ClerkOrganizationMembershipData = {
  id: string;
  organization: { id: string; name: string; slug: string };
  public_user_data: { user_id: string };
  role: string;
};

type ClerkSessionData = {
  id: string;
  user_id: string;
  status: string;
  abandon_at: number;
};

type ClerkWebhookEvent =
  | { type: "user.created"; data: ClerkUserData }
  | { type: "user.updated"; data: ClerkUserData }
  | { type: "user.deleted"; data: { id: string; deleted: boolean } }
  | { type: "session.created"; data: ClerkSessionData }
  | { type: "session.ended"; data: ClerkSessionData }
  | { type: "session.removed"; data: ClerkSessionData }
  | { type: "session.revoked"; data: ClerkSessionData }
  | { type: "organization.created"; data: { id: string; name: string } }
  | { type: "organizationMembership.created"; data: ClerkOrganizationMembershipData }
  | { type: "organizationMembership.deleted"; data: ClerkOrganizationMembershipData }
  | { type: (string & {}); data: Record<string, unknown> }; // catch-all for future events

// ─── Idempotency helper ─────────────────────────────────────────────
async function isAlreadyProcessed(eventId: string): Promise<boolean> {
  try {
    const seen = await prisma.stripeWebhookEvent.findUnique({
      where: { eventId },
      select: { eventId: true },
    });
    return !!seen;
  } catch {
    // Table missing or DB error — log and continue
    return false;
  }
}

async function markProcessed(eventId: string, eventType: string): Promise<void> {
  try {
    await prisma.stripeWebhookEvent.create({
      data: { eventId, type: eventType },
    });
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    if (code !== "P2002") {
      console.warn("[clerk/webhook] idempotency write failed:", err);
    }
  }
}

// ─── Route handler ──────────────────────────────────────────────────
export async function POST(req: Request) {
  const body = await req.text();
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.warn("[clerk/webhook] missing svix headers");
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  // Fail loud on missing secret so ops can page on it
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[clerk/webhook] CLERK_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook misconfigured" },
      { status: 500 },
    );
  }

  const wh = new Webhook(webhookSecret);
  let event: ClerkWebhookEvent;
  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    console.warn("[clerk/webhook] signature verification failed:", String(err));
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  // Audit log every event
  console.log("[clerk/webhook]", {
    eventType: event.type,
    svixId,
    timestamp: new Date().toISOString(),
  });

  // Idempotency — skip if already processed
  if (await isAlreadyProcessed(svixId)) {
    console.log("[clerk/webhook] duplicate event, skipping", { svixId });
    return NextResponse.json({ received: true, duplicate: true });
  }

  let processedCleanly = true;

  switch (event.type) {
    case "user.created": {
      const userData = event.data as ClerkUserData;
      const { id, email_addresses, first_name, last_name } = userData;
      const email = email_addresses[0]?.email_address ?? "";
      const name = [first_name, last_name].filter(Boolean).join(" ") || undefined;

      try {
        await prisma.user.upsert({
          where: { id },
          create: { id, email, name, plan: "free" },
          update: { email, name },
        });
        console.log("[clerk/webhook] user.created processed", { userId: id, email });
      } catch (err) {
        console.error("[clerk/webhook] user.created DB write failed:", err);
        processedCleanly = false;
      }
      try {
        await sendWelcomeEmail(email, first_name || name || "there");
      } catch (emailErr) {
        console.error("[clerk/webhook] welcome email failed (non-fatal):", emailErr);
      }
      break;
    }

    case "user.updated": {
      const updatedData = event.data as ClerkUserData;
      const { id, email_addresses, first_name, last_name } = updatedData;
      const email = email_addresses[0]?.email_address ?? "";
      const name = [first_name, last_name].filter(Boolean).join(" ") || undefined;

      try {
        await prisma.user.update({ where: { id }, data: { email, name } });
        console.log("[clerk/webhook] user.updated processed", { userId: id });
      } catch (err) {
        console.error("[clerk/webhook] user.updated DB write failed:", err);
        processedCleanly = false;
      }
      break;
    }

    case "user.deleted": {
      const { id } = event.data as { id: string; deleted: boolean };
      // Cascade soft-delete to every owned table so reads that filter on
      // `deletedAt: null` drop the rows.
      const now = new Date();
      try {
        await prisma.$transaction([
          prisma.user.update({ where: { id }, data: { deletedAt: now } }),
          prisma.profile.updateMany({ where: { userId: id, deletedAt: null }, data: { deletedAt: now } }),
          prisma.collegeList.updateMany({ where: { userId: id, deletedAt: null }, data: { deletedAt: now } }),
          prisma.essay.updateMany({ where: { userId: id, deletedAt: null }, data: { deletedAt: now } }),
          prisma.analysis.updateMany({ where: { userId: id, deletedAt: null }, data: { deletedAt: now } }),
          prisma.subscription.updateMany({ where: { userId: id, deletedAt: null }, data: { deletedAt: now } }),
          // Application has no `deletedAt` column — hard-delete to avoid orphaned rows
          prisma.application.deleteMany({ where: { userId: id } }),
        ]);
        console.log("[clerk/webhook] user.deleted cascade completed", { userId: id });
      } catch (err) {
        console.error("[clerk/webhook] user.deleted cascade failed:", err);
        processedCleanly = false;
      }
      break;
    }

    case "session.created":
    case "session.ended":
    case "session.removed":
    case "session.revoked": {
      // Session events — log for audit trail but no DB action needed
      const sessionData = event.data as ClerkSessionData;
      console.log("[clerk/webhook] session event", {
        type: event.type,
        userId: sessionData.user_id,
        sessionId: sessionData.id,
        status: sessionData.status,
      });
      break;
    }

    default: {
      // Log unhandled event types for visibility — prevents silent drops
      console.log("[clerk/webhook] unhandled event type", { type: event.type });
      break;
    }
  }

  // Only persist the idempotency record if processing succeeded
  if (processedCleanly) {
    await markProcessed(svixId, event.type);
  }

  return NextResponse.json({ received: true });
}
