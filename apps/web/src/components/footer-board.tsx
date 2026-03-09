import { FooterBoardClient } from "~/components/footer-board-client";
import { listFooterSignatures } from "~/lib/footer-signatures";
import { hasRedis } from "~/lib/redis";

export async function FooterBoard() {
  const items = await listFooterSignatures();

  return (
    <footer className="relative flex min-h-svh flex-col sm:min-h-0">
      <div className="relative z-10 mx-auto flex w-full max-w-[108rem] flex-1 flex-col">
        <FooterBoardClient items={items} ready={hasRedis()} />
      </div>
    </footer>
  );
}
