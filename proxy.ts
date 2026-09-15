import { type NextRequest, NextResponse } from "next/server";

/**
 * Apply security headers to a response. Defense-in-depth: these supplement
 * the headers set in next.config.js and cover vectors that Next.js does not
 * set by default on middleware-generated responses.
 */
function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "0");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=(), payment=()"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  const unsafeEval = process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";
  const upgradeInsecure = process.env.NODE_ENV === "production" ? "; upgrade-insecure-requests" : "";
  response.headers.set(
    "Content-Security-Policy",
    `default-src 'self'; script-src 'self' 'unsafe-inline'${unsafeEval} https://js.stripe.com https://challenges.cloudflare.com https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https: https://lh3.googleusercontent.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://accounts.google.com https://oauth2.googleapis.com https://api.stripe.com https://api.groq.com https://api.cerebras.ai https://*.neon.tech https://*.vercel-insights.com https://*.vercel-analytics.com; frame-src 'self' https://js.stripe.com https://challenges.cloudflare.com https://accounts.google.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'${upgradeInsecure}`,
  );
  return response;
}

/**
 * CSRF protection: verify the Origin header on state-mutating API requests.
 * Returns a 403 response if the origin is cross-site, or null to proceed.
 */
function checkCsrfOrigin(req: NextRequest): NextResponse | null {
  const method = req.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") return null;
  if (!req.nextUrl.pathname.startsWith("/api/")) return null;
  if (req.nextUrl.pathname === "/api/stripe/webhook" || req.nextUrl.pathname.startsWith("/api/webhooks/")) return null;
  if (req.nextUrl.pathname.startsWith("/api/cron/")) return null;

  if (req.headers.get("sec-fetch-site") === "cross-site") {
    return NextResponse.json(
      { error: "Forbidden: cross-origin request rejected" },
      { status: 403 },
    );
  }

  const origin = req.headers.get("origin");
  if (!origin) return null;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;
  const allowed: string[] = [
    "http://localhost:3000",
    "https://admith.vercel.app",
    req.nextUrl.origin.replace(/\/$/, ""),
  ];
  if (appUrl) allowed.push(appUrl.replace(/\/$/, ""));
  if (vercelUrl) allowed.push(vercelUrl.replace(/\/$/, ""));

  const normalized = origin.replace(/\/$/, "");
  if (allowed.some((a) => normalized === a)) return null;

  return NextResponse.json(
    { error: "Forbidden: cross-origin request rejected" },
    { status: 403 }
  );
}

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  if (pathname === "/worksheets" || pathname.startsWith("/worksheets/")) {
    const target = req.nextUrl.clone();
    target.pathname = pathname.replace(/^\/worksheets/, "/tools");
    return applySecurityHeaders(NextResponse.redirect(target, 308));
  }

  // CSRF check on state-mutating API routes
  const csrfBlock = checkCsrfOrigin(req);
  if (csrfBlock) return csrfBlock;

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-admitpath-return-to", `${req.nextUrl.pathname}${req.nextUrl.search}`);
  const res = NextResponse.next({ request: { headers: requestHeaders } });
  applySecurityHeaders(res);
  return res;
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
