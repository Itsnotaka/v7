"use client";

import {
  IconBuildings,
  IconSchool,
  IconCupHot,
  IconSteeringWheel,
  IconSuitcase,
  IconDices,
  IconArrowUpRight,
  IconEmojiLol,
} from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import { resume, getWebsiteTimeline, type TimelineGroup, type TimelineRow } from "@workspace/data";
import { useTextParams, type TextParams } from "~/components/text-params-provider";
import Image from "next/image";
import Link from "next/link";

const groups = getWebsiteTimeline();

const shots: { src: string; alt: string }[] = [
  {
    src: "https://om32oh4l85.ufs.sh/f/ZSTWlVhf6QMwW33F2UTzmu7lDVJQ28FcBSh90URsvG5krpaY",
    alt: "person sitting on mat",
  },
  {
    src: "https://om32oh4l85.ufs.sh/f/ZSTWlVhf6QMwDsKFGuJMdZ2fynTw1rGm6oRiUNsbWzepgJL5",
    alt: "pink flowers in bloom",
  },
  {
    src: "https://om32oh4l85.ufs.sh/f/ZSTWlVhf6QMwioXwVGWqIcZ947QvbErlHma8BFgxDAy53eoR",
    alt: "hot air balloons cityscape",
  },
  {
    src: "https://om32oh4l85.ufs.sh/f/ZSTWlVhf6QMwndnYVJr4J8bmsHBhyNfIVk6WMp1cEratO0ow",
    alt: "art supplies and paintings",
  },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  chess: IconDices,
  coffee: IconCupHot,
  f1: IconSteeringWheel,
  fashion: IconSuitcase,
};

function DefaultIcon(props: { className?: string }) {
  return <IconDices className={props.className} />;
}

const sizes =
  "(min-width: 810px) max((min(100vw, 1600px) - 72px) / 4, 1px), max((min(100vw, 1600px) - 48px) / 2, 50px)";

function Timeline(props: TimelineGroup & { params: TextParams }) {
  const p = props.params;
  const Icon = props.title === "Experience" ? IconBuildings : IconSchool;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <h2
          className="font-serif text-lg text-foreground"
          style={{ letterSpacing: `${p.heading.tracking}em`, lineHeight: p.heading.lineHeight }}
        >
          {props.title}
        </h2>
      </div>
      <div className="flex flex-col gap-2">
        {props.rows.map((row: TimelineRow) => (
          <div
            key={row.title}
            className="group flex items-start justify-between gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted/50"
          >
            <div className="flex flex-col gap-0.5">
              <p
                className="text-sm font-medium text-foreground"
                style={{ letterSpacing: `${p.body.tracking}em`, lineHeight: p.body.lineHeight }}
              >
                {row.title.split(" / ")[0]}
              </p>
              <p
                className="text-xs text-muted-foreground"
                style={{ letterSpacing: `${p.body.tracking}em`, lineHeight: p.body.lineHeight }}
              >
                {row.title.split(" / ")[1]}
              </p>
            </div>
            <p
              className="shrink-0 font-mono text-xs text-muted-foreground"
              style={{
                letterSpacing: `${p.caption.tracking}em`,
                lineHeight: p.caption.lineHeight,
              }}
            >
              {row.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Gallery() {
  return (
    <section className="w-full">
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-2 gap-3 px-4.5 py-4.5 tablet:grid-cols-4">
        {shots.map((item) => (
          <div key={item.alt} className="relative aspect-[2/3] overflow-hidden">
            <Image
              quality={90}
              src={item.src}
              alt={item.alt}
              fill
              sizes={sizes}
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export function AboutPage() {
  const params = useTextParams();

  return (
    <div className="flex min-h-dvh w-full flex-col bg-background">
      <section className="w-full">
        <div className="mx-auto grid w-full max-w-[1440px] gap-8 px-4.5 py-8 tablet:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h1
                className="font-serif text-3xl text-foreground"
                style={{
                  letterSpacing: `${params.heading.tracking}em`,
                  lineHeight: params.heading.lineHeight,
                }}
              >
                <span className="flex items-center gap-2">
                  Hey, I&apos;m Daniel <IconEmojiLol className="h-6 w-6" />
                </span>
              </h1>
              <div
                className="flex flex-col gap-4 font-sans text-sm leading-relaxed text-foreground/90"
                style={{
                  letterSpacing: `${params.body.tracking}em`,
                  lineHeight: params.body.lineHeight,
                }}
              >
                <p>
                  I&apos;m a design engineer based between Hong Kong and San Francisco. Currently
                  pursuing my MS in Computer Engineering with a focus on Human-Computer Interaction
                  at{" "}
                  <Link
                    href="https://nyu.edu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 transition-colors hover:text-foreground"
                  >
                    NYU
                  </Link>
                  .
                </p>
                <p>
                  I build systems that help people complete complex, real-time work with less
                  friction. Recently obsessed with AI agent interfaces and making computers feel
                  more human.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                style={{ letterSpacing: `${params.caption.tracking}em` }}
              >
                When I&apos;m not designing
              </p>
              <div className="grid grid-cols-1 gap-2 tablet:grid-cols-2">
                {resume.notes.map((note) => {
                  const Icon = iconMap[note.icon] || DefaultIcon;
                  return (
                    <div
                      key={note.icon}
                      className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50"
                    >
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <p
                        className="text-sm text-foreground/80"
                        style={{
                          letterSpacing: `${params.body.tracking}em`,
                          lineHeight: params.body.lineHeight,
                        }}
                      >
                        {note.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                style={{ letterSpacing: `${params.caption.tracking}em` }}
              >
                Connect
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href={resume.x ? `https://x.com/${resume.x.replace("@", "")}` : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-1 text-sm text-foreground/80 transition-colors hover:text-foreground"
                >
                  X (Twitter)
                  <IconArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href={resume.links.find((link) => link.name === "LinkedIn")?.url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-1 text-sm text-foreground/80 transition-colors hover:text-foreground"
                >
                  LinkedIn
                  <IconArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href={resume.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-1 text-sm text-foreground/80 transition-colors hover:text-foreground"
                >
                  Full CV
                  <IconArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                <span className="text-sm text-muted-foreground">
                  {resume.email.replace("@", "[at]")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {groups.map((item: TimelineGroup) => (
              <Timeline key={item.title} title={item.title} rows={item.rows} params={params} />
            ))}
          </div>
        </div>
      </section>

      <Gallery />
    </div>
  );
}
