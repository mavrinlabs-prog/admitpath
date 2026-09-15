"use client";

import { useState } from "react";
import Image from "next/image";
import { logoUrl, localLogoPath, monogramFor } from "@/data/colleges";

/**
 * 3-tier college logo: Clearbit → local SVG → monogram badge.
 *
 * Why three tiers:
 * 1. **Clearbit** is free, fast, and covers the common name → domain
 *    mappings (harvard.edu, yale.edu, mit.edu...). Fails for newer or less
 *    web-canonical schools.
 * 2. **Local SVG fallback** at `/public/colleges/<slug>.svg` lets us
 *    explicitly ship official logos for the schools Clearbit gets wrong
 *    or for schools where the brand-asset license requires a local copy.
 * 3. **Monogram badge** is a guaranteed-render letter mark in primary blue
 *    — never a broken image — for the long tail.
 *
 * The component starts at tier 1 and walks down on each `onError` event.
 * Each tier is a single `<img>` swap; no Suspense, no shimmer, no layout
 * shift (the surrounding wrapper holds the size).
 */
export function CollegeLogo({
  name,
  domain,
  slug,
  size = 40,
  rounded = true,
  className,
}: {
  name: string;
  domain?: string;
  slug?: string;
  size?: number;
  rounded?: boolean;
  className?: string;
}) {
  const [tier, setTier] = useState<1 | 2 | 3>(domain ? 1 : slug ? 2 : 3);

  const radius = rounded ? "9999px" : "8px";
  const wrapperStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: radius,
    background: tier === 3 ? "rgba(74,111,165,0.08)" : "rgba(255,255,255,0.45)",
    border: "1px solid rgba(0,0,0,0.06)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
  };

  if (tier === 1 && domain) {
    return (
      <span style={wrapperStyle} className={className}>
        <Image
          src={logoUrl(domain, size * 2)}
          alt={`${name} logo`}
          width={size}
          height={size}
          loading="lazy"
          unoptimized
          style={{ objectFit: "contain", width: "100%", height: "100%" }}
          onError={() => setTier(slug ? 2 : 3)}
        />
      </span>
    );
  }

  if (tier === 2 && slug) {
    return (
      <span style={wrapperStyle} className={className}>
        <Image
          src={localLogoPath(slug)}
          alt={`${name} logo`}
          width={size}
          height={size}
          loading="lazy"
          unoptimized
          style={{ objectFit: "contain", width: "100%", height: "100%" }}
          onError={() => setTier(3)}
        />
      </span>
    );
  }

  // Monogram fallback — guaranteed-render. Sized to ~38% of wrapper so the
  // letter feels weighted, not lonely.
  return (
    <span style={wrapperStyle} className={className}>
      <span
        style={{
          fontSize: size * 0.38,
          fontWeight: 700,
          color: "#4A6FA5",
          letterSpacing: "-0.02em",
        }}
      >
        {monogramFor(name)}
      </span>
    </span>
  );
}
