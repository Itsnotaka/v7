import type { Metadata } from "next";

import { Label, Section, Text, theme } from "@v7/ui";
import { v2 as cloudinary } from "cloudinary";
import { getCldImageUrl } from "next-cloudinary";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Photos",
  description: "Fragments of time worth holding onto — shot on film and digital.",
};

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
    id: r.public_id,
    thumbnail: getCldImageUrl({ src: r.public_id, width: 800, quality: "auto", format: "auto" }),
    full: getCldImageUrl({ src: r.public_id, width: 1600, quality: "auto", format: "auto" }),
  }));
}

async function PhotoGrid() {
  const photos = await getPhotos();

  return (
    <div className="grid grid-cols-1 items-start gap-4 px-4 sm:grid-cols-4 sm:px-6">
      {photos.map((photo, index) => {
        const wide = index % 7 === 3;
        return (
          <a
            key={photo.id}
            href={photo.full}
            target="_blank"
            rel="noreferrer"
            className={`group block overflow-hidden border ${theme.hairline} ${theme.ring} ${
              wide ? "aspect-[4/3] sm:col-span-2 sm:aspect-[8/3]" : "aspect-[4/3]"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.thumbnail}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </a>
        );
      })}
    </div>
  );
}

function PhotoGridFallback() {
  return (
    <div className="grid grid-cols-1 items-start gap-4 px-4 sm:grid-cols-4 sm:px-6">
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className={`aspect-[4/3] border bg-muted ${theme.hairline}`} />
      ))}
    </div>
  );
}

export default function Page() {
  return (
    <>
      <Section className="pt-12 sm:pt-16">
        <div className="px-4 sm:px-6">
          <Label as="h1">photos</Label>
          <Text as="p" variant="heading" className="mt-4 text-primary">
            The way I see the world — fragments of time worth holding onto, shot on film and
            digital.
          </Text>
        </div>
      </Section>
      <Section className="py-8 sm:py-10">
        <Suspense fallback={<PhotoGridFallback />}>
          <PhotoGrid />
        </Suspense>
      </Section>
    </>
  );
}
