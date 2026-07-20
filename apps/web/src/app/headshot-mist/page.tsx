import type { Metadata } from "next";

import { Headshot } from "../headshot/headshot";

export const metadata: Metadata = {
  title: "Headshot / Mist",
  description: "A refractive portrait study where touch clears condensation from the glass.",
};

export default function Page() {
  return <Headshot effect="mist" />;
}
