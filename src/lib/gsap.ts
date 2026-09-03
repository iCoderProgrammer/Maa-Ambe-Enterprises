import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * The single place GSAP is configured.
 *
 * WHY GSAP *AND* FRAMER MOTION — the split is deliberate, not accidental.
 *
 * Framer owns ENTRANCE reveals (`components/common/motion.tsx`). It renders the
 * hidden state on the server and clears it on hydration, and `MotionConfig
 * reducedMotion="user"` already resolves the preference centrally. That is a
 * solved problem here and re-solving it in GSAP would mean re-introducing the
 * flash-of-offset-content bug that file documents at length.
 *
 * GSAP owns SCROLL-LINKED and POINTER-LINKED motion — parallax, scroll
 * progress, the hero's mouse tilt. None of those have a "hidden until
 * triggered" state, so there is nothing to render on the server and nothing to
 * get stuck at `opacity: 0` if JavaScript never arrives. Every GSAP tween in
 * this codebase moves an element that is already fully visible and readable.
 *
 * Keep that boundary. A GSAP entrance animation would need its own SSR story;
 * a Framer scroll-scrub would need its own ticker. Neither is worth it.
 *
 * `registerPlugin` is idempotent but the guard keeps it off the module graph's
 * hot path on re-imports, and the `typeof window` check keeps ScrollTrigger —
 * which touches `document` at registration — out of the server bundle.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Mirrors `--ease-out-brand` in globals.css, so CSS and JS move alike. */
export const EASE_OUT_BRAND = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * True when the visitor has asked for less movement.
 *
 * Every GSAP effect in this codebase is decorative by construction, so the
 * honest response to this being true is to not create the tween at all. Read
 * it inside the effect rather than during render: on the server it would
 * always be `false`, and branching the tree on it is the hydration mismatch
 * `motion-provider.tsx` exists to avoid.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger };
