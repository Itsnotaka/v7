import { getWorkItems } from "@workspace/data/work";

import { PageSection, SectionHeading } from "~/components/page-shell";

import { WorkCard } from "./work-card";

export function WorkPage() {
  const items = getWorkItems();

  return (
    <PageSection>
      <div className="col-span-8 flex flex-col gap-6">
        <SectionHeading>Work</SectionHeading>
        <div className="grid grid-cols-1 gap-1">
          {items.map((item) => (
            <WorkCard key={item.slug} item={item} />
          ))}
        </div>
      </div>
    </PageSection>
  );
}
