/**
 * Product showroom — the editorial layer of a model page.
 *
 * A showroom is the guided, image-led walk through one model: utility,
 * performance, design, colours, smart features, convenience. It is content,
 * not specification. Three rules keep it that way:
 *
 * 1. **No numbers live here.** A block that wants to show a figure names the
 *    specification it wants via `statKey`; the value is read at render time
 *    from the SELECTED VARIANT's resolved specs. That is what stops a boot
 *    space or a 0–40 time being typed into copy, going stale, and disagreeing
 *    with the spec sheet further down the same page.
 *
 * 2. **Every model is optional.** A model with no showroom entry renders the
 *    standard model page exactly as before. Adding the experience to LXS 3.0,
 *    LXS 2.0, ZYRO or SX25 means adding a data file — no component changes.
 *
 * 3. **Data stays serialisable.** Icons are named by id, never imported here,
 *    so a section can cross the server/client boundary without ceremony.
 */

/** A figure a showroom block may quote. Resolved from the selected variant. */
export type ShowroomStatKey =
  | "bootSpaceLitres"
  | "accelerationSeconds"
  | "rangeClaimedKm"
  | "batteryCapacityKwh"
  | "topSpeedKmph"
  | "gradeability"
  | "ipRating"
  | "ridingModes";

/** Icons a stat card may use. Mapped to Lucide components at render. */
export type ShowroomIconId =
  | "gauge"
  | "shield"
  | "route"
  | "battery"
  | "timer"
  | "package"
  | "mountain"
  | "droplets";

export interface ShowroomMedia {
  src: string;
  alt: string;
  width: number;
  height: number;
  /**
   * True when the artwork already carries its own coloured background and
   * should bleed to the edges of its frame. False for a cut-out product shot
   * that needs a surface behind it.
   */
  fullBleed?: boolean;
}

/** Large image-led statement. The reference's "Biggest Boot Space" panel. */
export interface ShowroomBanner {
  kind: "banner";
  id: string;
  title: string;
  /** Specification quoted beneath the title, e.g. boot space in litres. */
  statKey?: ShowroomStatKey;
  /** Caption sitting over the artwork. Carries no figure of its own. */
  caption?: string;
  media: ShowroomMedia;
  /**
   * `overlay` lays the copy over the artwork and needs a subject that leaves
   * one side of the frame clear. `split` gives the copy its own panel beside
   * the image — the right choice for a centred subject with no empty side.
   */
  layout?: "overlay" | "split";
  /** Which end of the frame the copy sits at. */
  align?: "start" | "end";
  /**
   * Copy colour, chosen against the ARTWORK the copy lands on, not the page.
   * `light` over dark bodywork, `dark` over the white ground these product
   * renders are shot on. Only meaningful for the `overlay` layout.
   */
  copyTone?: "light" | "dark";
}

/** Image + title + description. The unit of every feature grid. */
export interface ShowroomCard {
  id: string;
  title: string;
  description: string;
  media: ShowroomMedia;
  /** Quoted under the title when the card makes a measurable claim. */
  statKey?: ShowroomStatKey;
}

export interface ShowroomCards {
  kind: "cards";
  id: string;
  columns: 2 | 3;
  /** Taller frames suit portrait artwork; wider ones suit landscape. */
  ratio?: "landscape" | "portrait" | "square";
  items: ShowroomCard[];
}

/** Interactive colour picker, driven by the model's own `colors`. */
export interface ShowroomColors {
  kind: "colors";
  id: string;
}

/** Interactive list + artwork. The reference's "App Features" panel. */
export interface ShowroomSmartFeatures {
  kind: "smart-features";
  id: string;
  items: ShowroomCard[];
}

/** Icon + title + description. For claims with no artwork of their own. */
export interface ShowroomStatCard {
  id: string;
  icon: ShowroomIconId;
  title: string;
  description: string;
  statKey?: ShowroomStatKey;
}

export interface ShowroomStatCards {
  kind: "stat-cards";
  id: string;
  items: ShowroomStatCard[];
}

export type ShowroomBlock =
  | ShowroomBanner
  | ShowroomCards
  | ShowroomColors
  | ShowroomSmartFeatures
  | ShowroomStatCards;

export interface ShowroomSection {
  /** Anchor id and scroll-spy target. Lowercase kebab-case. */
  id: string;
  /** Label in the sticky navigation. Two words at most — it has to fit. */
  navLabel: string;
  eyebrow: string;
  title: string;
  description?: string;
  blocks: ShowroomBlock[];
  /** Test conditions for any claim in this section. Rendered as fine print. */
  disclaimer?: string;
}

export interface ProductShowroom {
  /** Matches a `Product.slug`. */
  slug: string;
  /** One line introducing the variant chooser. */
  intro: string;
  /** Full-vehicle shot shown beneath the variant chooser. */
  variantImage?: ShowroomMedia;
  sections: ShowroomSection[];
}
