import Link from "next/link";

type LinkItem = {
  label: string;
  href: string;
};

type Project = {
  title: string;
  description: string;
  href: string;
  stack: readonly string[];
};

const LINKS: readonly LinkItem[] = [
  { label: "Email", href: "mailto:hello@example.com" },
  { label: "GitHub", href: "https://github.com/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
];

const PROJECTS: readonly Project[] = [
  {
    title: "Project One",
    description: "Short description of what this project does and the outcome.",
    href: "#",
    stack: ["Next.js", "TypeScript", "Tailwind"],
  },
  {
    title: "Project Two",
    description: "What you built, who it helped, and what improved.",
    href: "#",
    stack: ["React", "TanStack Query", "UI"],
  },
  {
    title: "Project Three",
    description: "A clear, one-line summary that invites a click.",
    href: "#",
    stack: ["Node.js", "APIs", "Infra"],
  },
];

export default function Home(): React.JSX.Element {
  return (
    <div className="min-h-dvh">
      <header className="mx-auto max-w-3xl px-6 pt-10">
        <div className="flex items-center justify-between gap-6">
          <Link href="/" className="text-sm/6 font-medium tracking-tight">
            v7
          </Link>
          <nav aria-label="Primary" className="flex items-center gap-4 text-sm/6">
            <Link
              href="#work"
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Work
            </Link>
            <Link
              href="#about"
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              About
            </Link>
            <Link
              href="#contact"
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Contact
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-16">
        <section className="pt-14">
          <h1 className="text-3xl/10 font-semibold tracking-tight sm:text-4xl/11">
            I build clean, fast web products.
          </h1>
          <p className="mt-4 text-base/7 text-muted-foreground">
            Im v7a full-stack developer focused on simple UX, strong
            typography, and dependable systems.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                className="rounded-md border border-border bg-background px-3 py-1.5 text-sm/6 text-foreground shadow-xs hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <section id="work" className="mt-14 scroll-mt-24">
          <div className="flex items-baseline justify-between gap-6">
            <h2 className="text-sm/6 font-medium text-muted-foreground">Selected work</h2>
            <Link
              href="#"
              className="text-sm/6 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              All projects
            </Link>
          </div>

          <ul className="mt-4 divide-y divide-border border-y border-border">
            {PROJECTS.map((project) => (
              <li key={project.title} className="py-6">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <Link
                      href={project.href}
                      className="text-base/7 font-medium underline-offset-4 hover:underline"
                    >
                      {project.title}
                    </Link>
                    <p className="text-sm/6 text-muted-foreground">{project.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs/6 text-muted-foreground">
                    {project.stack.map((tag) => (
                      <span key={tag} className="rounded-md border border-border px-2">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section id="about" className="mt-14 scroll-mt-24">
          <h2 className="text-sm/6 font-medium text-muted-foreground">About</h2>
          <div className="mt-4 space-y-3">
            <p className="text-base/7">
              I like turning ambiguous problems into small, well-designed interfaces.
              I care about accessibility, performance, and long-term maintainability.
            </p>
            <p className="text-base/7 text-muted-foreground">
              Currently exploring: design systems, RSC patterns, and pragmatic tooling.
            </p>
          </div>
        </section>

        <section id="contact" className="mt-14 scroll-mt-24">
          <h2 className="text-sm/6 font-medium text-muted-foreground">Contact</h2>
          <p className="mt-4 text-base/7 text-muted-foreground">
            For work inquiries, collaborations, or a quick hello:
            {" "}
            <Link href="mailto:hello@example.com" className="text-foreground underline-offset-4 hover:underline">
              hello@example.com
            </Link>
          </p>
        </section>
      </main>

      <footer className="mx-auto max-w-3xl px-6 pb-10 text-sm/6 text-muted-foreground">
        <p>9 v7</p>
      </footer>
    </div>
  );
}
