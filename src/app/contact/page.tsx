import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { Breadcrumbs, type Crumb } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { ContactForm } from "@/components/forms/contact-form";
import { breadcrumbJsonLd, localBusinessSchema } from "@/lib/seo";
import {
  dealership,
  formatAddress,
  groupedOpeningHours,
  telUrl,
  whatsappUrl,
} from "@/data/dealership";
import { siteConfig } from "@/config/site";

const title = "Contact the Showroom";
const description = `Contact ${dealership.dealershipName}, an authorized Lectrix EV dealership, by phone, WhatsApp or email — or send an enquiry online and we will get back to you during showroom hours.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/contact`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: `${title} | ${siteConfig.name}`,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
};

const crumbs: Crumb[] = [
  { label: "Home", href: "/" },
  { label: "Contact" },
];

const shortDay = (day: string) => day.slice(0, 3);

export default function ContactPage() {
  const hours = groupedOpeningHours();

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={localBusinessSchema()} />
      <Breadcrumbs items={crumbs} />

      <Section>
        <SectionHeading
          as="h1"
          eyebrow="Contact"
          title="Talk to the showroom"
          description="Call, message or send us a note — whichever suits you. We answer during showroom hours."
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <ContactForm />

          <aside className="border-hairline bg-surface-muted rounded-2xl border p-6 sm:p-7 lg:sticky lg:top-24 lg:self-start">
            <h2 className="font-display text-base font-semibold">
              {dealership.dealershipName}
            </h2>

            <dl className="mt-6 space-y-5 text-sm">
              <div className="flex gap-3">
                <dt className="sr-only">Address</dt>
                <MapPin aria-hidden className="text-brand-600 mt-0.5 size-4 shrink-0" />
                <dd className="text-muted-foreground">{formatAddress()}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="sr-only">Phone</dt>
                <Phone aria-hidden className="text-brand-600 mt-0.5 size-4 shrink-0" />
                <dd>
                  <a
                    href={telUrl()}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {dealership.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="sr-only">Email</dt>
                <Mail aria-hidden className="text-brand-600 mt-0.5 size-4 shrink-0" />
                <dd>
                  <a
                    href={`mailto:${dealership.email}`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {dealership.email}
                  </a>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="sr-only">Opening hours</dt>
                <Clock aria-hidden className="text-brand-600 mt-0.5 size-4 shrink-0" />
                <dd className="text-muted-foreground">
                  <ul className="space-y-1">
                    {hours.map((group) => (
                      <li key={group.days.join("-")}>
                        {shortDay(group.days[0])}
                        {group.days.length > 1 ? ` – ${shortDay(group.days.at(-1)!)}` : ""}
                        {": "}
                        {group.opens && group.closes
                          ? `${group.opens} – ${group.closes}`
                          : "Closed"}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>

            <div className="mt-7 space-y-3">
              <Button asChild size="lg" block>
                <a
                  href={dealership.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation aria-hidden />
                  Get Directions
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" block>
                <a
                  href={whatsappUrl(`Hi ${dealership.dealershipName}, I have a question.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle aria-hidden />
                  WhatsApp us
                </a>
              </Button>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
