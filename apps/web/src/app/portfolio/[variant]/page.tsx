import { notFound } from "next/navigation";

import { PortfolioPage } from "../_components/portfolio-page";
import { getPortfolioVariant, PORTFOLIO_IDS } from "../portfolio-content";

type Props = {
  params: Promise<{ variant: string }>;
};

export function generateStaticParams() {
  return PORTFOLIO_IDS.map((variant) => ({ variant }));
}

export default async function Page(props: Props) {
  const params = await props.params;
  const variant = getPortfolioVariant(params.variant);

  if (!variant) {
    notFound();
  }

  return <PortfolioPage variant={variant} />;
}
