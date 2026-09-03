"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, MessageCircle, Phone } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/common/logo";
import { primaryNav } from "@/config/navigation";
import { dealership, telUrl, whatsappUrl } from "@/data/dealership";

/**
 * Slide-in navigation for every width below `xl`, where the eight primary
 * labels no longer fit beside the brand lockup and the test-ride CTA. Radix
 * Sheet handles focus trapping, scroll locking, Escape-to-close and returning
 * focus to the trigger.
 */
export function MobileNav() {
  const pathname = usePathname();

  // Uncontrolled on purpose: every navigation link is wrapped in `SheetClose`,
  // so Radix closes the drawer itself and no effect-driven state is needed.
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open navigation menu"
          className="xl:hidden"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>

      {/*
        `data-[side=right]:w-full`, not a bare `w-full`. The sheet's own width
        is set by a `data-[side=right]:w-3/4` variant, which is more specific
        than a plain utility and quietly won — leaving a 292px drawer on a
        390px phone, too narrow for the brand lockup, which then ran underneath
        the close button. Matching the selector's specificity makes the
        full-width intent this file always declared actually take effect.
      */}
      <SheetContent
        side="right"
        showCloseButton
        className="gap-0 p-0 data-[side=right]:w-full sm:data-[side=right]:max-w-sm"
      >
        {/* `pr-14` clears the sheet's own close button, which is absolutely
            positioned at the top right. Without it the brand lockup ran
            underneath the X on a 390px screen. */}
        <SheetHeader className="border-hairline flex-row items-center justify-between border-b p-5 pr-14">
          <SheetTitle asChild>
            <div>
              <Logo asLink={false} />
            </div>
          </SheetTitle>
        </SheetHeader>

        <nav aria-label="Main" className="flex-1 overflow-y-auto p-3">
          <ul className="flex flex-col gap-1">
            {primaryNav.map((item, index) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li
                  key={item.href}
                  className="motion-safe:drawer-item"
                  style={{ "--i": index } as React.CSSProperties}
                >
                  <SheetClose asChild>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "group flex items-start gap-3.5 rounded-xl px-3 py-3.5 transition-colors",
                        isActive
                          ? "bg-muted text-foreground"
                          : "text-foreground hover:bg-muted/70"
                      )}
                    >
                      {Icon ? (
                        <Icon
                          aria-hidden
                          className={cn(
                            "mt-0.5 size-5 shrink-0",
                            isActive ? "text-brand-600" : "text-muted-foreground"
                          )}
                        />
                      ) : null}
                      <span className="min-w-0">
                        <span className="font-display block text-[0.9375rem] font-medium">
                          {item.label}
                        </span>
                        {item.description ? (
                          <span className="text-muted-foreground mt-0.5 block text-xs">
                            {item.description}
                          </span>
                        ) : null}
                      </span>
                      <ArrowUpRight
                        aria-hidden
                        className="text-muted-foreground ml-auto size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    </Link>
                  </SheetClose>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-hairline space-y-3 border-t p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          <SheetClose asChild>
            <Button asChild variant="brand" size="lg" block>
              <Link href="/book-test-ride">Book a Test Ride</Link>
            </Button>
          </SheetClose>
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
                  `Hi ${dealership.dealershipName}, I would like to know more about the Lectrix EV scooters you sell.`
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
      </SheetContent>
    </Sheet>
  );
}
