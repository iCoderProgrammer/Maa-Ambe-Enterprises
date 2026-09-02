"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import { formatPrice, formatSpec, TBD } from "@/lib/format";
import { useProduct } from "@/components/product/product-provider";
import type { ShowroomMedia } from "@/types/showroom";

/**
 * Variant chooser, showroom presentation.
 *
 * A segmented control over the model's own variants, with the figures that
 * actually differ between them listed underneath. Nothing about the variants
 * is written into this component: the names come from product data, the rows
 * are resolved for whichever variant is selected, and a model with one variant
 * renders nothing at all rather than a chooser with a single option.
 *
 * Implemented over native radio inputs so arrow keys, grouping and the
 * screen-reader announcement come from the platform. The visible control is
 * the label; the input itself is visually hidden but focusable, which is what
 * keeps the focus ring on the thing the eye is looking at.
 */
export function ShowroomVariants({ image }: { image?: ShowroomMedia }) {
  const { product, variant, specs, setVariantId } = useProduct();

  const rows = [
    { label: "Claimed range", value: formatSpec(specs.range.claimedKm, "km") },
    { label: "Battery capacity", value: formatSpec(specs.batteryCapacityKwh, "kWh", 1) },
    { label: "Ex-showroom price", value: formatPrice(variant.price) },
    {
      label: "Battery as a subscription",
      value: variant.baas ? "Available" : "Not offered",
    },
  ];

  if (product.variants.length < 2) return null;

  return (
    <div>
      <fieldset>
        <legend className="sr-only">Choose a {product.name} variant</legend>

        <div className="bg-surface-muted mx-auto flex max-w-xl gap-1 rounded-full p-1">
          {product.variants.map((option) => {
            const isSelected = option.id === variant.id;
            const isUnavailable = option.availability === "discontinued";

            return (
              <label
                key={option.id}
                className={cn(
                  "font-display relative flex flex-1 cursor-pointer items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition-colors duration-200 ease-(--ease-out-brand) has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring",
                  isSelected
                    ? "bg-background text-brand-700 dark:text-brand-300 shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                  isUnavailable && "cursor-not-allowed opacity-55"
                )}
              >
                <input
                  type="radio"
                  name={`${product.slug}-showroom-variant`}
                  value={option.id}
                  checked={isSelected}
                  disabled={isUnavailable}
                  onChange={() => setVariantId(option.id)}
                  className="sr-only"
                />
                {option.name}
              </label>
            );
          })}
        </div>
      </fieldset>

      <dl className="border-hairline mx-auto mt-10 max-w-xl divide-hairline divide-y border-y">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-6 py-4">
            <dt className="text-muted-foreground text-sm">{row.label}</dt>
            <dd
              className={cn(
                "font-display text-right text-lg font-semibold",
                row.value === TBD && "text-muted-foreground text-base font-normal"
              )}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      {product.variants.some((option) => option.price == null) ? (
        <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-xs">
          Prices are confirmed at the showroom because the on-road figure depends on
          your city, registration and the offers running that week. Ask us for a written
          on-road quote and there will be no surprises on delivery day.
        </p>
      ) : null}

      {image ? (
        <div className="bg-surface-muted mt-12 overflow-hidden rounded-2xl sm:rounded-3xl">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="aspect-16/9 w-full object-contain p-4 sm:p-10"
          />
        </div>
      ) : null}
    </div>
  );
}
