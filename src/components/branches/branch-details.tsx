import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Clock,
  ExternalLink,
  Mail,
  Map,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PendingData } from "@/components/common/pending-data";
import { MediaPlaceholder } from "@/components/common/media-placeholder";
import { DEALERSHIP_NAME, brandedModel } from "@/lib/brand";
import {
  branchDirectionsUrl,
  branchMapEmbedUrl,
  branchMapUrl,
  branchTelUrl,
  branchWhatsappUrl,
  formatBranchAddress,
  groupedBranchHours,
  isBranchPlaceholder,
  type BranchView,
} from "@/lib/branches";

const shortDay = (day: string) => day.slice(0, 3);

/**
 * Everything that changes when a different showroom is selected: address,
 * contact, hours, map, the services that counter offers and the models on its
 * floor.
 *
 * Presentational and free of state — the selection lives in
 * `BranchExperience`, so this same panel serves the homepage section, the
 * showroom page and anywhere else a single branch needs to be described.
 */
export function BranchDetails({ view }: { view: BranchView }) {
  const { branch, models, services } = view;

  const addressPending = isBranchPlaceholder("address", branch);
  const phonePending = isBranchPlaceholder("phone", branch);
  const emailPending = isBranchPlaceholder("email", branch);
  const hoursPending = isBranchPlaceholder("openingHours", branch);
  const hours = groupedBranchHours(branch);

  // Map, directions and embed all follow the selected branch, because all three
  // are derived from that branch's record — selecting a showroom cannot leave
  // the map pointing at a different one.
  const mapUrl = branchMapUrl(branch);
  const directionsUrl = branchDirectionsUrl(branch);
  const mapEmbedUrl = branchMapEmbedUrl(branch);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
      <div>
        <h3 className="font-display text-xl font-semibold text-pretty">
          {branch.branchName}
        </h3>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed text-pretty">
          {branch.tagline}
        </p>

        <dl className="border-hairline mt-7 space-y-5 border-t pt-7 text-sm">
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
            <dt className="sr-only">Email</dt>
            <Mail aria-hidden className="text-brand-600 mt-0.5 size-4 shrink-0" />
            <dd>
              {emailPending ? (
                <span className="text-muted-foreground">Email to be confirmed</span>
              ) : (
                <a
                  href={`mailto:${branch.email}`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {branch.email}
                </a>
              )}
            </dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button asChild variant="brand" size="lg">
            <Link href={`/book-test-ride?branch=${branch.branchId}`}>Book Test Ride</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a
              href={branchWhatsappUrl(
                branch,
                `Hi ${DEALERSHIP_NAME}, I would like to visit your ${branch.branchName}.`
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle aria-hidden />
              WhatsApp
            </a>
          </Button>
          {directionsUrl ? (
            <Button asChild variant="outline" size="lg">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Get directions to ${branch.branchName} on Google Maps`}
              >
                <Navigation aria-hidden />
                Get Directions
              </a>
            </Button>
          ) : (
            <Button variant="outline" size="lg" disabled>
              <Navigation aria-hidden />
              Get Directions
            </Button>
          )}

          {mapUrl ? (
            <Button asChild variant="outline" size="lg">
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${branch.branchName} on Google Maps`}
              >
                <Map aria-hidden />
                View on Google Maps
              </a>
            </Button>
          ) : null}
        </div>
      </div>

      <div className="space-y-8">
        <div>
          {mapEmbedUrl ? (
            <iframe
              src={mapEmbedUrl}
              title={`Google Maps showing the location of ${branch.branchName}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="border-hairline aspect-4/3 w-full rounded-2xl border"
            />
          ) : (
            <MediaPlaceholder
              label={`${branch.branchName} — map location to be confirmed`}
              ratio="aspect-4/3"
              className="rounded-2xl"
            />
          )}

          {mapUrl ? (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground mt-3 inline-flex items-center gap-1.5 text-xs transition-colors"
            >
              Open {branch.branchName} in Google Maps
              <ExternalLink aria-hidden className="size-3.5" />
            </a>
          ) : (
            <p className="text-muted-foreground mt-3 text-xs">
              The Google Maps location for this showroom is being confirmed. Call or
              message us and we will guide you in.
            </p>
          )}
        </div>

        <div>
          <h4 className="text-eyebrow text-muted-foreground uppercase">
            Available at this showroom
          </h4>
          {models.length > 0 ? (
            <ul className="mt-4 flex list-none flex-wrap gap-2">
              {models.map((model) => (
                <li key={model.slug}>
                  <Link
                    href={`/electric-scooters/${model.slug}`}
                    className="border-hairline hover:bg-muted/70 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors"
                  >
                    {brandedModel(model.name)}
                    <ArrowRight aria-hidden className="size-3.5" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <PendingData className="mt-4">
              The Lectrix EV models stocked at this showroom are being confirmed. Call or
              message us and we will tell you what is on the floor today.
            </PendingData>
          )}
        </div>

        <div>
          <h4 className="text-eyebrow text-muted-foreground uppercase">
            Services at this showroom
          </h4>
          {services.length > 0 ? (
            <ul className="mt-4 grid list-none gap-2 sm:grid-cols-2">
              {services.map((service) => (
                <li
                  key={service.id}
                  className="text-muted-foreground flex items-start gap-2 text-sm"
                >
                  <BadgeCheck aria-hidden className="text-brand-600 mt-0.5 size-4 shrink-0" />
                  <span className="text-pretty">{service.title}</span>
                </li>
              ))}
            </ul>
          ) : (
            <PendingData className="mt-4">
              The services offered at this showroom are being confirmed.
            </PendingData>
          )}
        </div>
      </div>
    </div>
  );
}
