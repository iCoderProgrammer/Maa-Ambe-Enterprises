"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/** Extra breathing room above an anchor target that declares no scroll margin. */
const ANCHOR_GUTTER = 20;

/**
 * When to re-check that a deep-linked section is still where it should be,
 * in milliseconds from mount. Spread across the first second because that is
 * how long hydration, font swap and image decode take to stop moving the page.
 */
const HASH_SETTLE_MS = [0, 60, 150, 320, 600, 1000];

/**
 * Site-wide smooth scrolling.
 *
 * Lenis does not replace the scroll container or transform the page — it damps
 * the wheel delta and drives the real `window.scrollY`. That matters here more
 * than the feel does: sticky headers, `position: sticky` section navigation,
 * the browser's own scroll restoration and `scrollIntoView` all keep working,
 * which none of them do under a transform-the-body smooth-scroll library.
 *
 * FIVE THINGS THAT BREAK IF THEY ARE NOT HANDLED, AND ARE HANDLED BELOW.
 *
 * 1. TWO SCROLL ANIMATORS. CSS `scroll-behavior: smooth` and Lenis both want
 *    to animate the same property and produce a stutter when they overlap.
 *    Mounting stamps `data-lenis-active` on `<html>`, and the stylesheet turns
 *    the CSS one off under that attribute — so native smooth scrolling stays
 *    the behaviour whenever Lenis is *not* running.
 *
 * 2. TWO RAF LOOPS. ScrollTrigger reads scroll position on its own ticker; if
 *    Lenis runs on a second `requestAnimationFrame` the two are a frame apart
 *    and every scrub visibly lags. Lenis is driven by `gsap.ticker` and
 *    reports into `ScrollTrigger.update`, so there is exactly one loop and one
 *    source of truth. `lagSmoothing(0)` stops GSAP from silently skipping the
 *    catch-up frame after a long task, which under Lenis reads as a jump.
 *
 * 3. MODALS. Radix locks the body when a dialog or the mobile drawer opens.
 *    Lenis listens on the window and would go on consuming wheel events behind
 *    the overlay. The observer below stops it for exactly as long as the lock
 *    is in place. Scrollable regions inside an overlay carry
 *    `data-lenis-prevent`, which Lenis honours natively.
 *
 * 4. ANCHORS. Lenis owns the scroll, so a native hash jump fights it. Every
 *    link that resolves to a hash on the CURRENT page — `#section` and
 *    `/#section` alike — is intercepted and scrolled by Lenis to an absolute
 *    document offset computed from the browser, never from Lenis's own idea of
 *    where the page is. Modified clicks, links to another page and anything
 *    marked `data-lenis-ignore` are left entirely alone. Lenis's own `anchors`
 *    option is deliberately not used: it does not call `preventDefault`, so the
 *    browser performs its instant jump alongside the animation.
 *
 * 5. LATE LAYOUT. Images and fonts land after the first ScrollTrigger
 *    measurement and every trigger point computed before them is wrong. A
 *    refresh runs on route change and once the page has fully loaded.
 *
 * Two further problems get their own effects below, because both are about
 * WHERE the page is rather than how it moves: landing on a deep-linked
 * section, and arriving on a new route with the previous page's scroll still
 * in flight. Each carries its own account of what went wrong. The deep-link
 * one is not a smooth-scrolling problem at all and runs even when Lenis does
 * not exist.
 *
 * REDUCED MOTION. The instance is never created. Damping the scroll is
 * precisely the kind of movement the preference asks to be spared, and the
 * native scroll it falls back to is the correct behaviour, not a degraded one.
 *
 * TOUCH. `syncTouch` is deliberately off. A phone's own scroll is
 * hardware-accelerated, matches every other app on the device, and keeps
 * momentum and rubber-banding that a JS re-implementation only approximates.
 * Lenis here shapes the wheel and keyboard, and gets out of the way of a
 * finger.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = React.useRef<Lenis | null>(null);
  const resyncRef = React.useRef<(() => void) | null>(null);
  const pathname = usePathname();

  React.useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      // ~0.09 reads as "weighted", not "floaty". Higher and the page feels
      // detached from the wheel; lower and there is no point running this.
      lerp: 0.09,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
      autoRaf: false,
      // Kills the inertia the moment a link to another page is clicked, before
      // React has even begun the transition. Without it the tween from the
      // click's own scroll momentum is still running when the next page
      // mounts, and it carries the old page's scroll position onto it.
      stopInertiaOnNavigate: true,
    });

    lenisRef.current = lenis;
    document.documentElement.dataset.lenisActive = "true";

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    /* --- 3. Pause while an overlay owns the viewport --------------------- */

    const syncLock = () => {
      const locked =
        document.body.hasAttribute("data-scroll-locked") ||
        getComputedStyle(document.body).overflow === "hidden";

      if (locked) lenis.stop();
      else lenis.start();
    };

    const lockObserver = new MutationObserver(syncLock);
    lockObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-scroll-locked", "style", "class"],
    });
    syncLock();

    /*
     * Published for the navigation effect below, which needs to reset Lenis
     * but must not decide on its own whether Lenis should be running — only
     * the lock state above knows that.
     *
     * `stop()` is the reset. Internally it kills the in-flight tween, zeroes
     * the velocity and re-reads the real scroll position; `start()` does the
     * same on the way back. Crucially neither writes to the window, so this
     * cannot move the page — see the note on the navigation effect for why
     * that property is the whole point.
     */
    resyncRef.current = () => {
      lenis.stop();
      syncLock();
    };

    /* --- 4. In-page anchors ---------------------------------------------- */

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest?.("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("data-lenis-ignore")) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      /*
       * WHICH LINKS COUNT AS IN-PAGE.
       *
       * Not only the bare `#section` form. The navigation carries absolute
       * links like `/#why-lectrix`, and when the visitor is already on `/`
       * that is an in-page jump too — it just does not look like one. Left to
       * the router it was the worst case of all: the hash scroll and Lenis's
       * own state disagreed and the page settled two thousand pixels past the
       * section. Resolving the href against the document and comparing
       * pathnames catches both spellings of the same intent.
       *
       * A link to a hash on a DIFFERENT page is deliberately not handled here.
       * That is a real navigation; the router performs it and the pathname
       * effect below resyncs Lenis once the new page has laid out.
       */
      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname !== window.location.pathname) return;
      // Same path but different query is a real navigation, not a jump within
      // this page — `/compare?models=a,b` from `/compare` has to reach the
      // router.
      if (url.search !== window.location.search) return;
      if (!url.hash || url.hash === "#") return;

      let target: HTMLElement | null = null;
      try {
        target = document.querySelector<HTMLElement>(url.hash);
      } catch {
        return; // Not a valid selector — let the browser deal with it.
      }
      if (!target) return;

      /*
       * `stopPropagation` as well as `preventDefault`, and this listener runs
       * in the CAPTURE phase (see the registration below) so that both land
       * before anything else sees the click. Next's `<Link>` binds its own
       * handler to the anchor itself and prevents the default there; a bubble-
       * phase listener on the document arrives after that has already happened
       * and can only watch the router scroll to the wrong place. Capturing
       * first, and stopping the event, means an in-page jump is handled here
       * and nowhere else.
       */
      event.preventDefault();
      event.stopPropagation();

      /*
       * AN ABSOLUTE OFFSET, NOT THE ELEMENT.
       *
       * Handing `scrollTo` the element looks tidier and is subtly wrong.
       * Lenis resolves an element to `rect.top + animatedScroll` — its OWN
       * idea of the scroll position, not the browser's. The two drift apart
       * whenever something outside Lenis scrolls the page: focus moving to an
       * off-screen control, `scrollIntoView`, the browser restoring a
       * position. Lenis re-syncs from a native scroll only while it is idle,
       * so a scroll that lands mid-animation is ignored and the drift
       * persists. Every pixel of that drift is then subtracted from the
       * anchor's target, and the section stops short — measured at 531px shy
       * on the model page, which reads as "the section links do not go to the
       * right place".
       *
       * `getBoundingClientRect().top + window.scrollY` is the document
       * position, from the browser, with no internal state in the arithmetic.
       * A numeric target is used exactly as given.
       *
       * The clearance is the target's own `scroll-margin-top` where it
       * declares one — the same distance a native jump would use — and the
       * live header height where it does not, so a section that forgot its
       * `scroll-mt` still lands below the sticky chrome instead of behind it.
       */
      const declared = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      const header = document.querySelector("header");
      const clearance =
        declared > 0
          ? declared
          : (header?.getBoundingClientRect().height ?? 0) + ANCHOR_GUTTER;

      const top = target.getBoundingClientRect().top + window.scrollY - clearance;

      lenis.scrollTo(Math.max(0, top), { force: true });

      // Keeps the address bar and the back button honest without letting the
      // browser perform its own jump to the fragment.
      window.history.pushState(null, "", url.hash);
    };

    document.addEventListener("click", onClick, { capture: true });

    /* --- 5. Re-measure once late layout has settled ----------------------- */

    const refresh = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };

    if (document.readyState === "complete") refresh();
    else window.addEventListener("load", refresh, { once: true });

    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("load", refresh);
      lockObserver.disconnect();
      resyncRef.current = null;
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenisRef.current = null;
      delete document.documentElement.dataset.lenisActive;
    };
  }, []);

  /*
   * DEEP LINKS. Landing directly on `/electric-scooters/nduro#smart-features`
   * put the reader at the top of the page roughly one load in three, with the
   * section they asked for thousands of pixels below them.
   *
   * This one is NOT the smooth-scrolling layer. Measured with Lenis and GSAP
   * both disabled — under `prefers-reduced-motion`, where neither is ever
   * constructed — the same three URLs fail at the same rate. It is the
   * router's initial fragment handling racing hydration: the browser's jump
   * happens against the pre-hydration document, and the position does not
   * always survive. Which is why this effect is deliberately outside the Lenis
   * one and never returns early for reduced motion: the correction is needed
   * whether or not smooth scrolling exists.
   *
   * It positions the section itself rather than deferring to the browser,
   * because the browser's own jump ignores `scroll-margin-top` when it fires
   * before the styles that carry it — `#team` used to land flush under the
   * header for exactly that reason.
   *
   * It re-checks on a short schedule rather than once. A single correction
   * after layout is not enough: hydration can reset the scroll AFTER it, and
   * the page goes on growing as images decode, so the right offset is a moving
   * target for the first second or so. Each pass does nothing when the
   * position is already right, so the common case costs two reads and stops.
   *
   * Every pass is abandoned the moment the visitor scrolls, touches or types.
   * That is what stops a late correction from yanking the page out from under
   * someone who has already started reading — the window is short, but it is
   * long enough to matter if they were quick.
   */
  React.useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash === "#") return;

    let interacted = false;
    const noteInteraction = () => {
      interacted = true;
    };

    const land = () => {
      if (interacted) return;

      let target: HTMLElement | null = null;
      try {
        target = document.querySelector<HTMLElement>(hash);
      } catch {
        return;
      }
      if (!target) return;

      const declared = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      const header = document.querySelector("header");
      const clearance =
        declared > 0
          ? declared
          : (header?.getBoundingClientRect().height ?? 0) + ANCHOR_GUTTER;

      const top = Math.max(
        0,
        target.getBoundingClientRect().top + window.scrollY - clearance
      );

      if (Math.abs(window.scrollY - top) < 2) return;

      window.scrollTo({ top, behavior: "instant" });
      // Lenis is idle this early, so its own native-scroll listener would pick
      // this up anyway; re-measuring is belt and braces, and costs one read.
      lenisRef.current?.resize();
    };

    for (const type of ["wheel", "touchstart", "keydown", "pointerdown"]) {
      window.addEventListener(type, noteInteraction, { passive: true, once: true });
    }

    const timers = HASH_SETTLE_MS.map((delay) => window.setTimeout(land, delay));
    window.addEventListener("load", land);

    return () => {
      for (const timer of timers) window.clearTimeout(timer);
      window.removeEventListener("load", land);
      for (const type of ["wheel", "touchstart", "keydown", "pointerdown"]) {
        window.removeEventListener(type, noteInteraction);
      }
    };
  }, []);

  /*
   * NAVIGATION. The bug this exists to prevent: scroll a long page, click
   * through to a shorter one, and the new page opens scrolled to its very
   * bottom with the wheel doing nothing at all.
   *
   * Why it happened. A wheel gesture leaves Lenis running an interpolation
   * towards a target — 5,600px down the homepage, say — and while that tween
   * is live `isScrolling` is `"smooth"`. Lenis ignores external scroll changes
   * in that state by design (it is how it avoids reacting to its own writes),
   * so the router's scroll-to-top on the new route was discarded, and on the
   * very next frame the tween wrote 5,600 back. The browser clamped that to
   * the short page's maximum, which is why it landed pinned to the bottom.
   * The wheel then appeared dead: Lenis still believed its target was 5,600,
   * far beyond the new page's limit, so scrolling down asked for nothing.
   *
   * `resize()` alone does not fix it, which is what made this puzzling: it
   * does sync the position, but it leaves the tween running, and the tween
   * overwrites the correction on the very next frame. The animation itself has
   * to be stopped.
   *
   * Order matters, and it is two steps:
   *
   *   NOW, synchronously — reset Lenis. The tween dies, the velocity zeroes
   *   and its internal position is re-read from the browser. From here Lenis
   *   is quiescent and `isScrolling` is false, so whatever scroll position the
   *   router sets afterwards is accepted through Lenis's own native-scroll
   *   listener instead of being discarded.
   *
   *   NEXT FRAME — re-measure. The new page's height is not known until it has
   *   laid out, and both Lenis's scroll limit and every ScrollTrigger start /
   *   end point are computed from it.
   *
   * WHAT THIS MUST NOT DO, AND WHY IT IS NOT AN `IMMEDIATE` `scrollTo`.
   *
   * The obvious spelling of "reset Lenis" is `scrollTo(window.scrollY,
   * { immediate: true })`, and it is wrong here in a way that only shows up
   * about one load in three. That call WRITES to the window and then sets
   * Lenis's `preventNextNativeScrollEvent` flag. On a deep link — landing
   * directly on `/electric-scooters/nduro#smart-features` — this effect can
   * run before the browser has performed its fragment jump: it pins the page
   * at zero, and the flag then swallows the jump when it arrives, so the page
   * sits at the top and the section is never reached.
   *
   * `stop()`/`start()` do the same reset without touching the window and
   * without arming that flag, so the browser and the router keep sole
   * ownership of WHERE the page is — top for a new navigation, the restored
   * offset for back and forward, the fragment for a deep link — and Lenis is
   * only told to stop arguing about it. It goes through `resyncRef` rather
   * than calling `start()` directly so that an overlay holding the scroll lock
   * keeps Lenis stopped.
   */
  React.useEffect(() => {
    const resync = resyncRef.current;
    const lenis = lenisRef.current;
    if (!resync || !lenis) return;

    resync();

    const frame = requestAnimationFrame(() => {
      lenis.resize();
      ScrollTrigger.refresh();
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return <>{children}</>;
}
