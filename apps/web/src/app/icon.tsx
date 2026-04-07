import { ACCENT } from "~/lib/site-accent";

export const contentType = "image/svg+xml";

export default function Icon() {
  return new Response(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" ry="8" fill="${ACCENT}"/></svg>`,
    { headers: { "Content-Type": "image/svg+xml; charset=utf-8" } },
  );
}
