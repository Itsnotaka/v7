"use client";

import { createContext, useContext } from "react";
import { useDialKit } from "dialkit";

export type TextParams = {
  heading: { tracking: number; lineHeight: number };
  body: { tracking: number; lineHeight: number };
  caption: { tracking: number; lineHeight: number };
};

const TextParamsContext = createContext<TextParams | null>(null);

export function useTextParams(): TextParams {
  const ctx = useContext(TextParamsContext);
  if (!ctx) throw new Error("useTextParams must be used within TextParamsProvider");
  return ctx;
}

export function TextParamsProvider({ children }: { children: React.ReactNode }) {
  const params = useDialKit("Text", {
    heading: {
      tracking: [0.01, -0.15, 0.5, 0.001],
      lineHeight: [2, 0.5, 5, 0.05],
    },
    body: {
      tracking: [0.01, -0.15, 0.5, 0.001],
      lineHeight: [1.5, 0.5, 4, 0.05],
    },
    caption: {
      tracking: [0.01, -0.15, 0.5, 0.001],
      lineHeight: [1.25, 0.5, 3.5, 0.05],
    },
  });

  return <TextParamsContext.Provider value={params}>{children}</TextParamsContext.Provider>;
}
