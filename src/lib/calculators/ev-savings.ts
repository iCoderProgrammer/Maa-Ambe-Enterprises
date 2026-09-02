/**
 * Running-cost comparison between a petrol scooter and an electric scooter.
 * Pure functions — no React, no formatting, so they stay unit-testable and
 * reusable by any surface (homepage, model page, print).
 */

const DAYS_PER_MONTH = 30;
const MONTHS_PER_YEAR = 12;

export interface EvSavingsInput {
  dailyDistanceKm: number;
  petrolPricePerLitre: number;
  petrolMileageKmpl: number;
  electricityCostPerKwh: number;
  evEfficiencyKmPerKwh: number;
}

export interface EvSavingsResult {
  monthlyDistanceKm: number;
  monthlyPetrolCost: number;
  monthlyEvCost: number;
  monthlySaving: number;
  annualSaving: number;
  /** Share of the petrol bill saved, 0–1. Zero when petrol cost is zero. */
  savingRatio: number;
}

/** Guards against division by zero and negative inputs from manual entry. */
function safePositive(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function calculateEvSavings(input: EvSavingsInput): EvSavingsResult {
  const dailyDistanceKm = safePositive(input.dailyDistanceKm);
  const petrolPrice = safePositive(input.petrolPricePerLitre);
  const petrolMileage = safePositive(input.petrolMileageKmpl);
  const electricityCost = safePositive(input.electricityCostPerKwh);
  const evEfficiency = safePositive(input.evEfficiencyKmPerKwh);

  const monthlyDistanceKm = dailyDistanceKm * DAYS_PER_MONTH;

  const litresPerMonth = petrolMileage > 0 ? monthlyDistanceKm / petrolMileage : 0;
  const monthlyPetrolCost = litresPerMonth * petrolPrice;

  const kwhPerMonth = evEfficiency > 0 ? monthlyDistanceKm / evEfficiency : 0;
  const monthlyEvCost = kwhPerMonth * electricityCost;

  const monthlySaving = monthlyPetrolCost - monthlyEvCost;

  return {
    monthlyDistanceKm,
    monthlyPetrolCost,
    monthlyEvCost,
    monthlySaving,
    annualSaving: monthlySaving * MONTHS_PER_YEAR,
    savingRatio: monthlyPetrolCost > 0 ? monthlySaving / monthlyPetrolCost : 0,
  };
}
