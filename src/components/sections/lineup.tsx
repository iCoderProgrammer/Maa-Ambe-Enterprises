import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { Stagger, StaggerItem } from "@/components/common/motion";
import { ProductCard } from "@/components/product/product-card";
import { getProducts } from "@/lib/products";

/** Homepage lineup grid. Reads every model from product data. */
export function Lineup() {
  const products = getProducts();
  const awaitingSpecs = products.some((product) => !product.dataStatus.specsConfirmed);

  return (
    <Section id="lineup" tone="muted">
      <SectionHeading
        eyebrow="The lineup"
        title="Explore Lectrix EV"
        description="From an easy first electric scooter to a long-range daily commuter — compare the range, battery and price of every Lectrix EV model available at our showroom."
        action={
          <Button asChild variant="outline" size="lg">
            <Link href="/electric-scooters">
              View all models
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        }
      />

      <Stagger
        as="ul"
        className="mt-12 grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3"
        stagger={0.07}
      >
        {products.map((product, index) => (
          <StaggerItem as="li" key={product.slug} className="flex">
            <ProductCard product={product} className="w-full" priority={index < 3} />
          </StaggerItem>
        ))}
      </Stagger>

      {awaitingSpecs ? (
        <p className="text-muted-foreground mt-8 text-xs">
          Specifications and prices marked “—” are being confirmed with Lectrix EV.
          Call the showroom for current figures on any model.
        </p>
      ) : null}
    </Section>
  );
}
