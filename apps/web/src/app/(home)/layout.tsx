import { cookies } from "next/headers";

import { Header } from "~/components/header";
import { PageFrame, PageGrid } from "~/components/page-shell";
import { resolveSiteVariant } from "~/lib/site-variant";
import { VariantProvider, VariantShell } from "~/lib/variant-context";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  const initial = resolveSiteVariant((name) => store.get(name)?.value ?? null) ?? "human";

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
