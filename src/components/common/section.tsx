import * as React from "react";

import { cn } from "@/lib/utils";
import { Container } from "@/components/common/container";

type SectionTone = "default" | "muted" | "inverse";

const tones: Record<SectionTone, string> = {
  default: "bg-background text-foreground",
  muted: "bg-surface-muted text-foreground",
  inverse: "bg-surface-inverse text-on-inverse",
};

interface SectionProps extends React.ComponentProps<"section"> {
  tone?: SectionTone;
  /** Tighter vertical rhythm for supporting sections. */
  compact?: boolean;
  /** Render the inner container, or lay out children edge-to-edge. */
  bleed?: boolean;
  containerWidth?: React.ComponentProps<typeof Container>["width"];
}

/**
 * Page section wrapper. Owns vertical rhythm and background tone so individual
 * sections never invent their own padding scale.
 */
export function Section({
  className,
  children,
  tone = "default",
  compact = false,
  bleed = false,
  containerWidth,
  ...props
}: SectionProps) {
  const isInverse = tone === "inverse";

  return (
    <section
      className={cn(
        compact ? "section-y-sm" : "section-y",
        tones[tone],
        // An ink section is a moment, not a background — the hero, the
        // technology section, the closing call to action. The glow gives all
        // of them the same lighting as the hero panel so they read as one
        // recurring surface rather than three separate black boxes. `isolate`
        // keeps the negative-z layer above the section's own background and
        // out of the page's stacking context.
        isInverse && "relative isolate overflow-hidden",
        className
      )}
      {...props}
    >
      {isInverse ? (
        <div aria-hidden className="inverse-glow absolute inset-0 -z-10" />
      ) : null}
      {bleed ? children : <Container width={containerWidth}>{children}</Container>}
    </section>
  );
}
