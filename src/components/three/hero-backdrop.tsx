"use client";

import * as React from "react";
import dynamic from "next/dynamic";

/**
 * three.js is never in the page's own bundle. It is fetched only after this
 * component has decided the device should have it, which means a phone, a
 * throttled connection or a visitor who prefers reduced motion never pays for
 * a single byte of it.
 */
const EnergyField = dynamic(
  () => import("@/components/three/energy-field").then((m) => m.EnergyField),
  { ssr: false }
);

interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

/** A WebGL context we can actually get, released again immediately. */
function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ??
      (canvas.getContext("webgl") as WebGLRenderingContext | null);
    if (!gl) return false;

    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/**
 * Decides whether this visitor gets the WebGL field, and loads it if so.
 *
 * The decision is the whole point of this file. A hero backdrop is the most
 * skippable thing on the page — nothing here carries information, and the CSS
 * gradient underneath is a complete composition on its own — so it is only
 * ever an addition for devices with headroom to spare:
 *
 * - LARGE VIEWPORTS ONLY. On a phone the field would sit behind a hero that
 *   has already stacked to a single column, where it is barely visible and
 *   competing for the exact frame budget the product image needs.
 * - REDUCED MOTION SKIPS IT ENTIRELY. The scene can render a still frame, but
 *   downloading a 3D library to draw one is not a trade worth making.
 * - FOUR CORES, AND NO DATA SAVER. Crude, but the two signals a browser
 *   actually gives us about a low-powered or metered device.
 * - A REAL WEBGL CONTEXT. Probed rather than assumed, because a blocked or
 *   exhausted context is silent — you get no error, just nothing drawn.
 *
 * The check runs in an effect and after idle, so it is off the critical path
 * and cannot influence hydration. The gate also means the tree is identical on
 * the server and on the first client render: the field appears afterwards, as
 * an enhancement, never as something the layout was waiting for.
 */
export function HeroBackdrop({ className }: { className?: string }) {
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;

    const connection = (navigator as Navigator & { connection?: NetworkInformation })
      .connection;
    if (connection?.saveData) return;
    if ((navigator.hardwareConcurrency ?? 4) < 4) return;

    const run = () => {
      if (hasWebGL()) setEnabled(true);
    };

    const supportsIdle = typeof window.requestIdleCallback === "function";
    const handle: number = supportsIdle
      ? window.requestIdleCallback(run)
      : (setTimeout(run, 400) as unknown as number);

    return () => {
      if (supportsIdle) window.cancelIdleCallback(handle);
      else clearTimeout(handle);
    };
  }, []);

  if (!enabled) return null;

  return <EnergyField className={className} />;
}
