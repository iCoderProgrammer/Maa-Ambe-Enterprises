import Image from "next/image";

import { cn } from "@/lib/utils";
import type { ShowroomBanner as Banner } from "@/types/showroom";
import { ShowroomStat } from "@/components/product/showroom/showroom-stat";

/**
 * Full-width image statement — the loudest thing a section can say.
 *
 * TWO LAYOUTS, CHOSEN BY THE ARTWORK
 *
 * `overlay` lays the copy over the image, and only works where the subject
 * leaves one side of the frame clear. `split` puts the copy in its own panel
 * beside the image, and is the honest answer for a centred subject — a
 * three-quarter shot of a whole scooter has no empty side, and text dropped
 * over it lands on the vehicle whatever scrim is used.
 *
 * `copyTone` follows the artwork, not the page: these renders sit on white,
 * so a banner cropped into the light part of one needs dark copy and a light
 * scrim, while one cropped into the bodywork needs the reverse. Getting this
 * pair wrong is how overlay text becomes unreadable, so it is stated per
 * banner in the data rather than guessed here.
 *
 * RESPONSIVE
 *
 * Below `sm` an overlay has nowhere to go sideways, so the frame grows taller,
 * the scrim runs bottom-to-top and the copy sits under the subject instead of
 * across it. A split simply stacks. Both keep a fixed aspect frame, so the
 * panel cannot change height as the image loads.
 */
export function ShowroomBannerBlock({ block }: { block: Banner }) {
  const alignEnd = block.align === "end";
  const isLight = block.copyTone !== "dark";

  if (block.layout === "split") {
    return (
      <figure
        className={cn(
          "bg-surface-muted grid overflow-hidden rounded-2xl sm:rounded-3xl lg:grid-cols-2 lg:items-center",
          alignEnd && "lg:[&>figcaption]:order-last"
        )}
      >
        <figcaption className="flex flex-col justify-center p-8 sm:p-12 lg:p-14">
          <h3 className="text-display-md">{block.title}</h3>

          {block.statKey ? (
            <ShowroomStat statKey={block.statKey} size="lg" className="mt-3" />
          ) : null}

          {block.caption ? (
            <p className="text-muted-foreground mt-4 max-w-prose text-pretty">
              {block.caption}
            </p>
          ) : null}
        </figcaption>

        <Image
          src={block.media.src}
          alt={block.media.alt}
          width={block.media.width}
          height={block.media.height}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="aspect-4/3 w-full object-cover lg:aspect-square"
        />
      </figure>
    );
  }

  return (
    <figure className="bg-surface-muted relative isolate overflow-hidden rounded-2xl sm:rounded-3xl">
      <Image
        src={block.media.src}
        alt={block.media.alt}
        width={block.media.width}
        height={block.media.height}
        sizes="(min-width: 1280px) 1200px, 100vw"
        className="aspect-4/5 w-full object-cover sm:aspect-16/10 lg:aspect-16/9"
      />

      {/* Bottom scrim on narrow screens, side scrim once there is room beside
          the subject. Decorative: the copy below carries the meaning. */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0",
          isLight
            ? "bg-linear-to-t from-black/75 via-black/25 to-transparent"
            : "bg-linear-to-t from-white/85 via-white/40 to-transparent",
          alignEnd
            ? isLight
              ? "sm:bg-linear-to-l sm:from-black/70 sm:via-black/20 sm:to-transparent"
              : "sm:bg-linear-to-l sm:from-white/85 sm:via-white/35 sm:to-transparent"
            : isLight
              ? "sm:bg-linear-to-r sm:from-black/70 sm:via-black/20 sm:to-transparent"
              : "sm:bg-linear-to-r sm:from-white/85 sm:via-white/35 sm:to-transparent"
        )}
      />

      <figcaption
        className={cn(
          // Below `sm` the caption spans the full width under the subject.
          // Above it, `inset-x-auto` releases that full-width stretch so the
          // `left`/`right` below can actually place the column — without it a
          // left AND right of 0 wins over the width and the copy stays pinned
          // to the left whichever end it was asked for.
          "absolute inset-x-0 bottom-0 flex flex-col p-6 sm:inset-x-auto sm:inset-y-0 sm:w-[min(24rem,48%)] sm:justify-center sm:p-10 lg:p-14",
          alignEnd ? "sm:right-0 sm:items-end sm:text-right" : "sm:left-0",
          isLight ? "text-white" : "text-ink-950"
        )}
      >
        <h3 className="text-display-md">{block.title}</h3>

        {block.statKey ? (
          <ShowroomStat
            statKey={block.statKey}
            size="lg"
            tone={isLight ? "light" : "dark"}
            className={cn("mt-2", alignEnd && "sm:justify-end")}
          />
        ) : null}

        {block.caption ? (
          <p
            className={cn(
              "mt-4 max-w-prose text-sm leading-relaxed text-pretty sm:text-base",
              isLight ? "text-white/85" : "text-ink-700"
            )}
          >
            {block.caption}
          </p>
        ) : null}
      </figcaption>
    </figure>
  );
}
