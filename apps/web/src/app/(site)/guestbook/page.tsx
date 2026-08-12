import type { Metadata } from "next";

import { Signatures } from "../_components/signatures";
import { PageIntro } from "../_components/subpage";

export const metadata: Metadata = {
  title: "Guestbook",
  description: "Visitors who left their trails here.",
};

export default function Page() {
  return (
    <>
      <PageIntro
        label="guestbook"
        statement="Ink from the people who passed through — every mark drawn by hand, right here on this page."
      />
      <Signatures />
    </>
  );
}
