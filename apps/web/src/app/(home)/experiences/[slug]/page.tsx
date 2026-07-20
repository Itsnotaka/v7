import type { Metadata } from "next";

import { getExperienceItem, getExperienceItems, type MockupId } from "@workspace/data/experiences";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageBody, PageCaption, PageHeading, PageSection } from "~/components/page-shell";
import { SectionNav, type NavItem } from "~/components/section-nav";
import { ExperienceMedia } from "~/features/experiences/experience-media";
import { getMockup } from "~/features/experiences/mockups";
import { cn } from "~/utils/cn";

const phoneMockups: ReadonlySet<MockupId> = new Set([
  "openpoke-home",
  "openpoke-chat",
  "openpoke-connections",
]);

const wideMockups: ReadonlySet<MockupId> = new Set([
  "honk-session-workbench",
  "honk-home-composer",
]);

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

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
  const sections: NavItem[] = item.works.map((work) => ({
    id: slugify(work.title),
    label: work.title,
  }));

  return (
    <PageSection id="top">
      <div className="col-span-8 animate-article-enter">
        <div className="relative flex h-[min(700px,64vh)] w-full justify-center">
          <ExperienceMedia
            item={item}
            sizes="(min-width: 1024px) 64rem, 100vw"
            className="h-full w-auto max-w-full object-contain"
            videoFit="contain"
            priority
          />
        </div>
      </div>

      <header
        className="col-span-8 tablet:col-span-6 tablet:col-start-2 flex flex-col gap-3 pt-10 pb-8 animate-article-enter"
        style={{ animationDelay: "80ms" }}
      >
        <PageCaption>{meta}</PageCaption>
        <PageHeading>{item.title}</PageHeading>
        <PageBody className="text-foreground/50">{item.description}</PageBody>
      </header>

      <div
        className="col-span-8 tablet:col-span-6 tablet:col-start-2 flex flex-col gap-6 animate-article-enter"
        style={{ animationDelay: "160ms" }}
      >
        {item.works.map((work) => (
          <div
            key={work.title}
            id={slugify(work.title)}
            className={cn(
              "flex gap-6 bg-muted p-5 shadow-xs ring ring-border",
              wideMockups.has(work.mockup) ? "flex-col" : "flex-col tablet:flex-row",
            )}
          >
            <div
              className={cn(
                !wideMockups.has(work.mockup) && "tablet:w-1/2 shrink-0",
                phoneMockups.has(work.mockup) && "flex items-center justify-center",
              )}
            >
              {getMockup(work.mockup)}
            </div>
            <div className="flex flex-col gap-3 justify-center">
              <h2 className="text-lg font-medium tracking-tight text-foreground">{work.title}</h2>
              <p className="text-sm text-foreground/80">
                {work.body.split(/(\[.*?\])/).map((part, i) =>
                  part.startsWith("[") && part.endsWith("]") ? (
                    <span key={i} className="text-foreground">
                      {part.slice(1, -1)}
                    </span>
                  ) : (
                    part
                  ),
                )}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
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
          </div>
        ))}
      </div>

      <div
        className="col-span-8 tablet:col-span-6 tablet:col-start-2 flex items-center justify-between border-t border-border pt-6 mt-4 animate-article-enter"
        style={{ animationDelay: "240ms" }}
      >
        <Link href="/" className="text-sm text-foreground/80 underline underline-offset-2">
          Back home
        </Link>
        <Link
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-foreground/80 underline underline-offset-2"
        >
          View project
        </Link>
      </div>

      <SectionNav items={sections} />
    </PageSection>
  );
}
