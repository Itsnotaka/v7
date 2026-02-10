export type MediaKind = "image" | "video";

export type MediaRatio = "wide" | "ultra" | "square";

export type DemoKind = "mode" | "torque" | "panel" | "binnacle";

export type StoryMedia = {
  kind: MediaKind;
  src: string;
  alt: string;
  ratio: MediaRatio;
  slot: string;
  poster?: string;
};

export type Story = {
  id: string;
  kicker: string;
  title: string;
  body: string;
  points: string[];
  media: StoryMedia;
  demo?: DemoKind;
  align: "left" | "right";
};

export type HeroStat = {
  label: string;
  value: string;
};

export type Hero = {
  kicker: string;
  title: string;
  body: string;
  stats: HeroStat[];
  media: StoryMedia;
};

export type ModePreset = {
  id: string;
  title: string;
  body: string;
  response: number;
  damping: number;
  traction: number;
};

export type PanelMetric = {
  label: string;
  value: string;
};

export type PanelTab = {
  id: string;
  title: string;
  body: string;
  metrics: PanelMetric[];
};

export type TorqueConfig = {
  low: string;
  high: string;
  unit: string;
  min: number;
  max: number;
};

export type BinnacleConfig = {
  left: string;
  right: string;
  body: string;
};

export type Cta = {
  id: string;
  title: string;
  body: string;
  action: string;
  href: string;
};

export type Inside = {
  kicker: string;
  title: string;
  body: string;
  media: StoryMedia;
};

export type PortfolioVariant = {
  id: PortfolioId;
  label: string;
  tone: string;
  memory: string;
  hero: Hero;
  stories: Story[];
  mode: ModePreset[];
  panel: PanelTab[];
  torque: TorqueConfig;
  binnacle: BinnacleConfig;
  cta: Cta;
  inside: Inside;
};

type VariantSeed = {
  id: PortfolioId;
  label: string;
  tone: string;
  memory: string;
  heroTitle: string;
  heroBody: string;
  heroFilm: string;
  heroPoster: string;
  modeLabels: [string, string, string];
  panelLabels: [string, string, string, string];
  ctaTitle: string;
  ctaBody: string;
  ctaAction: string;
  ctaHref: string;
  insideTitle: string;
  insideBody: string;
  imageA: string;
  imageB: string;
};

export const PORTFOLIO_IDS = ["1", "2", "3", "4", "5"] as const;

export type PortfolioId = (typeof PORTFOLIO_IDS)[number];

function image(slot: string, alt: string, ratio: MediaRatio, src: string): StoryMedia {
  return {
    kind: "image",
    src,
    alt,
    ratio,
    slot,
  };
}

function video(slot: string, alt: string, ratio: MediaRatio, poster: string): StoryMedia {
  return {
    kind: "video",
    src: "",
    alt,
    ratio,
    slot,
    poster,
  };
}

function stories(seed: VariantSeed): Story[] {
  return [
    {
      id: "input-output",
      kicker: "01 Input / Output",
      title: "Every input maps to a single physical response.",
      body: `The ${seed.label} flow avoids abstraction theater. Controls are weighted, responses are analog-first, and every digital layer is tuned for immediate readability.`,
      points: ["Haptic-first toggles", "Predictable pedal curve", "No orphan interactions"],
      media: image(
        "input-output-image",
        "Cockpit interaction study placeholder",
        "wide",
        seed.imageA,
      ),
      align: "left",
    },
    {
      id: "interior-interface",
      kicker: "02 Interior / Interface",
      title: "Interface surfaces are shaped like engineered metal, not software cards.",
      body: `Typography scale, spacing rhythm, and contrast transitions are calibrated to make this environment feel fabricated rather than skinned.`,
      points: ["Display serif hierarchy", "Monospaced telemetry captions", "Subdued yet high-contrast layer stack"],
      media: image(
        "interior-interface-image",
        "Interior interface detail placeholder",
        "wide",
        seed.imageB,
      ),
      align: "right",
    },
    {
      id: "full-width-film",
      kicker: "03 Media Stage",
      title: "A full-bleed narrative film anchors pace and atmosphere.",
      body: "Drop in final launch footage by replacing the configured slot source. The stage preserves dimensions to avoid layout shift while assets are swapped.",
      points: ["16:7 cinematic ratio", "Crossfade-safe container", "Poster fallback included"],
      media: video("launch-film", "Narrative launch film placeholder", "ultra", seed.heroPoster),
      align: "left",
    },
    {
      id: "steering-wheel",
      kicker: "04 Steering Wheel",
      title: "The steering node prioritizes muscle memory over menu depth.",
      body: "Primary actions stay under the thumbs, secondary actions step outward, and every ring uses tactile separation to reduce glance time.",
      points: ["Thumb-zone partitioning", "Raised edge geometry", "Mirror-symmetric mapping"],
      media: image("wheel-feature", "Steering wheel feature placeholder", "square", seed.imageA),
      align: "right",
    },
    {
      id: "drive-mode",
      kicker: "05 Drive Mode Demo",
      title: "Three calibrated personalities, one predictable control language.",
      body: "This live demo adjusts response, damping, and traction in real time with reduced-motion-safe transitions and touch-sized controls.",
      points: ["44px targets", "Keyboard operable", "No transition-all usage"],
      media: image("mode-background", "Drive mode visualization placeholder", "wide", seed.imageB),
      demo: "mode",
      align: "left",
    },
    {
      id: "manual-torque",
      kicker: "06 Manual Torque Demo",
      title: "Paddle pressure scales torque output with direct visual feedback.",
      body: "The range control and paddle buttons update torque projection, slip reserve, and release pacing instantly. Nothing here is decorative.",
      points: ["Continuous slider input", "Discrete paddle controls", "Predictive reserve meter"],
      media: image("torque-background", "Torque mapping placeholder", "wide", seed.imageA),
      demo: "torque",
      align: "right",
    },
    {
      id: "binnacle",
      kicker: "07 Binnacle Demo",
      title: "Nested dials surface critical data without crowding the central read.",
      body: "Two concentric rings track speed and balance while center detail shifts for braking, load transfer, and heat management.",
      points: ["Concentric data rings", "Single focal center", "Soft warning thresholds"],
      media: image("binnacle-background", "Binnacle dial cluster placeholder", "square", seed.imageB),
      demo: "binnacle",
      align: "left",
    },
    {
      id: "steering-assembly",
      kicker: "08 Steering Assembly",
      title: "Mechanical assembly is presented as a material story, not a feature list.",
      body: "Fastener language, stitch depth, and carbon weave orientation are framed as one composition so each close-up supports a coherent reading.",
      points: ["Material continuity", "Asymmetric crop framing", "Texture-led hierarchy"],
      media: image("steering-assembly", "Steering assembly material placeholder", "wide", seed.imageA),
      align: "right",
    },
    {
      id: "control-panel",
      kicker: "09 Control Panel Demo",
      title: "Tabbed control panel keeps telemetry and comfort layers in one chassis.",
      body: "Each panel exposes a concise metric stack with keyboard-friendly tabs and explicit state changes for instant scanning.",
      points: ["ARIA tab semantics", "Persisted tab state", "Compact metric stack"],
      media: image("panel-background", "Control panel placeholder", "wide", seed.imageB),
      demo: "panel",
      align: "left",
    },
    {
      id: "centre-console",
      kicker: "10 Centre Console",
      title: "The console channel keeps tactile controls in a clean vertical runway.",
      body: "Every action path can be executed by feel. Visual labeling is sparse, high-contrast, and intentionally delayed to avoid cockpit noise.",
      points: ["Vertical action lane", "Backlit action islands", "Minimal annotation"],
      media: image("centre-console", "Centre console placeholder", "wide", seed.imageA),
      align: "right",
    },
    {
      id: "overhead-launch",
      kicker: "11 Overhead Launch",
      title: "Launch controls live overhead to separate ritual from routine.",
      body: "The overhead cluster introduces friction by design, reducing accidental triggers and making high-intensity routines deliberate.",
      points: ["Intentional reach gesture", "Guarded launch switch", "Staged visual confirmation"],
      media: image("overhead-launch", "Overhead launch sequence placeholder", "wide", seed.imageB),
      align: "left",
    },
    {
      id: "materials",
      kicker: "12 Seats / Materials",
      title: "Seat architecture and material swatches are tuned as one thermal system.",
      body: "Foam profile, perforation pattern, and textile grain are treated as performance hardware. The visual language remains consistent across all surfaces.",
      points: ["Breathability matrix", "Support zoning", "Wear-resistant edge wraps"],
      media: image("materials-swatch", "Seat and material swatch placeholder", "wide", seed.imageA),
      align: "right",
    },
  ];
}

function variant(seed: VariantSeed): PortfolioVariant {
  return {
    id: seed.id,
    label: seed.label,
    tone: seed.tone,
    memory: seed.memory,
    hero: {
      kicker: "Portfolio Prototype",
      title: seed.heroTitle,
      body: seed.heroBody,
      stats: [
        { label: "Sequence", value: "15 Sections" },
        { label: "Demos", value: "4 Live Components" },
        { label: "Motion", value: "Reduced-Safe" },
      ],
      media: video(seed.heroFilm, "Hero film placeholder slot", "ultra", seed.heroPoster),
    },
    stories: stories(seed),
    mode: [
      {
        id: "mode-a",
        title: seed.modeLabels[0],
        body: "Long-travel mapping with soft ramp-in and high stability reserve.",
        response: 34,
        damping: 76,
        traction: 88,
      },
      {
        id: "mode-b",
        title: seed.modeLabels[1],
        body: "Balanced map with medium throttle edge and controlled lift behavior.",
        response: 59,
        damping: 60,
        traction: 71,
      },
      {
        id: "mode-c",
        title: seed.modeLabels[2],
        body: "Fast attack map with tighter damping and assertive traction release.",
        response: 83,
        damping: 47,
        traction: 44,
      },
    ],
    panel: [
      {
        id: "panel-a",
        title: seed.panelLabels[0],
        body: "Chassis and load data with immediate thermal annotations.",
        metrics: [
          { label: "Load Split", value: "52 / 48" },
          { label: "Brake Heat", value: "468 C" },
          { label: "Downforce", value: "132 kg" },
        ],
      },
      {
        id: "panel-b",
        title: seed.panelLabels[1],
        body: "Cabin dynamics and environmental targets tuned for alertness.",
        metrics: [
          { label: "Cabin Temp", value: "20 C" },
          { label: "Humidity", value: "41%" },
          { label: "Air Bias", value: "Driver +8" },
        ],
      },
      {
        id: "panel-c",
        title: seed.panelLabels[2],
        body: "Navigation and tactical timing with lightweight lane guidance.",
        metrics: [
          { label: "Segment ETA", value: "02:41" },
          { label: "Window", value: "Green +12s" },
          { label: "Route Risk", value: "Low" },
        ],
      },
      {
        id: "panel-d",
        title: seed.panelLabels[3],
        body: "Audio and comms in a compact panel designed for one-glance checks.",
        metrics: [
          { label: "Engine Mix", value: "78%" },
          { label: "Comms", value: "Open" },
          { label: "Limiter", value: "-3 dB" },
        ],
      },
    ],
    torque: {
      low: "Progressive pull",
      high: "Immediate release",
      unit: "Nm",
      min: 320,
      max: 680,
    },
    binnacle: {
      left: "Velocity ring",
      right: "Balance ring",
      body: "Center readout prioritizes threshold warnings and steering load trendlines.",
    },
    cta: {
      id: "engineering-cta",
      title: seed.ctaTitle,
      body: seed.ctaBody,
      action: seed.ctaAction,
      href: seed.ctaHref,
    },
    inside: {
      kicker: "Inside Story",
      title: seed.insideTitle,
      body: seed.insideBody,
      media: video("inside-story-film", "Inside story final film placeholder", "ultra", seed.heroPoster),
    },
  };
}

const seed1: VariantSeed = {
  id: "1",
  label: "Atelier Noir",
  tone: "portfolio-tone-1",
  memory: "Black-room cinematic prototype with restrained metallic accents.",
  heroTitle: "A cockpit narrative built like a midnight studio film.",
  heroBody:
    "Variation one leans into industrial luxury: dense charcoal surfaces, focused amber accents, and cinematic sequencing designed to feel engineered.",
  heroFilm: "hero-film-noir",
  heroPoster: "/images/nyc-night.jpeg",
  modeLabels: ["Range", "Tour", "Perfo"],
  panelLabels: ["Telemetry", "Cabin", "Route", "Comms"],
  ctaTitle: "Commission a production interface sprint.",
  ctaBody: "Share your product constraints and we will map interaction, structure, and visual language in one build cycle.",
  ctaAction: "Start engineering brief",
  ctaHref: "mailto:studio@example.com?subject=Portfolio%20Sprint",
  insideTitle: "Inside the atelier: how constraints shape form.",
  insideBody:
    "The closing sequence documents trade-offs, iteration logic, and how each control moved from sketch to deployable component.",
  imageA: "/images/nyc-night.jpeg",
  imageB: "/images/nyc-day.jpeg",
};

const seed2: VariantSeed = {
  id: "2",
  label: "Ivory Circuit",
  tone: "portfolio-tone-2",
  memory: "Editorial light mode with parchment surfaces and copper cues.",
  heroTitle: "An editorial cockpit framed in light, brass, and precision.",
  heroBody:
    "Variation two is bright and refined: pale planes, copper highlights, and composition rules inspired by print design and technical manuals.",
  heroFilm: "hero-film-ivory",
  heroPoster: "/images/nyc-day.jpeg",
  modeLabels: ["Silk", "Grand", "Titan"],
  panelLabels: ["Dynamics", "Climate", "Navigation", "Audio"],
  ctaTitle: "Build a premium interface with editorial clarity.",
  ctaBody: "Designed for teams who need meticulous hierarchy, elegant visual rhythm, and production-ready implementation.",
  ctaAction: "Request concept packet",
  ctaHref: "mailto:studio@example.com?subject=Editorial%20Interface%20Packet",
  insideTitle: "Inside the circuit: balancing warmth with telemetry.",
  insideBody:
    "This closing chapter explores typographic discipline, contrast economics, and how light themes can stay dramatic under real product density.",
  imageA: "/images/nyc-day.jpeg",
  imageB: "/images/nyc-night.jpeg",
};

const seed3: VariantSeed = {
  id: "3",
  label: "Neon Forge",
  tone: "portfolio-tone-3",
  memory: "Angular tech aesthetic with electric cyan and magenta spark notes.",
  heroTitle: "A forged control language tuned for velocity and signal.",
  heroBody:
    "Variation three goes high-voltage: condensed display type, electric edge light, and telemetry-first sections that feel tactical and forward.",
  heroFilm: "hero-film-neon",
  heroPoster: "/images/nyc-night.jpeg",
  modeLabels: ["Pulse", "Attack", "Afterburn"],
  panelLabels: ["Signals", "Thermal", "Track", "Noise"],
  ctaTitle: "Prototype a high-energy dashboard system.",
  ctaBody: "Ideal for products that need sharp hierarchy, tactical animation, and a bold signature that still reads at speed.",
  ctaAction: "Book forge session",
  ctaHref: "mailto:studio@example.com?subject=Neon%20Forge%20Session",
  insideTitle: "Inside the forge: from signal noise to visual rhythm.",
  insideBody:
    "Final footage details pacing decisions, information prioritization, and how kinetic polish can stay disciplined under accessibility constraints.",
  imageA: "/images/nyc-night.jpeg",
  imageB: "/images/nyc-day.jpeg",
};

const seed4: VariantSeed = {
  id: "4",
  label: "Rosso Classica",
  tone: "portfolio-tone-4",
  memory: "Heritage racing palette with lacquer red and warm neutrals.",
  heroTitle: "Heritage-inspired controls with modern deployment discipline.",
  heroBody:
    "Variation four channels vintage racing studios: lacquer reds, cream technical sheets, and deliberate spacing that honors mechanical legacy.",
  heroFilm: "hero-film-rosso",
  heroPoster: "/images/nyc-day.jpeg",
  modeLabels: ["Strada", "Corsa", "Scuderia"],
  panelLabels: ["Chassis", "Comfort", "Course", "Voice"],
  ctaTitle: "Ship a heritage-modern product narrative.",
  ctaBody: "Perfect for teams blending brand legacy with contemporary interaction design and code-level quality requirements.",
  ctaAction: "Reserve studio slot",
  ctaHref: "mailto:studio@example.com?subject=Heritage%20Studio%20Slot",
  insideTitle: "Inside rosso classica: preserving soul at production scale.",
  insideBody:
    "This ending walks through brand extraction, motion restraint, and the small implementation details that keep nostalgia from becoming imitation.",
  imageA: "/images/nyc-day.jpeg",
  imageB: "/images/nyc-night.jpeg",
};

const seed5: VariantSeed = {
  id: "5",
  label: "Blueprint Zenith",
  tone: "portfolio-tone-5",
  memory: "Futurist blueprint aesthetic with cool steel and signal amber.",
  heroTitle: "A blueprint-grade cockpit for teams shipping at full pace.",
  heroBody:
    "Variation five is technical and spare: steel-toned planes, schematic overlays, and precision typography that foregrounds engineering intent.",
  heroFilm: "hero-film-blueprint",
  heroPoster: "/images/nyc-night.jpeg",
  modeLabels: ["Drift", "Vector", "Zenith"],
  panelLabels: ["Systems", "Air", "Mission", "Mix"],
  ctaTitle: "Launch a blueprint-to-product UI program.",
  ctaBody: "For teams who need an interface system that feels exacting, modern, and deeply aligned with engineering operations.",
  ctaAction: "Open implementation track",
  ctaHref: "mailto:studio@example.com?subject=Blueprint%20Implementation%20Track",
  insideTitle: "Inside zenith: schematic clarity meets emotional charge.",
  insideBody:
    "The final section documents component contracts, data choreography, and where atmosphere can coexist with measurable usability.",
  imageA: "/images/nyc-night.jpeg",
  imageB: "/images/nyc-day.jpeg",
};

export const PORTFOLIO_VARIANTS = {
  "1": variant(seed1),
  "2": variant(seed2),
  "3": variant(seed3),
  "4": variant(seed4),
  "5": variant(seed5),
} satisfies Record<PortfolioId, PortfolioVariant>;

export function getPortfolioVariant(id: string): PortfolioVariant | null {
  if (id in PORTFOLIO_VARIANTS) {
    return PORTFOLIO_VARIANTS[id as PortfolioId];
  }

  return null;
}

export function getPortfolioVariants(): PortfolioVariant[] {
  return PORTFOLIO_IDS.map((id) => PORTFOLIO_VARIANTS[id]);
}
