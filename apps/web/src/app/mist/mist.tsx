import type * as React from "react";

import { Prism } from "~/components/prism";

export function Mist(props: React.ComponentProps<typeof Prism>) {
  return <Prism {...props} />;
}
