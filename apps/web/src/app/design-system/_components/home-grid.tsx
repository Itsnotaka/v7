import Link from "next/link";

import { PrimitivePreview } from "~/app/design-system/_components/primitive-preview";
import { PRIMITIVES } from "~/app/design-system/libs/primitives";

function Tile({ item }: { item: (typeof PRIMITIVES)[number] }) {
  return (
    <li className="relative flex aspect-square min-w-0 overflow-hidden bg-elevated ring-1 ring-line">
      <Link href={`/design-system/components/${item.slug}`} className="absolute inset-0" />

      <div className="flex size-full min-w-0 items-center justify-center p-4">
        <PrimitivePreview item={item} />
      </div>
    </li>
  );
}

export function HomeGrid() {
  return (
    <div className="w-full min-w-0 overflow-x-hidden">
      <ul className="grid w-full min-w-0 auto-rows-min grid-cols-1 overflow-x-hidden md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {PRIMITIVES.map((item) => (
          <Tile key={item.slug} item={item} />
        ))}
      </ul>
    </div>
  );
}
