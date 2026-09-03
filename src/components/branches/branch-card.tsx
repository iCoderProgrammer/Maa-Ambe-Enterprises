import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  ExternalLink,
  Map,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MediaPlaceholder } from "@/components/common/media-placeholder";
import { cn } from "@/lib/utils";
import { DEALERSHIP_NAME } from "@/lib/brand";
import {
  branchDirectionsUrl,
  branchLocality,
  branchMapUrl,
  branchTelUrl,
  branchWhatsappUrl,
  formatBranchAddress,
  groupedBranchHours,
  isBranchPlaceholder,
  type Branch,
} from "@/lib/branches";

const statusLabel = {
  open: "Open",
  "opening-soon": "Opening soon",
  "temporarily-closed": "Temporarily closed",
} as const;

const shortDay = (day: string) => day.slice(0, 3);

/**
 * One showroom, as a card.
 *
 * Nothing about any specific location is written here — name, address, hours
 * and contact all arrive on the `branch` prop, so adding a fourth showroom is a
 * data change and this file never moves. Fields the branch still lists as
 * placeholders are labelled as pending rather than printed as though real: a
 * customer will put an address into a maps app, so a plausible-looking wrong
 * one is worse than an honest gap.
 */
export function BranchCard({
  branch,
  className,
  /** Renders the compact form used inside the mobile carousel. */
  compact = false,
}: {
  branch: Branch;
  className?: string;
  compact?: boolean;
}) {
  const hours = groupedBranchHours(branch);
  const addressPending = isBranchPlaceholder("address", branch);
  const phonePending = isBranchPlaceholder("phone", branch);
  const hoursPending = isBranchPlaceholder("openingHours", branch);
  // Both map links are derived from this branch's own coordinates or address,
  // so a card never carries a hard-coded location. Null means the branch has
  // neither yet, and the map row and Directions button say so instead of
  // pointing at a generic maps page.
  const mapUrl = branchMapUrl(branch);
  const directionsUrl = branchDirectionsUrl(branch);
  const image = branch.branchImages[0];

  return (
    <article
      className={cn(
        "border-hairline bg-card flex flex-col overflow-hidden rounded-2xl border transition-shadow duration-300 ease-(--ease-out-brand) hover:shadow-lg",
        className
      )}
    >
      {!compact ? (
        <div className="bg-surface-muted relative">
          {image ? (
            /* Branch photography carries its intrinsic size in the data, so the
               optimizer can serve AVIF/WebP at the card's real width rather
               than shipping a full-resolution showroom photograph. */
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(min-width: 1024px) 32rem, (min-width: 640px) 45vw, 92vw"
              className="aspect-4/3 w-full object-cover"
            />
          ) : (
            <MediaPlaceholder
              label={`${branch.branchName} — showroom photograph`}
              className="rounded-none"
            />
          )}
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-lg font-semibold text-pretty">
              {branch.branchName}
            </h3>
            <p className="text-muted-foreground mt-1 text-xs">
              {addressPending ? "Location to be confirmed" : branchLocality(branch)}
            </p>
          </div>
          <Badge variant={branch.status === "open" ? "secondary" : "outline"}>
            {statusLabel[branch.status]}
          </Badge>
        </div>

        <p className="text-muted-foreground mt-3 text-sm leading-relaxed text-pretty">
          {branch.tagline}
        </p>

        <dl className="border-hairline mt-5 space-y-3 border-t pt-5 text-sm">
          <div className="flex gap-3">
            <dt className="sr-only">Address</dt>
            <MapPin aria-hidden className="text-brand-600 mt-0.5 size-4 shrink-0" />
            <dd className="text-muted-foreground text-pretty">
              {addressPending
                ? "Full address is being finalised — call and we will guide you in."
                : formatBranchAddress(branch)}
            </dd>
          </div>

          <div className="flex gap-3">
            <dt className="sr-only">Opening hours</dt>
            <Clock aria-hidden className="text-brand-600 mt-0.5 size-4 shrink-0" />
            <dd className="text-muted-foreground">
              {hoursPending ? (
                "Opening hours to be confirmed"
              ) : (
                <ul className="space-y-0.5">
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
              )}
            </dd>
          </div>

          <div className="flex gap-3">
            <dt className="sr-only">Phone</dt>
            <Phone aria-hidden className="text-brand-600 mt-0.5 size-4 shrink-0" />
            <dd>
              {phonePending ? (
                <span className="text-muted-foreground">Number to be confirmed</span>
              ) : (
                <a
                  href={branchTelUrl(branch)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {branch.phoneDisplay}
                </a>
              )}
            </dd>
          </div>

          <div className="flex gap-3">
            <dt className="sr-only">Google Maps location</dt>
            <Map aria-hidden className="text-brand-600 mt-0.5 size-4 shrink-0" />
            <dd>
              {mapUrl ? (
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 inline-flex items-center gap-1 font-medium transition-colors"
                >
                  View on Google Maps
                  <ExternalLink aria-hidden className="size-3.5" />
                </a>
              ) : (
                <span className="text-muted-foreground">
                  Map location to be confirmed
                </span>
              )}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="brand" className="flex-1">
            <Link href={`/book-test-ride?branch=${branch.branchId}`}>Book Test Ride</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href={`/showroom?branch=${branch.branchId}`}>
              View Details
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {phonePending ? (
            <Button variant="ghost" size="sm" disabled>
              <Phone aria-hidden />
              Call
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <a href={branchTelUrl(branch)} aria-label={`Call ${branch.branchName}`}>
                <Phone aria-hidden />
                Call
              </a>
            </Button>
          )}
          <Button asChild variant="ghost" size="sm">
            <a
              href={branchWhatsappUrl(
                branch,
                `Hi ${DEALERSHIP_NAME}, I would like to know more about the Lectrix EV scooters at your ${branch.branchName}.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp ${branch.branchName}`}
            >
              <MessageCircle aria-hidden />
              WhatsApp
            </a>
          </Button>
          {directionsUrl ? (
            <Button asChild variant="ghost" size="sm">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Get directions to ${branch.branchName} on Google Maps`}
              >
                <Navigation aria-hidden />
                Directions
              </a>
            </Button>
          ) : (
            /* A disabled anchor is still clickable, so an unconfirmed location
               renders a real disabled button rather than a link to nowhere. */
            <Button variant="ghost" size="sm" disabled>
              <Navigation aria-hidden />
              Directions
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
