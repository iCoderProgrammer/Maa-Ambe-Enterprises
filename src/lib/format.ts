/** Rendered wherever a value has not been confirmed by the dealership yet. */
export const TBD = "—";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const inrCompact = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 2,
});

const number = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** ₹1,24,999 — or the placeholder when the price is unconfirmed. */
export function formatPrice(value: number | null | undefined): string {
  return value == null ? TBD : inr.format(value);
}

/** ₹1.25L — for tight card layouts. */
export function formatPriceCompact(value: number | null | undefined): string {
  return value == null ? TBD : inrCompact.format(value);
}

/** Appends a unit only when there is a real value to attach it to. */
export function formatSpec(
  value: number | null | undefined,
  unit: string,
  fractionDigits = 0
): string {
  if (value == null) return TBD;
  const formatted =
    fractionDigits > 0
      ? value.toFixed(fractionDigits)
      : number.format(value);
  return `${formatted} ${unit}`;
}

export function formatNumber(value: number): string {
  return number.format(value);
}

/** Rounds to whole rupees before formatting — used by every calculator. */
export function formatRupees(value: number): string {
  return inr.format(Math.round(value));
}
