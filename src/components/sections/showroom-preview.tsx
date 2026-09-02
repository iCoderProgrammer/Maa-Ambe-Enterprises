import Link from "next/link";
import { ArrowRight, Clock, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { MediaPlaceholder } from "@/components/common/media-placeholder";
import { Reveal } from "@/components/common/motion";
import { DEALERSHIP_NAME } from "@/lib/brand";
import {
  dealership,
  formatAddress,
  groupedOpeningHours,
  telUrl,
  whatsappUrl,
} from "@/data/dealership";

const gallery = [
  { label: "Showroom exterior", className: "sm:col-span-2 sm:row-span-2" },
  { label: "Display floor" },
  { label: "Delivery bay" },
  { label: "Service workshop" },
];

const shortDay = (day: string) => day.slice(0, 3);

/** Dealership section. Every detail comes from `data/dealership.ts`. */
export function ShowroomPreview() {
  const hours = groupedOpeningHours();
  const addressPending = dealership.placeholders.includes("address");

  return (
    <Section id="showroom">
      <SectionHeading
        eyebrow="Visit us"
        title={`Visit ${DEALERSHIP_NAME}`}
        description="Photographs only tell you so much. Come and sit on the scooter, check the boot space, and take it out on the road before you decide."
        action={
          <Button asChild variant="outline" size="lg">
            <Link href="/showroom">
              About our showroom
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        }
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
        <Reveal className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:grid-rows-2">
          {gallery.map((item) => (
            <MediaPlaceholder
              key={item.label}
              label={item.label}
              ratio="aspect-square"
              className={item.className}
            />
          ))}
        </Reveal>

        <div className="border-hairline bg-surface-muted flex flex-col rounded-2xl border p-6 sm:p-8">
          <h3 className="font-display text-base font-semibold">
            {dealership.dealershipName}
          </h3>

          <dl className="mt-6 space-y-5 text-sm">
            <div className="flex gap-3">
              <dt className="sr-only">Address</dt>
              <MapPin aria-hidden className="text-brand-600 mt-0.5 size-4 shrink-0" />
              <dd className="text-muted-foreground">
                {formatAddress()}
                {addressPending ? (
                  <span className="mt-1 block text-xs">
                    Full address is being finalised — call us and we will guide you in.
                  </span>
                ) : null}
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
                      {group.days.length > 1
                        ? ` – ${shortDay(group.days.at(-1)!)}`
                        : ""}
                      {": "}
                      {group.opens && group.closes
                        ? `${group.opens} – ${group.closes}`
                        : "Closed"}
                    </li>
                  ))}
                </ul>
              </dd>
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
          </dl>

          <div className="mt-8 space-y-3">
            <Button asChild size="lg" block>
              <a href={dealership.directionsUrl} target="_blank" rel="noopener noreferrer">
                <Navigation aria-hidden />
                Get Directions
              </a>
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button asChild variant="outline" size="lg">
                <a href={telUrl()}>
                  <Phone aria-hidden />
                  Call
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a
                  href={whatsappUrl(
                    `Hi ${dealership.dealershipName}, I would like to visit the showroom.`
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
      </div>
    </Section>
  );
}
