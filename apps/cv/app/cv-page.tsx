"use client";

import { layout, prepare } from "@chenglou/pretext";
import { resume } from "@workspace/data";
import { useCallback, useEffect, useState, type CSSProperties, type ReactNode } from "react";

const FONT = "Inter";

const A4_CONTENT_H_PX = Math.round((297 - 16) * (96 / 25.4));

function stripForMeasure(s: string): string {
  return s
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

function font(weight: number, sizePx: number): string {
  return `${weight} ${sizePx}px ${FONT}`;
}

type LayoutDims = {
  inner: number;
  leftCol: number;
  rightCol: number;
  timeCol: number;
  artGap: number;
  isMd: boolean;
};

function dimsFromMainWidth(mainW: number, isMd: boolean): LayoutDims {
  const pad = isMd ? 48 : 32;
  const inner = Math.max(0, mainW - pad * 2);
  const gapMain = isMd ? 40 : 32;
  const leftCol = isMd ? 190 : 150;
  const rightCol = Math.max(120, inner - leftCol - gapMain);
  const timeCol = isMd ? 150 : 130;
  const artGap = 24;
  return { inner, leftCol, rightCol, timeCol, artGap, isMd };
}

function totalHeightForRatio(
  resumeData: typeof resume,
  linkedInUrl: string | undefined,
  dims: LayoutDims,
  r: number,
): number {
  const { inner, leftCol, rightCol, timeCol, artGap, isMd } = dims;

  const nameSize = isMd ? 36 : 30;
  const urlSize = isMd ? 16 : 14;
  const labelSize = isMd ? 16 : 14;
  const aboutSize = isMd ? 18 : 16;
  const metaSize = isMd ? 16 : 14;
  const bulletSize = metaSize;

  const contentW = rightCol - timeCol - artGap;
  const bulletW = Math.max(80, contentW - 28);

  const lh = (size: number) => r * size;

  const namePrep = prepare(resumeData.name, font(700, nameSize));
  const urlPrep = prepare("nameisdaniel.com", font(400, urlSize));
  const headerNameH = layout(namePrep, inner, nameSize * 1.15).height;
  const headerUrlH = layout(urlPrep, inner, urlSize * 1.25).height;
  const headerMb = isMd ? 48 : 40;
  const headerH = headerNameH + 8 + headerUrlH + headerMb;

  const sectionLabelMb = 22;
  const leftGap = isMd ? 48 : 40;
  const rightSectionGap = isMd ? 40 : 32;
  const expArticleGap = isMd ? 40 : 32;
  const eduArticleGap = isMd ? 32 : 24;
  const titleBulletGap = 8;
  const bulletSpaceY = 4;

  let leftColH = 0;

  leftColH += layout(prepare("About", font(400, labelSize)), leftCol, lh(labelSize)).height + sectionLabelMb;
  leftColH += layout(prepare(stripForMeasure(resumeData.about), font(400, aboutSize)), leftCol, lh(aboutSize)).height;
  leftColH += leftGap;
  leftColH += layout(prepare("Contact", font(400, labelSize)), leftCol, lh(labelSize)).height + sectionLabelMb;
  const contactLineGap = 4;
  if (linkedInUrl) {
    leftColH += layout(prepare("LinkedIn", font(400, aboutSize)), leftCol, lh(aboutSize)).height + contactLineGap;
  }
  leftColH += layout(prepare("Email", font(400, aboutSize)), leftCol, lh(aboutSize)).height + contactLineGap;
  leftColH += layout(prepare("Phone", font(400, aboutSize)), leftCol, lh(aboutSize)).height;

  let rightColH = 0;
  rightColH += layout(prepare("Experience", font(400, labelSize)), rightCol, lh(labelSize)).height + sectionLabelMb;

  resumeData.experience.forEach((item, i) => {
    if (i > 0) {
      rightColH += expArticleGap;
    }
    const title = `${item.organization} — ${item.role}${item.context ? ` (${item.context})` : ""}`;
    const timeText = `${item.time}${item.location ? `\n${item.location}` : ""}`;
    const prepTime = prepare(stripForMeasure(timeText), font(400, metaSize));
    const prepTitle = prepare(stripForMeasure(title), font(500, metaSize));
    const hTime = layout(prepTime, timeCol, lh(metaSize)).height;
    const hTitle = layout(prepTitle, contentW, lh(metaSize)).height;
    let bulletsH = 0;
    const bullets = item.bullets ?? [];
    bullets.forEach((bullet, j) => {
      if (j > 0) {
        bulletsH += bulletSpaceY;
      }
      const prepB = prepare(stripForMeasure(bullet), font(400, bulletSize));
      bulletsH += layout(prepB, bulletW, lh(bulletSize)).height;
    });
    const rightArticle = hTitle + (bullets.length ? titleBulletGap + bulletsH : 0);
    rightColH += Math.max(hTime, rightArticle);
  });

  rightColH += rightSectionGap;
  rightColH += layout(prepare("Education", font(400, labelSize)), rightCol, lh(labelSize)).height + sectionLabelMb;

  resumeData.education.forEach((item, i) => {
    if (i > 0) {
      rightColH += eduArticleGap;
    }
    const line = `${item.institution} — ${item.degree}`;
    const timeText = `${item.time}${item.location ? `\n${item.location}` : ""}`;
    const prepTime = prepare(stripForMeasure(timeText), font(400, metaSize));
    const prepLine = prepare(stripForMeasure(line), font(400, metaSize));
    const hTime = layout(prepTime, timeCol, lh(metaSize)).height;
    const hLine = layout(prepLine, contentW, lh(metaSize)).height;
    rightColH += Math.max(hTime, hLine);
  });

  return headerH + Math.max(leftColH, rightColH);
}

function findOptimalRatio(
  resumeData: typeof resume,
  linkedInUrl: string | undefined,
  dims: LayoutDims,
  target: number,
): number {
  const lo = 1.12;
  const hi = 1.82;
  if (totalHeightForRatio(resumeData, linkedInUrl, dims, hi) <= target) {
    return hi;
  }
  if (totalHeightForRatio(resumeData, linkedInUrl, dims, lo) > target) {
    return lo;
  }
  let a = lo;
  let b = hi;
  for (let i = 0; i < 28; i++) {
    const mid = (a + b) / 2;
    if (totalHeightForRatio(resumeData, linkedInUrl, dims, mid) <= target) {
      a = mid;
      continue;
    }
    b = mid;
  }
  return a;
}

function trackingForRatio(r: number): string {
  const t = -0.012 - (r - 1.35) * 0.02;
  const clamped = Math.min(0.02, Math.max(-0.06, t));
  return `${clamped}em`;
}

export function CvPage() {
  const linkedInUrl = resume.links.find((l) => l.name === "LinkedIn")?.url;
  const [ratio, setRatio] = useState<number | null>(null);
  const [mainRef, setMainRef] = useState<HTMLElement | null>(null);

  const recompute = useCallback(() => {
    if (!mainRef) {
      return;
    }
    const w = mainRef.offsetWidth;
    const isMd = window.matchMedia("(min-width: 768px)").matches;
    const dims = dimsFromMainWidth(w, isMd);

    const vh = window.innerHeight;
    const targetScreen = Math.min(A4_CONTENT_H_PX, Math.round(vh * 0.88));
    const target = isMd ? targetScreen : 10_000;

    if (!isMd) {
      setRatio(null);
      return;
    }

    const r = findOptimalRatio(resume, linkedInUrl, dims, target);
    setRatio(r);
  }, [linkedInUrl, mainRef]);

  useEffect(() => {
    recompute();
  }, [recompute, mainRef]);

  useEffect(() => {
    if (!mainRef) {
      return;
    }
    const ro = new ResizeObserver(() => {
      recompute();
    });
    ro.observe(mainRef);
    const onBeforePrint = () => {
      const w = mainRef.offsetWidth;
      const isMd = window.matchMedia("(min-width: 768px)").matches;
      if (!isMd) {
        return;
      }
      const dims = dimsFromMainWidth(w, isMd);
      setRatio(findOptimalRatio(resume, linkedInUrl, dims, A4_CONTENT_H_PX - 96));
    };
    const onAfterPrint = () => {
      recompute();
    };
    window.addEventListener("beforeprint", onBeforePrint);
    window.addEventListener("afterprint", onAfterPrint);
    return () => {
      ro.disconnect();
      window.removeEventListener("beforeprint", onBeforePrint);
      window.removeEventListener("afterprint", onAfterPrint);
    };
  }, [mainRef, recompute, linkedInUrl]);

  const r = ratio ?? 1.5;
  const mainStyle = {
    "--cv-body-lh": String(r),
    "--cv-body-track": trackingForRatio(r),
  } as CSSProperties;

  return (
    <main
      ref={setMainRef}
      className="mx-auto max-w-2xl px-8 py-12 md:max-w-3xl md:px-12 md:py-16 print:max-w-none print:p-0"
      style={mainStyle}
    >
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

      <div className="grid grid-cols-1 gap-y-10 md:grid-cols-[minmax(0,190px)_1fr] md:gap-x-10 md:gap-y-0 print:grid-cols-[minmax(0,175px)_1fr] print:gap-x-7 print:gap-y-0">
        <div className="min-w-0 flex flex-col gap-10 md:gap-12 print:gap-6">
          <section>
            <SectionLabel fit={ratio !== null}>About</SectionLabel>
            <p
              className={`text-base font-normal text-balance md:text-lg print:text-[11px] ${ratio === null ? "leading-relaxed tracking-tight" : ""}`}
              style={
                ratio !== null
                  ? {
                      lineHeight: "var(--cv-body-lh)",
                      letterSpacing: "var(--cv-body-track)",
                    }
                  : undefined
              }
            >
              {resume.about}
            </p>
          </section>

          <section>
            <SectionLabel fit={ratio !== null}>Contact</SectionLabel>
            <div
              className={`flex flex-col gap-1 text-base font-normal md:text-lg print:gap-1.5 print:text-[11px] ${ratio === null ? "leading-relaxed" : ""}`}
              style={
                ratio !== null
                  ? {
                      lineHeight: "var(--cv-body-lh)",
                      letterSpacing: "var(--cv-body-track)",
                    }
                  : undefined
              }
            >
              {linkedInUrl ? (
                <a href={linkedInUrl} rel="noopener noreferrer" target="_blank" className="underline underline-offset-2">
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

        <div className="min-w-0 flex flex-col gap-8 md:gap-10 print:gap-7">
          <section>
            <SectionLabel fit={ratio !== null}>Experience</SectionLabel>
            <div className="flex flex-col gap-8 md:gap-10 print:gap-5">
              {resume.experience.map((item) => (
                <article
                  key={`${item.organization}-${item.time}`}
                  className="grid grid-cols-1 gap-y-2 md:grid-cols-[minmax(0,150px)_1fr] md:gap-x-6 md:gap-y-0 print:grid-cols-[minmax(0,138px)_1fr] print:gap-x-4 print:gap-y-0 print:break-inside-auto"
                >
                  <div
                    className={`min-w-0 text-sm font-normal md:text-base print:text-[11px] ${ratio === null ? "leading-snug" : ""}`}
                    style={
                      ratio !== null
                        ? {
                            lineHeight: "var(--cv-body-lh)",
                            letterSpacing: "var(--cv-body-track)",
                          }
                        : undefined
                    }
                  >
                    <time className="tabular-nums opacity-40">{item.time}</time>
                    {item.location ? <p className="mt-0.5 opacity-30">{item.location}</p> : null}
                  </div>
                  <div className="min-w-0">
                    <h3
                      className={`text-sm font-normal text-balance md:text-base print:text-[11px] ${ratio === null ? "leading-snug" : ""}`}
                      style={
                        ratio !== null
                          ? {
                              lineHeight: "var(--cv-body-lh)",
                              letterSpacing: "var(--cv-body-track)",
                            }
                          : undefined
                      }
                    >
                      <span className="font-medium">
                        {item.url ? (
                          <a
                            href={item.url}
                            rel="noopener noreferrer"
                            target="_blank"
                            className="break-words underline underline-offset-2"
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
                      <ul
                        className={`mt-2 list-disc space-y-1 pl-5 text-sm font-normal break-words opacity-80 marker:text-foreground/40 md:text-base print:mt-1.5 print:space-y-0.5 print:pl-4 print:text-[11px] print:opacity-90 ${ratio === null ? "leading-relaxed tracking-tight" : ""}`}
                        style={
                          ratio !== null
                            ? {
                                lineHeight: "var(--cv-body-lh)",
                                letterSpacing: "var(--cv-body-track)",
                              }
                            : undefined
                        }
                      >
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
            <SectionLabel fit={ratio !== null}>Education</SectionLabel>
            <div className="flex flex-col gap-6 md:gap-8 print:gap-3">
              {resume.education.map((item) => (
                <article
                  key={`${item.institution}-${item.time}`}
                  className="grid grid-cols-1 gap-y-2 md:grid-cols-[minmax(0,150px)_1fr] md:gap-x-6 md:gap-y-0 print:grid-cols-[minmax(0,138px)_1fr] print:gap-x-4 print:gap-y-0 print:break-inside-auto"
                >
                  <div
                    className={`min-w-0 text-sm font-normal md:text-base print:text-[11px] ${ratio === null ? "leading-snug" : ""}`}
                    style={
                      ratio !== null
                        ? {
                            lineHeight: "var(--cv-body-lh)",
                            letterSpacing: "var(--cv-body-track)",
                          }
                        : undefined
                    }
                  >
                    <time className="tabular-nums opacity-40">{item.time}</time>
                    {item.location ? <p className="mt-0.5 opacity-30">{item.location}</p> : null}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-normal text-balance md:text-base print:text-[11px] ${ratio === null ? "leading-snug" : ""}`}
                      style={
                        ratio !== null
                          ? {
                              lineHeight: "var(--cv-body-lh)",
                              letterSpacing: "var(--cv-body-track)",
                            }
                          : undefined
                      }
                    >
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

function SectionLabel(props: { children: ReactNode; fit: boolean }) {
  return (
    <h2
      className={
        "mb-4 border-b border-black/[0.08] pb-1.5 text-sm font-normal opacity-60 md:text-base print:mb-2.5 print:pb-1 print:text-[11px] print:leading-none" +
        (!props.fit ? " tracking-tight" : "")
      }
      style={
        props.fit
          ? {
              lineHeight: "var(--cv-body-lh)",
              letterSpacing: "var(--cv-body-track)",
            }
          : undefined
      }
    >
      {props.children}
    </h2>
  );
}
