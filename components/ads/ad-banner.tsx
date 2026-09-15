"use client";

/**
 * AdSense placeholder for free-tier users.
 *
 * Renders a minimal placeholder div that can be swapped for a real
 * Google AdSense unit later. The `slot` prop maps to `data-ad-slot`
 * and the `format` prop maps to `data-ad-format` so the transition
 * to production ads is a one-line change in the layout.
 *
 * Usage:
 *   <AdBanner slot="landing-top" format="horizontal" />
 */

interface AdBannerProps {
  /** Ad slot identifier (maps to data-ad-slot when AdSense goes live). */
  slot?: string;
  /** Ad format hint: horizontal, rectangle, or vertical. */
  format?: "horizontal" | "rectangle" | "vertical";
  /** Optional extra class names. */
  className?: string;
}

const FORMAT_HEIGHTS: Record<string, string> = {
  horizontal: "90px",
  rectangle: "250px",
  vertical: "600px",
};

export function AdBanner({
  slot = "default",
  format = "horizontal",
  className = "",
}: AdBannerProps) {
  // TODO: Replace with real AdSense script + ins element once
  // Google approves the publisher ID. For now, render a silent
  // placeholder that reserves the layout space.
  //
  // To activate:
  // 1. Set NEXT_PUBLIC_ADSENSE_CLIENT in .env
  // 2. Add the AdSense <script> tag in layout.tsx <head>
  // 3. Replace this div with:
  //    <ins className="adsbygoogle" data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
  //         data-ad-slot={slot} data-ad-format={format} style={{display:"block"}} />
  //    <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>

  return (
    <div
      data-ad-slot={slot}
      data-ad-format={format}
      aria-hidden="true"
      className={`w-full overflow-hidden ${className}`}
      style={{
        minHeight: FORMAT_HEIGHTS[format] ?? "90px",
        // Invisible by default so it doesn't show an empty box.
        // Remove display:none when real ads are configured.
        display: "none",
      }}
    />
  );
}
