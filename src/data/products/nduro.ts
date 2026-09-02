import type { Product } from "@/types/product";

/**
 * NDuro
 *
 * SOURCE OF THE FIGURES BELOW
 *
 * Every specification here is one Lectrix EV publishes on its own NDuro
 * product page — boot space, 0–40 time, IDC range, pack size, gradeability,
 * ingress rating, riding modes, colour names and the two variants. Nothing is
 * derived, rounded or inferred: a figure the manufacturer does not publish
 * stays `null` and the UI renders it as pending, which is why price, top
 * speed, charge time, motor output and kerb weight are still blank. The
 * dealership supplies those; until then the page asks the customer to call
 * rather than showing a number nobody stands behind.
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
  specs: {
    batteryCapacityKwh: 2.3,
    batteryRemovable: null,
    batteryChemistry: null,
    range: { claimedKm: 90, realWorldKm: null },
    topSpeedKmph: null,
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
   * Both variants are published with the same 90 km IDC range. NDuro 3.0's
   * pack size is not published, so it is restated as `null` rather than
   * inheriting 2.3 kWh from the baseline — a variant may not borrow a figure
   * that has not been confirmed for it.
   */
  variants: [
    {
      id: "nduro-2-0",
      name: "NDuro 2.0",
      price: null,
      availability: "available",
      specs: {},
      baas: { vehiclePrice: null, monthlySubscription: null, minimumTermMonths: null },
    },
    {
      id: "nduro-3-0",
      name: "NDuro 3.0",
      price: null,
      availability: "available",
      specs: {
        batteryCapacityKwh: null,
        range: { claimedKm: 90, realWorldKm: null },
      },
      baas: null,
    },
  ],
  defaultVariantId: "nduro-2-0",

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
    card: "/images/products/nduro-card.png",
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
  warranty: { vehicle: null, battery: null, notes: null },

  faqs: [
    {
      question: "How many kilometres does the NDuro cover on one full charge?",
      answer:
        "Both variants are rated at up to 90 km on the IDC test cycle. Real-world range depends on rider weight, terrain, traffic and riding mode, so treat the IDC figure as a comparison number rather than a promise — we will tell you what our own customers are seeing on Kanpur roads.",
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
        "The NDuro 2.0 is offered on Battery-as-a-Service: you buy the scooter without the battery and pay a monthly subscription for it instead. The subscription amount and minimum term are set by Lectrix EV — ask us for the current terms.",
    },
    {
      question: "Is the charger included in the price?",
      answer:
        "Yes. The charger is supplied with the scooter; there is nothing extra to buy to charge it at home.",
    },
    {
      question: "Can I take a test ride before deciding?",
      answer:
        "Yes, and we would rather you did. Test rides are free, take about fifteen minutes and run from either of our showrooms. Bring your licence and we will have an NDuro charged and waiting.",
    },
  ],
  dataStatus: {
    // Every published figure is in; the blanks are ones the brand does not
    // publish, not ones we have failed to enter.
    specsConfirmed: true,
    pricingConfirmed: false,
    featuresConfirmed: true,
    warrantyConfirmed: false,
    colorsConfirmed: true,
    imagesSupplied: true,
  },
};
