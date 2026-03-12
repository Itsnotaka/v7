import { Suspense } from "react";

import { FooterSignatureList } from "~/components/footer-signature-list";
import { PageFrame, PageGrid } from "~/components/page-shell";
import { FOOTER_SIGNATURE_HEIGHT } from "~/lib/footer-signature";
import { getFooterSignatureLimit } from "~/lib/footer-signature-config";
import { listFooterSignatures } from "~/lib/footer-signatures";
import { hasRedis } from "~/lib/redis";

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
  const [items, limit] = await Promise.all([listFooterSignatures(), getFooterSignatureLimit()]);

  return <FooterSignatureList initial={{ items, limit }} ready={hasRedis()} />;
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
