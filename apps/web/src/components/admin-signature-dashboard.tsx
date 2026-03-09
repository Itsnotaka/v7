"use client";

import { IconSubscriptionTick1 } from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";

import {
  FOOTER_SIGNATURE_DATA_PREFIX,
  FOOTER_SIGNATURE_HEIGHT,
  type FooterSignatureRecord,
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

async function fetchSignatures(): Promise<FooterSignatureRecord[]> {
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

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function AdminSignatureDashboard(props: { password: string }) {
  const queryClient = useQueryClient();
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryFn: fetchSignatures,
    queryKey: ["footer-signatures"],
    staleTime: 30_000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSignature(id, props.password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["footer-signatures"] });
    },
  });

  const verifiedMutation = useMutation({
    mutationFn: ({ id, verified }: { id: string; verified: boolean }) =>
      updateVerified(id, verified, props.password),
    onSuccess: (updated) => {
      queryClient.setQueryData<FooterSignatureRecord[]>(["footer-signatures"], (old) => {
        if (!old) return [];
        return old.map((s) => (s.id === updated.id ? updated : s));
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
        <span className="text-sm text-muted-foreground">{data.length} total</span>
      </div>

      {data.length === 0 ? (
        <p className="text-muted-foreground">No signatures found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((signature) => (
            <div key={signature.id} className="group border rounded-lg p-4 space-y-3 bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  {signature.verified && (
                    <IconSubscriptionTick1 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  )}
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

      {(deleteMutation.isError || verifiedMutation.isError) && (
        <p className="text-sm text-red-500">
          {deleteMutation.error?.message || verifiedMutation.error?.message}
        </p>
      )}
    </div>
  );
}
