import type * as React from "react";

export const metadata = {
  title: "Admin",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
