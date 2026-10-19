import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CheckCircle2, Lock } from "lucide-react";
import { auth } from "@/lib/clerk-shim-server";
import { prisma, withRetry } from "@/lib/prisma";
import { ENTITLEMENT_USER_SELECT, FEATURES, PRO_FEATURES, UPGRADE_URL, featureState, type FeatureKey } from "@/lib/entitlements";

/**
 * Server-side page gate for Pro-only features (single entitlements registry).
 * Signed out -> sign-in with return URL. Free -> locked screen with a direct
 * Stripe checkout CTA. Pro -> renders the feature.
 */
export async function ProFeatureGate({ feature, children }: { feature: FeatureKey; children: React.ReactNode }) {
  const def = FEATURES[feature];
  const { userId } = await auth();
  if (!userId) {
    const requestHeaders = await headers();
    const candidate = requestHeaders.get("x-admitpath-return-to") ?? def.href;
    const returnTo = candidate.startsWith("/") && !candidate.startsWith("//") ? candidate : def.href;
    redirect(`/sign-in?redirect_url=${encodeURIComponent(returnTo)}`);
  }

  let user = null;
  try {
    user = await withRetry(() =>
      prisma.user.findFirst({ where: { id: userId, deletedAt: null }, select: ENTITLEMENT_USER_SELECT }),
    );
  } catch (error) {
    console.error("[pro-feature-gate] entitlement lookup failed", { feature, name: error instanceof Error ? error.name : "UnknownError" });
  }
  if (!user) redirect("/profile/create");

  const state = featureState(user, feature);
  if (state.unlocked) return <>{children}</>;

  return (
    <main
      id="main"
      className="flex min-h-[70vh] items-center justify-center px-4 py-12"
      style={{ background: "var(--dl-bg-root, #D5DCE8)" }}
      aria-label={`${def.label} is a Pro feature`}
    >
      <div className="w-full max-w-xl rounded-3xl border p-6 sm:p-10" style={{ background: "rgba(255,255,255,0.6)", borderColor: "rgba(0,0,0,0.06)" }}>
        <p className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold" style={{ background: "rgba(74,111,165,0.10)", color: "#2E4A6E" }}>
          <Lock className="h-3.5 w-3.5" aria-hidden /> Pro feature
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
          {def.label} is included with Pro
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{def.description}</p>
        <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {PRO_FEATURES.map((item) => (
            <li key={item.key} className="flex items-start gap-2 text-sm" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "#4A6FA5" }} aria-hidden />
              {item.label}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href={`${UPGRADE_URL}?from=${encodeURIComponent(def.href)}`} prefetch={false} className="dl-btn dl-btn-primary dl-btn-lg justify-center">
            Upgrade to Pro — $19.99/mo
          </Link>
          <Link href="/dashboard" className="dl-btn dl-btn-secondary dl-btn-lg justify-center">Back to dashboard</Link>
        </div>
        <p className="mt-4 text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
          Secure Stripe checkout. Cancel anytime from Billing.
        </p>
      </div>
    </main>
  );
}
