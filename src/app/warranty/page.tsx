import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowRight, FileText, MessageCircle, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { Breadcrumbs, type Crumb } from "@/components/common/breadcrumbs";
import { Stagger, StaggerItem } from "@/components/common/motion";
import { PendingData } from "@/components/common/pending-data";
import { JsonLd } from "@/components/seo/json-ld";
import { FaqSection } from "@/components/sections/faq-section";
import { formatSpec, TBD } from "@/lib/format";
import { getProducts } from "@/lib/products";
import { breadcrumbJsonLd, faqSchema } from "@/lib/seo";
import { getFaqsByCategory } from "@/data/faqs";
import {
  commonExclusions,
  warrantyPrinciples,
  WARRANTY_DISCLAIMER,
} from "@/data/warranty";
import { dealership, telUrl, whatsappUrl } from "@/data/dealership";
import { siteConfig } from "@/config/site";
import { DEALERSHIP_NAME } from "@/lib/brand";

const title = "Lectrix EV Warranty";
const description = `How Lectrix EV vehicle and battery warranties work, what is generally covered, and how to get the exact terms for your model from ${DEALERSHIP_NAME}.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/warranty" },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/warranty`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: `${title} | ${siteConfig.name}`,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
};

const crumbs: Crumb[] = [
  { label: "Home", href: "/" },
  { label: "Warranty" },
];

const warrantyFaqs = getFaqsByCategory("warranty");

function term(value: { years: number | null; kilometres: number | null } | null) {
  if (!value) return TBD;

  const parts = [
    value.years != null ? `${value.years} year${value.years === 1 ? "" : "s"}` : null,
    value.kilometres != null ? formatSpec(value.kilometres, "km") : null,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" / ") : TBD;
}

export default function WarrantyPage() {
  const products = getProducts();
  const anyConfirmed = products.some((product) => product.dataStatus.warrantyConfirmed);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={faqSchema(warrantyFaqs)} />

      <Breadcrumbs items={crumbs} />

      {/* Warranty overview */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <SectionHeading
            as="h1"
            eyebrow="Warranty"
            title="What your cover actually means"
            description="Every new Lectrix EV scooter carries a manufacturer warranty on the vehicle and a separate one on the battery. This page explains how those work in general. The durations and conditions that apply to your scooter come from the manufacturer's warranty document, and we go through it with you."
          />
          <div className="border-hairline flex flex-col justify-center gap-4 rounded-2xl border p-5 sm:p-8">
            <FileText aria-hidden className="text-brand-600 dark:text-brand-400 size-6" />
            <p className="text-sm leading-relaxed text-pretty">
              <strong className="font-semibold">
                We will not summarise your warranty terms on a web page.
              </strong>{" "}
              Durations, limits and exclusions are contractual, they differ by model and
              variant, and they change. Ask us and we will show you the current document
              for the exact scooter you are considering.
            </p>
            <Button asChild variant="brand" size="lg">
              <a href={telUrl()}>
                <Phone aria-hidden />
                Ask for your terms
              </a>
            </Button>
          </div>
        </div>
      </Section>

      {/* How warranties work */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="How it works"
          title="Four things worth understanding"
          description="These hold true whatever the specific numbers turn out to be."
        />
        <Stagger
          as="ul"
          className="mt-12 grid list-none gap-px overflow-hidden rounded-2xl bg-hairline sm:grid-cols-2"
          stagger={0.07}
        >
          {warrantyPrinciples.map((principle) => (
            <StaggerItem
              as="li"
              key={principle.title}
              className="bg-background flex flex-col gap-3 p-7 lg:p-8"
            >
              <h3 className="font-display text-base font-semibold">{principle.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
                {principle.description}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* Model-specific warranty information */}
      <Section id="by-model">
        <SectionHeading
          eyebrow="By model"
          title="Cover for each scooter"
          description="Read directly from product data. A figure appears here only once the dealership has confirmed it in writing."
        />

        {!anyConfirmed ? (
          <div className="mt-10">
            <PendingData>
              We are confirming the current vehicle and battery warranty terms for every
              model with Lectrix EV. Until that is done we are leaving this table blank
              rather than publishing durations we cannot stand behind — call the showroom
              and we will read you the terms from the actual document.
            </PendingData>
          </div>
        ) : null}

        <div className="border-hairline mt-10 overflow-hidden rounded-2xl border">
          <div className="scroll-fade-x overflow-x-auto">
            <table className="w-full min-w-[34rem] text-sm">
              <caption className="sr-only">
                Vehicle and battery warranty terms by model
              </caption>
              <thead>
                <tr className="bg-surface-muted">
                  <th scope="col" className="border-hairline border-b p-4 text-left">
                    <span className="text-eyebrow text-muted-foreground uppercase">
                      Model
                    </span>
                  </th>
                  <th scope="col" className="border-hairline border-b border-l p-4 text-left">
                    <span className="text-eyebrow text-muted-foreground uppercase">
                      Vehicle
                    </span>
                  </th>
                  <th scope="col" className="border-hairline border-b border-l p-4 text-left">
                    <span className="text-eyebrow text-muted-foreground uppercase">
                      Battery
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.slug}
                    className="border-hairline border-b last:border-b-0"
                  >
                    <th scope="row" className="p-4 text-left font-normal">
                      <Link
                        href={`/electric-scooters/${product.slug}`}
                        className="font-display hover:text-brand-700 dark:hover:text-brand-400 rounded-sm font-medium transition-colors"
                      >
                        {product.name}
                      </Link>
                    </th>
                    <td className="border-hairline text-muted-foreground border-l p-4">
                      {term(product.warranty.vehicle)}
                    </td>
                    <td className="border-hairline text-muted-foreground border-l p-4">
                      {term(product.warranty.battery)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* Important terms */}
      <Section tone="muted">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <SectionHeading
            eyebrow="Important"
            title="What warranties usually do not cover"
            description="Common across the industry rather than a statement of this manufacturer's exclusions — the real list is in your warranty document."
          />
          <div>
            <ul className="space-y-3.5">
              {commonExclusions.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <AlertTriangle
                    aria-hidden
                    className="text-muted-foreground mt-0.5 size-4 shrink-0"
                  />
                  <span className="text-pretty">{item}</span>
                </li>
              ))}
            </ul>

            <p className="border-hairline text-muted-foreground mt-8 border-t pt-6 text-xs leading-relaxed">
              {WARRANTY_DISCLAIMER}
            </p>
          </div>
        </div>
      </Section>

      <FaqSection
        faqs={warrantyFaqs}
        title="Warranty questions"
        description="What owners ask before and after a claim."
      />

      {/* CTA to contact the dealership */}
      <Section tone="inverse">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-display-lg">Get the terms for your scooter</h2>
          <p className="text-on-inverse-muted mt-5 text-lead text-pretty">
            Tell us the model and variant and we will read you the current warranty
            terms from the document itself — before you buy, not after.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="brand" size="xl">
              <a href={telUrl()}>
                <Phone aria-hidden />
                Call {dealership.phoneDisplay}
              </a>
            </Button>
            <Button asChild variant="outline-inverse" size="xl">
              <a
                href={whatsappUrl(
                  `Hi ${dealership.dealershipName}, could you send me the Lectrix EV warranty terms for the model I am considering?`
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle aria-hidden />
                WhatsApp us
              </a>
            </Button>
            <Button asChild variant="outline-inverse" size="xl">
              <Link href="/contact">
                Contact us
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
