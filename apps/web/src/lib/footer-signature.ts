import { z } from "zod";

export const DEFAULT_FOOTER_SIGNATURE_LIMIT = 52;
export const FOOTER_SIGNATURE_HEIGHT = 20;
export const FOOTER_SIGNATURE_NAME_LIMIT = 48;
export const FOOTER_SIGNATURE_DATA_PREFIX = "data:image/svg+xml;base64,";
export const FOOTER_SIGNATURE_SCALE_DEFAULT = 1;
export const FOOTER_SIGNATURE_SCALE_MIN = 0.5;
export const FOOTER_SIGNATURE_SCALE_MAX = 4;
export const FOOTER_SIGNATURE_OFFSET_DEFAULT = 0;
export const FOOTER_SIGNATURE_OFFSET_MIN = -100;
export const FOOTER_SIGNATURE_OFFSET_MAX = 100;

export const footerSignatureName = z.string().trim().min(1).max(FOOTER_SIGNATURE_NAME_LIMIT);
export const footerSignatureScale = z
  .number()
  .gte(FOOTER_SIGNATURE_SCALE_MIN)
  .lte(FOOTER_SIGNATURE_SCALE_MAX);
export const footerSignatureOffset = z
  .number()
  .gte(FOOTER_SIGNATURE_OFFSET_MIN)
  .lte(FOOTER_SIGNATURE_OFFSET_MAX);

export const footerSignatureInput = z.object({
  name: footerSignatureName,
  svg: z.string().trim().min(1),
});

export const footerSignatureRecord = z.object({
  id: z.string().trim().min(1),
  name: footerSignatureName,
  svg: z.string().trim().min(1),
  aspect: z.number().gt(0),
  createdAt: z.number().int().positive(),
  scale: footerSignatureScale.optional().default(FOOTER_SIGNATURE_SCALE_DEFAULT),
  x: footerSignatureOffset.optional().default(FOOTER_SIGNATURE_OFFSET_DEFAULT),
  y: footerSignatureOffset.optional().default(FOOTER_SIGNATURE_OFFSET_DEFAULT),
  verified: z.boolean().optional().default(false),
});

export const footerSignatureUpdateInput = z
  .object({
    name: footerSignatureName.optional(),
    scale: footerSignatureScale.optional(),
    x: footerSignatureOffset.optional(),
    y: footerSignatureOffset.optional(),
    verified: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be updated",
  });

export type FooterSignatureInput = z.infer<typeof footerSignatureInput>;
export type FooterSignatureRecord = z.infer<typeof footerSignatureRecord>;
export type FooterSignatureMark = Pick<FooterSignatureInput, "svg">;
export type FooterSignatureUpdateInput = z.infer<typeof footerSignatureUpdateInput>;
export type FooterSignatureResponse = { items: FooterSignatureRecord[]; limit: number };
