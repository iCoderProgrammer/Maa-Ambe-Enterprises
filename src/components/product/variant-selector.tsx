"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { resolveSpecs } from "@/lib/products";
import { useProduct } from "@/components/product/product-provider";

/**
 * Variant picker.
 *
 * Renders nothing when a model has a single variant — an empty selector is
 * noise. Selecting a variant updates price, specifications, colours,
 * availability and BaaS terms everywhere on the page through context.
 *
 * Implemented as a native radio group so keyboard and screen-reader behaviour
 * comes from the platform rather than being re-implemented.
 */
export function VariantSelector() {
  const { product, variant, setVariantId } = useProduct();

  if (product.variants.length < 2) return null;

  return (
    <fieldset className="mt-8">
      <legend className="text-eyebrow text-muted-foreground uppercase">
        Choose a variant
      </legend>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {product.variants.map((option) => {
          const isSelected = option.id === variant.id;
          const specs = resolveSpecs(product, option.id);
          const isUnavailable = option.availability === "discontinued";

          return (
            <label
              key={option.id}
              className={cn(
                "relative flex cursor-pointer flex-col rounded-xl border p-4 transition-[border-color,background-color,box-shadow]",
                isSelected
                  ? "border-foreground bg-muted shadow-xs"
                  : "border-border hover:border-foreground/30 hover:bg-muted/40",
                isUnavailable && "cursor-not-allowed opacity-55"
              )}
            >
              <input
                type="radio"
                name={`${product.slug}-variant`}
                value={option.id}
                checked={isSelected}
                disabled={isUnavailable}
                onChange={() => setVariantId(option.id)}
                className="sr-only-focusable absolute top-3 right-3"
              />

              <span className="flex items-start justify-between gap-3">
                <span className="font-display text-sm font-semibold">{option.name}</span>
                {isSelected ? (
                  <Check aria-hidden className="text-brand-600 size-4 shrink-0" />
                ) : null}
              </span>

              <span className="font-display mt-1.5 text-base font-semibold">
                {formatPrice(option.price)}
              </span>

              <span className="text-muted-foreground mt-1 text-xs">
                {specs.range.claimedKm != null
                  ? `Up to ${specs.range.claimedKm} km claimed range`
                  : "Range to be confirmed"}
                {option.availability === "coming-soon" ? " · Coming soon" : ""}
                {isUnavailable ? " · Discontinued" : ""}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
