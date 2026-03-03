import { getImageProps } from "next/image";
import Link from "next/link";

type Item = {
  title: string;
  time: string;
};

type Group = {
  title: string;
  rows: Item[];
};

type Nav = {
  desk: string;
  phone: string;
  href: string;
};

type Photo = {
  src: string;
  width: number;
  height: number;
};

type Shot = {
  alt: string;
  desk: Photo;
  phone: Photo;
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
  {
    alt: "person sitting on mat",
    desk: { src: "/images/about/photo-1-desktop.jpg", width: 2000, height: 3000 },
    phone: { src: "/images/about/photo-1-mobile.jpg", width: 683, height: 1024 },
    crop: "object-top tablet:object-[50.6%_35.9%]",
  },
  {
    alt: "pink flowers in bloom",
    desk: { src: "/images/about/photo-2-desktop.jpg", width: 731, height: 1037 },
    phone: { src: "/images/about/photo-2-mobile.jpg", width: 722, height: 1024 },
    crop: "object-top tablet:object-center",
  },
  {
    alt: "hot air balloons cityscape",
    desk: { src: "/images/about/photo-3-desktop.jpg", width: 731, height: 1037 },
    phone: { src: "/images/about/photo-3-mobile.jpg", width: 722, height: 1024 },
    crop: "object-top tablet:object-center",
  },
  {
    alt: "art supplies and paintings",
    desk: { src: "/images/about/photo-4-desktop.jpg", width: 4608, height: 3456 },
    phone: { src: "/images/about/photo-4-mobile.jpg", width: 512, height: 384 },
    crop: "object-center",
  },
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

const mono =
  "font-['IBM_Plex_Mono',var(--font-mono)] text-xs/5 tracking-[0.01em] text-[#969696] font-medium";

const desk =
  "(min-width: 1200px) max((min(100vw, 1600px) - 72px) / 4, 1px), max((min(100vw, 1600px) - 48px) / 2, 50px)";
const tab = "max((min(100vw, 1600px) - 48px) / 2, 50px)";
function Timeline(props: Group) {
  return (
    <div className="flex flex-col gap-1.5">
      <h2 className="font-['Instrument_Serif',var(--font-sans)] text-lg/7 tracking-[0.01em] text-[#666666]">
        {props.title}
      </h2>
      <div className="flex flex-col gap-1.5">
        {props.rows.map((row, i) => (
          <div key={row.title} className="flex flex-col gap-1.5">
            <div className="flex items-start justify-between gap-3">
              <p className="font-['Inter',var(--font-sans)] text-base/4 tracking-[0.01em] text-[#969696]">
                {row.title}
              </p>
              <p className="shrink-0 font-['IBM_Plex_Mono',var(--font-mono)] text-xs/3.5 tracking-[0.01em] text-[#969696]">
                {row.time}
              </p>
            </div>
            {i + 1 < props.rows.length ? (
              <div className="h-px w-full bg-[#96969673] tablet:bg-[#E3E3E3]" />
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
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-2 gap-3 px-4.5 py-4.5 desktop:grid-cols-4">
        {shots.map((item) => {
          const deskImg = getImageProps({
            src: item.desk.src,
            alt: item.alt,
            width: item.desk.width,
            height: item.desk.height,
            sizes: desk,
          });
          const phoneImg = getImageProps({
            src: item.phone.src,
            alt: item.alt,
            width: item.phone.width,
            height: item.phone.height,
            sizes: tab,
          });

          return (
            <figure key={item.alt} className="m-0 overflow-hidden">
              <picture className="block">
                <source media="(min-width: 810px)" srcSet={deskImg.props.srcSet} sizes={desk} />
                <img
                  src={phoneImg.props.src}
                  srcSet={phoneImg.props.srcSet}
                  alt={item.alt}
                  width={phoneImg.props.width}
                  height={phoneImg.props.height}
                  sizes={tab}
                  loading={phoneImg.props.loading}
                  decoding={phoneImg.props.decoding}
                  className={`block h-auto w-full ${item.crop}`}
                />
              </picture>
            </figure>
          );
        })}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="w-full bg-[#191918]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-9 px-9 py-[72px]">
        <div className="flex flex-col gap-9 tablet:flex-row tablet:justify-between">
          <div className="flex max-w-[546px] flex-col gap-3">
            <p className="font-['Instrument_Serif',var(--font-sans)] text-2xl/8 tracking-[0.01em] text-[#F9F8F6] italic">
              To plant a garden, is to believe in the future.
            </p>
            <p className="font-['IBM_Plex_Mono',var(--font-mono)] text-xs/5 tracking-[0.01em] text-[#EAE8E3] font-medium">
              MADE WITH &lt;3 AND LOTS OF COFFEE
            </p>
          </div>
          <div className="grid w-full max-w-[614px] grid-cols-2 gap-5">
            {foot.map((item) => (
              <div key={item.title} className="flex flex-col gap-3">
                <p className="font-['IBM_Plex_Mono',var(--font-mono)] text-xs/5 tracking-[0.01em] text-[#EAE8E3] font-medium">
                  {item.title}
                </p>
                <div className="flex flex-col gap-3">
                  {item.rows.map((row) => (
                    <Link
                      key={row.label}
                      href={row.href}
                      className="font-['IBM_Plex_Mono',var(--font-mono)] text-xs/5 tracking-[0.01em] text-[#EAE8E3] hover:text-[#82817D]"
                    >
                      {row.label}
                    </Link>
                  ))}
                  {Array.from({ length: Math.max(slot - item.rows.length, 0) }).map((_, i) => (
                    <span
                      key={`${item.title}-${i}`}
                      aria-hidden
                      className="block h-5 w-full border-b border-dotted border-[#82817D]/50"
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
    <div className="flex min-h-dvh w-full flex-col bg-[#F9F8F6]">
      <section className="w-full">
        <div className="mx-auto grid w-full max-w-[1440px] gap-6 px-4.5 py-4.5 tablet:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h1 className="font-['Instrument_Serif',var(--font-sans)] text-2xl/8 tracking-[0.01em] text-[#666666]">
              Hi there, I’m Emmi.
            </h1>
            <div className="flex flex-col gap-4 font-['Inter',var(--font-sans)] text-base/4 tracking-[0.01em] text-[#969696]">
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
