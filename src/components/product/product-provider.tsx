"use client";

import * as React from "react";

import type {
  BaasTerms,
  GalleryImage,
  Product,
  ProductColor,
  ProductImages,
  ProductSpecs,
  ProductVariant,
} from "@/types/product";
import { resolveVariant } from "@/lib/products";

interface ProductContextValue {
  product: Product;
  variant: ProductVariant;
  /** Baseline merged with the selected variant's overrides. */
  specs: ProductSpecs;
  colors: ProductColor[];
  baas: BaasTerms | null;
  /** Variant artwork where it exists, the model's where it does not. */
  images: ProductImages;
  /** The variant's own gallery, or the model's. */
  gallery: GalleryImage[];
  setVariantId: (id: string) => void;
}

const ProductContext = React.createContext<ProductContextValue | null>(null);

/**
 * The query string only ever changes here through our own `replaceState`, which
 * already re-renders via state, so there is nothing to subscribe to. A `popstate`
 * listener would fire on back/forward — but `replaceState` writes no history
 * entry, so there is no entry to go back to.
 */
const subscribeToNothing = () => () => {};

/** Returns a plain string, so React's `Object.is` snapshot check is stable. */
function readVariantFromUrl(): string | null {
  return new URLSearchParams(window.location.search).get("variant");
}

/**
 * Holds the selected variant for a model page.
 *
 * The provider is a client component, but its children are passed in from the
 * server page, so only the leaves that actually read a variant-dependent value
 * ship JavaScript. Everything else — feature grids, FAQ, section headings,
 * related models — stays server-rendered.
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
  /**
   * The variant named in `?variant=`, or null.
   *
   * `useSyncExternalStore` rather than `useSearchParams`, on purpose. This
   * provider wraps the entire model page, and `useSearchParams` on a prerendered
   * route pushes everything up to the nearest Suspense boundary into client
   * rendering — which here would be the whole page, costing the static HTML that
   * makes it fast and indexable. The server snapshot is null, so the served
   * markup describes the default variant exactly as before and prerendering is
   * untouched; React swaps in the client value after hydration without a
   * mismatch, and without the cascading re-render that reading this in an effect
   * would cause.
   *
   * This is what makes the 308s from the retired `/electric-scooters/lxs-2-0`
   * and `/lxs-3-0` URLs land on the right variant, and what lets a customer send
   * someone a link to the exact one they were looking at.
   */
  const urlVariantId = React.useSyncExternalStore(
    subscribeToNothing,
    readVariantFromUrl,
    () => null
  );

  const [chosenId, setChosenId] = React.useState<string | null>(null);

  // An explicit click always outranks the URL; the URL outranks the default.
  // An id matching no variant is ignored rather than falling through silently —
  // showing a different variant than the URL names is worse than ignoring it.
  const requestedId = chosenId ?? urlVariantId;
  const variantId =
    requestedId != null && product.variants.some((v) => v.id === requestedId)
      ? requestedId
      : product.defaultVariantId;

  /**
   * Keeps the URL honest once the visitor starts switching.
   *
   * `replaceState` rather than a router navigation: nothing on the server
   * depends on this parameter, so re-running the route would be pure cost, and
   * pushing history would turn one page visit into a stack of near-identical
   * entries that the back button has to walk through.
   */
  const selectVariant = React.useCallback((id: string) => {
    setChosenId(id);

    const url = new URL(window.location.href);
    url.searchParams.set("variant", id);
    window.history.replaceState(window.history.state, "", url);
  }, []);

  // One resolver for the whole page, so the hero image, the gallery, the spec
  // sheet and the BaaS block can never disagree about which variant is on
  // screen.
  const value = React.useMemo<ProductContextValue>(
    () => ({ ...resolveVariant(product, variantId), setVariantId: selectVariant }),
    [product, variantId, selectVariant]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProduct(): ProductContextValue {
  const context = React.useContext(ProductContext);

  if (!context) {
    throw new Error("useProduct must be used inside a <ProductProvider>");
  }

  return context;
}
