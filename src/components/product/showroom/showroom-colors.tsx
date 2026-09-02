"use client";

import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { PendingData } from "@/components/common/pending-data";
import { useProduct } from "@/components/product/product-provider";

/**
 * Colour picker, showroom presentation.
 *
 * The compact `ColorSwatches` still serves the standard model page; this is
 * the same behaviour given the room a colour choice deserves — the scooter
 * large and centred, the finish named beneath it, the swatches under that.
 *
 * HOW THE IMAGE CHANGES
 *
 * Every finish is a real photograph from the model's own data. Nothing is
 * tinted with a CSS filter: a filter would misrepresent how the paint actually
 * looks, which is the one thing this control exists to show. All the images
 * are rendered and cross-faded with opacity rather than swapped, so switching
 * finish does not flash a gap while the next file loads, and so the frame
 * cannot resize mid-transition.
 *
 * Colours are variant-aware. If the selected variant does not offer the
 * currently chosen finish, the lookup falls through to the first one it does.
 */
export function ShowroomColorsBlock() {
  const { product, colors } = useProduct();
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const selected = colors.find((color) => color.id === selectedId) ?? colors[0];

  if (colors.length === 0 || !selected) {
    return (
      <PendingData>
        Colour options for the {product.name} are being confirmed with Lectrix EV. Call
        the showroom to check what is on the floor.
      </PendingData>
    );
  }

  return (
    <div>
      <div className="bg-surface-muted relative aspect-4/3 overflow-hidden rounded-2xl sm:aspect-16/9 sm:rounded-3xl">
        {colors.map((color) => {
          const isSelected = color.id === selected.id;

          return color.image ? (
            <Image
              key={color.id}
              src={color.image}
              alt={`${product.name} in ${color.name}`}
              fill
              // Only the visible finish is announced; the rest are pre-rendered
              // purely so the swap is instant.
              aria-hidden={!isSelected}
              sizes="(min-width: 1280px) 1200px, 100vw"
              priority={isSelected && color.id === colors[0].id}
              className={cn(
                "object-contain p-4 transition-opacity duration-500 ease-(--ease-out-brand) sm:p-10",
                isSelected ? "opacity-100" : "opacity-0"
              )}
            />
          ) : null;
        })}
      </div>

      <div className="mt-8 flex flex-col items-center gap-6">
        <p aria-live="polite" className="font-display text-display-sm text-center">
          {selected.name}
        </p>

        <ul className="bg-surface-muted flex list-none items-center gap-2 rounded-full p-2">
          {colors.map((color) => {
            const isSelected = color.id === selected.id;

            return (
              <li key={color.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(color.id)}
                  aria-pressed={isSelected}
                  aria-label={`Show the ${product.name} in ${color.name}`}
                  title={color.name}
                  className={cn(
                    "focus-visible:outline-ring block cursor-pointer rounded-full p-0.5 transition-transform duration-200 ease-(--ease-out-brand) focus-visible:outline-2 focus-visible:outline-offset-2",
                    isSelected
                      ? "ring-foreground scale-105 ring-2"
                      : "ring-transparent hover:scale-105"
                  )}
                >
                  <span
                    aria-hidden
                    className="block size-8 rounded-full border border-black/10 sm:size-9"
                    style={{ backgroundColor: color.hex }}
                  />
                </button>
              </li>
            );
          })}
        </ul>

        <p className="text-muted-foreground max-w-md text-center text-xs">
          {colors.length} finish{colors.length === 1 ? "" : "es"} on this variant.
          Availability changes with showroom stock — call before you travel if you have
          settled on one.
        </p>
      </div>
    </div>
  );
}
