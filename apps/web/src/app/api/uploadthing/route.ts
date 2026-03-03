import { createRouteHandler } from "uploadthing/next";

import { router } from "./core";

export const { GET, POST } = createRouteHandler({
  router,
});
