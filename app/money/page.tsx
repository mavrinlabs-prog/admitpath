import { redirect } from "next/navigation";
import { getGoogleUser, hasSessionCookie } from "@/lib/google-auth";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { MoneyClient } from "./money-client";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "My Net Price — Personalized",
  description:
    "Approximate income-band net-price planning for schools on your saved college list.",
  robots: { index: false, follow: false },
};

/**
 * /money — logged-in net-price predictor.
 *
 * Differs from /net-price (public) by:
 *   - Auth gated. Soft-deleted users hit the same redirect.
 *   - Pulls user.profile (income, siblings, state, college list) from Prisma.
 *   - Runs net-price logic against the user's ACTUAL college list, not the
 *     generic 24-school public dataset.
 *   - Keeps estimates separate from official college net-price calculators.
 */
export default async function MoneyPage() {
  const googleUser = await getGoogleUser();
  if (!googleUser && !(await hasSessionCookie())) redirect("/sign-in");
  if (!googleUser) redirect("/sign-in");
  const userId = googleUser.id;

  // Fetch profile + user's college list. Both reads are wrapped in try/catch
  // so a transient DB blip yields a graceful "fill in your profile" prompt
  // rather than a hard 500.
  let profile: {
    householdIncome: number | null;
  } | null = null;
  let collegeList: { collegeName: string; category: string }[] = [];
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      include: {
        profile: true,
        colleges: { where: { deletedAt: null }, orderBy: { createdAt: "desc" } },
      },
    });
    if (user?.profile) {
      profile = {
        householdIncome: user.profile.householdIncome,
      };
    }
    collegeList = (user?.colleges ?? []).map((c) => ({
      collegeName: c.collegeName,
      category: c.category,
    }));
  } catch (e) {
    console.error("[/money] db fetch failed", { error: String(e) });
  }

  return <MoneyClient profile={profile} collegeList={collegeList} />;
}
