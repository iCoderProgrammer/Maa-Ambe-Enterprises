import Link from "next/link";
import { ArrowRight, IndianRupee } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";
import { MaskLine, Stagger, StaggerItem } from "@/components/common/motion";
import { HeroVehicle } from "@/components/sections/hero-vehicle";
import { HeroBackdrop } from "@/components/three/hero-backdrop";
import { getProducts } from "@/lib/products";
import { getShowroom } from "@/data/showroom";
import { DEALERSHIP_LINE, DEALERSHIP_NAME, VEHICLE_BRAND, brandedModel } from "@/lib/brand";

/** The model whose cut-out render stands in the hero. */
const HERO_MODEL = "nduro";

/**
 * Homepage hero.
 *
 * Opens by naming the dealership and its relationship to the vehicle brand,
 * so the first line a visitor reads establishes that Maa Ambey Enterprises
 * sells Lectrix EV rather than being it.
 *
 * WHY THE PANEL IS DARK AND THE PAGE IS NOT. Every asset available for the
 * lineup is a studio cut-out lit for a white background; dropped into a white
 * hero they read as catalogue thumbnails. On ink, with a pool of light under
 * the wheels, the same render reads as a vehicle on a stand — which is what a
 * showroom hero is. The rest of the site stays light, so the panel also does
 * the job of a title card: one dark frame, then the page proper.
 *
 * WHY IT STARTS BELOW THE HEADER, WITH NO PADDING TO PUT IT THERE. The header
 * is `sticky`, not `fixed`, so it still occupies its own height in the flow
 * and this panel already begins underneath it. That matters: the header is
 * transparent until the page scrolls and its labels are ink, so ink bodywork
 * must never pass behind it in that state. It cannot — by the time anything
 * here is under the header, the page has scrolled and the header has taken
 * its solid background (see `header-chrome.tsx`, which switches at the first
 * pixel for exactly this reason). No inverted-header mode to maintain.
 *
 * WHY THIS MODEL. It is the only model with photography that has an alpha
 * channel, and a cut-out is what the composition needs. It is named and
 * linked rather than presented as generic stock, so the hero sells a specific
 * scooter a visitor can go and read about.
 *
 * Server-rendered apart from two leaves: the vehicle, which follows the
 * pointer, and the WebGL field, which only exists on devices that opted into
 * it. The headline, the copy, the calls to action and the trust row are all
 * static markup.
 */
export function Hero() {
  const products = getProducts();
  const hero = products.find((product) => product.slug === HERO_MODEL) ?? products[0];

  /*
   * The showroom's variant image, not `images.hero`. The composition needs a
   * cut-out — a render with a white background pasted onto an ink panel is
   * exactly the catalogue-thumbnail look the panel exists to avoid — and the
   * variant image is the one asset in the set that is guaranteed to be one.
   * A model without a showroom entry simply gets the text hero, which stands
   * on its own, rather than a photograph fighting its background.
   */
  const heroImage = getShowroom(hero.slug)?.variantImage;

  const assurances = [
    {
      label: "Authorized dealership",
      detail: `Sales, service and warranty for ${VEHICLE_BRAND}`,
    },
    {
      label: `${products.length} models`,
      detail: "Compare range, battery and price side by side",
    },
    {
      label: "Free test rides",
      detail: "About fifteen minutes — bring your licence",
    },
  ];

  return (
    <section className="bg-background">
      <div className="bg-surface-inverse text-on-inverse relative isolate overflow-hidden">
        {/* Two backdrop layers, in order of how much they cost. The gradient
            is always there and is a complete composition on its own; the
            WebGL field is an addition for devices that can spare it, and
            renders nothing at all on the ones that cannot. */}
        <div aria-hidden className="hero-glow absolute inset-0 -z-20" />
        <HeroBackdrop className="absolute inset-x-0 bottom-0 -z-10 h-[72%] opacity-45 [mask-image:radial-gradient(ellipse_at_50%_60%,black_10%,transparent_65%)] lg:left-auto lg:right-0 lg:w-[68%]" />

        <Container>
          {/* Sized so the assurance rail below is just cut off by the fold —
              the page reads as continuing rather than as ending here. */}
          <div className="grid items-center gap-10 pt-14 pb-14 lg:min-h-[calc(100svh-13rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-16 lg:pt-8 lg:pb-10">
            <Stagger className="max-w-xl" stagger={0.09}>
              <StaggerItem>
                <p className="text-eyebrow flex flex-wrap items-center gap-x-2.5 gap-y-1 uppercase">
                  <span className="text-on-inverse">{DEALERSHIP_NAME}</span>
                  <span aria-hidden className="hidden h-3 w-px bg-white/25 sm:block" />
                  <span className="text-brand-400">{DEALERSHIP_LINE}</span>
                </p>
              </StaggerItem>

              <h1 className="text-display-2xl mt-6">
                <MaskLine>Your Electric</MaskLine>
                <MaskLine>Journey Starts Here.</MaskLine>
              </h1>

              <StaggerItem>
                <p className="text-on-inverse-muted mt-6 text-lead text-pretty">
                  Experience {VEHICLE_BRAND} electric scooters at {DEALERSHIP_NAME} —
                  built for smarter, cleaner and more economical everyday commuting.
                </p>
              </StaggerItem>

              {/*
                Two buttons, not three. Three `xl` buttons do not fit one line
                in this column at any desktop width, and a wrapped row of
                equally-weighted calls to action asks the visitor to rank them
                instead of stating a preference. The pricing route keeps its
                place in the hero as a quiet link — still one click away, no
                longer competing with the booking CTA.
              */}
              <StaggerItem className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="brand" size="xl">
                  <Link href="/book-test-ride">Book a Test Ride</Link>
                </Button>
                <Button asChild variant="inverse" size="xl">
                  <Link href="/electric-scooters">
                    Explore Electric Scooters
                    <ArrowRight aria-hidden />
                  </Link>
                </Button>
              </StaggerItem>

              <StaggerItem className="mt-6">
                <Link
                  href="/on-road-price"
                  className="text-on-inverse-muted hover:text-on-inverse group inline-flex items-center gap-2 rounded-md text-sm transition-colors"
                >
                  <IndianRupee aria-hidden className="size-4" />
                  Get your on-road price
                  <ArrowRight
                    aria-hidden
                    className="size-4 transition-transform duration-300 ease-(--ease-out-brand) group-hover:translate-x-0.5"
                  />
                </Link>
              </StaggerItem>
            </Stagger>

            <div className="lg:-mr-6 xl:-mr-12">
              {heroImage ? (
                <HeroVehicle
                  src={heroImage.src}
                  alt={`${brandedModel(hero.name)} electric scooter, side profile`}
                />
              ) : null}

              <p className="-mt-1 flex justify-end">
                <Link
                  href={`/electric-scooters/${hero.slug}`}
                  className="text-on-inverse-muted hover:text-on-inverse group inline-flex items-center gap-2 rounded-md text-xs"
                >
                  <span className="bg-brand-400 size-1.5 rounded-full" aria-hidden />
                  Pictured: {brandedModel(hero.name)}
                  <ArrowRight
                    aria-hidden
                    className="size-3.5 transition-transform duration-300 ease-(--ease-out-brand) group-hover:translate-x-0.5"
                  />
                </Link>
              </p>
            </div>
          </div>
        </Container>

        {/* Closing rail. Three plain claims, each of which the rest of the site
            has to be able to stand behind — no figures the dealership has not
            confirmed. */}
        <div className="border-t border-white/10">
          <Container>
            <Stagger
              as="ul"
              className="grid list-none gap-5 sm:grid-cols-3 sm:gap-10"
              stagger={0.07}
              delayChildren={0.35}
            >
              {assurances.map((item) => (
                <StaggerItem
                  as="li"
                  key={item.label}
                  className="flex flex-col gap-1 sm:py-7 [&:first-child]:pt-6 [&:last-child]:pb-6 sm:[&:first-child]:pt-7 sm:[&:last-child]:pb-7"
                >
                  <span className="font-display text-sm font-semibold">{item.label}</span>
                  <span className="text-on-inverse-muted text-xs leading-relaxed">
                    {item.detail}
                  </span>
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </div>
      </div>

      {/* Scroll cue lives on the light page below the panel, where it points at
          content rather than sitting inside the frame it is asking you to
          leave. Desktop only — a phone needs no invitation to scroll. */}
      <div className="hidden justify-center pt-8 lg:flex">
        <a
          href="#lineup"
          className="text-muted-foreground hover:text-foreground flex flex-col items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors"
        >
          <span>Scroll to explore</span>
          <span
            aria-hidden
            className="border-hairline relative flex h-9 w-5.5 justify-center rounded-full border pt-1.5"
          >
            <span className="bg-brand-500 h-1.5 w-1 rounded-full motion-safe:animate-(--animate-scroll-hint)" />
          </span>
        </a>
      </div>
    </section>
  );
}
