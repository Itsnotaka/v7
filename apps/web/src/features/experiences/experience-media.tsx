import type { ExperienceItem, ExperiencePreview } from "@workspace/data/experiences";

import BackgroundPlayer from "next-video/background-player";
import Image from "next/image";

import { cn } from "~/utils/cn";

function getMedia(item: ExperienceItem): ExperiencePreview {
  return (
    item.preview ?? {
      kind: "image",
      src: item.image,
      alt: item.title,
    }
  );
}

type Props = {
  item: ExperienceItem;
  sizes: string;
  className?: string;
  priority?: boolean;
};

export function ExperienceMedia(props: Props) {
  const media = getMedia(props.item);
  const style = cn("pointer-events-none w-full", props.className);

  if (media.kind === "video") {
    return <BackgroundPlayer aria-hidden="true" className={style} src={media.src} />;
  }

  return (
    <Image
      src={media.src}
      alt={media.alt ?? props.item.title}
      width={1200}
      height={630}
      sizes={props.sizes}
      priority={props.priority}
      className={style}
    />
  );
}
