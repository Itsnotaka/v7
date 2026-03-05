import { Header } from "~/components/header";
import { PageFrame, PageGrid, PageMain } from "~/components/page-shell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PageMain>
      <PageFrame>
        <PageGrid>
          <Header />
          {children}
        </PageGrid>
      </PageFrame>
    </PageMain>
  );
}
