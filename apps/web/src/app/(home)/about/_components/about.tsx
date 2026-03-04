"use client";

import { resume, getWebsiteTimeline, type TimelineGroup, type TimelineRow } from "@workspace/data";
import { useTextParams, type TextParams } from "~/components/text-params-provider";
import Image from "next/image";
import Link from "next/link";

const groups = getWebsiteTimeline();

const shots: { src: string }[] = [
  {
    src: "https://om32oh4l85.ufs.sh/f/ZSTWlVhf6QMwW33F2UTzmu7lDVJQ28FcBSh90URsvG5krpaY",
  },
  {
    src: "https://om32oh4l85.ufs.sh/f/ZSTWlVhf6QMwDsKFGuJMdZ2fynTw1rGm6oRiUNsbWzepgJL5",
  },
  {
    src: "https://om32oh4l85.ufs.sh/f/ZSTWlVhf6QMwioXwVGWqIcZ947QvbErlHma8BFgxDAy53eoR",
  },
  {
    src: "https://om32oh4l85.ufs.sh/f/ZSTWlVhf6QMwndnYVJr4J8bmsHBhyNfIVk6WMp1cEratO0ow",
  },
];

const sizes =
  "(min-width: 810px) max((min(100vw, 1600px) - 72px) / 4, 1px), max((min(100vw, 1600px) - 48px) / 2, 50px)";

function Timeline(props: TimelineGroup & { params: TextParams }) {
  const p = props.params;
  return (
    <div className="flex flex-col gap-1.5">
      <h2
        className="font-serif text-lg text-foreground"
        style={{ letterSpacing: `${p.heading.tracking}em`, lineHeight: p.heading.lineHeight }}
      >
        {props.title}
      </h2>
      <div className="flex flex-col gap-1.5">
        {props.rows.map((row: TimelineRow, i: number) => (
          <div key={row.title} className="flex flex-col gap-1.5">
            <div className="flex items-start justify-between gap-3">
              <p
                className="text-sm text-foreground/90"
                style={{ letterSpacing: `${p.body.tracking}em`, lineHeight: p.body.lineHeight }}
              >
                {row.title}
              </p>
              <p
                className="shrink-0 font-mono text-xs text-foreground/90"
                style={{
                  letterSpacing: `${p.caption.tracking}em`,
                  lineHeight: p.caption.lineHeight,
                }}
              >
                {row.time}
              </p>
            </div>
            {i + 1 < props.rows.length ? (
              <div className="h-px w-full bg-muted-foreground/45 tablet:bg-border" />
            ) : null}
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
        {shots.map((item, index) => (
          <div key={index} className="relative aspect-[2/3] overflow-hidden">
            <Image
              quality={90}
              src={item.src}
              alt={`shot ${index + 1} of the gallery`}
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
        <div className="mx-auto grid w-full max-w-[1440px] gap-6 px-4.5 py-4.5 tablet:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h1
              className="font-serif text-2xl text-foreground"
              style={{
                letterSpacing: `${params.heading.tracking}em`,
                lineHeight: params.heading.lineHeight,
              }}
            >
              Hello Hello, I'm Daniel. •‿•
            </h1>
            <div
              className="flex flex-col gap-4 font-sans text-sm text-foreground/90"
              style={{
                letterSpacing: `${params.body.tracking}em`,
                lineHeight: params.body.lineHeight,
              }}
            >
              <p>
                I'm a design engineer currently pursuing a Master of Science in Computer Engineering
                with a concentration in Human-Computer Interaction at{" "}
                <span className="underline underline-offset-2">New York University</span>.
              </p>
              <p>Outside of design I'm:</p>
              <ul className="flex flex-col gap-0 pl-4.5">
                {resume.notes}
              </ul>
              <p>
                I post my work on{" "}
                <Link
                  href={resume.x ? `https://x.com/${resume.x.replace("@", "")}` : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                >
                  X
                </Link>
                . Say hello at {resume.email.replace("@", "[at]")} or via{" "}
                <Link
                  href={resume.links.find((link) => link.name === "LinkedIn")?.url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                >
                  LinkedIn
                </Link>
                . Full CV at{" "}
                <Link
                  href={resume.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                >
                  cv.nameisdaniel.com
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
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
