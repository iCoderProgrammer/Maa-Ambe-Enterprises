import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileCheck2, MessageCircle, Phone, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { Breadcrumbs, type Crumb } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { FinanceCalculator } from "@/components/finance/finance-calculator";
import { getProducts, getStartingPrice, getVariant } from "@/lib/products";
import { breadcrumbJsonLd } from "@/lib/seo";
import { dealership, getAssistance, telUrl, whatsappUrl } from "@/data/dealership";
import { EMI_DISCLAIMER } from "@/data/calculators";
import { siteConfig } from "@/config/site";
import { DEALERSHIP_NAME, VEHICLE_BRAND, brandedModel } from "@/lib/brand";

const title = "Lectrix EV Finance & EMI";
const description = `Estimate the monthly EMI on a Lectrix EV electric scooter and see what finance assistance ${DEALERSHIP_NAME} provides. Adjust price, down payment, interest rate and tenure to find a figure that fits your budget.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/finance" },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/finance`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: `${title} | ${siteConfig.name}`,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
};

const crumbs: Crumb[] = [
  { label: "Home", href: "/" },
  { label: "Finance" },
];

/**
 * How buying on finance actually works here.
 *
 * The three steps below describe the dealership's own process, which is why
 * they are safe to state; anything that depends on a lender — rate, tenure,
 * eligibility, processing fee — is deliberately absent, because only the lender
 * can commit to it. The calculator is explicitly an estimate for the same
 * reason.
 */
const steps = [
  {
    icon: FileCheck2,
    title: "Pick the model and work out a figure",
    description:
      "Start from the ex-showroom price of the model you want, set a down payment you are comfortable with, and see roughly what the monthly instalment looks like.",
  },
  {
    icon: ShieldCheck,
    title: "We check what you actually qualify for",
    description:
      "Bring your documents to the showroom and we will put your case to our lending partners. The rate and tenure you are offered come from them, not from this page.",
  },
  {
    icon: ArrowRight,
    title: "Paperwork, insurance and registration together",
    description:
      "Once the loan is approved, insurance and RTO registration are completed alongside it, so you collect the scooter ready to ride.",
  },
];

/**
 * Rendered on demand so `?model=` and `?variant=` seed the calculator on the
 * server, matching `/on-road-price` and `/book-test-ride`. A visitor arriving
 * from a model page sees that model's price already filled in.
 */
export default async function FinancePage({
  searchParams,
}: {
  searchParams: Promise<{ model?: string; variant?: string }>;
}) {
  const products = getProducts();
  const { model, variant } = await searchParams;

  const selected = products.find((product) => product.slug === model) ?? products[0];
  const selectedVariant = getVariant(selected, variant);

  // Seed from the selected variant, falling back to the model's cheapest
  // confirmed price. Null stays null: the calculator then opens on its own
  // neutral default rather than on a price nobody has confirmed.
  const seedPrice = selectedVariant.price ?? getStartingPrice(selected);

  const financeAssistance = getAssistance().filter((service) =>
    ["finance", "insurance", "registration"].includes(service.id)
  );

  const modelLabel = `${brandedModel(selected.name)} ${
    selected.variants.length > 1 ? selectedVariant.name : ""
  }`.trim();

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Breadcrumbs items={crumbs} />

      <Section>
        <SectionHeading
          as="h1"
          eyebrow="Finance"
          title={`Finance your ${VEHICLE_BRAND}`}
          description={`Most customers buy on finance. Work out an indicative monthly figure below, then talk to ${DEALERSHIP_NAME} about what you actually qualify for.`}
        />

        <div className="mt-12">
          <FinanceCalculator
            initialVehiclePrice={seedPrice}
            modelLabel={seedPrice != null ? modelLabel : undefined}
          />
        </div>

        <p className="text-muted-foreground mt-8 max-w-3xl text-xs leading-relaxed">
          {EMI_DISCLAIMER}
        </p>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="How it works"
          title="From an estimate to an approved loan"
          description={`${DEALERSHIP_NAME} handles the finance paperwork with you at the showroom. The lender sets the terms; we make sure you know them before you sign.`}
        />

        <ol className="mt-12 grid list-none gap-6 lg:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="border-hairline bg-background flex flex-col gap-3 rounded-2xl border p-6 lg:p-7"
            >
              <span className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-400 inline-flex size-9 items-center justify-center rounded-xl"
                >
                  <step.icon className="size-4.5" />
                </span>
                <span className="text-muted-foreground text-xs font-medium">
                  Step {index + 1}
                </span>
              </span>
              <h3 className="font-display text-base font-semibold text-pretty">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {financeAssistance.length > 0 ? (
        <Section>
          <SectionHeading
            eyebrow="What we handle"
            title="Finance, insurance and registration"
            description={`Confirmed services at ${DEALERSHIP_NAME}. Lender panels, premiums and RTO charges change, so the figures come from the counter rather than from this page.`}
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {financeAssistance.map((service) => (
              <div
                key={service.id}
                className="border-hairline bg-surface-muted rounded-2xl border p-6 lg:p-7"
              >
                <h3 className="font-display text-base font-semibold text-pretty">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed text-pretty">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      <Section tone="inverse">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="text-display-md">Talk to {DEALERSHIP_NAME}</h2>
            <p className="text-on-inverse-muted mt-4 text-lead text-pretty">
              An EMI on a calculator is an estimate. A ten-minute conversation gives you
              the on-road price, the down payment you would actually need and the tenure
              a lender will offer — with no obligation.
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
                  `Hi ${dealership.dealershipName}, I would like to know the finance options for the ${brandedModel(selected.name)}.`
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle aria-hidden />
                WhatsApp us
              </a>
            </Button>
            <Button asChild variant="outline-inverse" size="xl" block>
              <Link href={`/on-road-price?model=${selected.slug}`}>
                Get the on-road price
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
