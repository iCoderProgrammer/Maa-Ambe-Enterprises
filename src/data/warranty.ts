/**
 * Warranty content.
 *
 * DELIBERATELY LIGHT ON SPECIFICS. Warranty durations, kilometre limits and
 * exclusions are contractual terms set by the manufacturer, they differ by
 * model and variant, and they change. Per-model figures live in product data
 * (`Product.warranty`) and are shown only once confirmed; everything below is
 * general principle, not a term of cover.
 *
 * Nothing in this file may state a duration, a limit or an exclusion as fact.
 */

export interface WarrantyPrinciple {
  title: string;
  description: string;
}

/** How vehicle warranties generally work. True regardless of the specific terms. */
export const warrantyPrinciples: WarrantyPrinciple[] = [
  {
    title: "Two separate covers",
    description:
      "The vehicle and the battery are warranted separately, with their own durations and conditions. When someone quotes you a single warranty figure, ask which of the two it refers to.",
  },
  {
    title: "Time or distance, whichever comes first",
    description:
      "Vehicle warranties are normally expressed as a period and a kilometre limit together. Cover ends when you reach either one, not both.",
  },
  {
    title: "Batteries are usually measured on health",
    description:
      "Battery cover typically concerns capacity retention rather than outright failure, since packs degrade gradually. The threshold that counts as a claim is set out in the warranty document.",
  },
  {
    title: "Servicing history matters",
    description:
      "Keeping to the service schedule at an authorized workshop, with genuine parts, is what keeps a claim straightforward. It is the most common reason a claim runs into difficulty.",
  },
];

/**
 * Things that commonly sit outside vehicle warranties across the industry.
 *
 * Framed as "usually" on purpose — these are general expectations, not this
 * manufacturer's exclusion list. The real list is in the warranty document.
 */
export const commonExclusions: string[] = [
  "Wear-and-tear items such as tyres, brake pads and shoes",
  "Damage from an accident, misuse or riding through deep water",
  "Unauthorized modification, including to the battery or controller",
  "Non-genuine parts, or repairs carried out outside the authorized network",
  "Cosmetic wear that does not affect the vehicle's function",
];

export const WARRANTY_DISCLAIMER =
  "The summary on this page describes how vehicle and battery warranties generally work. It is not a statement of your cover. The manufacturer's warranty document issued with your vehicle sets out the actual terms, durations and exclusions that apply, and it prevails over anything written here.";
