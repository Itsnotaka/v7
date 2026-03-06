import { resume } from "@workspace/data";

export default function Page() {
  const x = resume.x;
  const xHref = x ? `https://x.com/${x.startsWith("@") ? x.slice(1) : x}` : null;
  const xLabel = x ? (x.startsWith("@") ? x : `@${x}`) : null;

  return (
    <main className="mx-auto max-w-[700px] px-5 py-10 print:max-w-none print:p-0">
      <header>
        <h1 className="text-2xl/7 font-bold tracking-[-0.03em]">{resume.name}</h1>
        <p className="mt-0.5 text-base/5 tracking-[-0.011em]">{resume.title}</p>
        <p className="mt-2 text-xs/4 tracking-[-0.006em] print:mt-1">
          {resume.location}
          {" · "}
          <a href={`mailto:${resume.email}`}>{resume.email}</a>
          {" · "}
          <a href={`tel:${resume.phone}`}>{resume.phone}</a>
          {xHref ? (
            <>
              {" · "}
              <a href={xHref} rel="noopener noreferrer" target="_blank">
                {xLabel}
              </a>
            </>
          ) : null}
          {resume.links.map((item) => (
            <span key={item.url}>
              {" · "}
              <a href={item.url} rel="noopener noreferrer" target="_blank">
                {item.name}
              </a>
            </span>
          ))}
        </p>
      </header>

      <div className="mt-6 flex flex-col gap-5 print:mt-4 print:gap-3">
        <section aria-labelledby="summary-heading">
          <Heading id="summary">Summary</Heading>
          <p className="text-sm/5 tracking-[-0.011em] print:text-xs/4">{resume.about}</p>
        </section>

        <section aria-labelledby="experience-heading">
          <Heading id="experience">Experience</Heading>
          <div className="flex flex-col gap-3 print:gap-1.5">
            {resume.experience.map((item) => (
              <article
                key={`${item.organization}-${item.time}`}
                className="print:break-inside-avoid"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-sm/4 font-semibold tracking-[-0.011em]">
                    {item.url ? (
                      <a href={item.url} rel="noopener noreferrer" target="_blank">
                        {item.organization}
                      </a>
                    ) : (
                      item.organization
                    )}
                    <span className="font-normal"> — {item.role}</span>
                  </h3>
                  <span className="shrink-0 text-xs/4 tabular-nums tracking-[-0.006em]">
                    {item.time}
                  </span>
                </div>
                {item.bullets?.length ? (
                  <ul className="mt-1 flex flex-col gap-0.5 text-xs/4 tracking-[-0.006em] print:mt-0.5 print:gap-0">
                    {item.bullets.map((line) => (
                      <li
                        key={line}
                        className="relative pl-2.5 before:absolute before:left-0 before:content-['·']"
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
          <div className="flex flex-col gap-1 print:gap-0.5">
            {resume.education.map((item) => (
              <div
                key={`${item.institution}-${item.time}`}
                className="flex items-baseline justify-between gap-4"
              >
                <p className="text-sm/4 tracking-[-0.011em]">
                  <span className="font-semibold">{item.institution}</span>
                  {" — "}
                  {item.degree}
                </p>
                <span className="shrink-0 text-xs/4 tabular-nums tracking-[-0.006em]">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Heading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={`${id}-heading`}
      className="mb-2 border-b border-black/10 pb-1 text-2xs/3 font-bold uppercase tracking-[0.08em] print:mb-1 print:pb-0.5"
    >
      {children}
    </h2>
  );
}
