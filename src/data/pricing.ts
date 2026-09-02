/**
 * On-road price configuration.
 *
 * An on-road price is the ex-showroom price plus RTO registration, road tax,
 * insurance and any dealer handling charge, minus applicable subsidies. Every
 * one of those varies by state, city, variant and the offers running that
 * month, so the site NEVER computes one from assumptions.
 *
 * A price is shown only when it is entered here for a specific model, variant
 * and city. Until then the breakdown explains what makes up the figure and the
 * customer is invited to ask — which is what the enquiry form is for.
 */

export interface OnRoadCharges {
  /** Ex-showroom price, INR. */
  exShowroom: number;
  /** RTO registration and road tax, INR. */
  registration: number;
  /** First-year insurance, INR. */
  insurance: number;
  /** Dealer handling, accessories, or anything else itemised. */
  otherCharges: number;
  /** State or central subsidy deducted, INR. Positive number. */
  subsidy: number;
}

export interface CityPricing {
  /** Lowercase city key, matched case-insensitively against customer input. */
  city: string;
  state: string;
  /** Keyed by `${modelSlug}:${variantId}`. */
  prices: Record<string, OnRoadCharges>;
}

/**
 * Configured city pricing.
 *
 * EMPTY BY DESIGN. Add entries only with figures confirmed by the dealership —
 * an approximate on-road price is worse than none, because a customer will
 * quote it back at the counter.
 */
export const cityPricing: CityPricing[] = [];

export interface OnRoadPrice extends OnRoadCharges {
  total: number;
  city: string;
  state: string;
}

/**
 * Looks up a configured on-road price. Returns null when nothing is configured
 * for that combination, which is currently every combination.
 */
export function getOnRoadPrice(
  modelSlug: string,
  variantId: string,
  city: string
): OnRoadPrice | null {
  const normalised = city.trim().toLowerCase();
  const entry = cityPricing.find((item) => item.city.toLowerCase() === normalised);
  if (!entry) return null;

  const charges = entry.prices[`${modelSlug}:${variantId}`];
  if (!charges) return null;

  return {
    ...charges,
    city: entry.city,
    state: entry.state,
    total:
      charges.exShowroom +
      charges.registration +
      charges.insurance +
      charges.otherCharges -
      charges.subsidy,
  };
}

/** Cities with at least one configured price, for a "we have prices for…" hint. */
export function getConfiguredCities(): string[] {
  return cityPricing
    .filter((entry) => Object.keys(entry.prices).length > 0)
    .map((entry) => entry.city);
}

/** What an on-road price is made of. Shown even when no figures are configured. */
export const ON_ROAD_COMPONENTS = [
  {
    id: "ex-showroom",
    label: "Ex-showroom price",
    description: "The manufacturer's price for the vehicle itself.",
  },
  {
    id: "registration",
    label: "Registration & road tax",
    description:
      "Charged by your state RTO. Rates differ by state, and some states waive them for electric vehicles.",
  },
  {
    id: "insurance",
    label: "Insurance",
    description:
      "Third-party cover is mandatory. Comprehensive cover costs more but protects your own vehicle too.",
  },
  {
    id: "other",
    label: "Handling & accessories",
    description:
      "Anything itemised separately, such as a smart charger or accessories you choose.",
  },
  {
    id: "subsidy",
    label: "Subsidy",
    description:
      "Central or state EV incentives, where they apply. Deducted from the total.",
  },
] as const;

export const PRICE_DISCLAIMER =
  "On-road price varies by city, state RTO charges, insurance choice and any offers running at the time. We will confirm the exact figure for you.";
