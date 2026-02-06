import type * as React from "react";

import { Header } from "~/app/design-system/_components/header";

type DocPageProps = {
  title: string;
  body: string;
  tag?: string;
  children: React.ReactNode;
};

export function DocPage({ title, body, tag, children }: DocPageProps) {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden">
      <Header />

      <div className="border-b border-line pr-12">
        <div className="mx-auto w-full min-w-0 border-r border-line">
          <div className="mx-auto max-w-5xl px-8 py-12">
            <div className="mb-4 flex min-w-0 items-center gap-3">
              <h1 className="truncate text-4xl font-bold text-default">{title}</h1>
              {tag && (
                <span className="shrink-0 rounded-md border border-line bg-muted px-2 py-1 text-xs text-subtle">
                  {tag}
                </span>
              )}
            </div>
            <p className="text-lg text-subtle">{body}</p>
          </div>
        </div>
      </div>

      <main className="flex min-w-0 grow flex-col overflow-x-hidden pr-12">
        <div className="mx-auto w-full min-w-0 grow border-r border-line">
          <div className="mx-auto max-w-5xl px-8 py-12">{children}</div>
        </div>
      </main>
    </div>
  );
}
