"use client";

import { IconSubscriptionTick1 } from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import {
  FOOTER_SIGNATURE_DATA_PREFIX,
  FOOTER_SIGNATURE_HEIGHT,
  type FooterSignatureRecord,
  type FooterSignatureResponse,
} from "~/lib/footer-signature";

function parseSvg(src: string) {
  if (!src.startsWith(FOOTER_SIGNATURE_DATA_PREFIX)) return null;
  const body = src.slice(FOOTER_SIGNATURE_DATA_PREFIX.length).trim();
  if (!body || body.length % 4 === 1 || !/^[A-Za-z0-9+/]*={0,2}$/.test(body)) return null;
  try {
    return atob(body);
  } catch {
    return null;
  }
}

function SignaturePreview(props: { svg: string }) {
  const svg = parseSvg(props.svg);
  if (!svg) return null;
  return (
    <span
      aria-hidden
      className="block h-full w-full text-foreground [&_circle]:fill-current [&_circle]:stroke-current [&_path]:stroke-current [&_svg]:block [&_svg]:h-full [&_svg]:w-full [&_svg]:overflow-visible"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

async function fetchSignatures(): Promise<FooterSignatureResponse> {
  const res = await fetch("/api/footer-signatures");
  if (!res.ok) throw new Error("Failed to fetch signatures");
  return res.json();
}

async function deleteSignature(id: string, password: string) {
  const res = await fetch(`/api/footer-signatures/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${password}` },
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to delete signature");
  }
}

async function updateVerified(
  id: string,
  verified: boolean,
  password: string,
): Promise<FooterSignatureRecord> {
  const res = await fetch(`/api/footer-signatures/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${password}`,
    },
    body: JSON.stringify({ verified }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to update signature");
  }
  return res.json();
}

async function saveLimit(limit: number, password: string) {
  const res = await fetch("/api/footer-signatures/limit", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${password}`,
    },
    body: JSON.stringify({ limit }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to update limit");
  }
  return res.json() as Promise<{ limit: number }>;
}

async function saveOrder(ids: string[], password: string) {
  const res = await fetch("/api/footer-signatures/order", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${password}`,
    },
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to update order");
  }
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function LimitControl(props: { limit: number; password: string }) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState(String(props.limit));

  const mutation = useMutation({
    mutationFn: (value: number) => saveLimit(value, props.password),
    onSuccess: (result) => {
      queryClient.setQueryData<FooterSignatureResponse>(["footer-signatures"], (old) =>
        old ? { ...old, limit: result.limit } : undefined,
      );
      void queryClient.invalidateQueries({ queryKey: ["footer-signatures"] });
    },
  });

  const parsed = Number(draft);
  const valid = Number.isInteger(parsed) && parsed > 0;
  const changed = valid && parsed !== props.limit;

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="sig-limit" className="text-sm font-medium">
        Limit
      </label>
      <input
        id="sig-limit"
        type="number"
        min={1}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        className="w-20 rounded-md border bg-background px-2 py-1 text-sm"
      />
      <button
        disabled={!changed || mutation.isPending}
        onClick={() => {
          if (changed) mutation.mutate(parsed);
        }}
        className="rounded-md bg-foreground px-3 py-1 text-sm text-background disabled:opacity-50"
      >
        {mutation.isPending ? "Saving..." : "Save"}
      </button>
      {mutation.isError ? (
        <span className="text-sm text-red-500">{mutation.error.message}</span>
      ) : null}
    </div>
  );
}

function move<T>(arr: T[], from: number, to: number): T[] {
  const next = [...arr];
  const [item] = next.splice(from, 1);
  if (item !== undefined) next.splice(to, 0, item);
  return next;
}

function ReorderPanel(props: { items: FooterSignatureRecord[]; password: string }) {
  const queryClient = useQueryClient();
  const [order, setOrder] = useState<FooterSignatureRecord[] | null>(null);
  const active = order !== null;
  const display = order ?? props.items;

  const mutation = useMutation({
    mutationFn: (ids: string[]) => saveOrder(ids, props.password),
    onSuccess: () => {
      setOrder(null);
      void queryClient.invalidateQueries({ queryKey: ["footer-signatures"] });
    },
  });

  const dirty = active && display.some((item, i) => item.id !== props.items[i]?.id);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Order</h2>
        <div className="flex gap-2">
          {active ? (
            <>
              <button
                onClick={() => setOrder(null)}
                className="rounded-md bg-muted px-3 py-1 text-sm"
              >
                Cancel
              </button>
              <button
                disabled={!dirty || mutation.isPending}
                onClick={() => {
                  if (dirty) mutation.mutate(display.map((s) => s.id));
                }}
                className="rounded-md bg-foreground px-3 py-1 text-sm text-background disabled:opacity-50"
              >
                {mutation.isPending ? "Saving..." : "Save order"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setOrder([...props.items])}
              className="rounded-md bg-muted px-3 py-1 text-sm"
            >
              Reorder
            </button>
          )}
        </div>
      </div>

      {mutation.isError ? <p className="text-sm text-red-500">{mutation.error.message}</p> : null}

      {active ? (
        <ol className="space-y-1">
          {display.map((item, i) => (
            <li
              key={item.id}
              className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm"
            >
              <span className="w-6 text-right text-muted-foreground">{i + 1}</span>
              <span className="flex-1 truncate">{item.name}</span>
              <button
                disabled={i === 0}
                onClick={() => setOrder(move(display, i, i - 1))}
                className="px-1 text-muted-foreground disabled:opacity-30"
                aria-label="Move up"
              >
                &#8593;
              </button>
              <button
                disabled={i === display.length - 1}
                onClick={() => setOrder(move(display, i, i + 1))}
                className="px-1 text-muted-foreground disabled:opacity-30"
                aria-label="Move down"
              >
                &#8595;
              </button>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}

export function AdminSignatureDashboard(props: { password: string }) {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryFn: fetchSignatures,
    queryKey: ["footer-signatures"],
    staleTime: 30_000,
  });

  const items = data?.items ?? [];
  const limit = data?.limit ?? 0;

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSignature(id, props.password),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["footer-signatures"] });
    },
  });

  const verifiedMutation = useMutation({
    mutationFn: ({ id, verified }: { id: string; verified: boolean }) =>
      updateVerified(id, verified, props.password),
    onSuccess: (updated) => {
      queryClient.setQueryData<FooterSignatureResponse>(["footer-signatures"], (old) => {
        if (!old) return undefined;
        return { ...old, items: old.items.map((s) => (s.id === updated.id ? updated : s)) };
      });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Signatures</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Signatures</h1>
        <p className="text-red-500">Error loading signatures: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Signatures</h1>
        <span className="text-sm text-muted-foreground">
          {items.length}/{limit}
        </span>
      </div>

      {limit > 0 ? <LimitControl limit={limit} password={props.password} /> : null}

      {items.length > 1 ? <ReorderPanel items={items} password={props.password} /> : null}

      {items.length === 0 ? (
        <p className="text-muted-foreground">No signatures found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((signature) => (
            <div key={signature.id} className="group border rounded-lg p-4 space-y-3 bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  {signature.verified ? (
                    <IconSubscriptionTick1 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  ) : null}
                  <span className="font-medium truncate">{signature.name}</span>
                </div>
              </div>

              <div
                className="overflow-hidden mx-auto"
                style={{ height: FOOTER_SIGNATURE_HEIGHT * 3, aspectRatio: signature.aspect }}
              >
                <SignaturePreview svg={signature.svg} />
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>Created: {formatDate(signature.createdAt)}</p>
                <p className="font-mono text-[10px] truncate">ID: {signature.id}</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() =>
                    verifiedMutation.mutate({ id: signature.id, verified: !signature.verified })
                  }
                  disabled={
                    verifiedMutation.isPending && verifiedMutation.variables?.id === signature.id
                  }
                  className={`flex-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
                    signature.verified
                      ? "bg-muted text-muted-foreground group-hover:bg-blue-500/10 group-hover:text-blue-600"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  } disabled:opacity-50`}
                >
                  {verifiedMutation.isPending && verifiedMutation.variables?.id === signature.id
                    ? "Saving..."
                    : signature.verified
                      ? "Unverify"
                      : "Verify"}
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete signature from "${signature.name}"?`)) {
                      deleteMutation.mutate(signature.id);
                    }
                  }}
                  disabled={deleteMutation.isPending && deleteMutation.variables === signature.id}
                  className="px-3 py-1.5 text-sm rounded-md bg-red-500/10 text-red-600 hover:bg-red-500/20 disabled:opacity-50"
                >
                  {deleteMutation.isPending && deleteMutation.variables === signature.id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteMutation.isError || verifiedMutation.isError ? (
        <p className="text-sm text-red-500">
          {deleteMutation.error?.message || verifiedMutation.error?.message}
        </p>
      ) : null}
    </div>
  );
}
