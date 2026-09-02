"use client";

import { cn } from "@/lib/utils";
import { resolveShowroomStat } from "@/lib/showroom";
import type { ShowroomStatKey } from "@/types/showroom";
import { useProduct } from "@/components/product/product-provider";

/**
 * A single figure inside an editorial panel, read from the selected variant.
 *
 * This is the only client component inside an otherwise server-rendered
 * showroom block, and it exists precisely so that the rest of the block does
 * not have to be one. Switching variant re-renders these leaves and nothing
 * else.
 *
 * Renders nothing when the figure is unconfirmed. The surrounding copy is
 * written to stand on its own without it, so a missing number leaves a shorter
 * panel rather than a broken one.
 */
export function ShowroomStat({
  statKey,
  size = "md",
  tone = "dark",
  className,
}: {
  statKey: ShowroomStatKey;
  size?: "sm" | "md" | "lg";
  tone?: "light" | "dark";
  className?: string;
}) {
  const { specs } = useProduct();
  const stat = resolveShowroomStat(statKey, specs);

  if (!stat) return null;

  return (
    <p
      className={cn(
        "font-display flex flex-wrap items-baseline gap-x-2.5 gap-y-1 font-semibold",
        size === "lg" && "text-display-md",
        size === "md" && "text-display-sm",
        size === "sm" && "text-base",
        className
      )}
    >
      <span>{stat.value}</span>
      {stat.unit ? (
        <span
          className={cn(
            "text-sm font-medium tracking-normal",
            tone === "light" ? "text-white/70" : "text-muted-foreground"
          )}
        >
          {stat.unit}
        </span>
      ) : null}
    </p>
  );
}
