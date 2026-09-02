import Link from "next/link";
import { CalendarCheck, MessageCircle, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { dealership, telUrl, whatsappUrl } from "@/data/dealership";

/**
 * Persistent conversion bar pinned to the bottom of small screens.
 *
 * Pure markup — no client JavaScript. Body content reserves space for it via
 * the `pb-action-bar` utility so it never covers page content, and it respects
 * the iOS home-indicator safe area.
 */
export function MobileActionBar() {
  return (
    <div
      className="border-hairline bg-background/95 fixed inset-x-0 bottom-0 z-40 border-t pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_-8px_oklch(0.143_0.013_258/0.18)] supports-backdrop-filter:backdrop-blur-md md:hidden"
      role="region"
      aria-label="Quick actions"
    >
      <div className="flex items-center gap-2 px-4 py-2.5">
        <Button asChild variant="brand" size="lg" className="flex-1">
          <Link href="/book-test-ride">
            <CalendarCheck aria-hidden />
            Book Test Ride
          </Link>
        </Button>
        <Button asChild variant="outline" size="icon-lg" aria-label="Call the showroom">
          <a href={telUrl()}>
            <Phone aria-hidden />
          </a>
        </Button>
        <Button
          asChild
          variant="outline"
          size="icon-lg"
          aria-label={`Chat with ${dealership.dealershipName} on WhatsApp`}
        >
          <a
            href={whatsappUrl(
              `Hi ${dealership.dealershipName}, I would like to know more about the Lectrix EV scooters you sell.`
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle aria-hidden />
          </a>
        </Button>
      </div>
    </div>
  );
}
