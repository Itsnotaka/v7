"use client";

import {
  IconCalendar1,
  IconComponents,
  IconCup,
  IconEyeOpen,
  IconHeart,
  IconLayersThree,
  IconLetterASquare,
} from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import { stats } from "@workspace/data/stats";
import { motion } from "motion/react";
import { type ComponentType, useEffect, useRef, useState } from "react";
import { Section } from "~/components/page-shell";

const icons: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  IconComponents,
  IconLayersThree,
  IconCalendar1,
  IconCup,
  IconLetterASquare,
  IconEyeOpen,
};

function Items({ prefix }: { prefix: string }) {
  return stats.map((stat, index) => {
    const Icon = icons[stat.icon];
    return (
      <div key={`${prefix}-${index}`} className="flex shrink-0 items-center">
        {index > 0 && (
          <div className="flex items-center px-3">
            <div className="size-1 rounded-full bg-muted-foreground/30" />
          </div>
        )}
        <div className="group flex items-center gap-2 px-2 py-1 cursor-default">
          {Icon && (
            <Icon
              size={14}
              className="text-muted-foreground transition-colors duration-200 group-hover:text-foreground"
            />
          )}
          <span className="whitespace-nowrap text-sm text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
            {stat.text}
          </span>
        </div>
      </div>
    );
  });
}

export function StatsTicker() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    setWidth(ref.current.scrollWidth / 2);
  }, []);

  return (
    <Section>
      <div className="col-span-8 pt-12">
        <div className="flex items-center gap-2 pb-2">
          <IconHeart size={14} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">A few things about me</span>
        </div>
        <hr className="border-t border-border" />
        <div className="relative overflow-hidden py-3">
          <motion.div
            ref={ref}
            className="flex"
            animate={width > 0 ? { x: [0, -width] } : {}}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
          >
            <Items prefix="a" />
            <div className="flex items-center px-3">
              <div className="size-1 rounded-full bg-muted-foreground/30" />
            </div>
            <Items prefix="b" />
            <div className="flex items-center px-3">
              <div className="size-1 rounded-full bg-muted-foreground/30" />
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
