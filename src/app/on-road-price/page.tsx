import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageCircle, Phone, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { Breadcrumbs, type Crumb } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { PriceEnquiryForm } from "@/components/forms/price-enquiry-form";
import { PriceBreakdownCard } from "@/components/finance/price-breakdown-card";
import { FinanceCalculator } from "@/components/finance/finance-calculator";
import { getProducts, getVariant } from "@/lib/products";
import { resolveBranch } from "@/lib/branches";
import { breadcrumbJsonLd } from "@/lib/seo";
import { dealership, telUrl, whatsappUrl } from "@/data/dealership";
import { siteConfig } from "@/config/site";
import { DEALERSHIP_NAME, brandedModel } from "@/lib/brand";

const title = "Get the Latest Lectrix EV On-Road Price";
const description = `Get the latest Lectrix EV on-road price for your city from ${DEALERSHIP_NAME}, including registration, insurance and any offers that apply — plus an estimated EMI for your budget.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/on-road-price" },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/on-road-price`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: `${title} | ${siteConfig.name}`,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
};

const crumbs: Crumb[] = [
  { label: "Home", href: "/" },
  { label: "On-Road Price" },
];

/**
 * Rendered on demand so `?model=` and `?variant=` are resolved on the server and
 * the form arrives preselected in the first response — the same reason
 * `/book-test-ride` is not prerendered.
 */
export default async function OnRoadPricePage({
  searchParams,
}: {
  searchParams: Promise<{
    model?: string;
    variant?: string;
    city?: string;
    branch?: string;
  }>;
}) {
  const products = getProducts();
  const { model, variant, city, branch } = await searchParams;

  const selected =
    products.find((product) => product.slug === model) ?? products[0];
  const selectedVariant = getVariant(selected, variant);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Breadcrumbs items={crumbs} />

      <Section>
        <SectionHeading
          as="h1"
          eyebrow="Pricing"
          title="Get the Latest Lectrix EV On-Road Price"
          description={`Talk to ${DEALERSHIP_NAME} for the latest pricing, offers and ownership assistance. Ex-showroom price is only part of what you pay — tell us your city and the model you want, and we will send you the full on-road figure with everything itemised.`}
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <div>
            <PriceEnquiryForm
              products={products}
              defaultBranch={resolveBranch(branch).branchId}
              defaultModel={selected.slug}
              defaultVariant={selectedVariant.id}
            />
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <PriceBreakdownCard
              modelSlug={selected.slug}
              modelName={brandedModel(selected.name)}
              variantId={selectedVariant.id}
              variantName={
                selected.variants.length > 1 ? selectedVariant.name : undefined
              }
              city={city}
            />
          </div>
        </div>
      </Section>

      <Section tone="muted" id="emi">
        <SectionHeading
          eyebrow="Finance"
          title="Work out a monthly figure"
          description="Most customers buy on finance. Put in the price you have been quoted and see roughly what it costs each month."
          action={
            <Button asChild variant="outline" size="lg">
              <Link href={`/finance?model=${selected.slug}&variant=${selectedVariant.id}`}>
                Finance options
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          }
        />
        <div className="mt-12">
          <FinanceCalculator
            initialVehiclePrice={selectedVariant.price}
            modelLabel={`${brandedModel(selected.name)} ${
              selected.variants.length > 1 ? selectedVariant.name : ""
            }`.trim()}
          />
        </div>
      </Section>

      <Section tone="inverse">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <span
              aria-hidden
              className="bg-brand text-brand-foreground inline-flex size-11 items-center justify-center rounded-xl"
            >
              <ShieldCheck className="size-5" />
            </span>
            <h2 className="text-display-md mt-6">Talk to an EV Expert</h2>
            <p className="text-on-inverse-muted mt-4 text-lead text-pretty">
              Finance, exchange, insurance, registration and subsidies all move the
              final number. One conversation usually settles it faster than a form —
              and there is no obligation either way.
            </p>
          </div>

          <div className="grid gap-3">
            <Button asChild variant="brand" size="xl" block>
              <a href={telUrl()}>
                <Phone aria-hidden />
                Call {dealership.phoneDisplay}
              </a>
            </Button>
            <Button asChild variant="outline-inverse" size="xl" block>
              <a
                href={whatsappUrl(
                  `Hi ${dealership.dealershipName}, I would like the on-road price for the ${brandedModel(selected.name)}.`
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle aria-hidden />
                WhatsApp us
              </a>
            </Button>
            <Button asChild variant="outline-inverse" size="xl" block>
              <Link href={`/book-test-ride?model=${selected.slug}`}>
                Book a test ride first
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
