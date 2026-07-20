const FONT_STACK =
  "[font-family:-apple-system,BlinkMacSystemFont,'SF_Pro_Text','Helvetica_Neue',system-ui,sans-serif]";

const LABEL_PRIMARY = "text-black dark:text-white";
const LABEL_SECONDARY = "text-[rgba(60,60,67,0.60)] dark:text-[rgba(235,235,245,0.60)]";
const LABEL_TERTIARY = "text-[rgba(60,60,67,0.30)] dark:text-[rgba(235,235,245,0.30)]";
const SYSTEM_BLUE = "text-[#007AFF] dark:text-[#0A84FF]";
const HAIRLINE = "border-[rgba(60,60,67,0.29)] dark:border-[rgba(84,84,88,0.60)]";
const FROSTED =
  "bg-[rgba(249,249,249,0.82)] backdrop-blur-xl backdrop-saturate-150 dark:bg-[rgba(29,29,31,0.78)]";
const CELL = "bg-white dark:bg-[#1C1C1E]";

function SignalIcon() {
  return (
    <span className="flex items-end gap-[2px]">
      <span className="h-[4px] w-[3px] rounded-[1px] bg-current" />
      <span className="h-[6px] w-[3px] rounded-[1px] bg-current" />
      <span className="h-[8px] w-[3px] rounded-[1px] bg-current" />
      <span className="h-[11px] w-[3px] rounded-[1px] bg-current" />
    </span>
  );
}

function WifiIcon() {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="none" aria-hidden="true">
      <path
        d="M1.8 4.4a10 10 0 0 1 13.4 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4.5 7.2a6.2 6.2 0 0 1 8 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="8.5" cy="10.2" r="1.7" fill="currentColor" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <span className="flex items-center">
      <span className="flex h-[13px] w-[25px] items-center rounded-[4px] border border-current p-[2px] opacity-100 [border-color:color-mix(in_srgb,currentColor_35%,transparent)]">
        <span className="h-full w-[75%] rounded-[2px] bg-current" />
      </span>
      <span className="ml-px h-[4px] w-[1.5px] rounded-r-full bg-current opacity-40" />
    </span>
  );
}

function StatusBar() {
  return (
    <div
      className={`flex h-[44px] shrink-0 items-center justify-between pr-[27px] pl-[42px] ${LABEL_PRIMARY}`}
    >
      <span className="text-[17px] font-semibold tracking-[-0.4px]">9:41</span>
      <span className="flex items-center gap-[7px]">
        <SignalIcon />
        <WifiIcon />
        <BatteryIcon />
      </span>
    </div>
  );
}

function HomeIndicator() {
  return (
    <div className="flex h-[34px] shrink-0 items-end justify-center pb-2">
      <span className="h-[5px] w-[134px] rounded-full bg-black dark:bg-white" />
    </div>
  );
}

function PhoneScreen(props: { variant: "chat" | "grouped"; children: React.ReactNode }) {
  const bg = props.variant === "chat" ? "bg-white dark:bg-black" : "bg-[#F2F2F7] dark:bg-black";

  return (
    <div
      className={`relative flex h-[700px] w-full max-w-[393px] flex-col overflow-hidden rounded-[2px] antialiased ${FONT_STACK} ${bg}`}
    >
      {props.children}
    </div>
  );
}

function BackChevron() {
  return (
    <svg width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden="true">
      <path
        d="M11 1 2 10l9 9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg width="26" height="17" viewBox="0 0 26 17" fill="currentColor" aria-hidden="true">
      <rect x="0.5" y="1.5" width="16.5" height="14" rx="4" />
      <path d="M19 7.2 23.2 4.4a1.2 1.2 0 0 1 1.86 1v6.2a1.2 1.2 0 0 1-1.86 1L19 9.8Z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <path
        d="M8.5 1.5v14M1.5 8.5h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="14" height="20" viewBox="0 0 14 20" fill="none" aria-hidden="true">
      <rect x="4.25" y="0.75" width="5.5" height="10.5" rx="2.75" fill="currentColor" />
      <path
        d="M1.2 8.6a5.8 5.8 0 0 0 11.6 0M7 14.6v4.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="14" height="13" viewBox="0 0 24 22" fill="currentColor" aria-hidden="true">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className="text-[#FF9500]"
    >
      <circle cx="7" cy="7" r="3" fill="currentColor" />
      <path
        d="M7 .8v1.6M7 11.6v1.6M.8 7h1.6M11.6 7h1.6M2.6 2.6l1.15 1.15M10.25 10.25l1.15 1.15M11.4 2.6l-1.15 1.15M3.75 10.25 2.6 11.4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect
        x="1.5"
        y="4"
        width="17"
        height="12.5"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="m2.5 5.5 7.5 5.5 7.5-5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 2.2a5.3 5.3 0 0 0-5.3 5.3c0 4-1.7 5.7-1.7 5.7h14s-1.7-1.7-1.7-5.7A5.3 5.3 0 0 0 10 2.2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.4 16.4a1.8 1.8 0 0 0 3.2 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChatGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
      <path d="M9 1.5c-4.4 0-8 2.9-8 6.5 0 2 1.1 3.8 2.9 5-.2.9-.7 1.7-1.5 2.4-.2.2 0 .6.3.6 1.5-.1 2.8-.6 3.8-1.3.8.2 1.6.3 2.5.3 4.4 0 8-2.9 8-6.5s-3.6-7-8-7Z" />
    </svg>
  );
}

function CellChevron() {
  return (
    <svg
      width="8"
      height="14"
      viewBox="0 0 8 14"
      fill="none"
      aria-hidden="true"
      className="text-[#C7C7CC] dark:text-[#48484A]"
    >
      <path
        d="m1 1 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const BUBBLE_BASE =
  "relative w-fit max-w-[75%] rounded-[18px] px-[13px] pt-[7px] pb-[8px] text-[17px] leading-[22px] tracking-[-0.4px]";

const SENT_BUBBLE = `${BUBBLE_BASE} self-end bg-[#007AFF] text-white`;
const SENT_TAIL =
  "before:absolute before:bottom-0 before:-right-[7px] before:h-[18px] before:w-[19px] before:rounded-bl-[15px] before:bg-[#007AFF] before:content-[''] after:absolute after:bottom-0 after:-right-[10px] after:h-[19px] after:w-[11px] after:rounded-bl-[10px] after:bg-white after:content-[''] dark:after:bg-black";

const RECV_BUBBLE = `${BUBBLE_BASE} self-start bg-[#E9E9EB] text-black dark:bg-[#262629] dark:text-white`;
const RECV_TAIL =
  "before:absolute before:bottom-0 before:-left-[7px] before:h-[18px] before:w-[19px] before:rounded-br-[15px] before:bg-[#E9E9EB] before:content-[''] dark:before:bg-[#262629] after:absolute after:bottom-0 after:-left-[10px] after:h-[19px] after:w-[11px] after:rounded-br-[10px] after:bg-white after:content-[''] dark:after:bg-black";

function Tapback() {
  return (
    <span className="absolute -top-[14px] -right-2 flex h-[26px] w-[38px] items-center justify-center rounded-[13px] border-[1.5px] border-white bg-[#007AFF] text-white dark:border-black dark:bg-[#0A84FF]">
      <HeartIcon />
      <span className="absolute -bottom-[3px] left-[2px] size-[7px] rounded-full border-[1.5px] border-white bg-[#007AFF] dark:border-black dark:bg-[#0A84FF]" />
    </span>
  );
}

function TypingIndicator() {
  return (
    <div className="relative mb-1 ml-1 self-start">
      <div className="flex h-[42px] w-[62px] items-center justify-center gap-[5px] rounded-[21px] bg-[#E9E9EB] dark:bg-[#262629]">
        <span className="size-[9px] rounded-full bg-[#9E9EA3] dark:bg-[#98989F]" />
        <span className="size-[9px] rounded-full bg-[#9E9EA3] opacity-60 dark:bg-[#98989F]" />
        <span className="size-[9px] rounded-full bg-[#9E9EA3] opacity-35 dark:bg-[#98989F]" />
      </div>
      <span className="absolute -bottom-px -left-[2px] size-3 rounded-full bg-[#E9E9EB] dark:bg-[#262629]" />
      <span className="absolute -bottom-[7px] -left-2 size-[6px] rounded-full bg-[#E9E9EB] dark:bg-[#262629]" />
    </div>
  );
}

export function OpenpokeChat() {
  return (
    <PhoneScreen variant="chat">
      <div className={`absolute inset-x-0 top-0 z-10 border-b-[0.5px] ${HAIRLINE} ${FROSTED}`}>
        <StatusBar />
        <div className="relative flex h-[96px] flex-col items-center pt-[6px]">
          <span className={`absolute top-[15px] left-4 ${SYSTEM_BLUE}`}>
            <BackChevron />
          </span>
          <div className="flex size-[50px] items-center justify-center rounded-full bg-gradient-to-b from-[#A9B2BD] to-[#8E98A4]">
            <span className="text-[22px] font-medium text-white">P</span>
          </div>
          <div className="flex items-center gap-[2px] pt-[3px]">
            <span className={`text-[11px] ${LABEL_PRIMARY}`}>Poke</span>
            <svg
              width="7"
              height="12"
              viewBox="0 0 8 14"
              fill="none"
              aria-hidden="true"
              className="text-[#B0B0B8] dark:text-[#5A5A5E]"
            >
              <path
                d="m1 1 6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className={`absolute top-[22px] right-4 ${SYSTEM_BLUE}`}>
            <VideoIcon />
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-end px-4 pt-[140px] pb-2">
        <p className={`pb-2 text-center text-[11px] ${LABEL_SECONDARY}`}>
          <span className="font-semibold">Today</span> 9:41 AM
        </p>

        <div className="flex flex-col gap-[2px]">
          <p className={SENT_BUBBLE}>what&rsquo;s in my inbox this morning</p>
          <p className={`${SENT_BUBBLE} ${SENT_TAIL}`}>anything urgent?</p>
        </div>

        <div className="mt-2 flex flex-col gap-[2px]">
          <p className={RECV_BUBBLE}>
            3 things worth your time &mdash; the Stripe invoice dispute, Sarah&rsquo;s contract
            redlines, and your 2pm got moved to 3.
          </p>
          <div className={`${RECV_BUBBLE} ${RECV_TAIL} mt-[14px]`}>
            <Tapback />
            archived 14 newsletters, drafted a reply to Sarah. want to see it?
          </div>
        </div>

        <div className="mt-2 flex flex-col">
          <p className={`${SENT_BUBBLE} ${SENT_TAIL}`}>yes and remind me to follow up thursday</p>
          <span className={`self-end pt-[3px] pr-1 text-[11px] font-medium ${LABEL_SECONDARY}`}>
            Delivered
          </span>
        </div>

        <div className="mt-2 flex flex-col">
          <TypingIndicator />
        </div>
      </div>

      <div
        className={`flex items-center gap-[10px] border-t-[0.5px] px-3 pt-[6px] pb-2 ${HAIRLINE} ${FROSTED}`}
      >
        <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-[#E9E9EB] text-[#808080] dark:bg-[#262629] dark:text-[#98989F]">
          <PlusIcon />
        </span>
        <div className="relative flex h-9 flex-1 items-center rounded-[18px] border border-[rgba(60,60,67,0.20)] pl-[14px] dark:border-[rgba(84,84,88,0.65)]">
          <span className={`text-[17px] tracking-[-0.4px] ${LABEL_TERTIARY}`}>Message Poke</span>
          <span className="absolute right-3 text-[#808080] dark:text-[#98989F]">
            <MicIcon />
          </span>
        </div>
      </div>
      <HomeIndicator />
    </PhoneScreen>
  );
}

const activity = [
  { label: "Archived 14 newsletters", time: "9:32 AM" },
  { label: "Drafted reply to Sarah", time: "9:30 AM" },
  { label: "Rescheduled standup to 3 PM", time: "8:15 AM" },
] as const;

export function OpenpokeHome() {
  return (
    <PhoneScreen variant="grouped">
      <StatusBar />
      <div className="flex flex-1 flex-col px-4">
        <h1 className={`pt-3 text-[34px] font-bold tracking-[0.37px] ${LABEL_PRIMARY}`}>
          Good morning
        </h1>
        <p className={`flex items-center gap-[6px] pt-1 text-[15px] ${LABEL_SECONDARY}`}>
          Friday, July 17
          <span className="flex items-center gap-1">
            <SunIcon /> 72&deg;
          </span>
        </p>

        <div className="grid grid-cols-2 gap-[10px] pt-5">
          <div className={`h-[92px] rounded-xl p-[14px] ${CELL}`}>
            <p
              className={`flex items-center gap-[6px] text-[13px] font-semibold ${LABEL_SECONDARY}`}
            >
              <span className={SYSTEM_BLUE}>
                <EnvelopeIcon />
              </span>
              Unread
            </p>
            <p className={`pt-[2px] text-[28px] font-bold ${LABEL_PRIMARY}`}>12</p>
            <p className={`text-[13px] ${LABEL_SECONDARY}`}>2 need replies</p>
          </div>
          <div className={`h-[92px] rounded-xl p-[14px] ${CELL}`}>
            <p
              className={`flex items-center gap-[6px] text-[13px] font-semibold ${LABEL_SECONDARY}`}
            >
              <span className="text-[#FF9500]">
                <BellIcon />
              </span>
              Reminders
            </p>
            <p className={`pt-[2px] text-[28px] font-bold ${LABEL_PRIMARY}`}>3</p>
            <p className={`text-[13px] ${LABEL_SECONDARY}`}>next: 3:00 PM</p>
          </div>
        </div>

        <p
          className={`px-1 pt-6 pb-[7px] text-[13px] tracking-[0.06em] uppercase ${LABEL_SECONDARY}`}
        >
          Today
        </p>
        <div className={`rounded-xl ${CELL}`}>
          {activity.map((row, i) => (
            <div key={row.label} className="relative flex h-11 items-center justify-between px-4">
              {i > 0 ? (
                <span className={`absolute top-0 right-0 left-4 border-t-[0.5px] ${HAIRLINE}`} />
              ) : null}
              <span className={`text-[15px] ${LABEL_PRIMARY}`}>{row.label}</span>
              <span className={`text-[13px] ${LABEL_SECONDARY}`}>{row.time}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto pb-4">
          <div className="flex h-[50px] items-center justify-center gap-2 rounded-[14px] bg-[#007AFF] text-white dark:bg-[#0A84FF]">
            <ChatGlyph />
            <span className="text-[17px] font-semibold">Text Poke</span>
          </div>
        </div>
      </div>
      <HomeIndicator />
    </PhoneScreen>
  );
}

const accounts = [
  { service: "Gmail", detail: "daniel@gmail.com", monogram: "M", primary: true },
  { service: "Gmail", detail: "work@company.io", monogram: "M", primary: false },
  { service: "Google Calendar", detail: "daniel@gmail.com", monogram: "17", primary: false },
] as const;

export function OpenpokeConnections() {
  return (
    <PhoneScreen variant="grouped">
      <StatusBar />
      <div className="flex flex-1 flex-col px-4">
        <h1 className={`pt-3 text-[34px] font-bold tracking-[0.37px] ${LABEL_PRIMARY}`}>
          Connections
        </h1>

        <p
          className={`px-4 pt-6 pb-[7px] text-[13px] tracking-[0.06em] uppercase ${LABEL_SECONDARY}`}
        >
          Accounts
        </p>
        <div className={`overflow-hidden rounded-[10px] ${CELL}`}>
          {accounts.map((account, i) => (
            <div
              key={account.detail + account.service}
              className="relative flex h-[60px] items-center gap-4 px-4"
            >
              {i > 0 ? (
                <span
                  className={`absolute top-0 right-0 left-[68px] border-t-[0.5px] ${HAIRLINE}`}
                />
              ) : null}
              {account.monogram === "M" ? (
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full border-[0.5px] bg-white text-[15px] font-semibold text-[#EA4335] dark:border-transparent dark:bg-[#2C2C2E] ${HAIRLINE}`}
                >
                  M
                </span>
              ) : (
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#4285F4] text-[13px] font-semibold text-white">
                  17
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className={`block truncate text-[17px] ${LABEL_PRIMARY}`}>
                  {account.service}
                </span>
                <span className={`block truncate text-[13px] ${LABEL_SECONDARY}`}>
                  {account.detail}
                </span>
              </span>
              {account.primary ? <span className="text-[17px] text-[#8E8E93]">Primary</span> : null}
              <CellChevron />
            </div>
          ))}
        </div>
        <p className={`px-4 pt-[7px] text-[13px] leading-[18px] ${LABEL_SECONDARY}`}>
          Poke can read, draft, and archive on connected accounts. It always asks before sending.
        </p>

        <div className={`mt-6 flex h-11 items-center rounded-[10px] px-4 ${CELL}`}>
          <span className={`text-[17px] ${SYSTEM_BLUE}`}>Add Account</span>
        </div>
      </div>
      <div className="pt-4">
        <HomeIndicator />
      </div>
    </PhoneScreen>
  );
}
