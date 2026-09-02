import { describe, expect, it } from "vitest";

import { calculateEvSavings } from "@/lib/calculators/ev-savings";

const commuter = {
  dailyDistanceKm: 40,
  petrolPricePerLitre: 106.5,
  petrolMileageKmpl: 45,
  electricityCostPerKwh: 8,
  evEfficiencyKmPerKwh: 55,
};

describe("calculateEvSavings", () => {
  it("compares a month of petrol against a month of charging", () => {
    const result = calculateEvSavings(commuter);

    expect(result.monthlyDistanceKm).toBe(1200);
    expect(result.monthlyPetrolCost).toBeCloseTo(2840, 4);
    expect(result.monthlyEvCost).toBeCloseTo(174.5455, 4);
    expect(result.monthlySaving).toBeCloseTo(2665.4545, 4);
    expect(result.annualSaving).toBeCloseTo(31_985.4545, 4);
    expect(result.savingRatio).toBeCloseTo(0.9385, 4);
  });

  it("annualises exactly twelve months of saving", () => {
    const result = calculateEvSavings(commuter);
    expect(result.annualSaving).toBeCloseTo(result.monthlySaving * 12, 6);
  });

  it("reports a negative saving rather than hiding it when petrol is cheaper", () => {
    const result = calculateEvSavings({
      ...commuter,
      petrolPricePerLitre: 20,
      electricityCostPerKwh: 40,
      evEfficiencyKmPerKwh: 10,
    });

    expect(result.monthlySaving).toBeLessThan(0);
    expect(result.savingRatio).toBeLessThan(0);
  });

  it("does not divide by zero when mileage or efficiency is missing", () => {
    const result = calculateEvSavings({
      ...commuter,
      petrolMileageKmpl: 0,
      evEfficiencyKmPerKwh: 0,
    });

    expect(result.monthlyPetrolCost).toBe(0);
    expect(result.monthlyEvCost).toBe(0);
    expect(result.monthlySaving).toBe(0);
    // A ratio of a zero bill is zero, not NaN — it reaches a progress bar.
    expect(result.savingRatio).toBe(0);
  });

  it("treats negative and non-finite manual entry as zero", () => {
    const result = calculateEvSavings({
      dailyDistanceKm: -40,
      petrolPricePerLitre: Number.NaN,
      petrolMileageKmpl: -45,
      electricityCostPerKwh: Number.POSITIVE_INFINITY,
      evEfficiencyKmPerKwh: 55,
    });

    expect(result.monthlyDistanceKm).toBe(0);
    expect(result.monthlyPetrolCost).toBe(0);
    expect(result.monthlyEvCost).toBe(0);
    expect(result.savingRatio).toBe(0);
  });

  it("scales the saving with distance ridden", () => {
    const near = calculateEvSavings({ ...commuter, dailyDistanceKm: 20 });
    const far = calculateEvSavings({ ...commuter, dailyDistanceKm: 60 });

    expect(far.monthlySaving).toBeCloseTo(near.monthlySaving * 3, 6);
    // The proportion saved is a property of the vehicles, not the distance.
    expect(far.savingRatio).toBeCloseTo(near.savingRatio, 10);
  });
});
