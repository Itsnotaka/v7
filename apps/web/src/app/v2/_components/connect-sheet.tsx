"use client";

import { Dot, Label, Text, theme } from "@v7/ui";
import { resume } from "@workspace/data";

import { cn } from "~/utils/cn";

import { Sheet } from "./sheet";

const displayName = `${resume.preferredName ?? resume.name.split(" ").at(0)} ${resume.name.split(" ").at(-1)}`;

const links = [
  { name: "Email", url: `mailto:${resume.email}` },
  { name: "Full CV", url: resume.cvUrl },
  ...resume.links,
];

function SheetSection({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "grid gap-3 border-t py-5 sm:grid-cols-[2.5rem_9rem_minmax(0,1fr)] sm:gap-4",
        theme.hairline,
      )}
    >
      <div className="flex gap-4 sm:contents">
        <Label as="span">{index}</Label>
        <Label as="h3">{title}</Label>
      </div>
      <div className="grid gap-5">{children}</div>
    </section>
  );
}

export function ConnectSheet({ children }: { children: React.ReactNode }) {
  return (
    <Sheet side="right" title="Connect" label="connect" trigger={children}>
      <div className="px-5 py-8 sm:px-6">
        <Text as="p" variant="heading">
          {displayName} is a {resume.title.toLowerCase()} based in {resume.location}.
        </Text>
        <Text as="p" variant="body" className="mt-4 text-muted-foreground">
          {resume.about} Feel free to get in touch for work, or if you just want to talk about agent
          interfaces.
        </Text>
        <ul role="list" className="mt-8 grid grid-cols-2 gap-y-2 sm:grid-cols-4">
          {links.map((link) => (
            <Text as="li" variant="control" key={link.name}>
              <a
                href={link.url}
                target={link.url.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer"
                className={cn(
                  "group flex min-h-10 items-center gap-2 text-primary",
                  theme.link,
                  theme.ring,
                )}
              >
                <Dot className="bg-primary/45 group-hover:bg-primary" />
                {link.name}
              </a>
            </Text>
          ))}
        </ul>
        <div className="mt-10">
          <SheetSection index="01" title="education">
            {resume.education.map((entry) => (
              <div key={entry.institution}>
                <Text as="p" variant="meta" className="font-medium">
                  {entry.institution}
                </Text>
                <Text as="p" variant="meta" className="text-muted-foreground">
                  {entry.degree}, {entry.time}
                </Text>
              </div>
            ))}
          </SheetSection>
          <SheetSection index="02" title="experience">
            {resume.experience.map((entry) => (
              <div key={`${entry.organization}-${entry.role}`}>
                <Text as="p" variant="meta" className="font-medium">
                  {entry.role}
                </Text>
                <Text as="p" variant="meta" className="text-muted-foreground">
                  {entry.organization}
                </Text>
                <Text as="p" variant="meta" className="text-muted-foreground">
                  {entry.time}
                  {entry.location ? ` — ${entry.location}` : null}
                </Text>
              </div>
            ))}
          </SheetSection>
        </div>
      </div>
    </Sheet>
  );
}
