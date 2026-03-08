"use client";

import { IconArrowLeft } from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { cn } from "~/utils/cn";

type NavItem = {
  id: string;
  label: string;
};

function SectionNav({
  items,
  className,
}: {
  items: NavItem[];
  className?: string;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const targets = items.map((item) => document.getElementById(item.id)).filter(Boolean) as Element[];
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = targets.indexOf(entry.target);
          if (idx !== -1) setActive(idx);
        }
      },
      { rootMargin: "-100px 0px -50% 0px", threshold: 0.3 },
    );

    for (const target of targets) observer.observe(target);
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      className={cn(
        "fixed left-0 top-12 z-40 hidden h-[calc(100svh-3rem)] w-[140px] flex-col justify-between px-4 py-6 tablet:flex",
        className,
      )}
    >
      <div className="flex flex-col gap-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-2xs font-medium uppercase tracking-widest text-foreground/60 transition-colors hover:text-foreground"
        >
          <IconArrowLeft size={12} />
          Home
        </Link>

        <ul className="flex flex-col gap-2.5">
          {items.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={cn(
                  "text-2xs uppercase tracking-widest text-foreground/30 transition-colors duration-200 hover:text-foreground/60",
                  active === i && "text-foreground/80",
                )}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <a
        href="#top"
        className="text-2xs uppercase tracking-widest text-foreground/30 transition-colors hover:text-foreground/60"
      >
        ↑ Back to top
      </a>
    </nav>
  );
}

export { SectionNav };
export type { NavItem };
