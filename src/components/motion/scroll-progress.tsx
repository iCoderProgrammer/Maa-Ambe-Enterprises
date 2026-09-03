"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * How far through the page the reader is, as a hairline under the header.
 *
 * Deliberately NOT gated on `prefers-reduced-motion`. This is not decoration
 * that happens to move — it is position feedback, the same class of thing as a
 * scrollbar, and it is arguably more useful to someone who has asked for a
 * calmer page and is navigating a long model walk-through. `scrub: true`
 * follows the scroll with no easing of its own, so it never animates
 * independently of the reader's own input.
 *
 * `aria-hidden`, because a screen reader already reports position far better
 * than a bar can, and `pointer-events-none` so it cannot intercept a click
 * meant for the sticky navigation a few pixels below it.
 */
export function ScrollProgress({ className }: { className?: string }) {
  const barRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            /*
             * No trigger element. The thing being measured is the scroll
             * range itself, so the range is stated directly: nought to
             * `maxScroll`. Handing ScrollTrigger `document.documentElement`
             * as a trigger instead looks equivalent and is not — it is the
             * scroller, and measuring an element against itself pins the
             * progress at zero. `maxScroll` is a function so that
             * `invalidateOnRefresh` re-reads it after images land and the
             * page gets taller.
             */
            start: 0,
            end: () => ScrollTrigger.maxScroll(window),
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    });

    // The page is taller once its images have decoded, and a progress bar
    // measured against the pre-image height reaches 100% early.
    const onLoad = () => ScrollTrigger.refresh();
    if (document.readyState !== "complete") {
      window.addEventListener("load", onLoad, { once: true });
    }

    return () => {
      window.removeEventListener("load", onLoad);
      ctx.revert();
    };
  }, []);

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 h-px overflow-hidden",
        className
      )}
    >
      {/*
        The resting state is an inline `transform`, not a `scale-x-0` class.
        Tailwind v4 compiles scale utilities to the standalone `scale`
        property, which composes WITH whatever `transform` GSAP writes rather
        than being replaced by it — the bar would stay at zero width however
        far the page scrolled. Same property, one writer.
      */}
      <div
        ref={barRef}
        className="bg-brand-500 h-full w-full origin-left"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
