import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #4A6FA5 0%, #2E4A6E 55%, #1E3352 100%)",
          color: "white",
          display: "flex",
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 340,
          fontWeight: 900,
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        A
      </div>
    ),
    { width: 512, height: 512 },
  );
}
