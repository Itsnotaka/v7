import { getWorkItems } from "@workspace/data/work";

import { Hero } from "~/features/home/hero";
import { StatsTicker } from "~/features/home/stats-ticker";
import { WorkSection } from "~/features/home/work-section";

export function HomePage() {
  const items = getWorkItems();

  return (
    <>
      <Hero />
      <StatsTicker />
      <WorkSection items={items} />
    </>
  );
}
