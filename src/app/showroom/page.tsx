import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Bike,
  CalendarCheck,
  HandCoins,
  MessageCircle,
  Phone,
  Users,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { Breadcrumbs, type Crumb } from "@/components/common/breadcrumbs";
import { Stagger, StaggerItem } from "@/components/common/motion";
import { PendingData } from "@/components/common/pending-data";
import { MediaPlaceholder } from "@/components/common/media-placeholder";
import { JsonLd } from "@/components/seo/json-ld";
import { ProductCard } from "@/components/product/product-card";
import { ShowroomGallery } from "@/components/showroom/showroom-gallery";
import { BranchExperience } from "@/components/branches/branch-experience";
import { BranchCard } from "@/components/branches/branch-card";
import { getProducts } from "@/lib/products";
import { getBranchViews, getBranches, hasMultipleBranches } from "@/lib/branches";
import { branchesSchema, breadcrumbJsonLd, localKeywords } from "@/lib/seo";
import {
  dealership,
  formatAddress,
  getAssistance,
  isPlaceholder,
  telUrl,
  whatsappUrl,
} from "@/data/dealership";
import { siteConfig } from "@/config/site";
import { DEALERSHIP_LINE, DEALERSHIP_NAME } from "@/lib/brand";

const city = dealership.address.city;
const cityKnown = !isPlaceholder("address");

/**
 * Local SEO metadata.
 *
 * The city is interpolated from the dealership config, so the moment a real
 * city replaces the placeholder every title, description and heading on this
 * page updates with it — no copy to hunt down and rewrite.
 */
// The dealership name is appended by the metadata template in the root layout,
// so it is deliberately absent here — including it would title the page
// "Maa Ambey Enterprises — ... | Maa Ambey Enterprises".
const title = cityKnown
  ? `Lectrix EV Showroom in ${city}`
  : "Our Lectrix EV Showroom";

const description = cityKnown
  ? `Visit ${DEALERSHIP_NAME}, an authorized Lectrix EV dealership in ${city}, for test rides, finance, insurance and registration assistance, and after-sales service. See the full Lectrix EV electric scooter range in person.`
  : `Visit ${DEALERSHIP_NAME}, an authorized Lectrix EV dealership, for test rides, finance, insurance and registration assistance, and after-sales service. See the full Lectrix EV electric scooter range in person.`;

/**
 * Canonical follows `?branch=`.
 *
 * The sitemap lists one `?branch=` URL per showroom so each location can be
 * indexed for its own city. A hard-coded `/showroom` canonical would undo that
 * — every branch URL would point away from itself and none would rank. So a
 * request naming a real branch canonicalises to itself, and everything else
 * (no parameter, or a branch id that does not exist) canonicalises to the bare
 * page. Single-branch sites keep the bare canonical, matching the sitemap,
 * which skips branch URLs when there is only one showroom.
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ branch?: string }>;
}): Promise<Metadata> {
  const { branch: requested } = await searchParams;

  const branch =
    hasMultipleBranches() && requested
      ? getBranches().find((entry) => entry.branchId === requested)
      : undefined;

  const path = branch ? `/showroom?branch=${branch.branchId}` : "/showroom";
  const pageTitle = branch
    ? `${branch.branchName} — Lectrix EV Showroom`
    : title;

  return {
    title: pageTitle,
    description,
    alternates: { canonical: path },
    keywords: localKeywords(),
    openGraph: {
      type: "website",
      url: `${siteConfig.url}${path}`,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      title: `${pageTitle} | ${siteConfig.name}`,
      description,
    },
    twitter: { card: "summary_large_image", title: pageTitle, description },
  };
}

const crumbs: Crumb[] = [
  { label: "Home", href: "/" },
  { label: "Our Showroom" },
];

const whyVisit = [
  {
    icon: Bike,
    title: "Sit on it before you buy it",
    description:
      "Seat height, footboard space, how it feels at a standstill — none of that comes across in photographs.",
  },
  {
    icon: CalendarCheck,
    title: "Ride it on real roads",
    description:
      "Test rides are free and take about fifteen minutes. Take it somewhere you actually ride.",
  },
  {
    icon: HandCoins,
    title: "One place for the paperwork",
    description:
      "Finance, insurance and registration are handled here, so you are not chasing three different offices.",
  },
  {
    icon: Wrench,
    title: "Servicing under the same roof",
    description:
      "The people who sell you the scooter are the people who service it afterwards.",
  },
];

/**
 * `?branch=` selects which showroom the page opens on, so a branch card
 * elsewhere on the site can link straight to its own details. Resolving it on
 * the server means the right branch is in the first response rather than
 * appearing after hydration.
 */
export default async function ShowroomPage({
  searchParams,
}: {
  searchParams: Promise<{ branch?: string }>;
}) {
  const products = getProducts();
  const assistance = getAssistance();
  const galleryPending = dealership.gallery.length === 0;
  const branchViews = getBranchViews();
  const branches = getBranches();
  const multiBranch = hasMultipleBranches();
  const { branch: requestedBranch } = await searchParams;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      {branchesSchema().map((schema) => (
        <JsonLd key={schema["@id"]} data={schema} />
      ))}

      <Breadcrumbs items={crumbs} />

      {/* 1 — Showroom hero */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16">
          <div>
            <SectionHeading
              as="h1"
              eyebrow={DEALERSHIP_LINE}
              title={`Experience Lectrix EV at ${DEALERSHIP_NAME}`}
              description={
                cityKnown
                  ? `Our showroom in ${city} has the full Lectrix EV range on the floor, test rides on demand, and the paperwork, finance and servicing all handled in one place.`
                  : "The full Lectrix EV range on the floor, test rides on demand, and the paperwork, finance and servicing all handled in one place."
              }
            />

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="brand" size="xl">
                <Link href="/book-test-ride">Book a Test Ride</Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <a
                  href={dealership.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Directions
                  <ArrowRight aria-hidden />
                </a>
              </Button>
            </div>

            <p className="text-muted-foreground mt-7 text-sm">{formatAddress()}</p>
          </div>

          <MediaPlaceholder
            label="Showroom exterior — hero photograph"
            ratio="aspect-4/3"
            className="rounded-3xl"
          />
        </div>
      </Section>

      {/* 2 — About our dealership */}
      <Section tone="muted">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <SectionHeading
            eyebrow={`About ${DEALERSHIP_NAME}`}
            title="An authorized dealership, not a reseller"
            description={`${DEALERSHIP_NAME} is an authorized Lectrix EV dealership. Being authorized means the vehicles, the spares and the diagnostics are the real thing, the technicians are trained on these specific machines, and the Lectrix EV warranty stands behind what we sell you.`}
          />
          <div className="space-y-5 text-sm leading-relaxed">
            <p className="text-muted-foreground text-pretty">
              Buying an electric scooter raises questions a petrol scooter never did —
              what range you will actually see, what charging costs at home, what happens
              to the battery in three years. We would rather answer those properly before
              you buy than have you find out afterwards.
            </p>
            <p className="text-muted-foreground text-pretty">
              That is also why the specifications on this site are marked as unconfirmed
              where we have not verified them yet. We would rather tell you we are
              checking than quote you a number we cannot stand behind.
            </p>
            <div className="flex items-start gap-2.5 pt-2">
              <BadgeCheck
                aria-hidden
                className="text-brand-600 dark:text-brand-400 mt-0.5 size-5 shrink-0"
              />
              <p className="text-foreground font-medium">
                Authorized {dealership.brand} sales and service
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* 3 — Why visit us */}
      <Section>
        <SectionHeading
          eyebrow="Why visit"
          title="What a showroom gives you that a website cannot"
        />
        <Stagger
          as="ul"
          className="mt-12 grid list-none gap-px overflow-hidden rounded-2xl bg-hairline sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.07}
        >
          {whyVisit.map((item) => (
            <StaggerItem as="li" key={item.title} className="bg-background flex flex-col gap-4 p-7">
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

      {/* 4 — Available models */}
      <Section tone="muted" id="models">
        <SectionHeading
          eyebrow="On the floor"
          title="Lectrix EV models you can see and ride here"
          description="The full Lectrix EV range. Stock and colours vary — call ahead if you want a specific model ready for a test ride."
          action={
            <Button asChild variant="outline" size="lg">
              <Link href="/electric-scooters">
                All models
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          }
        />
        <Stagger
          as="ul"
          className="mt-12 grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.07}
        >
          {products.map((product) => (
            <StaggerItem as="li" key={product.slug} className="flex">
              <ProductCard product={product} className="w-full" />
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* 5 — Test rides */}
      <Section>
        <div className="border-hairline grid gap-10 rounded-2xl border p-7 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <span
              aria-hidden
              className="bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-400 inline-flex size-11 items-center justify-center rounded-xl"
            >
              <CalendarCheck className="size-5" />
            </span>
            <h2 className="text-display-md mt-6">Test rides, any day we are open</h2>
            <p className="text-muted-foreground mt-4 text-lead text-pretty">
              Free, about fifteen minutes, no obligation. Bring a valid driving licence.
              Book a slot online and we will have the scooter charged and waiting, or
              just walk in and ask.
            </p>
          </div>
          <div className="grid gap-3">
            <Button asChild variant="brand" size="xl" block>
              <Link href="/book-test-ride">Book a Test Ride</Link>
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

      {/* 6, 7, 8, 9 — Finance, insurance, registration and service assistance */}
      <Section tone="muted" id="assistance">
        <SectionHeading
          eyebrow="We handle it"
          title="Everything between choosing and riding"
          description="Buying a vehicle involves finance, insurance and registration whether you like it or not. We do those parts with you at the counter."
        />
        <Stagger
          as="ul"
          className="mt-12 grid list-none gap-px overflow-hidden rounded-2xl bg-hairline sm:grid-cols-2"
          stagger={0.07}
        >
          {assistance.map((service) => (
            <StaggerItem
              as="li"
              key={service.id}
              className="bg-background flex flex-col gap-3 p-7 lg:p-8"
            >
              <h3 className="font-display text-base font-semibold">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
                {service.description}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
        <p className="text-muted-foreground mt-8 text-xs">
          Rates, premiums and statutory charges are set by lenders, insurers and your
          state RTO — not by us. We will always show you the actual figures before you
          commit to anything.
        </p>
      </Section>

      {/* 10 — Customer deliveries */}
      <Section>
        <SectionHeading
          eyebrow="Deliveries"
          title="Handover day"
          description="Every scooter leaves fully charged, registered and set up, with the app paired and the charging routine explained before you ride off."
        />
        <div className="mt-10">
          <PendingData>
            Delivery photographs are published here with each customer&rsquo;s
            permission. We are collecting consent before adding any — we will not put
            someone&rsquo;s face on a website they did not agree to.
          </PendingData>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <MediaPlaceholder label="Customer delivery" ratio="aspect-4/3" />
            <MediaPlaceholder label="Customer delivery" ratio="aspect-4/3" />
            <MediaPlaceholder label="Customer delivery" ratio="aspect-4/3" />
          </div>
        </div>
      </Section>

      {/* 11 — Showroom gallery */}
      <Section tone="muted" id="gallery">
        <SectionHeading
          eyebrow="Gallery"
          title={`Inside ${DEALERSHIP_NAME}`}
          description="The floor, the workshop and the delivery bay."
        />
        <div className="mt-12">
          <ShowroomGallery images={dealership.gallery} />
        </div>
        {galleryPending ? (
          <p className="text-muted-foreground mt-6 text-xs">
            Photographs of the showroom are being added. The layout above is reserved for
            them.
          </p>
        ) : null}
      </Section>

      {/* 12, 13, 14, 15 — Location, hours, contact and directions, per branch */}
      <Section id="location">
        <SectionHeading
          eyebrow={multiBranch ? "Our showrooms" : "Find us"}
          title={
            multiBranch
              ? "Choose your showroom"
              : cityKnown
                ? `Where we are in ${city}`
                : "Where to find us"
          }
          description={
            multiBranch
              ? "Pick a showroom to see its address, opening hours, contact details, the Lectrix EV models on its floor and the services it offers."
              : "Opening hours, contact details and directions. Call ahead if you want a specific model ready when you arrive."
          }
        />
        <div className="mt-12">
          <BranchExperience views={branchViews} initialBranchId={requestedBranch} />
        </div>
      </Section>

      {multiBranch ? (
        <Section tone="muted" id="all-showrooms">
          <SectionHeading
            eyebrow="All locations"
            title={`Every ${DEALERSHIP_NAME} showroom`}
            description="Each one is an authorized Lectrix EV dealership, with the same range, warranty and after-sales support behind it."
          />
          <ul className="mt-12 grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {branches.map((branch) => (
              <li key={branch.branchId} className="flex">
                <BranchCard branch={branch} className="w-full" />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section tone="inverse">
        <div className="mx-auto max-w-2xl text-center">
          <Users aria-hidden className="text-brand-400 mx-auto size-7" />
          <h2 className="text-display-lg mt-6">Drop in this week</h2>
          <p className="text-on-inverse-muted mt-5 text-lead text-pretty">
            No appointment needed to look around. Book ahead only if you want a
            particular model reserved for a test ride.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="brand" size="xl">
              <Link href="/book-test-ride">Book a Test Ride</Link>
            </Button>
            <Button asChild variant="outline-inverse" size="xl">
              <a
                href={whatsappUrl(
                  `Hi ${dealership.dealershipName}, I would like to visit the showroom.`
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle aria-hidden />
                WhatsApp us
              </a>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
