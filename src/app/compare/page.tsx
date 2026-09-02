import type { Metadata } from "next";
import { Suspense } from "react";

import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { Breadcrumbs, type Crumb } from "@/components/common/breadcrumbs";
import { SectionSkeleton } from "@/components/common/loading";
import { JsonLd } from "@/components/seo/json-ld";
import { CompareClient } from "@/components/compare/compare-client";
import { getProducts } from "@/lib/products";
import { MAX_COMPARE } from "@/lib/compare";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { DEALERSHIP_NAME } from "@/lib/brand";

const title = "Compare Lectrix EV Electric Scooters";
const description = `Compare up to three Lectrix EV electric scooters side by side — price, range, battery, charging, motor, storage, features and warranty in one view. Every model is available at ${DEALERSHIP_NAME}.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/compare" },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/compare`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: `${title} | ${siteConfig.name}`,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
};

const crumbs: Crumb[] = [
  { label: "Home", href: "/" },
  { label: "Compare" },
];

/**
 * The page stays statically rendered: the catalogue is read on the server and
 * handed to the client component, which owns selection via the URL.
 *
 * The heading is deliberately OUTSIDE the `Suspense` boundary. `useSearchParams`
 * suspends during prerender, so anything inside it is absent from the served
 * HTML — putting the `h1` there left the page with no heading at all until
 * hydration.
 */
export default function ComparePage() {
  const catalogue = getProducts();

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={itemListJsonLd(catalogue)} />

      <Breadcrumbs items={crumbs} />

      <Section compact className="pb-0">
        <SectionHeading
          as="h1"
          eyebrow="Compare Lectrix EV"
          title="Put them side by side"
          description={`Choose up to ${MAX_COMPARE} Lectrix EV models and compare price, range, battery, charging, features and warranty in one view. Book a test ride for any of them at ${DEALERSHIP_NAME}.`}
        />
      </Section>

      <Suspense
        fallback={
          <Container className="py-12">
            <SectionSkeleton rows={5} />
          </Container>
        }
      >
        <CompareClient catalogue={catalogue} />
      </Suspense>
    </>
  );
}
