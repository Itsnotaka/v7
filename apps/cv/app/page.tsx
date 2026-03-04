import { resume } from "@workspace/data";

export default function Page() {
  const phoneHref = `tel:${resume.phone.replace(/[^+\d]/g, "")}`;
  const xHandle = resume.x?.trim().replace(/^@/, "");
  const xUrl = xHandle ? `https://x.com/${xHandle}` : null;

  return (
    <main className="page">
      <header className="header">
        <div className="identity">
          <h1>{resume.name}</h1>
          <p className="title">{resume.title}</p>
        </div>

        <address className="contact" aria-label="Contact information">
          <span>{resume.location}</span>
          <a href={`mailto:${resume.email}`}>{resume.email}</a>
          <a href={phoneHref}>{resume.phone}</a>
        </address>

        <nav className="links" aria-label="External links">
          {xUrl ? (
            <a href={xUrl} rel="noopener noreferrer" target="_blank">
              @{xHandle}
            </a>
          ) : null}
          {resume.links.map((item) =>
            item.url ? (
              <a href={item.url} key={item.url} rel="noopener noreferrer" target="_blank">
                {item.name}
              </a>
            ) : null,
          )}
        </nav>
      </header>

      <section className="section" aria-labelledby="summary-heading">
        <h2 id="summary-heading">Summary</h2>
        <p>{resume.about}</p>
      </section>

      <section className="section" aria-labelledby="experience-heading">
        <h2 id="experience-heading">Experience</h2>
        <ul className="list">
          {resume.experience.map((item) => (
            <li className="row" key={`${item.organization}-${item.time}`}>
              <p className="time">{item.time}</p>
              <article className="body">
                {item.url ? (
                  <a className="org" href={item.url} rel="noopener noreferrer" target="_blank">
                    {item.organization}
                  </a>
                ) : (
                  <p className="org">{item.organization}</p>
                )}
                <p className="role">{item.role}</p>
                {item.bullets && item.bullets.length > 0 ? (
                  <ul className="bullets">
                    {item.bullets.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section className="section" aria-labelledby="education-heading">
        <h2 id="education-heading">Education</h2>
        <ul className="list">
          {resume.education.map((item) => (
            <li className="row" key={`${item.institution}-${item.time}`}>
              <p className="time">{item.time}</p>
              <article className="body">
                <p className="org">{item.degree}</p>
                <p className="role">{item.institution}</p>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
