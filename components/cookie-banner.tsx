"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "ap_cookie_consent";

/** Possible consent values stored in localStorage */
export type CookieConsent = "accepted" | "declined" | null;

/**
 * Read the user's cookie consent choice from localStorage.
 * Returns null if no choice has been made yet.
 */
export function getCookieConsent(): CookieConsent {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === "accepted" || v === "declined") return v;
    return null;
  } catch {
    return null;
  }
}

/**
 * Returns true only when the user has explicitly accepted non-essential cookies.
 * Use this to gate analytics/tracking scripts.
 */
export function hasAnalyticsConsent(): boolean {
  return getCookieConsent() === "accepted";
}

/**
 * Cookie consent banner with explicit Accept / Decline.
 * Non-essential tracking (Vercel Analytics, SpeedInsights) must not fire
 * until the user clicks Accept.
 */
export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = getCookieConsent();
    if (!consent) setShow(true);
  }, []);

  function handleChoice(choice: "accepted" | "declined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // localStorage unavailable
    }
    setShow(false);
    // Force a re-render of the analytics gate by dispatching a storage event
    window.dispatchEvent(new Event("cookie-consent-change"));
  }

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50"
    >
      <div
        className="rounded-lg border px-3 py-2 flex items-center gap-3"
        style={{
          background: "var(--dl-bg-white, #fff)",
          borderColor: "rgba(0,0,0,0.06)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        <p
          className="text-xs leading-snug flex-1 min-w-0"
          style={{ color: "var(--dl-text-secondary, #454B5E)" }}
        >
          We use cookies for sign-in and analytics.{" "}
          <Link
            href="/privacy"
            prefetch={false}
            className="underline underline-offset-2 hover:opacity-80"
            style={{ color: "var(--dl-brand, #4A6FA5)" }}
          >
            Privacy policy
          </Link>
        </p>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => handleChoice("declined")}
            className="shrink-0 rounded-md border text-xs font-medium px-2.5 py-1 transition-colors"
            style={{
              borderColor: "rgba(0,0,0,0.10)",
              color: "var(--dl-text-secondary, #454B5E)",
            }}
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => handleChoice("accepted")}
            className="shrink-0 rounded-md text-white text-xs font-semibold px-2.5 py-1 transition-colors"
            style={{
              background: "var(--dl-brand, #4A6FA5)",
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
