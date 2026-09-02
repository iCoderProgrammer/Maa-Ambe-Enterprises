"use client";

import * as React from "react";

import type { Product, ProductVariant, ProductSpecs, ProductColor, BaasTerms } from "@/types/product";
import { getVariant, getVariantColors, resolveSpecs } from "@/lib/products";

interface ProductContextValue {
  product: Product;
  variant: ProductVariant;
  /** Baseline merged with the selected variant's overrides. */
  specs: ProductSpecs;
  colors: ProductColor[];
  baas: BaasTerms | null;
  setVariantId: (id: string) => void;
}

const ProductContext = React.createContext<ProductContextValue | null>(null);

/**
 * Holds the selected variant for a model page.
 *
 * The provider is a client component, but its children are passed in from the
 * server page, so only the leaves that actually read a variant-dependent value
 * ship JavaScript. Everything else — gallery, feature grids, FAQ, related
 * models — stays server-rendered.
 *
 * `Product` is plain serialisable data (no functions, no icons), so handing the
 * whole record across the boundary is safe and keeps every derived figure
 * consistent with the same resolution logic the server uses.
 */
export function ProductProvider({
  product,
  children,
}: {
  product: Product;
  children: React.ReactNode;
}) {
  const [variantId, setVariantId] = React.useState(product.defaultVariantId);

  const value = React.useMemo<ProductContextValue>(() => {
    const variant = getVariant(product, variantId);

    return {
      product,
      variant,
      specs: resolveSpecs(product, variant.id),
      colors: getVariantColors(product, variant.id),
      baas: variant.baas,
      setVariantId,
    };
  }, [product, variantId]);

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProduct(): ProductContextValue {
  const context = React.useContext(ProductContext);

  if (!context) {
    throw new Error("useProduct must be used inside a <ProductProvider>");
  }

  return context;
}
