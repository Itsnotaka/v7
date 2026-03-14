"use client";

import { IconSubscriptionTick1 } from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { FooterSignaturePreview } from "~/components/footer-signature-preview";
import {
  FOOTER_SIGNATURE_HEIGHT,
  FOOTER_SIGNATURE_NAME_LIMIT,
  FOOTER_SIGNATURE_OFFSET_DEFAULT,
  FOOTER_SIGNATURE_OFFSET_MAX,
  FOOTER_SIGNATURE_OFFSET_MIN,
  FOOTER_SIGNATURE_SCALE_DEFAULT,
  FOOTER_SIGNATURE_SCALE_MAX,
  FOOTER_SIGNATURE_SCALE_MIN,
  type FooterSignatureRecord,
  type FooterSignatureResponse,
  type FooterSignatureUpdateInput,
} from "~/lib/footer-signature";

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

async function updateSignature(
  id: string,
  value: FooterSignatureUpdateInput,
  password: string,
): Promise<FooterSignatureRecord> {
  const res = await fetch(`/api/footer-signatures/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${password}`,
    },
    body: JSON.stringify(value),
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

function replaceItem(
  old: FooterSignatureResponse | undefined,
  item: FooterSignatureRecord,
): FooterSignatureResponse | undefined {
  if (!old) return undefined;
  return { ...old, items: old.items.map((row) => (row.id === item.id ? item : row)) };
}

function removeItem(
  old: FooterSignatureResponse | undefined,
  id: string,
): FooterSignatureResponse | undefined {
  if (!old) return undefined;
  return { ...old, items: old.items.filter((row) => row.id !== id) };
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

function Range(props: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  valueLabel: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-1.5">
      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>{props.label}</span>
        <span className="font-mono text-[11px] text-foreground">{props.valueLabel}</span>
      </div>
      <input
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        onChange={(e) => props.onChange(Number(e.target.value))}
        className="w-full accent-foreground"
      />
    </label>
  );
}

function SignatureCard(props: { signature: FooterSignatureRecord; password: string }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(props.signature.name);
  const [scale, setScale] = useState(props.signature.scale);
  const [tick, setTick] = useState(0);
  const [x, setX] = useState(props.signature.x);
  const [y, setY] = useState(props.signature.y);

  const nextName = name.trim();
  const title = nextName || props.signature.name;
  const nameValid = nextName.length > 0 && nextName.length <= FOOTER_SIGNATURE_NAME_LIMIT;
  const dirty =
    nextName !== props.signature.name ||
    scale !== props.signature.scale ||
    x !== props.signature.x ||
    y !== props.signature.y;

  const apply = useMutation({
    mutationFn: (value: FooterSignatureUpdateInput) =>
      updateSignature(props.signature.id, value, props.password),
    onSuccess: (item) => {
      queryClient.setQueryData<FooterSignatureResponse>(["footer-signatures"], (old) =>
        replaceItem(old, item),
      );
    },
  });

  const verify = useMutation({
    mutationFn: (value: boolean) =>
      updateSignature(props.signature.id, { verified: value }, props.password),
    onSuccess: (item) => {
      queryClient.setQueryData<FooterSignatureResponse>(["footer-signatures"], (old) =>
        replaceItem(old, item),
      );
    },
  });

  const remove = useMutation({
    mutationFn: () => deleteSignature(props.signature.id, props.password),
    onSuccess: () => {
      queryClient.setQueryData<FooterSignatureResponse>(["footer-signatures"], (old) =>
        removeItem(old, props.signature.id),
      );
      void queryClient.invalidateQueries({ queryKey: ["footer-signatures"] });
    },
  });

  const busy = apply.isPending || verify.isPending || remove.isPending;
  const error = apply.error?.message || verify.error?.message || remove.error?.message;
  const state = dirty ? "Draft" : props.signature.verified ? "Verified" : "Unverified";

  return (
    <div className="grid gap-4 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex items-center gap-2">
          {props.signature.verified ? (
            <IconSubscriptionTick1 className="h-4 w-4 flex-shrink-0 text-blue-500" />
          ) : null}
          <span className="truncate text-sm font-medium">{title}</span>
        </div>
        <span className={`text-xs ${dirty ? "text-amber-600" : "text-muted-foreground"}`}>
          {state}
        </span>
      </div>

      <label className="grid gap-1.5">
        <span className="text-xs text-muted-foreground">Author</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={busy}
          className="rounded-md border bg-background px-3 py-2 text-sm"
        />
      </label>

      <div className="grid gap-3">
        <div className="grid gap-1.5">
          <span className="text-xs text-muted-foreground">Footer preview</span>
          <div className="rounded-md border bg-background px-3 py-2">
            <div
              className="mx-auto overflow-hidden"
              style={{ height: FOOTER_SIGNATURE_HEIGHT, aspectRatio: props.signature.aspect }}
            >
              <FooterSignaturePreview
                svg={props.signature.svg}
                scale={scale}
                x={x}
                y={y}
                animate={tick}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-1.5">
          <span className="text-xs text-muted-foreground">Editor preview</span>
          <div className="rounded-md border bg-muted/20 px-4 py-4">
            <div
              className="mx-auto overflow-hidden"
              style={{ height: FOOTER_SIGNATURE_HEIGHT * 4, aspectRatio: props.signature.aspect }}
            >
              <FooterSignaturePreview
                svg={props.signature.svg}
                scale={scale}
                x={x}
                y={y}
                animate={tick}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          <Range
            label="Size"
            min={FOOTER_SIGNATURE_SCALE_MIN}
            max={FOOTER_SIGNATURE_SCALE_MAX}
            step={0.05}
            value={scale}
            valueLabel={`${scale.toFixed(2)}x`}
            onChange={setScale}
          />
          <Range
            label="Horizontal"
            min={FOOTER_SIGNATURE_OFFSET_MIN}
            max={FOOTER_SIGNATURE_OFFSET_MAX}
            step={1}
            value={x}
            valueLabel={`${x}%`}
            onChange={setX}
          />
          <Range
            label="Vertical"
            min={FOOTER_SIGNATURE_OFFSET_MIN}
            max={FOOTER_SIGNATURE_OFFSET_MAX}
            step={1}
            value={y}
            valueLabel={`${y}%`}
            onChange={setY}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTick((value) => value + 1)}
            className="rounded-md bg-muted px-3 py-1 text-sm"
          >
            Play
          </button>
          <button
            type="button"
            onClick={() => {
              setScale(FOOTER_SIGNATURE_SCALE_DEFAULT);
              setX(FOOTER_SIGNATURE_OFFSET_DEFAULT);
              setY(FOOTER_SIGNATURE_OFFSET_DEFAULT);
            }}
            disabled={busy}
            className="rounded-md bg-muted px-3 py-1 text-sm"
          >
            Reset view
          </button>
          <button
            type="button"
            onClick={() => {
              setName(props.signature.name);
              setScale(props.signature.scale);
              setX(props.signature.x);
              setY(props.signature.y);
            }}
            disabled={!dirty || busy}
            className="rounded-md bg-muted px-3 py-1 text-sm disabled:opacity-50"
          >
            Revert draft
          </button>
        </div>
      </div>

      <div className="space-y-1 text-xs text-muted-foreground">
        <p>Created: {formatDate(props.signature.createdAt)}</p>
        <p>
          Saved view: {props.signature.scale.toFixed(2)}x, {props.signature.x}% /{" "}
          {props.signature.y}%
        </p>
        <p className="truncate font-mono text-[10px]">ID: {props.signature.id}</p>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <button
          type="button"
          onClick={() => apply.mutate({ name: nextName, scale, x, y })}
          disabled={!dirty || !nameValid || busy}
          className="flex-1 rounded-md bg-foreground px-3 py-1.5 text-sm text-background disabled:opacity-50"
        >
          {apply.isPending ? "Applying..." : "Apply changes"}
        </button>
        <button
          type="button"
          onClick={() => verify.mutate(!props.signature.verified)}
          disabled={busy}
          className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
            props.signature.verified
              ? "bg-muted text-muted-foreground hover:bg-blue-500/10 hover:text-blue-600"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          } disabled:opacity-50`}
        >
          {verify.isPending ? "Saving..." : props.signature.verified ? "Unverify" : "Verify"}
        </button>
        <button
          type="button"
          onClick={() => {
            if (confirm(`Delete signature from "${props.signature.name}"?`)) {
              remove.mutate();
            }
          }}
          disabled={busy}
          className="rounded-md bg-red-500/10 px-3 py-1.5 text-sm text-red-600 hover:bg-red-500/20 disabled:opacity-50"
        >
          {remove.isPending ? "Deleting..." : "Delete"}
        </button>
      </div>

      {!nameValid ? (
        <p className="text-sm text-red-500">
          Author name must be between 1 and {FOOTER_SIGNATURE_NAME_LIMIT} characters.
        </p>
      ) : null}

      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </div>
  );
}

export function AdminSignatureDashboard(props: { password: string }) {
  const { data, isLoading, error } = useQuery({
    queryFn: fetchSignatures,
    queryKey: ["footer-signatures"],
    staleTime: 30_000,
  });

  const items = data?.items ?? [];
  const limit = data?.limit ?? 0;

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

      {limit > 0 ? <LimitControl key={limit} limit={limit} password={props.password} /> : null}

      {items.length > 1 ? <ReorderPanel items={items} password={props.password} /> : null}

      {items.length === 0 ? (
        <p className="text-muted-foreground">No signatures found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((signature) => (
            <SignatureCard
              key={`${signature.id}:${signature.name}:${signature.scale}:${signature.x}:${signature.y}:${signature.verified}`}
              signature={signature}
              password={props.password}
            />
          ))}
        </div>
      )}
    </div>
  );
}
