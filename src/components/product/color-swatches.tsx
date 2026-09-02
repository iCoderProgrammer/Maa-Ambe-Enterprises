"use client";

import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { MediaPlaceholder } from "@/components/common/media-placeholder";
import { PendingData } from "@/components/common/pending-data";
import { useProduct } from "@/components/product/product-provider";

/**
 * Colour picker for the selected variant.
 *
 * Colours are variant-aware: a variant that restricts `colorIds` shows only its
 * own finishes. If the selected id is not offered by the newly chosen variant
 * the lookup falls through to the first available colour, so a finish from a
 * previous variant can never stay selected.
 */
export function ColorSwatches() {
  const { product, colors } = useProduct();
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const selected = colors.find((color) => color.id === selectedId) ?? colors[0];

  if (colors.length === 0) {
    return (
      <PendingData>
        Colour options for the {product.name} are being confirmed with Lectrix EV. Call
        the showroom to check what is in stock.
      </PendingData>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
      {selected?.image ? (
        <Image
          src={selected.image}
          alt={`${product.name} in ${selected.name}`}
          width={1200}
          height={900}
          sizes="(min-width: 1024px) 50vw, 92vw"
          className="bg-surface-muted aspect-4/3 w-full rounded-2xl object-cover"
        />
      ) : (
        <MediaPlaceholder
          label={`${product.name} in ${selected?.name ?? "colour"}`}
          className="rounded-2xl"
        />
      )}

      <div>
        <p className="text-muted-foreground text-xs">Selected finish</p>
        <p className="font-display mt-1 text-display-sm">{selected?.name}</p>

        <ul className="mt-7 flex list-none flex-wrap gap-3">
          {colors.map((color) => {
            const isSelected = color.id === selected?.id;

            return (
              <li key={color.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(color.id)}
                  aria-pressed={isSelected}
                  aria-label={color.name}
                  title={color.name}
                  className={cn(
                    "block size-11 rounded-full border-2 transition-transform",
                    isSelected
                      ? "border-foreground scale-105"
                      : "border-border hover:scale-105"
                  )}
                >
                  <span
                    aria-hidden
                    className="block size-full rounded-full border border-black/10"
                    style={{ backgroundColor: color.hex }}
                  />
                </button>
              </li>
            );
          })}
        </ul>

        <p className="text-muted-foreground mt-6 text-xs">
          {colors.length} finish{colors.length === 1 ? "" : "es"} available on this
          variant. Availability varies by showroom stock.
        </p>
      </div>
    </div>
  );
}
