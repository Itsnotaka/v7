import { v2 as cloudinary } from "cloudinary";
import { getCldImageUrl } from "next-cloudinary";

import { Section } from "~/components/page-shell";

import { PhotosPage } from "./_components/photos";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function getPhotos() {
  const result = await cloudinary.search
    .expression("folder:v7")
    .sort_by("created_at", "desc")
    .max_results(30)
    .execute();

  return (result.resources as { public_id: string }[]).map((r) => ({
    thumbnail: getCldImageUrl({ src: r.public_id, width: 400, quality: "auto", format: "auto" }),
    full: getCldImageUrl({ src: r.public_id, width: 1600, quality: "auto", format: "auto" }),
  }));
}

export default async function Page() {
  const photos = await getPhotos();

  return (
    <>
      <Section className="relative mt-8">
        <div className="col-span-8 tablet:col-span-5">
          <p className="first-letter:pr-1 first-letter:[-webkit-initial-letter:2] first-letter:[initial-letter:2] text-2xl/[1.5] tracking-wide text-balance">
            Photos is my way of showing others the way I see the world. Each frame is a fragment of
            time I wanted to hold onto — moments that made me stop, look closer, and feel something.
            Shot on both film and digital, these are the pieces of life that stay with me.
          </p>
        </div>
      </Section>

      <PhotosPage photos={photos} />
    </>
  );
}
