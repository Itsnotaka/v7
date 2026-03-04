import { TextParamsProvider } from "~/components/text-params-provider";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative z-10 mx-auto flex flex-col min-h-svh h-full w-full">
      <header className="h-10 w-full mx-auto px-6 pt-1 flex items-center justify-end space-x-4 text-sm">
        <Link href="#work" className="">
          Work
        </Link>
        <Link href="/about" className="">
          About
        </Link>
      </header>
      <div className="w-full">
        <TextParamsProvider>{children}</TextParamsProvider>
      </div>
    </main>
  );
}
