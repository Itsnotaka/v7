import type { ExperienceItem, ExperiencePreview } from "@workspace/data/experiences";

import BackgroundPlayer from "next-video/background-player";
import Image from "next/image";

import { getMockup } from "~/features/experiences/mockups";
import { cn } from "~/utils/cn";

function getMedia(item: ExperienceItem): ExperiencePreview | null {
  if (item.preview) return item.preview;
  if (item.image) return { kind: "image", src: item.image, alt: item.title };
  return null;
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
  if (!media) return null;

  if (media.kind === "mockup") {
    const fitHeight = props.videoFit === "contain";
    return (
      <div
        className={cn(
          "pointer-events-none flex select-none items-center justify-center",
          props.className,
        )}
        aria-hidden="true"
      >
        <div
          className={fitHeight ? "h-full" : "w-full"}
          style={{ aspectRatio: media.aspect ?? 16 / 10 }}
        >
          {getMockup(media.mockup)}
        </div>
      </div>
    );
  }

  if (media.kind === "video") {
    const fit = props.videoFit ?? "cover";
    const videoFitClass = fit === "cover" ? "[&_video]:object-cover!" : "[&_video]:object-contain!";

    return (
      <div
        className={cn(
          "pointer-events-none relative overflow-hidden [&_video]:h-full [&_video]:w-full",
          videoFitClass,
          props.className,
        )}
        style={media.aspect ? { aspectRatio: media.aspect } : undefined}
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
      className={cn("pointer-events-none", props.className)}
    />
  );
}
