import { ImageResponse } from "next/og";

export const runtime = "edge";
// 32x32 favicon — DL brand gradient with bold "A"
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 22,
          background: "linear-gradient(135deg, #4A6FA5 0%, #2E4A6E 50%, #1E3352 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFFFFF",
          fontWeight: 900,
          fontFamily: "Inter, system-ui, sans-serif",
          borderRadius: 6,
          letterSpacing: "-0.02em",
        }}
      >
        A
      </div>
    ),
    { ...size },
  );
}
