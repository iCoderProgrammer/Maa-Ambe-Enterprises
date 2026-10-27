/**
 * Lectrix EV product model.
 *
 * Three rules govern this file, and every consumer depends on them:
 *
 * 1. **Variants own what varies.** `Product.specs` holds the model's baseline
 *    specification. A variant declares ONLY the fields that differ from that
 *    baseline in `ProductVariant.specs`. Nothing is assumed identical across
 *    variants — call `resolveSpecs()` to get the effective figures for a
 *    specific variant rather than reading `product.specs` directly.
 *
 * 2. **`null` means "not confirmed", never zero and never a guess.** The UI
 *    renders unconfirmed values as a placeholder, so no invented specification
 *    can reach a customer.
 *
 * 3. **Presentation lives elsewhere.** No copy, formatting or markup here.
 */

export type ProductCategory = "performance" | "commuter" | "entry";

export type Availability = "available" | "coming-soon" | "discontinued";

/** Keys into the catalogues in `src/data/feature-catalog.ts`. */
export type SmartFeatureId =
  | "mobile-app"
  | "geo-fencing"
  | "navigation"
  | "anti-theft"
  | "sos"
  | "vehicle-monitoring";

export type SafetyFeatureId =
  | "combi-braking"
  | "disc-brakes"
  | "tubeless-tyres"
  | "led-headlamp"
  | "led-drl"
  | "hazard-lights"
  | "side-stand-sensor"
  | "reverse-assist"
  | "battery-management-system"
  | "regenerative-braking";

export type ComfortFeatureId =
  | "telescopic-suspension"
  | "digital-console"
  | "usb-charging"
  | "boot-light"
  | "flat-footboard"
  | "pillion-backrest"
  | "keyless-start"
  | "cruise-control"
  | "mobile-holder";

export type FeatureId = SmartFeatureId | SafetyFeatureId | ComfortFeatureId;

export interface MotorSpec {
  /** e.g. "BLDC hub motor". */
  type: string | null;
  /** Continuous rated power, watts. */
  ratedPowerW: number | null;
  /** Peak power, watts. */
  peakPowerW: number | null;
}

export interface RangeSpec {
  /** Manufacturer-claimed range under ideal conditions, km. */
  claimedKm: number | null;
  /** Realistic range the dealership is willing to stand behind, km. */
  realWorldKm: number | null;
}

export interface ChargingSpec {
  /** Hours from empty to full on the supplied charger. */
  fullChargeHours: number | null;
  /** Hours to reach 80%, when published separately. */
  eightyPercentHours: number | null;
  /** e.g. "Portable 650 W charger". */
  chargerType: string | null;
}

/**
 * The complete specification set for one configuration of a model.
 * `Product.specs` supplies the baseline; a variant overrides a subset.
 */
export interface ProductSpecs {
  batteryCapacityKwh: number | null;
  /**
   * Pack size exactly as the manufacturer prints it, when it is not published
   * in kWh.
   *
   * Lectrix EV states ZYRO's pack as "30 Ah", "60V" and "48V" rather than in
   * kilowatt-hours. Ampere-hours cannot be turned into kilowatt-hours without
   * the pack voltage, and a voltage on its own carries no capacity at all, so
   * converting would mean publishing a figure the brand never did. The string
   * is therefore carried verbatim and `batteryCapacityKwh` stays `null` —
   * `formatBatteryCapacity()` renders whichever of the two exists.
   */
  batteryCapacityLabel: string | null;
  /** Removable vs fixed pack. */
  batteryRemovable: boolean | null;
  batteryChemistry: string | null;
  range: RangeSpec;
  topSpeedKmph: number | null;
  /** 0–40 km/h, seconds. */
  accelerationSeconds: number | null;
  charging: ChargingSpec;
  motor: MotorSpec;
  /** Maximum climbable gradient, percent. */
  gradeabilityPercent: number | null;
  /**
   * Maximum climbable gradient, degrees.
   *
   * Kept separate from `gradeabilityPercent` rather than converted: a
   * manufacturer publishes one or the other, and silently turning "16°" into
   * "28.7%" would present a derived figure as a published one. Whichever the
   * brand states is the one that is filled in.
   */
  gradeabilityDegrees: number | null;
  /** Ingress protection rating of the battery/motor, e.g. "IP67". */
  ipRating: string | null;
  bootSpaceLitres: number | null;
  kerbWeightKg: number | null;
  ridingModes: string[];
}

/** A variant only declares what differs from `Product.specs`. */
export type VariantSpecOverrides = Partial<ProductSpecs>;

export interface BaasTerms {
  /** Vehicle price excluding the battery, INR. */
  vehiclePrice: number | null;
  /** Battery subscription, INR per month. */
  monthlySubscription: number | null;
  /** Minimum commitment, months. */
  minimumTermMonths: number | null;
}

export interface ProductVariant {
  id: string;
  name: string;
  /** Ex-showroom price, INR. */
  price: number | null;
  availability: Availability;
  /** ONLY the specifications that differ from the model baseline. */
  specs: VariantSpecOverrides;
  /** Present when this variant is offered on Battery-as-a-Service. */
  baas: BaasTerms | null;
  /** Restrict colours to a subset for this variant. Omit to offer all. */
  colorIds?: string[];
  /**
   * Artwork that shows THIS variant rather than the model generally.
   *
   * Partial on purpose: a variant may have its own hero and card shot but no
   * separate social image, and each slot falls back to the model's
   * independently. Omit the field entirely when no variant-specific
   * photography exists — inheriting the model's shot is the honest default,
   * and is what NDuro does, because no separate 2.0/3.0 imagery is published.
   */
  images?: Partial<ProductImages>;
  /**
   * Gallery for this variant. Replaces the model's gallery wholesale rather
   * than adding to it: a mixed rail of two different variants is worse than
   * either one on its own. Omit to show the model's gallery.
   */
  gallery?: GalleryImage[];
}

export interface ProductColor {
  id: string;
  name: string;
  /** Swatch colour. */
  hex: string;
  /** Optional variant-specific product shot. */
  image: string | null;
}

export interface WarrantyTerm {
  years: number | null;
  kilometres: number | null;
}

export interface Warranty {
  vehicle: WarrantyTerm | null;
  battery: WarrantyTerm | null;
  /** Anything that qualifies the terms above. Never invented. */
  notes: string | null;
}

export interface ProductImages {
  /** Lineup card visual. */
  card: string | null;
  /** Model page hero visual. */
  hero: string | null;
  /** Social sharing image. */
  og: string | null;
}

export interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/** Tracks which parts of a record still await dealership confirmation. */
export interface DataStatus {
  specsConfirmed: boolean;
  pricingConfirmed: boolean;
  featuresConfirmed: boolean;
  warrantyConfirmed: boolean;
  colorsConfirmed: boolean;
  imagesSupplied: boolean;
}

export interface Product {
  slug: string;
  name: string;
  /** Short positioning line. Never contains a specification claim. */
  tagline: string;
  description: string;
  category: ProductCategory;
  /** Lineup order, lowest first. */
  order: number;
  featured: boolean;

  /** Baseline specification. Variants override individual fields. */
  specs: ProductSpecs;
  variants: ProductVariant[];
  defaultVariantId: string;

  /**
   * The "starting from" price the manufacturer publishes for the model as a
   * whole, INR — set only when Lectrix EV prints one.
   *
   * This exists because a model's cheapest variant and its cheapest CONFIRMED
   * variant are not the same thing. Lectrix EV publishes ZYRO from ₹51,741 but
   * attaches a price to only one of its three variants, so taking the minimum
   * of what we know would advertise ZYRO as starting ₹15,759 above what the
   * brand itself asks. When this is set, `getStartingPrice()` uses it; when it
   * is `null` the minimum of the confirmed variant prices stands.
   */
  publishedStartingPrice: number | null;

  smartFeatures: SmartFeatureId[];
  safetyFeatures: SafetyFeatureId[];
  comfortFeatures: ComfortFeatureId[];

  colors: ProductColor[];
  images: ProductImages;
  gallery: GalleryImage[];
  warranty: Warranty;

  faqs: { question: string; answer: string }[];
  dataStatus: DataStatus;
}

/** A variant with its baseline-merged, effective specification. */
export interface ResolvedVariant {
  product: Product;
  variant: ProductVariant;
  specs: ProductSpecs;
  /** Colours actually offered on this variant. */
  colors: ProductColor[];
  baas: BaasTerms | null;
  /** Variant artwork where it exists, the model's where it does not. */
  images: ProductImages;
  /** The variant's own gallery, or the model's. */
  gallery: GalleryImage[];
}
