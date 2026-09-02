import type { Metadata } from "next";
import { Clock, IdCard, MessageCircle, Phone, Route } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { Breadcrumbs, type Crumb } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { TestRideForm } from "@/components/forms/test-ride-form";
import { getProducts } from "@/lib/products";
import { resolveBranch } from "@/lib/branches";
import { breadcrumbJsonLd } from "@/lib/seo";
import { dealership, formatAddress, telUrl, whatsappUrl } from "@/data/dealership";
import { siteConfig } from "@/config/site";
import { DEALERSHIP_NAME } from "@/lib/brand";

const title = "Book a Lectrix EV Test Ride";
const description = `Book a free Lectrix EV test ride at ${DEALERSHIP_NAME}, an authorized Lectrix EV dealership. Choose your model, date and time — it takes about fifteen minutes and there is no obligation.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/book-test-ride" },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/book-test-ride`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: `${title} | ${siteConfig.name}`,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
};

const crumbs: Crumb[] = [
  { label: "Home", href: "/" },
  { label: "Book a Test Ride" },
];

const expectations = [
  {
    icon: Clock,
    title: "About fifteen minutes",
    description: "Long enough to get a real feel for the ride, short enough to fit in a lunch break.",
  },
  {
    icon: IdCard,
    title: "Bring your licence",
    description: "A valid driving licence is required before you can ride.",
  },
  {
    icon: Route,
    title: "Ride it properly",
    description: "Take it onto roads you actually use, not just around the car park.",
  },
];

/**
 * Rendered on demand rather than prerendered.
 *
 * The model preselection arrives as `?model=`, and reading it in the browser
 * with `useSearchParams` would suspend the whole form out of the served HTML —
 * unacceptable on the primary conversion page. Resolving it on the server puts
 * the complete, correctly preselected form in the first response.
 */
export default async function BookTestRidePage({
  searchParams,
}: {
  searchParams: Promise<{ model?: string; variant?: string; branch?: string }>;
}) {
  const products = getProducts();
  const { model, variant, branch } = await searchParams;

  // Ignore a slug that names no real model rather than selecting nothing.
  const defaultModel = products.some((product) => product.slug === model)
    ? model
    : undefined;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Breadcrumbs items={crumbs} />

      <Section>
        <SectionHeading
          as="h1"
          eyebrow="Test ride"
          title="Try it before you decide"
          description={`Tell us which Lectrix EV model you would like to ride and when suits you. ${DEALERSHIP_NAME} will call to confirm your slot and have the scooter charged and ready.`}
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div>
            <TestRideForm
              products={products}
              defaultBranch={resolveBranch(branch).branchId}
              defaultModel={defaultModel}
              defaultVariant={variant}
            />
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border-hairline bg-surface-muted rounded-2xl border p-6 sm:p-7">
              <h2 className="font-display text-base font-semibold">
                What to expect
              </h2>
              <ul className="mt-6 space-y-6">
                {expectations.map((item) => (
                  <li key={item.title} className="flex gap-3.5">
                    <item.icon
                      aria-hidden
                      className="text-brand-600 dark:text-brand-400 mt-0.5 size-4.5 shrink-0"
                    />
                    <div>
                      <h3 className="font-display text-sm font-semibold">{item.title}</h3>
                      <p className="text-muted-foreground mt-1 text-sm leading-relaxed text-pretty">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="border-hairline mt-7 border-t pt-7">
                <h3 className="font-display text-sm font-semibold">
                  Prefer to talk to someone?
                </h3>
                <p className="text-muted-foreground mt-1.5 text-sm">
                  {formatAddress()}
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <Button asChild variant="outline" size="lg">
                    <a href={telUrl()}>
                      <Phone aria-hidden />
                      {dealership.phoneDisplay}
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <a
                      href={whatsappUrl(
                        `Hi ${dealership.dealershipName}, I would like to book a test ride.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle aria-hidden />
                      WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      <Container className="pb-16">
        <p className="text-muted-foreground text-xs">
          By submitting this form you agree to be contacted by {dealership.dealershipName}{" "}
          about your enquiry. We do not share your details with anyone else.
        </p>
      </Container>
    </>
  );
}
