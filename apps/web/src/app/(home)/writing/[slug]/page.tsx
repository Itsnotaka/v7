import type { Metadata } from "next";

import { compileMDX } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";

import { components } from "~/components/mdx-components";
import { PageBody, PageCaption, PageHeading, PageSection } from "~/components/page-shell";
import { SectionNav } from "~/components/section-nav";
import { extractHeadings, getWritingContent, getWritingPosts } from "~/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getWritingPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await params;
  const posts = getWritingPosts();
  const exists = posts.some((p) => p.slug === resolved.slug);
  if (!exists) return {};
  const { meta } = await getWritingContent(resolved.slug);
  return { title: meta.title, description: meta.excerpt };
}

export default async function WritingPage({ params }: Props) {
  const resolved = await params;
  const posts = getWritingPosts();
  const exists = posts.some((p) => p.slug === resolved.slug);
  if (!exists) notFound();

  const { content, meta } = await getWritingContent(resolved.slug);

  const { content: rendered } = await compileMDX({
    source: content,
    components,
  });

  const headings = extractHeadings(content);

  return (
    <PageSection id="top">
      <header className="col-span-8 tablet:col-span-6 tablet:col-start-2 flex flex-col gap-2 pb-6 animate-article-enter">
        <PageCaption>
          {new Date(meta.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </PageCaption>
        <PageHeading>{meta.title}</PageHeading>
        <PageBody>{meta.excerpt}</PageBody>
      </header>

      <article
        className="col-span-8 tablet:col-span-6 tablet:col-start-2 animate-article-enter"
        style={{ animationDelay: "80ms" }}
      >
        {rendered}
      </article>

      <div
        className="col-span-8 tablet:col-span-6 tablet:col-start-2 flex items-center justify-between border-t border-border pt-6 mt-4 animate-article-enter"
        style={{ animationDelay: "240ms" }}
      >
        <Link href="/" className="text-sm text-foreground/80 underline underline-offset-2">
          Back home
        </Link>
        <Link href="/writing" className="text-sm text-foreground/80 underline underline-offset-2">
          All writing
        </Link>
      </div>

      {headings.length > 0 && <SectionNav items={headings} />}
    </PageSection>
  );
}
