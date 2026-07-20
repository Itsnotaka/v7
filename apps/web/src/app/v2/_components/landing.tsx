import type { Education, Resume } from "@workspace/data";

import { Container, Label, Section, Text, theme, Typeset } from "@v7/ui";

import { cn } from "~/utils/cn";

type Contact = {
  name: string;
  url: string;
};

function EducationList({ education }: { education: Education[] }) {
  return (
    <div>
      <Label as="h3">education</Label>
      <ul role="list" className="mt-3">
        {education.map((entry) => (
          <li key={entry.institution} className={cn("border-t py-4", theme.hairline)}>
            <Text as="p" variant="lead" className="text-primary">
              {entry.institution}
              <span className="text-muted-foreground"> / {entry.degree}</span>
            </Text>
            <Text variant="meta" className="mt-1 text-muted-foreground">
              {entry.time}
            </Text>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function About({ about, notes, education }: Pick<Resume, "about" | "notes" | "education">) {
  return (
    <Section id="about" className="pb-16 sm:pb-24">
      <Container className="mx-auto">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <Label as="h2">about</Label>
            <Typeset preset="reading" className="mt-3 max-w-[48ch] text-primary">
              <p>{about}</p>
            </Typeset>
            <ul role="list" className="mt-6 grid gap-2">
              {notes.map((note) => (
                <Text as="li" key={note.icon} variant="body">
                  {note.text}
                </Text>
              ))}
            </ul>
          </div>
          <EducationList education={education} />
        </div>
      </Container>
    </Section>
  );
}

export function Contact({ contacts }: { contacts: Contact[] }) {
  return (
    <footer className="pb-16 sm:pb-24">
      <Container className="mx-auto">
        <Label as="h2">contact</Label>
        <ul role="list" className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {contacts.map((contact) => (
            <Text as="li" key={contact.name} variant="control">
              <a
                href={contact.url}
                target={contact.url.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer"
                className={cn("text-primary", theme.link, theme.ring)}
              >
                {contact.name}
              </a>
            </Text>
          ))}
        </ul>
      </Container>
    </footer>
  );
}
