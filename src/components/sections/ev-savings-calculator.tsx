"use client";

import * as React from "react";
import { Fuel, Info, TrendingDown, Zap } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { formatNumber, formatRupees } from "@/lib/format";
import { calculateEvSavings } from "@/lib/calculators/ev-savings";
import {
  CALCULATOR_DISCLAIMER,
  evSavingsDefaults,
  evSavingsLimits,
} from "@/data/calculators";

type FieldKey = keyof typeof evSavingsDefaults;

const fields: {
  key: FieldKey;
  label: string;
  unit: string;
  hint: string;
}[] = [
  {
    key: "dailyDistanceKm",
    label: "Daily distance",
    unit: "km / day",
    hint: "How far you ride on a typical day",
  },
  {
    key: "petrolPricePerLitre",
    label: "Petrol price",
    unit: "₹ / litre",
    hint: "Current pump price in your city",
  },
  {
    key: "petrolMileageKmpl",
    label: "Petrol scooter mileage",
    unit: "km / litre",
    hint: "What your petrol scooter returns",
  },
  {
    key: "electricityCostPerKwh",
    label: "Electricity cost",
    unit: "₹ / kWh",
    hint: "From your domestic electricity bill",
  },
  {
    key: "evEfficiencyKmPerKwh",
    label: "EV efficiency",
    unit: "km / kWh",
    hint: "Distance an electric scooter covers per unit",
  },
];

/**
 * Petrol vs electric running-cost comparison.
 *
 * The arithmetic lives in `lib/calculators/ev-savings.ts`; this component only
 * collects input and presents the result. Every output is labelled an estimate.
 */
export function EvSavingsCalculator() {
  const [values, setValues] = React.useState<Record<FieldKey, number>>({
    ...evSavingsDefaults,
  });

  const result = React.useMemo(() => calculateEvSavings(values), [values]);

  const handleChange = (key: FieldKey) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value);
    setValues((current) => ({
      ...current,
      [key]: Number.isFinite(next) ? next : 0,
    }));
  };

  const savingPercent = Math.max(0, Math.round(result.savingRatio * 100));

  return (
    <Section id="savings" tone="muted">
      <SectionHeading
        eyebrow="Running costs"
        title="See what you could save"
        description="Enter how you ride today and compare a month of petrol against a month of charging. Change any number — the estimate updates instantly."
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
        <div className="bg-background border-hairline rounded-2xl border p-6 sm:p-8">
          <h3 className="font-display text-base font-semibold">Your riding</h3>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {fields.map((field) => {
              const limits = evSavingsLimits[field.key];
              const id = `savings-${field.key}`;

              return (
                <div key={field.key} className="min-w-0">
                  <Label htmlFor={id} className="text-sm font-medium">
                    {field.label}
                  </Label>
                  <div className="mt-2 flex items-center gap-2">
                    <Input
                      id={id}
                      type="number"
                      inputMode="decimal"
                      value={values[field.key]}
                      min={limits.min}
                      max={limits.max}
                      step={limits.step}
                      onChange={handleChange(field.key)}
                      aria-describedby={`${id}-hint`}
                      className="max-w-32"
                    />
                    <span className="text-muted-foreground text-xs whitespace-nowrap">
                      {field.unit}
                    </span>
                  </div>
                  <p id={`${id}-hint`} className="text-muted-foreground mt-1.5 text-xs">
                    {field.hint}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="bg-surface-inverse text-on-inverse flex flex-col rounded-2xl p-6 sm:p-8"
          aria-live="polite"
        >
          <h3 className="font-display text-base font-semibold">
            Estimated monthly comparison
          </h3>
          <p className="text-on-inverse-muted mt-1 text-xs">
            Based on {formatNumber(result.monthlyDistanceKm)} km a month.
          </p>

          <dl className="mt-7 space-y-5">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-on-inverse-muted flex items-center gap-2 text-sm">
                <Fuel aria-hidden className="size-4" />
                Petrol scooter
              </dt>
              <dd className="font-display text-lg font-semibold">
                {formatRupees(result.monthlyPetrolCost)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-on-inverse-muted flex items-center gap-2 text-sm">
                <Zap aria-hidden className="size-4" />
                Electric scooter
              </dt>
              <dd className="font-display text-lg font-semibold">
                {formatRupees(result.monthlyEvCost)}
              </dd>
            </div>
          </dl>

          <div className="mt-7 border-t border-white/12 pt-7">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-brand-400 flex items-center gap-2 text-sm font-medium">
                <TrendingDown aria-hidden className="size-4" />
                Monthly saving
              </p>
              <p className="text-brand-400 font-display text-display-sm font-semibold">
                {formatRupees(Math.max(0, result.monthlySaving))}
              </p>
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-4">
              <p className="text-on-inverse-muted text-sm">Over a year</p>
              <p className="font-display text-lg font-semibold">
                {formatRupees(Math.max(0, result.annualSaving))}
              </p>
            </div>
            {result.monthlySaving > 0 ? (
              <p className="text-on-inverse-muted mt-4 text-xs">
                That is about {savingPercent}% off your current fuel bill.
              </p>
            ) : (
              <p className="text-on-inverse-muted mt-4 text-xs">
                With these figures, electric does not work out cheaper. Try adjusting
                your electricity rate or daily distance.
              </p>
            )}
          </div>

          <p className="text-on-inverse-muted/80 mt-auto flex gap-2 pt-8 text-[0.6875rem] leading-relaxed">
            <Info aria-hidden className="mt-0.5 size-3.5 shrink-0" />
            {CALCULATOR_DISCLAIMER}
          </p>
        </div>
      </div>
    </Section>
  );
}
