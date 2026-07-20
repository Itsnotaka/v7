import type { Metadata } from "next";
import type { ReactNode } from "react";

import { PageBody, PageSection, SectionHeading, Section } from "~/components/page-shell";
import {
  Button,
  Field,
  Input,
  InputGroup,
  InputGroupButton,
  InputGroupDescription,
  InputGroupInput,
  InputGroupLabel,
  Label,
  LinkButton,
  Loader,
  SkeletonLine,
  Surface,
  Text,
} from "~/components/ui";
import { AspectRatio } from "~/components/ui/aspect-ratio";

export const metadata: Metadata = {
  title: "Design System",
};

const buttonVariants = ["primary", "secondary", "ghost", "destructive", "outline"] as const;
const buttonSizes = ["xs", "sm", "base", "lg"] as const;
const textVariants = [
  "heading1",
  "heading2",
  "heading3",
  "body",
  "secondary",
  "success",
  "error",
  "mono",
  "mono-secondary",
] as const;
const textSizes = ["xs", "sm", "base", "lg"] as const;

function Demo({
  title,
  caption,
  children,
}: {
  title: string;
  caption?: string;
  children: ReactNode;
}) {
  return (
    <Surface className="flex flex-col gap-4 p-4 sm:p-5">
      <div className="flex flex-col gap-1">
        <Text as="h3" variant="heading3" size="base">
          {title}
        </Text>
        {caption ? (
          <Text as="p" variant="secondary" size="sm">
            {caption}
          </Text>
        ) : null}
      </div>
      {children}
    </Surface>
  );
}

function Matrix({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={["grid gap-3", className].filter(Boolean).join(" ")}>{children}</div>;
}

export default function Page() {
  return (
    <>
      <Section className="relative mt-8">
        <div className="col-span-8 tablet:col-span-5">
          <p className="first-letter:pr-1 first-letter:[-webkit-initial-letter:2] first-letter:[initial-letter:2] text-2xl/[1.5] tracking-wide text-balance">
            Local UI primitives used across the site — buttons, type, fields, and surfaces.
          </p>
        </div>
      </Section>

      <PageSection className="col-span-full gap-y-4 py-6">
        <div className="col-span-full flex flex-col gap-2 desktop:col-span-3">
          <SectionHeading>Actions</SectionHeading>
          <PageBody>
            Buttons cover primary actions, quieter controls, and lightweight links.
          </PageBody>
        </div>
        <div className="col-span-full grid gap-4 desktop:col-span-5">
          <Demo
            title="Variants"
            caption="Primary for commitment, ghost for low emphasis, destructive for irreversible actions."
          >
            <div className="flex flex-wrap gap-2">
              {buttonVariants.map((variant) => (
                <Button key={variant} variant={variant}>
                  {variant}
                </Button>
              ))}
            </div>
          </Demo>
          <Demo
            title="Sizes"
            caption="Four sizes cover compact controls through more prominent CTAs."
          >
            <div className="flex flex-wrap items-center gap-2">
              {buttonSizes.map((size) => (
                <Button key={size} size={size} variant="secondary">
                  {size}
                </Button>
              ))}
            </div>
          </Demo>
          <Demo
            title="Links"
            caption="LinkButton keeps inline and outbound actions aligned with the rest of the system."
          >
            <div className="flex flex-wrap gap-2">
              <LinkButton href="/about" variant="ghost">
                About route
              </LinkButton>
              <LinkButton href="https://github.com" variant="outline" external>
                External reference
              </LinkButton>
            </div>
          </Demo>
        </div>
      </PageSection>

      <PageSection className="col-span-full gap-y-4 py-6">
        <div className="col-span-full flex flex-col gap-2 desktop:col-span-3">
          <SectionHeading>Typography</SectionHeading>
          <PageBody>
            Text primitives define hierarchy and tone while staying tied to semantic color tokens.
          </PageBody>
        </div>
        <div className="col-span-full grid gap-4 desktop:col-span-5">
          <Demo
            title="Variants"
            caption="Display hierarchy, body copy, semantic emphasis, and monospace utilities."
          >
            <Matrix>
              {textVariants.map((variant) => (
                <div
                  key={variant}
                  className="grid gap-2 rounded-sm bg-muted/40 p-3 shadow-xs ring ring-border/70 sm:grid-cols-[8rem_1fr]"
                >
                  <Text variant="mono-secondary" size="sm">
                    {variant}
                  </Text>
                  <Text variant={variant} size="base">
                    The quick brown fox jumps over the lazy dog.
                  </Text>
                </div>
              ))}
            </Matrix>
          </Demo>
          <Demo
            title="Sizes"
            caption="Copy sizes remain compact and editorial rather than oversized."
          >
            <div className="flex flex-col gap-2">
              {textSizes.map((size) => (
                <div
                  key={size}
                  className="flex items-center justify-between gap-3 rounded-sm bg-background p-3 shadow-xs ring ring-border/70"
                >
                  <Text variant="body" size={size}>
                    Body text in {size}
                  </Text>
                  <Text variant="mono-secondary" size="sm">
                    {size}
                  </Text>
                </div>
              ))}
            </div>
          </Demo>
        </div>
      </PageSection>

      <PageSection className="col-span-full gap-y-4 py-6">
        <div className="col-span-full flex flex-col gap-2 desktop:col-span-3">
          <SectionHeading>Forms</SectionHeading>
          <PageBody>Inputs compose around labels, validation, and grouped controls.</PageBody>
        </div>
        <div className="col-span-full grid gap-4 desktop:col-span-5">
          <Demo title="Label and field" caption="Fields handle layout for native controls too.">
            <div className="grid gap-4">
              <Label htmlFor="workspace-input">Workspace</Label>
              <Field
                label="Release updates"
                description="Field also supports native controls such as checkboxes."
              >
                <input
                  aria-label="Release updates"
                  className="mt-0.5 size-4 rounded border border-border accent-primary"
                  defaultChecked
                  type="checkbox"
                />
              </Field>
            </div>
          </Demo>
          <Demo title="Inputs" caption="Plain fields with helper text.">
            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="workspace-input">Workspace</Label>
                <Input id="workspace-input" defaultValue="Paper" placeholder="Workspace name" />
                <p className="text-muted-foreground text-sm">
                  Short helper text keeps the field self-explanatory.
                </p>
              </div>
              <Input aria-label="API key" placeholder="sk_live_..." />
            </div>
          </Demo>
          <Demo
            title="Input group"
            caption="Grouped controls keep related actions attached to the input."
          >
            <div className="grid gap-3">
              <InputGroup>
                <InputGroupLabel>https://</InputGroupLabel>
                <InputGroupInput aria-label="Team domain" defaultValue="design.ticu.co" />
                <InputGroupButton variant="secondary">Copy</InputGroupButton>
              </InputGroup>
              <InputGroup focusMode="individual" size="sm">
                <InputGroupDescription>@</InputGroupDescription>
                <InputGroupInput aria-label="Handle" defaultValue="ticu" />
                <InputGroupButton variant="outline">Check</InputGroupButton>
              </InputGroup>
            </div>
          </Demo>
        </div>
      </PageSection>

      <PageSection className="col-span-full gap-y-4 py-6">
        <div className="col-span-full flex flex-col gap-2 desktop:col-span-3">
          <SectionHeading>Feedback</SectionHeading>
          <PageBody>Loading states keep flows communicative without visual noise.</PageBody>
        </div>
        <div className="col-span-full grid gap-4 desktop:col-span-5">
          <Demo
            title="Loading"
            caption="Use the loader for active work and skeleton lines for content still resolving."
          >
            <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
              <div className="flex items-center gap-3 rounded-sm bg-background p-3 shadow-xs ring ring-border/70">
                <Loader size="sm" />
                <Loader size="base" />
                <Loader size="lg" />
              </div>
              <Surface tone="muted" className="flex flex-col gap-2 p-3">
                <SkeletonLine className="h-3" maxWidth={85} minWidth={60} />
                <SkeletonLine className="h-3" maxWidth={95} minWidth={70} />
                <SkeletonLine className="h-3" maxWidth={70} minWidth={40} />
              </Surface>
            </div>
          </Demo>
        </div>
      </PageSection>

      <PageSection className="col-span-full gap-y-4 py-6 pb-12">
        <div className="col-span-full flex flex-col gap-2 desktop:col-span-3">
          <SectionHeading>Surfaces</SectionHeading>
          <PageBody>Calm containers for content and media.</PageBody>
        </div>
        <div className="col-span-full grid gap-4 desktop:col-span-5">
          <Demo
            title="Surfaces and media"
            caption="Frame content blocks or muted supporting areas."
          >
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
              <Surface className="p-3">
                <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-sm bg-muted">
                  <div className="absolute inset-0 bg-linear-to-br from-muted to-background" />
                  <div className="absolute inset-x-4 bottom-4 flex flex-col gap-1">
                    <Text variant="heading3" size="base">
                      System preview
                    </Text>
                    <Text variant="secondary" size="sm">
                      Balanced neutrals, compact type, and restrained emphasis.
                    </Text>
                  </div>
                </AspectRatio>
              </Surface>
              <Surface tone="muted" className="flex flex-col justify-between gap-4 p-4">
                <div className="flex flex-col gap-1">
                  <Text variant="heading3" size="base">
                    Local imports
                  </Text>
                  <Text variant="secondary" size="sm">
                    Consume primitives from the app UI barrel.
                  </Text>
                </div>
                <Text variant="mono-secondary" size="sm">
                  {'import { Button, Input, Surface } from "~/components/ui"'}
                </Text>
              </Surface>
            </div>
          </Demo>
        </div>
      </PageSection>
    </>
  );
}
