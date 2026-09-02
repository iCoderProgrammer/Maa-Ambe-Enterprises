import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { TeamSection } from "@/components/sections/team";
import { Breadcrumbs, type Crumb } from "@/components/common/breadcrumbs";
import { Stagger, StaggerItem } from "@/components/common/motion";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, organizationSchema } from "@/lib/seo";
import { dealership, isPlaceholder } from "@/data/dealership";
import { siteConfig } from "@/config/site";

const city = dealership.address.city;
const cityKnown = !isPlaceholder("address");

const title = "About Us";
const description = cityKnown
  ? `About ${dealership.dealershipName} — an authorized Lectrix EV dealership in ${city} selling and servicing electric scooters.`
  : `About ${dealership.dealershipName} — an authorized Lectrix EV dealership selling and servicing electric scooters.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/about`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: `${title} | ${siteConfig.name}`,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
};

const crumbs: Crumb[] = [
  { label: "Home", href: "/" },
  { label: "About" },
];

const commitments = [
  {
    icon: BadgeCheck,
    title: "We say when we do not know",
    description:
      "Specifications and prices on this site are marked unconfirmed until we have verified them. A number we cannot stand behind is worse than an honest gap.",
  },
  {
    icon: ShieldCheck,
    title: "Authorized, end to end",
    description:
      "Genuine vehicles, genuine spares, manufacturer diagnostics, and technicians trained on these specific machines.",
  },
  {
    icon: HeartHandshake,
    title: "The sale is not the finish line",
    description:
      "Servicing, warranty claims and battery questions come back to the same people who sold you the scooter.",
  },
  {
    icon: Sparkles,
    title: "No pressure to buy today",
    description:
      "Test rides are free and carry no obligation. If electric does not suit how you ride, we would rather tell you.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={organizationSchema()} />

      <Breadcrumbs items={crumbs} />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <SectionHeading
            as="h1"
            eyebrow="About us"
            title={`An electric-only dealership${cityKnown ? ` in ${city}` : ""}`}
            description={`${dealership.dealershipName} sells and services Lectrix EV electric scooters. Not a multi-brand forecourt with a few EVs parked at the back — electric is the whole business, which is why we can answer the questions that actually matter.`}
          />

          <div className="space-y-5 text-sm leading-relaxed">
            <p className="text-muted-foreground text-pretty">
              Most people walking in have ridden a petrol scooter for years and are
              weighing up whether electric works for them. That means real questions:
              what range will I actually see in traffic, what does charging add to my
              electricity bill, what happens to the battery in three years, what if I
              need a service in a hurry.
            </p>
            <p className="text-muted-foreground text-pretty">
              Those are the conversations we are set up for. The calculators on this site
              exist for the same reason — so you can put your own numbers in rather than
              take a claim on trust.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="How we work" title="Four things we hold to" />
        <Stagger
          as="ul"
          className="mt-12 grid list-none gap-px overflow-hidden rounded-2xl bg-hairline sm:grid-cols-2"
          stagger={0.07}
        >
          {commitments.map((item) => (
            <StaggerItem
              as="li"
              key={item.title}
              className="bg-background flex flex-col gap-4 p-7 lg:p-8"
            >
              <span
                aria-hidden
                className="bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-400 inline-flex size-10 items-center justify-center rounded-xl"
              >
                <item.icon className="size-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold">{item.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed text-pretty">
                  {item.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <TeamSection />

      <Section tone="inverse">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-display-lg">Come and see for yourself</h2>
          <p className="text-on-inverse-muted mt-5 text-lead text-pretty">
            Fifteen minutes on a test ride settles more than an afternoon of reading.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="brand" size="xl">
              <Link href="/book-test-ride">Book a Test Ride</Link>
            </Button>
            <Button asChild variant="outline-inverse" size="xl">
              <Link href="/showroom">
                Visit the showroom
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
