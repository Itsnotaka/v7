import type { Metadata } from "next";

import { AboutPage } from "./_components/about";

export const metadata: Metadata = {
  title: "About",
};

export default async function Page() {
  return <AboutPage />;
}
