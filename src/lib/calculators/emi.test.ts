import { describe, expect, it } from "vitest";

import { calculateEmi, downPaymentPercent } from "@/lib/calculators/emi";

/**
 * Expected instalments are reference values for the standard reducing-balance
 * formula, computed independently rather than by re-running the code under
 * test — otherwise the test would only prove the code agrees with itself.
 */
describe("calculateEmi", () => {
  it("matches the reducing-balance formula", () => {
    const result = calculateEmi({
      vehiclePrice: 100_000,
      downPayment: 0,
      annualInterestRate: 9.5,
      tenureMonths: 24,
    });

    expect(result.emi).toBeCloseTo(4591.4493, 4);
    expect(result.totalPayable).toBeCloseTo(110_194.7832, 4);
    expect(result.totalInterest).toBeCloseTo(10_194.7832, 4);
    expect(result.interestShare).toBeCloseTo(0.0925, 4);
  });

  it("borrows only what is left after the down payment", () => {
    const result = calculateEmi({
      vehiclePrice: 120_000,
      downPayment: 35_000,
      annualInterestRate: 11,
      tenureMonths: 36,
    });

    expect(result.loanAmount).toBe(85_000);
    expect(result.emi).toBeCloseTo(2782.791, 3);
    // The vehicle costs the instalments plus what was paid at the counter.
    expect(result.totalCost).toBeCloseTo(result.totalPayable + 35_000, 6);
  });

  it("handles a genuine 0% scheme without dividing by zero", () => {
    const result = calculateEmi({
      vehiclePrice: 90_000,
      downPayment: 18_000,
      annualInterestRate: 0,
      tenureMonths: 12,
    });

    expect(result.emi).toBe(6000);
    expect(result.totalInterest).toBe(0);
    expect(result.interestShare).toBe(0);
    expect(result.totalCost).toBe(90_000);
  });

  it("clamps a down payment larger than the price instead of lending a negative", () => {
    const result = calculateEmi({
      vehiclePrice: 80_000,
      downPayment: 95_000,
      annualInterestRate: 9,
      tenureMonths: 24,
    });

    expect(result.loanAmount).toBe(0);
    expect(result.emi).toBe(0);
    expect(result.totalInterest).toBe(0);
    // Paying outright costs the price, not the inflated down payment.
    expect(result.totalCost).toBe(80_000);
  });

  it("treats negative, zero and non-finite entries as absent", () => {
    const result = calculateEmi({
      vehiclePrice: Number.NaN,
      downPayment: -5000,
      annualInterestRate: Number.POSITIVE_INFINITY,
      tenureMonths: 0,
    });

    expect(result.loanAmount).toBe(0);
    expect(result.emi).toBe(0);
    expect(result.totalCost).toBe(0);
    expect(Number.isFinite(result.interestShare)).toBe(true);
  });

  it("never lets a rounded tenure fall below one instalment", () => {
    const result = calculateEmi({
      vehiclePrice: 50_000,
      downPayment: 0,
      annualInterestRate: 0,
      tenureMonths: 0.4,
    });

    expect(result.emi).toBe(50_000);
  });

  it("charges more interest over a longer tenure at the same rate", () => {
    const base = {
      vehiclePrice: 100_000,
      downPayment: 10_000,
      annualInterestRate: 10,
    };
    const short = calculateEmi({ ...base, tenureMonths: 12 });
    const long = calculateEmi({ ...base, tenureMonths: 36 });

    expect(long.emi).toBeLessThan(short.emi);
    expect(long.totalInterest).toBeGreaterThan(short.totalInterest);
  });
});

describe("downPaymentPercent", () => {
  it("reports the share of the price paid upfront", () => {
    expect(downPaymentPercent(100_000, 25_000)).toBe(25);
    // Rounded for a slider label.
    expect(downPaymentPercent(90_000, 30_000)).toBe(33);
  });

  it("stays within 0–100 for out-of-range input", () => {
    expect(downPaymentPercent(80_000, 200_000)).toBe(100);
    expect(downPaymentPercent(80_000, -1)).toBe(0);
    expect(downPaymentPercent(0, 10_000)).toBe(0);
  });
});
