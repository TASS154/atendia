import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b1c1a",
          color: "white",
          padding: 72,
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 6, textTransform: "uppercase", opacity: 0.6 }}>
          ATENDIA
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 72, lineHeight: 1.05, maxWidth: 900 }}>
            Pare de perder dinheiro por esquecer o cliente.
          </div>
          <div style={{ fontSize: 28, opacity: 0.7, maxWidth: 760 }}>
            Hub comercial para quem vende e atende pelo WhatsApp.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
