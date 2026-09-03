"use client";

import Image from "next/image";
import Link from "next/link";
import { BatteryCharging, Gauge, IndianRupee, Route, Timer } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";
import { MediaPlaceholder } from "@/components/common/media-placeholder";
import { formatPrice, formatSpec } from "@/lib/format";
import { useProduct } from "@/components/product/product-provider";
import { VariantSelector } from "@/components/product/variant-selector";
import { TestRideModal } from "@/components/forms/test-ride-modal";
import type { Product } from "@/types/product";
import { DEALERSHIP_NAME, VEHICLE_BRAND, brandedModel } from "@/lib/brand";

const availabilityLabel = {
  available: `Available at ${DEALERSHIP_NAME}`,
  "coming-soon": "Coming soon",
  discontinued: "Discontinued",
} as const;

/**
 * Model hero: visual, positioning, live price and the two primary CTAs.
 *
 * Every figure reads from the selected variant, so changing variant updates the
 * price, the key specifications and the availability badge together.
 *
 * The primary CTA opens `TestRideModal` with this model and variant already
 * chosen. The catalogue is passed through so the form's model select still
 * offers the full lineup — a visitor who changes their mind mid-form should not
 * have to start again on another page.
 *
 * The heading names the vehicle as a Lectrix and the badge names where it can
 * be bought, so the page reads "Lectrix NDuro, available at Maa Ambey
 * Enterprises" rather than implying the dealership builds it.
 */
export function ProductHero({ catalogue }: { catalogue: Product[] }) {
  const { product, variant, specs } = useProduct();

  const keySpecs = [
    { icon: Route, label: "Claimed range", value: formatSpec(specs.range.claimedKm, "km") },
    {
      icon: BatteryCharging,
      label: "Battery",
      value: formatSpec(specs.batteryCapacityKwh, "kWh", 1),
    },
    { icon: Gauge, label: "Top speed", value: formatSpec(specs.topSpeedKmph, "km/h") },
    {
      icon: Timer,
      label: "Full charge",
      value: formatSpec(specs.charging.fullChargeHours, "hrs", 1),
    },
  ];

  return (
    <section className="pt-8 pb-14 lg:pt-12 lg:pb-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-start lg:gap-16">
          <div className="lg:sticky lg:top-24">
            {product.images.hero ? (
              /*
                A studio render sitting flat on the page background reads as a
                catalogue thumbnail. The glow behind the frame and the hairline
                around it do what a showroom's own lighting does: separate the
                vehicle from the wall it is standing against.
              */
              <div className="relative">
                <div
                  aria-hidden
                  className="product-stage-glow absolute -inset-4 -z-10 rounded-[2.25rem] sm:-inset-6"
                />
                <Image
                  src={product.images.hero}
                  alt={`${brandedModel(product.name)} electric scooter`}
                  width={1200}
                  height={900}
                  priority
                  sizes="(min-width: 1024px) 50vw, 92vw"
                  className="bg-surface-muted ring-foreground/8 aspect-4/3 w-full rounded-3xl object-cover ring-1"
                />
              </div>
            ) : (
              <MediaPlaceholder
                label={`${brandedModel(product.name)} — hero visual`}
                className="rounded-3xl"
              />
            )}
          </div>

          <div>
            <Badge
              variant={variant.availability === "available" ? "secondary" : "outline"}
            >
              {availabilityLabel[variant.availability]}
            </Badge>

            <p className="text-eyebrow text-brand-700 dark:text-brand-400 mt-5 uppercase">
              {VEHICLE_BRAND}
            </p>
            <h1 className="text-display-xl mt-2">{brandedModel(product.name)}</h1>
            <p className="text-muted-foreground mt-4 text-lead text-pretty">
              {product.tagline}
            </p>

            <VariantSelector />

            <div className="border-hairline mt-8 border-t pt-8">
              <p className="text-muted-foreground text-xs">Starting at</p>
              <p className="font-display mt-1 text-display-md font-semibold">
                {formatPrice(variant.price)}
              </p>
              <p className="text-muted-foreground mt-1.5 text-xs">
                {variant.price != null
                  ? "Ex-showroom. On-road price varies by city."
                  : "Price on request — tell us your city and we will send the current on-road price."}
              </p>
            </div>

            <dl className="border-hairline mt-8 grid grid-cols-2 gap-6 border-t pt-8 sm:grid-cols-4">
              {keySpecs.map((spec) => (
                <div key={spec.label}>
                  <dt className="text-muted-foreground flex items-center gap-1.5 text-[0.6875rem]">
                    <spec.icon aria-hidden className="size-3.5" />
                    {spec.label}
                  </dt>
                  <dd className="font-display mt-1.5 text-base font-semibold">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <TestRideModal
                products={catalogue}
                defaultModel={product.slug}
                defaultVariant={variant.id}
              >
                <Button variant="brand" size="xl" className="sm:flex-1">
                  Book a Test Ride
                </Button>
              </TestRideModal>
              <Button asChild variant="outline" size="xl" className="sm:flex-1">
                <Link
                  href={`/on-road-price?model=${product.slug}&variant=${variant.id}`}
                >
                  <IndianRupee aria-hidden />
                  Get On-Road Price
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
