"use client";

import { useQuery } from "@tanstack/react-query";

import { FooterSignButton } from "~/components/footer-sign-button";
import { FooterSignaturePreview } from "~/components/footer-signature-preview";
import { FOOTER_SIGNATURE_HEIGHT, type FooterSignatureResponse } from "~/lib/footer-signature";

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
                <FooterSignaturePreview svg={item.svg} scale={item.scale} x={item.x} y={item.y} />
              </div>
              <span className="text-xs text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}
