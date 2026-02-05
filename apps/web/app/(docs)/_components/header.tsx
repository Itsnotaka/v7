export function Header({ version = "0.0.1" }: { version?: string }) {
  return (
    <header className="sticky top-0 z-10 h-[49px] border-b border-line bg-elevated pr-12">
      <div className="mx-auto flex h-full items-center border-r border-line px-4">
        <p className="ml-auto font-mono text-base text-subtle">
          @workspace/ui
          <span className="ml-1 rounded bg-muted px-1.5 py-0.5 text-xs text-default">
            v{version}
          </span>
        </p>
      </div>
    </header>
  );
}
