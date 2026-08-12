"use client";

import { Text } from "@v7/ui";
import { useState, type ReactNode } from "react";

import { Sheet } from "./sheet";

export function ProjectSheet(props: {
  kind: string;
  id: string;
  title: string;
  sheet: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="contents [&>div]:cursor-pointer"
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("a")) return;
          setOpen(true);
        }}
      >
        {props.children}
      </div>
      <Sheet
        title={props.title}
        label={props.kind}
        corner={
          <Text as="p" variant="meta" className="font-mono text-muted-foreground tabular-nums">
            #{props.id}
          </Text>
        }
        open={open}
        onOpenChange={setOpen}
      >
        {props.sheet}
      </Sheet>
    </>
  );
}
