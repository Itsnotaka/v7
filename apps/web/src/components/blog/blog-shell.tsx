import type * as React from "react";

export type BlogShellProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  author: string;
  date: string;
  children: React.ReactNode;
};

const getTag = (text: string) =>
  text
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.at(0)?.toUpperCase() ?? "")
    .join("");

export function BlogShell(props: BlogShellProps) {
  const tag = getTag(props.author);

  return (
    <div>
      <header className="mx-auto flex max-w-[1237px] flex-col items-center px-4 pt-20 pb-10 md:pt-28 md:pb-14">
        <h1 className="w-full text-center font-serif text-[40px] leading-[1.2] tracking-[-0.8px] text-white md:w-[900px] md:text-[56px] md:leading-[64px] md:tracking-[-1.12px]">
          {props.title}
        </h1>

        {props.subtitle ? (
          <p className="mt-4 w-full text-center text-sm text-primary-foreground/80 md:w-[660px]">
            {props.subtitle}
          </p>
        ) : null}

        <div className="mt-6 flex items-center gap-2">
          <div
            aria-hidden="true"
            className="grid h-[34px] w-[34px] place-items-center rounded-full border border-white/20 bg-white/10 text-xs tracking-widest text-white"
          >
            {tag}
          </div>
          <span className="text-sm tracking-widest text-white uppercase">{props.author}</span>
        </div>

        <div className="mt-2 flex items-center gap-3 rounded-full border border-white/20 bg-white/[0.06] px-4 py-2">
          <time className="text-sm text-white/70">{props.date}</time>
        </div>
      </header>

      <main id="main-content">
        <article className="mx-auto max-w-[720px] px-4 py-10 [&_a]:underline [&_a]:decoration-white/70 [&_a]:underline-offset-2 [&_a:hover]:text-white/80 [&_h2]:mt-14 [&_h2]:mb-6 [&_h2]:font-serif [&_h2]:text-[28px] [&_h2]:leading-[1.2] [&_h2]:tracking-[-0.5px] md:[&_h2]:text-[35px] [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:font-serif [&_h3]:text-[24px] [&_h3]:leading-[1.3] [&_p]:mb-8 [&_p]:font-serif [&_p]:text-[19px] [&_p]:leading-[1.6] [&_p]:text-white [&_strong]:font-semibold [&_ul]:mb-8 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_li]:font-serif [&_li]:text-[18px] [&_li]:leading-[1.6] [&_blockquote]:my-10 [&_blockquote]:border-l [&_blockquote]:border-white/20 [&_blockquote]:pl-5 [&_blockquote]:font-serif [&_blockquote]:text-[24px] [&_blockquote]:leading-[1.4] [&_blockquote]:text-white/90">
          {props.children}
        </article>
      </main>
    </div>
  );
}
