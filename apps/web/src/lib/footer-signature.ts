import { z } from "zod";

export const FOOTER_SIGNATURE_LIMIT = 20;
export const FOOTER_BOARD_HEIGHT = 224;
export const FOOTER_SIGNATURE_HEIGHT = 40;
export const FOOTER_SIGNATURE_DATA_PREFIX = "data:image/svg+xml;base64,";

export const footerSignatureInput = z.object({
  svg: z.string().trim().min(1).max(40_000),
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
});

export const footerSignatureRecord = z.object({
  id: z.uuid(),
  svg: z.string().trim().min(1).max(40_000),
  aspect: z.number().gt(0).max(8),
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  createdAt: z.number().int().positive(),
});

export type FooterSignatureInput = z.infer<typeof footerSignatureInput>;
export type FooterSignatureRecord = z.infer<typeof footerSignatureRecord>;
export type FooterSignatureDraft = FooterSignatureInput & {
  aspect: number;
};
