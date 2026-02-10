import type * as React from "react";
import {
  Bebas_Neue,
  Cabin,
  Cormorant_Garamond,
  IBM_Plex_Sans,
  Libre_Baskerville,
  Manrope,
  Prata,
  Public_Sans,
  Syne,
  Unbounded,
} from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--portfolio-font-cormorant",
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--portfolio-font-manrope",
  weight: ["400", "500", "600", "700"],
});

const prata = Prata({
  subsets: ["latin"],
  variable: "--portfolio-font-prata",
  weight: ["400"],
});

const libre = Libre_Baskerville({
  subsets: ["latin"],
  variable: "--portfolio-font-libre",
  weight: ["400", "700"],
});

const bebas = Bebas_Neue({
  subsets: ["latin"],
  variable: "--portfolio-font-bebas",
  weight: ["400"],
});

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--portfolio-font-plex",
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--portfolio-font-syne",
  weight: ["500", "600", "700"],
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--portfolio-font-public",
  weight: ["400", "500", "700"],
});

const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--portfolio-font-unbounded",
  weight: ["500", "700"],
});

const cabin = Cabin({
  subsets: ["latin"],
  variable: "--portfolio-font-cabin",
  weight: ["400", "500", "700"],
});

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <div
      className={[
        cormorant.variable,
        manrope.variable,
        prata.variable,
        libre.variable,
        bebas.variable,
        plex.variable,
        syne.variable,
        publicSans.variable,
        unbounded.variable,
        cabin.variable,
      ].join(" ")}
    >
      <a
        href="#portfolio-main"
        className="sr-only fixed top-4 left-4 z-50 rounded bg-white px-3 py-2 text-black focus:not-sr-only"
      >
        Skip to content
      </a>
      {props.children}
    </div>
  );
}
