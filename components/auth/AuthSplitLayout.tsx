/**
 * AuthSplitLayout -- Reusable split-screen auth layout.
 *
 * Left side: brand panel with gradient background, logo, headline, value props.
 * Right side: Google OAuth button (primary) + email/password (secondary) +
 *             toggle between sign-in and sign-up.
 *
 * On mobile the left panel is hidden and a compact brand header is shown instead.
 *
 * Props:
 *   mode         -- "signup" | "signin"
 *   appName      -- display name shown in the UI
 *   brandColor   -- primary brand hex (used for CTA button, focus rings, links)
 *   leftPanelCopy -- { eyebrow, headline, headlineEmphasis, description, features }
 *   logo         -- optional ReactNode for the logo/icon; defaults to appName initial
 *   termsPath    -- path to Terms page (default "/terms")
 *   privacyPath  -- path to Privacy page (default "/privacy")
 *   signInPath   -- path to sign-in page (default "/sign-in")
 *   signUpPath   -- path to sign-up page (default "/sign-up")
 *   googleAuthPath -- path to Google OAuth endpoint (default "/api/auth/google")
 *   footerText   -- optional footer text for left panel
 *   emailConsent -- app name for email consent checkbox (sign-up only)
 *   children     -- optional extra content below the Google button (email/password form, etc.)
 */
import Link from "next/link";
import type { ReactNode, ComponentType } from "react";
import { ArrowLeft, type LucideProps } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

export interface LeftPanelFeature {
  Icon: ComponentType<LucideProps>;
  text: string;
}

export interface LeftPanelCopy {
  /** Small uppercase text above the headline (e.g. "Welcome back", "Free plan") */
  eyebrow: string;
  /** Main headline text */
  headline: string;
  /** Italic-emphasized portion of the headline */
  headlineEmphasis: string;
  /** Supporting paragraph below the headline */
  description: string;
  /** Value-prop bullet list */
  features: LeftPanelFeature[];
}

export interface AuthSplitLayoutProps {
  mode: "signup" | "signin";
  appName: string;
  brandColor: string;
  leftPanelCopy: LeftPanelCopy;
  logo?: ReactNode;
  termsPath?: string;
  privacyPath?: string;
  signInPath?: string;
  signUpPath?: string;
  googleAuthPath?: string;
  footerText?: string;
  emailConsent?: string;
  children?: ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Google logo SVG (full-color, 18x18)                               */
/* ------------------------------------------------------------------ */

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function AuthSplitLayout({
  mode,
  appName,
  brandColor,
  leftPanelCopy,
  logo,
  termsPath = "/terms",
  privacyPath = "/privacy",
  signInPath = "/sign-in",
  signUpPath = "/sign-up",
  googleAuthPath = "/api/auth/google",
  footerText,
  emailConsent,
  children,
}: AuthSplitLayoutProps) {
  const isSignUp = mode === "signup";
  const { eyebrow, headline, headlineEmphasis, description, features } = leftPanelCopy;

  return (
    <div
      className="min-h-screen grid lg:grid-cols-2"
      style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}
    >
      {/* ── Left: Marketing / Brand Panel ─────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col justify-between p-10 xl:p-14 text-white relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, var(--dl-brand-deep, #1E3352) 0%, var(--dl-brand-deep, #1E3352) 45%, ${brandColor} 100%)`,
        }}
      >
        {/* Ambient radial overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              `radial-gradient(ellipse at 0% 0%, ${brandColor}40 0%, transparent 55%), radial-gradient(ellipse at 100% 100%, rgba(30,51,82,0.15) 0%, transparent 50%)`,
          }}
        />

        {/* Logo */}
        <Link href="/" className="relative inline-flex items-center gap-2.5 group w-fit">
          {logo ?? (
            <span
              className="flex h-9 w-9 items-center justify-center rounded-lg text-white text-sm font-bold"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              {appName.charAt(0)}
            </span>
          )}
          <span className="text-base font-bold tracking-tight">{appName}</span>
        </Link>

        {/* Copy block */}
        <div className="relative">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-5"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            {eyebrow}
          </p>
          <h1
            className="text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight mb-4"
            style={{ color: "#FFFFFF" }}
          >
            {headline}{" "}
            <span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.9)" }}>
              {headlineEmphasis}
            </span>
          </h1>
          <p
            className="text-base leading-relaxed max-w-md"
            style={{ color: "rgba(255,255,255,0.78)" }}
          >
            {description}
          </p>

          <ul className="mt-8 space-y-3">
            {features.map(({ Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-3 text-sm"
                style={{ color: "rgba(255,255,255,0.85)" }}
              >
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

        {/* Footer */}
        <p className="relative text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
          {footerText
            ? footerText
            : <>&#169; {new Date().getFullYear()} {appName}</>}
        </p>
      </aside>

      {/* ── Right: Form Panel ─────────────────────────────────────── */}
      <main
        className="flex items-center justify-center px-4 py-10 sm:py-14 relative"
        aria-label={isSignUp ? "Create account" : "Sign in"}
      >
        {/* Back link */}
        <Link
          href="/"
          className="absolute left-4 top-4 sm:left-6 sm:top-6 inline-flex items-center gap-1.5 text-sm font-medium rounded-lg px-2 py-1 transition-colors hover:bg-[rgba(255,255,255,0.45)] focus-visible:outline-none focus-visible:ring-2"
          style={{
            color: "var(--dl-text-secondary, #454B5E)",
            // @ts-expect-error -- CSS custom property
            "--tw-ring-color": brandColor,
          }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>

        {/* Mobile-only brand header */}
        <div className="lg:hidden absolute left-1/2 -translate-x-1/2 top-5">
          <Link href="/" className="flex items-center gap-2">
            {logo ?? (
              <span
                className="flex h-7 w-7 items-center justify-center rounded-lg text-white text-xs font-bold"
                style={{ background: `linear-gradient(135deg, ${brandColor}, var(--dl-brand-deep, #1E3352))` }}
              >
                {appName.charAt(0)}
              </span>
            )}
            <span
              className="text-sm font-bold"
              style={{ color: "var(--dl-text-primary, #1B2030)" }}
            >
              {appName}
            </span>
          </Link>
        </div>

        {/* Card */}
        <div
          className="w-full max-w-sm rounded-2xl border p-6"
          style={{
            background: "var(--dl-bg-card, rgba(255,255,255,0.45))",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderColor: "var(--dl-border, rgba(0,0,0,0.06))",
          }}
        >
          <h2
            className="text-xl font-extrabold tracking-tight mb-1"
            style={{ color: "var(--dl-text-primary, #1B2030)" }}
          >
            {isSignUp ? "Create your account" : "Welcome back"}
          </h2>
          <p
            className="text-sm mb-6"
            style={{ color: "var(--dl-text-muted, #8890A5)" }}
          >
            {isSignUp
              ? "Get started in under 5 minutes"
              : "Sign in to continue to your dashboard"}
          </p>

          {/* Google OAuth -- primary action */}
          <a
            href={googleAuthPath}
            className="inline-flex items-center justify-center gap-3 w-full py-2.5 text-sm font-semibold text-white rounded-xl transition-colors"
            style={{ background: brandColor }}
          >
            <GoogleLogo />
            Continue with Google
          </a>

          {/* Optional extra content (email/password form, etc.) */}
          {children}

          {/* Email consent (sign-up only) */}
          {isSignUp && emailConsent && (
            <label className="mt-5 flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="mt-0.5 h-4 w-4 rounded border-gray-300"
                style={{ accentColor: brandColor }}
              />
              <span
                className="text-[11px] leading-relaxed"
                style={{ color: "var(--dl-text-muted, #5A6275)" }}
              >
                I agree to receive product emails, streak reminders, and weekly
                progress updates from {emailConsent}. You can unsubscribe anytime.
              </span>
            </label>
          )}

          {/* Mode toggle */}
          <p
            className="mt-6 text-center text-xs"
            style={{ color: "var(--dl-text-muted, #5A6275)" }}
          >
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <Link
                  href={signInPath}
                  className="font-semibold"
                  style={{ color: brandColor }}
                >
                  Sign in
                </Link>
              </>
            ) : (
              <>
                New here?{" "}
                <Link
                  href={signUpPath}
                  className="font-semibold"
                  style={{ color: brandColor }}
                >
                  Create an account
                </Link>
              </>
            )}
          </p>

          {/* Legal (sign-up only) */}
          {isSignUp && (
            <p
              className="mt-2 text-center text-[11px] leading-relaxed max-w-xs mx-auto"
              style={{ color: "var(--dl-text-muted, #5A6275)" }}
            >
              By creating an account you agree to our{" "}
              <Link href={termsPath} prefetch={false} className="underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href={privacyPath} prefetch={false} className="underline">
                Privacy Policy
              </Link>
              .
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
