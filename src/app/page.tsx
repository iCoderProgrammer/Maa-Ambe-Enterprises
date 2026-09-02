import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { Hero } from "@/components/sections/hero";
import { Lineup } from "@/components/sections/lineup";
import { WhyLectrix } from "@/components/sections/why-lectrix";
import { EvSavingsCalculator } from "@/components/sections/ev-savings-calculator";
import { BaasPreview } from "@/components/sections/baas-preview";
import { SmartTechnology } from "@/components/sections/smart-technology";
import { WhyDealership } from "@/components/sections/why-dealership";
import { ShowroomPreview } from "@/components/sections/showroom-preview";
import { Branches } from "@/components/sections/branches";
import { Testimonials } from "@/components/sections/testimonials";
import { FaqSection } from "@/components/sections/faq-section";
import { FinalCta } from "@/components/sections/final-cta";
import { homepageFaqs } from "@/data/faqs";
import { dealership } from "@/data/dealership";
import { hasMultipleBranches } from "@/lib/branches";
import { siteConfig } from "@/config/site";
import {
  branchesSchema,
  faqSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/seo";

const title = `${siteConfig.title} | ${dealership.dealershipName}`;
const description = `Explore Lectrix EV electric scooters at ${dealership.dealershipName}, an authorized Lectrix EV dealership — NDuro, LXS 3.0, LXS 2.0, ZYRO and SX25. Compare range and price, estimate your savings, and book a free test ride.`;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />
      {branchesSchema().map((schema) => (
        <JsonLd key={schema["@id"]} data={schema} />
      ))}
      <JsonLd data={faqSchema(homepageFaqs)} />

      <Hero />
      <Lineup />
      <WhyLectrix />
      <EvSavingsCalculator />
      <BaasPreview />
      <SmartTechnology />
      <WhyDealership />
      {/* One showroom gets the richer preview with its gallery; several get the
          branch grid, which carries each location's own address and actions. */}
      {hasMultipleBranches() ? <Branches /> : <ShowroomPreview />}
      <Testimonials />
      <FaqSection faqs={homepageFaqs} />
      <FinalCta />
    </>
  );
}
