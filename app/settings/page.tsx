import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getGoogleUser, hasSessionCookie } from "@/lib/google-auth";
import type { Metadata } from "next";
import { effectivePlan } from "@/lib/utils";
import SettingsClient from "./settings-client";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: { absolute: "Settings — AdmitPath" }, robots: { index: false, follow: false } };

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  plus: "Pro", // legacy Plus -> Pro
  pro: "Pro",
};

export default async function SettingsPage() {
  const googleUser = await getGoogleUser();
  if (!googleUser && !(await hasSessionCookie())) redirect("/sign-in");
  if (!googleUser) redirect("/sign-in");
  const userId = googleUser.id;

  let user: Awaited<ReturnType<typeof prisma.user.findUnique>> = null;
  let subscription: {
    status: string | null;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: Date | null;
  } | null = null;

  try {
    [user, subscription] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.subscription.findFirst({
        where: { userId, deletedAt: null },
        orderBy: { updatedAt: "desc" },
        select: { status: true, cancelAtPeriodEnd: true, currentPeriodEnd: true },
      }),
    ]);
  } catch {
    // DB unreachable -- render with safe defaults
  }

  const email = googleUser.email ?? user?.email ?? "";
  const fullName = googleUser.name ?? user?.name ?? "";
  const plan = user ? effectivePlan(user) : "free";
  const planLabel = PLAN_LABELS[plan] ?? plan;
  const isPaid = plan === "pro";

  const isStripePaid = !!user?.stripeSubscriptionId && isPaid;

  const cancelAtPeriodEnd = subscription?.cancelAtPeriodEnd ?? false;
  const periodEnd = subscription?.currentPeriodEnd
    ? subscription.currentPeriodEnd.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  // Build plan description
  let planDescription: string;
  if (isPaid) {
    planDescription = "Analyses, essays, chat, and college tracking without the Free-plan caps.";
  } else {
    planDescription = "Free plan — 5 analyses, 5 essays, 5 chat, 8 colleges.";
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <main id="main" className="mx-auto max-w-2xl px-4 py-12">
        <SettingsClient
          userName={fullName}
          userEmail={email}
          isPaid={isPaid}
          isStripePaid={isStripePaid}
          planLabel={planLabel}
          planDescription={planDescription}
          cancelAtPeriodEnd={cancelAtPeriodEnd}
          periodEnd={periodEnd}
        />
      </main>
    </div>
  );
}
