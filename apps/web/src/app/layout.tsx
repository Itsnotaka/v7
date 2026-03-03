import type * as React from "react";
import Script from "next/script";
import { Agentation } from "agentation";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import "../styles/globals.css";

import { Providers } from "~/components/providers";
import { router } from "~/app/api/uploadthing/core";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
