export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-content flex-col items-start justify-start overflow-visible p-0">
      {children}
    </main>
  );
}
