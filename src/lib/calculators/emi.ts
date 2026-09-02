/**
 * Equated Monthly Instalment maths.
 *
 * Pure functions with no React and no formatting, so the numbers can be tested
 * directly and reused by any surface. Every output is an estimate: the actual
 * offer comes from the lender, and this module has no way to know their
 * processing fees, insurance bundling or eligibility rules.
 */

export interface EmiInput {
  /** On-road or ex-showroom price, INR. */
  vehiclePrice: number;
  /** Paid upfront, INR. */
  downPayment: number;
  /** Annual rate of interest, percent (e.g. 9.5). */
  annualInterestRate: number;
  /** Loan tenure in months. */
  tenureMonths: number;
}

export interface EmiResult {
  /** Amount actually borrowed. */
  loanAmount: number;
  /** Monthly instalment. */
  emi: number;
  /** Interest paid across the full tenure. */
  totalInterest: number;
  /** Loan amount plus interest. */
  totalPayable: number;
  /** What the vehicle costs in total, including the down payment. */
  totalCost: number;
  /** Interest as a share of total payable, 0–1. Useful for a split bar. */
  interestShare: number;
}

function safePositive(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

/**
 * Standard reducing-balance EMI:
 *
 *   EMI = P · r · (1 + r)^n / ((1 + r)^n − 1)
 *
 * where `r` is the monthly rate and `n` the number of instalments. A zero
 * interest rate is handled separately because the formula divides by zero
 * there — some dealer schemes really are 0%, so it is not a hypothetical.
 */
export function calculateEmi(input: EmiInput): EmiResult {
  const vehiclePrice = safePositive(input.vehiclePrice);
  // A down payment larger than the price would produce a negative loan.
  const downPayment = Math.min(safePositive(input.downPayment), vehiclePrice);
  const annualRate = Math.max(0, Number.isFinite(input.annualInterestRate) ? input.annualInterestRate : 0);
  const tenureMonths = Math.max(1, Math.round(safePositive(input.tenureMonths)));

  const loanAmount = vehiclePrice - downPayment;

  if (loanAmount === 0) {
    return {
      loanAmount: 0,
      emi: 0,
      totalInterest: 0,
      totalPayable: 0,
      totalCost: vehiclePrice,
      interestShare: 0,
    };
  }

  const monthlyRate = annualRate / 12 / 100;

  const emi =
    monthlyRate === 0
      ? loanAmount / tenureMonths
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
        (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  const totalPayable = emi * tenureMonths;
  const totalInterest = totalPayable - loanAmount;

  return {
    loanAmount,
    emi,
    totalInterest,
    totalPayable,
    totalCost: totalPayable + downPayment,
    interestShare: totalPayable > 0 ? totalInterest / totalPayable : 0,
  };
}

/** Down payment as a percentage of the vehicle price, for slider labels. */
export function downPaymentPercent(vehiclePrice: number, downPayment: number): number {
  const price = safePositive(vehiclePrice);
  if (price === 0) return 0;
  return Math.min(100, Math.round((safePositive(downPayment) / price) * 100));
}
