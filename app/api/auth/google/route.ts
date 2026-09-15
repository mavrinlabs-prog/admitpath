import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getAppBaseUrl } from "@/lib/app-url";
import { rateLimitWindow, getClientIp } from "@/lib/rate-limit";
import { safeRelativeRedirect } from "@/lib/safe-redirect";

function cleanEnv(value: string | undefined): string | undefined {
  return value?.replace(/^\uFEFF/, "").trim() || undefined;
}

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  if (!(await rateLimitWindow(`auth:start:${ip}`, 10, 60_000)).allowed) {
    return NextResponse.redirect(new URL("/sign-in?error=rate_limited", getAppBaseUrl()));
  }

  const clientId = cleanEnv(process.env.GOOGLE_CLIENT_ID);
  if (!clientId) {
    return NextResponse.json(
      { error: "Google sign-in is temporarily unavailable." },
      { status: 503 },
    );
  }

  const baseUrl = getAppBaseUrl();
  const state = randomBytes(32).toString("base64url");
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${baseUrl}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account",
    state,
  });
  const response = NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 10 * 60,
  };
  response.cookies.set("oauth_state", state, cookieOptions);

  const returnTo = safeRelativeRedirect(req.nextUrl.searchParams.get("redirect_url"));
  if (returnTo) response.cookies.set("oauth_return_to", returnTo, cookieOptions);
  else response.cookies.delete("oauth_return_to");
  response.cookies.set(
    "oauth_email_consent",
    req.nextUrl.searchParams.get("email_consent") === "1" ? "1" : "0",
    cookieOptions,
  );
  return response;
}
