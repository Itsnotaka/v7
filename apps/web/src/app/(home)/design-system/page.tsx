import type { Metadata } from "next";
import type { ReactNode } from "react";

import {
  AspectRatio,
  Badge,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ticu/ui";

import { PageBody, PageSection, SectionHeading, Section } from "~/components/page-shell";
// Local custom components (migrated from v7 internal UI)
import {
  Field,
  InputGroup,
  InputGroupButton,
  InputGroupDescription,
  InputGroupInput,
  InputGroupLabel,
  LinkButton,
  Loader,
  SkeletonLine,
  Surface,
  Text,
} from "~/components/ui";

export const metadata: Metadata = {
  title: "Design System",
};

const buttonVariants = ["default", "secondary", "ghost", "destructive", "outline"] as const;
const buttonSizes = ["xs", "sm", "default", "lg"] as const;
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
const badgeVariants = ["default", "secondary", "destructive", "outline", "ghost"] as const;

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
    <TooltipProvider>
      <>
        <Section className="relative mt-8">
          <div className="col-span-8 tablet:col-span-5">
            <p className="first-letter:pr-1 first-letter:[-webkit-initial-letter:2] first-letter:[initial-letter:2] text-2xl/[1.5] tracking-wide text-balance">
              A compact reference for the shared UI package used across the site. Components,
              tokens, and patterns from ticu/ui.
            </p>
          </div>
        </Section>

        <PageSection className="col-span-full gap-y-4 py-6">
          <div className="col-span-full flex flex-col gap-2 desktop:col-span-3">
            <SectionHeading>Actions</SectionHeading>
            <PageBody>
              Buttons cover primary actions, quieter controls, and lightweight links without leaving
              the shared visual language.
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
              Text primitives define hierarchy and tone while staying tied to the app’s semantic
              color system.
            </PageBody>
          </div>
          <div className="col-span-full grid gap-4 desktop:col-span-5">
            <Demo
              title="Variants"
              caption="Display hierarchy, body copy, semantic emphasis, and monospace utilities come from one primitive."
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
            <PageBody>
              Inputs compose around labels, descriptions, validation, and grouped controls without
              needing extra wrapper code in most flows.
            </PageBody>
          </div>
          <div className="col-span-full grid gap-4 desktop:col-span-5">
            <Demo
              title="Label and field"
              caption="Standalone labels can carry optional text and extra context. Fields handle layout for native controls too."
            >
              <div className="grid gap-4">
                <Tooltip>
                  <TooltipTrigger
                    render={<Label className="w-fit cursor-help">Project name</Label>}
                  />
                  <TooltipContent>
                    Useful when a field needs a short explanation beside its label.
                  </TooltipContent>
                </Tooltip>
                <Field
                  label="Release updates"
                  description="Field also supports native controls such as checkboxes and switches."
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
            <Demo
              title="Inputs"
              caption="The same input primitive supports plain fields, richer descriptions, and inline validation."
            >
              <div className="grid gap-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="workspace-input">Workspace</Label>
                  <Input id="workspace-input" defaultValue="Paper" placeholder="Workspace name" />
                  <p className="text-muted-foreground text-sm">
                    Short helper text keeps the field self-explanatory.
                  </p>
                </div>
                <Input aria-label="API key" placeholder="sk_live_..." />
                <div className="grid gap-1.5">
                  <Label htmlFor="desc-textarea">Description</Label>
                  <Textarea
                    id="desc-textarea"
                    defaultValue="A calm, precise design language for internal product work."
                    rows={4}
                  />
                  <p className="text-muted-foreground text-sm">
                    Textarea shares the same field patterns.
                  </p>
                </div>
              </div>
            </Demo>
            <Demo
              title="Input group"
              caption="Grouped controls keep related actions visually attached to the input they affect."
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
            <PageBody>
              Lightweight status indicators and loading states keep flows communicative without
              adding visual noise.
            </PageBody>
          </div>
          <div className="col-span-full grid gap-4 desktop:col-span-5">
            <Demo title="Badges" caption="Badges label state, maturity, and emphasis at a glance.">
              <div className="flex flex-wrap gap-2">
                {badgeVariants.map((variant) => (
                  <Badge key={variant} variant={variant}>
                    {variant}
                  </Badge>
                ))}
              </div>
            </Demo>
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

        <PageSection className="col-span-full gap-y-4 py-6">
          <div className="col-span-full flex flex-col gap-2 desktop:col-span-3">
            <SectionHeading>Overlays</SectionHeading>
            <PageBody>
              Tooltips and dialogs cover quick context and focused interruption while staying within
              the same surface and motion system.
            </PageBody>
          </div>
          <div className="col-span-full grid gap-4 desktop:col-span-5">
            <Demo
              title="Tooltip"
              caption="A small wrapper gives labels and controls additional context without adding permanent copy."
            >
              <div className="flex flex-wrap items-center gap-3">
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <span className="inline-flex cursor-help rounded-full border border-border px-3 py-1.5 text-sm text-foreground">
                        Hover target
                      </span>
                    }
                  />
                  <TooltipContent>Helpful for explaining compact controls.</TooltipContent>
                </Tooltip>
                <Text variant="secondary" size="sm">
                  Hover or focus the trigger to preview the shared tooltip styling.
                </Text>
              </div>
            </Demo>
            <Demo
              title="Dialog"
              caption="Dialogs inherit the same surface treatment and support multiple width presets."
            >
              <Dialog>
                <div className="flex items-center gap-3">
                  <DialogTrigger render={<Button>Open dialog</Button>} />
                  <Text variant="secondary" size="sm">
                    Compact content works well with the default dialog size.
                  </Text>
                </div>
                <DialogContent className="max-w-sm">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <DialogTitle>Share library</DialogTitle>
                      <DialogDescription>
                        Package a stable set of primitives, tokens, and documentation for the team.
                      </DialogDescription>
                    </div>
                    <div className="flex gap-2">
                      <DialogClose render={<Button variant="outline">Close</Button>} />
                      <DialogClose render={<Button>Sounds good</Button>} />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </Demo>
          </div>
        </PageSection>

        <PageSection className="col-span-full gap-y-4 py-6 pb-12">
          <div className="col-span-full flex flex-col gap-2 desktop:col-span-3">
            <SectionHeading>Surfaces</SectionHeading>
            <PageBody>
              Surface and aspect-ratio primitives help create calm containers for content, media,
              and compact dashboard modules.
            </PageBody>
          </div>
          <div className="col-span-full grid gap-4 desktop:col-span-5">
            <Demo
              title="Surfaces and media"
              caption="The same primitive can frame content blocks or muted supporting areas."
            >
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                <Surface className="p-3">
                  <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-sm bg-muted">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--color-primary)_0%,transparent_40%),linear-gradient(135deg,var(--color-muted),var(--color-background))]" />
                    <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                      <div className="flex flex-col gap-1">
                        <Text variant="heading3" size="base">
                          System preview
                        </Text>
                        <Text variant="secondary" size="sm">
                          Balanced neutrals, compact type, and restrained emphasis.
                        </Text>
                      </div>
                      <Badge className="bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                        beta
                      </Badge>
                    </div>
                  </AspectRatio>
                </Surface>
                <Surface tone="muted" className="flex flex-col justify-between gap-4 p-4">
                  <div className="flex flex-col gap-1">
                    <Text variant="heading3" size="base">
                      Packaging
                    </Text>
                    <Text variant="secondary" size="sm">
                      Consume from the public package entrypoint to stay aligned with the supported
                      surface area.
                    </Text>
                  </div>
                  <Text variant="mono-secondary" size="sm">
                    {'import { Button, Input, Surface } from "@ticu/ui"'}
                  </Text>
                </Surface>
              </div>
            </Demo>
          </div>
        </PageSection>
      </>
    </TooltipProvider>
  );
}
