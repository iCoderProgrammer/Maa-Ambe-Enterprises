"use client";

import * as React from "react";
import { m, type Variants } from "framer-motion";

import { cn } from "@/lib/utils";
import { fadeUp, maskUp, staggerContainer, viewportOnce } from "@/lib/motion";

type Element =
  | "div"
  | "section"
  | "article"
  | "li"
  | "ul"
  | "ol"
  | "span"
  | "p"
  | "figure";

/**
 * Scroll-entrance primitives.
 *
 * None of these branch on the user's motion preference, and that is deliberate:
 * rendering a different tree for reduced motion breaks hydration and leaves
 * content stuck at `opacity: 0`. The preference is honoured once, centrally, by
 * `MotionConfig reducedMotion="user"` in `MotionProvider` — see that file for
 * the full account. Keep these components free of `useReducedMotion`.
 *
 * `LazyMotion` also lives in the provider, so the animation features are
 * loaded once for the whole tree rather than per component.
 *
 * Each element carries `data-motion` so the stylesheet can neutralise the
 * server-rendered entrance transform for reduced-motion users. The server has
 * no way to read a media query, so it always emits the `hidden` variant's
 * `translateY`; without that CSS rule the element would sit visibly offset
 * until hydration and then snap into place — a jump, for the users least
 * likely to want one.
 */

interface RevealProps extends React.ComponentProps<"div"> {
  /** Delay in seconds before this element starts animating. */
  delay?: number;
  variants?: Variants;
  as?: Element;
}

/** Scroll-triggered entrance. Animates once. */
export function Reveal({
  children,
  className,
  delay = 0,
  variants = fadeUp,
  as = "div",
  ...props
}: RevealProps) {
  const MotionTag = m[as] as React.ElementType;

  return (
    <MotionTag
      data-motion
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={variants}
      transition={{ delay }}
      {...props}
    >
      {children}
    </MotionTag>
  );
}

interface StaggerProps extends React.ComponentProps<"div"> {
  stagger?: number;
  delayChildren?: number;
  as?: Element;
}

/** Cascades direct `StaggerItem` children as they enter the viewport. */
export function Stagger({
  children,
  className,
  stagger = 0.08,
  delayChildren = 0,
  as = "div",
  ...props
}: StaggerProps) {
  const MotionTag = m[as] as React.ElementType;

  return (
    <MotionTag
      data-motion
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer(stagger, delayChildren)}
      {...props}
    >
      {children}
    </MotionTag>
  );
}

/** A child of `Stagger`. Inherits the parent's orchestration. */
export function StaggerItem({
  children,
  className,
  variants = fadeUp,
  as = "div",
  ...props
}: Omit<RevealProps, "delay">) {
  const MotionTag = m[as] as React.ElementType;

  return (
    <MotionTag data-motion className={cn(className)} variants={variants} {...props}>
      {children}
    </MotionTag>
  );
}

/**
 * One line of a headline, revealed from behind its own crop.
 *
 * A child of `Stagger`, like `StaggerItem` — it *is* a `StaggerItem`, wrapped
 * in the clipping span the effect needs. Split a headline into these by hand,
 * one per visual line, and choose the break points yourself: an automatic
 * split would re-break at every viewport width and reveal half-lines.
 *
 * The wrapper's `pb` is not spacing. `overflow: hidden` on a line box crops
 * descenders, and the padding is what gives the tail of a "y" somewhere to
 * live; the matching negative margin keeps it out of the layout.
 */
export function MaskLine({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
      <StaggerItem as="span" variants={maskUp} className={cn("block", className)}>
        {children}
      </StaggerItem>
    </span>
  );
}
