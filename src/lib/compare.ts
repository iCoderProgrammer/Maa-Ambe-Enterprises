import type { Product, ResolvedVariant } from "@/types/product";
import { getProductFeatures, resolveVariant } from "@/lib/product-utils";
import { formatPrice, formatSpec, TBD } from "@/lib/format";

/**
 * Comparison-ready data.
 *
 * Builds a normalised table from product data so the compare page (Phase 5) is
 * pure presentation. Rows are declared once, here; adding a comparable
 * specification means adding one entry to `ROWS`, not touching any component.
 */

export type CompareGroupId =
  | "pricing"
  | "performance"
  | "battery"
  | "practicality"
  | "features"
  | "ownership";

export type BetterDirection = "higher" | "lower" | null;

export interface CompareValue {
  /** Sortable underlying value, or null when unconfirmed. */
  raw: number | null;
  /** Ready-to-render text. Always safe to print. */
  display: string;
  /** Set only when this column wins the row outright. */
  isBest: boolean;
}

export interface CompareRow {
  key: string;
  label: string;
  group: CompareGroupId;
  /** Direction that counts as better, or null when a row is not rankable. */
  better: BetterDirection;
  values: CompareValue[];
}

export interface CompareGroup {
  id: CompareGroupId;
  title: string;
  rows: CompareRow[];
}

export interface Comparison {
  products: Product[];
  /** The exact variant compared for each product, in the same order. */
  variants: ResolvedVariant[];
  groups: CompareGroup[];
  /** Slugs that were requested but do not exist. */
  unknownSlugs: string[];
}

export const compareGroupTitles: Record<CompareGroupId, string> = {
  pricing: "Pricing",
  performance: "Performance",
  battery: "Battery & charging",
  practicality: "Practicality",
  features: "Features",
  ownership: "Ownership",
};

/** Maximum models a comparison can hold. */
export const MAX_COMPARE = 3;

interface RowDefinition {
  key: string;
  label: string;
  group: CompareGroupId;
  better: BetterDirection;
  /** Sortable value, or null when unconfirmed. */
  raw: (entry: ResolvedVariant) => number | null;
  /** Display text. Falls back to the placeholder when the value is unknown. */
  display: (entry: ResolvedVariant) => string;
}

const ROWS: RowDefinition[] = [
  {
    key: "price",
    label: "Price (ex-showroom)",
    group: "pricing",
    better: "lower",
    raw: (entry) => entry.variant.price,
    display: (entry) => formatPrice(entry.variant.price),
  },
  {
    key: "baas",
    label: "Battery-as-a-Service",
    group: "pricing",
    better: null,
    raw: () => null,
    display: (entry) => (entry.baas ? "Available" : "Not offered"),
  },
  {
    key: "range",
    label: "Claimed range",
    group: "performance",
    better: "higher",
    raw: (entry) => entry.specs.range.claimedKm,
    display: (entry) => formatSpec(entry.specs.range.claimedKm, "km"),
  },
  {
    key: "top-speed",
    label: "Top speed",
    group: "performance",
    better: "higher",
    raw: (entry) => entry.specs.topSpeedKmph,
    display: (entry) => formatSpec(entry.specs.topSpeedKmph, "km/h"),
  },
  {
    key: "acceleration",
    label: "0–40 km/h",
    group: "performance",
    better: "lower",
    raw: (entry) => entry.specs.accelerationSeconds,
    display: (entry) => formatSpec(entry.specs.accelerationSeconds, "s", 1),
  },
  {
    key: "motor",
    label: "Motor",
    group: "performance",
    better: null,
    raw: () => null,
    display: (entry) => entry.specs.motor.type ?? TBD,
  },
  {
    key: "peak-power",
    label: "Peak power",
    group: "performance",
    better: "higher",
    raw: (entry) => entry.specs.motor.peakPowerW,
    display: (entry) => formatSpec(entry.specs.motor.peakPowerW, "W"),
  },
  {
    key: "battery",
    label: "Battery capacity",
    group: "battery",
    better: "higher",
    raw: (entry) => entry.specs.batteryCapacityKwh,
    display: (entry) => formatSpec(entry.specs.batteryCapacityKwh, "kWh", 1),
  },
  {
    key: "battery-removable",
    label: "Removable battery",
    group: "battery",
    better: null,
    raw: () => null,
    display: (entry) =>
      entry.specs.batteryRemovable == null
        ? TBD
        : entry.specs.batteryRemovable
          ? "Yes"
          : "No",
  },
  {
    key: "charging",
    label: "Full charge time",
    group: "battery",
    better: "lower",
    raw: (entry) => entry.specs.charging.fullChargeHours,
    display: (entry) => formatSpec(entry.specs.charging.fullChargeHours, "hrs", 1),
  },
  {
    key: "boot",
    label: "Boot space",
    group: "practicality",
    better: "higher",
    raw: (entry) => entry.specs.bootSpaceLitres,
    display: (entry) => formatSpec(entry.specs.bootSpaceLitres, "L"),
  },
  {
    key: "kerb-weight",
    label: "Kerb weight",
    group: "practicality",
    better: "lower",
    raw: (entry) => entry.specs.kerbWeightKg,
    display: (entry) => formatSpec(entry.specs.kerbWeightKg, "kg"),
  },
  {
    key: "riding-modes",
    label: "Riding modes",
    group: "practicality",
    better: null,
    raw: () => null,
    display: (entry) =>
      entry.specs.ridingModes.length > 0 ? entry.specs.ridingModes.join(", ") : TBD,
  },
  {
    key: "smart-features",
    label: "Smart features",
    group: "features",
    better: "higher",
    raw: (entry) => countOrNull(getProductFeatures(entry.product).smart.length),
    display: (entry) => featureCount(getProductFeatures(entry.product).smart.length),
  },
  {
    key: "safety-features",
    label: "Safety features",
    group: "features",
    better: "higher",
    raw: (entry) => countOrNull(getProductFeatures(entry.product).safety.length),
    display: (entry) => featureCount(getProductFeatures(entry.product).safety.length),
  },
  {
    key: "comfort-features",
    label: "Comfort features",
    group: "features",
    better: "higher",
    raw: (entry) => countOrNull(getProductFeatures(entry.product).comfort.length),
    display: (entry) => featureCount(getProductFeatures(entry.product).comfort.length),
  },
  {
    key: "warranty-vehicle",
    label: "Vehicle warranty",
    group: "ownership",
    better: "higher",
    raw: (entry) => entry.product.warranty.vehicle?.years ?? null,
    display: (entry) => formatWarranty(entry.product.warranty.vehicle),
  },
  {
    key: "warranty-battery",
    label: "Battery warranty",
    group: "ownership",
    better: "higher",
    raw: (entry) => entry.product.warranty.battery?.years ?? null,
    display: (entry) => formatWarranty(entry.product.warranty.battery),
  },
  {
    key: "availability",
    label: "Availability",
    group: "ownership",
    better: null,
    raw: () => null,
    display: (entry) =>
      entry.variant.availability === "available"
        ? "In showroom"
        : entry.variant.availability === "coming-soon"
          ? "Coming soon"
          : "Discontinued",
  },
];

/** Zero declared features means "none confirmed", which is not a ranking. */
function countOrNull(count: number): number | null {
  return count > 0 ? count : null;
}

function featureCount(count: number): string {
  if (count === 0) return TBD;
  return `${count} feature${count === 1 ? "" : "s"}`;
}

function formatWarranty(term: { years: number | null; kilometres: number | null } | null) {
  if (!term) return TBD;

  const parts = [
    term.years != null ? `${term.years} yr${term.years === 1 ? "" : "s"}` : null,
    term.kilometres != null ? formatSpec(term.kilometres, "km") : null,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" / ") : TBD;
}

/**
 * Marks the winning column.
 *
 * Only ranks when at least two columns have a confirmed value and they are not
 * all equal — otherwise a single known figure would appear to "win" against
 * unconfirmed ones, which would be misleading.
 */
function markBest(values: CompareValue[], better: BetterDirection): CompareValue[] {
  if (better === null) return values;

  const known = values.filter((value) => value.raw != null);
  if (known.length < 2) return values;

  const raws = known.map((value) => value.raw as number);
  const target = better === "higher" ? Math.max(...raws) : Math.min(...raws);
  if (raws.every((raw) => raw === target)) return values;

  return values.map((value) => ({ ...value, isBest: value.raw === target }));
}

/**
 * Builds a comparison for the given slugs.
 *
 * The catalogue is passed in rather than imported so this module stays free of
 * `src/data/products` — the compare page runs it in the browser, and importing
 * the data module there would drag the Zod validation layer along with it.
 *
 * `variantIds` optionally pins which variant of a model to compare, keyed by
 * slug; anything unpinned uses the model's default variant. Unknown slugs are
 * reported rather than silently dropped, so the UI can tell the visitor a
 * shared link contained a model that no longer exists.
 */
export function compareProducts(
  slugs: string[],
  catalogue: Product[],
  variantIds: Record<string, string | undefined> = {}
): Comparison {
  const unknownSlugs: string[] = [];
  const resolved: Product[] = [];

  for (const slug of slugs.slice(0, MAX_COMPARE)) {
    const product = catalogue.find((candidate) => candidate.slug === slug);
    if (product) {
      if (!resolved.some((existing) => existing.slug === product.slug)) {
        resolved.push(product);
      }
    } else {
      unknownSlugs.push(slug);
    }
  }

  const variants = resolved.map((product) =>
    resolveVariant(product, variantIds[product.slug])
  );

  const rows: CompareRow[] = ROWS.map((definition) => {
    const values: CompareValue[] = variants.map((entry) => ({
      raw: definition.raw(entry),
      display: definition.display(entry),
      isBest: false,
    }));

    return {
      key: definition.key,
      label: definition.label,
      group: definition.group,
      better: definition.better,
      values: markBest(values, definition.better),
    };
  });

  const groupIds = Object.keys(compareGroupTitles) as CompareGroupId[];
  const groups: CompareGroup[] = groupIds
    .map((id) => ({
      id,
      title: compareGroupTitles[id],
      rows: rows.filter((row) => row.group === id),
    }))
    .filter((group) => group.rows.length > 0);

  return { products: resolved, variants, groups, unknownSlugs };
}
