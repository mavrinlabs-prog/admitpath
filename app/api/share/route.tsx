import { ImageResponse } from "next/og";

export const runtime = "edge";

/**
 * Share card OG image — generates a branded score card for social sharing.
 *
 * URL: /api/share?score=82&spike=90&academic=75&leadership=70&awards=85&depth=65&essay=78&recs=80&name=John&sig=<hmac>
 *
 * Uses the same next/og ImageResponse pattern as /api/og. The card shows the
 * student's overall score, a 7-dimension bar breakdown, and a CTA to drive
 * viral signups. Brand-blue gradient background per DL design system.
 *
 * The `sig` parameter is an HMAC-SHA256 signature that prevents fabricated
 * score cards. When SHARE_HMAC_SECRET is set, requests without a valid
 * signature are rejected. When not set (dev), the route works without auth.
 */

async function verifySignature(params: URLSearchParams): Promise<boolean> {
  // Edge runtime: process.env is available as a global in Vercel/Next.js edge
  const secret = typeof process !== "undefined"
    ? (process.env as Record<string, string | undefined>).SHARE_HMAC_SECRET
    : undefined;
  if (!secret) return true; // No secret configured — allow (dev mode)

  const sig = params.get("sig");
  if (!sig) return false;

  // Build the message from all score params (alphabetical, excluding sig)
  const keys = ["academic", "awards", "depth", "essay", "leadership", "name", "recs", "score", "spike"];
  const message = keys.map((k) => `${k}=${params.get(k) || ""}`).join("&");

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const expected = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(message)));
  // Compare hex
  const expectedHex = Array.from(expected).map((b) => b.toString(16).padStart(2, "0")).join("");
  return sig === expectedHex;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // Verify HMAC signature to prevent fabricated score cards
  const valid = await verifySignature(searchParams);
  if (!valid) {
    return new Response("Invalid or missing signature", { status: 403 });
  }

  // Cap all inputs to prevent DoS via crafted URLs
  const name = (searchParams.get("name") || "Student").slice(0, 30);
  const score = Math.min(100, Math.max(0, parseInt(searchParams.get("score") || "0", 10)));
  const spike = Math.min(100, Math.max(0, parseInt(searchParams.get("spike") || "0", 10)));
  const academic = Math.min(100, Math.max(0, parseInt(searchParams.get("academic") || "0", 10)));
  const leadership = Math.min(100, Math.max(0, parseInt(searchParams.get("leadership") || "0", 10)));
  const awards = Math.min(100, Math.max(0, parseInt(searchParams.get("awards") || "0", 10)));
  const depth = Math.min(100, Math.max(0, parseInt(searchParams.get("depth") || "0", 10)));
  const essay = Math.min(100, Math.max(0, parseInt(searchParams.get("essay") || "0", 10)));
  const recs = Math.min(100, Math.max(0, parseInt(searchParams.get("recs") || "0", 10)));

  const dimensions = [
    { label: "Academic Rigor", value: academic },
    { label: "Spike", value: spike },
    { label: "Awards", value: awards },
    { label: "Leadership", value: leadership },
    { label: "Activity Depth", value: depth },
    { label: "Essay Quality", value: essay },
    { label: "Recommendations", value: recs },
  ];

  // Score tier label
  const tierLabel =
    score >= 90 ? "Outstanding" :
    score >= 80 ? "Very Strong" :
    score >= 70 ? "Strong" :
    score >= 60 ? "Competitive" :
    score >= 50 ? "Developing" : "Getting Started";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(145deg, #1E3352 0%, #2E4A6E 40%, #4A6FA5 100%)",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
          position: "relative",
          padding: "48px 64px",
        }}
      >
        {/* Dot-grid texture */}
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

        {/* Top-right glow */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-60px",
            width: "350px",
            height: "350px",
            borderRadius: "999px",
            background: "radial-gradient(circle, rgba(74,111,165,0.30) 0%, transparent 70%)",
          }}
        />

        {/* Header: logo + name */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.15)",
                border: "2px solid rgba(255,255,255,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "26px",
                fontWeight: 900,
              }}
            >
              A
            </div>
            <span
              style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: "22px",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase" as const,
              }}
            >
              AdmitPath
            </span>
          </div>
          <span
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "16px",
              fontWeight: 500,
            }}
          >
            {name}&apos;s Profile Score
          </span>
        </div>

        {/* Main content: Score + Dimensions */}
        <div style={{ display: "flex", flex: 1, gap: "48px", marginTop: "32px" }}>
          {/* Left: Big score */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "320px",
              flexShrink: 0,
            }}
          >
            {/* Score circle */}
            <div
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.08)",
                border: "4px solid rgba(255,255,255,0.20)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: "80px",
                  fontWeight: 900,
                  color: "white",
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                }}
              >
                {score}
              </span>
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.6)",
                  marginTop: "4px",
                }}
              >
                out of 100
              </span>
            </div>
            <span
              style={{
                marginTop: "16px",
                fontSize: "20px",
                fontWeight: 700,
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "0.02em",
              }}
            >
              {tierLabel}
            </span>
          </div>

          {/* Right: 7-dimension bars */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              gap: "14px",
              justifyContent: "center",
            }}
          >
            {dimensions.map((dim) => (
              <div
                key={dim.label}
                style={{ display: "flex", alignItems: "center", gap: "14px" }}
              >
                <span
                  style={{
                    width: "140px",
                    flexShrink: 0,
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.7)",
                    textAlign: "right" as const,
                  }}
                >
                  {dim.label}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: "14px",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.10)",
                    overflow: "hidden",
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      width: `${dim.value}%`,
                      height: "100%",
                      borderRadius: "999px",
                      background: "linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,0.9))",
                    }}
                  />
                </div>
                <span
                  style={{
                    width: "32px",
                    flexShrink: 0,
                    fontSize: "15px",
                    fontWeight: 800,
                    color: "white",
                  }}
                >
                  {dim.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <span
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "rgba(255,255,255,0.9)",
            }}
          >
            Get your free score at admith.vercel.app
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,255,255,0.15)",
              border: "1.5px solid rgba(255,255,255,0.3)",
              padding: "8px 20px",
              borderRadius: "999px",
              color: "white",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            Start free — 102 schools analyzed
          </div>
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "5px",
            background: "linear-gradient(90deg, #D5DCE8 0%, #4A6FA5 50%, #D5DCE8 100%)",
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control":
          "public, max-age=3600, s-maxage=604800, stale-while-revalidate=604800",
      },
    },
  );
}
