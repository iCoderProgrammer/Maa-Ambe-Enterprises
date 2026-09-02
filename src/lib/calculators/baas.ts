/**
 * Battery-as-a-Service ownership comparison.
 *
 * Compares buying a scooter outright against buying it without the battery and
 * paying a monthly subscription instead. Pure functions — no React, no
 * formatting — so the arithmetic is testable on its own and reusable by the
 * homepage teaser and the full BaaS page alike.
 *
 * Energy cost is optional. When distance, tariff and efficiency are supplied,
 * both sides of the comparison include the cost of charging, which is the only
 * way an "ownership cost" figure means anything. Omit them and the function
 * compares purchase and subscription alone, which is what the homepage teaser
 * does.
 */

const MONTHS_PER_YEAR = 12;
const DAYS_PER_MONTH = 30;

export interface BaasInput {
  /** Purchase price including the battery, INR. */
  vehiclePrice: number;
  /** Purchase price excluding the battery, INR. */
  baasVehiclePrice: number;
  /** Battery subscription, INR per month. */
  monthlySubscription: number;
  /** Ownership window to compare over, months. */
  comparisonMonths: number;
  /** Distance ridden per month, km. Omit to exclude energy from the comparison. */
  monthlyDistanceKm?: number;
  /** Domestic tariff, INR per kWh. */
  electricityCostPerKwh?: number;
  /** Scooter efficiency, km per kWh. */
  evEfficiencyKmPerKwh?: number;
}

export interface BaasResult {
  /** How much less you pay on day one under BaaS. */
  upfrontSaving: number;
  /** Estimated cost of charging per month. Zero when energy inputs are absent. */
  monthlyEnergyCost: number;
  /** Subscription plus charging — what the battery costs you each month. */
  monthlyBatteryCost: number;
  /** Total subscription paid across the comparison window. */
  totalSubscription: number;
  /** Total energy cost across the window, applied to both options equally. */
  totalEnergyCost: number;
  /** Outright ownership cost across the window (vehicle + energy). */
  outrightTotal: number;
  /** BaaS ownership cost across the window (vehicle + subscriptions + energy). */
  baasTotal: number;
  /** Positive when BaaS costs less over the window, negative when it costs more. */
  netDifference: number;
  /**
   * Months until the subscriptions equal the upfront saving, or null when the
   * subscription is zero or there is no upfront saving to recover.
   */
  breakEvenMonths: number | null;
}

function safePositive(value: number | undefined): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : 0;
}

export function calculateBaas(input: BaasInput): BaasResult {
  const vehiclePrice = safePositive(input.vehiclePrice);
  const baasVehiclePrice = safePositive(input.baasVehiclePrice);
  const monthlySubscription = safePositive(input.monthlySubscription);
  const months = Math.max(1, Math.round(safePositive(input.comparisonMonths)));

  const monthlyDistanceKm = safePositive(input.monthlyDistanceKm);
  const electricityCostPerKwh = safePositive(input.electricityCostPerKwh);
  const efficiency = safePositive(input.evEfficiencyKmPerKwh);

  // Charging cost applies to both options — the rider covers the same distance
  // either way — so it never tips the comparison. It is included because an
  // "ownership cost" that ignores running cost is not an ownership cost.
  const monthlyEnergyCost =
    efficiency > 0 ? (monthlyDistanceKm / efficiency) * electricityCostPerKwh : 0;

  const upfrontSaving = vehiclePrice - baasVehiclePrice;
  const totalSubscription = monthlySubscription * months;
  const totalEnergyCost = monthlyEnergyCost * months;

  const outrightTotal = vehiclePrice + totalEnergyCost;
  const baasTotal = baasVehiclePrice + totalSubscription + totalEnergyCost;

  return {
    upfrontSaving,
    monthlyEnergyCost,
    monthlyBatteryCost: monthlySubscription + monthlyEnergyCost,
    totalSubscription,
    totalEnergyCost,
    outrightTotal,
    baasTotal,
    netDifference: outrightTotal - baasTotal,
    breakEvenMonths:
      upfrontSaving > 0 && monthlySubscription > 0
        ? upfrontSaving / monthlySubscription
        : null,
  };
}

/** Converts a daily riding habit into the monthly distance the calculator uses. */
export function monthlyDistanceFromDaily(dailyKm: number): number {
  return safePositive(dailyKm) * DAYS_PER_MONTH;
}

/** Annualises a monthly figure, for "per year" summaries. */
export function annualise(monthly: number): number {
  return monthly * MONTHS_PER_YEAR;
}
