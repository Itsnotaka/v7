import Image from "next/image";

import type { StoryMedia } from "../portfolio-content";

type Props = {
  media: StoryMedia;
  priority?: boolean;
  className?: string;
};

function ratio(media: StoryMedia): string {
  if (media.ratio === "ultra") {
    return "aspect-[16/7]";
  }

  if (media.ratio === "square") {
    return "aspect-square";
  }

  return "aspect-[4/3]";
}

function shell(props: Props): string {
  const base =
    "group relative overflow-hidden rounded-[2rem] border border-[color:var(--portfolio-line)] bg-[color:var(--portfolio-surface)] shadow-[0_50px_120px_-68px_var(--portfolio-shadow)]";

  if (props.className) {
    return `${base} ${ratio(props.media)} ${props.className}`;
  }

  return `${base} ${ratio(props.media)}`;
}

export function MediaStage(props: Props) {
  if (props.media.kind === "image" && props.media.src) {
    return (
      <figure className={shell(props)}>
        <div
          aria-hidden
          className="absolute inset-0 z-10 bg-[linear-gradient(130deg,transparent_12%,var(--portfolio-accent-soft)_45%,transparent_78%)] opacity-35 motion-safe:transition-opacity motion-safe:duration-500 motion-safe:ease-out group-hover:opacity-55"
        />
        <Image
          src={props.media.src}
          alt={props.media.alt}
          fill
          priority={props.priority}
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover opacity-90 motion-safe:transition-[transform,opacity] motion-safe:duration-700 motion-safe:ease-out group-hover:scale-[1.04] group-hover:opacity-100 motion-reduce:transition-none"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_right,var(--portfolio-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--portfolio-line)_1px,transparent_1px)] bg-[size:54px_54px] opacity-20"
        />
        <figcaption className="absolute right-5 bottom-5 rounded-full border border-[color:var(--portfolio-line)] bg-[color:var(--portfolio-overlay)] px-3 py-1 font-mono text-[10px] tracking-[0.16em] text-[color:var(--portfolio-muted)] uppercase">
          {props.media.slot}
        </figcaption>
      </figure>
    );
  }

  if (props.media.kind === "video" && props.media.src) {
    return (
      <figure className={shell(props)}>
        <video
          className="h-full w-full object-cover motion-safe:transition-[transform,opacity] motion-safe:duration-700 motion-safe:ease-out group-hover:scale-[1.03]"
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          poster={props.media.poster}
          aria-label={props.media.alt}
        >
          <source src={props.media.src} />
        </video>
        <div
          aria-hidden
          className="absolute inset-0 z-10 bg-[linear-gradient(130deg,transparent_12%,var(--portfolio-accent-soft)_45%,transparent_78%)] opacity-35"
        />
        <figcaption className="absolute right-5 bottom-5 rounded-full border border-[color:var(--portfolio-line)] bg-[color:var(--portfolio-overlay)] px-3 py-1 font-mono text-[10px] tracking-[0.16em] text-[color:var(--portfolio-muted)] uppercase">
          {props.media.slot}
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className={shell(props)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,var(--portfolio-accent-soft),transparent_48%),linear-gradient(150deg,var(--portfolio-overlay)_0%,transparent_58%),linear-gradient(200deg,var(--portfolio-surface)_10%,var(--portfolio-bg)_90%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--portfolio-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--portfolio-line)_1px,transparent_1px)] bg-[size:48px_48px] opacity-35" />
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="rounded-full border border-[color:var(--portfolio-line)] bg-[color:var(--portfolio-overlay)] px-5 py-2 text-center font-mono text-[11px] tracking-[0.2em] text-[color:var(--portfolio-ink)] uppercase">
          Replace slot: {props.media.slot}
        </p>
      </div>
      <figcaption className="absolute right-5 bottom-5 rounded-full border border-[color:var(--portfolio-line)] bg-[color:var(--portfolio-overlay)] px-3 py-1 font-mono text-[10px] tracking-[0.16em] text-[color:var(--portfolio-muted)] uppercase">
        {props.media.kind} placeholder
      </figcaption>
    </figure>
  );
}
