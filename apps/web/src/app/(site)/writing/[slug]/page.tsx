import type { Metadata } from "next";

import { Container, Section, Text, theme } from "@v7/ui";
import { compileMDX } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";

import { components } from "~/components/mdx-components";
import { getWritingContent, getWritingPosts } from "~/lib/content";
import { cn } from "~/utils/cn";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getWritingPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await params;
  const exists = getWritingPosts().some((post) => post.slug === resolved.slug);
  if (!exists) return {};
  const { meta } = await getWritingContent(resolved.slug);
  return { title: meta.title, description: meta.excerpt };
}

export default async function Page({ params }: Props) {
  const resolved = await params;
  const exists = getWritingPosts().some((post) => post.slug === resolved.slug);
  if (!exists) notFound();

  const { content, meta } = await getWritingContent(resolved.slug);
  const { content: rendered } = await compileMDX({
    source: content,
    components,
  });

  return (
    <>
      <Section className="pt-12 sm:pt-16">
        <Container className="mx-auto">
          <Text variant="meta" className="text-muted-foreground">
            {meta.date.slice(0, 10).replaceAll("-", ".")}
          </Text>
          <Text as="h1" variant="heading" className="mt-4 text-primary">
            {meta.title}
          </Text>
          <Text as="p" variant="lead" className="mt-3 text-muted-foreground">
            {meta.excerpt}
          </Text>
        </Container>
      </Section>
      <Section className="py-10 sm:py-12">
        <Container className="mx-auto">
          <article>{rendered}</article>
          <div className={cn("mt-12 flex justify-between border-t pt-6", theme.hairline)}>
            <Link href="/" className={cn("text-primary", theme.link, theme.ring)}>
              Home
            </Link>
            <Link href="/writing" className={cn("text-primary", theme.link, theme.ring)}>
              All writing
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
