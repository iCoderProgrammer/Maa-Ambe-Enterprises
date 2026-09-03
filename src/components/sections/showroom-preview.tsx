import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { MediaPlaceholder } from "@/components/common/media-placeholder";
import { Reveal } from "@/components/common/motion";
import { Parallax } from "@/components/motion/parallax";
import { cn } from "@/lib/utils";
import { DEALERSHIP_NAME } from "@/lib/brand";
import {
  dealership,
  formatAddress,
  groupedOpeningHours,
  telUrl,
  whatsappUrl,
} from "@/data/dealership";

/**
 * The four shots this mosaic is built for, in the order the branch supplies
 * them. The labels are only reached when a branch has no photography of its
 * own — they name what is missing rather than leaving four grey squares.
 */
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
        {/*
          The showroom's own photography, which this section previously ignored
          in favour of four hard-coded placeholders — so the page stayed grey
          even for a branch that had supplied images. It now reads
          `dealership.gallery` (the primary branch's shots) and falls back to
          the labelled placeholders only for the slots a branch has not filled.

          Only the lead tile parallaxes. Depth on all four would fight the grid
          the mosaic depends on: the moment neighbouring tiles move at
          different rates they stop reading as one arrangement.
        */}
        <Reveal className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:grid-rows-2">
          {gallery.map((item, index) => {
            const image = dealership.gallery[index];

            if (!image) {
              return (
                <MediaPlaceholder
                  key={item.label}
                  label={item.label}
                  ratio="aspect-square"
                  className={item.className}
                />
              );
            }

            const media = (
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes={
                  index === 0
                    ? "(min-width: 1024px) 30vw, 46vw"
                    : "(min-width: 1024px) 15vw, 46vw"
                }
                className="h-full w-full object-cover"
              />
            );

            return index === 0 ? (
              <Parallax
                key={image.src}
                speed={12}
                className={cn(
                  "bg-surface-muted aspect-square rounded-2xl",
                  item.className
                )}
              >
                {media}
              </Parallax>
            ) : (
              <div
                key={image.src}
                className={cn(
                  "bg-surface-muted aspect-square overflow-hidden rounded-2xl",
                  item.className
                )}
              >
                {media}
              </div>
            );
          })}
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
            {dealership.directionsUrl ? (
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
            ) : (
              <Button size="lg" block disabled>
                <Navigation aria-hidden />
                Get Directions
              </Button>
            )}
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
