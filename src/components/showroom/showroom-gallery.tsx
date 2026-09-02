"use client";

import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { MediaPlaceholder } from "@/components/common/media-placeholder";
import type { ShowroomImage } from "@/data/dealership";

/** Shots we expect, used to reserve layout when no photographs exist yet. */
const EXPECTED_SHOTS = [
  "Showroom exterior and signage",
  "Display floor",
  "Delivery bay",
  "Service workshop",
  "Customer lounge",
  "Accessories counter",
];

/**
 * Reusable showroom gallery.
 *
 * Real photographs go through `next/image` with explicit dimensions and a
 * responsive `sizes` hint, so the browser downloads an appropriately scaled
 * file and the layout never shifts. Until images are supplied, labelled
 * placeholders occupy the identical grid — dropping the real files in later
 * changes nothing about the layout.
 */
export function ShowroomGallery({
  images,
  className,
}: {
  images: ShowroomImage[];
  className?: string;
}) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  if (images.length === 0) {
    return (
      <div className={cn("grid gap-3 sm:grid-cols-4 sm:grid-rows-2", className)}>
        {EXPECTED_SHOTS.slice(0, 5).map((label, index) => (
          <MediaPlaceholder
            key={label}
            label={label}
            ratio={index === 0 ? "aspect-4/3" : "aspect-square"}
            className={index === 0 ? "sm:col-span-2 sm:row-span-2" : undefined}
          />
        ))}
      </div>
    );
  }

  const active = images[activeIndex];

  return (
    <div className={className}>
      <Image
        key={active.src}
        src={active.src}
        alt={active.alt}
        width={active.width}
        height={active.height}
        sizes="(min-width: 1024px) 76rem, 92vw"
        priority={activeIndex === 0}
        className="bg-surface-muted aspect-4/3 w-full rounded-2xl object-cover sm:aspect-16/9"
      />

      {images.length > 1 ? (
        <ul className="no-scrollbar mt-3 flex list-none gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <li key={image.src} className="shrink-0">
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-pressed={index === activeIndex}
                aria-label={`Show photograph ${index + 1} of ${images.length}: ${image.alt}`}
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
                  loading="lazy"
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
