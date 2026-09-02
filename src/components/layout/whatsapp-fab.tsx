import { MessageCircle } from "lucide-react";

import { dealership, whatsappUrl } from "@/data/dealership";

/**
 * Floating WhatsApp button for tablet and desktop. Hidden below `md`, where the
 * mobile action bar already exposes the same action.
 */
export function WhatsAppFab() {
  return (
    <a
      href={whatsappUrl(
        `Hi ${dealership.dealershipName}, I would like to know more about the Lectrix EV scooters you sell.`
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${dealership.dealershipName} on WhatsApp`}
      className="group bg-brand text-brand-foreground fixed right-6 bottom-6 z-40 hidden size-14 items-center justify-center rounded-full shadow-brand transition-transform duration-300 ease-(--ease-out-brand) hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring md:inline-flex"
    >
      <span
        aria-hidden
        className="bg-brand absolute inset-0 -z-10 rounded-full motion-safe:animate-(--animate-pulse-ring)"
      />
      <MessageCircle aria-hidden className="size-6" />
    </a>
  );
}
