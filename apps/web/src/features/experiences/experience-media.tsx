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
  videoFit?: "cover" | "contain";
};

export function ExperienceMedia(props: Props) {
  const media = getMedia(props.item);
  const style = cn("pointer-events-none w-full", props.className);
  const fit = props.videoFit ?? "cover";
  const videoFitClass = fit === "cover" ? "[&_video]:object-cover" : "[&_video]:object-contain";

  if (media.kind === "video") {
    return (
      <div
        className={cn(
          "pointer-events-none relative h-full min-h-0 w-full overflow-hidden [&_video]:h-full [&_video]:w-full",
          videoFitClass,
          props.className,
        )}
      >
        <BackgroundPlayer
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 size-full min-h-0 [&_video]:h-full [&_video]:w-full",
            videoFitClass,
          )}
          src={media.src}
        />
      </div>
    );
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
