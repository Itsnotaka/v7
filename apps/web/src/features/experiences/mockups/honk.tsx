const FONT_STACK = "[font-family:-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]";
const MONO_STACK = "[font-family:ui-monospace,'SF_Mono',Menlo,Monaco,Consolas,monospace]";

const TEXT_PRIMARY = "text-[#141414] dark:text-[#E4E4E4EB]";
const TEXT_MUTED = "text-[#141414BD] dark:text-[#E4E4E48D]";
const TEXT_FAINT = "text-[#1414145C] dark:text-[#E4E4E45E]";
const LAYER_01 = "bg-[#F3F3F3] dark:bg-[#1C1C1C]";
const RING_BASE = "shadow-[inset_0_0_0_1px_#1414141F] dark:shadow-[inset_0_0_0_1px_#E4E4E426]";
const RING_MUTED = "shadow-[inset_0_0_0_1px_#14141414] dark:shadow-[inset_0_0_0_1px_#E4E4E413]";
const DIFF_ADD = "text-[#007041] dark:text-[#3FA266]";
const DIFF_DEL = "text-[#BE1744] dark:text-[#FC6B83]";

function TrafficLights() {
  return (
    <span className="flex items-center gap-2">
      <span className="size-3 rounded-full bg-[#FF5F57]" />
      <span className="size-3 rounded-full bg-[#FEBC2E]" />
      <span className="size-3 rounded-full bg-[#28C840]" />
    </span>
  );
}

function ArrowUpIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M6 10.5v-9M2 5.5 6 1.5l4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 1.5v11M1.5 7h11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path
        d="m1.5 3.5 3.5 3.5L8.5 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M1.5 3.5A1.5 1.5 0 0 1 3 2h2.6l1.4 1.6H11a1.5 1.5 0 0 1 1.5 1.5v5.4A1.5 1.5 0 0 1 11 12H3a1.5 1.5 0 0 1-1.5-1.5v-7Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M3 1.5h5L11.5 5v7A1.5 1.5 0 0 1 10 13.5H3A1.5 1.5 0 0 1 1.5 12V3A1.5 1.5 0 0 1 3 1.5ZM8 1.5V5h3.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Titlebar(props: { activeTab: string }) {
  return (
    <div className="relative flex h-9 shrink-0 items-end px-2 pb-1">
      <span className="absolute top-0 bottom-1 left-4 flex items-center">
        <TrafficLights />
      </span>
      <div className="flex h-7 items-center gap-1 pl-[76px]">
        <span className={`flex h-7 items-center rounded-[6px] px-2.5 text-[13px] ${TEXT_MUTED}`}>
          Home
        </span>
        <span
          className={`flex h-7 max-w-[224px] items-center gap-1.5 rounded-[6px] bg-[#14141414] px-2.5 text-[13px] dark:bg-[#E4E4E41E] ${TEXT_PRIMARY}`}
        >
          <span className="size-1.5 shrink-0 rounded-full bg-[#007041] dark:bg-[#3FA266]" />
          <span className="truncate">{props.activeTab}</span>
        </span>
      </div>
    </div>
  );
}

function Sheet(props: { children: React.ReactNode }) {
  return (
    <div className="min-h-0 flex-1 px-2 pb-2">
      <div className="flex h-full overflow-hidden rounded-[10px] bg-[#FCFCFC] shadow-[0_2px_4px_rgba(0,0,0,0.04),0_1px_2px_-1px_rgba(0,0,0,0.08),0_0_0_0.5px_rgba(0,0,0,0.12)] dark:bg-[#181818] dark:shadow-[0_2px_4px_rgba(0,0,0,0.30),0_0_0_0.5px_rgba(255,255,255,0.16)]">
        {props.children}
      </div>
    </div>
  );
}

function Frame(props: { activeTab: string; children: React.ReactNode }) {
  return (
    <div
      className={`flex aspect-[16/10] w-full flex-col overflow-hidden rounded-[2px] bg-[#F3F3F3] text-[13px] leading-[18px] tracking-[-0.08px] antialiased dark:bg-[#141414] ${FONT_STACK} ${TEXT_PRIMARY}`}
    >
      <Titlebar activeTab={props.activeTab} />
      <Sheet>{props.children}</Sheet>
    </div>
  );
}

function ToolRow(props: {
  verb: string;
  detail: string;
  add?: number;
  del?: number;
  running?: boolean;
}) {
  return (
    <div className="flex min-h-6 items-center gap-1.5 text-[14px] leading-[21px] tracking-[-0.15px]">
      <span className={`text-[10px] ${TEXT_FAINT}`}>&#x203A;</span>
      <span className={props.running ? TEXT_PRIMARY : TEXT_MUTED}>{props.verb}</span>
      <span className={`truncate ${MONO_STACK} text-[12px] ${TEXT_FAINT}`}>{props.detail}</span>
      {props.add !== undefined ? (
        <span className={`${MONO_STACK} text-[12px] tabular-nums ${DIFF_ADD}`}>+{props.add}</span>
      ) : null}
      {props.del !== undefined ? (
        <span className={`${MONO_STACK} text-[12px] tabular-nums ${DIFF_DEL}`}>
          &minus;{props.del}
        </span>
      ) : null}
    </div>
  );
}

const receiptFiles = [
  { name: "composer.tsx", add: 42, del: 7 },
  { name: "session-prompt.ts", add: 18, del: 2 },
] as const;

function ChangeReceipt() {
  return (
    <div className={`mt-1 rounded-[10px] ${LAYER_01} ${RING_BASE}`}>
      <div className="flex min-h-7 items-center justify-between px-2">
        <span className={`text-[13px] ${TEXT_MUTED}`}>2 Files Changed</span>
        <span className={`text-[12px] ${TEXT_MUTED}`}>Review</span>
      </div>
      {receiptFiles.map((file) => (
        <div key={file.name} className="flex min-h-7 items-center gap-1.5 px-2">
          <span className={TEXT_MUTED}>
            <FileIcon />
          </span>
          <span className={`flex-1 truncate text-[13px] ${TEXT_PRIMARY}`}>{file.name}</span>
          <span className={`${MONO_STACK} text-[11px] tabular-nums ${DIFF_ADD}`}>+{file.add}</span>
          <span className={`${MONO_STACK} text-[11px] tabular-nums ${DIFF_DEL}`}>
            &minus;{file.del}
          </span>
        </div>
      ))}
    </div>
  );
}

function SubmitButton() {
  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#141414] text-[#FCFCFC] dark:bg-[#E4E4E4EB] dark:text-[#181818]">
      <ArrowUpIcon />
    </span>
  );
}

const panelFiles = [
  { kind: "M", dir: "packages/app/src/composer/", name: "composer.tsx", add: 42, del: 7 },
  { kind: "M", dir: "packages/app/src/", name: "session-prompt.ts", add: 18, del: 2 },
  { kind: "A", dir: "packages/app/src/thread/", name: "auth.test.ts", add: 9, del: 0 },
] as const;

const diffLines = [
  { kind: "ctx", text: "  const session = store.read(id)" },
  { kind: "del", text: "- if (!session) return handler(req)" },
  { kind: "add", text: "+ if (!session) return reject(401)" },
  { kind: "add", text: "+ return SessionService.fetch(id)" },
] as const;

function WorkbenchPanel() {
  return (
    <div className="flex w-[40%] shrink-0 flex-col shadow-[inset_1px_0_0_#1414141F] dark:shadow-[inset_1px_0_0_#E4E4E426]">
      <div className="flex h-9 shrink-0 items-center gap-1 px-3">
        <span
          className={`flex h-6 items-center rounded-[6px] bg-[#14141414] px-2 text-[12px] dark:bg-[#E4E4E41E] ${TEXT_PRIMARY}`}
        >
          Changes
        </span>
        <span className={`flex h-6 items-center px-2 text-[12px] ${TEXT_MUTED}`}>Terminal</span>
        <span className={`flex h-6 items-center px-2 text-[12px] ${TEXT_MUTED}`}>Plan</span>
      </div>
      <div className="flex flex-col px-2">
        {panelFiles.map((file) => (
          <div key={file.name} className="flex min-h-7 items-center gap-1.5 rounded-[6px] px-2">
            <span
              className={`${MONO_STACK} text-[11px] ${file.kind === "A" ? DIFF_ADD : TEXT_FAINT}`}
            >
              {file.kind}
            </span>
            <span className={`min-w-0 flex-1 truncate ${MONO_STACK} text-[11px]`}>
              <span className={TEXT_FAINT}>{file.dir}</span>
              <span className={TEXT_PRIMARY}>{file.name}</span>
            </span>
            <span className={`${MONO_STACK} text-[11px] tabular-nums ${DIFF_ADD}`}>
              +{file.add}
            </span>
            <span className={`${MONO_STACK} text-[11px] tabular-nums ${DIFF_DEL}`}>
              &minus;{file.del}
            </span>
          </div>
        ))}
      </div>
      <div className={`mx-3 mt-2 overflow-hidden rounded-[6px] ${RING_MUTED}`}>
        {diffLines.map((line) => (
          <p
            key={line.text}
            className={`px-2 py-[3px] ${MONO_STACK} text-[11px] leading-[16px] whitespace-pre ${
              line.kind === "add"
                ? `bg-[#00AF6624] dark:bg-[#3FA26633] ${DIFF_ADD}`
                : line.kind === "del"
                  ? `bg-[#FF617B38] dark:bg-[#B8004933] ${DIFF_DEL}`
                  : TEXT_MUTED
            }`}
          >
            {line.text}
          </p>
        ))}
      </div>
    </div>
  );
}

export function HonkSessionWorkbench() {
  return (
    <Frame activeTab="Refactor session auth flow">
      <div className="relative flex min-w-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-hidden px-[11px] py-3">
          <div
            className={`max-w-[75%] self-end rounded-[12px] px-2.5 py-2 text-[14px] leading-[21px] tracking-[-0.15px] ${LAYER_01} ${RING_MUTED} ${TEXT_PRIMARY}`}
          >
            Extract the session lookup into SessionService and reject unauthenticated requests.
          </div>
          <p className={`py-1 text-[14px] leading-[21px] tracking-[-0.15px] ${TEXT_PRIMARY}`}>
            I&rsquo;ll pull the session read into SessionService.fetch(), then guard the
            unauthenticated path with a 401.
          </p>
          <ToolRow verb="Read" detail="thread/composer.tsx" />
          <ToolRow verb="Edited" detail="workbench.tsx" add={42} del={7} />
          <ChangeReceipt />
          <ToolRow verb="Running" detail="pnpm test --filter @honk/app" running />
        </div>
        <div className="px-3 pb-3">
          <div
            className={`flex min-h-11 items-center gap-2 rounded-[12px] px-2.5 ${LAYER_01} ${RING_MUTED}`}
          >
            <span className={TEXT_MUTED}>
              <PlusIcon />
            </span>
            <span className={`flex-1 text-[13px] ${TEXT_FAINT}`}>Reply&#x2026;</span>
            <span className={`flex items-center gap-1 text-[12px] ${TEXT_MUTED}`}>
              Model: Medium <ChevronDownIcon />
            </span>
            <SubmitButton />
          </div>
        </div>
      </div>
      <WorkbenchPanel />
    </Frame>
  );
}

const recentThreads = [
  { title: "Refactor session auth flow", meta: "2m ago", tone: "bg-[#007041] dark:bg-[#3FA266]" },
  {
    title: "Fix worktree picker focus trap",
    meta: "1h ago",
    tone: "bg-[#8B5700] dark:bg-[#F1B467]",
  },
  {
    title: "Ship update pill to stable",
    meta: "Yesterday",
    tone: "bg-[#14141433] dark:bg-[#E4E4E44D]",
  },
] as const;

export function HonkHomeComposer() {
  return (
    <Frame activeTab="New Session">
      <div className="flex min-w-0 flex-1 flex-col items-center justify-center pb-10">
        <div className="flex w-[72%] max-w-[720px] flex-col gap-3">
          <div className={`rounded-[10px] ${LAYER_01} ${RING_MUTED}`}>
            <p className={`min-h-24 px-4 pt-3 text-[13px] ${TEXT_FAINT}`}>
              Describe a task&#x2026;
            </p>
            <div className="flex h-11 items-center gap-2 px-4">
              <span className={TEXT_MUTED}>
                <PlusIcon />
              </span>
              <span className="flex h-5 items-center rounded-[6px] bg-[#F6ECD9] px-1.5 text-[11px] text-[#8B5700] dark:bg-[#D2943E33] dark:text-[#F1B467]">
                Plan
              </span>
              <span className={`flex items-center gap-1 text-[12px] ${TEXT_MUTED}`}>
                Model: Medium <ChevronDownIcon />
              </span>
              <span className="flex-1" />
              <SubmitButton />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <span
              className={`flex h-7 items-center gap-1.5 rounded-[6px] px-2 text-[12px] ${TEXT_MUTED}`}
            >
              <FolderIcon /> honk-app <ChevronDownIcon />
            </span>
            <span className={`text-[12px] ${TEXT_FAINT}`}>/</span>
            <span
              className={`flex h-7 items-center gap-1.5 rounded-[6px] px-2 text-[12px] ${TEXT_MUTED}`}
            >
              worktree <ChevronDownIcon />
            </span>
          </div>

          <div className="flex flex-col gap-1 pt-2">
            <p className={`px-2.5 text-[11px] tracking-[0.07px] ${TEXT_FAINT}`}>Side chats</p>
            {recentThreads.map((thread) => (
              <div
                key={thread.title}
                className="flex min-h-7 items-center gap-2 rounded-[6px] px-2.5 py-1"
              >
                <span className={`size-1.5 shrink-0 rounded-full ${thread.tone}`} />
                <span className={`flex-1 truncate text-[13px] ${TEXT_PRIMARY}`}>
                  {thread.title}
                </span>
                <span className={`text-[12px] tabular-nums ${TEXT_FAINT}`}>{thread.meta}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}
