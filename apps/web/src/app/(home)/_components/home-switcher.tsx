"use client";

import type { ReactNode } from "react";

import { useVariant } from "~/lib/variant-context";

export function HomeSwitcher(props: { human: ReactNode; machine: ReactNode }) {
  const { variant } = useVariant();

  return (
    <>
      <div
        hidden={variant !== "human"}
        className="col-span-full grid grid-cols-subgrid auto-rows-auto"
      >
        {props.human}
      </div>
      <div
        hidden={variant !== "machine"}
        className="col-span-full grid grid-cols-subgrid auto-rows-auto"
      >
        {props.machine}
      </div>
    </>
  );
}
