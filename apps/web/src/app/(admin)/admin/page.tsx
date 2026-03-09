"use client";

import * as React from "react";

import { AdminSignatureDashboard } from "~/components/admin-signature-dashboard";

export default function AdminPage() {
  const [password, setPassword] = React.useState("");
  const [authenticated, setAuthenticated] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (res.ok) {
      setAuthenticated(true);
    } else {
      setError("Invalid password");
    }
  };

  if (authenticated) {
    return <AdminSignatureDashboard password={password} />;
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-semibold mb-6">Admin Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-background"
            disabled={loading}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full px-4 py-2 bg-foreground text-background rounded-md disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Login"}
        </button>
      </form>
    </div>
  );
}
