import type { Metadata } from "next";

import { Archive } from "./_components/archive";

export const metadata: Metadata = {
  title: "Archive — light studies",
  description: "Twenty-two night-mist light studies from one shader, revealed by touch.",
};

export default function Page() {
  return (
    <main className="fixed inset-0 z-raised">
      <h1 className="sr-only">Archive — light studies</h1>
      <Archive />
    </main>
  );
}
