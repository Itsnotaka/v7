import type { JSX } from "react";

import { IconEmojiLolDefault } from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import Image from "next/image";
import { headers } from "next/headers";
import { Suspense } from "react";

import { Section } from "~/components/page-shell";
import { hasRedis, redis } from "~/lib/redis";
import { getSpotifyState, type SpotifyState } from "~/lib/spotify-status";

const idle = "Not listening to music right now (Which means I am most likely sleeping)";
const visitKey = "visit:status";
const names = typeof Intl.DisplayNames === "function"
  ? new Intl.DisplayNames(["en"], { type: "region" })
  : null;

type VisitState = {
  city: string;
  country: string;
};

function tidy(value: string) {
  return Array.from(value)
    .filter((char) => {
      const code = char.charCodeAt(0);
      return code >= 32 && code !== 127;
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

function decode(value: string | null) {
  if (!value) return null;

  const text = tidy(value);

  if (!text) return null;

  const next = text.replace(/\+/g, " ");

  if (!/%[0-9A-Fa-f]{2}/.test(next)) return next;

  try {
    return tidy(decodeURIComponent(next));
  } catch {
    return text;
  }
}

function country(value: string | null) {
  const text = decode(value);

  if (!text) return null;
  if (!/^[A-Za-z]{2}$/.test(text)) return text;

  const code = text.toUpperCase();
  const label = names?.of(code);

  if (label && label !== code) return tidy(label);

  return code;
}

function region(value: string | null, countryValue: string | null) {
  const text = decode(value);

  if (!text) return null;

  const countryCode = decode(countryValue)?.toUpperCase();
  const code = /^[A-Za-z0-9]{1,3}$/.test(text) ? text.toUpperCase() : text;
  const label = countryCode ? names?.of(`${countryCode}-${code}`) : null;

  if (label && label !== `${countryCode}-${code}`) return tidy(label);

  return code;
}

function createVisit(cityValue: string | null, regionValue: string | null, countryValue: string | null) {
  const city = decode(cityValue) || region(regionValue, countryValue);
  const countryName = country(countryValue);

  if (!city || !countryName) return null;

  return {
    city,
    country: countryName,
  } satisfies VisitState;
}

function parseVisit(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const row = value as Record<string, unknown>;
  const city = typeof row.city === "string" ? tidy(row.city) : "";
  const countryName = typeof row.country === "string" ? tidy(row.country) : "";

  if (!city || !countryName) return null;

  return {
    city,
    country: countryName,
  } satisfies VisitState;
}

function sameVisit(a: VisitState | null, b: VisitState) {
  return a?.city === b.city && a.country === b.country;
}

function label(visit: VisitState | null) {
  if (!visit) return null;
  return `Last visited from ${visit.city}, ${visit.country}`;
}

async function getVisitState() {
  const head = await headers();
  const cached = !hasRedis() ? null : parseVisit(await redis.get(visitKey));
  const current = createVisit(
    head.get("x-vercel-ip-city"),
    head.get("x-vercel-ip-country-region"),
    head.get("x-vercel-ip-country"),
  );

  if (!current) return cached;
  if (!hasRedis()) return current;
  if (sameVisit(cached, current)) return current;

  await redis.set(visitKey, current);

  return current;
}

function StatusLine({
  text,
  track,
  visit,
}: {
  text: string | null;
  track: SpotifyState["track"];
  visit: string | null;
}) {
  if (!track) {
    if (!text && !visit) return null;

    return (
      <div className="mt-8 flex min-h-10 max-w-full flex-wrap items-center gap-x-3 gap-y-1">{text && <span className="text-xs text-muted-foreground">{text}</span>}{text && visit && <span aria-hidden className="text-xs text-muted-foreground">·</span>}{visit && <span className="text-xs text-muted-foreground">{visit}</span>}</div>
    );
  }

  return (
    <div className="mt-8 flex min-h-10 max-w-full flex-wrap items-center gap-x-3 gap-y-2"><a href={track.url} target="_blank" rel="noopener noreferrer" className="group flex min-w-0 max-w-full items-center gap-3">{track.image && (
      <Image
        src={track.image}
        alt={`${track.name} album cover`}
        width={40}
        height={40}
        className="rounded-xs shadow-sm"
        unoptimized
      />
    )}
    {text && (
      <span className="text-xs text-muted-foreground transition-colors group-hover:text-foreground">
        {text}
      </span>
    )}</a>{text && visit && <span aria-hidden className="text-xs text-muted-foreground">·</span>}{visit && <span className="text-xs text-muted-foreground">{visit}</span>}</div>
  );
}

function SpotifyGap() {
  return <div aria-hidden className="mt-8 h-10" />;
}

async function SpotifyStatus() {
  const [song, visit] = await Promise.all([getSpotifyState(), getVisitState()]);
  const text = !song.connected
    ? null
    : song.source === "none" || !song.track
      ? idle
      : song.source === "live" && song.playing
        ? `currently listening to ${song.track.name}`
        : `Just listened to ${song.track.name}`;
  const track = song.connected && song.source !== "none" ? song.track : null;

  if (!text && !visit) return null;

  return <StatusLine text={text} track={track} visit={label(visit)} />;
}

export function Hero(): JSX.Element {
  return (
    <Section className="relative mt-8">
      <div className="col-span-8 tablet:col-span-5">
        <p className="first-letter:pr-1 first-letter:[-webkit-initial-letter:2] first-letter:[initial-letter:2] text-2xl/[1.5] tracking-wide text-balance">
          Daniel is a graduate student in Human-Computer Interaction at NYU. Previously a design
          engineer, now exploring how humans and AI can work together.{" "}
          <IconEmojiLolDefault className="inline-block align-middle text-[0.85em]" />
        </p>
        <Suspense fallback={<SpotifyGap />}>
          <SpotifyStatus />
        </Suspense>
      </div>
    </Section>
  );
}
