import type { Product } from "@/types/product";

/**
 * LXS
 *
 * ONE MODEL, THREE VARIANTS — WHY THIS IS NOT TWO PRODUCTS
 *
 * The LXS 2.0 and LXS 3.0 used to be separate records here. They are not
 * separate models: Lectrix EV sells them from a single product page
 * (`/products/lxs2`) behind one "Select Variant" control, on one chassis, with
 * one set of colours — the pack, the range and the price are what change. LXS
 * BaaS is the same platform again, sold without its battery. Modelling them as
 * three variants is what lets the page switch between them in place, and is
 * what stops the same chassis copy being maintained in three files.
 *
 * SOURCE OF THE FIGURES BELOW
 *
 * The per-variant range, 0-40 time, top speed and pack size come from the
 * comparison cards Lectrix EV publishes on its homepage; the price, charging
 * rate, suspension and ingress rating from the LXS product page; the BaaS
 * terms from `/products/lxs-battery-subscription`. Anything the brand does not
 * publish stays `null` — motor output, charge time, kerb weight, boot volume
 * and the LXS 3.0 price are all genuinely unpublished, not unfilled.
 */
export const lxs: Product = {
  slug: "lxs",
  name: "LXS",
  tagline: "The everyday commuter, sorted.",
  description:
    "The LXS is the Lectrix EV commuter platform — built for riders who cover a predictable city route every day and want the least fuss possible, in a 98 km, a 120 km and a battery-subscription form.",
  category: "commuter",
  order: 2,
  featured: true,

  /**
   * Baseline: what every LXS shares. The IP67 rating, the 10 A charging rate
   * and the telescopic suspension are stated for the LXS platform as a whole;
   * pack size, range and the 0-40 time differ per variant and are declared
   * there.
   */
  specs: {
    batteryCapacityKwh: 2.3,
    batteryCapacityLabel: null,
    batteryRemovable: null,
    batteryChemistry: null,
    range: { claimedKm: 98, realWorldKm: null },
    topSpeedKmph: 55,
    accelerationSeconds: 10.2,
    charging: {
      fullChargeHours: null,
      eightyPercentHours: null,
      chargerType: "10 A fast charger",
    },
    motor: { type: null, ratedPowerW: null, peakPowerW: null },
    gradeabilityPercent: null,
    gradeabilityDegrees: null,
    ipRating: "IP67",
    bootSpaceLitres: null,
    kerbWeightKg: null,
    // Lectrix EV names Eco mode on the LXS page but does not publish the full
    // set of riding modes, and a list containing only "Eco" would read as though
    // that were the only one.
    ridingModes: [],
  },

  variants: [
    {
      id: "lxs-2-0",
      name: "LXS 2.0",
      // The one LXS price Lectrix EV prints: "Ex-Showroom Price (inclusive of
      // charger) ₹ 84,990*", exclusive of insurance, road tax and registration.
      price: 84990,
      availability: "available",
      specs: {},
      baas: null,
      images: {
        card: "/images/products/lxs-2-0-card.png",
        hero: "/images/products/lxs-2-0-hero.png",
        og: "/images/products/lxs-2-0-og.png",
      },
      gallery: [
        {
          src: "/images/products/lxs-2-0-gallery-1.png",
          alt: "Lectrix LXS 2.0 — three-quarter front (placeholder visual)",
          width: 1600,
          height: 1200,
        },
        {
          src: "/images/products/lxs-2-0-gallery-2.png",
          alt: "Lectrix LXS 2.0 — side profile (placeholder visual)",
          width: 1600,
          height: 1200,
        },
        {
          src: "/images/products/lxs-2-0-gallery-3.png",
          alt: "Lectrix LXS 2.0 — rear three-quarter (placeholder visual)",
          width: 1600,
          height: 1200,
        },
        {
          src: "/images/products/lxs-2-0-gallery-4.png",
          alt: "Lectrix LXS 2.0 — console detail (placeholder visual)",
          width: 1600,
          height: 1200,
        },
      ],
    },
    {
      id: "lxs-3-0",
      name: "LXS 3.0",
      // Third-party listings quote a figure for the 3.0; Lectrix EV does not
      // print one, so nothing goes here. The showroom quotes it in person.
      price: null,
      availability: "available",
      specs: {
        batteryCapacityKwh: 3,
        range: { claimedKm: 120, realWorldKm: null },
      },
      baas: null,
      images: {
        card: "/images/products/lxs-3-0-card.png",
        hero: "/images/products/lxs-3-0-hero.png",
        og: "/images/products/lxs-3-0-og.png",
      },
      gallery: [
        {
          src: "/images/products/lxs-3-0-gallery-1.png",
          alt: "Lectrix LXS 3.0 — three-quarter front (placeholder visual)",
          width: 1600,
          height: 1200,
        },
        {
          src: "/images/products/lxs-3-0-gallery-2.png",
          alt: "Lectrix LXS 3.0 — side profile (placeholder visual)",
          width: 1600,
          height: 1200,
        },
        {
          src: "/images/products/lxs-3-0-gallery-3.png",
          alt: "Lectrix LXS 3.0 — rear three-quarter (placeholder visual)",
          width: 1600,
          height: 1200,
        },
        {
          src: "/images/products/lxs-3-0-gallery-4.png",
          alt: "Lectrix LXS 3.0 — console detail (placeholder visual)",
          width: 1600,
          height: 1200,
        },
      ],
    },
    {
      id: "lxs-baas",
      name: "LXS BaaS",
      /**
       * Left null deliberately. ₹60,350 buys the LXS BaaS without its battery,
       * which is not the same kind of number as the ₹84,990 that buys an LXS
       * 2.0 outright — putting it in `price` would let the compare table rank
       * a battery-less scooter against complete ones. It lives in `baas.
       * vehiclePrice`, beside the subscription that completes it.
       */
      price: null,
      availability: "available",
      specs: {
        // The homepage comparison card gives LXS BaaS 100 km against the 2.0's
        // 98 km on the same 2.3 kWh pack. The battery-subscription page's own
        // hero states 100 km but 50 km/h rather than 55 — that hero covers the
        // BaaS programme as a whole (NDuro BaaS and LXS BaaS share it), so the
        // model-specific comparison card is the better-attributed source and
        // top speed is inherited from the baseline.
        range: { claimedKm: 100, realWorldKm: null },
      },
      baas: {
        vehiclePrice: 60350,
        monthlySubscription: 1199,
        // No minimum term is published. The subscription is renewed through the
        // Lectrix EV app.
        minimumTermMonths: null,
      },
      images: {
        card: "/images/products/lxs-baas-card.png",
        hero: "/images/products/lxs-baas-hero.png",
        og: "/images/products/lxs-baas-og.png",
      },
      gallery: [
        {
          src: "/images/products/lxs-baas-gallery-1.png",
          alt: "Lectrix LXS BaaS — three-quarter front (placeholder visual)",
          width: 1600,
          height: 1200,
        },
        {
          src: "/images/products/lxs-baas-gallery-2.png",
          alt: "Lectrix LXS BaaS — side profile (placeholder visual)",
          width: 1600,
          height: 1200,
        },
        {
          src: "/images/products/lxs-baas-gallery-3.png",
          alt: "Lectrix LXS BaaS — rear three-quarter (placeholder visual)",
          width: 1600,
          height: 1200,
        },
        {
          src: "/images/products/lxs-baas-gallery-4.png",
          alt: "Lectrix LXS BaaS — console detail (placeholder visual)",
          width: 1600,
          height: 1200,
        },
      ],
    },
  ],
  defaultVariantId: "lxs-2-0",

  // Lectrix EV prints no family-wide "starting from" for the LXS, so the
  // lowest confirmed variant price — the 2.0's ₹84,990 — stands.
  publishedStartingPrice: null,

  /**
   * Only what the LXS pages themselves show. Turn-by-turn navigation and the
   * telescopic suspension are named there; the rest of the Lectrix EV app
   * feature set is advertised brand-wide rather than against this model, so it
   * is not claimed here until the dealership confirms it.
   */
  smartFeatures: ["navigation"],
  safetyFeatures: [],
  comfortFeatures: ["telescopic-suspension"],

  // Lectrix EV shows an LXS colour picker but does not name the finishes in
  // any machine-readable form. Left empty rather than guessed.
  colors: [],

  /**
   * Placeholder artwork generated by `scripts/generate-placeholder-images.py`.
   * Every file carries a visible PLACEHOLDER badge. The model-level images are
   * the fallback; each variant above points at its own set, so switching
   * variant changes the visual the way it will once real photography lands.
   * Swap files in at the same paths and sizes and nothing else needs to change.
   */
  images: {
    card: "/images/products/lxs-card.png",
    hero: "/images/products/lxs-hero.png",
    og: "/images/products/lxs-og.png",
  },
  gallery: [
    {
      src: "/images/products/lxs-gallery-1.png",
      alt: "Lectrix LXS — three-quarter front (placeholder visual)",
      width: 1600,
      height: 1200,
    },
    {
      src: "/images/products/lxs-gallery-2.png",
      alt: "Lectrix LXS — side profile (placeholder visual)",
      width: 1600,
      height: 1200,
    },
    {
      src: "/images/products/lxs-gallery-3.png",
      alt: "Lectrix LXS — rear three-quarter (placeholder visual)",
      width: 1600,
      height: 1200,
    },
    {
      src: "/images/products/lxs-gallery-4.png",
      alt: "Lectrix LXS — console detail (placeholder visual)",
      width: 1600,
      height: 1200,
    },
  ],
  warranty: {
    // Lectrix EV names its 3 year / 36,000 km warranty against the NDuro 2.0
    // and 3.0 only. Borrowing it for the LXS would be inventing a term.
    vehicle: null,
    battery: null,
    notes:
      "On LXS BaaS the battery stays with Lectrix EV and is replaced free of charge under the subscription, with no monthly kilometre limit. Vehicle warranty terms for the LXS are being confirmed with Lectrix EV — ask the showroom.",
  },

  faqs: [
    {
      question: "What is the difference between the LXS 2.0 and the LXS 3.0?",
      answer:
        "The battery and the range. The 2.0 carries a 2.3 kWh pack rated at up to 98 km on the IDC cycle; the 3.0 carries 3 kWh rated at up to 120 km. Both do 55 km/h and both take 10.2 seconds to 40 km/h, so the 3.0 buys you distance rather than speed.",
    },
    {
      question: "What does the LXS cost?",
      answer:
        "Lectrix EV lists the LXS 2.0 at ₹84,990 ex-showroom including the charger, exclusive of insurance, road tax and registration. The LXS 3.0 price is not published, and the LXS BaaS works differently — ₹60,350 for the scooter plus ₹1,199 a month for the battery. Tell us your city and we will put an on-road figure in writing.",
    },
    {
      question: "How does LXS BaaS work?",
      answer:
        "You buy the scooter without its battery for ₹60,350 and subscribe to the battery for ₹1,199 a month, renewed through the Lectrix EV app. Battery maintenance and replacement are covered, and there is no monthly kilometre cap. Lectrix EV also advertises an exchange benefit of up to ₹35,000 against an old petrol scooter, subject to evaluation.",
    },
    {
      question: "Is the LXS any good on broken roads?",
      answer:
        "That is what it is set up for: telescopic suspension, 145 mm of ground clearance and broader tyres. It is also IP67 rated, so rain and standing water are not a reason to leave it at home.",
    },
    {
      question: "How quickly does it charge?",
      answer:
        "Lectrix EV rates the LXS for 10 A fast charging but does not publish a full-charge time. We will not invent one — ask us and we will give you what we are seeing on the scooters we have delivered.",
    },
    {
      question: "Is the charger included in the price?",
      answer:
        "Yes. The ₹84,990 ex-showroom figure for the LXS 2.0 is stated inclusive of the charger.",
    },
    {
      question: "Can I take a test ride before deciding?",
      answer:
        "Yes. Test rides are free and take about fifteen minutes. Bring your licence and tell us which variant you want to try — riding the 2.0 and the 3.0 back to back is the quickest way to know whether the extra range is worth it for your route.",
    },
  ],
  dataStatus: {
    // Every figure Lectrix EV publishes for the LXS is entered. The remaining
    // blanks — motor, charge time, kerb weight, boot volume — are unpublished.
    specsConfirmed: true,
    // The 2.0 is priced; the 3.0 is not, and the BaaS variant is priced in a
    // different shape. Not a confirmed price set.
    pricingConfirmed: false,
    // Only the features the LXS pages name are listed; the dealership has not
    // yet confirmed the full equipment list.
    featuresConfirmed: false,
    warrantyConfirmed: false,
    colorsConfirmed: false,
    imagesSupplied: false,
  },
};
