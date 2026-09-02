import { dealership } from "@/data/dealership";

/**
 * Brand vocabulary.
 *
 * Two identities appear on this website and they must never blur:
 *
 *   DEALERSHIP  Maa Ambe Enterprises — the local business, the site's own
 *               identity, the party a customer calls, visits and buys from.
 *   BRAND       Lectrix EV — the manufacturer of the scooters on display.
 *
 * Copy that names both goes through the helpers below rather than being typed
 * out inline, so the relationship reads the same way in a hero, a page title,
 * an OG tag and a JSON-LD block. Both names ultimately come from
 * `src/data/dealership.ts`, so a rebrand is still a one-file change.
 */

/** "Lectrix EV" — the vehicle brand. Never the site owner. */
export const VEHICLE_BRAND = dealership.brand;

/** "Lectrix" — model-name prefix, e.g. "Lectrix NDuro". */
export const VEHICLE_BRAND_SHORT = dealership.brandShort;

/** "Maa Ambe Enterprises" — the dealership. Never the manufacturer. */
export const DEALERSHIP_NAME = dealership.dealershipName;

/** "Authorized Lectrix EV Dealership" — the relationship, stated plainly. */
export const DEALERSHIP_LINE = dealership.brandLine;

/** "Maa Ambe Enterprises — Authorized Lectrix EV Dealership" */
export const DEALERSHIP_IDENTITY = `${DEALERSHIP_NAME} — ${DEALERSHIP_LINE}`;

/**
 * Prefixes a model name with the vehicle brand: "NDuro" → "Lectrix NDuro".
 *
 * Idempotent, so passing an already-branded name is safe. Product data stores
 * the bare model name so that specification tables, comparison columns and
 * variant pickers stay readable; anywhere the model is named as a product on
 * sale, it is named as a Lectrix.
 */
export function brandedModel(modelName: string): string {
  return modelName.startsWith(VEHICLE_BRAND_SHORT)
    ? modelName
    : `${VEHICLE_BRAND_SHORT} ${modelName}`;
}

/** "Lectrix NDuro, available at Maa Ambe Enterprises" */
export function modelAtDealership(modelName: string): string {
  return `${brandedModel(modelName)}, available at ${DEALERSHIP_NAME}`;
}

/** "Lectrix EV electric scooters at Maa Ambe Enterprises" */
export function brandAtDealership(subject = "electric scooters"): string {
  return `${VEHICLE_BRAND} ${subject} at ${DEALERSHIP_NAME}`;
}
