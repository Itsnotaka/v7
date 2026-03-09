import { z } from "zod";

export const FOOTER_SIGNATURE_LIMIT = 20;
export const FOOTER_SIGNATURE_HEIGHT = 20;
export const FOOTER_SIGNATURE_NAME_LIMIT = 48;
export const FOOTER_SIGNATURE_DATA_PREFIX = "data:image/svg+xml;base64,";

export const footerSignatureName = z.string().trim().min(1).max(FOOTER_SIGNATURE_NAME_LIMIT);

export const footerSignatureInput = z.object({
  name: footerSignatureName,
  svg: z.string().trim().min(1).max(40_000),
});

export const footerSignatureRecord = z.object({
  id: z.uuid(),
  name: footerSignatureName,
  svg: z.string().trim().min(1).max(40_000),
  aspect: z.number().gt(0).max(8),
  createdAt: z.number().int().positive(),
});

export type FooterSignatureInput = z.infer<typeof footerSignatureInput>;
export type FooterSignatureRecord = z.infer<typeof footerSignatureRecord>;
export type FooterSignatureMark = {
  aspect: number;
  svg: string;
};
export type FooterSignatureDraft = FooterSignatureInput & FooterSignatureMark;
