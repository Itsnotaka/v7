import type { Metadata, Viewport } from "next";
import type * as React from "react";

import { Agentation } from "agentation";
import { DialRoot } from "dialkit";
import localFont from "next/font/local";
import Script from "next/script";
import { Suspense } from "react";

import "../styles/globals.css";
import "dialkit/styles.css";
import { FooterBoard } from "~/components/footer-board";
import { Providers } from "~/components/providers";

export const viewport: Viewport = {
  interactiveWidget: "resizes-visual",
};

export const metadata: Metadata = {
  title: {
    default: "Daniel — Design Engineer",
    template: "%s | Daniel",
  },
  description:
    "Design Engineer pursuing MS in Computer Engineering at NYU. Building thoughtful interfaces and systems.",
  metadataBase: new URL("https://daniel.software"),
  openGraph: {
    title: "Daniel — Design Engineer",
    description:
      "Design Engineer pursuing MS in Computer Engineering at NYU. Building thoughtful interfaces and systems.",
    type: "website",
    images: [],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daniel — Design Engineer",
    description:
      "Design Engineer pursuing MS in Computer Engineering at NYU. Building thoughtful interfaces and systems.",
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
      </head>
      <body className="antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const resolved = theme === 'system' || !theme
                    ? (systemDark ? 'dark' : 'light')
                    : theme;
                  if (resolved === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  document.documentElement.style.colorScheme = resolved;
                } catch (e) {}
              })();
            `,
          }}
        />
        <Providers>
          {children}
          <Suspense>
            <FooterBoard />
          </Suspense>
          {process.env.NODE_ENV === "development" && <Agentation />}
          <DialRoot />
        </Providers>
      </body>
    </html>
  );
}
