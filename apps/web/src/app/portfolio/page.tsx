import { notFound } from "next/navigation";

import { PortfolioPage } from "./_components/portfolio-page";
import { getPortfolioVariant } from "./portfolio-content";

export default function Page() {
  const variant = getPortfolioVariant("1");

  if (!variant) {
    notFound();
  }

  return <PortfolioPage variant={variant} />;
}
