import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/common/section";
import { Stagger, StaggerItem } from "@/components/common/motion";
import { dealership, whatsappUrl } from "@/data/dealership";
import { DEALERSHIP_NAME } from "@/lib/brand";

/** Closing conversion block. */
export function FinalCta() {
  return (
    <Section tone="inverse">
      {/* The last thing on the page, and the one being asked to convert — it
          should arrive rather than already be there. */}
      <Stagger className="mx-auto max-w-2xl text-center" stagger={0.07}>
        <StaggerItem as="span" className="block">
          <h2 className="text-display-lg">Ready to Go Electric?</h2>
        </StaggerItem>
        <StaggerItem as="p" className="text-on-inverse-muted text-lead mt-5 block text-pretty">
          Book a free test ride at {DEALERSHIP_NAME}, or tell us your city and we will
          send you the latest on-road price for the Lectrix EV model you like.
        </StaggerItem>
        <StaggerItem className="mt-9 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
          <Button asChild variant="brand" size="xl">
            <Link href="/book-test-ride">Book Test Ride</Link>
          </Button>
          <Button asChild variant="outline-inverse" size="xl">
            <Link href="/on-road-price">Get On-Road Price</Link>
          </Button>
          <Button asChild variant="outline-inverse" size="xl">
            <Link href="/contact">Contact Showroom</Link>
          </Button>
        </StaggerItem>
        <StaggerItem as="p" className="mt-7">
          <a
            href={whatsappUrl(
              `Hi ${dealership.dealershipName}, I would like to know more about the Lectrix EV scooters you sell.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="text-on-inverse-muted hover:text-on-inverse inline-flex items-center gap-2 rounded-md text-sm transition-colors"
          >
            <MessageCircle aria-hidden className="size-4" />
            Or send us a message on WhatsApp
          </a>
        </StaggerItem>
      </Stagger>
    </Section>
  );
}
