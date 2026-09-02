"use client";

import { domAnimation, LazyMotion, MotionConfig } from "framer-motion";

/**
 * One motion context for the whole app.
 *
 * `reducedMotion="user"` is the important part, and it replaces what used to be
 * a `useReducedMotion()` branch inside each primitive. That branch rendered a
 * DIFFERENT TREE on the server than on the client: the server, with no media
 * query to read, always rendered the animated element carrying its `initial`
 * style of `opacity: 0`, while a client that prefers reduced motion rendered a
 * plain tag. React cannot patch up an attribute mismatch like that, so the
 * server's `opacity: 0` stuck with no motion component left to animate it away
 * — every revealed element on the page stayed invisible for exactly the users
 * who had asked for less movement.
 *
 * Handing the decision to Framer instead keeps the tree identical in both
 * renders, so hydration matches. Framer then drops transform and layout
 * animations for those users while still running opacity, which is the
 * behaviour the preference actually asks for: no movement, but content that
 * still appears.
 *
 * `LazyMotion` lives here rather than in each primitive so the DOM animation
 * features are loaded once for the whole tree. `strict` keeps the codebase on
 * the lightweight `m` components — a plain `motion.*` import would throw here,
 * which is the point.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
