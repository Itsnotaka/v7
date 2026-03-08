import type { ExperienceItem } from "@workspace/data/experiences";

import Image from "next/image";
import Link from "next/link";

import { Masonry, MasonryColumn, Section } from "~/components/page-shell";
import { cn } from "~/utils/cn";

function ExperiencePreview(props: { item: ExperienceItem; grow?: boolean }) {
  const preview = props.item.preview;
  if (preview?.kind === "video") {
    return (
      <div className={cn("overflow-hidden", props.grow && "h-full")}>
        <video
          src={preview.src}
          autoPlay
          loop
          muted
          playsInline
          className={cn(
            "pointer-events-none w-full transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transform-none",
            props.grow && "h-full object-cover",
          )}
        />
      </div>
    );
  }
  return (
    <div className={cn("overflow-hidden", props.grow && "h-full")}>
      <Image
        src={props.item.image}
        alt={props.item.title}
        width={1200}
        height={630}
        sizes="(min-width: 640px) 50vw, 100vw"
        className={cn(
          "pointer-events-none w-full transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transform-none",
          props.grow && "h-full object-cover",
        )}
      />
    </div>
  );
}

function ExperienceCard(props: { item: ExperienceItem; grow?: boolean }) {
  const meta = `${props.item.kind} - ${props.item.owner}`;

  return (
    <Link
      href={`/experiences/${props.item.slug}`}
      className={cn("group block", props.grow && "flex flex-1 flex-col")}
    >
      <article className={cn(props.grow && "flex flex-1 flex-col")}>
        <div className={cn("overflow-hidden", props.grow && "flex-1")}>
          <ExperiencePreview item={props.item} grow={props.grow} />
        </div>
        <div className="flex flex-col gap-1 pt-4 pb-2 text-pretty">
          <p className="text-2xs tracking-widest text-muted-foreground">{meta}</p>
          <h3 className="text-lg font-medium">{props.item.title}</h3>
          <p className="text-sm/5">{props.item.description}</p>
        </div>
      </article>
    </Link>
  );
}

export function ExperienceSection(props: { items: ExperienceItem[] }) {
  const lead = props.items.find((item) => item.slug === "comp-ai");
  const trail = props.items.find((item) => item.slug === "openpoke");
  const rest = props.items.filter((item) => item.slug !== "comp-ai" && item.slug !== "openpoke");
  const left = lead
    ? [lead, ...rest.filter((_, index) => index % 2 === 0)]
    : rest.filter((_, index) => index % 2 === 0);
  const right = trail
    ? [trail, ...rest.filter((_, index) => index % 2 === 1)]
    : rest.filter((_, index) => index % 2 === 1);

  return (
    <Section className="pt-12 pb-4">
      <Masonry className="col-span-full">
        <MasonryColumn>
          {left.map((item, i) => (
            <ExperienceCard key={item.slug} item={item} grow={i === left.length - 1} />
          ))}
        </MasonryColumn>
        <MasonryColumn>
          {right.map((item, i) => (
            <ExperienceCard key={item.slug} item={item} grow={i === right.length - 1} />
          ))}
        </MasonryColumn>
      </Masonry>
    </Section>
  );
}
