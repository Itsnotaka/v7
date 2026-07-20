import type { Metadata } from "next";
import type * as React from "react";

import { Analytics } from "@vercel/analytics/next";
import { DialRoot } from "dialkit";
import localFont from "next/font/local";
import Script from "next/script";

import "../styles/globals.css";
import "dialkit/styles.css";

import { FooterBoard } from "~/components/footer-board";
import { Providers } from "~/components/providers";

export const metadata: Metadata = {
  title: {
    default: "Daniel — Product Designer",
    template: "%s | Daniel",
  },
  description:
    "Product Designer pursuing MS in Computer Engineering at NYU. Building thoughtful interfaces and systems.",
  metadataBase: new URL("https://nameisdaniel.com"),
  openGraph: {
    title: "Daniel — Product Designer",
    description:
      "Product Designer pursuing MS in Computer Engineering at NYU. Building thoughtful interfaces and systems.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daniel — Product Designer",
    description:
      "Product Designer pursuing MS in Computer Engineering at NYU. Building thoughtful interfaces and systems.",
  },
};

const sans = localFont({
  src: [
    {
      path: "../../public/fonts/InterVariable.ttf",
      style: "normal",
      weight: "100 900",
    },
    {
      path: "../../public/fonts/InterVariable-Italic.ttf",
      style: "italic",
      weight: "100 900",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});

const mono = localFont({
  src: [
    {
      path: "../../public/fonts/BerkeleyMono-Regular.ttf",
      style: "normal",
      weight: "400",
    },
    {
      path: "../../public/fonts/BerkeleyMono-Oblique.ttf",
      style: "italic",
      weight: "400",
    },
    {
      path: "../../public/fonts/BerkeleyMono-Bold.ttf",
      style: "normal",
      weight: "700",
    },
    {
      path: "../../public/fonts/BerkeleyMono-Bold-Oblique.ttf",
      style: "italic",
      weight: "700",
    },
  ],
  variable: "--font-berkeley-mono",
  display: "swap",
});

const semiMono = localFont({
  src: [
    {
      path: "../../public/fonts/RecursiveVariable.woff2",
      style: "oblique 0deg 15deg",
      weight: "300 1000",
    },
  ],
  variable: "--font-recursive",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${mono.variable} ${semiMono.variable}`}
    >
      <head>
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab@0.1.48/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body className="antialiased">
        <Providers>
          <div className="isolate">
            {children}
            <FooterBoard />
          </div>
          <DialRoot />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
