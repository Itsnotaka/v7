import { cookies } from "next/headers";
import { Suspense } from "react";

import { Header } from "~/components/header";
import { PageFrame, PageGrid } from "~/components/page-shell";
import { resolveSiteVariant, type SiteVariant } from "~/lib/site-variant";
import { VariantProvider, VariantShell } from "~/lib/variant-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<Content initial="human">{children}</Content>}>
      <Variant>{children}</Variant>
    </Suspense>
  );
}

async function Variant({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  const initial = resolveSiteVariant((name) => store.get(name)?.value ?? null) ?? "human";

  return <Content initial={initial}>{children}</Content>;
}

function Content({ children, initial }: { children: React.ReactNode; initial: SiteVariant }) {
  return (
    <VariantProvider initial={initial}>
      <VariantShell>
        <PageFrame>
          <PageGrid>
            <Header />
            {children}
          </PageGrid>
        </PageFrame>
      </VariantShell>
    </VariantProvider>
  );
}
