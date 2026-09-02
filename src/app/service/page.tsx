import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarCheck, MessageCircle, Phone, ShieldQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { Breadcrumbs, type Crumb } from "@/components/common/breadcrumbs";
import { Stagger, StaggerItem } from "@/components/common/motion";
import { PendingData } from "@/components/common/pending-data";
import { JsonLd } from "@/components/seo/json-ld";
import { FaqSection } from "@/components/sections/faq-section";
import { ContactForm } from "@/components/forms/contact-form";
import { breadcrumbJsonLd, faqSchema } from "@/lib/seo";
import { getFaqsByCategory } from "@/data/faqs";
import {
  genuineParts,
  ownerMaintenance,
  roadsideAssistance,
  serviceChecks,
} from "@/data/service";
import { dealership, telUrl, whatsappUrl } from "@/data/dealership";
import { siteConfig } from "@/config/site";
import { DEALERSHIP_NAME } from "@/lib/brand";

const title = "Lectrix EV Service & Support";
const description = `Lectrix EV service and maintenance at ${DEALERSHIP_NAME}, an authorized Lectrix EV dealership — scheduled servicing, battery health checks, genuine parts and software updates by technicians trained on these vehicles.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/service" },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/service`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: `${title} | ${siteConfig.name}`,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
};

const crumbs: Crumb[] = [
  { label: "Home", href: "/" },
  { label: "Service" },
];

const serviceFaqs = getFaqsByCategory("service");

export default function ServicePage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={faqSchema(serviceFaqs)} />

      <Breadcrumbs items={crumbs} />

      {/* Service overview */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <SectionHeading
            as="h1"
            eyebrow="Service"
            title="Less to service. Still worth servicing."
            description="An electric scooter has no engine oil, no air filter, no spark plug and no clutch — so a service is shorter and cheaper than you are used to. What remains still matters: brakes, tyres, suspension, battery health and software."
          />
          <div className="flex flex-col justify-center gap-3">
            <Button asChild variant="brand" size="xl" block>
              <Link href="#book">
                <CalendarCheck aria-hidden />
                Book a service
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl" block>
              <a href={telUrl()}>
                <Phone aria-hidden />
                Call {dealership.phoneDisplay}
              </a>
            </Button>
          </div>
        </div>
      </Section>

      {/* Service support — what a service covers */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="What we check"
          title="What a periodic service covers"
          description="Read from the vehicle's own diagnostics rather than estimated from symptoms."
        />
        <Stagger
          as="ul"
          className="mt-12 grid list-none gap-px overflow-hidden rounded-2xl bg-hairline sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.06}
        >
          {serviceChecks.map((check) => (
            <StaggerItem
              as="li"
              key={check.id}
              className="bg-background flex flex-col gap-3.5 p-6 lg:p-7"
            >
              <check.icon
                aria-hidden
                className="text-brand-600 dark:text-brand-400 size-5"
              />
              <div>
                <h3 className="font-display text-sm font-semibold">{check.title}</h3>
                <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed text-pretty">
                  {check.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        <p className="text-muted-foreground mt-8 text-xs">
          Service intervals are set by the manufacturer and stated in your owner&rsquo;s
          handbook, usually by time or distance, whichever comes first. We confirm the
          schedule for your model at handover.
        </p>
      </Section>

      {/* Maintenance information */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <SectionHeading
            eyebrow="Between services"
            title="Four things worth doing yourself"
            description="None of these need tools, and together they account for most of the difference between a scooter that ages well and one that does not."
          />
          <ol className="space-y-6">
            {ownerMaintenance.map((note, index) => (
              <li key={note.title} className="flex gap-4">
                <span
                  aria-hidden
                  className="bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-400 font-display mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold"
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-display text-sm font-semibold">{note.title}</h3>
                  <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed text-pretty">
                    {note.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Genuine parts */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Genuine parts"
          title="Why it matters where you service it"
          description="Not a sales line — it is the single most common reason a warranty claim runs into difficulty."
        />
        <ul className="mt-12 grid list-none gap-px overflow-hidden rounded-2xl bg-hairline sm:grid-cols-3">
          {genuineParts.map((item) => (
            <li key={item.title} className="bg-background flex flex-col gap-3.5 p-7">
              <item.icon
                aria-hidden
                className="text-brand-600 dark:text-brand-400 size-5"
              />
              <div>
                <h3 className="font-display text-sm font-semibold">{item.title}</h3>
                <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed text-pretty">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Roadside assistance */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <SectionHeading
            eyebrow="Roadside assistance"
            title="If you stop where you did not plan to"
          />
          <div>
            {roadsideAssistance.isConfigured ? (
              <div className="border-hairline space-y-4 rounded-2xl border p-6 sm:p-8">
                <p className="text-sm leading-relaxed text-pretty">
                  {roadsideAssistance.coverageSummary}
                </p>
                {roadsideAssistance.helplineNumber ? (
                  <p className="font-display text-display-sm">
                    <a href={`tel:${roadsideAssistance.helplineNumber}`}>
                      {roadsideAssistance.helplineNumber}
                    </a>
                  </p>
                ) : null}
                {roadsideAssistance.hours ? (
                  <p className="text-muted-foreground text-sm">
                    {roadsideAssistance.hours}
                  </p>
                ) : null}
              </div>
            ) : (
              <>
                <PendingData>
                  Whether a roadside assistance programme covers your vehicle depends on
                  the model and on any package included with your purchase. We have not
                  confirmed the current programme, so rather than describe cover you may
                  not have — ask us, and we will tell you exactly what applies before you
                  need it.
                </PendingData>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button asChild variant="outline" size="lg">
                    <a href={telUrl()}>
                      <Phone aria-hidden />
                      Call the showroom
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <a
                      href={whatsappUrl(
                        `Hi ${dealership.dealershipName}, does my scooter have roadside assistance cover?`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle aria-hidden />
                      Ask on WhatsApp
                    </a>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </Section>

      {/* Service enquiry / booking */}
      <Section tone="muted" id="book">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Book a service"
              title="Tell us what it needs"
              description="Send us the model and what you have noticed, and we will come back with a slot and an idea of what is involved."
            />
            <div className="mt-10">
              <ContactForm
                defaultMessage="I would like to book a service. My model is: "
                submitLabel="Send service request"
                successTitle="Service request sent"
                successDescription="We will call you to confirm a slot and let you know what the service is likely to involve."
              />
            </div>
          </div>

          <aside className="border-hairline bg-background rounded-2xl border p-6 sm:p-7 lg:sticky lg:top-24 lg:self-start">
            <ShieldQuestion
              aria-hidden
              className="text-brand-600 dark:text-brand-400 size-6"
            />
            <h2 className="font-display mt-5 text-base font-semibold">
              Not sure if it needs a service?
            </h2>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed text-pretty">
              Describe what you have noticed — a noise, a drop in range, a warning on the
              console — and we will tell you whether it is worth bringing in. There is no
              charge for asking.
            </p>
            <div className="mt-6 space-y-3">
              <Button asChild variant="outline" size="lg" block>
                <a href={telUrl()}>
                  <Phone aria-hidden />
                  {dealership.phoneDisplay}
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" block>
                <Link href="/warranty">
                  Warranty information
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            </div>
          </aside>
        </div>
      </Section>

      <FaqSection
        faqs={serviceFaqs}
        title="Service questions"
        description="What owners ask us most often about looking after an electric scooter."
      />
    </>
  );
}
