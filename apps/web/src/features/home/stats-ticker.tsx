import { IconMathScientific } from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import { type Stat, stats } from "@workspace/data/stats";
import { Section } from "~/components/page-shell";

function StatItem({ stat }: { stat: Stat }) {
  return (
    <div className="flex shrink-0 items-center gap-3 pr-6 border-r border-border">
      <span className="text-2xs uppercase tracking-[0.06em] text-muted-foreground">
        {stat.label}:
      </span>
      <span className="rounded border border-dashed border-border px-2 py-0.5 text-2xs uppercase tracking-[0.06em] text-foreground">
        {stat.value}
      </span>
    </div>
  );
}

export function StatsTicker() {
  return (
    <Section>
      <style>{`@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      <div className="col-span-8">
        <div className="flex items-center gap-1.5 pb-2">
          <IconMathScientific size={12} className="text-muted-foreground" />
          <span className="text-2xs uppercase tracking-[0.06em] text-muted-foreground">
            Statistics
          </span>
        </div>
        <hr className="border-t border-border" />
        <div className="group relative overflow-hidden py-3">
          <div
            className="flex gap-6 group-hover:[animation-play-state:paused]"
            style={{ animation: "ticker 30s linear infinite" }}
          >
            {stats.map((stat) => (
              <StatItem key={`a-${stat.label}`} stat={stat} />
            ))}
            {stats.map((stat) => (
              <StatItem key={`b-${stat.label}`} stat={stat} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
