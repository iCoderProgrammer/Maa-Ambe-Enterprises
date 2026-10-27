import type {
  ChargingSpec,
  FeatureId,
  GalleryImage,
  MotorSpec,
  Product,
  ProductColor,
  ProductImages,
  ProductSpecs,
  ProductVariant,
  RangeSpec,
  ResolvedVariant,
} from "@/types/product";
import { resolveFeatures, type FeatureDefinition } from "@/data/feature-catalog";

/**
 * Pure product helpers.
 *
 * Every function here operates on a `Product` handed to it and never reaches
 * for the catalogue, so this module carries no dependency on
 * `src/data/products` — and therefore none on Zod. That matters because the
 * compare page runs these in the browser: importing the catalogue module there
 * would pull the whole validation layer into the client bundle for no benefit.
 *
 * Catalogue access (`getProducts`, `getProductBySlug`, ...) lives in
 * `src/lib/products.ts`, which re-exports everything below so consumers still
 * have a single import site.
 */

export function getVariant(
  product: Product,
  variantId?: string
): ProductVariant {
  if (variantId) {
    const match = product.variants.find((variant) => variant.id === variantId);
    if (match) return match;
  }

  return (
    product.variants.find((variant) => variant.id === product.defaultVariantId) ??
    product.variants[0]
  );
}

export function getDefaultVariant(product: Product): ProductVariant {
  return getVariant(product);
}

/* -------------------------------------------------------------------------- */
/* Specification resolution                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Merges a variant's overrides onto the model baseline.
 *
 * Nested groups (`range`, `charging`, `motor`) are replaced wholesale when a
 * variant declares them, never field-by-field: a variant that changes battery
 * size must restate its full charging profile rather than silently inheriting
 * half of the previous one. That is the behaviour the data files document, and
 * it is why the template restates `chargerType` on its long-range variant.
 */
export function resolveSpecs(
  product: Product,
  variantId?: string
): ProductSpecs {
  const variant = getVariant(product, variantId);
  const base = product.specs;
  const override = variant.specs;

  return {
    batteryCapacityKwh:
      override.batteryCapacityKwh !== undefined
        ? override.batteryCapacityKwh
        : base.batteryCapacityKwh,
    batteryCapacityLabel:
      override.batteryCapacityLabel !== undefined
        ? override.batteryCapacityLabel
        : base.batteryCapacityLabel,
    batteryRemovable:
      override.batteryRemovable !== undefined
        ? override.batteryRemovable
        : base.batteryRemovable,
    batteryChemistry:
      override.batteryChemistry !== undefined
        ? override.batteryChemistry
        : base.batteryChemistry,
    range: (override.range ?? base.range) as RangeSpec,
    topSpeedKmph:
      override.topSpeedKmph !== undefined ? override.topSpeedKmph : base.topSpeedKmph,
    accelerationSeconds:
      override.accelerationSeconds !== undefined
        ? override.accelerationSeconds
        : base.accelerationSeconds,
    charging: (override.charging ?? base.charging) as ChargingSpec,
    motor: (override.motor ?? base.motor) as MotorSpec,
    gradeabilityPercent:
      override.gradeabilityPercent !== undefined
        ? override.gradeabilityPercent
        : base.gradeabilityPercent,
    gradeabilityDegrees:
      override.gradeabilityDegrees !== undefined
        ? override.gradeabilityDegrees
        : base.gradeabilityDegrees,
    ipRating: override.ipRating !== undefined ? override.ipRating : base.ipRating,
    bootSpaceLitres:
      override.bootSpaceLitres !== undefined
        ? override.bootSpaceLitres
        : base.bootSpaceLitres,
    kerbWeightKg:
      override.kerbWeightKg !== undefined ? override.kerbWeightKg : base.kerbWeightKg,
    ridingModes: override.ridingModes ?? base.ridingModes,
  };
}

/** Colours offered on a variant — all of the model's unless it restricts them. */
export function getVariantColors(
  product: Product,
  variantId?: string
): ProductColor[] {
  const variant = getVariant(product, variantId);
  if (!variant.colorIds) return product.colors;

  return product.colors.filter((color) => variant.colorIds!.includes(color.id));
}

/**
 * Artwork for a variant, falling back per slot to the model's own.
 *
 * Resolved slot by slot rather than all-or-nothing: a variant that supplies a
 * hero and a card but no social image keeps the model's OG image instead of
 * losing it, which is the realistic state of a half-photographed model.
 */
export function resolveImages(
  product: Product,
  variantId?: string
): ProductImages {
  const variant = getVariant(product, variantId);
  const override = variant.images;

  if (!override) return product.images;

  return {
    card: override.card !== undefined ? override.card : product.images.card,
    hero: override.hero !== undefined ? override.hero : product.images.hero,
    og: override.og !== undefined ? override.og : product.images.og,
  };
}

/** The variant's own gallery when it has one, otherwise the model's. */
export function resolveGallery(
  product: Product,
  variantId?: string
): GalleryImage[] {
  return getVariant(product, variantId).gallery ?? product.gallery;
}

/** A variant plus everything a page needs to render it. */
export function resolveVariant(
  product: Product,
  variantId?: string
): ResolvedVariant {
  const variant = getVariant(product, variantId);

  return {
    product,
    variant,
    specs: resolveSpecs(product, variant.id),
    colors: getVariantColors(product, variant.id),
    baas: variant.baas,
    images: resolveImages(product, variant.id),
    gallery: resolveGallery(product, variant.id),
  };
}

/** True when a variant differs from the model baseline in any way. */
export function variantHasOverrides(variant: ProductVariant): boolean {
  return Object.keys(variant.specs).length > 0;
}

/* -------------------------------------------------------------------------- */
/* Derived values                                                              */
/* -------------------------------------------------------------------------- */

/**
 * The model's "starting at" ex-showroom price.
 *
 * The manufacturer's own published starting price wins when there is one,
 * because that is the figure a customer will have read before walking in. Only
 * when Lectrix EV publishes none do we fall back to the lowest price we have
 * confirmed for an individual variant.
 *
 * Returns null when neither exists — never 0, and never a variant price
 * presented as the model's floor when a cheaper variant is merely unpriced.
 */
export function getStartingPrice(product: Product): number | null {
  if (product.publishedStartingPrice != null) return product.publishedStartingPrice;

  const prices = product.variants
    .map((variant) => variant.price)
    .filter((price): price is number => price != null);

  return prices.length > 0 ? Math.min(...prices) : null;
}

/**
 * Pack size as published: kilowatt-hours where the brand gives them, the
 * verbatim label ("30 Ah", "60V") where it does not, null where neither is
 * confirmed. Never converts between the two — see `batteryCapacityLabel`.
 */
export function formatBatteryCapacity(specs: ProductSpecs): string | null {
  if (specs.batteryCapacityKwh != null) {
    return `${specs.batteryCapacityKwh.toFixed(1)} kWh`;
  }
  return specs.batteryCapacityLabel;
}

/** Highest claimed range across variants, for "up to X km" messaging. */
export function getMaxRange(product: Product): number | null {
  const ranges = product.variants
    .map((variant) => resolveSpecs(product, variant.id).range.claimedKm)
    .filter((range): range is number => range != null);

  return ranges.length > 0 ? Math.max(...ranges) : null;
}

export function getMaxTopSpeed(product: Product): number | null {
  const speeds = product.variants
    .map((variant) => resolveSpecs(product, variant.id).topSpeedKmph)
    .filter((speed): speed is number => speed != null);

  return speeds.length > 0 ? Math.max(...speeds) : null;
}

/** True when at least one variant is offered on Battery-as-a-Service. */
export function isBaasAvailable(product: Product): boolean {
  return product.variants.some((variant) => variant.baas != null);
}

/** The most optimistic availability across a model's variants. */
export function getProductAvailability(product: Product) {
  if (product.variants.some((variant) => variant.availability === "available")) {
    return "available" as const;
  }
  if (product.variants.some((variant) => variant.availability === "coming-soon")) {
    return "coming-soon" as const;
  }
  return "discontinued" as const;
}

/**
 * Gradeability as the manufacturer published it.
 *
 * A brand states the climb either as a percentage or as an angle, never both,
 * and the two are not interchangeable without doing arithmetic the brand did
 * not do. So whichever field carries a value is the one rendered, degrees
 * first because that is the more commonly published form; `null` when neither
 * has been confirmed, which every caller renders as the pending placeholder.
 */
export function formatGradeability(specs: ProductSpecs): string | null {
  if (specs.gradeabilityDegrees != null) return `${specs.gradeabilityDegrees}\u00b0`;
  if (specs.gradeabilityPercent != null) return `${specs.gradeabilityPercent}%`;
  return null;
}

/* -------------------------------------------------------------------------- */
/* Features                                                                    */
/* -------------------------------------------------------------------------- */

export interface ProductFeatures {
  smart: FeatureDefinition[];
  safety: FeatureDefinition[];
  comfort: FeatureDefinition[];
  all: FeatureDefinition[];
  /** True when the model advertises no features at all. */
  isEmpty: boolean;
}

/**
 * Resolves a model's declared feature ids into catalogue entries.
 *
 * Only ids the model actually declares are returned, so a component rendering
 * this cannot show a feature the model does not have.
 */
export function getProductFeatures(product: Product): ProductFeatures {
  const smart = resolveFeatures(product.smartFeatures as FeatureId[]);
  const safety = resolveFeatures(product.safetyFeatures as FeatureId[]);
  const comfort = resolveFeatures(product.comfortFeatures as FeatureId[]);
  const all = [...smart, ...safety, ...comfort];

  return { smart, safety, comfort, all, isEmpty: all.length === 0 };
}

/** True when the model declares the given feature. */
export function hasFeature(product: Product, id: FeatureId): boolean {
  return (
    product.smartFeatures.includes(id as never) ||
    product.safetyFeatures.includes(id as never) ||
    product.comfortFeatures.includes(id as never)
  );
}
