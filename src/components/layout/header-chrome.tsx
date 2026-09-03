"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Sticky header shell. Adds a hairline + surface once the page has scrolled so
 * the header floats transparently over hero media at the top of a page.
 *
 * Uses a passive, rAF-throttled scroll listener — cheap enough to keep off the
 * main thread's critical path.
 *
 * The threshold is the FIRST pixel, not a comfortable dozen. The homepage's
 * hero panel is ink and begins at exactly this header's height, so any slack
 * here is a window in which dark bodywork slides behind transparent, ink-
 * coloured navigation labels. At zero there is no such window: the moment
 * anything can be underneath the header, the header has a background.
 */
export function HeaderChrome({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 0);
        frame = 0;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className={cn(
        "sticky top-0 z-50 w-full transition-[background-color,border-color,box-shadow] duration-300 ease-(--ease-out-brand)",
        scrolled
          ? "border-b border-hairline bg-background/88 shadow-xs supports-backdrop-filter:backdrop-blur-md"
          : "border-b border-transparent bg-background/0"
      )}
    >
      {children}
    </header>
  );
}
