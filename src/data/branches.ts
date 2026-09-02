/**
 * Branch (showroom) registry.
 *
 * Maa Ambe Enterprises operates through one or more showrooms. Everything that
 * varies BY LOCATION lives here — address, phone, WhatsApp, hours, map, the
 * models on that floor and the services that counter offers. Everything that
 * describes the BUSINESS as a whole — its name, its relationship to Lectrix EV,
 * why to buy from it — stays in `src/data/dealership.ts`, which derives its own
 * location fields from the primary branch below so that every existing consumer
 * keeps working unchanged.
 *
 * BRAND HIERARCHY, unchanged by any of this:
 *
 *   Maa Ambe Enterprises = the dealership, operating these branches.
 *   Lectrix EV           = the vehicle brand sold and serviced at them.
 *
 * A branch is a place you can visit Maa Ambe Enterprises. It is never a
 * manufacturer, a sub-brand, or a "Lectrix EV branch".
 *
 * ADDING A BRANCH
 * Copy `branchTemplate` at the bottom of this file, fill it in, drop it into
 * `branches`, and remove from its `placeholders` array every field you supplied
 * real data for. No component needs to change: the cards, the selector, the
 * sitemap and the per-branch structured data all read from this list.
 *
 * PLACEHOLDERS
 * A field named in a branch's `placeholders` array is NOT real. The UI labels
 * such fields as pending and structured data omits them entirely, because
 * publishing "000000" as a pincode is worse for local search than publishing
 * nothing at all.
 */

export interface OpeningHours {
  /** Schema.org day token, e.g. "Monday". */
  day: string;
  /** 24h "HH:MM", or null when closed. */
  opens: string | null;
  closes: string | null;
}

/** A photograph of a showroom. Same shape as product gallery images. */
export interface ShowroomImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface BranchAddress {
  line1: string;
  line2?: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  countryCode: string;
}

/**
 * Whether a customer can walk in today.
 *
 * `opening-soon` and `temporarily-closed` are shown honestly rather than
 * hidden — a customer who drives to a closed showroom is a worse outcome than
 * one who reads that it is not open yet.
 */
export type BranchStatus = "open" | "opening-soon" | "temporarily-closed";

export interface Branch {
  branchId: string;
  branchName: string;
  /** URL segment, for deep links and per-branch local SEO. */
  slug: string;
  /** One line on what makes this location useful. Never a specification claim. */
  tagline: string;

  /** City, state and pincode live inside the address — recorded once, not twice. */
  address: BranchAddress;

  /** E.164, used for tel: links. */
  phone: string;
  /** Human-readable, used for display. */
  phoneDisplay: string;
  /** Digits only, no "+", used to build wa.me links. */
  whatsapp: string;
  email: string;

  openingHours: OpeningHours[];

  latitude: number;
  longitude: number;
  /** Google Maps place link. */
  mapUrl: string;
  /** Embeddable map URL, e.g. a Google Maps `/maps/embed` link. */
  mapEmbedUrl: string | null;
  directionsUrl: string;

  /** Photography of this branch. Empty until real images are supplied. */
  branchImages: ShowroomImage[];

  /**
   * Product slugs on this floor, or "all" when the branch carries the full
   * lineup. Slugs are resolved against product data by `getBranchModels()`, so
   * a typo shows up as a missing model rather than as a broken page.
   */
  availableModels: "all" | string[];

  /**
   * Assistance ids this branch offers, from `dealership.assistance`, or "all".
   * A branch that does not yet have a workshop simply omits "service".
   */
  services: "all" | string[];

  /** The branch shown first, and the one whose details the site defaults to. */
  featured: boolean;
  status: BranchStatus;
  /** Listing order, lowest first. */
  displayOrder: number;

  /** Fields still holding placeholder content. */
  placeholders: string[];
}

/**
 * Every branch, unordered. Read through `getBranches()` rather than directly so
 * ordering and status filtering stay in one place.
 *
 * Today this holds a single, entirely placeholder showroom: the real addresses
 * have not been supplied. It is deliberately NOT padded with invented second
 * and third locations — a fabricated branch would put a customer in a car to an
 * address that does not exist. Add real ones from `branchTemplate`.
 */
export const branches: Branch[] = [
  {
    branchId: "main",
    branchName: "Main Showroom",
    slug: "main-showroom",
    tagline: "Full Lectrix EV range, test rides and service under one roof.",

    address: {
      line1: "Showroom address line 1",
      line2: "Showroom address line 2",
      locality: "Locality",
      city: "City",
      state: "State",
      pincode: "000000",
      country: "India",
      countryCode: "IN",
    },

    phone: "+919999999999",
    phoneDisplay: "+91 99999 99999",
    whatsapp: "919999999999",
    email: "hello@example.com",

    openingHours: [
      { day: "Monday", opens: "09:30", closes: "19:30" },
      { day: "Tuesday", opens: "09:30", closes: "19:30" },
      { day: "Wednesday", opens: "09:30", closes: "19:30" },
      { day: "Thursday", opens: "09:30", closes: "19:30" },
      { day: "Friday", opens: "09:30", closes: "19:30" },
      { day: "Saturday", opens: "09:30", closes: "19:30" },
      { day: "Sunday", opens: "10:30", closes: "17:00" },
    ],

    latitude: 0,
    longitude: 0,
    mapUrl: "https://maps.google.com",
    mapEmbedUrl: null,
    directionsUrl: "https://maps.google.com",

    // Placeholder artwork from `scripts/generate-placeholder-images.py`, each
    // carrying a visible PLACEHOLDER badge. Replace with real photographs of
    // this showroom at the same paths.
    branchImages: [
      {
        src: "/images/branches/exterior.png",
        alt: "Placeholder photograph of the showroom exterior",
        width: 1600,
        height: 1200,
      },
      {
        src: "/images/branches/floor.png",
        alt: "Placeholder photograph of the display floor",
        width: 1600,
        height: 1200,
      },
      {
        src: "/images/branches/delivery.png",
        alt: "Placeholder photograph of the delivery bay",
        width: 1600,
        height: 1200,
      },
      {
        src: "/images/branches/workshop.png",
        alt: "Placeholder photograph of the service workshop",
        width: 1600,
        height: 1200,
      },
    ],

    availableModels: "all",
    services: "all",

    featured: true,
    status: "open",
    displayOrder: 1,

    placeholders: [
      "branchName",
      "address",
      "phone",
      "whatsapp",
      "email",
      "openingHours",
      "geo",
      "mapUrl",
      "mapEmbedUrl",
      "directionsUrl",
      "branchImages",
    ],
  },
];

/**
 * Copy this to add a location. Not exported into `branches` — it exists so a
 * new branch starts from a filled-in shape rather than from memory.
 *
 * Delete from `placeholders` every field you replace with real data; anything
 * left in that array is treated by the UI and by structured data as unknown.
 */
export const branchTemplate: Branch = {
  branchId: "branch-2",
  branchName: "Second Showroom",
  slug: "second-showroom",
  tagline: "One line on what this location is good for.",

  address: {
    line1: "Address line 1",
    line2: "Address line 2",
    locality: "Locality",
    city: "City",
    state: "State",
    pincode: "000000",
    country: "India",
    countryCode: "IN",
  },

  phone: "+910000000000",
  phoneDisplay: "+91 00000 00000",
  whatsapp: "910000000000",
  email: "branch@example.com",

  openingHours: [
    { day: "Monday", opens: "09:30", closes: "19:30" },
    { day: "Tuesday", opens: "09:30", closes: "19:30" },
    { day: "Wednesday", opens: "09:30", closes: "19:30" },
    { day: "Thursday", opens: "09:30", closes: "19:30" },
    { day: "Friday", opens: "09:30", closes: "19:30" },
    { day: "Saturday", opens: "09:30", closes: "19:30" },
    { day: "Sunday", opens: null, closes: null },
  ],

  latitude: 0,
  longitude: 0,
  mapUrl: "https://maps.google.com",
  mapEmbedUrl: null,
  directionsUrl: "https://maps.google.com",

  branchImages: [],

  // Or list slugs: ["nduro", "lxs-3-0"].
  availableModels: "all",
  // Or list assistance ids: ["finance", "registration"].
  services: "all",

  featured: false,
  status: "open",
  displayOrder: 2,

  placeholders: [
    "branchName",
    "address",
    "phone",
    "whatsapp",
    "email",
    "openingHours",
    "geo",
    "mapUrl",
    "mapEmbedUrl",
    "directionsUrl",
    "branchImages",
  ],
};

/* -------------------------------------------------------------------------- */
/* Access                                                                      */
/* -------------------------------------------------------------------------- */

/** Every branch, in display order. */
export function getBranches(): Branch[] {
  return [...branches].sort((a, b) => a.displayOrder - b.displayOrder);
}

/** Branches a customer can visit today. */
export function getOpenBranches(): Branch[] {
  return getBranches().filter((branch) => branch.status === "open");
}

export function getBranchById(branchId: string): Branch | undefined {
  return branches.find((branch) => branch.branchId === branchId);
}

export function getBranchBySlug(slug: string): Branch | undefined {
  return branches.find((branch) => branch.slug === slug);
}

/**
 * The branch the site speaks as when no other is chosen: the featured one, or
 * the first in display order. Never undefined — `branches` is never empty, and
 * an empty registry would leave the site with no phone number at all.
 */
export function getPrimaryBranch(): Branch {
  return getBranches().find((branch) => branch.featured) ?? getBranches()[0];
}

/** True when more than one location exists — the selector only earns its space then. */
export function hasMultipleBranches(): boolean {
  return branches.length > 1;
}

/** True when the id names a real branch. Used by lead validation. */
export function isKnownBranch(branchId: string): boolean {
  return getBranchById(branchId) != null;
}

export function isBranchPlaceholder(field: string, branch: Branch): boolean {
  return branch.placeholders.includes(field);
}

/* -------------------------------------------------------------------------- */
/* Derived values                                                              */
/* -------------------------------------------------------------------------- */

/** Formatted single-line address for inline display. */
export function formatBranchAddress(branch: Branch): string {
  const { line1, line2, locality, city, state, pincode } = branch.address;
  return [line1, line2, locality, city, `${state} ${pincode}`]
    .filter(Boolean)
    .join(", ");
}

/** Short "City, State" label for cards and selector chips. */
export function branchLocality(branch: Branch): string {
  return [branch.address.city, branch.address.state].filter(Boolean).join(", ");
}

export function branchTelUrl(branch: Branch): string {
  return `tel:${branch.phone}`;
}

/**
 * Builds a wa.me deep link to this branch with a pre-filled message.
 * Message is URI-encoded, so caller-supplied text is safe to pass through.
 */
export function branchWhatsappUrl(branch: Branch, message?: string): string {
  const base = `https://wa.me/${branch.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Groups consecutive days sharing identical hours, e.g. "Mon – Sat". */
export function groupedBranchHours(branch: Branch) {
  const groups: { days: string[]; opens: string | null; closes: string | null }[] = [];

  for (const entry of branch.openingHours) {
    const last = groups.at(-1);
    if (last && last.opens === entry.opens && last.closes === entry.closes) {
      last.days.push(entry.day);
    } else {
      groups.push({ days: [entry.day], opens: entry.opens, closes: entry.closes });
    }
  }

  return groups;
}
