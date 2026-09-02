import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  DEALERSHIP_IDENTITY,
  DEALERSHIP_NAME,
  VEHICLE_BRAND,
} from "@/lib/brand";

interface LogoProps extends React.ComponentProps<"span"> {
  /** Wrap the mark in a link to the homepage. */
  asLink?: boolean;
  /** Invert for dark surfaces. */
  tone?: "default" | "inverse";
  /** Hide the dealership line where vertical space is tight. */
  showBrandLine?: boolean;
}

/**
 * Brand lockup for the dealership.
 *
 * The primary line is the business — Maa Ambe Enterprises. The supporting
 * line states the relationship to the vehicle brand and keeps "Lectrix EV"
 * visually identifiable in the brand colour, so a visitor reads at a glance
 * that this is a Lectrix EV dealership rather than Lectrix EV itself.
 *
 * Drawn inline as SVG + text so it stays crisp, themeable and free of a
 * network request. Swap the glyph for the official dealership mark when one
 * is supplied.
 */
export function Logo({
  className,
  asLink = true,
  tone = "default",
  showBrandLine = true,
  ...props
}: LogoProps) {
  const inverse = tone === "inverse";

  const mark = (
    <span
      className={cn(
        "inline-flex items-center gap-2.5",
        inverse ? "text-on-inverse" : "text-foreground",
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        className="bg-foreground text-background inline-flex size-8 shrink-0 items-center justify-center rounded-[0.55rem]"
      >
        <svg viewBox="0 0 24 24" className="size-4.5" fill="none">
          <path
            d="M13.2 2 5 13.4h5.1L9.6 22 18 10.4h-5.2L13.2 2Z"
            fill="currentColor"
          />
        </svg>
      </span>

      <span className="flex min-w-0 flex-col leading-none">
        <span className="font-display text-[0.9375rem] font-semibold tracking-tight whitespace-nowrap uppercase">
          {DEALERSHIP_NAME}
        </span>
        {showBrandLine ? (
          <span
            className={cn(
              "mt-1 text-[0.625rem] font-medium tracking-[0.06em] whitespace-nowrap uppercase",
              inverse ? "text-on-inverse-muted" : "text-muted-foreground"
            )}
          >
            Authorized{" "}
            <span className={inverse ? "text-brand-400" : "text-brand-700 dark:text-brand-400"}>
              {VEHICLE_BRAND}
            </span>{" "}
            Dealership
          </span>
        ) : null}
      </span>
    </span>
  );

  if (!asLink) return mark;

  return (
    <Link
      href="/"
      aria-label={`${DEALERSHIP_IDENTITY} — home`}
      className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
    >
      {mark}
    </Link>
  );
}
