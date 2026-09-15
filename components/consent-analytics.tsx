"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { hasAnalyticsConsent } from "@/components/cookie-banner";

/**
 * Renders Vercel Analytics and SpeedInsights only after the user
 * has explicitly accepted non-essential cookies via the CookieBanner.
 *
 * Listens for the custom "cookie-consent-change" event so it can
 * activate immediately when consent is granted, without a page reload.
 */
export function ConsentAnalytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    // Check on mount
    setConsented(hasAnalyticsConsent());

    // Re-check when consent changes (fired by CookieBanner)
    function onConsentChange() {
      setConsented(hasAnalyticsConsent());
    }

    window.addEventListener("cookie-consent-change", onConsentChange);
    return () =>
      window.removeEventListener("cookie-consent-change", onConsentChange);
  }, []);

  if (!consented) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
