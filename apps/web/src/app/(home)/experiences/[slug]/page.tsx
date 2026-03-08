import type { Metadata } from "next";

import { getExperienceItem, getExperienceItems } from "@workspace/data/experiences";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageSection } from "~/components/page-shell";
import { ExperienceMedia } from "~/features/experiences/experience-media";
import { getMockup } from "~/features/experiences/mockups";
type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getExperienceItems().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await params;
  const item = getExperienceItem(resolved.slug);
  if (!item) return {};

  return { title: `${item.title} — ${item.owner}`, description: item.description };
}

export default async function Page({ params }: Props) {
  const resolved = await params;
  const item = getExperienceItem(resolved.slug);
  if (!item) notFound();

  const meta = `${item.kind} - ${item.owner}`;

  return (
    <PageSection>
      <header className="col-span-8 tablet:col-span-6 tablet:col-start-2 flex flex-col gap-2 pb-6 animate-article-enter">
        <p className="text-2xs tracking-widest text-muted-foreground">{meta}</p>
        <h1 className="font-sans text-xl font-medium tracking-tight text-foreground">{item.title}</h1>
        <p className="text-sm text-foreground/50">{item.description}</p>
      </header>

      <div
        className="col-span-8 tablet:col-span-6 tablet:col-start-2 flex flex-col gap-8 animate-article-enter"
        style={{ animationDelay: "80ms" }}
      >
        <div className="relative mx-auto aspect-[1200/630] w-full max-w-4xl overflow-hidden bg-muted shadow-xs ring ring-border">
          <ExperienceMedia item={item} sizes="(min-width: 1024px) 64rem, 100vw" priority />
        </div>

        <div className="flex flex-col gap-12">
          {item.works.map((work) => (
            <div key={work.title} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-medium tracking-tight text-foreground">{work.title}</h2>
                <p className="text-sm text-foreground/80">{work.body}</p>
              </div>

              <div className="flex items-center justify-center bg-muted p-6 shadow-xs ring ring-border">
                <div className="w-full max-w-sm">{getMockup(work.mockup)}</div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {work.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-border px-2 py-0.5 text-2xs tracking-widest text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-6">
          <Link
            href="/"
            className="border border-border px-4 py-2.5 text-xs tracking-tight text-foreground transition-colors hover:bg-muted"
          >
            Back home
          </Link>
          <Link
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-border px-4 py-2.5 text-xs tracking-tight text-foreground transition-colors hover:bg-muted"
          >
            View project
          </Link>
        </div>
      </div>
    </PageSection>
  );
}
