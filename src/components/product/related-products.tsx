import { ProductCard } from "@/components/product/product-card";
import { Stagger, StaggerItem } from "@/components/common/motion";
import type { Product } from "@/types/product";

/** "Compare with other models" rail. Server-rendered — no interactivity needed. */
export function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <Stagger
      as="ul"
      className="grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3"
      stagger={0.07}
    >
      {products.map((product) => (
        <StaggerItem as="li" key={product.slug} className="flex">
          <ProductCard product={product} className="w-full" />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
