import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/clerk-shim-server";
import { prisma } from "@/lib/prisma";
import { AppNav } from "@/components/app-nav";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your AdmitPath dashboard — profile completion, latest analysis, and next steps.",
  alternates: { canonical: "/dashboard" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let userId: string | null = null;
  try {
    const ctx = await auth();
    userId = ctx.userId;
  } catch {
    // Auth check failed; require a fresh validated session before rendering
    // dashboard chrome so stale cookies cannot leave a blank shell.
  }

  if (!userId) {
    redirect("/sign-in");
  }

  // Server-side onboarding gate: redirect to profile creation if no profile exists.
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      include: { profile: true },
    });
    if (user && !user.profile) {
      redirect("/profile/create");
    }
  } catch (err) {
    // Propagate Next.js redirect errors
    if (err instanceof Error && err.message === "NEXT_REDIRECT") throw err;
    const asRecord = err as Record<string, unknown>;
    if (typeof asRecord?.digest === "string" && asRecord.digest.startsWith("NEXT_REDIRECT")) throw err;
    // On DB error, don't block -- the page-level gate will catch it
  }

  return (
    <div style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)", minHeight: "100vh" }}>
      <AppNav />
      <div className="min-w-0 max-w-full overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
