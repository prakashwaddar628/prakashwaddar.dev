import { ImageResponse } from "next/og";

export const alt = "Prakash L Waddar, Software and AI Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center",
      padding: 90, background: "linear-gradient(125deg, #10110f, #28351a)", color: "#f2f3e9" }}>
      <div style={{ color: "#d8ff70", fontSize: 28 }}>SOFTWARE ENGINEER / FULL-STACK DEVELOPER / AI ENGINEER</div>
      <div style={{ fontSize: 114, fontWeight: 800, letterSpacing: -7 }}>Prakash L Waddar</div>
      <div style={{ fontSize: 43, color: "#d8ff70" }}>I build what’s next.</div>
    </div>,
    size,
  );
}
