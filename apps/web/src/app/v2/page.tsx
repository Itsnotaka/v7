import type { Metadata } from "next";

import { resume } from "@workspace/data";

import { Hero } from "./_components/hero";
import { About, Contact } from "./_components/landing";
import { Personal } from "./_components/personal";
import { Projects } from "./_components/projects";
import { HeroSignatures } from "./_components/signatures";

export const metadata: Metadata = {
  title: "Daniel — Product Designer",
  description: "Product designer building interfaces where people and AI agents work in real time.",
};

const name = `${resume.preferredName ?? resume.name.split(" ").at(0)} ${resume.name.split(" ").at(-1)}`;

const contacts = [
  { name: "Email", url: `mailto:${resume.email}` },
  ...resume.links,
  ...(resume.x ? [{ name: `X ${resume.x}`, url: `https://x.com/${resume.x.slice(1)}` }] : []),
  { name: "CV", url: resume.cvUrl },
  { name: "Index", url: "/v2/index" },
];

export default function Page() {
  return (
    <>
      <Hero name={name} signatures={<HeroSignatures />} />
      <Projects />
      <About about={resume.about} notes={resume.notes} education={resume.education} />
      <Personal />
      <Contact contacts={contacts} />
    </>
  );
}
