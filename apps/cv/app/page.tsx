import { resume } from "@workspace/data";

export default function Page() {
  const linkedInUrl = resume.links.find((l) => l.name === "LinkedIn")?.url;

  return (
    <main className="mx-auto max-w-2xl px-8 py-12 md:max-w-3xl md:px-12 md:py-16 print:max-w-none print:p-0">
      <header className="mb-10 md:mb-12 print:mb-7">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl print:text-2xl print:leading-tight">
          {resume.name}
        </h1>
        <a
          href="https://nameisdaniel.com"
          rel="noopener noreferrer"
          target="_blank"
          className="mt-2 block text-sm font-normal opacity-50 underline underline-offset-2 md:text-base print:mt-1 print:text-[11px]"
        >
          nameisdaniel.com
        </a>
      </header>

      <div className="grid grid-cols-[minmax(0,150px)_1fr] gap-x-8 md:grid-cols-[minmax(0,190px)_1fr] md:gap-x-10 print:grid-cols-[minmax(0,175px)_1fr] print:gap-x-7">
        {/* Left sidebar */}
        <div className="flex flex-col gap-10 md:gap-12 print:gap-6">
          <section>
            <SectionLabel>About</SectionLabel>
            <p className="text-base font-normal leading-relaxed tracking-tight text-balance md:text-lg print:text-[11px] print:leading-snug">
              {resume.about}
            </p>
          </section>

          <section>
            <SectionLabel>Contact</SectionLabel>
            <div className="flex flex-col gap-1 text-base font-normal leading-relaxed md:text-lg print:gap-1.5 print:text-[11px] print:leading-snug">
              {linkedInUrl ? (
                <a
                  href={linkedInUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="underline underline-offset-2"
                >
                  LinkedIn
                </a>
              ) : null}
              <a href={`mailto:${resume.email}`} className="underline underline-offset-2">
                Email
              </a>
              <a href={`tel:${resume.phone}`} className="underline underline-offset-2">
                Phone
              </a>
            </div>
          </section>
        </div>

        {/* Right content */}
        <div className="flex flex-col gap-8 md:gap-10 print:gap-7">
          <section>
            <SectionLabel>Experience</SectionLabel>
            <div className="flex flex-col gap-8 md:gap-10 print:gap-5">
              {resume.experience.map((item) => (
                <article
                  key={`${item.organization}-${item.time}`}
                  className="grid grid-cols-[minmax(0,130px)_1fr] gap-x-6 md:grid-cols-[minmax(0,150px)_1fr] print:grid-cols-[minmax(0,138px)_1fr] print:gap-x-4 print:break-inside-auto"
                >
                  <div className="text-sm font-normal leading-snug md:text-base print:text-[11px] print:leading-snug">
                    <time className="tabular-nums opacity-40">{item.time}</time>
                    {item.location ? <p className="mt-0.5 opacity-30">{item.location}</p> : null}
                  </div>
                  <div>
                    <h3 className="text-sm font-normal leading-snug md:text-base print:text-[11px] print:leading-snug">
                      <span className="font-medium">
                        {item.url ? (
                          <a
                            href={item.url}
                            rel="noopener noreferrer"
                            target="_blank"
                            className="underline underline-offset-2"
                          >
                            {item.organization}
                          </a>
                        ) : (
                          item.organization
                        )}
                      </span>
                      <span className="opacity-50">
                        {" — "}
                        {item.role}
                        {item.context ? ` (${item.context})` : ""}
                      </span>
                    </h3>
                    {item.bullets?.length ? (
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-normal leading-relaxed tracking-tight opacity-80 marker:text-foreground/40 md:text-base print:mt-1.5 print:space-y-0.5 print:pl-4 print:text-[11px] print:leading-snug print:opacity-90">
                        {item.bullets.map((bullet, index) => (
                          <li key={index}>
                            <ResumeBulletSegments text={bullet} />
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section>
            <SectionLabel>Education</SectionLabel>
            <div className="flex flex-col gap-6 md:gap-8 print:gap-3">
              {resume.education.map((item) => (
                <article
                  key={`${item.institution}-${item.time}`}
                  className="grid grid-cols-[minmax(0,130px)_1fr] gap-x-6 md:grid-cols-[minmax(0,150px)_1fr] print:grid-cols-[minmax(0,138px)_1fr] print:gap-x-4 print:break-inside-auto"
                >
                  <div className="text-sm font-normal leading-snug md:text-base print:text-[11px] print:leading-snug">
                    <time className="tabular-nums opacity-40">{item.time}</time>
                    {item.location ? <p className="mt-0.5 opacity-30">{item.location}</p> : null}
                  </div>
                  <div>
                    <p className="text-sm font-normal leading-snug md:text-base print:text-[11px] print:leading-snug">
                      <span className="font-medium">{item.institution}</span>
                      <span className="opacity-50"> — {item.degree}</span>
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

/** Renders `[label](url)` as links and `**segment**` as semibold (label may include `**`). */
function ResumeBulletSegments(props: { text: string }) {
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  const text = props.text;
  const out: React.ReactNode[] = [];
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
      <a
        key={key++}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
        className="font-semibold text-foreground underline underline-offset-2"
      >
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 border-b border-black/[0.08] pb-1.5 text-sm font-normal tracking-tight opacity-60 md:text-base print:mb-2.5 print:pb-1 print:text-[11px] print:leading-none">
      {children}
    </h2>
  );
}
