import type { Metadata } from "next";

import { PageIntro } from "../_components/subpage";
import { ProjectIndex } from "./_components/index-list";

export const metadata: Metadata = {
  title: "Index",
  description:
    "An index of everything — work, interfaces, experiments, websites, and open source since 2021.",
};

export default function Page() {
  return (
    <>
      <PageIntro
        label="index"
        statement="Everything I've shipped, indexed — work, interfaces, experiments, websites, and open source since 2021."
      />
      <ProjectIndex />
    </>
  );
}
