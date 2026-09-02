"use client";

import * as React from "react";
import { Info, Percent, Wallet } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { formatRupees } from "@/lib/format";
import { calculateEmi, downPaymentPercent } from "@/lib/calculators/emi";
import {
  EMI_DISCLAIMER,
  financeDefaults,
  financeLimits,
  financeTenures,
} from "@/data/calculators";

/**
 * EMI estimator.
 *
 * All arithmetic lives in `lib/calculators/emi.ts`; this component only collects
 * input and presents the result. Results are labelled estimates throughout —
 * the real offer comes from the lender.
 */
export function FinanceCalculator({
  /** Seeded from a confirmed model price when one exists. */
  initialVehiclePrice,
  modelLabel,
  className,
}: {
  initialVehiclePrice?: number | null;
  modelLabel?: string;
  className?: string;
}) {
  // Explicit `number` generics: `financeDefaults` is `as const`, so the
  // literal types would otherwise narrow the state to a single value.
  const [vehiclePrice, setVehiclePrice] = React.useState<number>(
    initialVehiclePrice ?? financeDefaults.vehiclePrice
  );
  const [downPayment, setDownPayment] = React.useState<number>(
    financeDefaults.downPayment
  );
  const [annualInterestRate, setAnnualInterestRate] = React.useState<number>(
    financeDefaults.annualInterestRate
  );
  const [tenureMonths, setTenureMonths] = React.useState<number>(
    financeDefaults.tenureMonths
  );

  const result = React.useMemo(
    () => calculateEmi({ vehiclePrice, downPayment, annualInterestRate, tenureMonths }),
    [vehiclePrice, downPayment, annualInterestRate, tenureMonths]
  );

  const numeric =
    (setter: (value: number) => void) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const next = Number(event.target.value);
      setter(Number.isFinite(next) ? next : 0);
    };

  const percentDown = downPaymentPercent(vehiclePrice, downPayment);
  const overpaying = downPayment > vehiclePrice;

  return (
    <div className={cn("grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10", className)}>
      <div className="border-hairline bg-background rounded-2xl border p-6 sm:p-8">
        <h3 className="font-display text-base font-semibold">Your loan</h3>
        <p className="text-muted-foreground mt-1 text-xs">
          {initialVehiclePrice != null && modelLabel
            ? `Starting from the ${modelLabel} price. Adjust anything you like.`
            : "Enter the price you have been quoted, then adjust the rest."}
        </p>

        <div className="mt-6 space-y-5">
          <div>
            <Label htmlFor="fc-price" className="text-sm font-medium">
              Vehicle price
            </Label>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-muted-foreground text-sm">₹</span>
              <Input
                id="fc-price"
                type="number"
                inputMode="numeric"
                min={financeLimits.vehiclePrice.min}
                max={financeLimits.vehiclePrice.max}
                step={financeLimits.vehiclePrice.step}
                value={vehiclePrice}
                onChange={numeric(setVehiclePrice)}
                aria-describedby="fc-price-hint"
              />
            </div>
            <p id="fc-price-hint" className="text-muted-foreground mt-1.5 text-xs">
              Use your on-road price for the most accurate estimate.
            </p>
          </div>

          <div>
            <Label htmlFor="fc-down" className="text-sm font-medium">
              Down payment
            </Label>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-muted-foreground text-sm">₹</span>
              <Input
                id="fc-down"
                type="number"
                inputMode="numeric"
                min={financeLimits.downPayment.min}
                max={vehiclePrice}
                step={financeLimits.downPayment.step}
                value={downPayment}
                onChange={numeric(setDownPayment)}
                aria-describedby="fc-down-hint"
                aria-invalid={overpaying || undefined}
              />
            </div>
            <p id="fc-down-hint" className="text-muted-foreground mt-1.5 text-xs">
              {overpaying
                ? "That is more than the vehicle price — nothing left to finance."
                : `${percentDown}% of the vehicle price`}
            </p>
          </div>

          <div>
            <Label htmlFor="fc-rate" className="text-sm font-medium">
              Interest rate
            </Label>
            <div className="mt-2 flex items-center gap-2">
              <Input
                id="fc-rate"
                type="number"
                inputMode="decimal"
                min={financeLimits.annualInterestRate.min}
                max={financeLimits.annualInterestRate.max}
                step={financeLimits.annualInterestRate.step}
                value={annualInterestRate}
                onChange={numeric(setAnnualInterestRate)}
                aria-describedby="fc-rate-hint"
                className="max-w-32"
              />
              <span className="text-muted-foreground flex items-center gap-1 text-xs">
                <Percent aria-hidden className="size-3.5" />
                per year
              </span>
            </div>
            <p id="fc-rate-hint" className="text-muted-foreground mt-1.5 text-xs">
              Your lender sets this based on your profile.
            </p>
          </div>

          <fieldset>
            <legend className="text-sm font-medium">Loan tenure</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {financeTenures.map((months) => {
                const isSelected = months === tenureMonths;
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
                      name="tenure"
                      value={months}
                      checked={isSelected}
                      onChange={() => setTenureMonths(months)}
                      className="sr-only-focusable absolute"
                    />
                    {months} mo
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>
      </div>

      <div
        className="bg-surface-inverse text-on-inverse flex flex-col rounded-2xl p-6 sm:p-8"
        aria-live="polite"
      >
        <h3 className="font-display text-base font-semibold">Estimated EMI</h3>

        <p className="font-display text-brand-400 mt-4 text-display-lg font-semibold">
          {formatRupees(result.emi)}
          <span className="text-on-inverse-muted text-base font-normal"> / month</span>
        </p>
        <p className="text-on-inverse-muted mt-1.5 text-xs">
          for {tenureMonths} months at {annualInterestRate}% per year
        </p>

        <dl className="mt-8 space-y-4 border-t border-white/12 pt-8">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-on-inverse-muted flex items-center gap-2 text-sm">
              <Wallet aria-hidden className="size-4" />
              Loan amount
            </dt>
            <dd className="font-display text-base font-semibold">
              {formatRupees(result.loanAmount)}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-on-inverse-muted text-sm">Total interest</dt>
            <dd className="font-display text-base font-semibold">
              {formatRupees(result.totalInterest)}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-on-inverse-muted text-sm">Total payable</dt>
            <dd className="font-display text-base font-semibold">
              {formatRupees(result.totalPayable)}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 border-t border-white/12 pt-4">
            <dt className="text-on-inverse-muted text-sm">
              Total cost including down payment
            </dt>
            <dd className="font-display text-base font-semibold">
              {formatRupees(result.totalCost)}
            </dd>
          </div>
        </dl>

        {result.totalPayable > 0 ? (
          <div className="mt-8">
            <div
              className="flex h-2 overflow-hidden rounded-full bg-white/12"
              role="img"
              aria-label={`Of the total payable, ${Math.round(
                (1 - result.interestShare) * 100
              )}% is principal and ${Math.round(result.interestShare * 100)}% is interest.`}
            >
              <span
                className="bg-brand-400 h-full"
                style={{ width: `${(1 - result.interestShare) * 100}%` }}
              />
              <span
                className="h-full bg-white/35"
                style={{ width: `${result.interestShare * 100}%` }}
              />
            </div>
            <p className="text-on-inverse-muted mt-3 flex justify-between text-xs">
              <span>Principal</span>
              <span>Interest {Math.round(result.interestShare * 100)}%</span>
            </p>
          </div>
        ) : null}

        <p className="text-on-inverse-muted/80 mt-auto flex gap-2 pt-8 text-[0.6875rem] leading-relaxed">
          <Info aria-hidden className="mt-0.5 size-3.5 shrink-0" />
          {EMI_DISCLAIMER}
        </p>
      </div>
    </div>
  );
}
