import { getFeaturedWorkItems } from "@workspace/data/work";

import { FeaturedSection } from "~/features/home/featured-section";
import { Hero } from "~/features/home/hero";
import { StatsTicker } from "~/features/home/stats-ticker";
import { getFeaturedWritingPosts } from "~/lib/content";

export function HomePage() {
	const post = getFeaturedWritingPosts()[0];
	const work = getFeaturedWorkItems()[0];

	return (
		<>
			<Hero />
			<StatsTicker />
			{post && work && <FeaturedSection post={post} work={work} />}
		</>
	);
}
