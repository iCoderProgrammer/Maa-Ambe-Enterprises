"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { gsap } from "@/lib/gsap";
import { useGsapEffect } from "@/hooks/use-gsap";

interface ParallaxProps extends React.ComponentProps<"div"> {
  /**
   * Total vertical travel as a percentage of the frame's own height, spread
   * across the whole time the frame is on screen. 8–14 reads as depth; past
   * about 20 it reads as a bug.
   */
  speed?: number;
}

/**
 * Depth for a media frame: the image drifts slightly slower than the page.
 *
 * The frame clips, and the child inside it is over-scaled by exactly the
 * travel distance, so the image can move without ever exposing an edge. That
 * over-scale is applied by GSAP rather than by CSS, which is what makes the
 * reduced-motion and no-JavaScript cases correct for free — when the effect
 * never runs, the child is at its natural scale and fills the frame exactly as
 * a plain image would.
 *
 * The frame must have a height of its own (an `aspect-*` class, usually).
 * A collapsed frame gives a scrub with nothing to scrub against.
 *
 * Use it on editorial imagery. Not on anything a person has to read, click or
 * compare against a neighbour: text that drifts is text that is harder to
 * read, and two parallaxing cards side by side stop looking like a grid.
 */
export function Parallax({
  children,
  className,
  speed = 10,
  ...props
}: ParallaxProps) {
  const scope = useGsapEffect<HTMLDivElement>((frame) => {
    const inner = frame.firstElementChild;
    if (!inner) return;

    // A shade more than the travel, so a sub-pixel rounding error at the top
    // or bottom edge cannot show the frame through.
    gsap.set(inner, { scale: 1 + speed / 100 + 0.02 });

    gsap.fromTo(
      inner,
      { yPercent: -speed / 2 },
      {
        yPercent: speed / 2,
        ease: "none",
        scrollTrigger: {
          trigger: frame,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  }, [speed]);

  return (
    <div ref={scope} className={cn("overflow-hidden", className)} {...props}>
      <div className="h-full w-full will-change-transform">{children}</div>
    </div>
  );
}
