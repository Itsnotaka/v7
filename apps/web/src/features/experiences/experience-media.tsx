import type { ExperienceItem, ExperiencePreview } from "@workspace/data/experiences";

import BackgroundPlayer from "next-video/background-player";
import Image from "next/image";

import { cn } from "~/utils/cn";

function getMedia(item: ExperienceItem): ExperiencePreview {
  return item.preview ?? {
    kind: "image",
    src: item.image,
    alt: item.title,
  };
}

type Props = {
  item: ExperienceItem;
  sizes: string;
  className?: string;
  priority?: boolean;
};

export function ExperienceMedia(props: Props) {
  const media = getMedia(props.item);
  const style = cn("pointer-events-none h-full w-full object-cover", props.className);

  if (media.kind === "video") {
    return (
      <BackgroundPlayer
        aria-hidden="true"
        className={cn("bg-muted", style)}
        src={media.src}
        poster={media.poster ?? props.item.image}
      />
    );
  }

  return (
    <Image
      src={media.src}
      alt={media.alt ?? props.item.title}
      fill
      sizes={props.sizes}
      priority={props.priority}
      className={style}
    />
  );
}
