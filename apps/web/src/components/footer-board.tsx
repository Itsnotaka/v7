import { FooterBoardClient } from "~/components/footer-board-client";
import { PageFrame, PageGrid } from "~/components/page-shell";
import { listFooterSignatures } from "~/lib/footer-signatures";
import { hasRedis } from "~/lib/redis";

export async function FooterBoard() {
  const items = await listFooterSignatures();

  return (
    <footer className="border-t border-border/50">
      <PageFrame>
        <PageGrid>
          <FooterBoardClient items={items} ready={hasRedis()} />
        </PageGrid>
      </PageFrame>
    </footer>
  );
}
