import { Suspense } from "react";

import { FooterSignButton } from "~/components/footer-sign-button";
import { PageFrame, PageGrid } from "~/components/page-shell";
import {
  FOOTER_SIGNATURE_DATA_PREFIX,
  FOOTER_SIGNATURE_HEIGHT,
  FOOTER_SIGNATURE_LIMIT,
} from "~/lib/footer-signature";
import { listFooterSignatures } from "~/lib/footer-signatures";
import { hasRedis } from "~/lib/redis";

function parse(src: string) {
  if (!src.startsWith(FOOTER_SIGNATURE_DATA_PREFIX)) return null;

  const body = src.slice(FOOTER_SIGNATURE_DATA_PREFIX.length).trim();

  if (!body || body.length % 4 === 1 || !/^[A-Za-z0-9+/]*={0,2}$/.test(body)) return null;

  return Buffer.from(body, "base64").toString("utf8");
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

function FooterSignatureGap() {
  return (
    <>
      <div aria-hidden className="col-span-full flex items-center justify-between">
        <div className="h-4 w-24 rounded-full bg-muted/40" />
      </div>

      <div
        aria-hidden
        className="col-span-full rounded-sm bg-muted/20"
        style={{ minHeight: FOOTER_SIGNATURE_HEIGHT + 24 }}
      />
    </>
  );
}

async function FooterSignatures() {
  const items = await listFooterSignatures();
  const full = items.length >= FOOTER_SIGNATURE_LIMIT;

  return (
    <>
      <FooterSignButton full={full} ready={hasRedis()} />

      {items.length > 0 ? (
        <div className="col-span-full flex flex-wrap items-end gap-x-8 gap-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col items-center gap-1">
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

export function FooterBoard() {
  return (
    <footer className="border-t border-border/50">
      <PageFrame>
        <PageGrid>
          <div className="col-span-full grid grid-cols-subgrid gap-y-6 py-8">
            <blockquote className="col-span-full text-2xl/[1.4] italic tracking-wide text-foreground desktop:col-span-5">
              Think about why obvious questions are obvious, that makes you understand how to solve
              complex problems.
            </blockquote>

            <Suspense fallback={<FooterSignatureGap />}>
              <FooterSignatures />
            </Suspense>
          </div>
        </PageGrid>
      </PageFrame>
    </footer>
  );
}
