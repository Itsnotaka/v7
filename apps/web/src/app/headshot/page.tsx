import type { Metadata } from "next";

import { Headshot } from "./headshot";

export const metadata: Metadata = {
  title: "Headshot / Blocks",
  description: "A liquid portrait study that adds and removes a playful layer by touch and scroll.",
};

export default function Page() {
  return <Headshot />;
}
