import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  // Cap inputs — without bounds, a crafted URL with a multi-KB title would
  // force the edge worker to render a giant SVG and balloon memory. The
  // visual area can't display more than ~120/240 chars anyway, so anything
  // beyond that is wasted layout work at best, DoS surface at worst.
  const customTitle = searchParams.get("title")?.slice(0, 120);
  const customSubtitle = searchParams.get("subtitle")?.slice(0, 240);
  const headline = customTitle || "Your Ivy League counselor, on demand.";
  const sub =
    customSubtitle ||
    "7-dimension AI profile scoring, essay feedback, and a real action plan — calibrated to top-school admit standards.";
  // Show pricing strip only when no custom title is provided (i.e. the
  // default homepage OG image). Dynamic per-page images (blog posts,
  // feature pages) should not display pricing.
  const showPricing = !customTitle;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          // Subtle gradient: brand-deep → primary, with a cooled-down
          // blue-grey overlay so text stays readable.
          background: "linear-gradient(145deg, #1E3352 0%, #2E4A6E 40%, #4A6FA5 100%)",
          // Vercel OG can't load custom .ttf at runtime. system-ui gives
          // us the platform sans-serif (SF Pro / Segoe / Roboto) which is
          // the closest to Inter without shipping the binary.
          fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
          position: "relative",
          padding: "72px 88px",
        }}
      >
        {/* Subtle dot-grid texture overlay for depth */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.15)",
              border: "2px solid rgba(255,255,255,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "34px",
              fontWeight: 900,
            }}
          >
            A
          </div>
          <span
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: "28px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase" as const,
            }}
          >
            AdmitPath
          </span>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
          <p
            style={{
              color: "#FFFFFF",
              fontSize: "72px",
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              margin: 0,
              maxWidth: "1000px",
              textShadow: "0 2px 24px rgba(0,0,0,0.2)",
            }}
          >
            {headline}
          </p>
          <p
            style={{
              color: "#D5DCE8",
              fontSize: "28px",
              marginTop: "24px",
              maxWidth: "880px",
              lineHeight: 1.4,
              fontWeight: 400,
            }}
          >
            {sub}
          </p>
        </div>

        {/* Pricing strip — only on homepage/default OG image */}
        {showPricing && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginTop: "40px",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1.5px solid rgba(255,255,255,0.3)",
                color: "white",
                padding: "10px 22px",
                borderRadius: "999px",
                fontSize: "20px",
                fontWeight: 700,
              }}
            >
              Start free
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1.5px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.85)",
                padding: "10px 22px",
                borderRadius: "999px",
                fontSize: "20px",
                fontWeight: 700,
              }}
            >
              Pro $19.99/mo
            </div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "18px", marginLeft: "auto" }}>
              Pro $19.99/mo
            </div>
          </div>
        )}

        {/* Decorative gradient bar — brand accent strip */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "6px",
            background: "linear-gradient(90deg, #D5DCE8 0%, #4A6FA5 50%, #D5DCE8 100%)",
          }}
        />

        {/* Top-right glow — subtle depth */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "999px",
            background: "radial-gradient(circle, rgba(74,111,165,0.25) 0%, transparent 70%)",
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        // OG images change rarely (per-page title/subtitle params). Cache
        // hard at the edge for 7 days, hold the stale copy for another
        // 7 days while revalidating in the background. Browsers still get
        // a 1-hour max-age because some social previews ignore stale-OK.
        "Cache-Control":
          "public, max-age=3600, s-maxage=604800, stale-while-revalidate=604800",
      },
    },
  );
}
