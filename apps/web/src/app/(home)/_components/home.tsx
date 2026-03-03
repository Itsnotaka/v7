import Image from "next/image";
import Link from "next/link";

type Item = {
  title: string;
  time: string;
};

type Group = {
  title: string;
  rows: Item[];
};

type Shot = {
  src: string;
  alt: string;
  crop: string;
};

type Foot = {
  title: string;
  rows: Array<{ label: string; href: string }>;
};

const groups: Group[] = [
  {
    title: "Experience",
    rows: [
      { title: "Perplexity / Product Design Intern", time: "SPRING 2026" },
      { title: "Chronicle / Design Intern", time: "FALL 2025" },
      { title: "T-Mobile / Product Design Intern", time: "SUMMER 2025" },
    ],
  },
  {
    title: "Education",
    rows: [
      { title: "Penn / B.A. Design", time: "2023-2027" },
      { title: "SVSD / Accelerator Program", time: "2025" },
      { title: "RISD / Summer Program", time: "2022" },
    ],
  },
];

const shots: Shot[] = [
  { src: "/images/about/photo-1-desktop.jpg", alt: "person sitting on mat", crop: "object-[50.6%_35.9%]" },
  { src: "/images/about/photo-2-desktop.jpg", alt: "pink flowers in bloom", crop: "object-center" },
  { src: "/images/about/photo-3-desktop.jpg", alt: "hot air balloons cityscape", crop: "object-center" },
  { src: "/images/about/photo-4-desktop.jpg", alt: "art supplies and paintings", crop: "object-center" },
];

const foot: Foot[] = [
  {
    title: "CONTACT",
    rows: [{ label: "EMAIL", href: "mailto:emmiwu@sas.upenn.edu" }],
  },
  {
    title: "PAGE",
    rows: [
      { label: "ABOUT", href: "/" },
      { label: "WRITINGS", href: "/writings" },
      { label: "DESIGN SYSTEM", href: "/design-system" },
    ],
  },
];

const slot = 3;
const notes = [
  "Doodling on my iPad",
  "Painting gouache plein airs",
  "Building houses in the Sims 4",
  "Cafe hopping in pursuit of tasty matcha",
];

const sizes =
  "(min-width: 810px) max((min(100vw, 1600px) - 72px) / 4, 1px), max((min(100vw, 1600px) - 48px) / 2, 50px)";

function Timeline(props: Group) {
  return (
    <div className="flex flex-col gap-1.5">
      <h2 className="font-serif text-lg/7 tracking-[0.01em] text-foreground">{props.title}</h2>
      <div className="flex flex-col gap-1.5">
        {props.rows.map((row, i) => (
          <div key={row.title} className="flex flex-col gap-1.5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm tracking-[0.01em] text-foreground/90">{row.title}</p>
              <p className="shrink-0 font-mono text-xs/3.5 tracking-[0.01em] text-foreground/90">
                {row.time}
              </p>
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
    <section className="w-full">
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-2 gap-3 px-4.5 py-4.5 tablet:grid-cols-4">
        {shots.map((item) => (
          <div key={item.alt} className="relative aspect-[2/3] overflow-hidden">
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes={sizes}
              className={`object-cover ${item.crop}`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="w-full bg-primary">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-9 px-9 py-[72px]">
        <div className="flex flex-col gap-9 tablet:flex-row tablet:justify-between">
          <div className="flex max-w-[546px] flex-col gap-3">
            <p className="font-serif text-2xl/8 tracking-[0.01em] text-primary-foreground italic">
              To plant a garden, is to believe in the future.
            </p>
            <p className="font-mono text-xs/5 tracking-[0.01em] text-primary-foreground/95 font-medium">
              MADE WITH &lt;3 AND LOTS OF COFFEE
            </p>
          </div>
          <div className="grid w-full max-w-[614px] grid-cols-2 gap-5">
            {foot.map((item) => (
              <div key={item.title} className="flex flex-col gap-3">
                <p className="font-mono text-xs/5 tracking-[0.01em] text-primary-foreground/95 font-medium">
                  {item.title}
                </p>
                <div className="flex flex-col gap-3">
                  {item.rows.map((row) => (
                    <Link
                      key={row.label}
                      href={row.href}
                      className="font-mono text-xs/5 tracking-[0.01em] text-primary-foreground/95 hover:text-muted-foreground"
                    >
                      {row.label}
                    </Link>
                  ))}
                  {Array.from({ length: Math.max(slot - item.rows.length, 0) }).map((_, i) => (
                    <span
                      key={`${item.title}-${i}`}
                      aria-hidden
                      className="block h-5 w-full border-b border-dotted border-muted-foreground/50"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export function HomePage() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-background">
      <section className="w-full">
        <div className="mx-auto grid w-full max-w-[1440px] gap-6 px-4.5 py-4.5 tablet:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h1 className="font-serif text-2xl/8 tracking-[0.01em] text-foreground">
              Hi there, I’m Emmi.
            </h1>
            <div className="flex flex-col gap-4 font-sans text-sm tracking-[0.01em] text-foreground/90">
              <p>
                I’m an interdisciplinary designer with a love for prototyping, storytelling, and
                visual craft. I study design and consumer psychology at Penn. I&apos;m currently on
                a gap semester to design at
                <span className="underline underline-offset-2"> Perplexity</span>.
              </p>
              <p>Outside of design I&apos;m:</p>
              <ul className="flex flex-col gap-0 pl-4.5">
                {notes.map((item) => (
                  <li key={item} className="flex items-start gap-1">
                    <span className="tablet:hidden">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>
                I post my work on <span className="underline underline-offset-2">Twitter</span> and
                <span className="underline underline-offset-2"> Instagram</span>. Say hello at
                emmiwu[at]sas.upenn.edu or via{" "}
                <span className="underline underline-offset-2">LinkedIn</span>.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {groups.map((item) => (
              <Timeline key={item.title} title={item.title} rows={item.rows} />
            ))}
          </div>
        </div>
      </section>

      <Gallery />
      <Footer />
    </div>
  );
}
