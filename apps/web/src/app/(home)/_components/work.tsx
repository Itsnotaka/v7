import { resume } from "@workspace/data";

const projects = resume.experience.slice(0, 2);

export function Work() {
  return (
    <section id="work" className="min-h-svh w-full">
      <div className="max-w-2xl mx-auto py-24">
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-8">Work</p>
        <div className="flex flex-col gap-4">
          {projects.map((item) => (
            <div key={item.organization} className="rounded-xl bg-card shadow-sm border p-3">
              <div className="rounded-lg bg-muted/40 p-6">
                <p className="text-base font-medium">{item.organization}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.role} · {item.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
