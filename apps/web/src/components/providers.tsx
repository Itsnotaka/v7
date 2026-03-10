"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

import { SiteCursor } from "~/components/site-cursor";

export function Providers({ children }: { children: React.ReactNode }) {
  const [query] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={query}>
      <NextThemesProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
        {children}
        <SiteCursor />
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
