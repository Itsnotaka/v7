import { ImageResponse } from "next/og";

export const alt = "Daniel — Design Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadFont() {
  const css = await fetch("https://fonts.googleapis.com/css2?family=Inter:wght@700", {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
    },
  }).then((r) => r.text());

  const url = css.match(/src: url\((.+?)\)/)?.[1];
  if (!url) throw new Error("Failed to load Inter font");
  return fetch(url).then((r) => r.arrayBuffer());
}

export default async function Image() {
  const inter = await loadFont();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#f5f5f4",
        position: "relative",
        overflow: "hidden",
        padding: "72px 80px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          fontFamily: "Inter",
          fontSize: 72,
          fontWeight: 700,
          lineHeight: 1.15,
          color: "#0a0a0a",
          letterSpacing: "-0.03em",
        }}
      >
        <span>Daniel</span>
        <span style={{ paddingLeft: 56 }}>is a Design</span>
        <span>Engineer</span>
        <span style={{ paddingLeft: 40 }}>building</span>
        <span>thoughtful</span>
        <span style={{ paddingLeft: 72 }}>interfaces</span>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: inter,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
