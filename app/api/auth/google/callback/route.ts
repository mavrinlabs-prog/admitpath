import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { rateLimitWindow } from "@/lib/rate-limit";
import { SESSION_MAX_AGE_SECONDS, encodeSessionCookie, parseSessionCookieValue, type SessionUser } from "@/lib/session-cookie";
import { safeRelativeRedirect } from "@/lib/safe-redirect";
import { getAppBaseUrl } from "@/lib/app-url";
import { recordOAuthReferral } from "@/lib/oauth-referral";

/** Strip UTF-8 BOM and whitespace that can leak from env var editors */
function cleanEnv(value: string | undefined): string | undefined {
  return value?.replace(/^\uFEFF/, "").trim() || undefined;
}

export async function GET(req: NextRequest) {
  // Rate limit: 10 requests per minute per IP on auth callback
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? req.headers.get("x-real-ip")
    ?? "unknown";
  const baseUrl = getAppBaseUrl();
  if (!(await rateLimitWindow(`auth:callback:${ip}`, 10, 60_000)).allowed) {
    return NextResponse.redirect(new URL("/sign-in?error=rate_limited", baseUrl));
  }
  const cookieStore = await cookies();

  // (a) User denied consent â€” Google redirects with ?error=access_denied
  const oauthError = req.nextUrl.searchParams.get("error");
  if (oauthError) {
    cookieStore.delete("oauth_state");
    cookieStore.delete("oauth_return_to");
    cookieStore.delete("oauth_email_consent");
    console.warn("[auth/google/callback] OAuth provider rejected sign-in", { code: oauthError });
    // access_denied = user clicked "Cancel" on consent screen
    if (oauthError === "access_denied") {
      return NextResponse.redirect(new URL("/sign-in?error=consent_denied", baseUrl));
    }
    return NextResponse.redirect(new URL(`/sign-in?error=${encodeURIComponent(oauthError)}`, baseUrl));
  }

  // (b) Validate state parameter to prevent login CSRF.
  const state = req.nextUrl.searchParams.get("state");
  const expectedState = cookieStore.get("oauth_state")?.value;
  if (!expectedState || !state || state !== expectedState) {
    console.error("[auth/google/callback] Missing or mismatched OAuth state");
    return NextResponse.redirect(new URL("/sign-in?error=invalid_state", baseUrl));
  }
  cookieStore.delete("oauth_state");
  const returnTo = safeRelativeRedirect(cookieStore.get("oauth_return_to")?.value);
  const emailConsent = cookieStore.get("oauth_email_consent")?.value === "1";
  const referralCode = cookieStore.get("ref")?.value;
  cookieStore.delete("oauth_return_to");
  cookieStore.delete("oauth_email_consent");

  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(new URL("/sign-in?error=no_code", baseUrl));
  }

  const clientId = cleanEnv(process.env.GOOGLE_CLIENT_ID);
  const clientSecret = cleanEnv(process.env.GOOGLE_CLIENT_SECRET);
  const redirectUri = `${baseUrl.replace(/\/$/, "")}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/sign-in?error=not_configured", baseUrl));
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal: AbortSignal.timeout(15_000),
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      console.error("[auth/google/callback] Token exchange failed:", {
        status: tokenRes.status,
      });
      return NextResponse.redirect(new URL("/sign-in?error=token_failed", baseUrl));
    }

    const tokens = await tokenRes.json() as { access_token?: unknown };
    if (typeof tokens.access_token !== "string" || !tokens.access_token) {
      return NextResponse.redirect(new URL("/sign-in?error=token_failed", baseUrl));
    }

    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
      signal: AbortSignal.timeout(15_000),
    });

    if (!userInfoRes.ok) {
      return NextResponse.redirect(new URL("/sign-in?error=userinfo_failed", baseUrl));
    }

    const userInfo = await userInfoRes.json() as {
      id?: unknown;
      email?: unknown;
      name?: unknown;
      picture?: unknown;
    };
    if (typeof userInfo.id !== "string" || typeof userInfo.email !== "string") {
      console.error("[auth/google/callback] Google user info was missing a stable id or email");
      return NextResponse.redirect(new URL("/sign-in?error=userinfo_invalid", baseUrl));
    }
    const userName = typeof userInfo.name === "string" ? userInfo.name : null;
    const avatarUrl = typeof userInfo.picture === "string" ? userInfo.picture : null;

    // â”€â”€ Multi-account prevention â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // If a session cookie already exists for a DIFFERENT user, reject.
    // One device = one account. This prevents account-hopping.
    // Note: cookieStore was already obtained above for state/CSRF checks.
    try {
      const existingSession = cookieStore.get("session_user")?.value
        ?? cookieStore.get("session")?.value;
      if (existingSession) {
        const existingData = parseSessionCookieValue(existingSession);

        const sameEmail = existingData?.email.toLowerCase() === userInfo.email.toLowerCase();
        if (existingData?.id && existingData.id !== userInfo.id && !sameEmail) {
          console.warn("[auth/google/callback] Blocked browser account switch without sign-out");
          return NextResponse.redirect(
            new URL("/sign-in?error=device_locked", baseUrl),
          );
        }
      }
    } catch {
      // Non-fatal: if cookie parsing fails, allow sign-in
    }

    // Upsert user in DB and determine redirect.
    // Prevent multiple accounts: if email already exists, sign into THAT account.
    let destination = returnTo ?? "/dashboard";
    let resolvedUserId: string;
    try {
      const { prisma } = await import("@/lib/prisma");
      // Case-insensitive email comparison â€” Google can return mixed-case
      const emailLower = (userInfo.email ?? "").toLowerCase();
      const isAutoPro = (process.env.INTERNAL_PRO_EMAILS ?? "")
        .split(",")
        .some((email) => email.trim().toLowerCase() === emailLower);
      const consentedAt = emailConsent ? new Date() : null;

      // Check if an account with this email already exists (prevents duplicates)
      const existingByEmail = await prisma.user.findUnique({ where: { email: emailLower } });
      const userId = existingByEmail ? existingByEmail.id : userInfo.id;
      resolvedUserId = userId;

      await prisma.user.upsert({
        where: { id: userId },
        update: {
          email: emailLower,
          name: userName,
          avatarUrl,
          ...(emailConsent ? { emailConsent: true, emailConsentAt: consentedAt } : {}),
          ...(isAutoPro ? { plan: "pro", isInternal: true } : {}),
        },
        create: {
          id: userId,
          email: emailLower,
          name: userName,
          avatarUrl,
          plan: isAutoPro ? "pro" : "free",
          isInternal: isAutoPro,
          emailConsent,
          emailConsentAt: consentedAt,
        },
      });

      if (!existingByEmail && referralCode) {
        const referralResult = await recordOAuthReferral(userId, referralCode);
        if (referralResult.status === "failed") {
          console.warn("[auth/google/callback] Referral attribution temporarily failed");
        }
      }
      cookieStore.delete("ref");

      const profile = await prisma.profile.findUnique({
        where: { userId },
        select: { id: true },
      });
      if (!profile) {
        destination = returnTo
          ? `/profile/create?redirect_url=${encodeURIComponent(returnTo)}`
          : "/profile/create";
      }
    } catch (dbErr) {
      console.error("[auth/google/callback] DB upsert failed", {
        name: dbErr instanceof Error ? dbErr.name : "UnknownError",
      });
      return NextResponse.redirect(new URL("/sign-in?error=account_sync_failed", baseUrl));
    }

    const sessionUser: SessionUser = {
      id: resolvedUserId,
      email: userInfo.email,
      name: typeof userInfo.name === "string" ? userInfo.name : undefined,
      picture: typeof userInfo.picture === "string" ? userInfo.picture : undefined,
    };
    const sessionData = encodeSessionCookie(sessionUser);
    const sessionOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    };
    cookieStore.set("session", sessionData, sessionOptions);
    cookieStore.set("session_user", sessionData, sessionOptions);

    return NextResponse.redirect(new URL(destination, baseUrl));
  } catch (err) {
    console.error("[auth/google/callback] Unhandled error", {
      name: err instanceof Error ? err.name : "UnknownError",
    });
    return NextResponse.redirect(new URL("/sign-in?error=unknown", baseUrl));
  }
}
