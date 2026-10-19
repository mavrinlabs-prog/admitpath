import { NextResponse } from "next/server";
import { rateLimitAPI, getClientIp } from "@/lib/rate-limit";
import { requireUser, parseJsonBody } from "@/lib/api-helpers";
import { getAppUrl } from "@/lib/app-url";
import { createProCheckoutSession } from "@/lib/checkout";
import { checkoutRequestSchema } from "@/lib/billing-contract";

/**
 * GET /api/stripe/create-checkout - redirect to /pricing instead of returning
 * a bare error page on browser navigation.
 */
export function GET() {
  return NextResponse.redirect(getAppUrl("/pricing"));
}

export async function POST(req: Request) {
  let authed: Awaited<ReturnType<typeof requireUser>>;
  try {
    authed = await requireUser();
  } catch (err) {
    console.error("[stripe/create-checkout] requireUser threw unexpectedly:", err);
    console.error("[stripe/create-checkout] Missing env:", {
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
      STRIPE_PRICE_PRO: !!process.env.STRIPE_PRICE_PRO,
    });
    return NextResponse.json(
      { error: "Authentication service unavailable. Please try again." },
      { status: 503 },
    );
  }
  if ("response" in authed) return authed.response;
  const { userId } = authed;

  const rl = await rateLimitAPI(`checkout:${userId}:${getClientIp(req)}`);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many checkout attempts. Try again in a minute." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  const parsedBody = await parseJsonBody(req, checkoutRequestSchema);
  if ("response" in parsedBody) return parsedBody.response;

  const user = authed.user as typeof authed.user & { email?: string | null; stripeCustomerId?: string | null };
  const result = await createProCheckoutSession({ ...user, id: userId });
  if (result.ok) return NextResponse.json({ url: result.url, discountApplied: result.discountApplied });
  if (result.reason === "already_pro") {
    return NextResponse.json(
      { error: result.message, reason: "already_pro", billingUrl: "/billing" },
      { status: 409 },
    );
  }
  return NextResponse.json(
    { error: result.message, reason: result.reason },
    { status: result.reason === "not_configured" ? 503 : 502 },
  );
}
