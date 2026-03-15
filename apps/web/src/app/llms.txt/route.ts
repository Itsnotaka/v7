import { getMachineDoc } from "~/lib/machine";

export const revalidate = 3600;

export function GET() {
  return new Response(getMachineDoc(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
