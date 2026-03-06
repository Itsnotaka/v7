import Link from "next/link";

import { getWritingPosts } from "~/lib/content";
import { PageSection, SectionHeading } from "~/components/page-shell";

function WritingCard({
  post,
}: {
  post: { slug: string; title: string; date: string; excerpt: string; tags: string[] };
}) {
  return (
    <Link
      href={`/writing/${post.slug}`}
      className="group flex flex-col gap-2 rounded-lg bg-muted p-6 transition-colors hover:bg-muted/80"
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-sans text-base font-medium tracking-tight text-foreground group-hover:text-foreground/80">
          {post.title}
        </h3>
        <span className="text-2xs uppercase tracking-[0.06em] text-muted-foreground shrink-0">
          {post.date}
        </span>
      </div>
      <p className="text-sm leading-[1.5] text-foreground/60 line-clamp-2">{post.excerpt}</p>
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded border border-border px-2 py-0.5 text-2xs uppercase tracking-[0.06em] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

export function WritingPage() {
  const posts = getWritingPosts();

  return (
    <PageSection>
      <div className="col-span-8 flex flex-col gap-6">
        <SectionHeading>Writing</SectionHeading>
        <div className="grid grid-cols-1 gap-1">
          {posts.map((post) => (
            <WritingCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </PageSection>
  );
}
