"use client";

import { Cambio } from "cambio";
import { motion, type MotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useCallback, useRef, useState } from "react";

const COLUMNS = 7;
const ROWS = 4;
const CENTER = Math.floor(COLUMNS / 2);
const LIMIT = COLUMNS * ROWS;

interface Photo {
  thumbnail: string;
  full: string;
}

interface PhotoCellProps {
  reduce: boolean;
  scrollYProgress: MotionValue<number>;
  photo: Photo;
  index: number;
}

function PhotoCell({ reduce, scrollYProgress, photo, index }: PhotoCellProps) {
  const [popup, setPopup] = useState(photo.thumbnail);
  const preloaded = useRef(false);

  const preload = useCallback(() => {
    if (preloaded.current) return;
    preloaded.current = true;
    const img = new Image();
    img.onload = () => setPopup(photo.full);
    img.src = photo.full;
  }, [photo.full]);

  const column = index % COLUMNS;
  const depth = Math.abs(column - CENTER);

  const yStart = 80 + depth * 120;
  const opacityStart = Math.max(0, 0.6 - depth * 0.2);

  const end = 0.3 + depth * 0.12;

  const y = useTransform(scrollYProgress, [0, end], [yStart, 0]);
  const opacity = useTransform(scrollYProgress, [0, end], [opacityStart, 1]);
  const scale = useTransform(scrollYProgress, [0, end], [1.08, 1]);

  return (
    <motion.div
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
      onPointerEnter={preload}
    >
      <Cambio.Root motion="smooth" dismissible>
        <Cambio.Trigger className="block h-full w-full cursor-pointer">
          <motion.img
            src={photo.thumbnail}
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
        </Cambio.Trigger>
        <Cambio.Portal>
          <Cambio.Backdrop className="fixed inset-0 bg-black/90" />
          <Cambio.Popup>
            <img
              src={popup}
              alt=""
              className="max-h-[90vh] max-w-[95vw] object-contain tablet:max-h-[85vh] tablet:max-w-[80vw]"
            />
            <Cambio.Close className="absolute -top-2 -right-2 rounded-full bg-black/60 p-1.5 text-white/80 transition-colors hover:text-white">
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </Cambio.Close>
          </Cambio.Popup>
        </Cambio.Portal>
      </Cambio.Root>
    </motion.div>
  );
}

export function PhotosPage({ photos }: { photos: Photo[] }) {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion() ?? false;
  const visible = photos.slice(0, LIMIT);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const grid = (
    <div className="grid h-[min(62svh,50rem)] w-full grid-cols-7 grid-rows-4 gap-2 desktop:gap-4">
      {visible.map((photo, index) => (
        <PhotoCell
          key={`${index}-${photo.thumbnail}`}
          reduce={reduce}
          scrollYProgress={scrollYProgress}
          photo={photo}
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
