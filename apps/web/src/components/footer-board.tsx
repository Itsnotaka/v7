import { FooterBoardClient } from "~/components/footer-board-client";
import { listFooterSignatures } from "~/lib/footer-signatures";
import { hasRedis } from "~/lib/redis";

export async function FooterBoard() {
  const items = await listFooterSignatures();

  return (
    <footer className="">
      <FooterBoardClient items={items} ready={hasRedis()} />
    </footer>
  );
}
