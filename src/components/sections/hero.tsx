import Link from "next/link";
import { ArrowRight, IndianRupee } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";
import { MediaPlaceholder } from "@/components/common/media-placeholder";
import { Reveal, Stagger, StaggerItem } from "@/components/common/motion";
import { mediaReveal } from "@/lib/motion";
import { DEALERSHIP_LINE, DEALERSHIP_NAME, VEHICLE_BRAND } from "@/lib/brand";

/**
 * Homepage hero.
 *
 * Opens by naming the dealership and its relationship to the vehicle brand,
 * so the first line a visitor reads establishes that Maa Ambe Enterprises
 * sells Lectrix EV rather than being it.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          <Stagger className="max-w-xl" stagger={0.09}>
            <StaggerItem>
              <p className="text-eyebrow flex flex-wrap items-center gap-x-2.5 gap-y-1 uppercase">
                <span className="text-foreground">{DEALERSHIP_NAME}</span>
                <span aria-hidden className="bg-hairline hidden h-3 w-px sm:block" />
                <span className="text-brand-700 dark:text-brand-400">
                  {DEALERSHIP_LINE}
                </span>
              </p>
            </StaggerItem>

            <StaggerItem>
              <h1 className="text-display-2xl mt-5">Your Electric Journey Starts Here.</h1>
            </StaggerItem>

            <StaggerItem>
              <p className="text-muted-foreground mt-6 text-lead text-pretty">
                Experience {VEHICLE_BRAND} electric scooters at {DEALERSHIP_NAME} —
                built for smarter, cleaner and more economical everyday commuting.
              </p>
            </StaggerItem>

            <StaggerItem className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild size="xl">
                <Link href="/electric-scooters">
                  Explore Electric Scooters
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild variant="brand" size="xl">
                <Link href="/book-test-ride">Book a Test Ride</Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link href="/on-road-price">
                  <IndianRupee aria-hidden />
                  Get On-Road Price
                </Link>
              </Button>
            </StaggerItem>
          </Stagger>

          <Reveal variants={mediaReveal} delay={0.1}>
            <MediaPlaceholder
              label="Hero visual — Lectrix EV scooter on the showroom floor"
              ratio="aspect-4/3 lg:aspect-5/4"
              className="rounded-3xl"
            />
          </Reveal>
        </div>

        <div className="mt-14 hidden justify-center lg:flex">
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
      </Container>
    </section>
  );
}
