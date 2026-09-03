"use client";

import * as React from "react";

import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * `useLayoutEffect` on the client, `useEffect` on the server.
 *
 * GSAP needs to read and write layout before the browser paints — the whole
 * point of a scroll-linked tween is that it is already at the right value on
 * the first frame. `useLayoutEffect` is the hook for that, but React logs a
 * warning when it runs during SSR, where it does nothing useful. This is the
 * standard swap, and it is safe precisely because every effect below is
 * decorative: nothing here changes what the server renders.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

/**
 * Runs a GSAP setup function scoped to an element, and cleans it up properly.
 *
 * The returned ref goes on the element you want as the animation scope. Every
 * selector string used inside `setup` resolves against that element, so a
 * component can say `".stat"` without reaching into another instance of itself
 * elsewhere on the page.
 *
 * `gsap.context().revert()` is what makes this safe under React 19's strict
 * double-invocation and under client-side navigation: it kills the tweens, it
 * kills the ScrollTriggers they created, AND it restores every inline style
 * GSAP wrote. Calling `tween.kill()` by hand does the first two and leaves the
 * element frozen mid-transform, which is how a "the parallax is stuck after I
 * navigate back" bug happens.
 *
 * `setup` may return its own teardown function — for a listener it added, say.
 * `gsap.context` calls it as part of `revert()`, so it is cleaned up on the
 * same path as the tweens and there is no second lifecycle to keep track of.
 *
 * When the visitor prefers reduced motion the setup never runs. That is the
 * correct outcome rather than a degradation, because these effects only ever
 * move content that is already in its final, readable position.
 */
export function useGsapEffect<T extends HTMLElement = HTMLDivElement>(
  setup: (scope: T) => void | (() => void),
  deps: React.DependencyList = []
): React.RefObject<T | null> {
  const scopeRef = React.useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope || prefersReducedMotion()) return;

    const ctx = gsap.context(() => setup(scope), scope);
    return () => ctx.revert();
    // The caller owns the dependency list; `setup` is deliberately not in it,
    // because an inline arrow changes identity every render and would tear the
    // animation down and rebuild it on each one.
  }, deps);

  return scopeRef;
}
