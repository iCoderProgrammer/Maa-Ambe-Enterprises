import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  CircleHelp,
  MessageCircle,
  Phone,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { Breadcrumbs, type Crumb } from "@/components/common/breadcrumbs";
import { Stagger, StaggerItem } from "@/components/common/motion";
import { JsonLd } from "@/components/seo/json-ld";
import { FaqSection } from "@/components/sections/faq-section";
import { BaasCalculator } from "@/components/baas/baas-calculator";
import { BaasModelSupport } from "@/components/baas/baas-model-support";
import { getProducts } from "@/lib/products";
import { breadcrumbJsonLd, faqSchema } from "@/lib/seo";
import { baasFaqs } from "@/data/faqs";
import { BAAS_DISCLAIMER } from "@/data/calculators";
import { DEALERSHIP_NAME } from "@/lib/brand";
import { dealership, telUrl, whatsappUrl } from "@/data/dealership";
import { siteConfig } from "@/config/site";

const title = "Lectrix EV Battery-as-a-Service";
const description = `Battery-as-a-Service explained simply: buy your Lectrix EV scooter without the battery, pay less upfront and subscribe to the battery monthly. Compare the two ways of buying, and talk to ${DEALERSHIP_NAME} about availability.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/battery-as-a-service" },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/battery-as-a-service`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: `${title} | ${siteConfig.name}`,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
};

const crumbs: Crumb[] = [
  { label: "Home", href: "/" },
  { label: "Battery-as-a-Service" },
];

const steps = [
  {
    number: "01",
    title: "Choose your scooter",
    description:
      "Pick the model and variant you want, exactly as you would when buying normally.",
  },
  {
    number: "02",
    title: "Buy it without the battery",
    description:
      "The battery is left out of the purchase price, so the amount you pay on the day is smaller.",
  },
  {
    number: "03",
    title: "Subscribe to the battery",
    description:
      "A fixed monthly fee covers use of the battery. You charge it at home exactly as you otherwise would.",
  },
  {
    number: "04",
    title: "Ride, and let us handle the battery",
    description:
      "For the term of the subscription the battery's condition is the provider's responsibility, not yours.",
  },
];

const comparison = [
  {
    aspect: "Upfront cost",
    outright: "Full price, battery included",
    baas: "Lower — you leave the battery out",
  },
  {
    aspect: "Monthly cost",
    outright: "Charging only",
    baas: "Charging plus a battery subscription",
  },
  {
    aspect: "Who owns the battery",
    outright: "You do",
    baas: "The provider does",
  },
  {
    aspect: "Battery condition",
    outright: "Yours to manage, under warranty terms",
    baas: "The provider's responsibility for the term",
  },
  {
    aspect: "Best suited to",
    outright: "Keeping the scooter for the long run",
    baas: "Lower entry cost, or upgrading sooner",
  },
];

export default function BatteryAsAServicePage() {
  const products = getProducts();

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={faqSchema(baasFaqs)} />

      <Breadcrumbs items={crumbs} />

      {/* 1 — What is BaaS? */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
          <div>
            <SectionHeading
              as="h1"
              eyebrow="Lectrix EV Battery-as-a-Service"
              title="Pay for the scooter. Subscribe to the battery."
              description="The battery is the single most expensive part of an electric scooter. Battery-as-a-Service takes it out of the purchase price and turns it into a monthly subscription instead — so you pay less on the day you ride away."
            />
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="brand" size="xl">
                <Link href="#calculator">
                  Try the calculator
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link href="#models">Which models offer it</Link>
              </Button>
            </div>
          </div>

          <ul className="grid list-none gap-px overflow-hidden rounded-2xl bg-hairline sm:grid-cols-2">
            {[
              {
                icon: Wallet,
                title: "Lower upfront cost",
                description: "The battery comes out of the purchase price.",
              },
              {
                icon: BatteryCharging,
                title: "Fixed monthly fee",
                description: "A predictable subscription instead of a lump sum.",
              },
              {
                icon: ShieldCheck,
                title: "Battery stays supported",
                description: "Its condition is the provider's responsibility.",
              },
              {
                icon: CircleHelp,
                title: "Not always cheaper",
                description: "Over a long ownership, buying outright can cost less.",
              },
            ].map((item) => (
              <li key={item.title} className="bg-background flex flex-col gap-3.5 p-6">
                <item.icon
                  aria-hidden
                  className="text-brand-600 dark:text-brand-400 size-5"
                />
                <div>
                  <h2 className="font-display text-sm font-semibold">{item.title}</h2>
                  <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed text-pretty">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 2 — How it works */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="How it works"
          title="Four steps, start to finish"
          description="Nothing about riding the scooter changes. What changes is how you pay for the battery."
        />
        <Stagger
          as="ol"
          className="mt-12 grid list-none gap-px overflow-hidden rounded-2xl bg-hairline sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.07}
        >
          {steps.map((step) => (
            <StaggerItem
              as="li"
              key={step.number}
              className="bg-background flex flex-col gap-4 p-7"
            >
              <span className="font-display text-brand-600 dark:text-brand-400 text-display-sm font-semibold">
                {step.number}
              </span>
              <div>
                <h3 className="font-display text-base font-semibold">{step.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed text-pretty">
                  {step.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* 3 — Traditional purchase vs BaaS */}
      <Section>
        <SectionHeading
          eyebrow="Side by side"
          title="Buying outright versus BaaS"
          description="Neither is automatically the better deal. Which one suits you depends mostly on how long you plan to keep the scooter."
        />

        <div className="border-hairline mt-12 overflow-hidden rounded-2xl border">
          <div className="scroll-fade-x overflow-x-auto">
            <table className="w-full min-w-[36rem] text-sm">
              <caption className="sr-only">
                Comparison of buying outright and Battery-as-a-Service
              </caption>
              <thead>
                <tr className="bg-surface-muted">
                  <th scope="col" className="border-hairline border-b p-4 text-left">
                    <span className="text-eyebrow text-muted-foreground uppercase">
                      Aspect
                    </span>
                  </th>
                  <th scope="col" className="border-hairline border-b border-l p-4 text-left">
                    <span className="font-display text-sm font-semibold">
                      Buying outright
                    </span>
                  </th>
                  <th scope="col" className="border-hairline border-b border-l p-4 text-left">
                    <span className="font-display text-brand-700 dark:text-brand-400 text-sm font-semibold">
                      Battery-as-a-Service
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.aspect} className="border-hairline border-b last:border-b-0">
                    <th
                      scope="row"
                      className="text-muted-foreground w-1/4 p-4 text-left font-normal"
                    >
                      {row.aspect}
                    </th>
                    <td className="border-hairline border-l p-4">{row.outright}</td>
                    <td className="border-hairline border-l p-4">{row.baas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* 4, 5, 6 — Upfront comparison, subscription and savings example */}
      <Section tone="muted" id="calculator">
        <SectionHeading
          eyebrow="Work it out"
          title="See what it means for you"
          description="Put in the figures from your quote and compare the two ways of buying over the period you expect to keep the scooter. Charging cost is included on both sides, so the comparison is a realistic one."
        />
        <div className="mt-12">
          <BaasCalculator products={products} />
        </div>
      </Section>

      {/* 7 — Which models support BaaS */}
      <Section id="models">
        <SectionHeading
          eyebrow="Availability"
          title="Which models offer Battery-as-a-Service"
          description="Availability varies by model and variant, and can change with the offers running that month."
        />
        <div className="mt-12">
          <BaasModelSupport products={products} />
        </div>
      </Section>

      {/* 8 — FAQ */}
      <FaqSection
        faqs={baasFaqs}
        title="Battery-as-a-Service questions"
        description="The things customers most often want cleared up before choosing between a subscription and buying the battery outright."
      />

      {/* 9 — Enquiry CTA */}
      <Section tone="inverse">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <span
              aria-hidden
              className="bg-brand text-brand-foreground inline-flex size-11 items-center justify-center rounded-xl"
            >
              <BatteryCharging className="size-5" />
            </span>
            <h2 className="text-display-md mt-6">Talk to {DEALERSHIP_NAME}</h2>
            <p className="text-on-inverse-muted mt-4 text-lead text-pretty">
              Subscription pricing, minimum terms and what happens at the end of a term
              are contract details, and they change. Talk to us and we will go through
              the current terms for the model you want — and tell you honestly which of
              the two options works out better for how you ride.
            </p>
            <p className="text-on-inverse-muted/80 mt-6 text-xs leading-relaxed">
              {BAAS_DISCLAIMER}
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
                  `Hi ${dealership.dealershipName}, I would like to know more about Battery-as-a-Service.`
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle aria-hidden />
                WhatsApp us
              </a>
            </Button>
            <Button asChild variant="outline-inverse" size="xl" block>
              <Link href="/contact">
                Send an enquiry
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
