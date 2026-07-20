import { Container, Section, Text, theme } from "@v7/ui";
import Link from "next/link";

import { cn } from "~/utils/cn";
import { getWritingPosts } from "~/lib/content";

function formatDate(date: string) {
  return date.slice(0, 10).replaceAll("-", ".");
}

export function Writing() {
  const posts = getWritingPosts();

  if (posts.length === 0) return null;

  return (
    <Section id="writing" className="py-12 sm:py-16">
      <Container className="mx-auto">
        <ul role="list">
          {posts.map((post) => (
            <li
              key={post.slug}
              className={cn("border-t py-10 first:border-t-0 first:pt-0", theme.hairline)}
            >
              <article className="grid gap-x-8 gap-y-2 sm:grid-cols-[11rem_1fr]">
                <Text variant="meta" className="text-muted-foreground">
                  {formatDate(post.date)}
                </Text>
                <div>
                  <Text as="h2" variant="heading" className="text-primary">
                    <Link
                      href={`/writing/${post.slug}`}
                      className={cn(theme.link, theme.ring)}
                    >
                      {post.title}
                    </Link>
                  </Text>
                  <Text as="p" variant="lead" className="mt-3 text-muted-foreground">
                    {post.excerpt}
                  </Text>
                  <Text variant="meta" className="mt-3 text-muted-foreground">
                    {post.tags.join(" · ")}
                  </Text>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
