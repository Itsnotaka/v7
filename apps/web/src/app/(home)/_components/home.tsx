import { getFeaturedWork } from "@workspace/data/work";

import { FeaturedSection } from "~/features/home/featured-section";
import { Hero } from "~/features/home/hero";
import { StatsTicker } from "~/features/home/stats-ticker";
import { getFeaturedPost } from "~/lib/content";

export function HomePage() {
  const post = getFeaturedPost();
  const work = getFeaturedWork();

  return (
    <>
      <Hero />
      <StatsTicker />
      {post && work && <FeaturedSection post={post} work={work} />}
    </>
  );
}
