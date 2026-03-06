import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getWorkItem, getWorkItems } from "@workspace/data/work";

import { PageSection } from "~/components/page-shell";
import { getMockup } from "~/features/work/mockups";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getWorkItems().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await params;
  const item = getWorkItem(resolved.slug);
  if (!item) return {};
  return { title: `${item.title} — ${item.company}`, description: item.description };
}

export default async function Page({ params }: Props) {
  const resolved = await params;
  const item = getWorkItem(resolved.slug);
  if (!item) notFound();

  return (
    <PageSection>
      <header className="col-span-8 tablet:col-span-6 tablet:col-start-2 flex flex-col gap-2 pb-6 animate-article-enter">
        <p className="text-2xs uppercase tracking-widest text-muted-foreground">
          {item.company}
        </p>
        <h1 className="font-sans text-xl font-medium tracking-tight text-foreground">
          {item.title}
        </h1>
        <p className="text-sm leading-copy text-foreground/50">{item.description}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded border border-border px-2 py-0.5 text-2xs uppercase tracking-widest text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div
        className="col-span-8 tablet:col-span-6 tablet:col-start-2 flex flex-col gap-8 animate-article-enter"
        style={{ animationDelay: "80ms" }}
      >
        <div className="overflow-hidden rounded-lg border border-border">
          <Image
            src={item.image}
            alt={`${item.title} at ${item.company}`}
            width={1200}
            height={630}
            className="w-full object-cover"
            priority
          />
        </div>

        <div className="flex flex-col gap-6">
          <p className="text-sm leading-detail text-foreground/80">{item.body}</p>

          <div className="rounded-lg bg-muted p-6 flex items-center justify-center">
            <div className="w-full max-w-sm">{getMockup(item.mockup)}</div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-6">
          <Link
            href="/"
            className="rounded-full border border-border px-4 py-2.5 text-xs tracking-tight text-foreground transition-colors hover:bg-muted"
          >
            Back
          </Link>
          <Link
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border px-4 py-2.5 text-xs tracking-tight text-foreground transition-colors hover:bg-muted"
          >
            View project ↗
          </Link>
        </div>
      </div>
    </PageSection>
  );
}
