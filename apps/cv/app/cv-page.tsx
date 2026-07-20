import type { ReactNode } from "react";

import { resume } from "@workspace/data";

const names = new Set(["Comp AI", "Firetiger", "PartyKit", "Interface projects"]);

const skills = [
  {
    title: "Product Design",
    items: [
      "Interface Design",
      "Interaction Design",
      "Information Architecture",
      "Design Systems",
      "Rapid Prototyping",
      "Human-Agent Interaction",
      "Real-time Collaboration",
    ],
  },
  {
    title: "Tools",
    items: ["Figma", "Cursor", "Claude Code", "Codex", "Amp", "GitHub"],
  },
  {
    title: "Development",
    items: [
      "TypeScript",
      "React",
      "Next.js",
      "AI SDKs",
      "AI Agent Harnesses",
      "Real-time Systems",
      "WebGL",
    ],
  },
];

export function CvPage() {
  const linkedInUrl = resume.links.find((l) => l.name === "LinkedIn")?.url;
  const experience = resume.experience.filter((item) => names.has(item.organization));

  return (
    <main className="isolate min-h-dvh bg-[#f3f3f2] px-6 py-10 sm:mx-auto sm:min-h-[11in] sm:w-[8.5in] sm:px-[0.34in] sm:py-[0.32in] print:min-h-[10.32in] print:w-auto print:p-0">
      <header className="mb-12 grid gap-8 sm:grid-cols-[2.1in_minmax(0,1fr)] sm:gap-x-[0.25in] sm:gap-y-0 print:mb-8 print:grid-cols-[2.1in_minmax(0,1fr)] print:gap-x-[0.25in] print:gap-y-0">
        <div>
          <h1 className="text-5xl font-semibold tracking-tight whitespace-nowrap">Daniel Fu</h1>
        </div>
        <div className="grid min-h-[1.48in] grid-cols-1 gap-8 border-b border-black/15 pb-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-6 print:grid-cols-[minmax(0,1fr)_auto] print:gap-6">
          <div className="grid content-start gap-0 text-lg/5">
            <a
              href="https://nameisdaniel.com"
              rel="noopener noreferrer"
              target="_blank"
              className="w-fit font-semibold underline underline-offset-4"
            >
              Site: nameisdaniel.com
            </a>
            <p className="text-black/75">{resume.title}</p>
          </div>
          <div className="grid content-between gap-2 sm:justify-items-end print:justify-items-end">
            <address className="grid content-start gap-0 text-lg/5 not-italic">
              <a href={`mailto:${resume.email}`}>{resume.email}</a>
              <a href={`tel:${resume.phone}`}>{resume.phone}</a>
              {linkedInUrl ? (
                <a href={linkedInUrl} rel="noopener noreferrer" target="_blank">
                  LinkedIn @nameisdaniel
                </a>
              ) : null}
            </address>
            {/* TODO: Add Daniel's identity mark here. Keep it within the reserved 0.55in × 0.55in area. */}
            <div aria-hidden="true" className="hidden size-[0.55in] sm:block print:block" />
          </div>
        </div>
      </header>

      <div className="grid gap-8 print:gap-6">
        <CvSection label="Experiences">
          <div className="grid gap-6 print:gap-5">
            {experience.map((item) => (
              <article key={`${item.organization}-${item.time}`} className="break-inside-avoid">
                <h3 className="text-lg font-semibold text-pretty">
                  {item.organization}
                  {item.organization === "Interface projects" ? "" : `, ${item.role}`}
                </h3>
                <p className="text-sm/4 text-black/45">
                  <time className="tabular-nums">{item.time.replaceAll(" – ", "–")}</time>
                </p>
                {item.bullets?.length ? (
                  <p className="text-sm/4 text-pretty">
                    <ResumeBulletSegments text={item.bullets.join(" ")} />
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </CvSection>

        <CvSection label="Education">
          <article className="break-inside-avoid">
            <h3 className="text-lg font-semibold text-pretty">
              {resume.education[0]?.institution}
            </h3>
            <p className="text-sm/4 text-black/45">{resume.education[0]?.time}</p>
            <p className="mt-1 text-sm/4 text-pretty">{resume.education[0]?.degree}</p>
          </article>
        </CvSection>

        <CvSection label="Skills">
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-3 sm:gap-8 print:grid-cols-3 print:gap-8">
            {skills.map((group) => (
              <div key={group.title}>
                <h3 className="text-base font-semibold">{group.title}</h3>
                <ul role="list" className="mt-2 text-sm/4 text-black/45">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CvSection>
      </div>
    </main>
  );
}

function CvSection(props: { children: ReactNode; label: string }) {
  return (
    <section className="grid gap-5 sm:grid-cols-[2.1in_minmax(0,1fr)] sm:gap-x-[0.25in] sm:gap-y-0 print:grid-cols-[2.1in_minmax(0,1fr)] print:gap-x-[0.25in] print:gap-y-0">
      <h2 className="text-base/5 font-medium tracking-wide text-black/35 uppercase [font-family:ui-monospace,SFMono-Regular,Menlo,monospace]">
        {props.label}
      </h2>
      <div className="min-w-0">{props.children}</div>
    </section>
  );
}

function ResumeBulletSegments(props: { text: string }) {
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  const text = props.text;
  const out: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = linkPattern.exec(text)) !== null) {
    const label = match[1];
    const href = match[2];
    if (label === undefined || href === undefined) {
      continue;
    }
    if (match.index > last) {
      out.push(<BoldSegments key={key++} text={text.slice(last, match.index)} />);
    }
    out.push(
      <a key={key++} href={href} rel="noopener noreferrer" target="_blank">
        <BoldSegments text={label} />
      </a>,
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    out.push(<BoldSegments key={key++} text={text.slice(last)} />);
  }
  if (out.length === 0) {
    return <BoldSegments text={text} />;
  }
  return <>{out}</>;
}

function BoldSegments(props: { text: string }) {
  const chunks = props.text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {chunks.map((chunk, index) => {
        if (chunk.startsWith("**") && chunk.endsWith("**")) {
          return (
            <strong key={index} className="font-semibold text-foreground">
              {chunk.slice(2, -2)}
            </strong>
          );
        }
        return <span key={index}>{chunk}</span>;
      })}
    </>
  );
}
