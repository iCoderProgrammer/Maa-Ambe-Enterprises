"use client";

import * as React from "react";
import { BatteryCharging, Info, TrendingDown, Wallet, Zap } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field, SelectControl } from "@/components/forms/field";
import { cn } from "@/lib/utils";
import { formatRupees } from "@/lib/format";
import { calculateBaas } from "@/lib/calculators/baas";
import { resolveSpecs, getVariant } from "@/lib/product-utils";
import {
  baasComparisonWindows,
  baasDefaults,
  baasLimits,
  BAAS_DISCLAIMER,
  evSavingsDefaults,
} from "@/data/calculators";
import type { Product } from "@/types/product";

/**
 * BaaS ownership calculator.
 *
 * Seeds itself from product data whenever a model has confirmed BaaS terms, and
 * falls back to clearly-labelled illustrative figures otherwise. All arithmetic
 * lives in `lib/calculators/baas.ts`; this component only collects input and
 * presents the result.
 *
 * The result is framed as a comparison over a window, never as a guaranteed
 * saving — because whether BaaS is cheaper depends entirely on how long the
 * customer keeps the scooter.
 */
export function BaasCalculator({ products }: { products: Product[] }) {
  const [slug, setSlug] = React.useState(products[0]?.slug ?? "");

  const product = products.find((item) => item.slug === slug) ?? products[0];
  const variant = product ? getVariant(product) : undefined;
  const specs = product ? resolveSpecs(product, variant?.id) : undefined;

  // Confirmed figures from product data win; illustrative defaults fill the gaps.
  const seeded = React.useMemo(
    () => ({
      vehiclePrice: variant?.price ?? baasDefaults.vehiclePrice,
      baasVehiclePrice: variant?.baas?.vehiclePrice ?? baasDefaults.baasVehiclePrice,
      monthlySubscription:
        variant?.baas?.monthlySubscription ?? baasDefaults.monthlySubscription,
    }),
    [variant]
  );

  const [vehiclePrice, setVehiclePrice] = React.useState<number>(seeded.vehiclePrice);
  const [baasVehiclePrice, setBaasVehiclePrice] = React.useState<number>(
    seeded.baasVehiclePrice
  );
  const [monthlySubscription, setMonthlySubscription] = React.useState<number>(
    seeded.monthlySubscription
  );
  const [monthlyDistanceKm, setMonthlyDistanceKm] = React.useState<number>(
    baasDefaults.monthlyDistanceKm
  );
  const [electricityCostPerKwh, setElectricityCostPerKwh] = React.useState<number>(
    baasDefaults.electricityCostPerKwh
  );
  const [comparisonMonths, setComparisonMonths] = React.useState<number>(
    baasDefaults.comparisonMonths
  );

  // Re-seed the money fields when the visitor picks a different model.
  const [seedKey, setSeedKey] = React.useState(slug);
  if (seedKey !== slug) {
    setSeedKey(slug);
    setVehiclePrice(seeded.vehiclePrice);
    setBaasVehiclePrice(seeded.baasVehiclePrice);
    setMonthlySubscription(seeded.monthlySubscription);
  }

  const efficiency =
    specs?.range.claimedKm != null && specs.batteryCapacityKwh
      ? specs.range.claimedKm / specs.batteryCapacityKwh
      : evSavingsDefaults.evEfficiencyKmPerKwh;

  const efficiencyIsConfirmed =
    specs?.range.claimedKm != null && specs.batteryCapacityKwh != null;

  const result = React.useMemo(
    () =>
      calculateBaas({
        vehiclePrice,
        baasVehiclePrice,
        monthlySubscription,
        comparisonMonths,
        monthlyDistanceKm,
        electricityCostPerKwh,
        evEfficiencyKmPerKwh: efficiency,
      }),
    [
      vehiclePrice,
      baasVehiclePrice,
      monthlySubscription,
      comparisonMonths,
      monthlyDistanceKm,
      electricityCostPerKwh,
      efficiency,
    ]
  );

  const usingIllustrativeFigures = variant?.baas == null;

  const numeric =
    (setter: (value: number) => void) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const next = Number(event.target.value);
      setter(Number.isFinite(next) ? next : 0);
    };

  const money = [
    {
      id: "vehiclePrice",
      label: "Vehicle price with battery",
      hint: "What the scooter costs bought outright",
      value: vehiclePrice,
      set: setVehiclePrice,
      limits: baasLimits.vehiclePrice,
    },
    {
      id: "baasVehiclePrice",
      label: "Vehicle price without battery",
      hint: "What you pay upfront under BaaS",
      value: baasVehiclePrice,
      set: setBaasVehiclePrice,
      limits: baasLimits.baasVehiclePrice,
    },
    {
      id: "monthlySubscription",
      label: "Monthly battery subscription",
      hint: "Charged every month for the term",
      value: monthlySubscription,
      set: setMonthlySubscription,
      limits: baasLimits.monthlySubscription,
    },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
      <div className="border-hairline bg-background rounded-2xl border p-6 sm:p-8">
        <h3 className="font-display text-base font-semibold">Your figures</h3>
        <p className="text-muted-foreground mt-1 text-xs">
          {usingIllustrativeFigures
            ? "Starting values are illustrative, not quoted prices. Replace them with the figures from your quote."
            : "Seeded from this model's confirmed Battery-as-a-Service terms."}
        </p>

        <div className="mt-6 space-y-5">
          <Field label="Model">
            {(props) => (
              <SelectControl
                {...props}
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
              >
                {products.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </SelectControl>
            )}
          </Field>

          {money.map((row) => (
            <div key={row.id}>
              <Label htmlFor={`baas-${row.id}`} className="text-sm font-medium">
                {row.label}
              </Label>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-muted-foreground text-sm">₹</span>
                <Input
                  id={`baas-${row.id}`}
                  type="number"
                  inputMode="numeric"
                  min={row.limits.min}
                  max={row.limits.max}
                  step={row.limits.step}
                  value={row.value}
                  onChange={numeric(row.set)}
                  aria-describedby={`baas-${row.id}-hint`}
                />
              </div>
              <p id={`baas-${row.id}-hint`} className="text-muted-foreground mt-1.5 text-xs">
                {row.hint}
              </p>
            </div>
          ))}

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="baas-distance" className="text-sm font-medium">
                Monthly distance
              </Label>
              <div className="mt-2 flex items-center gap-2">
                <Input
                  id="baas-distance"
                  type="number"
                  inputMode="numeric"
                  min={baasLimits.monthlyDistanceKm.min}
                  max={baasLimits.monthlyDistanceKm.max}
                  step={baasLimits.monthlyDistanceKm.step}
                  value={monthlyDistanceKm}
                  onChange={numeric(setMonthlyDistanceKm)}
                />
                <span className="text-muted-foreground text-xs whitespace-nowrap">km</span>
              </div>
            </div>

            <div>
              <Label htmlFor="baas-tariff" className="text-sm font-medium">
                Electricity cost
              </Label>
              <div className="mt-2 flex items-center gap-2">
                <Input
                  id="baas-tariff"
                  type="number"
                  inputMode="decimal"
                  min={baasLimits.electricityCostPerKwh.min}
                  max={baasLimits.electricityCostPerKwh.max}
                  step={baasLimits.electricityCostPerKwh.step}
                  value={electricityCostPerKwh}
                  onChange={numeric(setElectricityCostPerKwh)}
                />
                <span className="text-muted-foreground text-xs whitespace-nowrap">₹/kWh</span>
              </div>
            </div>
          </div>

          <fieldset>
            <legend className="text-sm font-medium">Compare over</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {baasComparisonWindows.map((months) => {
                const isSelected = months === comparisonMonths;
                return (
                  <label
                    key={months}
                    className={cn(
                      "cursor-pointer rounded-lg border px-3.5 py-2 text-sm transition-colors",
                      isSelected
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground/30"
                    )}
                  >
                    <input
                      type="radio"
                      name="baas-window"
                      value={months}
                      checked={isSelected}
                      onChange={() => setComparisonMonths(months)}
                      className="sr-only-focusable absolute"
                    />
                    {months} mo
                  </label>
                );
              })}
            </div>
          </fieldset>

          <p className="text-muted-foreground text-xs">
            Charging is estimated at {efficiency.toFixed(0)} km per kWh
            {efficiencyIsConfirmed
              ? ` for the ${product?.name}.`
              : " — a typical figure, since this model's efficiency is not confirmed yet."}
          </p>
        </div>
      </div>

      <div
        className="bg-surface-inverse text-on-inverse flex flex-col rounded-2xl p-6 sm:p-8"
        aria-live="polite"
      >
        <h3 className="font-display text-base font-semibold">
          Over {comparisonMonths} months
        </h3>

        <div className="mt-6">
          <p className="text-brand-400 flex items-center gap-2 text-sm font-medium">
            <Wallet aria-hidden className="size-4" />
            Less to pay upfront
          </p>
          <p className="font-display text-brand-400 mt-1.5 text-display-lg font-semibold">
            {formatRupees(Math.max(0, result.upfrontSaving))}
          </p>
        </div>

        <dl className="mt-8 space-y-4 border-t border-white/12 pt-8">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-on-inverse-muted flex items-center gap-2 text-sm">
              <BatteryCharging aria-hidden className="size-4" />
              Battery subscription
            </dt>
            <dd className="font-display text-base font-semibold">
              {formatRupees(monthlySubscription)}
              <span className="text-on-inverse-muted text-xs font-normal"> / mo</span>
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-on-inverse-muted flex items-center gap-2 text-sm">
              <Zap aria-hidden className="size-4" />
              Charging
            </dt>
            <dd className="font-display text-base font-semibold">
              {formatRupees(result.monthlyEnergyCost)}
              <span className="text-on-inverse-muted text-xs font-normal"> / mo</span>
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 border-t border-white/12 pt-4">
            <dt className="text-on-inverse-muted text-sm">
              Estimated monthly battery cost
            </dt>
            <dd className="font-display text-base font-semibold">
              {formatRupees(result.monthlyBatteryCost)}
            </dd>
          </div>
        </dl>

        <dl className="mt-8 space-y-4 border-t border-white/12 pt-8">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-on-inverse-muted text-sm">Buying outright</dt>
            <dd className="font-display text-base font-semibold">
              {formatRupees(result.outrightTotal)}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-on-inverse-muted text-sm">With Battery-as-a-Service</dt>
            <dd className="font-display text-base font-semibold">
              {formatRupees(result.baasTotal)}
            </dd>
          </div>
        </dl>

        <div className="mt-8 rounded-xl bg-white/8 p-5">
          <p className="flex items-start gap-2.5 text-sm">
            <TrendingDown aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-400" />
            <span className="text-pretty">
              {result.breakEvenMonths == null ? (
                "Enter a subscription and an upfront difference to see where the two options cross over."
              ) : (
                <>
                  The subscriptions match your upfront saving at around{" "}
                  <strong className="font-semibold">
                    {Math.round(result.breakEvenMonths)} months
                  </strong>
                  . Keep the scooter longer than that and buying outright works out
                  cheaper; sell or upgrade sooner and BaaS does.
                </>
              )}
            </span>
          </p>
        </div>

        <p className="text-on-inverse-muted/80 mt-auto flex gap-2 pt-8 text-[0.6875rem] leading-relaxed">
          <Info aria-hidden className="mt-0.5 size-3.5 shrink-0" />
          {BAAS_DISCLAIMER}
        </p>
      </div>
    </div>
  );
}
