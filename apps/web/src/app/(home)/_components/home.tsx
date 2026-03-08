import { getExperienceItems } from "@workspace/data/experiences";

import { ExperienceSection } from "~/features/home/experience-section";
import { Hero } from "~/features/home/hero";
import { StatsTicker } from "~/features/home/stats-ticker";

export function HomePage() {
  const items = getExperienceItems();

  return (
    <>
      <Hero />
      <StatsTicker />
      <ExperienceSection items={items} />
    </>
  );
}
