import type { Metadata } from "next";

import { Mist } from "./mist";

export const metadata: Metadata = {
  title: "Mist",
  description: "An interactive reflection revealed by touch.",
};

export default function Page() {
  return (
    <main className="fixed inset-0 z-raised">
      <Mist className="h-full" />
    </main>
  );
}
