import type * as React from "react";
import localFont from "next/font/local";
import Script from "next/script";
import { Agentation } from "agentation";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import "../styles/globals.css";

import { Providers } from "~/components/providers";
import { router } from "~/app/api/uploadthing/core";

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
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${mono.variable}`}>
      <head>
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
        {process.env.NODE_ENV === "development" && (
          <Script src="//unpkg.com/@react-grab/amp/dist/client.global.js" strategy="lazyOnload" />
        )}
      </head>
      <body className="antialiased">
        <NextSSRPlugin routerConfig={extractRouterConfig(router)} />
        <Providers>
          {children}
          {process.env.NODE_ENV === "development" && <Agentation />}
        </Providers>
      </body>
    </html>
  );
}
