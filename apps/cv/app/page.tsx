import { resume } from "@workspace/data";

export default function Page() {
  const linkedInUrl = resume.links.find((l) => l.name === "LinkedIn")?.url;

  return (
    <main className="mx-auto max-w-2xl px-10 py-12 print:max-w-none print:px-0 print:py-0">
      <header className="mb-10 print:mb-8">
        <h1 className="text-2xl font-bold tracking-tight">{resume.name}</h1>
        <a
          href="https://nameisdaniel.com"
          rel="noopener noreferrer"
          target="_blank"
          className="mt-1 text-xs font-normal opacity-50 underline underline-offset-2"
        >
          nameisdaniel.com
        </a>
      </header>

      <div className="grid grid-cols-[140px_1fr] gap-x-8 print:grid-cols-[130px_1fr] print:gap-x-6">
        {/* Left sidebar */}
        <div className="flex flex-col gap-10 print:gap-8">
          <section>
            <SectionLabel>About</SectionLabel>
            <p className="text-xs/[1.6] font-normal tracking-tight text-balance">{resume.about}</p>
          </section>

          <section>
            <SectionLabel>Contact</SectionLabel>
            <div className="flex flex-col gap-1 text-xs/[1.6] font-normal">
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
        <div className="flex flex-col gap-8 print:gap-6">
          <section>
            <SectionLabel>Experience</SectionLabel>
            <div className="flex flex-col gap-8 print:gap-6">
              {resume.experience.map((item) => (
                <article
                  key={`${item.organization}-${item.time}`}
                  className="grid grid-cols-[120px_1fr] gap-x-6 print:grid-cols-[110px_1fr] print:gap-x-4 print:break-inside-avoid"
                >
                  <div className="text-xs/[1.5] font-normal">
                    <time className="tabular-nums opacity-40">{item.time}</time>
                    {item.location ? <p className="mt-1 opacity-30">{item.location}</p> : null}
                  </div>
                  <div>
                    <h3 className="text-xs/[1.5] font-normal">
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
                      <div className="mt-2 text-xs/[1.6] font-normal tracking-tight opacity-70">
                        {item.bullets.join(" ")}
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section>
            <SectionLabel>Education</SectionLabel>
            <div className="flex flex-col gap-6 print:gap-4">
              {resume.education.map((item) => (
                <article
                  key={`${item.institution}-${item.time}`}
                  className="grid grid-cols-[120px_1fr] gap-x-6 print:grid-cols-[110px_1fr] print:gap-x-4 print:break-inside-avoid"
                >
                  <div className="text-xs/[1.5] font-normal">
                    <time className="tabular-nums opacity-40">{item.time}</time>
                    {item.location ? <p className="mt-1 opacity-30">{item.location}</p> : null}
                  </div>
                  <div>
                    <p className="text-xs/[1.5] font-normal">
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 border-b border-black/[0.08] pb-1.5 text-xs font-normal tracking-tight opacity-60 print:mb-3">
      {children}
    </h2>
  );
}
