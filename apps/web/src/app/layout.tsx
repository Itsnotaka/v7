import type * as React from "react";
import Script from "next/script";
import { Agentation } from "agentation";

import "../styles/globals.css";

import { Providers } from "~/components/providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-elevated" suppressHydrationWarning>
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
      <body className="bg-elevated text-default antialiased">
        <Providers>
          {children}
          {process.env.NODE_ENV === "development" && <Agentation />}
        </Providers>
      </body>
    </html>
  );
}
