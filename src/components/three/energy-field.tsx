"use client";

import * as React from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  DynamicDrawUsage,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from "three";

/** Radial and angular resolution of the field. 56 × 96 ≈ 5,400 points. */
const RINGS = 56;
const SPOKES = 96;
const INNER_RADIUS = 0.55;
const OUTER_RADIUS = 4.6;

/** `--color-brand-500`, converted once. */
const BRAND = new Color(0.153, 0.804, 0.463);

/**
 * The energy field behind the hero.
 *
 * WHAT IT IS. A polar grid of points with a slow wave travelling outwards
 * through it — the charge spreading from under the scooter. It is the one
 * WebGL surface on the site, and it earns its place by doing something no
 * image or CSS gradient can: reacting continuously, in depth, without ever
 * being the thing you look at. Everything about it is tuned to sit *behind*
 * the product, so it is dim, slow, and dissolves before it reaches the copy.
 *
 * WHAT IT COSTS, AND WHY THAT IS ACCEPTABLE. One geometry, one material, one
 * draw call, no textures, no models, no lights, no post-processing. The
 * per-frame work is a `sin` over ~5,400 floats and a buffer upload. The
 * three.js import is the real cost, which is why nothing here is on the
 * critical path: the module is only ever reached through the `next/dynamic`
 * boundary in `hero-backdrop.tsx`, and that boundary only mounts it on a
 * device that has passed the capability checks there.
 *
 * WHEN IT STOPS. Scrolled out of view, or the tab hidden: the loop is torn
 * down, not merely skipped, so an idle tab does no work at all. It restarts
 * where it left off. `prefers-reduced-motion` renders exactly one frame and
 * never starts the loop — the visitor gets the composition without the
 * movement, which is what the preference asks for.
 *
 * TEARDOWN. Geometry, material, renderer and the WebGL context itself are all
 * released. `forceContextLoss` is the part people leave out: without it the
 * browser holds the drawing buffer until GC, and a few client-side navigations
 * through the homepage is enough to hit the per-page context limit and start
 * killing older canvases.
 */
export function EnergyField({ className }: { className?: string }) {
  const hostRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
    } catch {
      return; // No context available — the CSS backdrop underneath stands in.
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearAlpha(0);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    host.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(48, 1, 0.1, 60);
    camera.position.set(0, 1.85, 6.4);
    camera.lookAt(0, 0, 0);

    /* --- Geometry ------------------------------------------------------- */

    const count = RINGS * SPOKES;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    /** Radius per point, cached so the wave does not recompute it per frame. */
    const radii = new Float32Array(count);

    for (let ring = 0; ring < RINGS; ring += 1) {
      // Squared distribution: dense near the centre where the subject sits,
      // sparse at the rim where it should already be dissolving.
      const t = ring / (RINGS - 1);
      const radius = INNER_RADIUS + (OUTER_RADIUS - INNER_RADIUS) * t * t;

      for (let spoke = 0; spoke < SPOKES; spoke += 1) {
        const index = ring * SPOKES + spoke;
        const angle = (spoke / SPOKES) * Math.PI * 2;

        positions[index * 3] = Math.cos(angle) * radius;
        positions[index * 3 + 1] = 0;
        positions[index * 3 + 2] = Math.sin(angle) * radius;
        radii[index] = radius;

        // Brightest just outside the centre, gone by the rim. Additive
        // blending over a dark backdrop turns a dark colour into no point at
        // all, which is a cheaper fade than per-point alpha.
        const falloff = Math.max(0, 1 - t * t * 1.15) * (0.25 + 0.75 * t);
        colors[index * 3] = BRAND.r * falloff;
        colors[index * 3 + 1] = BRAND.g * falloff;
        colors[index * 3 + 2] = BRAND.b * falloff;
      }
    }

    const geometry = new BufferGeometry();
    const positionAttribute = new BufferAttribute(positions, 3);
    positionAttribute.setUsage(DynamicDrawUsage);
    geometry.setAttribute("position", positionAttribute);
    geometry.setAttribute("color", new BufferAttribute(colors, 3));

    const material = new PointsMaterial({
      size: 0.022,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: AdditiveBlending,
    });

    const field = new Points(geometry, material);
    field.rotation.x = 0.04;
    scene.add(field);

    /* --- Sizing ---------------------------------------------------------- */

    const resize = () => {
      const { clientWidth, clientHeight } = host;
      if (clientWidth === 0 || clientHeight === 0) return;

      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    /* --- The wave -------------------------------------------------------- */

    const draw = (elapsed: number) => {
      for (let index = 0; index < count; index += 1) {
        const radius = radii[index];
        const fade = Math.max(0, 1 - radius / OUTER_RADIUS);
        positions[index * 3 + 1] =
          Math.sin(radius * 1.9 - elapsed * 0.85) * 0.34 * fade;
      }

      positionAttribute.needsUpdate = true;
      // A quarter-turn per minute: present in peripheral vision, invisible if
      // you look straight at it.
      field.rotation.y = elapsed * 0.026;
      renderer.render(scene, camera);
    };

    /* --- Loop, and the two things that stop it --------------------------- */

    let frame = 0;
    let start = 0;
    let elapsed = 0;
    let visible = false;

    const loop = (now: number) => {
      if (start === 0) start = now;
      elapsed += (now - start) / 1000;
      start = now;
      draw(elapsed);
      frame = requestAnimationFrame(loop);
    };

    const play = () => {
      if (frame || reduced) return;
      start = 0;
      frame = requestAnimationFrame(loop);
    };

    const pause = () => {
      if (!frame) return;
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const sync = () => {
      if (visible && !document.hidden) play();
      else pause();
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(host);

    document.addEventListener("visibilitychange", sync);

    // One frame regardless, so the field is composed and correct before the
    // loop ever runs — and is the whole of the effect under reduced motion.
    draw(0);

    return () => {
      pause();
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);

      scene.remove(field);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} aria-hidden className={className} />;
}

export default EnergyField;
