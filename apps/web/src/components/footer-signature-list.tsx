"use client";

import { useQuery } from "@tanstack/react-query";

import { FooterSignButton } from "~/components/footer-sign-button";
import {
  FOOTER_SIGNATURE_DATA_PREFIX,
  FOOTER_SIGNATURE_HEIGHT,
  type FooterSignatureResponse,
} from "~/lib/footer-signature";

function parse(src: string) {
  if (!src.startsWith(FOOTER_SIGNATURE_DATA_PREFIX)) return null;

  const body = src.slice(FOOTER_SIGNATURE_DATA_PREFIX.length).trim();

  if (!body || body.length % 4 === 1 || !/^[A-Za-z0-9+/]*={0,2}$/.test(body)) return null;

  try {
    return atob(body);
  } catch {
    return null;
  }
}

function Signature(props: { svg: string }) {
  const svg = parse(props.svg);

  if (!svg) return null;

  return (
    <span
      aria-hidden
      className="block h-full w-full text-foreground [&_circle]:fill-current [&_circle]:stroke-current [&_path]:stroke-current [&_svg]:block [&_svg]:h-full [&_svg]:w-full [&_svg]:overflow-visible"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

async function fetchSignatures(): Promise<FooterSignatureResponse> {
  const res = await fetch("/api/footer-signatures");

  if (!res.ok) {
    throw new Error("Failed to fetch signatures");
  }

  return res.json();
}

export function FooterSignatureList(props: { initial: FooterSignatureResponse; ready: boolean }) {
  const query = useQuery({
    initialData: props.initial,
    queryFn: fetchSignatures,
    queryKey: ["footer-signatures"],
    staleTime: 60_000,
  });
  const data = query.data ?? props.initial;
  const full = data.items.length >= data.limit;

  return (
    <>
      <FooterSignButton
        full={full}
        ready={props.ready}
        count={data.items.length}
        limit={data.limit}
      />

      {data.items.length > 0 ? (
        <div className="col-span-full flex flex-wrap items-end gap-x-8 gap-y-4">
          {data.items.map((item) => (
            <div key={item.id} className="group flex flex-col items-center gap-1">
              <div
                className="overflow-hidden"
                style={{ height: FOOTER_SIGNATURE_HEIGHT, aspectRatio: item.aspect }}
              >
                <Signature svg={item.svg} />
              </div>
              <span className="text-xs text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}
