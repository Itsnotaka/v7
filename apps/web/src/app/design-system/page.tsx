import { Header } from "~/app/design-system/_components/header";
import { HomeGrid } from "~/app/design-system/_components/home-grid";

export default function Page() {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden">
      <Header />
      <main className="flex min-w-0 grow flex-col overflow-x-hidden pr-12">
        <div className="mx-auto min-w-0 w-full grow overflow-x-hidden border-r border-line">
          <HomeGrid />
        </div>
      </main>
    </div>
  );
}
