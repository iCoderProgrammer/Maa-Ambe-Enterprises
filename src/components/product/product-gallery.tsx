"use client";

import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { MediaPlaceholder } from "@/components/common/media-placeholder";
import type { GalleryImage } from "@/types/product";

/**
 * Model gallery with a large view and a thumbnail rail.
 *
 * Thumbnails are real buttons in a tablist-free, simple selection pattern:
 * arrow keys are not hijacked, focus is visible, and the active thumbnail is
 * announced through `aria-pressed`. When no photography has been supplied the
 * component renders labelled placeholders that reserve the same layout space,
 * so swapping real images in later causes no layout shift.
 */
export function ProductGallery({
  images,
  productName,
}: {
  images: GalleryImage[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  if (images.length === 0) {
    return (
      <div className="grid gap-3 sm:grid-cols-3">
        <MediaPlaceholder
          label={`${productName} — front three-quarter`}
          ratio="aspect-4/3"
          className="sm:col-span-3"
        />
        <MediaPlaceholder label={`${productName} — side profile`} ratio="aspect-4/3" />
        <MediaPlaceholder label={`${productName} — console`} ratio="aspect-4/3" />
        <MediaPlaceholder label={`${productName} — under-seat storage`} ratio="aspect-4/3" />
      </div>
    );
  }

  return (
    <div>
      {/*
        Every shot is rendered and the selection cross-fades, rather than one
        `<img>` whose `src` is swapped. Swapping the source tore: the browser
        dropped the old frame before it had decoded the new one, so picking a
        thumbnail flashed the empty panel — worst on exactly the slow
        connections where the gallery matters most. Stacking them costs the
        decode of images the visitor is likely to open anyway, and the frame
        holds its aspect ratio throughout, so nothing below it moves.
      */}
      <div className="bg-surface-muted relative aspect-4/3 w-full overflow-hidden rounded-2xl sm:aspect-16/9">
        {images.map((image, index) => (
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt}
            fill
            // Only the visible shot is announced; the rest are decoration
            // until they are chosen.
            aria-hidden={index !== activeIndex}
            sizes="(min-width: 1024px) 76rem, 92vw"
            priority={index === 0}
            className={cn(
              "object-cover transition-opacity duration-500 ease-(--ease-out-brand)",
              index === activeIndex ? "opacity-100" : "opacity-0"
            )}
          />
        ))}
      </div>

      {images.length > 1 ? (
        <ul className="no-scrollbar mt-3 flex list-none gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <li key={image.src} className="shrink-0">
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-pressed={index === activeIndex}
                aria-label={`Show image ${index + 1} of ${images.length}: ${image.alt}`}
                className={cn(
                  "block overflow-hidden rounded-lg border-2 transition-colors",
                  index === activeIndex
                    ? "border-foreground"
                    : "border-transparent hover:border-border"
                )}
              >
                <Image
                  src={image.src}
                  alt=""
                  width={160}
                  height={120}
                  sizes="120px"
                  className="bg-surface-muted aspect-4/3 w-24 object-cover sm:w-28"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
