import { initBotId } from "botid/client/core";

initBotId({
  protect: [
    {
      path: "/api/site-variant",
      method: "POST",
    },
  ],
});
