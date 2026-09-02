import { z } from "zod";

import { knownFeatureIds } from "@/data/feature-catalog";
import type { Product } from "@/types/product";

/**
 * Runtime validation for product data.
 *
 * The TypeScript types catch shape errors at compile time; this catches the
 * things types cannot — a `defaultVariantId` pointing at a variant that was
 * deleted, a duplicate slug, a feature id that is not in the catalogue, a
 * negative price, a `colorIds` entry with no matching colour. Product data is
 * hand-edited by people who are not looking at the type definitions, so these
 * are the realistic failures.
 *
 * Validation runs once when `src/data/products/index.ts` is imported, which on
 * a fully static site means it runs at build time: a bad edit fails the build
 * instead of shipping.
 */

const featureIdSchema = z.enum(knownFeatureIds as [string, ...string[]]);

/** Non-negative and finite, or explicitly unconfirmed. */
const measurement = z.number().finite().nonnegative().nullable();

const rangeSchema = z.object({
  claimedKm: measurement,
  realWorldKm: measurement,
});

const chargingSchema = z.object({
  fullChargeHours: measurement,
  eightyPercentHours: measurement,
  chargerType: z.string().min(1).nullable(),
});

const motorSchema = z.object({
  type: z.string().min(1).nullable(),
  ratedPowerW: measurement,
  peakPowerW: measurement,
});

const specsShape = {
  batteryCapacityKwh: measurement,
  batteryRemovable: z.boolean().nullable(),
  batteryChemistry: z.string().min(1).nullable(),
  range: rangeSchema,
  topSpeedKmph: measurement,
  accelerationSeconds: measurement,
  charging: chargingSchema,
  motor: motorSchema,
  gradeabilityPercent: measurement,
  gradeabilityDegrees: measurement,
  ipRating: z.string().min(1).nullable(),
  bootSpaceLitres: measurement,
  kerbWeightKg: measurement,
  ridingModes: z.array(z.string().min(1)),
};

const specsSchema = z.object(specsShape);

/** A variant may override any subset of the baseline. */
const variantSpecOverridesSchema = z.object(specsShape).partial();

const availabilitySchema = z.enum(["available", "coming-soon", "discontinued"]);

const baasSchema = z.object({
  vehiclePrice: measurement,
  monthlySubscription: measurement,
  minimumTermMonths: measurement,
});

const variantSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Variant ids must be lowercase kebab-case"),
  name: z.string().min(1),
  price: measurement,
  availability: availabilitySchema,
  specs: variantSpecOverridesSchema,
  baas: baasSchema.nullable(),
  colorIds: z.array(z.string().min(1)).optional(),
});

const colorSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Colour must be a 6-digit hex value"),
  image: z.string().min(1).nullable(),
});

const warrantyTermSchema = z.object({
  years: measurement,
  kilometres: measurement,
});

const galleryImageSchema = z.object({
  src: z.string().min(1),
  /** Empty alt text is an accessibility failure, so it is rejected here. */
  alt: z.string().min(1, "Gallery images need descriptive alt text"),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const productSchema = z
  .object({
    slug: z
      .string()
      .min(1)
      .regex(/^[a-z0-9-]+$/, "Slugs must be lowercase kebab-case"),
    name: z.string().min(1),
    tagline: z.string().min(1),
    description: z.string().min(1),
    category: z.enum(["performance", "commuter", "entry"]),
    order: z.number().int().nonnegative(),
    featured: z.boolean(),

    specs: specsSchema,
    variants: z.array(variantSchema).min(1, "A model needs at least one variant"),
    defaultVariantId: z.string().min(1),

    smartFeatures: z.array(featureIdSchema),
    safetyFeatures: z.array(featureIdSchema),
    comfortFeatures: z.array(featureIdSchema),

    colors: z.array(colorSchema),
    images: z.object({
      card: z.string().min(1).nullable(),
      hero: z.string().min(1).nullable(),
      og: z.string().min(1).nullable(),
    }),
    gallery: z.array(galleryImageSchema),
    warranty: z.object({
      vehicle: warrantyTermSchema.nullable(),
      battery: warrantyTermSchema.nullable(),
      notes: z.string().min(1).nullable(),
    }),

    faqs: z.array(
      z.object({ question: z.string().min(1), answer: z.string().min(1) })
    ),
    dataStatus: z.object({
      specsConfirmed: z.boolean(),
      pricingConfirmed: z.boolean(),
      featuresConfirmed: z.boolean(),
      warrantyConfirmed: z.boolean(),
      colorsConfirmed: z.boolean(),
      imagesSupplied: z.boolean(),
    }),
  })
  .superRefine((product, ctx) => {
    const variantIds = product.variants.map((variant) => variant.id);

    if (new Set(variantIds).size !== variantIds.length) {
      ctx.addIssue({
        code: "custom",
        path: ["variants"],
        message: "Variant ids must be unique within a model",
      });
    }

    if (!variantIds.includes(product.defaultVariantId)) {
      ctx.addIssue({
        code: "custom",
        path: ["defaultVariantId"],
        message: `defaultVariantId "${product.defaultVariantId}" matches no variant (${variantIds.join(", ")})`,
      });
    }

    const colorIds = new Set(product.colors.map((color) => color.id));
    product.variants.forEach((variant, index) => {
      variant.colorIds?.forEach((colorId) => {
        if (!colorIds.has(colorId)) {
          ctx.addIssue({
            code: "custom",
            path: ["variants", index, "colorIds"],
            message: `Colour "${colorId}" is not defined in this model's colors`,
          });
        }
      });
    });

    // A model claiming confirmed pricing must actually carry a price.
    if (
      product.dataStatus.pricingConfirmed &&
      product.variants.every((variant) => variant.price == null)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["dataStatus", "pricingConfirmed"],
        message: "Pricing is marked confirmed but no variant has a price",
      });
    }

    // Likewise for images, so a stale flag cannot hide a missing asset.
    if (product.dataStatus.imagesSupplied && product.images.card == null) {
      ctx.addIssue({
        code: "custom",
        path: ["dataStatus", "imagesSupplied"],
        message: "Images are marked supplied but images.card is missing",
      });
    }
  });

/**
 * Validates a catalogue and returns it typed.
 * Reports every problem found, not just the first.
 */
export function validateProducts(input: unknown[]): Product[] {
  const problems: string[] = [];
  const slugs = new Set<string>();

  input.forEach((candidate, index) => {
    const result = productSchema.safeParse(candidate);

    if (!result.success) {
      for (const issue of result.error.issues) {
        const path = issue.path.join(".") || "(root)";
        problems.push(`  products[${index}].${path}: ${issue.message}`);
      }
      return;
    }

    if (slugs.has(result.data.slug)) {
      problems.push(`  products[${index}].slug: duplicate slug "${result.data.slug}"`);
    }
    slugs.add(result.data.slug);
  });

  if (problems.length > 0) {
    throw new Error(
      `Invalid product data — ${problems.length} problem(s) found:\n${problems.join("\n")}`
    );
  }

  return input as Product[];
}
