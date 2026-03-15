"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { PageMain } from "~/components/page-shell";

import {
  SITE_VARIANT_AUTO,
  SITE_VARIANT_OVERRIDE,
  resolveSiteVariant,
  type SiteVariant,
} from "./site-variant";

type VariantContext = {
  variant: SiteVariant;
  select: (value: SiteVariant) => void;
};

const ctx = createContext<VariantContext>({
  variant: "human",
  select: () => {},
});

function cookie(name: string) {
  const row = document.cookie.split("; ").find((item) => item.startsWith(`${name}=`));

  if (!row) return null;

  return decodeURIComponent(row.split("=").slice(1).join("="));
}

export function useVariant() {
  return useContext(ctx);
}

export function VariantProvider(props: { initial: SiteVariant; children: React.ReactNode }) {
  const [variant, setVariant] = useState<SiteVariant>(props.initial);

  useEffect(() => {
    const resolved = resolveSiteVariant((name) => cookie(name));

    if (resolved) {
      setVariant(resolved);
      return;
    }

    fetch("/api/site-variant", { method: "POST", cache: "no-store" })
      .then(() => {
        const next = resolveSiteVariant((name) => cookie(name)) ?? "human";
        setVariant(next);
      })
      .catch(() => {
        document.cookie = `${SITE_VARIANT_AUTO}=human; Path=/; Max-Age=3600; SameSite=Lax`;
        setVariant("human");
      });
  }, []);

  const select = useCallback((next: SiteVariant) => {
    setVariant(next);
    document.cookie = `${SITE_VARIANT_OVERRIDE}=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }, []);

  return <ctx.Provider value={{ variant, select }}>{props.children}</ctx.Provider>;
}

export function VariantShell(props: { children: React.ReactNode }) {
  return <PageMain>{props.children}</PageMain>;
}
