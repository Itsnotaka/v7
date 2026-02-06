import type * as React from "react";

import { SidebarNav } from "~/app/design-system/_components/sidebar-nav";
import { ThemeToggle } from "~/app/design-system/_components/theme-toggle";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="isolate min-h-dvh [--sidebar-offset:3rem] md:has-[aside[data-sidebar-open=true]]:[--sidebar-offset:19rem]">
      <SidebarNav />

      <div className="pointer-events-auto fixed top-0 right-0 z-50 grid h-[49px] w-12 place-items-center">
        <ThemeToggle />
      </div>

      <div
        id="main-content"
        className="ml-[var(--sidebar-offset)] h-dvh overflow-x-hidden overflow-y-auto overscroll-y-none transition-[margin] duration-300"
      >
        {children}
      </div>
    </div>
  );
}
