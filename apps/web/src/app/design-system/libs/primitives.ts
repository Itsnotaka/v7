export type Nav = {
  label: string;
  href: string;
};

export type Primitive = {
  name: string;
  slug: string;
  group: string;
  body: string;
};

export type PrimitiveGroup = {
  name: string;
  items: Primitive[];
};

export const PAGE_NAV: Nav[] = [
  { label: "Home", href: "/design-system" },
  { label: "Components", href: "/design-system/components" },
  { label: "Colors", href: "/design-system/colors" },
  { label: "Typography", href: "/design-system/typography" },
];

const LAYOUT: Primitive[] = [
  {
    name: "Accordion",
    slug: "accordion",
    group: "Layout",
    body: "Stack expandable sections while preserving vertical rhythm.",
  },
  {
    name: "Collapsible",
    slug: "collapsible",
    group: "Layout",
    body: "Toggle large content regions with smooth progressive disclosure.",
  },
  {
    name: "Separator",
    slug: "separator",
    group: "Layout",
    body: "Visually separate clusters of related controls and content.",
  },
  {
    name: "ScrollArea",
    slug: "scroll-area",
    group: "Layout",
    body: "Constrain overflow content while keeping custom styled scrollbars.",
  },
  {
    name: "Toolbar",
    slug: "toolbar",
    group: "Layout",
    body: "Compose dense action groups for editor and dashboard interfaces.",
  },
];

const OVERLAYS: Primitive[] = [
  {
    name: "AlertDialog",
    slug: "alert-dialog",
    group: "Overlays",
    body: "Prompt destructive or high-impact confirmation flows.",
  },
  {
    name: "Dialog",
    slug: "dialog",
    group: "Overlays",
    body: "Render blocking modal surfaces with proper focus management.",
  },
  {
    name: "Popover",
    slug: "popover",
    group: "Overlays",
    body: "Attach context-aware content to a trigger without page jumps.",
  },
  {
    name: "PreviewCard",
    slug: "preview-card",
    group: "Overlays",
    body: "Show rich previews on hover or focus for linked content.",
  },
  {
    name: "Tooltip",
    slug: "tooltip",
    group: "Overlays",
    body: "Display concise helper text for controls and icon actions.",
  },
  {
    name: "Toast",
    slug: "toast",
    group: "Overlays",
    body: "Queue non-blocking status feedback and async notifications.",
  },
];

const MENUS: Primitive[] = [
  {
    name: "Menu",
    slug: "menu",
    group: "Menus",
    body: "Build action menus with keyboard and pointer parity.",
  },
  {
    name: "Menubar",
    slug: "menubar",
    group: "Menus",
    body: "Create application-style top navigation command bars.",
  },
  {
    name: "ContextMenu",
    slug: "context-menu",
    group: "Menus",
    body: "Render right-click action sheets for contextual editing.",
  },
  {
    name: "NavigationMenu",
    slug: "navigation-menu",
    group: "Menus",
    body: "Compose complex site navigation with accessible patterns.",
  },
];

const CONTROLS: Primitive[] = [
  {
    name: "Autocomplete",
    slug: "autocomplete",
    group: "Form Controls",
    body: "Suggest options while users type free-form queries.",
  },
  {
    name: "Button",
    slug: "button",
    group: "Form Controls",
    body: "Trigger actions with expressive states and interactions.",
  },
  {
    name: "Checkbox",
    slug: "checkbox",
    group: "Form Controls",
    body: "Toggle independent binary options with clear affordance.",
  },
  {
    name: "CheckboxGroup",
    slug: "checkbox-group",
    group: "Form Controls",
    body: "Manage related multi-select values from a shared control group.",
  },
  {
    name: "Combobox",
    slug: "combobox",
    group: "Form Controls",
    body: "Mix searchable input and option selection in one field.",
  },
  {
    name: "Input",
    slug: "input",
    group: "Form Controls",
    body: "Collect short text values with consistent validation styling.",
  },
  {
    name: "NumberField",
    slug: "number-field",
    group: "Form Controls",
    body: "Capture numeric values with steppers and keyboard support.",
  },
  {
    name: "Radio",
    slug: "radio",
    group: "Form Controls",
    body: "Represent a single choice option inside grouped selection.",
  },
  {
    name: "RadioGroup",
    slug: "radio-group",
    group: "Form Controls",
    body: "Enforce single selection across multiple related choices.",
  },
  {
    name: "Select",
    slug: "select",
    group: "Form Controls",
    body: "Choose one item from a structured option list.",
  },
  {
    name: "Slider",
    slug: "slider",
    group: "Form Controls",
    body: "Adjust bounded numeric ranges via drag and keyboard controls.",
  },
  {
    name: "Switch",
    slug: "switch",
    group: "Form Controls",
    body: "Toggle on or off settings with immediate state feedback.",
  },
  {
    name: "Toggle",
    slug: "toggle",
    group: "Form Controls",
    body: "Switch pressed state for formatting and utility controls.",
  },
  {
    name: "ToggleGroup",
    slug: "toggle-group",
    group: "Form Controls",
    body: "Coordinate related toggle actions in shared containers.",
  },
];

const STRUCTURE: Primitive[] = [
  {
    name: "Field",
    slug: "field",
    group: "Form Structure",
    body: "Pair labels, inputs, descriptions, and errors consistently.",
  },
  {
    name: "Fieldset",
    slug: "fieldset",
    group: "Form Structure",
    body: "Group semantically linked controls with accessible legend text.",
  },
  {
    name: "Form",
    slug: "form",
    group: "Form Structure",
    body: "Compose full submit flows with validation and intent handling.",
  },
];

const DISPLAY: Primitive[] = [
  {
    name: "Avatar",
    slug: "avatar",
    group: "Display",
    body: "Render user identity media with initials fallbacks.",
  },
  {
    name: "Meter",
    slug: "meter",
    group: "Display",
    body: "Expose bounded scalar values with semantic thresholds.",
  },
  {
    name: "Progress",
    slug: "progress",
    group: "Display",
    body: "Visualize task completion with deterministic progress states.",
  },
  {
    name: "Tabs",
    slug: "tabs",
    group: "Display",
    body: "Swap sibling content regions through tabbed navigation.",
  },
];

export const PRIMITIVE_GROUPS: PrimitiveGroup[] = [
  { name: "Layout", items: LAYOUT },
  { name: "Overlays", items: OVERLAYS },
  { name: "Menus", items: MENUS },
  { name: "Form Controls", items: CONTROLS },
  { name: "Form Structure", items: STRUCTURE },
  { name: "Display", items: DISPLAY },
];

export const PRIMITIVES: Primitive[] = PRIMITIVE_GROUPS.flatMap((row) => row.items);

export const PRIMITIVE_BY_SLUG: Record<string, Primitive> = Object.fromEntries(
  PRIMITIVES.map((item) => [item.slug, item]),
);
