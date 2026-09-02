import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, IndianRupee } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { Breadcrumbs, type Crumb } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { FaqSection } from "@/components/sections/faq-section";
import { ProductProvider } from "@/components/product/product-provider";
import { ProductHero } from "@/components/product/product-hero";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductHighlights } from "@/components/product/product-highlights";
import { FeatureGrid } from "@/components/product/feature-grid";
import { ColorSwatches } from "@/components/product/color-swatches";
import { SpecTable } from "@/components/product/spec-table";
import { ProductBaas } from "@/components/product/product-baas";
import { RelatedProducts } from "@/components/product/related-products";
import {
  getProductBySlug,
  getProductFeatures,
  getProducts,
  getProductSlugs,
  getRelatedProducts,
  resolveVariant,
} from "@/lib/products";
import {
  breadcrumbJsonLd,
  faqSchema,
  localKeywords,
  productJsonLd,
} from "@/lib/seo";
import { homepageFaqs, type Faq } from "@/data/faqs";
import { absoluteUrl, siteConfig } from "@/config/site";
import { DEALERSHIP_NAME, brandedModel } from "@/lib/brand";

/**
 * One implementation for every model.
 *
 * Nothing here knows which scooter it is rendering — model, variants,
 * specifications, features, colours, gallery and FAQs all arrive from product
 * data. Adding a sixth model means adding a data file; this file does not
 * change.
 */

type PageParams = { params: Promise<{ slug: string }> };

/**
 * The lineup is fully known at build time, so any slug outside it is a genuine
 * 404 rather than something to render on demand. Without this, an unknown slug
 * returns HTTP 200 with not-found content — a soft 404 that search engines can
 * index.
 */
export const dynamicParams = false;

/** Prerenders every model at build time. */
export function generateStaticParams() {
  return getProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) return { title: "Model not found" };

  const { specs } = resolveVariant(product);
  const path = `/electric-scooters/${product.slug}`;

  // Only claim a figure in the description when it is actually confirmed.
  const facts = [
    specs.range.claimedKm != null ? `${specs.range.claimedKm} km claimed range` : null,
    specs.batteryCapacityKwh != null ? `${specs.batteryCapacityKwh} kWh battery` : null,
  ].filter(Boolean);

  const branded = brandedModel(product.name);

  const description = facts.length
    ? `${branded} electric scooter — ${facts.join(", ")}. ${product.description} Available at ${DEALERSHIP_NAME}, an authorized Lectrix EV dealership — book a test ride.`
    : `${product.description} See specifications, colours and features of the ${branded} at ${DEALERSHIP_NAME}, an authorized Lectrix EV dealership.`;

  const image = product.images.og ?? product.images.hero;

  return {
    title: `${branded} Electric Scooter`,
    description,
    keywords: localKeywords(product.name),
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: absoluteUrl(path),
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      title: `${branded} Electric Scooter | ${siteConfig.name}`,
      description,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${branded} Electric Scooter`,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function ModelPage({ params }: PageParams) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  // Schema and metadata describe the default variant — the one a visitor sees
  // first. Client-side variant switching updates the page, not the crawlable
  // markup, which is the correct trade-off for a statically rendered page.
  const { variant, specs } = resolveVariant(product);
  const features = getProductFeatures(product);
  const related = getRelatedProducts(product.slug);
  const catalogue = getProducts();

  const crumbs: Crumb[] = [
    { label: "Home", href: "/" },
    { label: "Electric Scooters", href: "/electric-scooters" },
    { label: brandedModel(product.name) },
  ];

  // Model-specific questions where the data supplies them, otherwise a general
  // spread. Product FAQs are filed under "models" so they carry a valid
  // category for the shared FAQ types.
  const faqs: Faq[] =
    product.faqs.length > 0
      ? product.faqs.map((faq) => ({ ...faq, category: "models" as const }))
      : homepageFaqs.slice(0, 5);

  return (
    <>
      <JsonLd data={productJsonLd(product, variant, specs)} />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={faqSchema(faqs)} />

      <Breadcrumbs items={crumbs} />

      <ProductProvider product={product}>
        <ProductHero catalogue={catalogue} />

        <Section tone="muted" compact>
          <SectionHeading
            eyebrow="Gallery"
            title={`A closer look at the ${brandedModel(product.name)}`}
            description={product.description}
          />
          <div className="mt-10">
            <ProductGallery images={product.gallery} productName={product.name} />
          </div>
        </Section>

        <Section>
          <SectionHeading
            eyebrow="The numbers"
            title="Performance, battery, range and charging"
            description="Figures shown are for the variant selected above. Switch variant to see how they change."
          />
          <div className="mt-10">
            <ProductHighlights />
          </div>
        </Section>

        <Section tone="muted">
          <SectionHeading
            eyebrow="Technology"
            title="Connected features"
            description={`What the ${product.name} offers through the Lectrix EV mobile app.`}
          />
          <div className="mt-10">
            <FeatureGrid
              features={features.smart}
              emptyMessage={`Connected features for the ${product.name} are being confirmed with Lectrix EV. Ask the showroom what this model supports.`}
            />
          </div>
        </Section>

        <Section>
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-12">
            <div>
              <SectionHeading eyebrow="Safety" title="Built to keep you safe" />
              <div className="mt-8">
                <FeatureGrid
                  features={features.safety}
                  columns={2}
                  emptyMessage={`Safety equipment for the ${product.name} is being confirmed with Lectrix EV. We will not list a feature until we know this model has it.`}
                />
              </div>
            </div>

            <div>
              <SectionHeading eyebrow="Comfort & storage" title="Made for everyday riding" />
              <div className="mt-8">
                <FeatureGrid
                  features={features.comfort}
                  columns={2}
                  emptyMessage={`Comfort and storage details for the ${product.name} are being confirmed with Lectrix EV.`}
                />
              </div>
            </div>
          </div>
        </Section>

        <Section tone="muted">
          <SectionHeading
            eyebrow="Colours"
            title={`Pick your ${brandedModel(product.name)}`}
            description="Finishes available on the selected variant."
          />
          <div className="mt-10">
            <ColorSwatches />
          </div>
        </Section>

        <Section id="specifications">
          <SectionHeading
            eyebrow="Specifications"
            title="Every figure, in one place"
            description="The full specification sheet for the variant you have selected."
          />
          <div className="mt-10">
            <SpecTable />
          </div>
        </Section>

        <Container className="py-4">
          <ProductBaas />
        </Container>
      </ProductProvider>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Compare"
          title="Other models to consider"
          description={`See how the ${brandedModel(product.name)} lines up against the rest of the Lectrix EV range — every model is available at ${DEALERSHIP_NAME}.`}
          action={
            <Button asChild variant="outline" size="lg">
              <Link href={`/compare?models=${product.slug}`}>
                Compare models
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          }
        />
        <div className="mt-12">
          <RelatedProducts products={related} />
        </div>
      </Section>

      <FaqSection
        faqs={faqs}
        title={`${product.name} questions`}
        description={`The things customers ask us most often about the ${product.name}. If yours is not here, call the showroom.`}
      />

      <Section tone="inverse">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-display-lg">Ride the {product.name}</h2>
          <p className="text-on-inverse-muted mt-5 text-lead text-pretty">
            Test rides are free and take about fifteen minutes. Bring your licence — we
            will have the {product.name} charged and ready.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="brand" size="xl">
              <Link href={`/book-test-ride?model=${product.slug}`}>Book Test Ride</Link>
            </Button>
            <Button asChild variant="outline-inverse" size="xl">
              <Link href={`/on-road-price?model=${product.slug}`}>
                <IndianRupee aria-hidden />
                Get On-Road Price
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
