import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Daniel — Design Engineer";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

const font = readFile(join(process.cwd(), "public/fonts/InterVariable.ttf"));

export default async function Image() {
  const data = await font;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "72px",
        backgroundColor: "#080b14",
        backgroundImage:
          "linear-gradient(90deg, #f6f1e8 0%, #eedfcc 30%, #beaeb1 52%, #4b5678 75%, #080b14 100%)",
        color: "#151823",
        fontFamily: "Inter",
        fontSize: 72,
        fontWeight: 700,
        lineHeight: 1.06,
        letterSpacing: "-0.035em",
      }}
    >
      <div
        style={{
          display: "flex",
          maxWidth: "960px",
        }}
      >
        Daniel — Design Engineer
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
