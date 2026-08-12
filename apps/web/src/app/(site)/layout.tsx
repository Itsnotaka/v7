import type * as React from "react";

import { resume } from "@workspace/data";

import { SiteChrome } from "./_components/site-chrome";

const name = `${resume.preferredName ?? resume.name.split(" ").at(0)} ${resume.name.split(" ").at(-1)}`;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SiteChrome name={name} title={resume.title}>
      {children}
    </SiteChrome>
  );
}
