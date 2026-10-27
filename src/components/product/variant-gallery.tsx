"use client";

import { ProductGallery } from "@/components/product/product-gallery";
import { useProduct } from "@/components/product/product-provider";

/**
 * The model gallery, bound to the selected variant.
 *
 * `ProductGallery` stays a pure presentational component that takes an image
 * list, so it can be reused anywhere a set of shots needs showing. This is the
 * one-line adapter that feeds it the CURRENT variant's gallery — a variant with
 * its own photography shows that photography, and one without falls back to the
 * model's. Splitting it this way keeps the client boundary at the smallest
 * component that genuinely needs to react to the variant.
 */
export function VariantGallery() {
  const { product, variant, gallery } = useProduct();

  return (
    <ProductGallery
      // Remounting on variant change resets the selected thumbnail, which is
      // correct: index 2 of the LXS 2.0 rail is not index 2 of the 3.0's.
      key={variant.id}
      images={gallery}
      productName={`${product.name} ${variant.name}`}
    />
  );
}
