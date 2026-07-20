"use client";

import { Dot, Text, theme } from "@v7/ui";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  createContext,
  type ComponentProps,
  type ReactNode,
  use,
  useEffect,
  useMemo,
  useState,
} from "react";

import { cn } from "~/utils/cn";

import { ConnectSheet } from "./connect-sheet";

const MonoContext = createContext<{ mono: boolean; setMono: (value: boolean) => void }>({
  mono: false,
  setMono: () => {},
});

export function useMono() {
  return use(MonoContext);
}

export function useNight() {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    night: (mounted ? theme.resolvedTheme : "dark") !== "light",
    toggle: () => theme.setTheme(theme.resolvedTheme === "light" ? "dark" : "light"),
  };
}

function Control(props: ComponentProps<"button">) {
  return (
    <Text
      as="button"
      variant="control"
      type="button"
      className={cn("min-h-9 px-2 text-primary/70 hover:text-primary", theme.ring)}
      {...props}
    />
  );
}

function NavItem({
  children,
  href,
  external = false,
}: {
  children: ReactNode;
  href: string;
  external?: boolean;
}) {
  const content = (
    <>
      <Dot className="bg-primary/45 group-hover:bg-primary-foreground" />
      {children}
    </>
  );
  const classes = cn(
    "group flex min-h-9 items-center gap-2 px-4 text-primary hover:bg-primary hover:text-primary-foreground sm:px-6",
    theme.ringInset,
  );

  return (
    <Text as="li" variant="control" className="text-2xl">
      {external ? (
        <a href={href} target="_blank" rel="noreferrer" className={classes}>
          {content}
        </a>
      ) : (
        <Link href={href} className={classes}>
          {content}
        </Link>
      )}
    </Text>
  );
}

function Navbar({ name, title }: { name: string; title: string }) {
  const { mono, setMono } = useMono();
  const { night, toggle } = useNight();

  return (
    <header className={cn("border-b bg-background", theme.hairline)}>
      <div
        className={cn(
          "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b px-4 text-primary sm:px-6",
          theme.hairline,
        )}
      >
        <Link
          href="/v2"
          aria-label="Homepage"
          className={cn("flex min-h-9 min-w-0 items-center", theme.ring)}
        >
          <Text variant="brand" className="truncate text-2xl">
            {name}
            <span className="ml-2 text-primary/55">{title}</span>
          </Text>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <Control aria-pressed={mono} onClick={() => setMono(!mono)}>
            [{mono ? "spectrum" : "mono"}]
          </Control>
          <Control onClick={toggle}>[{night ? "day" : "night"}]</Control>
          <ConnectSheet>
            <Text
              as="button"
              variant="control"
              type="button"
              className={cn("min-h-9 cursor-pointer px-2 text-primary", theme.link, theme.ring)}
            >
              connect &#8599;
            </Text>
          </ConnectSheet>
        </div>
      </div>
      <nav aria-label="Site">
        <ul role="list" className="grid grid-cols-2 sm:grid-cols-4">
          <NavItem href="/v2#projects">Projects</NavItem>
          <NavItem href="/v2/writing">Writing</NavItem>
          <NavItem href="/v2/photos">Photos</NavItem>
          <NavItem href="/v2/index">Index</NavItem>
        </ul>
      </nav>
    </header>
  );
}

export function SiteChrome({
  name,
  title,
  children,
}: {
  name: string;
  title: string;
  children: ReactNode;
}) {
  const [mono, setMono] = useState(false);
  const value = useMemo(() => ({ mono, setMono }), [mono]);

  return (
    <MonoContext value={value}>
      <div className="min-h-svh bg-background text-foreground">
        <Navbar name={name} title={title} />
        <main>{children}</main>
      </div>
    </MonoContext>
  );
}
