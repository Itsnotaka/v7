"use client";

import { resume, getWebsiteTimeline, type TimelineGroup, type TimelineRow } from "@workspace/data";
import {
  IconHotDrinkCup,
  IconSteeringWheel,
  IconFashion,
} from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import Image from "next/image";
import Link from "next/link";

import { AspectRatio } from "~/components/ui/aspect-ratio";
import {
  PageBody,
  PageCaption,
  PageCopy,
  PageHeading,
  PageSection,
  SectionHeading,
} from "~/components/page-shell";

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

function Timeline(props: TimelineGroup) {
  return (
    <div className="flex flex-col gap-1.5">
      <SectionHeading>{props.title}</SectionHeading>
      <div className="flex flex-col gap-1.5">
        {props.rows.map((row: TimelineRow, i: number) => (
          <div key={row.title} className="flex flex-col gap-1.5">
            <div className="flex items-start justify-between gap-3">
              <PageBody>{row.title}</PageBody>
              <div className="shrink-0">
                <PageCaption>{row.time}</PageCaption>
              </div>
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
    <PageSection>
      <div className="col-span-8 grid grid-cols-2 gap-3 tablet:grid-cols-4">
        {shots.map((item, index) => (
          <AspectRatio key={index} ratio={2 / 3} className="overflow-hidden">
            <Image
              quality={90}
              src={item.src}
              alt={`shot ${index + 1} of the gallery`}
              fill
              sizes={sizes}
              className="object-cover"
            />
          </AspectRatio>
        ))}
      </div>
    </PageSection>
  );
}

export function AboutPage() {
  return (
    <>
      <PageSection>
        <div className="col-span-8 grid gap-6 tablet:grid-cols-2">
          <div className="flex flex-col gap-4">
            <PageHeading>Hello Hello, I'm Daniel. •‿•</PageHeading>
            <PageCopy>
              <p>
                I'm a design engineer currently pursuing a Master of Science in Computer Engineering
                with a concentration in Human-Computer Interaction at{" "}
                <span className="underline underline-offset-2">New York University</span>.
              </p>
              <p>Outside of design I'm:</p>
              <ul className="flex flex-col gap-0">
                {resume.notes.map((note) => (
                  <li key={note.icon} className="flex items-start gap-2">
                    {note.icon === "chess" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="shrink-0 mt-0.5"
                      >
                        <path d="M5 20a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" />
                        <path d="M16.5 18c1-2 2.5-5 2.5-9a7 7 0 0 0-7-7H6.635a1 1 0 0 0-.768 1.64L7 5l-2.32 5.802a2 2 0 0 0 .95 2.526l2.87 1.456" />
                        <path d="m15 5 1.425-1.425" />
                        <path d="m17 8 1.53-1.53" />
                        <path d="M9.713 12.185 7 18" />
                      </svg>
                    ) : note.icon === "cafe" ? (
                      <IconHotDrinkCup size={16} className="shrink-0 mt-0.5" />
                    ) : note.icon === "f1" ? (
                      <IconSteeringWheel size={16} className="shrink-0 mt-0.5" />
                    ) : (
                      <IconFashion size={16} className="shrink-0 mt-0.5" />
                    )}
                    <span>{note.text}</span>
                  </li>
                ))}
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
            </PageCopy>
          </div>

          <div className="flex flex-col gap-4">
            {groups.map((item: TimelineGroup) => (
              <Timeline key={item.title} title={item.title} rows={item.rows} />
            ))}
          </div>
        </div>
      </PageSection>

      <Gallery />
    </>
  );
}
