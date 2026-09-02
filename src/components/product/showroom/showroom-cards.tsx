import Image from "next/image";

import { cn } from "@/lib/utils";
import type { ShowroomCards as Cards } from "@/types/showroom";
import { ShowroomStat } from "@/components/product/showroom/showroom-stat";

const ratios = {
  landscape: "aspect-4/3",
  portrait: "aspect-3/4",
  square: "aspect-square",
} as const;

const columns = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
} as const;

/**
 * Editorial feature grid: artwork, title, description.
 *
 * Deliberately not a card component. There is no border, no shadow and no
 * panel behind the text — the image is the card, and the copy sits under it on
 * the page's own background. That is what separates an automotive feature
 * grid from a SaaS pricing table, and it is why the frames carry a fixed
 * aspect ratio: mixed image heights are what makes a grid look assembled
 * rather than designed.
 *
 * `fullBleed` artwork already carries its own coloured background, so it fills
 * the frame edge to edge. A cut-out product shot gets a muted surface behind
 * it and breathing room around it instead of being cropped into the corners.
 */
export function ShowroomCardsBlock({ block }: { block: Cards }) {
  const ratio = ratios[block.ratio ?? "landscape"];

  return (
    <ul className={cn("grid list-none gap-x-8 gap-y-12", columns[block.columns])}>
      {block.items.map((item) => (
        <li key={item.id} className="min-w-0">
          <div
            className={cn(
              "bg-surface-muted overflow-hidden rounded-2xl",
              ratio,
              !item.media.fullBleed && "p-4 sm:p-6"
            )}
          >
            <Image
              src={item.media.src}
              alt={item.media.alt}
              width={item.media.width}
              height={item.media.height}
              sizes={
                block.columns === 2
                  ? "(min-width: 640px) 46vw, 92vw"
                  : "(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
              }
              className={cn(
                "h-full w-full",
                item.media.fullBleed ? "object-cover" : "object-contain"
              )}
            />
          </div>

          <h3 className="font-display mt-6 text-lg font-semibold">{item.title}</h3>

          {item.statKey ? (
            <ShowroomStat statKey={item.statKey} size="sm" className="mt-2" />
          ) : null}

          <p className="text-muted-foreground mt-2.5 text-sm leading-relaxed text-pretty">
            {item.description}
          </p>
        </li>
      ))}
    </ul>
  );
}
