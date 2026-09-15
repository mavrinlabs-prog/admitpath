import { type NextRequest, NextResponse } from "next/server";
import { isValidReferralCode } from "@/lib/referral-code";

const REFERRAL_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

/**
 * Capture a referral code on the redirect response so no Server Component
 * attempts to mutate request cookies.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const destination = request.nextUrl.clone();

  if (!isValidReferralCode(code)) {
    destination.pathname = "/";
    destination.search = "";
    return NextResponse.redirect(destination, 307);
  }

  destination.pathname = "/sign-up";
  destination.search = "";
  destination.searchParams.set("ref", code);

  const response = NextResponse.redirect(destination, 307);
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.cookies.set({
    name: "ref",
    value: code,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: REFERRAL_COOKIE_MAX_AGE_SECONDS,
  });

  return response;
}
