export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative z-10 mx-auto grid min-h-svh w-full max-w-screen-2xl grid-cols-6 pt-24">
      {children}
    </main>
  );
}
