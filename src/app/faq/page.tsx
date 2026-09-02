import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { Breadcrumbs, type Crumb } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, faqSchema } from "@/lib/seo";
import { faqs, getGroupedFaqs } from "@/data/faqs";
import { dealership, telUrl, whatsappUrl } from "@/data/dealership";
import { siteConfig } from "@/config/site";
import { DEALERSHIP_NAME } from "@/lib/brand";

const title = "Frequently Asked Questions";
const description = `Answers about Lectrix EV electric scooters — range, batteries, charging, Battery-as-a-Service, finance, test rides, servicing and warranty — and about buying from ${DEALERSHIP_NAME}.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/faq" },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/faq`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: `${title} | ${siteConfig.name}`,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
};

const crumbs: Crumb[] = [
  { label: "Home", href: "/" },
  { label: "FAQ" },
];

/**
 * Categorised FAQ.
 *
 * Every question is rendered on the page rather than hidden behind a client-side
 * filter, so all of it is crawlable and every answer is reachable with the
 * browser's own find-in-page. The category strip is plain anchor links — no
 * JavaScript needed to navigate, and each category is deep-linkable.
 *
 * A single `FAQPage` block covers the whole set: the visible markup and the
 * structured data describe exactly the same questions, which is what makes the
 * schema valid.
 */
export default function FaqPage() {
  const groups = getGroupedFaqs();

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={faqSchema(faqs)} />

      <Breadcrumbs items={crumbs} />

      <Section compact>
        <SectionHeading
          as="h1"
          eyebrow="FAQ"
          title={`Lectrix EV and ${DEALERSHIP_NAME}, explained`}
          description={`${faqs.length} answers covering the things customers ask before and after going electric. If yours is not here, call the showroom — we would rather explain it properly.`}
        />

        <nav aria-label="FAQ categories" className="mt-10">
          <ul className="flex list-none flex-wrap gap-2">
            {groups.map((group) => (
              <li key={group.category.id}>
                <a
                  href={`#${group.category.id}`}
                  className="border-border hover:border-foreground/30 hover:bg-muted inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm transition-colors"
                >
                  {group.category.label}
                  <span className="text-muted-foreground text-xs">
                    {group.faqs.length}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Section>

      <Section className="pt-0">
        <div className="space-y-16">
          {groups.map((group) => (
            <section
              key={group.category.id}
              id={group.category.id}
              aria-labelledby={`${group.category.id}-heading`}
            >
              <div className="border-hairline flex flex-col gap-1 border-b pb-5">
                <h2
                  id={`${group.category.id}-heading`}
                  className="text-display-sm"
                >
                  {group.category.label}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {group.category.description}
                </p>
              </div>

              <Accordion type="single" collapsible className="mt-2 w-full">
                {group.faqs.map((faq, index) => (
                  <AccordionItem
                    key={faq.question}
                    value={`${group.category.id}-${index}`}
                  >
                    <AccordionTrigger className="font-display text-left text-[0.9375rem] font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed text-pretty">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
        </div>
      </Section>

      <Section tone="inverse">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-display-lg">Still have a question?</h2>
          <p className="text-on-inverse-muted mt-5 text-lead text-pretty">
            Ask us directly. There is no obligation, and we would rather answer it
            properly than have you guess.
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
                href={whatsappUrl(`Hi ${dealership.dealershipName}, I have a question.`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle aria-hidden />
                WhatsApp us
              </a>
            </Button>
            <Button asChild variant="outline-inverse" size="xl">
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
