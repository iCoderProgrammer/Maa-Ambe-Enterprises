import type { ProductShowroom } from "@/types/showroom";

import { nduroShowroom } from "./nduro";

/**
 * Showroom registry.
 *
 * A model appears here only once its imagery and copy exist. Every other model
 * renders the standard model page, unchanged — `getShowroom` returning
 * `undefined` is the normal case, not a missing-data problem.
 *
 * TO ADD LXS 3.0, LXS 2.0, ZYRO OR SX25
 * Copy `nduro.ts`, point its blocks at that model's assets, and add it to the
 * list below. The page, the sticky navigation, the colour picker and every
 * block component are model-agnostic and need no change — figures come from
 * that model's own product data through `statKey`.
 */
const showrooms: ProductShowroom[] = [nduroShowroom];

export function getShowroom(slug: string): ProductShowroom | undefined {
  return showrooms.find((showroom) => showroom.slug === slug);
}

export function hasShowroom(slug: string): boolean {
  return showrooms.some((showroom) => showroom.slug === slug);
}
