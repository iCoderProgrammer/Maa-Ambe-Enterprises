import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BatteryCharging, Gauge, Route } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MediaPlaceholder } from "@/components/common/media-placeholder";
import { cn } from "@/lib/utils";
import { formatPrice, formatSpec } from "@/lib/format";
import { getStartingPrice, resolveVariant } from "@/lib/products";
import type { Product } from "@/types/product";
import { brandedModel } from "@/lib/brand";

/**
 * Lineup card. Every value comes from product data — nothing about a specific
 * model is written into this component, so it serves the homepage, the lineup
 * page and any "related models" rail without modification.
 */
export function ProductCard({
  product,
  className,
  priority = false,
}: {
  product: Product;
  className?: string;
  /** Set on above-the-fold cards so the image is not lazy-loaded. */
  priority?: boolean;
}) {
  // Card figures always describe the model's default variant, so a model with
  // several variants never shows a mixed set of specifications.
  const { specs } = resolveVariant(product);
  const startingPrice = getStartingPrice(product);

  const keySpecs = [
    { icon: Route, label: "Range", value: formatSpec(specs.range.claimedKm, "km") },
    {
      icon: BatteryCharging,
      label: "Battery",
      value: formatSpec(specs.batteryCapacityKwh, "kWh", 1),
    },
    {
      icon: Gauge,
      label: "Top speed",
      value: formatSpec(specs.topSpeedKmph, "km/h"),
    },
  ];

  return (
    <article
      className={cn(
        "border-hairline group bg-card flex flex-col overflow-hidden rounded-2xl border transition-shadow duration-300 ease-(--ease-out-brand) hover:shadow-lg",
        className
      )}
    >
      <div className="bg-surface-muted relative">
        {product.images.card ? (
          <Image
            src={product.images.card}
            alt={`${brandedModel(product.name)} electric scooter`}
            width={640}
            height={480}
            priority={priority}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            className="aspect-4/3 w-full object-cover transition-transform duration-500 ease-(--ease-out-brand) group-hover:scale-[1.03]"
          />
        ) : (
          <MediaPlaceholder
            label={`${brandedModel(product.name)} — lineup visual`}
            className="rounded-none"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-display-sm">
          <Link
            href={`/electric-scooters/${product.slug}`}
            className="hover:text-brand-700 dark:hover:text-brand-400 rounded-sm transition-colors"
          >
            {brandedModel(product.name)}
          </Link>
        </h3>
        <p className="text-muted-foreground mt-2 text-sm text-pretty">
          {product.tagline}
        </p>

        <dl className="border-hairline mt-5 grid grid-cols-3 gap-3 border-y py-4">
          {keySpecs.map((spec) => (
            <div key={spec.label}>
              <dt className="text-muted-foreground flex items-center gap-1.5 text-[0.6875rem]">
                <spec.icon aria-hidden className="size-3.5" />
                {spec.label}
              </dt>
              <dd className="mt-1 font-display text-sm font-medium">{spec.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5">
          <p className="text-muted-foreground text-xs">Starting at</p>
          <p className="font-display mt-0.5 text-xl font-semibold">
            {formatPrice(startingPrice)}
            {startingPrice != null ? (
              <span className="text-muted-foreground ml-1.5 text-xs font-normal">
                ex-showroom
              </span>
            ) : (
              <span className="text-muted-foreground ml-1.5 text-xs font-normal">
                price on request
              </span>
            )}
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <Button asChild size="default" className="flex-1">
            <Link href={`/electric-scooters/${product.slug}`}>
              Explore
              <ArrowRight aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="outline" size="default" className="flex-1">
            <Link href={`/book-test-ride?model=${product.slug}`}>Test Ride</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
