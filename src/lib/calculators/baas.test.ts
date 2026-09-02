import { describe, expect, it } from "vitest";

import { annualise, calculateBaas, monthlyDistanceFromDaily } from "@/lib/calculators/baas";

const plan = {
  vehiclePrice: 100_000,
  baasVehiclePrice: 65_000,
  monthlySubscription: 1500,
  comparisonMonths: 24,
};

const energy = {
  monthlyDistanceKm: 1200,
  electricityCostPerKwh: 8,
  evEfficiencyKmPerKwh: 55,
};

describe("calculateBaas", () => {
  it("totals both ways of owning the same scooter", () => {
    const result = calculateBaas(plan);

    expect(result.upfrontSaving).toBe(35_000);
    expect(result.totalSubscription).toBe(36_000);
    expect(result.outrightTotal).toBe(100_000);
    expect(result.baasTotal).toBe(101_000);
    // Subscriptions have overtaken the upfront saving by month 24.
    expect(result.netDifference).toBe(-1000);
  });

  it("breaks even when the subscriptions have repaid the upfront saving", () => {
    const result = calculateBaas(plan);

    expect(result.breakEvenMonths).toBeCloseTo(35_000 / 1500, 10);

    const atBreakEven = calculateBaas({
      ...plan,
      comparisonMonths: Math.round(result.breakEvenMonths!),
    });
    // Within one month's subscription of level, by definition of the crossing.
    expect(Math.abs(atBreakEven.netDifference)).toBeLessThan(plan.monthlySubscription);
  });

  it("has no break-even point when there is nothing to recover", () => {
    expect(calculateBaas({ ...plan, monthlySubscription: 0 }).breakEvenMonths).toBeNull();
    // A BaaS price at or above the outright price saves nothing upfront.
    expect(calculateBaas({ ...plan, baasVehiclePrice: 100_000 }).breakEvenMonths).toBeNull();
  });

  it("reports a negative upfront saving rather than clamping it", () => {
    const result = calculateBaas({ ...plan, baasVehiclePrice: 110_000 });

    expect(result.upfrontSaving).toBe(-10_000);
    expect(result.baasTotal).toBeGreaterThan(result.outrightTotal);
  });

  it("charges the same energy to both options, so it never tips the comparison", () => {
    const withoutEnergy = calculateBaas(plan);
    const withEnergy = calculateBaas({ ...plan, ...energy });

    expect(withEnergy.totalEnergyCost).toBeGreaterThan(0);
    expect(withEnergy.outrightTotal).toBeGreaterThan(withoutEnergy.outrightTotal);
    expect(withEnergy.baasTotal).toBeGreaterThan(withoutEnergy.baasTotal);
    // The whole point: charging is a wash between the two.
    expect(withEnergy.netDifference).toBeCloseTo(withoutEnergy.netDifference, 6);
  });

  it("prices a month of charging from distance, tariff and efficiency", () => {
    const result = calculateBaas({ ...plan, ...energy });

    expect(result.monthlyEnergyCost).toBeCloseTo((1200 / 55) * 8, 6);
    expect(result.monthlyBatteryCost).toBeCloseTo(1500 + (1200 / 55) * 8, 6);
    expect(result.totalEnergyCost).toBeCloseTo(result.monthlyEnergyCost * 24, 6);
  });

  it("omits energy entirely when the inputs are absent", () => {
    const result = calculateBaas(plan);

    expect(result.monthlyEnergyCost).toBe(0);
    expect(result.totalEnergyCost).toBe(0);
    expect(result.monthlyBatteryCost).toBe(1500);
  });

  it("does not divide by zero when efficiency is missing", () => {
    const result = calculateBaas({ ...plan, ...energy, evEfficiencyKmPerKwh: 0 });

    expect(result.monthlyEnergyCost).toBe(0);
    expect(result.baasTotal).toBe(101_000);
  });

  it("compares over at least one month, whatever the window says", () => {
    const result = calculateBaas({ ...plan, comparisonMonths: 0 });

    expect(result.totalSubscription).toBe(1500);
  });

  it("treats negative and non-finite entries as absent", () => {
    const result = calculateBaas({
      vehiclePrice: Number.NaN,
      baasVehiclePrice: -65_000,
      monthlySubscription: Number.POSITIVE_INFINITY,
      comparisonMonths: -24,
      monthlyDistanceKm: -1200,
      electricityCostPerKwh: 8,
      evEfficiencyKmPerKwh: 55,
    });

    expect(result.upfrontSaving).toBe(0);
    expect(result.totalSubscription).toBe(0);
    expect(result.monthlyEnergyCost).toBe(0);
    expect(result.breakEvenMonths).toBeNull();
  });
});

describe("monthlyDistanceFromDaily", () => {
  it("bills a thirty-day month", () => {
    expect(monthlyDistanceFromDaily(40)).toBe(1200);
  });

  it("treats a negative or non-finite habit as no riding", () => {
    expect(monthlyDistanceFromDaily(-40)).toBe(0);
    expect(monthlyDistanceFromDaily(Number.NaN)).toBe(0);
  });
});

describe("annualise", () => {
  it("scales a monthly figure to twelve months", () => {
    expect(annualise(1500)).toBe(18_000);
  });
});
