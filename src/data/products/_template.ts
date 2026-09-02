import type { Product } from "@/types/product";

/**
 * REFERENCE TEMPLATE — not part of the lineup.
 *
 * A fully populated example showing how to fill in a real model once the
 * dealership supplies confirmed data. It is exported for the unit-style
 * validation in `index.ts` and is deliberately excluded from `products`.
 *
 * The important pattern is `variants`: the model's baseline lives in `specs`,
 * and each variant declares ONLY what differs. Nothing is duplicated, and no
 * consumer may assume two variants share a figure — always read effective
 * specifications through `resolveSpecs()` in `src/lib/products.ts`.
 */
export const templateProduct: Product = {
  slug: "template-model",
  name: "Template Model",
  tagline: "One line of positioning, no numbers in it.",
  description:
    "Two or three sentences describing who this model is for and how it is meant to be used. Keep specification claims out of prose — they belong in the fields below, where they can be updated in one place.",
  category: "commuter",
  order: 99,
  featured: false,

  // Baseline: true for every variant unless a variant overrides it.
  specs: {
    batteryCapacityKwh: 2.3,
    batteryRemovable: true,
    batteryChemistry: "Lithium-ion (NMC)",
    range: { claimedKm: 105, realWorldKm: 80 },
    topSpeedKmph: 65,
    accelerationSeconds: 4.5,
    charging: {
      fullChargeHours: 4,
      eightyPercentHours: 3,
      chargerType: "Portable 650 W charger",
    },
    motor: { type: "BLDC hub motor", ratedPowerW: 1200, peakPowerW: 2200 },
    gradeabilityPercent: 12,
    ipRating: "IP67",
    bootSpaceLitres: 22,
    kerbWeightKg: 88,
    ridingModes: ["Eco", "City", "Power"],
  },

  variants: [
    {
      id: "standard",
      name: "Standard",
      price: 99999,
      availability: "available",
      // Inherits every baseline figure — nothing differs, so nothing is listed.
      specs: {},
      baas: null,
      colorIds: ["midnight-black", "arctic-white"],
    },
    {
      id: "long-range",
      name: "Long Range",
      price: 114999,
      availability: "available",
      // A bigger pack changes battery, range, charging time AND kerb weight.
      // Every one of them is stated — none is assumed to carry over.
      specs: {
        batteryCapacityKwh: 3.4,
        range: { claimedKm: 150, realWorldKm: 118 },
        charging: {
          fullChargeHours: 5.5,
          eightyPercentHours: 4,
          chargerType: "Portable 650 W charger",
        },
        kerbWeightKg: 95,
      },
      baas: {
        vehiclePrice: 79999,
        monthlySubscription: 1499,
        minimumTermMonths: 12,
      },
    },
  ],
  defaultVariantId: "standard",

  smartFeatures: ["mobile-app", "navigation", "anti-theft", "vehicle-monitoring"],
  safetyFeatures: [
    "combi-braking",
    "disc-brakes",
    "tubeless-tyres",
    "led-headlamp",
    "side-stand-sensor",
  ],
  comfortFeatures: [
    "telescopic-suspension",
    "digital-console",
    "usb-charging",
    "flat-footboard",
  ],

  colors: [
    { id: "midnight-black", name: "Midnight Black", hex: "#15171c", image: null },
    { id: "arctic-white", name: "Arctic White", hex: "#f2f3f5", image: null },
  ],
  images: {
    card: "/images/products/template-model/card.webp",
    hero: "/images/products/template-model/hero.webp",
    og: "/images/products/template-model/og.png",
  },
  gallery: [
    {
      src: "/images/products/template-model/gallery-1.webp",
      alt: "Template Model electric scooter, front three-quarter view",
      width: 1600,
      height: 1200,
    },
  ],
  warranty: {
    vehicle: { years: 3, kilometres: 30000 },
    battery: { years: 3, kilometres: 30000 },
    notes: "Terms as published by the manufacturer. Confirm with the showroom.",
  },

  faqs: [
    {
      question: "Does this model need registration?",
      answer:
        "Model-specific answers live here so they can appear on the model page and in its FAQ structured data.",
    },
  ],
  dataStatus: {
    specsConfirmed: true,
    pricingConfirmed: true,
    featuresConfirmed: true,
    warrantyConfirmed: true,
    colorsConfirmed: true,
    imagesSupplied: true,
  },
};
