import type { Primitive } from "~/app/design-system/libs/primitives";

export function PrimitivePreview({ item }: { item: Primitive }) {
  if (item.name === "Button") {
    return (
      <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
        Press
      </button>
    );
  }

  if (item.name === "Input") {
    return (
      <input
        type="text"
        placeholder="Type here"
        className="w-full max-w-52 rounded-lg border border-line bg-background px-3 py-2 text-sm outline-hidden"
      />
    );
  }

  if (item.name === "Checkbox" || item.name === "CheckboxGroup") {
    return (
      <div className="flex flex-col gap-2 text-sm">
        <label className="flex items-center gap-2">
          <span className="size-4 rounded border border-line bg-background" />
          <span>Option A</span>
        </label>
        {item.name === "CheckboxGroup" && (
          <label className="flex items-center gap-2 text-subtle">
            <span className="size-4 rounded border border-line bg-background" />
            <span>Option B</span>
          </label>
        )}
      </div>
    );
  }

  if (item.name === "Switch") {
    return (
      <div className="h-6 w-11 rounded-full bg-muted p-1">
        <div className="size-4 rounded-full bg-background shadow-xs" />
      </div>
    );
  }

  if (item.name === "Slider") {
    return (
      <div className="w-full max-w-52">
        <div className="h-2 rounded-full bg-muted">
          <div className="h-2 w-2/3 rounded-full bg-primary" />
        </div>
      </div>
    );
  }

  if (item.name === "Progress" || item.name === "Meter") {
    return (
      <div className="w-full max-w-52">
        <div className="mb-1 flex justify-between text-xs text-subtle">
          <span>Value</span>
          <span>72%</span>
        </div>
        <div className="h-2 rounded-full bg-muted">
          <div className="h-2 w-2/3 rounded-full bg-primary" />
        </div>
      </div>
    );
  }

  if (item.name === "Avatar") {
    return (
      <div className="grid size-12 place-items-center rounded-full bg-muted text-sm font-semibold">
        AV
      </div>
    );
  }

  if (item.name === "Tabs" || item.name === "NavigationMenu" || item.name === "Menubar") {
    return (
      <div className="grid w-full max-w-56 grid-cols-3 gap-1 rounded-lg bg-muted p-1 text-xs">
        <span className="rounded-md bg-background px-2 py-1 text-center font-medium">One</span>
        <span className="rounded-md px-2 py-1 text-center text-subtle">Two</span>
        <span className="rounded-md px-2 py-1 text-center text-subtle">Three</span>
      </div>
    );
  }

  if (item.name === "Dialog" || item.name === "AlertDialog" || item.name === "Popover") {
    return (
      <div className="w-full max-w-52 rounded-lg border border-line bg-background p-3 text-sm">
        <p className="mb-2 font-medium">Panel</p>
        <p className="text-xs text-subtle">Overlay content preview.</p>
      </div>
    );
  }

  if (item.name === "Toast") {
    return (
      <div className="w-full max-w-56 rounded-lg border border-line bg-background p-3 text-sm">
        <p className="font-medium">Saved</p>
        <p className="text-xs text-subtle">Your changes were persisted.</p>
      </div>
    );
  }

  if (item.name === "Tooltip" || item.name === "PreviewCard") {
    return (
      <div className="flex flex-col items-center gap-2">
        <button className="rounded-md border border-line bg-background px-3 py-2 text-sm">
          Target
        </button>
        <span className="rounded-md bg-muted px-2 py-1 text-xs text-subtle">Preview</span>
      </div>
    );
  }

  if (item.name === "Separator") {
    return (
      <div className="w-full max-w-56">
        <div className="h-px bg-line" />
      </div>
    );
  }

  if (item.name === "ScrollArea") {
    return (
      <div className="w-full max-w-56 rounded-lg border border-line bg-background p-3">
        <div className="grid gap-1 text-xs text-subtle">
          <span>Scrollable row 1</span>
          <span>Scrollable row 2</span>
          <span>Scrollable row 3</span>
        </div>
      </div>
    );
  }

  if (item.name === "Toolbar" || item.name === "ToggleGroup") {
    return (
      <div className="flex gap-2">
        <button className="rounded-md border border-line bg-background px-2 py-1 text-xs">A</button>
        <button className="rounded-md border border-line bg-background px-2 py-1 text-xs">B</button>
        <button className="rounded-md border border-line bg-background px-2 py-1 text-xs">C</button>
      </div>
    );
  }

  if (item.name === "Toggle") {
    return (
      <button className="rounded-md border border-line bg-background px-3 py-2 text-sm">On</button>
    );
  }

  if (
    item.name === "Radio" ||
    item.name === "RadioGroup" ||
    item.name === "Select" ||
    item.name === "NumberField" ||
    item.name === "Combobox" ||
    item.name === "Autocomplete"
  ) {
    return (
      <div className="w-full max-w-52 rounded-lg border border-line bg-background px-3 py-2 text-sm text-subtle">
        {item.name}
      </div>
    );
  }

  if (item.name === "Field" || item.name === "Fieldset" || item.name === "Form") {
    return (
      <div className="w-full max-w-56 rounded-lg border border-line bg-background p-3">
        <p className="mb-2 text-xs font-medium text-subtle">Label</p>
        <div className="h-8 rounded-md border border-line bg-muted/40" />
      </div>
    );
  }

  if (item.name === "Menu" || item.name === "ContextMenu") {
    return (
      <div className="w-full max-w-44 rounded-lg border border-line bg-background p-1 text-sm">
        <p className="rounded-md px-2 py-1">Action</p>
        <p className="rounded-md px-2 py-1">Rename</p>
        <p className="rounded-md px-2 py-1">Delete</p>
      </div>
    );
  }

  if (item.name === "Accordion" || item.name === "Collapsible") {
    return (
      <div className="w-full max-w-56 rounded-lg border border-line bg-background p-3 text-sm">
        <div className="mb-2 flex items-center justify-between">
          <span>Section</span>
          <span className="text-subtle">+</span>
        </div>
        <p className="text-xs text-subtle">Expandable content</p>
      </div>
    );
  }

  return <span className="text-sm text-subtle">{item.name}</span>;
}
