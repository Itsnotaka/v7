import { IconProjects } from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import Image from "next/image";
import Link from "next/link";

import type { WorkItem } from "@workspace/data/work";

import { Section } from "~/components/page-shell";

function Tag(props: { children: string }) {
  return (
    <span className="rounded border border-border px-2 py-0.5 text-2xs uppercase tracking-widest text-muted-foreground">
      {props.children}
    </span>
  );
}

function WorkCard(props: { item: WorkItem }) {
  return (
    <Link
      href={`/work/${props.item.slug}`}
      className="group col-span-full grid gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted tablet:col-span-4"
    >
      <div className="overflow-hidden rounded">
        <Image
          src={props.item.image}
          alt={`${props.item.title} at ${props.item.company}`}
          width={600}
          height={315}
          className="w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-2xs uppercase tracking-widest text-muted-foreground">
          {props.item.company}
        </p>
        <h3 className="text-base font-medium tracking-tight text-foreground">
          {props.item.title}
          <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            ↗
          </span>
        </h3>
        <p className="text-sm leading-body text-foreground/60">{props.item.description}</p>
        {props.item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {props.item.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

export function WorkSection(props: { items: WorkItem[] }) {
  return (
    <Section className="gap-x-5 pt-12">
      <div className="col-span-full grid grid-cols-subgrid items-center gap-3 pb-4">
        <div className="col-span-full flex items-center gap-1.5 tablet:col-span-4">
          <IconProjects size={12} className="text-muted-foreground" />
          <span className="text-2xs uppercase tracking-widest text-muted-foreground">Work</span>
        </div>
      </div>
      <hr className="col-span-full border-t border-border" />
      <div className="col-span-full grid grid-cols-subgrid gap-3 pt-4">
        {props.items.map((item) => (
          <WorkCard key={item.slug} item={item} />
        ))}
      </div>
    </Section>
  );
}
