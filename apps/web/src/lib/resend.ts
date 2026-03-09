import { Resend } from "resend";

import { env } from "~/env";

export function getResend(): Resend | null {
  if (!env.RESEND_API_KEY) return null;
  return new Resend(env.RESEND_API_KEY);
}

export function hasResend(): boolean {
  return !!env.RESEND_API_KEY && !!env.RESEND_FROM_EMAIL;
}
