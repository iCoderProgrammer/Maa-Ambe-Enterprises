import type { Product } from "@/types/product";

/**
 * NDuro
 *
 * SOURCE OF THE FIGURES BELOW
 *
 * Every specification here is one Lectrix EV publishes itself — the per-variant
 * comparison cards on lectrixev.com ("Choose Your Lectrix") and the NDuro
 * product page. Nothing is derived, rounded or inferred: a figure the
 * manufacturer does not publish stays `null` and the UI renders it as pending,
 * which is why price, charge time, motor output and kerb weight are still
 * blank. The dealership supplies those; until then the page asks the customer
 * to call rather than showing a number nobody stands behind.
 *
 * Two figures the brand states qualitatively rather than as a spec field —
 * the 1.25 lakh km durability test and the 300 mm water-wading test — live in
 * the showroom copy (`src/data/showroom/nduro.ts`) with their test conditions
 * attached, because that is the only honest way to present them.
 */
export const nduro: Product = {
  slug: "nduro",
  name: "NDuro",
  tagline: "Built for the long way round.",
  description:
    "NDuro is the touring end of the Lectrix EV lineup — sized for riders who want a planted, comfortable scooter for longer daily runs rather than short hops.",
  category: "performance",
  order: 1,
  featured: true,

  // Baseline specification for the model. Variants override individual fields.
  // Top speed and gradeability are shared across all three variants; range,
  // pack size and the 0-40 time are not, so they are restated per variant.
  specs: {
    batteryCapacityKwh: 2.3,
    batteryCapacityLabel: null,
    batteryRemovable: null,
    batteryChemistry: null,
    range: { claimedKm: 90, realWorldKm: null },
    topSpeedKmph: 65,
    accelerationSeconds: 5.1,
    charging: { fullChargeHours: null, eightyPercentHours: null, chargerType: null },
    motor: { type: null, ratedPowerW: null, peakPowerW: null },
    gradeabilityPercent: null,
    gradeabilityDegrees: 16,
    ipRating: "IP67",
    bootSpaceLitres: 42,
    kerbWeightKg: null,
    ridingModes: ["Eco", "Normal", "Sport"],
  },

  /**
   * Three variants, exactly as the brand lists them: NDuro 2.0 and NDuro 3.0
   * bought outright, and NDuro BaaS — the same 2.0 hardware sold without its
   * battery, which is why its range, pack and 0-40 figures match the 2.0's and
   * only the ownership terms differ.
   *
   * No variant carries its own artwork: Lectrix EV publishes one set of NDuro
   * photography covering all three, so all three inherit the model's images
   * rather than being given a stand-in that implies a difference we cannot see.
   */
  variants: [
    {
      id: "nduro-2-0",
      name: "NDuro 2.0",
      price: null,
      availability: "available",
      specs: {},
      baas: null,
    },
    {
      id: "nduro-3-0",
      name: "NDuro 3.0",
      price: null,
      availability: "available",
      specs: {
        batteryCapacityKwh: 3,
        range: { claimedKm: 117, realWorldKm: null },
        accelerationSeconds: 5.5,
      },
      baas: null,
    },
    {
      id: "nduro-baas",
      name: "NDuro BaaS",
      // The ex-showroom price of the vehicle-without-battery is published for
      // LXS BaaS only; Lectrix EV does not print the NDuro BaaS equivalent, so
      // both this and `baas.vehiclePrice` stay null rather than borrowing it.
      price: null,
      availability: "available",
      specs: {},
      baas: {
        vehiclePrice: null,
        // ₹1,199/month is stated for the Battery-as-a-Service programme, with
        // NDuro BaaS and LXS BaaS both offered under it on the same page.
        monthlySubscription: 1199,
        minimumTermMonths: null,
      },
    },
  ],
  defaultVariantId: "nduro-2-0",

  // Lectrix EV publishes no "starting from" figure for NDuro, and no variant
  // price is confirmed, so the card correctly reads "price on request".
  publishedStartingPrice: null,

  // Connected features offered through the Lectrix EV app.
  smartFeatures: [
    "mobile-app",
    "geo-fencing",
    "navigation",
    "anti-theft",
    "sos",
    "vehicle-monitoring",
  ],
  safetyFeatures: ["led-headlamp", "reverse-assist"],
  comfortFeatures: ["digital-console", "usb-charging"],

  colors: [
    { id: "solar-red", name: "Solar Red", hex: "#d0342c", image: "/images/nduro/nduro-red.webp" },
    {
      id: "cosmic-blue",
      name: "Cosmic Blue",
      hex: "#1f6fb2",
      image: "/images/nduro/nduro-blue.webp",
    },
    {
      id: "nova-white",
      name: "Nova White",
      hex: "#f1f2f4",
      image: "/images/nduro/nduro-white.webp",
    },
    {
      id: "quantum-black",
      name: "Quantum Black",
      hex: "#17181c",
      image: "/images/nduro/nduro-black.webp",
    },
  ],
  images: {
    // Real photography rather than the generated stand-ins the rest of the
    // lineup still carries: the grid puts these cards side by side, and one
    // genuine ride shot next to the placeholders is the honest state of the
    // asset set — the models still waiting on photography say so on the card.
    card: "/images/nduro/nduro-performance-01.webp",
    hero: "/images/nduro/nduro.webp",
    og: "/images/products/nduro-og.png",
  },
  gallery: [
    {
      src: "/images/nduro/nduro-variant-select-full.webp",
      alt: "Lectrix NDuro in Solar Red, full side profile",
      width: 1366,
      height: 768,
    },
    {
      src: "/images/nduro/nduro-vehicle-design-01.webp",
      alt: "Lectrix NDuro handlebar and colour segmented display, seen from the rider's seat",
      width: 1366,
      height: 768,
    },
    {
      src: "/images/nduro/nduro-boot-space.webp",
      alt: "Lectrix NDuro under-seat storage compartment with the seat raised",
      width: 1366,
      height: 768,
    },
    {
      src: "/images/nduro/nduro-led-headlamp.webp",
      alt: "Close-up of the Lectrix NDuro LED headlamp and front bodywork",
      width: 1366,
      height: 768,
    },
  ],
  warranty: {
    // Lectrix EV states this warranty for the NDuro 2.0 and 3.0 by name.
    vehicle: { years: 3, kilometres: 36000 },
    // Not published separately for the bought-outright variants. On NDuro BaaS
    // the battery is not owned at all — it is replaced free under the
    // subscription — so a years/kilometres term would misdescribe it.
    battery: null,
    notes:
      "Lectrix EV states 3 years / 36,000 km on the NDuro 2.0 and NDuro 3.0. On NDuro BaaS the battery stays with Lectrix EV and is replaced free of charge under the subscription instead of carrying a fixed term.",
  },

  faqs: [
    {
      question: "How many kilometres does the NDuro cover on one full charge?",
      answer:
        "Lectrix EV rates the NDuro 2.0 at up to 90 km and the NDuro 3.0 at up to 117 km on the IDC test cycle; the NDuro BaaS matches the 2.0 at 90 km. Real-world range depends on rider weight, terrain, traffic and riding mode, so treat the IDC figure as a comparison number rather than a promise — we will tell you what our own customers are seeing on Kanpur roads.",
    },
    {
      question: "What is the difference between the NDuro 2.0 and the NDuro 3.0?",
      answer:
        "The pack and the range. The 2.0 runs a 2.3 kWh battery for up to 90 km; the 3.0 runs a 3 kWh battery for up to 117 km. Both top out at 65 km/h, and the 2.0 is marginally quicker to 40 km/h at 5.1 seconds against 5.5. Everything else — boot space, gradeability, riding modes, the display — is the same scooter.",
    },
    {
      question: "How many colours does the NDuro come in?",
      answer:
        "Four: Solar Red, Cosmic Blue, Nova White and Quantum Black. Which of them we have on the floor changes with stock, so call before you drive over if you have your heart set on one.",
    },
    {
      question: "What is the boot space?",
      answer:
        "42 litres under the seat — enough for a full-face helmet plus a day's shopping, which is the practical test most riders actually care about.",
    },
    {
      question: "Is the NDuro available on Battery-as-a-Service?",
      answer:
        "Yes — NDuro BaaS is a variant in its own right. You buy the scooter without the battery and pay Lectrix EV ₹1,199 a month for it instead, which covers free replacement and puts no monthly kilometre limit on you. The vehicle price for the BaaS variant is not published, so ask us for the current figure.",
    },
    {
      question: "What warranty does the NDuro carry?",
      answer:
        "Lectrix EV states 3 years or 36,000 km, whichever comes first, on the NDuro 2.0 and NDuro 3.0. On NDuro BaaS the battery is not yours to warrant — it is replaced free under the subscription for as long as you hold it.",
    },
    {
      question: "Is the charger included in the price?",
      answer:
        "Yes. The charger is supplied with the scooter; there is nothing extra to buy to charge it at home.",
    },
    {
      question: "Can I take a test ride before deciding?",
      answer:
        "Yes, and we would rather you did. Test rides are free, take about fifteen minutes and run from any of our showrooms. Bring your licence and we will have an NDuro charged and waiting.",
    },
  ],
  dataStatus: {
    // Every published figure is in; the blanks are ones the brand does not
    // publish, not ones we have failed to enter.
    specsConfirmed: true,
    pricingConfirmed: false,
    featuresConfirmed: true,
    warrantyConfirmed: true,
    colorsConfirmed: true,
    imagesSupplied: true,
  },
};
