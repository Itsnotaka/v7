import type { WorkItem } from "@workspace/data/work";
import Link from "next/link";

import { getMockup } from "./mockups";
import { cn } from "~/utils/cn";

export function WorkCard({ item, className }: { item: WorkItem; className?: string }) {
  return (
    <Link
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${item.title} at ${item.company}`}
      className={cn(
        "rounded-lg bg-muted max-h-[1000px] aspect-[4/3] p-8 flex flex-col items-center justify-center",
        className,
      )}
    >
      <p className="text-2xs uppercase tracking-[0.14em] text-muted-foreground mb-1">
        {item.company}
      </p>
      <p className="font-serif text-base mb-6">{item.title}</p>
      <div aria-hidden="true" className="rounded-lg bg-card p-6">
        {getMockup(item.mockup)}
      </div>
    </Link>
  );
}
