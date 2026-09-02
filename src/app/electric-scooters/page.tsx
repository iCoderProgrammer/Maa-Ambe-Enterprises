import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { Breadcrumbs, type Crumb } from "@/components/common/breadcrumbs";
import { Stagger, StaggerItem } from "@/components/common/motion";
import { JsonLd } from "@/components/seo/json-ld";
import { ProductCard } from "@/components/product/product-card";
import { getProducts } from "@/lib/products";
import { breadcrumbJsonLd, itemListJsonLd, localKeywords } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { DEALERSHIP_NAME } from "@/lib/brand";

const title = "Lectrix EV Electric Scooters";
const description = `Browse the complete Lectrix EV electric scooter lineup at ${DEALERSHIP_NAME} — NDuro, LXS 3.0, LXS 2.0, ZYRO and SX25. Compare range, battery and price, then book a free test ride.`;

export const metadata: Metadata = {
  title,
  description,
  keywords: localKeywords(),
  alternates: { canonical: "/electric-scooters" },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/electric-scooters`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: `${title} | ${siteConfig.name}`,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
};

const crumbs: Crumb[] = [
  { label: "Home", href: "/" },
  { label: "Electric Scooters" },
];

/** The full lineup. Every card is built from product data. */
export default function ElectricScootersPage() {
  const products = getProducts();
  const awaitingSpecs = products.some((product) => !product.dataStatus.specsConfirmed);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={itemListJsonLd(products)} />

      <Breadcrumbs items={crumbs} />

      <Section>
        <SectionHeading
          as="h1"
          eyebrow="The lineup"
          title={`Explore Lectrix EV at ${DEALERSHIP_NAME}`}
          description={description}
          action={
            <Button asChild variant="outline" size="lg">
              <Link href="/compare">
                Compare models
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
    </>
  );
}
