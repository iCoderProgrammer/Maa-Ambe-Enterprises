import type { Transition, Variants } from "framer-motion";

/**
 * Shared motion language. Every animated component pulls its easing, duration
 * and variants from here so the whole site moves with one personality —
 * restrained, weighted, never bouncy.
 */

/** Matches --ease-out-brand in globals.css. */
export const easeOutBrand: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const easeInOutBrand: [number, number, number, number] = [0.65, 0, 0.35, 1];

export const duration = {
  fast: 0.2,
  base: 0.4,
  slow: 0.6,
  slower: 0.9,
} as const;

export const transitions = {
  base: { duration: duration.base, ease: easeOutBrand },
  slow: { duration: duration.slow, ease: easeOutBrand },
  slower: { duration: duration.slower, ease: easeOutBrand },
} satisfies Record<string, Transition>;

/** Rise-and-fade. The default entrance for text and cards. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: transitions.slow },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitions.slow },
};

/**
 * Type reveal: a line rises out from behind its own clipping wrapper.
 *
 * Only meaningful inside an `overflow-hidden` parent that is exactly one line
 * tall — `MaskLine` in `components/common/motion.tsx` supplies both. The 108%
 * offset carries descenders clear of the mask before the line starts moving,
 * so a "g" or a "y" is never seen poking below the crop.
 */
export const maskUp: Variants = {
  hidden: { opacity: 0, y: "108%" },
  visible: { opacity: 1, y: "0%", transition: transitions.slower },
};

/** Hero media: settles in with a slight scale-down, never a zoom-bomb. */
export const mediaReveal: Variants = {
  hidden: { opacity: 0, scale: 1.04 },
  visible: { opacity: 1, scale: 1, transition: transitions.slower },
};

/** Parent wrapper that cascades its children. Pair with `fadeUp` on each child. */
export function staggerContainer(stagger = 0.08, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  };
}

/** Standard viewport config: animate once, trigger slightly before fully visible. */
export const viewportOnce = { once: true, amount: 0.25 } as const;
