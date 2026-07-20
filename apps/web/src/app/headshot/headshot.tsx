"use client";

import {
  IconArrowDown,
  IconBarsTwo,
  IconLock,
  IconMouse,
  IconUnlocked,
} from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Liquid } from "./liquid";
import { Mist } from "./mist";

const FACE = "/headshot/headshot.webp";
const BLOCKS = "/headshot/blocks.webp";
const EDITORIAL = "/headshot/editorial.webp";
const PETALS = "/headshot/petals.webp";
const LANDO_HEAD = "/headshot/lando-head.jpg";
const LANDO_HEAD_MOBILE = "/headshot/lando-head-mobile.jpg";

type Size = {
  compact: boolean;
  height: number;
  width: number;
};

type HeadshotProps = {
  effect?: "liquid" | "mist";
};

function Topography({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 900 600"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="topography" width="300" height="300" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M-28 64C18 34 39 15 85 25c49 11 51 64 103 62 45-2 65-38 112-24" />
            <path d="M-23 87c54-35 77-49 118-37 43 12 45 58 93 60 48 1 65-32 118-23" />
            <path d="M-16 112c51-29 78-39 116-26 38 13 42 48 86 51 47 4 72-24 121-15" />
            <path d="M-2 140c44-24 71-29 105-16 34 13 39 40 80 43 43 3 77-18 119-9" />
            <path d="M13 171c39-19 63-21 93-9 31 13 38 33 73 35 40 3 79-12 115-4" />
            <path d="M32 203c32-14 52-13 78-3 28 12 36 27 66 28 34 2 76-7 105 1" />
            <path d="M49 235c26-9 44-5 64 4 24 10 33 19 59 20 29 1 65-2 89 6" />
            <path d="M-15 283c50-29 83-33 119-16 35 17 58 32 103 25 44-7 61-44 105-44" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#topography)" />
    </svg>
  );
}

function Marquee({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute top-[27%] flex w-max whitespace-nowrap font-mono text-[clamp(2rem,4.7vw,5.25rem)]/[0.85] font-black tracking-[-0.065em] text-[#d2ff00]"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 23, ease: "linear", repeat: Infinity }}
      >
        <p className="pr-[0.3em]">BUILD THE IMPOSSIBLE — BUILD THE IMPOSSIBLE — </p>
        <p className="pr-[0.3em]">BUILD THE IMPOSSIBLE — BUILD THE IMPOSSIBLE — </p>
      </motion.div>

      <motion.div
        className="absolute top-[58%] flex w-max whitespace-nowrap text-[clamp(2rem,5.4vw,6rem)]/[0.82] font-black tracking-[-0.07em] text-[#f4f4ed]"
        animate={reduce ? undefined : { x: ["-50%", "0%"] }}
        transition={{ duration: 29, ease: "linear", repeat: Infinity }}
      >
        <p className="pr-[0.28em]">
          DESIGN IS HOW THE SYSTEM FEELS — DESIGN IS HOW THE SYSTEM FEELS —{" "}
        </p>
        <p className="pr-[0.28em]">
          DESIGN IS HOW THE SYSTEM FEELS — DESIGN IS HOW THE SYSTEM FEELS —{" "}
        </p>
      </motion.div>
    </div>
  );
}

function Signature({ reduce }: { reduce: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center">
      <div className="grid w-[min(58vw,50rem)] place-items-center gap-4 max-tablet:w-[78vw]">
        <p className="font-mono text-[0.58rem] tracking-[0.12em] text-[#f4f4ed]/70">
          MESSAGE FROM DANIEL
        </p>
        <svg aria-hidden="true" viewBox="0 0 700 230" className="w-full overflow-visible">
          <motion.path
            d="M52 157c42-92 78-123 101-115 24 9-6 105-25 144-13 26-25 25-21 0 6-37 57-99 88-93 31 7-31 102-4 106 31 5 74-119 105-117 26 2-23 110 1 116 20 5 65-85 94-82 26 4-13 79 10 82 21 3 64-60 88-54 21 6-9 54 15 57 25 4 57-31 88-33 22-1 45 8 63 25"
            fill="none"
            stroke="#d2ff00"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduce ? undefined : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: reduce ? 0 : 2.2, delay: reduce ? 0 : 0.35, ease: "easeInOut" }}
          />
        </svg>
      </div>
    </div>
  );
}

export function Headshot({ effect = "liquid" }: HeadshotProps) {
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const [locked, setLocked] = useState(false);
  const [size, setSize] = useState<Size>({ compact: false, height: 1, width: 1 });
  const scroll = useScroll({ target: track, offset: ["start start", "end end"] });
  const phase = useTransform(scroll.scrollYProgress, (value) =>
    reduce ? Math.round(value) : value * value * (3 - 2 * value),
  );
  const targetWidth = size.compact ? size.width * 0.4094 : size.width * 0.32755;
  const targetHeight = size.compact ? size.width * 0.26475 : size.width * 0.21181;
  const width = useTransform(phase, [0, 1], [size.width, targetWidth]);
  const height = useTransform(phase, [0, 1], [size.height, targetHeight]);
  const filter = useTransform(
    phase,
    [0, 0.45, 1],
    [
      "grayscale(0) saturate(1)",
      "grayscale(0.18) saturate(0.9)",
      "grayscale(0.88) saturate(0.34) contrast(1.13)",
    ],
  );
  const chrome = useTransform(phase, [0, 0.22], [1, 0]);
  const scene = useTransform(phase, [0.18, 0.65], [0.2, 1]);
  const mist = effect === "mist";

  useEffect(() => {
    const sync = () => {
      setSize({
        compact: window.innerWidth < 810,
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };

    sync();
    window.addEventListener("resize", sync, { passive: true });
    return () => window.removeEventListener("resize", sync);
  }, []);

  useEffect(() => {
    if (!locked) return;

    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [locked]);

  const toggle = () => {
    const next = !locked;
    setLocked(next);
    if (!next) return;
    track.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <main className="relative z-10 overflow-clip bg-[#282c20] text-[#282c20]">
      <section
        ref={track}
        className="relative h-[200svh]"
        aria-label={mist ? "Headshot and mist reveal" : "Headshot and helmet reveal"}
      >
        <div className="sticky top-0 h-svh overflow-hidden bg-[#282c20]">
          <motion.div className="absolute inset-0" style={{ opacity: scene }}>
            <Topography className="h-full w-full text-[#aeb94b]/20" />
            <Marquee reduce={reduce} />
            <Signature reduce={reduce} />
          </motion.div>

          <motion.div
            className="absolute top-1/2 left-1/2 z-20 overflow-hidden bg-linear-to-b from-[#9092a8] to-[#e4e0e5] [transform:translate3d(-50%,-50%,0)]"
            style={{ filter, height, width }}
          >
            <Image
              src={size.compact ? LANDO_HEAD_MOBILE : LANDO_HEAD}
              alt="A front-facing portrait of Lando Norris"
              fill
              priority
              sizes="100vw"
              className={mist ? "object-cover" : "object-fill"}
            />
            {mist ? (
              <Mist
                compact={size.compact}
                locked={locked}
                progress={scroll.scrollYProgress}
                reduce={reduce}
              />
            ) : (
              <Liquid
                compact={size.compact}
                locked={locked}
                progress={scroll.scrollYProgress}
                reduce={reduce}
              />
            )}
          </motion.div>

          <header className="pointer-events-none absolute inset-x-0 top-0 z-40 grid h-[5.2rem] grid-cols-[1fr_auto_1fr] items-start p-[1rem] text-[#282c20] max-tablet:h-[4.6rem] max-tablet:grid-cols-[1fr_auto_1fr]">
            <p className="text-[clamp(1.5rem,2.15vw,2.6rem)]/[0.78] font-black tracking-[-0.08em] max-tablet:hidden">
              DANIEL
              <br />
              FU
            </p>
            <div className="grid size-[2.7rem] place-items-center rounded-full border border-current/20 bg-[#f8f8f3]/20 font-mono text-[0.68rem] font-bold backdrop-blur-sm max-tablet:size-[2.35rem]">
              D/F
            </div>
            <div className="pointer-events-auto ml-auto grid grid-cols-[auto_3.8rem] gap-2 max-tablet:grid-cols-[auto_3.35rem]">
              <a
                href="#plates"
                className="grid h-[3.8rem] place-items-center bg-[#d2ff00] px-5 font-mono text-[0.65rem] font-bold tracking-[0.08em] whitespace-nowrap transition-colors hover:bg-[#c4ed00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#282c20] max-tablet:h-[3.35rem] max-tablet:px-4"
              >
                <span className="max-tablet:hidden">
                  {mist ? "CLEAR / MIST" : "CLEAN / BLOCKS"}
                </span>
                <span className="tablet:hidden">{mist ? "MIST" : "BLOCKS"}</span>
              </a>
              <button
                type="button"
                aria-label="Open menu"
                className="grid size-[3.8rem] place-items-center border border-current/25 bg-[#f8f8f3]/15 backdrop-blur-sm transition-colors hover:bg-[#f8f8f3]/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#282c20] max-tablet:size-[3.35rem]"
              >
                <IconBarsTwo size={22} />
              </button>
            </div>
            <div className="col-start-1 row-start-1 self-center font-mono text-[0.54rem]/[1.2] tracking-[0.08em] tablet:hidden">
              DANIEL FU
              <br />
              PRODUCT DESIGNER
            </div>
          </header>

          <motion.aside
            className="pointer-events-none absolute bottom-4 left-4 z-40 grid w-[7.45rem] border border-[#282c20]/30 bg-[#f8f8f3]/10 text-[#282c20] backdrop-blur-sm max-tablet:hidden"
            style={{ opacity: chrome }}
          >
            <p className="border-b border-current/25 px-2.5 py-2 font-mono text-[0.53rem] tracking-[0.08em]">
              {mist ? "REFRACTIVE MIST" : "LIQUID FIELD"}
            </p>
            <div className="grid h-[6.5rem] place-items-center">
              {mist ? (
                <div aria-hidden="true" className="relative size-[4.8rem] overflow-hidden">
                  <span className="absolute top-3 left-0 h-4 w-16 rounded-full bg-[#f8f8f3]/70 blur-sm" />
                  <span className="absolute top-7 right-0 h-5 w-14 rounded-full bg-[#99a6a3]/55 blur-md" />
                  <span className="absolute bottom-2 left-2 h-4 w-12 rounded-full bg-[#f8f8f3]/85 blur-sm" />
                </div>
              ) : (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 90 74"
                  className="h-[4.8rem] w-[5.5rem]"
                  fill="none"
                >
                  <path
                    d="M45 7c-20 0-31 13-32 31l-2 16c-1 8 4 14 11 16l13 3h20l13-3c7-2 12-8 11-16l-2-16C76 20 65 7 45 7Z"
                    stroke="currentColor"
                  />
                  <path
                    d="M15 37h60M22 48h46M26 22c10 7 28 7 38 0"
                    stroke="currentColor"
                    strokeDasharray="2 3"
                  />
                </svg>
              )}
            </div>
            <p className="border-y border-current/25 px-2.5 py-2 font-mono text-[0.58rem] font-bold tracking-[0.06em]">
              {mist ? "PORTRAIT / MIST" : "PORTRAIT / HELMET"}
            </p>
            <div className="grid grid-cols-[1.1rem_1fr] gap-x-2 px-2.5 py-2.5 font-mono text-[0.47rem]/[1.35] tracking-[0.04em]">
              <IconMouse size={15} />
              <p>
                {mist ? "SWIPE TO CLEAR" : "MOVE TO REVEAL"}
                <br />
                SCROLL TO DISCLOSE
              </p>
            </div>
          </motion.aside>

          <motion.div
            className="pointer-events-none absolute right-5 bottom-5 z-40 grid justify-items-end gap-2 font-mono text-[0.52rem] tracking-[0.08em] text-[#282c20] max-tablet:hidden"
            style={{ opacity: chrome }}
          >
            <p>SCROLL TO DISCLOSE</p>
            <IconArrowDown size={18} />
          </motion.div>

          <button
            type="button"
            onClick={toggle}
            aria-pressed={locked}
            className="absolute right-4 bottom-4 z-50 hidden size-11 place-items-center rounded-full border border-[#282c20]/25 bg-[#d2ff00] text-[#282c20] shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#282c20] max-tablet:grid"
            aria-label={
              locked
                ? "Return to scrolling"
                : mist
                  ? "Lock scrolling to clear the mist"
                  : "Lock scrolling to reveal the helmet"
            }
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2 pointer-fine:hidden"
            />
            {locked ? <IconUnlocked size={18} /> : <IconLock size={18} />}
          </button>

          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 z-[70] grid place-items-end bg-[#d2ff00] px-4 py-5 font-mono text-[0.58rem] tracking-[0.1em] text-[#282c20] transition-opacity ${
              reduce ? "duration-0" : "duration-500"
            } ${size.width > 1 ? "opacity-0" : "opacity-100"}`}
          >
            <p className="justify-self-center">LOAD DANIEL</p>
          </div>
        </div>
      </section>

      <section
        id="plates"
        className="relative grid min-h-svh grid-cols-[minmax(0,0.9fr)_minmax(12rem,0.55fr)_minmax(0,0.9fr)] items-center overflow-hidden bg-[#282c20] px-0 py-20 text-[#f4f4ed] max-tablet:grid-cols-2 max-tablet:gap-y-12 max-tablet:py-16"
      >
        <Topography className="absolute inset-0 h-full w-full text-[#d2ff00]/10" />
        <motion.figure
          className="relative z-10 aspect-[0.66] max-h-[86svh] overflow-hidden max-tablet:aspect-[0.72]"
          initial={reduce ? undefined : { x: "-20rem" }}
          whileInView={{ x: 0 }}
          viewport={{ amount: 0.18, once: true }}
          transition={{ duration: reduce ? 0 : 1.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src={BLOCKS}
            alt="Daniel's portrait with colorful toy blocks"
            fill
            sizes="(max-width: 810px) 50vw, 38vw"
            className="object-cover"
          />
        </motion.figure>

        <div className="relative z-20 grid place-items-center px-5 text-center max-tablet:order-first max-tablet:col-span-2">
          <p className="font-mono text-[0.58rem] tracking-[0.12em] text-[#d2ff00]">
            TWO STATES / ONE FRAME
          </p>
          <h2 className="mt-4 text-[clamp(2.75rem,5vw,6.5rem)]/[0.78] font-black tracking-[-0.075em]">
            CLEAN
            <br />
            BLOCKS
          </h2>
          <p className="mt-8 max-w-[21rem] font-mono text-[0.58rem]/[1.5] tracking-[0.04em] text-[#f4f4ed]/65">
            ONE PORTRAIT. ONE PRECISELY ALIGNED REVEAL PLATE.
          </p>
        </div>

        <motion.figure
          className="relative z-10 aspect-[0.66] max-h-[86svh] overflow-hidden max-tablet:aspect-[0.72]"
          initial={reduce ? undefined : { x: "20rem" }}
          whileInView={{ x: 0 }}
          viewport={{ amount: 0.18, once: true }}
          transition={{ duration: reduce ? 0 : 1.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src={FACE}
            alt="Daniel's clean downward-gaze headshot"
            fill
            sizes="(max-width: 810px) 50vw, 38vw"
            className="object-cover"
          />
        </motion.figure>
      </section>

      <section className="relative min-h-svh bg-linear-to-b from-[#dddce7] to-[#c5cee4] px-4 py-16 text-[#282c20] tablet:px-8 tablet:py-24">
        <div className="mb-10 grid grid-cols-12 gap-4 border-t border-[#282c20]/30 pt-3 font-mono text-[0.57rem]/[1.35] tracking-[0.08em]">
          <p className="col-span-4">PERSONAL VARIANTS</p>
          <p className="col-span-4">02 / 04</p>
          <p className="col-span-4 text-right">THE SAME FACE / DIFFERENT WORLDS</p>
        </div>

        <div className="grid grid-cols-12 items-start gap-4 tablet:gap-8">
          <motion.figure
            className="relative col-span-12 aspect-square overflow-hidden tablet:col-span-7"
            initial={reduce ? undefined : { y: 90 }}
            whileInView={{ y: 0 }}
            viewport={{ amount: 0.18, once: true }}
            transition={{ duration: reduce ? 0 : 1.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={PETALS}
              alt="Daniel surrounded by floating flower petals"
              fill
              sizes="(max-width: 810px) 100vw, 58vw"
              className="object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 grid grid-cols-2 bg-[#f4f4ed]/85 p-3 font-mono text-[0.55rem] tracking-[0.07em] backdrop-blur-md">
              <span>PETAL STUDY</span>
              <span className="text-right">SOFT LIGHT / FUJI</span>
            </figcaption>
          </motion.figure>

          <motion.figure
            className="relative col-span-10 col-start-3 aspect-[0.75] overflow-hidden tablet:col-span-5 tablet:col-start-auto tablet:mt-[18svh]"
            initial={reduce ? undefined : { y: 150 }}
            whileInView={{ y: 0 }}
            viewport={{ amount: 0.18, once: true }}
            transition={{ duration: reduce ? 0 : 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={EDITORIAL}
              alt="Daniel in an editorial side-gaze portrait with colorful toy blocks"
              fill
              sizes="(max-width: 810px) 84vw, 42vw"
              className="object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 grid grid-cols-2 bg-[#f4f4ed]/85 p-3 font-mono text-[0.55rem] tracking-[0.07em] backdrop-blur-md">
              <span>BLOCK STUDY</span>
              <span className="text-right">SIDE GAZE / STUDIO</span>
            </figcaption>
          </motion.figure>
        </div>
      </section>
    </main>
  );
}
