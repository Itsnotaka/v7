"use client";

import { motion, type MotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const COLUMNS = 7;
const ROWS = 4;
const CENTER = Math.floor(COLUMNS / 2);
const LIMIT = COLUMNS * ROWS;

interface PhotoCellProps {
  reduce: boolean;
  scrollYProgress: MotionValue<number>;
  src: string;
  index: number;
}

function PhotoCell({ reduce, scrollYProgress, src, index }: PhotoCellProps) {
  const column = index % COLUMNS;
  const depth = Math.abs(column - CENTER);

  const yStart = 80 + depth * 120;
  const opacityStart = Math.max(0, 0.6 - depth * 0.2);

  const end = 0.3 + depth * 0.12;

  const y = useTransform(scrollYProgress, [0, end], [yStart, 0]);
  const opacity = useTransform(scrollYProgress, [0, end], [opacityStart, 1]);
  const scale = useTransform(scrollYProgress, [0, end], [1.08, 1]);

  return (
    <motion.figure
      className="relative h-full w-full overflow-hidden bg-foreground/5"
      style={
        reduce
          ? undefined
          : {
              y,
              opacity,
              willChange: "transform, opacity",
            }
      }
    >
      <motion.img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
        style={
          reduce
            ? undefined
            : {
                scale,
                transformOrigin: "50% 0%",
                willChange: "transform",
              }
        }
      />
    </motion.figure>
  );
}

export function PhotosPage({ photos }: { photos: string[] }) {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion() ?? false;
  const visible = photos.slice(0, LIMIT);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const grid = (
    <div className="grid h-[min(62svh,50rem)] w-full grid-cols-7 grid-rows-4 gap-2 desktop:gap-4">
      {visible.map((src, index) => (
        <PhotoCell
          key={`${index}-${src}`}
          reduce={reduce}
          scrollYProgress={scrollYProgress}
          src={src}
          index={index}
        />
      ))}
    </div>
  );

  const body = reduce ? (
    <div ref={targetRef} className="px-3 pb-6 pt-6">
      {grid}
    </div>
  ) : (
    <div ref={targetRef} className="relative z-0 h-[160vh]">
      <div className="sticky top-0 grid h-svh items-center overflow-hidden pt-6">
        <div className="px-3 pb-6">{grid}</div>
      </div>
    </div>
  );

  return <section className="col-span-full overflow-x-clip">{body}</section>;
}
