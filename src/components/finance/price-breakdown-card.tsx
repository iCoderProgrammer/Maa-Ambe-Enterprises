import { Info } from "lucide-react";

import { formatPrice, TBD } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  getOnRoadPrice,
  ON_ROAD_COMPONENTS,
  PRICE_DISCLAIMER,
} from "@/data/pricing";

/**
 * What makes up an on-road price.
 *
 * When the dealership has configured figures for the model, variant and city,
 * they are shown and totalled. When it has not — the current state — the card
 * explains each component and leaves the numbers as placeholders. It never
 * estimates: a customer will quote a number like this back at the counter, so
 * a plausible guess is worse than an honest gap.
 */
export function PriceBreakdownCard({
  modelSlug,
  modelName,
  variantId,
  variantName,
  city,
  className,
}: {
  modelSlug: string;
  modelName: string;
  variantId: string;
  variantName?: string;
  city?: string;
  className?: string;
}) {
  const price = city ? getOnRoadPrice(modelSlug, variantId, city) : null;

  const rows = [
    { id: "ex-showroom", value: price?.exShowroom ?? null, sign: 1 },
    { id: "registration", value: price?.registration ?? null, sign: 1 },
    { id: "insurance", value: price?.insurance ?? null, sign: 1 },
    { id: "other", value: price?.otherCharges ?? null, sign: 1 },
    { id: "subsidy", value: price?.subsidy ?? null, sign: -1 },
  ] as const;

  return (
    <div
      className={cn(
        "border-hairline bg-background overflow-hidden rounded-2xl border",
        className
      )}
    >
      <div className="border-hairline border-b p-6">
        <h3 className="font-display text-base font-semibold">
          What goes into an on-road price
        </h3>
        <p className="text-muted-foreground mt-1.5 text-sm">
          {modelName}
          {variantName ? ` ${variantName}` : ""}
          {price ? ` in ${price.city}` : ""}
        </p>
      </div>

      <dl className="divide-hairline divide-y">
        {ON_ROAD_COMPONENTS.map((component) => {
          const row = rows.find((item) => item.id === component.id);
          const value = row?.value ?? null;

          return (
            <div key={component.id} className="flex items-start justify-between gap-6 p-5">
              <div className="min-w-0">
                <dt className="font-display text-sm font-medium">{component.label}</dt>
                <p className="text-muted-foreground mt-1 text-xs leading-relaxed text-pretty">
                  {component.description}
                </p>
              </div>
              <dd
                className={cn(
                  "font-display shrink-0 text-sm font-medium",
                  value == null && "text-muted-foreground font-normal"
                )}
              >
                {value == null
                  ? TBD
                  : `${row!.sign < 0 ? "− " : ""}${formatPrice(value)}`}
              </dd>
            </div>
          );
        })}
      </dl>

      <div className="bg-surface-muted border-hairline flex items-baseline justify-between gap-6 border-t p-6">
        <span className="font-display text-sm font-semibold">On-road price</span>
        <span
          className={cn(
            "font-display text-display-sm font-semibold",
            !price && "text-muted-foreground text-base font-normal"
          )}
        >
          {price ? formatPrice(price.total) : "Ask us for your city"}
        </span>
      </div>

      <p className="text-muted-foreground flex gap-2 p-5 text-[0.6875rem] leading-relaxed">
        <Info aria-hidden className="mt-0.5 size-3.5 shrink-0" />
        {PRICE_DISCLAIMER}
      </p>
    </div>
  );
}
