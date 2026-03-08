export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-full grid grid-cols-subgrid tablet:pl-[140px]">{children}</div>
  );
}
