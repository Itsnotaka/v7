import type { ExperienceItem, ExperiencePreview } from "@workspace/data/experiences";

import BackgroundPlayer from "next-video/background-player";
import Image from "next/image";
import Link from "next/link";

import { Section } from "~/components/page-shell";

function ExperiencePreview(props: { item: ExperienceItem }) {
  const media: ExperiencePreview = props.item.preview ?? {
    kind: "image",
    src: props.item.image,
    alt: props.item.title,
  };

  if (media.kind === "video") {
    return (
      <BackgroundPlayer
        aria-hidden="true"
        className="pointer-events-none aspect-[4/3] w-full overflow-hidden bg-muted transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transform-none"
        src={media.src}
        poster={media.poster ?? props.item.image}
      />
    );
  }

  return (
    <Image
      src={media.src}
      alt={media.alt ?? props.item.title}
      width={1200}
      height={900}
      className="pointer-events-none aspect-[4/3] h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transform-none"
    />
  );
}

function ExperienceCard(props: { item: ExperienceItem }) {
  const meta = `${props.item.kind} - ${props.item.owner}`;

  return (
    <Link href={`/experiences/${props.item.slug}`} className="group block">
      <article>
        <div className="overflow-hidden">
          <ExperiencePreview item={props.item} />
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
      <div className="col-span-full flex flex-col gap-4 sm:hidden">
        {props.items.map((item) => (
          <ExperienceCard key={item.slug} item={item} />
        ))}
      </div>
      <div className="col-span-full hidden gap-4 sm:grid sm:grid-cols-2">
        <div className="flex flex-col gap-6">
          {left.map((item) => (
            <ExperienceCard key={item.slug} item={item} />
          ))}
        </div>
        <div className="flex flex-col gap-6">
          {right.map((item) => (
            <ExperienceCard key={item.slug} item={item} />
          ))}
        </div>
      </div>
    </Section>
  );
}
