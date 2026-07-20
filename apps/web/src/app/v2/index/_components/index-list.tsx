import { Section, Text, theme } from "@v7/ui";
import { getExperienceItem } from "@workspace/data/experiences";

import { cn } from "~/utils/cn";

import { ProjectSheet } from "../../_components/project-sheet";
import { CaseStudy } from "../../_components/projects";
import { indexEntries, type IndexEntry } from "./index-data";

const rowGrid =
  "grid grid-cols-[4.75rem_minmax(0,1fr)_auto] items-baseline gap-x-4 px-4 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:px-6";

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <Text as="p" variant="meta" className="text-muted-foreground">
      <span className="font-medium text-primary">{label}: </span>
      {value}
    </Text>
  );
}

function DetailSheet({ entry, title, kind }: { entry: IndexEntry; title: string; kind: string }) {
  const internal = entry.href?.startsWith("/");

  return (
    <div className="grid grid-cols-1 gap-x-4 px-5 py-8 sm:grid-cols-12 sm:px-6 sm:py-10">
      <div className="flex flex-col gap-8 sm:col-span-6 desktop:col-span-5">
        <div>
          <Text as="h2" variant="brand" className="text-primary">
            {title}
          </Text>
          <Text as="p" variant="meta" className="mt-1 text-muted-foreground">
            {kind}
          </Text>
        </div>

        <div className="flex flex-col gap-1">
          <MetaRow label="Year" value={entry.year} />
          {entry.stack && entry.stack.length > 0 ? (
            <MetaRow label="Stack" value={entry.stack.join(", ")} />
          ) : null}
        </div>

        {entry.description ? (
          <Text as="p" variant="heading" className="text-primary">
            {entry.description}
          </Text>
        ) : null}

        {entry.href ? (
          <a
            href={entry.href}
            target={internal ? undefined : "_blank"}
            rel={internal ? undefined : "noreferrer"}
            className={`w-fit ${theme.ring}`}
          >
            <Text as="span" variant="meta" className="text-primary underline underline-offset-4">
              view project ↗
            </Text>
          </a>
        ) : null}
      </div>
    </div>
  );
}

function IndexRow({ tag, title, year }: { tag: string; title: string; year: string }) {
  return (
    <button
      type="button"
      className={cn(
        "group w-full cursor-pointer border-t py-4 text-left hover:bg-primary",
        theme.hairline,
        theme.ringInset,
        rowGrid,
      )}
    >
      <Text
        as="span"
        variant="control"
        className="text-muted-foreground group-hover:text-primary-foreground"
      >
        {tag}
      </Text>
      <Text
        as="span"
        variant="nav"
        className="truncate text-primary group-hover:text-primary-foreground"
      >
        {title}
      </Text>
      <Text
        as="span"
        variant="control"
        className="text-muted-foreground group-hover:text-primary-foreground"
      >
        {year}
      </Text>
    </button>
  );
}

export function ProjectIndex() {
  const rows = indexEntries.map((entry, index) => {
    const item = entry.experience ? getExperienceItem(entry.experience) : undefined;
    const title = item?.title ?? entry.title ?? "";
    const kind = item
      ? `${item.kind.toLowerCase()}${item.owner !== item.title ? ` — ${item.owner.toLowerCase()}` : ""}`
      : (entry.kind ?? "");

    return { entry, item, title, kind, id: String(index + 1).padStart(3, "0") };
  });

  return (
    <Section className="py-8 sm:py-10">
      <div aria-hidden="true" className={`pb-2 ${rowGrid}`}>
        <Text as="span" variant="control" className="text-muted-foreground">
          tag
        </Text>
        <Text as="span" variant="control" className="text-muted-foreground">
          project
        </Text>
        <Text as="span" variant="control" className="text-muted-foreground">
          date
        </Text>
      </div>
      <div className={cn("border-b", theme.hairline)}>
        {rows.map(({ entry, item, title, kind, id }) => (
          <ProjectSheet
            key={id}
            title={title}
            kind={kind}
            id={id}
            sheet={
              item ? (
                <CaseStudy item={item} />
              ) : (
                <DetailSheet entry={entry} title={title} kind={kind} />
              )
            }
          >
            <IndexRow tag={entry.tag} title={title} year={entry.year} />
          </ProjectSheet>
        ))}
      </div>
    </Section>
  );
}
