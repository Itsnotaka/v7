import { Container, Section } from "@v7/ui";
import { Suspense } from "react";

import type { FooterSignatureRecord } from "~/lib/footer-signature";

import { FooterSignButton } from "~/components/footer-sign-button";
import { FooterSignaturePreview } from "~/components/footer-signature-preview";
import { FOOTER_SIGNATURE_HEIGHT } from "~/lib/footer-signature";
import { getFooterSignatureLimit } from "~/lib/footer-signature-config";
import { listFooterSignatures } from "~/lib/footer-signatures";
import { hasRedis } from "~/lib/redis";

function Mark({ item, height }: { item: FooterSignatureRecord; height: number }) {
  return (
    <span className="block overflow-hidden" style={{ height, aspectRatio: item.aspect }}>
      <FooterSignaturePreview svg={item.svg} scale={item.scale} x={item.x} y={item.y} />
    </span>
  );
}

async function SignaturesBoard() {
  const [items, limit] = await Promise.all([listFooterSignatures(), getFooterSignatureLimit()]);

  return (
    <div className="grid gap-8">
      <FooterSignButton
        full={items.length >= limit}
        ready={hasRedis()}
        count={items.length}
        limit={limit}
      />
      <div className="flex flex-wrap items-end justify-center gap-x-10 gap-y-8">
        {items.map((item) => (
          <span key={item.id} title={item.name}>
            <Mark item={item} height={40} />
          </span>
        ))}
      </div>
    </div>
  );
}

async function HeroSignatureMarks() {
  const items = await listFooterSignatures();

  if (!items.length) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 grid place-items-center overflow-hidden px-6 pt-28 sm:px-12 sm:pt-36"
    >
      <div className="grid max-w-5xl gap-5 text-center opacity-65 sm:gap-8">
        <p className="text-sm text-foreground/55">Signatures left by visitors</p>
        <div className="flex flex-wrap items-end justify-center gap-x-8 gap-y-7 sm:gap-x-12 sm:gap-y-10">
          {items.map((item) => (
            <span key={item.id}>
              <Mark item={item} height={48} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SignaturesFallback() {
  return <div style={{ minHeight: FOOTER_SIGNATURE_HEIGHT + 24 }} />;
}

export function Signatures() {
  return (
    <Section id="signatures" className="py-12 sm:py-16">
      <Container className="mx-auto">
        <Suspense fallback={<SignaturesFallback />}>
          <SignaturesBoard />
        </Suspense>
      </Container>
    </Section>
  );
}

export function HeroSignatures() {
  return (
    <Suspense fallback={null}>
      <HeroSignatureMarks />
    </Suspense>
  );
}
