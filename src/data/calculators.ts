/**
 * Starting values for the on-site calculators.
 *
 * These are ILLUSTRATIVE defaults chosen to give the calculators a sensible
 * starting point — they are not quoted prices, tariffs or product figures.
 * Every one of them is editable by the visitor, and every result is labelled
 * as an estimate. Update them here, never inside a component.
 */

export const evSavingsDefaults = {
  /** Kilometres ridden per day. */
  dailyDistanceKm: 30,
  /** Petrol price, INR per litre. */
  petrolPricePerLitre: 105,
  /** Petrol scooter efficiency, km per litre. */
  petrolMileageKmpl: 45,
  /** Domestic electricity tariff, INR per kWh. */
  electricityCostPerKwh: 8,
  /** EV efficiency, km per kWh. */
  evEfficiencyKmPerKwh: 40,
} as const;

export const evSavingsLimits = {
  dailyDistanceKm: { min: 5, max: 150, step: 1 },
  petrolPricePerLitre: { min: 60, max: 160, step: 1 },
  petrolMileageKmpl: { min: 20, max: 80, step: 1 },
  electricityCostPerKwh: { min: 2, max: 20, step: 0.5 },
  evEfficiencyKmPerKwh: { min: 15, max: 70, step: 1 },
} as const;

export const baasDefaults = {
  /** Full purchase price including the battery, INR. */
  vehiclePrice: 110000,
  /** Purchase price without the battery, INR. */
  baasVehiclePrice: 75000,
  /** Battery subscription, INR per month. */
  monthlySubscription: 1500,
  /** Ownership window used for the comparison, months. */
  comparisonMonths: 36,
  /** Distance ridden per month, km. */
  monthlyDistanceKm: 900,
  /** Domestic tariff, INR per kWh. */
  electricityCostPerKwh: 8,
} as const;

export const baasLimits = {
  vehiclePrice: { min: 20000, max: 400000, step: 1000 },
  baasVehiclePrice: { min: 10000, max: 400000, step: 1000 },
  monthlySubscription: { min: 0, max: 10000, step: 50 },
  monthlyDistanceKm: { min: 100, max: 5000, step: 50 },
  electricityCostPerKwh: { min: 2, max: 20, step: 0.5 },
} as const;

/** Ownership windows offered in the comparison. */
export const baasComparisonWindows = [12, 24, 36, 48, 60] as const;

export const financeDefaults = {
  /** Illustrative starting price, INR — replaced by a real price when one is confirmed. */
  vehiclePrice: 110000,
  /** Typical first payment, INR. */
  downPayment: 20000,
  /** Annual rate of interest, percent. */
  annualInterestRate: 10.5,
  /** Loan tenure, months. */
  tenureMonths: 24,
} as const;

export const financeLimits = {
  vehiclePrice: { min: 20000, max: 400000, step: 1000 },
  downPayment: { min: 0, max: 400000, step: 1000 },
  annualInterestRate: { min: 0, max: 30, step: 0.1 },
} as const;

/** Tenures customers are usually offered. */
export const financeTenures = [12, 18, 24, 30, 36, 48] as const;

export const EMI_DISCLAIMER =
  "EMI figures are estimates calculated on a reducing-balance basis from the values you enter. Your actual offer — interest rate, processing fee and eligibility — comes from the lender.";

export const CALCULATOR_DISCLAIMER =
  "Estimates only, based on the values you enter. Actual costs vary with riding conditions, tariffs, model, variant, location and applicable offers.";

export const BAAS_DISCLAIMER =
  "Actual pricing, subscription terms and availability may vary by model, location and applicable offers.";
