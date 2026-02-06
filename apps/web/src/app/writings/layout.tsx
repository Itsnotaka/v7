import type * as React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writings",
  description: "Essays and notes from Dan Shipper.",
  alternates: {
    canonical: "/writings",
  },
  openGraph: {
    title: "Writings",
    description: "Essays and notes from Dan Shipper.",
    url: "/writings",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Writings",
    description: "Essays and notes from Dan Shipper.",
  },
};

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#020202] text-white">
      <a
        href="#main-content"
        className="sr-only fixed top-4 left-4 z-50 rounded bg-white px-3 py-2 text-black focus:not-sr-only"
      >
        Skip to content
      </a>
      {props.children}
    </div>
  );
}
