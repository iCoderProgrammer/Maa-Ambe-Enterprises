"use client";

import Link from "next/link";
import { ArrowRight, BatteryCharging } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatRupees } from "@/lib/format";
import { BAAS_DISCLAIMER } from "@/data/calculators";
import { useProduct } from "@/components/product/product-provider";

/**
 * Battery-as-a-Service terms for the selected variant.
 *
 * Renders nothing when the chosen variant is not offered on BaaS — the section
 * disappears rather than showing an option the customer cannot actually take.
 */
export function ProductBaas() {
  const { product, variant, baas } = useProduct();

  if (!baas) return null;

  const upfrontSaving =
    variant.price != null && baas.vehiclePrice != null
      ? variant.price - baas.vehiclePrice
      : null;

  return (
    <div className="bg-surface-inverse text-on-inverse rounded-2xl p-7 sm:p-10">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <span
            aria-hidden
            className="bg-brand text-brand-foreground inline-flex size-11 items-center justify-center rounded-xl"
          >
            <BatteryCharging className="size-5" />
          </span>
          <h2 className="text-display-md mt-6">
            Available on Battery-as-a-Service
          </h2>
          <p className="text-on-inverse-muted mt-4 text-pretty">
            Buy the {product.name} {variant.name} without the battery and pay a monthly
            subscription for it instead. Less to pay on the day you ride away.
          </p>
          <Button asChild variant="brand" size="lg" className="mt-8">
            <Link href="/battery-as-a-service">
              How BaaS works
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>

        <dl className="grid gap-px overflow-hidden rounded-xl bg-white/12 sm:grid-cols-2">
          {baas.vehiclePrice != null ? (
            <div className="bg-surface-inverse p-6">
              <dt className="text-on-inverse-muted text-xs">Vehicle price without battery</dt>
              <dd className="font-display mt-1.5 text-display-sm font-semibold">
                {formatRupees(baas.vehiclePrice)}
              </dd>
            </div>
          ) : null}

          {baas.monthlySubscription != null ? (
            <div className="bg-surface-inverse p-6">
              <dt className="text-on-inverse-muted text-xs">Battery subscription</dt>
              <dd className="font-display text-brand-400 mt-1.5 text-display-sm font-semibold">
                {formatRupees(baas.monthlySubscription)}
                <span className="text-on-inverse-muted text-sm font-normal"> / month</span>
              </dd>
            </div>
          ) : null}

          {upfrontSaving != null && upfrontSaving > 0 ? (
            <div className="bg-surface-inverse p-6">
              <dt className="text-on-inverse-muted text-xs">Less to pay upfront</dt>
              <dd className="font-display mt-1.5 text-display-sm font-semibold">
                {formatRupees(upfrontSaving)}
              </dd>
            </div>
          ) : null}

          {baas.minimumTermMonths != null ? (
            <div className="bg-surface-inverse p-6">
              <dt className="text-on-inverse-muted text-xs">Minimum term</dt>
              <dd className="font-display mt-1.5 text-display-sm font-semibold">
                {baas.minimumTermMonths} months
              </dd>
            </div>
          ) : null}
        </dl>
      </div>

      <p className="text-on-inverse-muted/80 mt-8 text-[0.6875rem] leading-relaxed">
        {BAAS_DISCLAIMER}
      </p>
    </div>
  );
}
