import Link from "next/link";
import { CheckCircle2, MessageCircle, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { dealership, telUrl, whatsappUrl } from "@/data/dealership";

/**
 * Shared confirmation shown after any successful enquiry.
 *
 * Gives the customer a reference they can quote, tells them what happens next,
 * and keeps the two fastest contact routes one tap away — a submitted form is
 * not the end of the conversation.
 */
export function LeadSuccessState({
  title,
  description,
  reference,
  onReset,
  resetLabel = "Send another enquiry",
}: {
  title: string;
  description: string;
  reference?: string;
  onReset?: () => void;
  resetLabel?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="border-hairline bg-surface-muted rounded-2xl border p-7 text-center sm:p-10"
    >
      <span
        aria-hidden
        className="bg-brand text-brand-foreground mx-auto inline-flex size-12 items-center justify-center rounded-full"
      >
        <CheckCircle2 className="size-6" />
      </span>

      <h2 className="font-display mt-6 text-display-sm">{title}</h2>
      <p className="text-muted-foreground mx-auto mt-3 max-w-md text-sm text-pretty">
        {description}
      </p>

      {reference ? (
        <p className="mt-6 text-sm">
          <span className="text-muted-foreground">Your reference</span>{" "}
          <span className="font-display font-semibold tracking-wide">{reference}</span>
        </p>
      ) : null}

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild variant="outline" size="lg">
          <a href={telUrl()}>
            <Phone aria-hidden />
            Call the showroom
          </a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a
            href={whatsappUrl(
              reference
                ? `Hi ${dealership.dealershipName}, I have just submitted an enquiry. My reference is ${reference}.`
                : `Hi ${dealership.dealershipName}, I have just submitted an enquiry.`
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle aria-hidden />
            WhatsApp us
          </a>
        </Button>
      </div>

      <p className="mt-7 text-xs">
        {onReset ? (
          <button
            type="button"
            onClick={onReset}
            className="text-muted-foreground hover:text-foreground rounded-sm underline underline-offset-4 transition-colors"
          >
            {resetLabel}
          </button>
        ) : (
          <Link
            href="/electric-scooters"
            className="text-muted-foreground hover:text-foreground rounded-sm underline underline-offset-4 transition-colors"
          >
            Keep exploring the lineup
          </Link>
        )}
      </p>
    </div>
  );
}
