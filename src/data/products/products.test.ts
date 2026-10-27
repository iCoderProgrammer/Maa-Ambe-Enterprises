import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  formatBatteryCapacity,
  getProductBySlug,
  getProducts,
  getProductSlugs,
  getStartingPrice,
  resolveGallery,
  resolveImages,
  resolveSpecs,
  resolveVariant,
} from "@/lib/products";

/**
 * Catalogue coverage and integrity.
 *
 * The Zod schema in `src/schemas/product.ts` already fails the build on a
 * malformed record. What it cannot check is whether the catalogue still matches
 * the lineup Lectrix EV actually sells, and whether the paths in it point at
 * files that exist. Those are the two ways this data goes wrong in practice —
 * a model quietly disappearing during a refactor, and an image path that 404s
 * on the customer's screen but never during development, because a missing
 * `public/` file is not a build error.
 *
 * Every expectation below is checked against lectrixev.com, not invented here.
 */

const PUBLIC_DIR = path.resolve(import.meta.dirname, "../../../public");

/** The lineup as the manufacturer lists it: model slug → its variant ids. */
const EXPECTED_LINEUP: Record<string, string[]> = {
  nduro: ["nduro-2-0", "nduro-3-0", "nduro-baas"],
  lxs: ["lxs-2-0", "lxs-3-0", "lxs-baas"],
  zyro: ["zyro-li", "zyro-la-60v", "zyro-la-48v"],
  sx25: ["sx25-lead-acid", "sx25-lithium-ion"],
};

/** Figures Lectrix EV publishes per variant. `undefined` = not published. */
const PUBLISHED: Record<
  string,
  { range: number | null; topSpeed: number | null; battery: string | null }
> = {
  "nduro-2-0": { range: 90, topSpeed: 65, battery: "2.3 kWh" },
  "nduro-3-0": { range: 117, topSpeed: 65, battery: "3.0 kWh" },
  "nduro-baas": { range: 90, topSpeed: 65, battery: "2.3 kWh" },
  "lxs-2-0": { range: 98, topSpeed: 55, battery: "2.3 kWh" },
  "lxs-3-0": { range: 120, topSpeed: 55, battery: "3.0 kWh" },
  "lxs-baas": { range: 100, topSpeed: 55, battery: "2.3 kWh" },
  "zyro-li": { range: 85, topSpeed: 25, battery: "30 Ah" },
  "zyro-la-60v": { range: 75, topSpeed: 25, battery: "60V" },
  "zyro-la-48v": { range: 60, topSpeed: 25, battery: "48V" },
  "sx25-lead-acid": { range: 60, topSpeed: 25, battery: "1.5 kWh" },
  "sx25-lithium-ion": { range: 60, topSpeed: 25, battery: "1.5 kWh" },
};

describe("lineup coverage", () => {
  it("carries exactly the models Lectrix EV sells", () => {
    expect(getProductSlugs().sort()).toEqual(Object.keys(EXPECTED_LINEUP).sort());
  });

  it.each(Object.entries(EXPECTED_LINEUP))(
    "%s carries its published variants",
    (slug, variantIds) => {
      const product = getProductBySlug(slug);
      expect(product).toBeDefined();
      expect(product!.variants.map((variant) => variant.id)).toEqual(variantIds);
    }
  );

  it("resolves an unknown slug to undefined so the page can 404", () => {
    // `dynamicParams = false` turns this into a real 404 rather than a soft one.
    expect(getProductBySlug("lxs-3-0")).toBeUndefined();
    expect(getProductBySlug("nonexistent")).toBeUndefined();
  });

  it("defaults every model to a variant it actually has", () => {
    for (const product of getProducts()) {
      const ids = product.variants.map((variant) => variant.id);
      expect(ids).toContain(product.defaultVariantId);
    }
  });
});

describe("published figures", () => {
  it.each(Object.entries(PUBLISHED))(
    "%s resolves to the figures Lectrix EV publishes",
    (variantId, expected) => {
      const product = getProducts().find((candidate) =>
        candidate.variants.some((variant) => variant.id === variantId)
      )!;
      const specs = resolveSpecs(product, variantId);

      expect(specs.range.claimedKm).toBe(expected.range);
      expect(specs.topSpeedKmph).toBe(expected.topSpeed);
      expect(formatBatteryCapacity(specs)).toBe(expected.battery);
    }
  );

  it("never converts an Ah or voltage pack into kWh", () => {
    // Converting "30 Ah" needs a pack voltage the brand does not publish, and a
    // bare "48V" is not a capacity at all. Both must stay out of the kWh field.
    for (const variantId of ["zyro-li", "zyro-la-60v", "zyro-la-48v"]) {
      const specs = resolveSpecs(getProductBySlug("zyro")!, variantId);
      expect(specs.batteryCapacityKwh).toBeNull();
      expect(specs.batteryCapacityLabel).not.toBeNull();
    }
  });
});

describe("variant switching", () => {
  it("changes range and battery between the LXS 2.0 and 3.0", () => {
    const lxs = getProductBySlug("lxs")!;
    const two = resolveVariant(lxs, "lxs-2-0");
    const three = resolveVariant(lxs, "lxs-3-0");

    expect(two.specs.range.claimedKm).not.toBe(three.specs.range.claimedKm);
    expect(two.specs.batteryCapacityKwh).not.toBe(three.specs.batteryCapacityKwh);
    expect(two.images.hero).not.toBe(three.images.hero);
    expect(two.gallery[0].src).not.toBe(three.gallery[0].src);
  });

  it("keeps shared figures identical across variants that share them", () => {
    const lxs = getProductBySlug("lxs")!;
    // Both are 55 km/h — the variants differ in range, not in speed.
    expect(resolveSpecs(lxs, "lxs-2-0").topSpeedKmph).toBe(
      resolveSpecs(lxs, "lxs-3-0").topSpeedKmph
    );
  });

  it("falls back to the model's artwork when a variant has none of its own", () => {
    // NDuro has real photography and no per-variant shots, so every variant
    // must resolve to the model's images rather than to a blank.
    const nduro = getProductBySlug("nduro")!;
    for (const variant of nduro.variants) {
      expect(resolveImages(nduro, variant.id)).toEqual(nduro.images);
      expect(resolveGallery(nduro, variant.id)).toEqual(nduro.gallery);
    }
  });

  it("offers BaaS terms only on the variants that actually carry them", () => {
    const withBaas = getProducts().flatMap((product) =>
      product.variants.filter((variant) => variant.baas != null).map((v) => v.id)
    );
    expect(withBaas.sort()).toEqual(["lxs-baas", "nduro-baas"]);
  });
});

describe("pricing", () => {
  it("uses the manufacturer's published starting price over the variant minimum", () => {
    // ZYRO LI is the only priced ZYRO variant at ₹67,500, but Lectrix EV
    // advertises the model from ₹51,741. Taking the minimum of what we know
    // would overstate the entry price by ₹15,759.
    const zyro = getProductBySlug("zyro")!;
    expect(getStartingPrice(zyro)).toBe(51741);
    expect(getStartingPrice(getProductBySlug("sx25")!)).toBe(54999);
  });

  it("falls back to the lowest confirmed variant price when none is published", () => {
    expect(getStartingPrice(getProductBySlug("lxs")!)).toBe(84990);
  });

  it("returns null rather than zero for a model with no confirmed price", () => {
    expect(getStartingPrice(getProductBySlug("nduro")!)).toBeNull();
  });

  it("never publishes a starting price above a variant's own price", () => {
    for (const product of getProducts()) {
      if (product.publishedStartingPrice == null) continue;

      for (const variant of product.variants) {
        if (variant.price == null) continue;
        expect(variant.price).toBeGreaterThanOrEqual(product.publishedStartingPrice);
      }
    }
  });
});

describe("imagery", () => {
  /** Every path the catalogue can render, model-level and variant-level. */
  const imagePaths = getProducts().flatMap((product) => {
    const paths = [
      product.images.card,
      product.images.hero,
      product.images.og,
      ...product.gallery.map((image) => image.src),
      ...product.colors.map((color) => color.image),
    ];

    for (const variant of product.variants) {
      const resolved = resolveImages(product, variant.id);
      paths.push(resolved.card, resolved.hero, resolved.og);
      paths.push(...resolveGallery(product, variant.id).map((image) => image.src));
    }

    return paths.filter((src): src is string => src != null);
  });

  it("references files that exist, so nothing renders as a broken image", () => {
    const missing = [...new Set(imagePaths)].filter(
      (src) => !existsSync(path.join(PUBLIC_DIR, src))
    );
    expect(missing).toEqual([]);
  });

  it("serves every image locally, since the optimizer allows no remote hosts", () => {
    // `next.config.ts` sets no `remotePatterns` on purpose. A CDN URL slipping
    // into product data would throw at render rather than degrade.
    for (const src of imagePaths) {
      expect(src.startsWith("/")).toBe(true);
    }
  });

  it("flags a model as awaiting photography unless it has a card image", () => {
    for (const product of getProducts()) {
      if (product.dataStatus.imagesSupplied) {
        expect(product.images.card).not.toBeNull();
      }
    }
  });
});
