import { ImageResponse } from "next/og";

export const runtime = "edge";
// 180x180 Apple touch icon — no border-radius (iOS applies its own mask)
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 120,
          background: "linear-gradient(135deg, #4A6FA5 0%, #2E4A6E 50%, #1E3352 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFFFFF",
          fontWeight: 900,
          fontFamily: "Inter, system-ui, sans-serif",
          letterSpacing: "-0.04em",
        }}
      >
        A
      </div>
    ),
    { ...size },
  );
}
