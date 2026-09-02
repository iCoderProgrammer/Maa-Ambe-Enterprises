"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, BatteryCharging, Info, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { formatRupees } from "@/lib/format";
import { calculateBaas } from "@/lib/calculators/baas";
import { baasDefaults, BAAS_DISCLAIMER } from "@/data/calculators";

const points = [
  {
    title: "Lower upfront cost",
    description:
      "You buy the scooter without the battery, so the amount you pay on day one is smaller.",
  },
  {
    title: "Monthly battery subscription",
    description:
      "Instead of owning the battery, you pay a fixed monthly fee to use it.",
  },
  {
    title: "The battery stays supported",
    description:
      "Because the battery is not yours outright, its health remains the provider's responsibility for the term of the subscription.",
  },
];

const fields = [
  { key: "vehiclePrice", label: "Full purchase price", hint: "Scooter with battery" },
  { key: "baasVehiclePrice", label: "BaaS vehicle price", hint: "Scooter without battery" },
  {
    key: "monthlySubscription",
    label: "Monthly battery subscription",
    hint: "Charged every month",
  },
] as const;

/**
 * Homepage BaaS teaser with a simple ownership comparison.
 *
 * Defaults are illustrative starting points from `data/calculators.ts`, not
 * quoted prices — Phase 8 wires real per-model BaaS terms from product data
 * into the full calculator on /battery-as-a-service.
 */
export function BaasPreview() {
  const [values, setValues] = React.useState({
    vehiclePrice: baasDefaults.vehiclePrice,
    baasVehiclePrice: baasDefaults.baasVehiclePrice,
    monthlySubscription: baasDefaults.monthlySubscription,
  });

  const result = React.useMemo(
    () => calculateBaas({ ...values, comparisonMonths: baasDefaults.comparisonMonths }),
    [values]
  );

  const handleChange =
    (key: (typeof fields)[number]["key"]) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const next = Number(event.target.value);
      setValues((current) => ({ ...current, [key]: Number.isFinite(next) ? next : 0 }));
    };

  return (
    <Section id="baas">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Battery-as-a-Service"
            title="Pay less upfront. Subscribe to the battery."
            description="The battery is the most expensive part of an electric scooter. Battery-as-a-Service lets you leave it off the purchase price and pay a monthly fee instead."
          />

          <ul className="mt-9 space-y-6">
            {points.map((point) => (
              <li key={point.title} className="flex gap-4">
                <span
                  aria-hidden
                  className="bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-400 mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg"
                >
                  <BatteryCharging className="size-4.5" />
                </span>
                <div>
                  <h3 className="font-display text-sm font-semibold">{point.title}</h3>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed text-pretty">
                    {point.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <Button asChild size="lg" className="mt-9">
            <Link href="/battery-as-a-service">
              How BaaS works
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>

        <div className="border-hairline bg-surface-muted rounded-2xl border p-6 sm:p-8">
          <h3 className="font-display text-base font-semibold">Try the numbers</h3>
          <p className="text-muted-foreground mt-1 text-xs">
            Starting values are illustrative. Replace them with figures from your quote.
          </p>

          <div className="mt-6 space-y-4">
            {fields.map((field) => {
              const id = `baas-${field.key}`;
              return (
                <div key={field.key}>
                  <Label htmlFor={id} className="text-sm font-medium">
                    {field.label}
                  </Label>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">₹</span>
                    <Input
                      id={id}
                      type="number"
                      inputMode="numeric"
                      min={0}
                      step={500}
                      value={values[field.key]}
                      onChange={handleChange(field.key)}
                      aria-describedby={`${id}-hint`}
                    />
                  </div>
                  <p id={`${id}-hint`} className="text-muted-foreground mt-1.5 text-xs">
                    {field.hint}
                  </p>
                </div>
              );
            })}
          </div>

          <dl
            className="border-hairline mt-7 space-y-4 border-t pt-7"
            aria-live="polite"
          >
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-muted-foreground flex items-center gap-2 text-sm">
                <Wallet aria-hidden className="size-4" />
                You pay upfront
              </dt>
              <dd className="font-display text-brand-700 dark:text-brand-400 text-display-sm font-semibold">
                {formatRupees(Math.max(0, result.upfrontSaving))} less
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-muted-foreground text-sm">
                Subscription over {baasDefaults.comparisonMonths} months
              </dt>
              <dd className="font-display text-base font-semibold">
                {formatRupees(result.totalSubscription)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-muted-foreground text-sm">
                Total after {baasDefaults.comparisonMonths} months
              </dt>
              <dd className="font-display text-base font-semibold">
                {formatRupees(result.baasTotal)}{" "}
                <span className="text-muted-foreground text-xs font-normal">
                  vs {formatRupees(result.outrightTotal)} outright
                </span>
              </dd>
            </div>
          </dl>

          <p className="text-muted-foreground mt-6 flex gap-2 text-[0.6875rem] leading-relaxed">
            <Info aria-hidden className="mt-0.5 size-3.5 shrink-0" />
            {BAAS_DISCLAIMER}
          </p>
        </div>
      </div>
    </Section>
  );
}
