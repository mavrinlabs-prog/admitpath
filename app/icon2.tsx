import { ImageResponse } from "next/og";

export const runtime = "edge";
// 512x512 PWA icon — large install prompt + Android splash screen
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon512() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 352,
          background: "linear-gradient(135deg, #4A6FA5 0%, #2E4A6E 50%, #1E3352 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFFFFF",
          fontWeight: 900,
          fontFamily: "Inter, system-ui, sans-serif",
          borderRadius: 96,
          letterSpacing: "-0.02em",
        }}
      >
        A
      </div>
    ),
    { ...size },
  );
}
