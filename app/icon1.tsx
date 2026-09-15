import { ImageResponse } from "next/og";

export const runtime = "edge";
// 192x192 PWA icon — Android Add-to-Home-Screen + Chrome install prompt
export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon192() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 132,
          background: "linear-gradient(135deg, #4A6FA5 0%, #2E4A6E 50%, #1E3352 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFFFFF",
          fontWeight: 900,
          fontFamily: "Inter, system-ui, sans-serif",
          borderRadius: 36,
          letterSpacing: "-0.02em",
        }}
      >
        A
      </div>
    ),
    { ...size },
  );
}
