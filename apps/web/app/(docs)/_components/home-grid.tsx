import Link from "next/link";
import type * as React from "react";

type Item = {
  name: string;
  href?: string;
  node: React.ReactNode;
};

function Tile({
  name,
  href,
  children,
}: {
  name: string;
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <li className="relative flex aspect-square min-w-0 overflow-hidden bg-elevated ring-1 ring-line">
      {href ? (
        <Link
          href={href}
          className="absolute top-4 left-4 text-base font-medium text-subtle transition-colors hover:text-default"
        >
          {name}
        </Link>
      ) : (
        <span className="absolute top-4 left-4 text-base font-medium text-subtle italic">
          {name}
        </span>
      )}

      <div className="flex size-full min-w-0 items-center justify-center px-4 py-12">{children}</div>
    </li>
  );
}

export function HomeGrid() {
  const items: Item[] = [
    {
      name: "Button",
      href: "/components/button",
      node: (
        <div className="flex flex-col gap-3">
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Primary
          </button>
          <button className="rounded-lg border border-line bg-background px-4 py-2 text-sm font-medium">
            Outline
          </button>
        </div>
      ),
    },
    {
      name: "Badge",
      href: "/components/badge",
      node: (
        <div className="flex flex-col gap-2">
          <span className="inline-flex items-center rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
            Primary
          </span>
          <span className="inline-flex items-center rounded-md border border-line px-2 py-1 text-xs font-medium">
            Outline
          </span>
        </div>
      ),
    },
    {
      name: "Input",
      href: "/components/input",
      node: (
        <input
          type="text"
          placeholder="Type something..."
          className="w-full max-w-52 rounded-lg border border-line bg-background px-3 py-2 text-sm outline-hidden focus:ring-2 focus:ring-primary"
        />
      ),
    },
    {
      name: "Card",
      href: "/components/card",
      node: (
        <div className="w-full max-w-40 rounded-lg border border-line bg-background p-4">
          <p className="text-sm font-medium">Card Title</p>
          <p className="text-xs text-subtle">Card description</p>
        </div>
      ),
    },
    {
      name: "Avatar",
      node: (
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-10 place-items-center rounded-full bg-muted text-sm font-semibold">
            AL
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Ada Lovelace</p>
            <p className="truncate text-xs text-subtle">@ada</p>
          </div>
        </div>
      ),
    },
    {
      name: "Alert",
      node: (
        <div className="w-full max-w-56 rounded-lg border border-line bg-background p-3">
          <p className="text-sm font-medium">Heads up</p>
          <p className="text-xs text-subtle">Your API token expires in 3 days.</p>
        </div>
      ),
    },
    {
      name: "Tabs",
      node: (
        <div className="flex w-full max-w-56 flex-col gap-2">
          <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1 text-xs">
            <span className="rounded-md bg-background px-2 py-1 text-center font-medium">Account</span>
            <span className="rounded-md px-2 py-1 text-center text-subtle">Password</span>
            <span className="rounded-md px-2 py-1 text-center text-subtle">Team</span>
          </div>
          <div className="rounded-lg border border-line bg-background p-3 text-xs text-subtle">
            Manage your profile and account settings.
          </div>
        </div>
      ),
    },
    {
      name: "Accordion",
      node: (
        <div className="w-full max-w-56 divide-y divide-line rounded-lg border border-line bg-background text-sm">
          <div className="flex items-center justify-between px-3 py-2">
            <span>Is it accessible?</span>
            <span className="text-subtle">+</span>
          </div>
          <div className="px-3 py-2 text-xs text-subtle">Yes. It follows WAI-ARIA semantics.</div>
        </div>
      ),
    },
    {
      name: "Dialog",
      node: (
        <div className="w-full max-w-52 rounded-lg border border-line bg-background p-3 text-sm">
          <p className="mb-2 font-medium">Edit profile</p>
          <p className="mb-3 text-xs text-subtle">Save changes to your account profile.</p>
          <div className="flex justify-end gap-2">
            <button className="rounded-md border border-line px-2 py-1 text-xs">Cancel</button>
            <button className="rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground">
              Save
            </button>
          </div>
        </div>
      ),
    },
    {
      name: "Progress",
      node: (
        <div className="w-full max-w-56">
          <div className="mb-1 flex items-center justify-between text-xs text-subtle">
            <span>Deploying</span>
            <span>68%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-2/3 rounded-full bg-primary" />
          </div>
        </div>
      ),
    },
    {
      name: "Skeleton",
      node: (
        <div className="flex w-full max-w-56 flex-col gap-2">
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        </div>
      ),
    },
    {
      name: "Tooltip",
      node: (
        <div className="flex flex-col items-center gap-2">
          <button className="rounded-md border border-line bg-background px-3 py-2 text-sm">
            Hover target
          </button>
          <span className="rounded-md bg-muted px-2 py-1 text-xs text-subtle">Tooltip content</span>
        </div>
      ),
    },
  ];

  return (
    <ul className="grid w-full min-w-0 auto-rows-min grid-cols-1 overflow-x-hidden md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {items.map((item) => (
        <Tile key={item.name} name={item.name} href={item.href}>
          {item.node}
        </Tile>
      ))}
    </ul>
  );
}
