"use client";

import Image from "next/image";

import { gsap } from "@/lib/gsap";
import { useGsapEffect } from "@/hooks/use-gsap";

/** How far the vehicle leans, in degrees, at the corners of the frame. */
const TILT = 4.5;
/** How far it slides with the pointer, in pixels. */
const DRIFT = 14;

/**
 * The vehicle in the hero: a cut-out render that answers to the pointer and
 * drifts as the page scrolls away from it.
 *
 * The only client component in the hero. Everything around it — the headline,
 * the copy, the calls to action, the trust row — is server-rendered, because
 * none of it needs to know where the cursor is.
 *
 * WHY `quickTo` AND NOT A TWEEN PER EVENT. A pointer move fires up to once a
 * frame; creating a tween each time queues dozens of overlapping animations
 * that fight over the same transform. `quickTo` reuses one interpolator per
 * property and simply retargets it, so the vehicle eases towards wherever the
 * cursor last was at a fixed cost, and the movement keeps its weight instead
 * of snapping.
 *
 * The listener is on `window` rather than the image, so the vehicle responds
 * to the whole hero rather than only to a cursor that has landed on it — and
 * it is passive, so it can never delay a scroll.
 *
 * A COARSE POINTER GETS NONE OF THIS. There is no cursor to follow on a phone,
 * and `pointermove` there only fires mid-drag, which would make the vehicle
 * lurch while someone is trying to scroll past it. The scroll drift still
 * runs everywhere: it is the part that gives the hero depth as you leave it.
 */
export function HeroVehicle({ src, alt }: { src: string; alt: string }) {
  const scope = useGsapEffect<HTMLDivElement>((frame) => {
    const vehicle = frame.querySelector<HTMLElement>("[data-vehicle]");
    const glow = frame.querySelector<HTMLElement>("[data-glow]");
    if (!vehicle) return;

    /* --- Scroll: the vehicle sinks and softens as the hero leaves --------- */

    gsap.to(vehicle, {
      yPercent: 9,
      scale: 0.94,
      ease: "none",
      scrollTrigger: {
        trigger: frame,
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
      },
    });

    if (glow) {
      gsap.to(glow, {
        opacity: 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: frame,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }

    /* --- Pointer: a lean towards the cursor ------------------------------ */

    if (!window.matchMedia("(pointer: fine)").matches) return;

    const toX = gsap.quickTo(vehicle, "x", { duration: 0.9, ease: "power3.out" });
    const toY = gsap.quickTo(vehicle, "y", { duration: 0.9, ease: "power3.out" });
    const toRotY = gsap.quickTo(vehicle, "rotationY", {
      duration: 1.1,
      ease: "power3.out",
    });
    const toRotX = gsap.quickTo(vehicle, "rotationX", {
      duration: 1.1,
      ease: "power3.out",
    });

    const onPointerMove = (event: PointerEvent) => {
      // -1 … 1 from the centre of the viewport.
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;

      toX(x * DRIFT);
      toY(y * DRIFT * 0.5);
      toRotY(x * TILT);
      toRotX(-y * TILT * 0.5);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  return (
    <div ref={scope} className="relative [perspective:1400px]">
      {/* The pool of light the vehicle stands in. Sized and blurred to read as
          a light source rather than a drop shadow, which is what stops a
          cut-out from looking pasted onto the panel. */}
      <div
        aria-hidden
        data-glow
        className="bg-brand-500/22 absolute inset-x-[8%] bottom-[12%] -z-10 h-[38%] rounded-[50%] blur-[64px]"
      />

      <Image
        data-vehicle
        src={src}
        alt={alt}
        width={1366}
        height={768}
        priority
        fetchPriority="high"
        sizes="(min-width: 1280px) 42rem, (min-width: 1024px) 46vw, 92vw"
        className="w-full [transform-style:preserve-3d] drop-shadow-[0_36px_60px_rgba(0,0,0,0.55)]"
      />
    </div>
  );
}
