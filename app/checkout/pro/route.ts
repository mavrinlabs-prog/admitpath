import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { prisma, withRetry } from "@/lib/prisma";
import { parseSessionCookieValue } from "@/lib/session-cookie";
import { rateLimitAPI, getClientIp } from "@/lib/rate-limit";
import { createProCheckoutSession } from "@/lib/checkout";
import { isValidReferralCode } from "@/lib/referral-code";

export const dynamic = "force-dynamic";

/**
 * GET /checkout/pro — every "Go Pro" / "Start Pro" / "Upgrade" CTA links here.
 *   - signed out  -> /sign-up?redirect_url=/checkout/pro (then straight back here)
 *   - signed in   -> 303 to Stripe Checkout (referral 50% code pre-applied)
 *   - already Pro -> /billing
 * Never routes through /pricing first; /pricing is only the error fallback.
 */
export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const redirect = (path: string) => {
    const res = NextResponse.redirect(new URL(path, url.origin), 303);
    res.headers.set("Cache-Control", "private, no-store");
    return res;
  };

  const cookieStore = await cookies();
  const raw = cookieStore.get("session_user")?.value ?? cookieStore.get("session")?.value;
  const session = parseSessionCookieValue(raw);
  if (!session?.id) {
    const params = new URLSearchParams({ redirect_url: "/checkout/pro" });
    const ref = url.searchParams.get("ref");
    if (ref && isValidReferralCode(ref)) params.set("ref", ref);
    return redirect(`/sign-up?${params.toString()}`);
  }

  const rl = await rateLimitAPI(`checkout:${session.id}:${getClientIp(req)}`);
  if (!rl.allowed) return redirect("/pricing?checkout=rate-limited");

  let user;
  try {
    user = await withRetry(() =>
      prisma.user.findFirst({
        where: { id: session.id, deletedAt: null },
        select: {
          id: true,
          email: true,
          plan: true,
          stripeSubscriptionId: true,
          stripeCustomerId: true,
          isInternal: true,
          entitlementSource: true,
          entitlementExpiresAt: true,
          trialStartedAt: true,
        },
      }),
    );
  } catch {
    return redirect("/pricing?checkout=unavailable");
  }
  if (!user) return redirect("/sign-up?redirect_url=%2Fcheckout%2Fpro");

  const from = url.searchParams.get("from");
  const result = await createProCheckoutSession(user, { cancelPath: from ?? "/dashboard" });
  if (result.ok) {
    const res = NextResponse.redirect(result.url, 303);
    res.headers.set("Cache-Control", "private, no-store");
    return res;
  }
  if (result.reason === "already_pro") return redirect("/billing?already=pro");
  return redirect(`/pricing?checkout=${result.reason === "not_configured" ? "unavailable" : "error"}`);
}
