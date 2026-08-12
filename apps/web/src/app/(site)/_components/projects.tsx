import type { ExperienceItem, ExperienceWork } from "@workspace/data/experiences";

import { Section, Text, theme, Typeset } from "@v7/ui";
import { getExperienceItems } from "@workspace/data/experiences";
import { Fragment, type ReactNode } from "react";

import { ExperienceMedia } from "~/features/experiences/experience-media";
import { getMockup } from "~/features/experiences/mockups";

import { Deferred } from "./deferred";
import { FitBox } from "./fit-box";
import { mockupDesignWidths, plateStyle } from "./plate-colors";
import { ProjectSheet } from "./project-sheet";

function ownerSuffix(item: ExperienceItem) {
  return item.owner !== item.title ? ` / ${item.owner}` : "";
}

function Caption({ children }: { children: string }) {
  return (
    <Text as="p" variant="meta" className="mt-2 h-6 truncate font-mono text-muted-foreground">
      {children}
    </Text>
  );
}

/**
 * Aspect each media plate renders at in the project row. Cells get
 * flex-grow proportional to this, so every plate in a row resolves to
 * the same height while the row fills the full width.
 */
function plateAspect(mockup: string | null) {
  if (!mockup) return 16 / 10;
  const width = mockupDesignWidths[mockup] ?? 480;
  if (width <= 400) return 3 / 4;
  if (width >= 700) return 16 / 10;
  return 4 / 3;
}

function RowCell({ aspect, children }: { aspect: number; children: ReactNode }) {
  return (
    <div className="min-w-0 sm:basis-0" style={{ flexGrow: aspect }}>
      {children}
    </div>
  );
}

function StoryCell({ item }: { item: ExperienceItem }) {
  return (
    <div
      className="relative h-full min-h-56 overflow-hidden p-5 sm:min-h-0 sm:p-6"
      style={plateStyle(item.slug)}
    >
      <div className="relative z-10 grid content-start gap-5 text-primary-foreground/65">
        <div>
          <a
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className={`w-fit ${theme.link} ${theme.ring}`}
          >
            <Text as="h2" variant="meta" className="font-semibold text-inherit">
              {item.title}
              {ownerSuffix(item)}
              <span aria-hidden="true"> ↗</span>
            </Text>
          </a>
          <Text as="p" variant="meta" className="text-inherit">
            {item.kind.toLowerCase()}
          </Text>
        </div>
        <Text as="p" variant="meta" className="max-w-[44ch] text-pretty text-inherit">
          {item.description}
        </Text>
      </div>
    </div>
  );
}

function HeroCell({ item, aspect }: { item: ExperienceItem; aspect: number }) {
  if (item.preview?.kind === "mockup") {
    return (
      <div className="flex flex-col">
        <div
          className="relative overflow-hidden p-4 sm:p-5"
          style={{ ...plateStyle(item.slug), aspectRatio: aspect }}
        >
          <FitBox designWidth={mockupDesignWidths[item.preview.mockup] ?? 480}>
            <div className="drop-shadow-[0_16px_32px_rgba(0,0,0,0.28)]">
              {getMockup(item.preview.mockup)}
            </div>
          </FitBox>
        </div>
        <Caption>{item.title.toLowerCase()}</Caption>
      </div>
    );
  }

  const isVideo = item.preview?.kind === "video";
  const media = (
    <ExperienceMedia
      item={item}
      sizes="(min-width: 40rem) 50vw, 100vw"
      className={isVideo ? "h-full w-full object-contain" : "h-full w-full object-cover"}
      videoFit={isVideo ? "contain" : "cover"}
    />
  );

  return (
    <div className="flex flex-col">
      <div
        className="relative overflow-hidden"
        style={{ ...plateStyle(item.slug), aspectRatio: aspect }}
      >
        <div className="absolute inset-0">
          {item.preview?.kind === "video" ? (
            <Deferred className="h-full w-full">{media}</Deferred>
          ) : (
            media
          )}
        </div>
      </div>
      <Caption>{item.title.toLowerCase()}</Caption>
    </div>
  );
}

function DemoCell({ item, work }: { item: ExperienceItem; work: ExperienceWork }) {
  return (
    <figure className="flex flex-col">
      <div
        className="overflow-hidden p-4 sm:p-5"
        style={{ ...plateStyle(item.slug), aspectRatio: plateAspect(work.mockup) }}
      >
        <FitBox designWidth={mockupDesignWidths[work.mockup] ?? 480}>
          <div className="drop-shadow-[0_16px_32px_rgba(0,0,0,0.28)]">{getMockup(work.mockup)}</div>
        </FitBox>
      </div>
      <figcaption>
        <Caption>{`${work.title.toLowerCase()} — ${item.title.toLowerCase()}`}</Caption>
      </figcaption>
    </figure>
  );
}

function ProjectCells({ item, index }: { item: ExperienceItem; index: number }) {
  const heroMockup = item.preview?.kind === "mockup" ? item.preview.mockup : null;
  const works = item.works.filter((work) => work.mockup !== heroMockup);
  const [first, ...rest] = works;
  const heroAspect = plateAspect(heroMockup);

  const story = (
    <div key="story" className="flex flex-col sm:shrink-0 sm:basis-1/4">
      <div className="min-h-0 flex-1">
        <StoryCell item={item} />
      </div>
      {/* Matches the caption strip under media cells so plate bottoms align. */}
      <div aria-hidden="true" className="mt-2 hidden h-6 sm:block" />
    </div>
  );
  const hero = (
    <RowCell key="hero" aspect={heroAspect}>
      <HeroCell item={item} aspect={heroAspect} />
    </RowCell>
  );
  const lead = first ? (
    <RowCell key={first.mockup} aspect={plateAspect(first.mockup)}>
      <DemoCell item={item} work={first} />
    </RowCell>
  ) : null;

  const pattern = index % 3;
  const ordered =
    pattern === 0 ? [story, hero, lead] : pattern === 1 ? [hero, lead, story] : [lead, story, hero];

  return (
    <Fragment>
      {ordered}
      {rest.map((work) => (
        <RowCell key={work.mockup} aspect={plateAspect(work.mockup)}>
          <DemoCell item={item} work={work} />
        </RowCell>
      ))}
    </Fragment>
  );
}

function isPhoneMockup(id: string) {
  return (mockupDesignWidths[id] ?? 480) <= 400;
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <Text as="p" variant="meta" className="font-mono text-muted-foreground">
      <span className="font-medium text-primary">{label}: </span>
      {value}
    </Text>
  );
}

function SheetDemo({ item, work }: { item: ExperienceItem; work: ExperienceWork }) {
  return (
    <figure className="flex h-full flex-col">
      <div
        className="flex flex-1 items-center justify-center p-6 sm:p-10"
        style={plateStyle(item.slug)}
      >
        <div className={isPhoneMockup(work.mockup) ? "w-full max-w-[360px]" : "w-full"}>
          <div className="drop-shadow-[0_16px_32px_rgba(0,0,0,0.28)]">{getMockup(work.mockup)}</div>
        </div>
      </div>
      <figcaption>
        <Caption>{work.title.toLowerCase()}</Caption>
      </figcaption>
    </figure>
  );
}

export function CaseStudy({ item }: { item: ExperienceItem }) {
  const stack = [...new Set(item.works.flatMap((work) => work.tags))];
  const rows: ExperienceWork[][] = [];
  for (const work of item.works) {
    const last = rows.at(-1);
    if (
      isPhoneMockup(work.mockup) &&
      last?.length === 1 &&
      last[0] &&
      isPhoneMockup(last[0].mockup)
    ) {
      last.push(work);
    } else {
      rows.push([work]);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-12 px-5 py-6 sm:h-full sm:min-h-0 sm:grid-cols-12 sm:overflow-hidden sm:px-6">
      <div className="sm:col-span-4 sm:min-h-0 sm:overflow-y-auto">
        <div className="flex flex-col gap-8 sm:gap-10">
          <div>
            <Text as="h2" variant="brand" className="text-primary">
              {item.title}
            </Text>
            <Text as="p" variant="meta" className="mt-1 font-mono text-muted-foreground">
              {item.kind.toLowerCase()}
              {ownerSuffix(item).toLowerCase()}
            </Text>
          </div>

          <div className="flex flex-col gap-1">
            <MetaRow label="Owner" value={item.owner} />
            <MetaRow label="Kind" value={item.kind} />
            {stack.length > 0 ? (
              <MetaRow label="Stack" value={stack.slice(0, 6).join(", ")} />
            ) : null}
          </div>

          <Text as="p" variant="heading" className="text-primary">
            {item.description}
          </Text>

          <div className="flex flex-col gap-5">
            {item.works.map((work) => (
              <div key={work.title}>
                <Text as="p" variant="meta" className="font-medium text-primary">
                  {work.title}
                </Text>
                <Typeset
                  preset="compact"
                  className="mt-1 font-mono text-muted-foreground [--typeset-leading:1.5] [--typeset-size:0.8125rem]"
                >
                  <p>{work.body.replace(/[[\]]/g, "")}</p>
                </Typeset>
              </div>
            ))}
          </div>

          <a href={item.href} target="_blank" rel="noreferrer" className={`w-fit ${theme.ring}`}>
            <Text as="span" variant="meta" className="text-primary underline underline-offset-4">
              view project ↗
            </Text>
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:col-span-8 sm:col-start-5 sm:min-h-0 sm:overflow-y-auto">
        {item.preview && item.preview.kind !== "mockup" ? (
          <figure>
            <div className="p-6 sm:p-10" style={plateStyle(item.slug)}>
              <ExperienceMedia
                item={item}
                sizes="(min-width: 40rem) 66vw, 100vw"
                className="h-auto w-full"
                videoFit="contain"
              />
            </div>
            <figcaption>
              <Caption>{`${item.title.toLowerCase()} — demo`}</Caption>
            </figcaption>
          </figure>
        ) : null}
        {rows.map((row) =>
          row.length === 2 ? (
            <div key={row[0]?.mockup} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {row.map((work) => (
                <SheetDemo key={work.mockup} item={item} work={work} />
              ))}
            </div>
          ) : row[0] ? (
            <SheetDemo key={row[0].mockup} item={item} work={row[0]} />
          ) : null,
        )}
      </div>
    </div>
  );
}

export function Projects({ statement }: { statement?: string }) {
  const items = getExperienceItems();

  return (
    <Section id="projects" className="py-8 sm:py-10">
      <div className="px-4 sm:px-6">
        {statement ? (
          <Text as="h1" variant="heading" className="mb-14 text-primary sm:mb-20">
            {statement}
          </Text>
        ) : null}
        <div className="flex flex-col gap-4">
          {items.map((item, index) => (
            <ProjectSheet
              key={item.slug}
              title={item.title}
              kind={`${item.kind.toLowerCase()}${item.owner !== item.title ? ` — ${item.owner.toLowerCase()}` : ""}`}
              id={String(index + 1).padStart(3, "0")}
              sheet={<CaseStudy item={item} />}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
                <ProjectCells item={item} index={index} />
              </div>
            </ProjectSheet>
          ))}
        </div>
      </div>
    </Section>
  );
}
