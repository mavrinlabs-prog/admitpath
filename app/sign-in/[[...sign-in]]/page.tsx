/**
 * Sign-in. Split-screen on desktop: marketing panel on the left to keep
 * the user anchored in product context; Clerk widget on the right. On mobile
 * we collapse to a single column with a compact brand header.
 */
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, BarChart3, Sparkles, ShieldCheck } from "lucide-react";
import { LogoMark } from "@/components/admitpath-logo";
import { safeRelativeRedirect } from "@/lib/safe-redirect";
import { GoogleOAuthButton } from "@/components/google-oauth-button";


const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://admith.vercel.app";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to AdmitPath to access your college admissions dashboard, profile scores, essay feedback, and college list.",
  alternates: { canonical: "/sign-in" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Sign In",
    description:
      "Sign in to AdmitPath to access your college admissions dashboard, profile scores, essay feedback, and college list.",
    url: `${APP_URL}/sign-in`,
    siteName: "AdmitPath",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${APP_URL}/api/og?title=Sign+In&subtitle=College+admissions+counseling`,
        width: 1200,
        height: 630,
        alt: "AdmitPath sign-in — college admissions counseling.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@admitpath",
    title: "Sign In",
    description: "Sign in to your AdmitPath dashboard.",
    images: [
      {
        url: `${APP_URL}/api/og?title=Sign+In&subtitle=College+admissions+counseling`,
        alt: "AdmitPath sign-in.",
      },
    ],
  },
};

// Clerk removed — using Google OAuth

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{
    redirect?: string;
    redirect_url?: string;
    forceRedirectUrl?: string;
    error?: string;
    message?: string;
  }>;
}) {
  const sp = await searchParams;
  const candidate =
    sp.forceRedirectUrl ?? sp.redirect_url ?? sp.redirect ?? "";
  // Open-redirect guard: only allow same-origin absolute paths. The `//` /
  // `/\` checks both block protocol-relative URLs — Chrome/Firefox normalize
  // backslashes to forward slashes when parsing redirect targets, so
  // `/\evil.com` would otherwise resolve to `//evil.com` and bounce off-site.
  const forceRedirect = safeRelativeRedirect(candidate);
  const signUpHref = forceRedirect
    ? `/sign-up?redirect_url=${encodeURIComponent(forceRedirect)}`
    : "/sign-up";
  const authErrorMessages: Record<string, string> = {
    device_locked: "Another account is already signed in in this browser. Sign out first, then choose a different account.",
    account_sync_failed: "We could not safely finish syncing your account. No session was created. Please try again in a moment.",
    rate_limited: "Too many sign-in attempts were received. Wait a minute and try again.",
    invalid_state: "That sign-in request expired or could not be verified. Start the sign-in process again.",
    token_failed: "Google could not complete the sign-in exchange. Please try again.",
    userinfo_failed: "Google signed you in, but your account details could not be loaded. Please try again.",
    userinfo_invalid: "Google returned an incomplete account response. Please try another account or contact support.",
    consent_denied: "Google sign-in was canceled. No account changes were made.",
  };
  const errorMessage = sp.error
    ? authErrorMessages[sp.error] ?? "Sign-in could not be completed. Please try again."
    : null;
  return (
    <div className="min-h-screen grid md:grid-cols-2" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      {/* Marketing panel */}
      <aside
        className="hidden md:flex flex-col justify-between p-10 lg:p-14 text-white relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--dl-brand-deep, #1E3352) 0%, var(--dl-brand-deep, #1E3352) 45%, var(--dl-brand, #4A6FA5) 100%)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 0% 0%, rgba(74,111,165,0.25) 0%, transparent 55%), radial-gradient(ellipse at 100% 100%, rgba(30,51,82,0.15) 0%, transparent 50%)",
          }}
        />

        <Link href="/" className="relative inline-flex items-center gap-2.5 group w-fit">
          <LogoMark size={36} colors={{ from: "rgba(255,255,255,0.20)", to: "rgba(255,255,255,0.05)" }} />
          <span className="text-base font-bold tracking-tight">
            AdmitPath
          </span>
        </Link>

        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: "rgba(255,255,255,0.65)" }}>
            Welcome back
          </p>
          <h1
            className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight mb-4"
            style={{ color: "#FFFFFF" }}
          >
            Pick up where{" "}
            <span
              style={{
                fontStyle: "italic",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              you left off.
            </span>
          </h1>
          <p className="text-base leading-relaxed max-w-md" style={{ color: "rgba(255,255,255,0.78)" }}>
            Your scores, action plan, and essay drafts are saved and ready. Sign in to
            keep building toward your target schools.
          </p>

          <ul className="mt-8 space-y-3">
            {[
              { Icon: BarChart3,   text: "Your 7-dimension profile score, updated" },
              { Icon: Sparkles,    text: "Essay feedback and counselor chat history" },
              { Icon: ShieldCheck, text: "Encrypted in transit with clear privacy controls" },
            ].map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: "rgba(255,255,255,0.12)" }}
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
          &copy; {new Date().getFullYear()} AdmitPath · Built with care.
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center px-4 py-10 sm:py-14 relative" aria-label="Sign in">
        <Link
          href="/"
          className="absolute left-4 top-4 sm:left-6 sm:top-6 inline-flex items-center gap-1.5 text-sm font-medium rounded-lg px-2 py-1 transition-colors hover:bg-[rgba(255,255,255,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A6FA5]"
          style={{ color: "var(--dl-text-secondary, #454B5E)" }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>

        {/* Mobile-only brand header */}
        <div className="md:hidden absolute left-1/2 -translate-x-1/2 top-5">
          <Link href="/" className="flex items-center gap-2">
            <LogoMark size={28} />
            <span className="text-sm font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              AdmitPath
            </span>
          </Link>
        </div>

        <div
          className="w-full max-w-sm rounded-2xl border p-6"
          style={{ background: "var(--dl-bg-card, rgba(255,255,255,0.45))", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderColor: "var(--dl-border, rgba(0,0,0,0.06))" }}
        >
          <h2 className="text-xl font-extrabold tracking-tight mb-1" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Welcome back</h2>
          <p className="text-sm mb-6" style={{ color: "var(--dl-text-muted, #8890A5)" }}>Sign in to continue to your dashboard</p>
          {errorMessage && (
            <div
              role="alert"
              className="mb-5 rounded-xl border px-4 py-3 text-sm leading-relaxed"
              style={{
                background: "rgba(180, 83, 9, 0.08)",
                borderColor: "rgba(180, 83, 9, 0.28)",
                color: "#92400E",
              }}
            >
              {errorMessage}
            </div>
          )}
          <GoogleOAuthButton returnTo={forceRedirect}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </GoogleOAuthButton>

          <p className="mt-6 text-center text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            New here?{" "}
            <Link href={signUpHref} className="font-semibold underline-animate" style={{ color: "var(--dl-brand, #4A6FA5)" }}>
              Create an account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
