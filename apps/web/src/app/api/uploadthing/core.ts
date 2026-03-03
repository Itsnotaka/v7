import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const router: FileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 4,
    },
  }).onUploadComplete(async ({ file }) => {
    return { url: file.ufsUrl };
  }),
};

export type Router = typeof router;
