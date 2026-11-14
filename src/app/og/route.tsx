import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export function GET() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: "#f7f9fc",
        color: "#202d45",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 24,
          letterSpacing: 5,
          color: "#345ce5",
        }}
      >
        NOTES ON THE WEB
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 140,
          fontWeight: 700,
          letterSpacing: -8,
        }}
      >
        ShyRobin<span style={{ color: "#345ce5" }}>.</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "2px solid #dce3ee",
          paddingTop: 24,
          fontSize: 24,
          color: "#637086",
        }}
      >
        <span>Web development & engineering</span>
        <span>Practice. Reflect. Write.</span>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
