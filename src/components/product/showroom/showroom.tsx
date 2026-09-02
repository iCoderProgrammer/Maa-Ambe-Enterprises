import { cn } from "@/lib/utils";
import { Container } from "@/components/common/container";
import { SectionHeading } from "@/components/common/section-heading";
import { Reveal } from "@/components/common/motion";
import type { ProductShowroom, ShowroomBlock } from "@/types/showroom";
import { ShowroomNav, type ShowroomNavItem } from "@/components/product/showroom/showroom-nav";
import { ShowroomBannerBlock } from "@/components/product/showroom/showroom-banner";
import { ShowroomCardsBlock } from "@/components/product/showroom/showroom-cards";
import { ShowroomColorsBlock } from "@/components/product/showroom/showroom-colors";
import { ShowroomSmartFeaturesBlock } from "@/components/product/showroom/showroom-smart-features";
import { ShowroomStatCardsBlock } from "@/components/product/showroom/showroom-stat-cards";

/**
 * The guided walk-through of a model.
 *
 * Entirely data-driven: it renders whatever sections and blocks the model's
 * showroom file declares, in the order it declares them, and knows nothing
 * about NDuro. Giving LXS 3.0 the same experience is a data file, not a change
 * here.
 *
 * Server-rendered apart from three leaves that genuinely need state — the
 * sticky navigation, the colour picker and the app-feature tabs — plus the
 * `ShowroomStat` leaves that read the selected variant. Everything else, which
 * is most of the markup and all of the imagery, ships no JavaScript.
 *
 * Sections alternate tone so the eye has a boundary between them without a
 * rule being drawn, and each carries `scroll-mt` clearing the header and the
 * sticky bar, so an anchor jump lands on the heading rather than behind it.
 */

function renderBlock(block: ShowroomBlock) {
  switch (block.kind) {
    case "banner":
      return <ShowroomBannerBlock block={block} />;
    case "cards":
      return <ShowroomCardsBlock block={block} />;
    case "colors":
      return <ShowroomColorsBlock />;
    case "smart-features":
      return <ShowroomSmartFeaturesBlock block={block} />;
    case "stat-cards":
      return <ShowroomStatCardsBlock block={block} />;
  }
}

export function Showroom({ showroom }: { showroom: ProductShowroom }) {
  const navItems: ShowroomNavItem[] = showroom.sections.map((section) => ({
    id: section.id,
    label: section.navLabel,
  }));

  return (
    /*
      The wrapper is what bounds the sticky navigation. A sticky element stays
      stuck for as long as its containing block is on screen, so without this
      the bar would follow the reader past the last section and go on offering
      "Utility / Performance / ..." over the FAQ and the closing CTA — a
      navigation for content that has ended. Bounded here, it releases exactly
      when the walk-through does. The wrapper sets no `overflow`, because any
      overflow on an ancestor silently disables stickiness altogether.
    */
    <div>
      <ShowroomNav items={navItems} />

      {showroom.sections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          aria-label={section.title}
          className={cn(
            "section-y scroll-mt-32 lg:scroll-mt-40",
            index % 2 === 1 ? "bg-surface-muted" : "bg-background"
          )}
        >
          <Container>
            <SectionHeading
              eyebrow={section.eyebrow}
              title={section.title}
              description={section.description}
            />

            <div className="mt-12 flex flex-col gap-14 sm:gap-16">
              {section.blocks.map((block) => (
                <Reveal key={block.id}>{renderBlock(block)}</Reveal>
              ))}
            </div>

            {section.disclaimer ? (
              <p className="text-muted-foreground mt-12 max-w-3xl text-xs leading-relaxed text-pretty italic">
                {section.disclaimer}
              </p>
            ) : null}
          </Container>
        </section>
      ))}
    </div>
  );
}
