"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";

interface GridItemProps {
  name: string;
  href?: string;
  children: React.ReactNode;
}

function GridItem({ name, href, children }: GridItemProps) {
  return (
    <li className="relative flex aspect-square items-center justify-center bg-card ring-1 ring-border">
      {href ? (
        <a
          href={href}
          className="absolute left-4 top-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {name}
        </a>
      ) : (
        <span className="absolute left-4 top-4 text-sm font-medium text-muted-foreground">
          {name}
        </span>
      )}
      <div className="flex items-center justify-center">{children}</div>
    </li>
  );
}

function HomeGrid() {
  const [switchState, setSwitchState] = useState(true);
  const [count, setCount] = useState(0);

  const components = [
    {
      name: "Button",
      id: "button",
      Component: (
        <div className="flex flex-col gap-3">
          <Button>Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
        </div>
      ),
    },
    {
      name: "Counter",
      id: "counter",
      Component: (
        <div className="flex flex-col items-center gap-3">
          <span className="text-3xl font-bold tabular-nums">{count}</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCount((c) => c - 1)}
            >
              −
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCount((c) => c + 1)}
            >
              +
            </Button>
          </div>
        </div>
      ),
    },
    {
      name: "Button Sizes",
      id: "sizes",
      Component: (
        <div className="flex flex-col items-center gap-2">
          <Button size="xs">Extra Small</Button>
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      ),
    },
    {
      name: "Icon Buttons",
      id: "icons",
      Component: (
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            ✕
          </Button>
          <Button variant="outline" size="icon-sm">
            ✓
          </Button>
          <Button variant="ghost" size="icon">
            ⋮
          </Button>
        </div>
      ),
    },
    {
      name: "Destructive",
      id: "destructive",
      Component: (
        <Button variant="destructive">Delete Item</Button>
      ),
    },
    {
      name: "Ghost",
      id: "ghost",
      Component: (
        <div className="flex gap-2">
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link Style</Button>
        </div>
      ),
    },
    {
      name: "Toggle",
      id: "toggle",
      Component: (
        <button
          type="button"
          role="switch"
          aria-checked={switchState}
          onClick={() => setSwitchState(!switchState)}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            switchState ? "bg-primary" : "bg-muted"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform ${
              switchState ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      ),
    },
    {
      name: "Badge",
      id: "badge",
      Component: (
        <div className="flex flex-col gap-2">
          <span className="inline-flex items-center rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
            Primary
          </span>
          <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
            Secondary
          </span>
          <span className="inline-flex items-center rounded-md border border-border px-2 py-1 text-xs font-medium">
            Outline
          </span>
        </div>
      ),
    },
  ];

  return (
    <ul className="grid auto-rows-min grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {components.map((c) => (
        <GridItem key={c.name} name={c.name} href={`/components/${c.id}`}>
          {c.Component}
        </GridItem>
      ))}
    </ul>
  );
}

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center border-b border-border px-6">
        <h1 className="text-lg font-semibold">v7</h1>
      </header>
      <main className="flex grow flex-col">
        <div className="mx-auto w-full grow">
          <HomeGrid />
        </div>
      </main>
    </div>
  );
}
