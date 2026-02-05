interface GridItemProps {
  name: string;
  href?: string;
  children: React.ReactNode;
}

function GridItem({ name, href, children }: GridItemProps) {
  return (
    <li className="relative flex aspect-square items-center justify-center bg-elevated ring-1 ring-line -ml-px -mt-px">
      {href ? (
        <a
          href={href}
          className="absolute left-4 top-4 text-sm font-medium text-subtle transition-colors hover:text-default"
        >
          {name}
        </a>
      ) : (
        <span className="absolute left-4 top-4 text-sm font-medium text-subtle">
          {name}
        </span>
      )}
      <div className="flex items-center justify-center">{children}</div>
    </li>
  );
}

export function HomeGrid() {
  const components = [
    {
      name: "Button",
      id: "button",
      Component: (
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
      id: "badge",
      Component: (
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
      id: "input",
      Component: (
        <input
          type="text"
          placeholder="Type something..."
          className="rounded-lg border border-line bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      ),
    },
    {
      name: "Card",
      id: "card",
      Component: (
        <div className="w-40 rounded-lg border border-line bg-background p-4">
          <p className="text-sm font-medium">Card Title</p>
          <p className="text-xs text-subtle">Card description</p>
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
