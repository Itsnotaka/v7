import { getExperienceItems } from "@workspace/data/experiences";

import { Hero } from "~/features/home/hero";
import { ExperienceSection } from "~/features/home/experience-section";
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
