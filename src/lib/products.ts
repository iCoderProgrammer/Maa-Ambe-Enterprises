import type { Product, ProductVariant } from "@/types/product";
import { products } from "@/data/products";
import { getStartingPrice, isBaasAvailable } from "@/lib/product-utils";
import { MAX_COMPARE } from "@/lib/compare";

/**
 * Catalogue access.
 *
 * The pure, catalogue-free helpers live in `src/lib/product-utils.ts` and are
 * re-exported at the bottom of this file, so importing from `@/lib/products`
 * still gives you everything. Client components that only need the pure helpers
 * should import `@/lib/product-utils` directly — that path carries no data and
 * no Zod.
 */

/* -------------------------------------------------------------------------- */
/* Lookup                                                                      */
/* -------------------------------------------------------------------------- */

/** All models, in lineup order. */
export function getProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

/** Every slug — used by `generateStaticParams` and the sitemap. */
export function getProductSlugs(): string[] {
  return products.map((product) => product.slug);
}

/** Models highlighted on the homepage. Falls back to the first few. */
export function getFeaturedProducts(limit = 3): Product[] {
  const featured = products.filter((product) => product.featured);
  return (featured.length > 0 ? featured : products).slice(0, limit);
}

export function getProductVariants(slug: string): ProductVariant[] {
  return getProductBySlug(slug)?.variants ?? [];
}

/** Models offered on Battery-as-a-Service. */
export function getBaasProducts(): Product[] {
  return products.filter(isBaasAvailable);
}

/** Models with at least one variant a customer can buy today. */
export function getAvailableProducts(): Product[] {
  return products.filter((product) =>
    product.variants.some((variant) => variant.availability === "available")
  );
}

/**
 * Models worth putting beside this one on the compare page.
 *
 * Ordered by how useful the comparison actually is: same category first, then
 * whichever remaining models sit closest in price. Models with no confirmed
 * price sort last rather than being treated as free — an unpriced model is not
 * a cheap one. The current model is always excluded.
 */
export function getComparableProducts(slug: string, limit = MAX_COMPARE - 1): Product[] {
  const current = getProductBySlug(slug);
  const others = products.filter((product) => product.slug !== slug);
  if (!current) return others.slice(0, limit);

  const currentPrice = getStartingPrice(current);

  const distance = (product: Product): number => {
    const price = getStartingPrice(product);
    if (price == null || currentPrice == null) return Number.MAX_SAFE_INTEGER;
    return Math.abs(price - currentPrice);
  };

  return [...others]
    .sort((a, b) => {
      const categoryRank =
        Number(b.category === current.category) - Number(a.category === current.category);
      if (categoryRank !== 0) return categoryRank;

      const byPrice = distance(a) - distance(b);
      return byPrice !== 0 ? byPrice : a.order - b.order;
    })
    .slice(0, limit);
}

export function getRelatedProducts(slug: string, limit = 3): Product[] {
  const current = getProductBySlug(slug);
  if (!current) return getProducts().slice(0, limit);

  const sameCategory = products.filter(
    (product) => product.slug !== slug && product.category === current.category
  );
  const others = products.filter(
    (product) => product.slug !== slug && product.category !== current.category
  );

  return [...sameCategory, ...others].slice(0, limit);
}

/* -------------------------------------------------------------------------- */
/* Re-exports                                                                  */
/* -------------------------------------------------------------------------- */

export {
  getVariant,
  getDefaultVariant,
  resolveSpecs,
  getVariantColors,
  resolveVariant,
  variantHasOverrides,
  getStartingPrice,
  getMaxRange,
  getMaxTopSpeed,
  isBaasAvailable,
  getProductAvailability,
  getProductFeatures,
  hasFeature,
} from "@/lib/product-utils";
export type { ProductFeatures } from "@/lib/product-utils";

export { compareProducts, MAX_COMPARE } from "@/lib/compare";
export type { Comparison, CompareRow, CompareGroup } from "@/lib/compare";
