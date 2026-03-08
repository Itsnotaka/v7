import { resume } from "@workspace/data";

export default function Page() {
  const x = resume.x;
  const xHref = x ? `https://x.com/${x.startsWith("@") ? x.slice(1) : x}` : null;
  const xLabel = x ? (x.startsWith("@") ? x : `@${x}`) : null;

  return (
    <main className="mx-auto max-w-[700px] px-6 py-14 print:max-w-none print:px-0 print:py-0">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">{resume.name}</h1>
        <p className="mt-1 text-base/6 tracking-wide opacity-70">{resume.title}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs/4 tracking-wide print:mt-2">
          <span>{resume.location}</span>
          <Dot />
          <a href={`mailto:${resume.email}`}>{resume.email}</a>
          <Dot />
          <a href={`tel:${resume.phone}`}>{resume.phone}</a>
          {xHref ? (
            <>
              <Dot />
              <a href={xHref} rel="noopener noreferrer" target="_blank">
                {xLabel}
              </a>
            </>
          ) : null}
          {resume.links.map((item) => (
            <span key={item.url} className="contents">
              <Dot />
              <a href={item.url} rel="noopener noreferrer" target="_blank">
                {item.name}
              </a>
            </span>
          ))}
        </div>
      </header>

      <div className="mt-10 flex flex-col gap-8 print:mt-5 print:gap-4">
        <section aria-labelledby="summary-heading">
          <Heading id="summary">Summary</Heading>
          <p className="text-sm/6 tracking-wide text-balance print:text-xs/5">{resume.about}</p>
        </section>

        <section aria-labelledby="experience-heading">
          <Heading id="experience">Experience</Heading>
          <div className="flex flex-col gap-5 print:gap-2">
            {resume.experience.map((item) => (
              <article
                key={`${item.organization}-${item.time}`}
                className="print:break-inside-avoid"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-sm/5 font-semibold tracking-wide">
                    {item.url ? (
                      <a href={item.url} rel="noopener noreferrer" target="_blank">
                        {item.organization}
                      </a>
                    ) : (
                      item.organization
                    )}
                    <span className="font-normal opacity-60"> — {item.role}</span>
                  </h3>
                  <time className="shrink-0 text-xs/4 tabular-nums tracking-wide opacity-50">
                    {item.time}
                  </time>
                </div>
                {item.bullets?.length ? (
                  <ul className="mt-1.5 flex flex-col gap-1 text-xs/5 tracking-wide print:mt-1 print:gap-0.5 print:text-xs/4">
                    {item.bullets.map((line) => (
                      <li
                        key={line}
                        className="relative pl-3 opacity-80 before:absolute before:left-0 before:opacity-40 before:content-['·']"
                      >
                        {line}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="education-heading">
          <Heading id="education">Education</Heading>
          <div className="flex flex-col gap-2.5 print:gap-1">
            {resume.education.map((item) => (
              <div
                key={`${item.institution}-${item.time}`}
                className="flex items-baseline justify-between gap-4"
              >
                <p className="text-sm/5 tracking-wide">
                  <span className="font-semibold">{item.institution}</span>
                  <span className="opacity-60"> — {item.degree}</span>
                </p>
                <time className="shrink-0 text-xs/4 tabular-nums tracking-wide opacity-50">
                  {item.time}
                </time>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Dot() {
  return (
    <span className="opacity-30" aria-hidden>
      ·
    </span>
  );
}

function Heading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={`${id}-heading`}
      className="mb-3 text-2xs/3 font-semibold uppercase tracking-widest opacity-40 print:mb-1.5"
    >
      {children}
    </h2>
  );
}
