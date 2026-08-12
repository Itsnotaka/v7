import type { Metadata } from "next";

import { PageIntro } from "../_components/subpage";
import { Writing } from "../_components/writing";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes on design engineering, interaction, and the things noticed while building.",
};

export default function Page() {
  return (
    <>
      <PageIntro
        label="writing"
        statement="Writing is how I think out loud — notes on design engineering, interaction, and the things I notice while building."
      />
      <Writing />
    </>
  );
}
