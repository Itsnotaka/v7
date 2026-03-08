import Link from "next/link";

import { PageSection, Section } from "~/components/page-shell";
import { getWritingPosts } from "~/lib/content";

function WritingCard({
  post,
}: {
  post: { slug: string; title: string; date: string; excerpt: string; tags: string[] };
}) {
  return (
    <Link
      href={`/writing/${post.slug}`}
      className="group flex flex-col gap-1.5 py-5 border-b border-border/50 last:border-b-0"
    >
      <p className="text-2xs tracking-widest text-muted-foreground">
        {post.date}
        {post.tags.length > 0 && <span className="text-border"> — </span>}
        {post.tags.join(", ")}
      </p>
      <h3 className="text-lg font-medium tracking-tight text-foreground group-hover:text-foreground/70 transition-colors">
        {post.title}
      </h3>
      <p className="text-sm/5 text-foreground/50 line-clamp-2">{post.excerpt}</p>
    </Link>
  );
}

export function WritingPage() {
  const posts = getWritingPosts();

  return (
    <>
      <Section className="relative mt-16">
        <div className="col-span-8 tablet:col-span-5">
          <p className="first-letter:pr-1 first-letter:[-webkit-initial-letter:2] first-letter:[initial-letter:2] text-2xl/[1.5] tracking-wide text-balance">
            Writing is how I think out loud. Notes on design engineering, interaction, and the
            things I notice while building.
          </p>
        </div>
      </Section>
      <PageSection>
        <div className="col-span-8 flex flex-col">
          <div className="flex flex-col">
            {posts.map((post) => (
              <WritingCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </PageSection>
    </>
  );
}
