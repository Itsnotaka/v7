import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
  src: "../public/fonts/InterVariable.ttf",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CV - Min Chun Fu",
  description: "System Design Engineer CV",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
