/**
 * Single source of truth for every dealership-specific detail.
 *
 * Nothing in this file may be duplicated inside a component. Header, footer,
 * showroom page, WhatsApp/call CTAs and LocalBusiness structured data all read
 * from here, so updating the business means editing this file only.
 *
 * WHAT LIVES HERE vs IN `src/data/branches.ts`
 *
 * This file describes the BUSINESS: its name, its relationship to Lectrix EV,
 * what it helps customers with, why to buy from it. Anything that varies by
 * LOCATION — address, phone, WhatsApp, hours, map, per-branch stock — belongs
 * to a branch, and the location fields below are derived from the primary
 * branch so that a single-branch site reads exactly as it did before branches
 * existed. Editing a showroom address means editing `branches.ts`, never this
 * file.
 *
 * Values marked `isPlaceholder` are NOT real. Replace them before launch —
 * `dealership.placeholders` lists everything still outstanding.
 *
 * BRAND HIERARCHY — the one rule this file exists to enforce:
 *
 *   Maa Ambe Enterprises = the dealership / showroom / local business.
 *   Lectrix EV            = the vehicle brand / manufacturer.
 *
 * The dealership sells and services Lectrix EV scooters; it does not build
 * them. `dealershipName` and `brand` are never interchangeable, and no model
 * may ever be prefixed with the dealership name. Phrasing helpers that keep
 * the two apart live in `src/lib/brand.ts`.
 */

import {
  branchTelUrl,
  branchWhatsappUrl,
  formatBranchAddress,
  getPrimaryBranch,
  groupedBranchHours,
  type OpeningHours,
  type ShowroomImage,
} from "@/data/branches";

// Re-exported so the many modules that already import these from here keep
// working; the definitions live with the branches that carry them.
export type { OpeningHours, ShowroomImage };

/** Something the showroom helps a customer with, beyond selling the vehicle. */
export interface AssistanceService {
  id: string;
  title: string;
  description: string;
  /** False hides the section rather than promising help we do not offer. */
  offered: boolean;
}

export interface DealershipConfig {
  /** The local business. This is the website's own identity. */
  dealershipName: string;
  legalName: string;
  /** The vehicle brand sold here. NOT the dealership — never interchange them. */
  brand: string;
  /** Brand name without the "EV" suffix, for model naming: "Lectrix NDuro". */
  brandShort: string;
  /** Fixed relationship line shown under the dealership name. */
  brandLine: string;
  tagline: string;
  description: string;
  address: {
    line1: string;
    line2?: string;
    locality: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    countryCode: string;
  };
  /** E.164, used for tel: links. */
  phone: string;
  /** Human-readable, used for display. */
  phoneDisplay: string;
  /** Digits only, no "+", used to build wa.me links. */
  whatsapp: string;
  email: string;
  openingHours: OpeningHours[];
  geo: { latitude: number; longitude: number };
  mapUrl: string;
  /** Embeddable map URL, e.g. a Google Maps `/maps/embed` link. */
  mapEmbedUrl: string | null;
  directionsUrl: string;
  socialLinks: { label: string; href: string }[];
  /** Showroom photography. Empty until real images are supplied. */
  gallery: ShowroomImage[];
  /** What the showroom helps with after the sale is agreed. */
  assistance: AssistanceService[];
  /** Reasons to buy here rather than anywhere else. Shown on the homepage. */
  advantages: AssistanceService[];
  /** Fields still holding placeholder content. */
  placeholders: string[];
}

const primaryBranch = getPrimaryBranch();

export const dealership: DealershipConfig = {
  dealershipName: "Maa Ambe Enterprises",
  legalName: "Maa Ambe Enterprises",
  brand: "Lectrix EV",
  brandShort: "Lectrix",
  brandLine: "Authorized Lectrix EV Dealership",
  tagline: "Your Electric Journey Starts Here",
  description:
    "Maa Ambe Enterprises is an authorized Lectrix EV dealership. We sell and service Lectrix EV electric scooters, and handle test rides, finance, registration and after-sales support locally.",
  // Location fields mirror the primary branch. They are not a second copy to
  // keep in sync: change the showroom in `branches.ts` and these follow.
  address: primaryBranch.address,
  phone: primaryBranch.phone,
  phoneDisplay: primaryBranch.phoneDisplay,
  whatsapp: primaryBranch.whatsapp,
  email: primaryBranch.email,
  openingHours: primaryBranch.openingHours,
  geo: { latitude: primaryBranch.latitude, longitude: primaryBranch.longitude },
  mapUrl: primaryBranch.mapUrl,
  mapEmbedUrl: primaryBranch.mapEmbedUrl,
  directionsUrl: primaryBranch.directionsUrl,
  socialLinks: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Facebook", href: "https://facebook.com" },
    { label: "YouTube", href: "https://youtube.com" },
  ],

  // The primary branch's photography. Empty until real images are supplied:
  // the gallery renders labelled placeholders that reserve the same layout
  // space, so dropping real images in later causes no layout shift.
  gallery: primaryBranch.branchImages,

  // What we help with once a customer has chosen a scooter. Descriptions stay
  // general on purpose: lender panels, insurers, premiums and RTO fees change,
  // and stating them here would put a number on the website that the counter
  // then has to correct.
  assistance: [
    {
      id: "finance",
      title: "Finance assistance",
      description:
        "We work with lending partners and handle the paperwork with you at the showroom. Rates, tenure and eligibility are set by the lender — we will tell you what you actually qualify for before you commit.",
      offered: true,
    },
    {
      id: "insurance",
      title: "Insurance assistance",
      description:
        "Third-party cover is mandatory; comprehensive cover protects your own vehicle too. We will walk you through the difference and arrange the policy alongside the purchase.",
      offered: true,
    },
    {
      id: "registration",
      title: "Registration assistance",
      description:
        "We handle RTO registration and number plate formalities so you are not queuing yourself. Charges vary by state, and some states waive them for electric vehicles.",
      offered: true,
    },
    {
      id: "service",
      title: "Service support",
      description:
        "Scheduled servicing, diagnostics, genuine spares and software updates are all handled here by technicians trained on these vehicles.",
      offered: true,
    },
  ],

  // Why a customer should buy from this dealership rather than another one.
  // Every entry is something inherent to being an authorized dealer — nothing
  // here promises a service, a discount or a turnaround time the counter has
  // not confirmed. Set `offered: false` to withdraw a claim rather than
  // deleting it, so the withdrawal stays visible in the config.
  advantages: [
    {
      id: "authorized",
      title: "Authorized Lectrix EV dealership",
      description:
        "Every scooter here is a genuine Lectrix EV supplied through the brand's official dealer channel, so the manufacturer warranty and software support apply from day one.",
      offered: true,
    },
    {
      id: "test-ride",
      title: "Test ride assistance",
      description:
        "Ride the model you are considering before you commit. We set the scooter up for you and take you through the controls first.",
      offered: true,
    },
    {
      id: "guidance",
      title: "Model guidance",
      description:
        "Tell us your daily distance, your parking situation and your budget, and we will tell you which model actually fits — including when the cheaper one is the right answer.",
      offered: true,
    },
    {
      id: "on-road-price",
      title: "On-road price assistance",
      description:
        "A clear breakdown of ex-showroom price, registration, insurance and any applicable subsidy for your city, before you decide.",
      offered: true,
    },
    {
      id: "finance-help",
      title: "Finance and paperwork",
      description:
        "Loan options, insurance and RTO registration are arranged here, in one visit, instead of being left to you afterwards.",
      offered: true,
    },
    {
      id: "after-sales",
      title: "Service support",
      description:
        "Scheduled servicing, diagnostics, genuine spares and software updates, handled by technicians trained on these vehicles.",
      offered: true,
    },
  ],

  // Location placeholders come from the primary branch, so filling in that
  // branch's address silently switches on the address-dependent UI and the
  // LocalBusiness schema here too. `socialLinks` is business-level, so it is
  // tracked here.
  placeholders: [
    ...primaryBranch.placeholders.map((field) =>
      field === "branchImages" ? "gallery" : field
    ),
    "socialLinks",
  ],
};

/** True when a field is still carrying placeholder content. */
export function isPlaceholder(
  field: string,
  config: DealershipConfig = dealership
): boolean {
  return config.placeholders.includes(field);
}

/** Services the showroom actually offers. */
export function getAssistance(config: DealershipConfig = dealership) {
  return config.assistance.filter((service) => service.offered);
}

/** Reasons to buy here, filtered to the ones still being claimed. */
export function getAdvantages(config: DealershipConfig = dealership) {
  return config.advantages.filter((advantage) => advantage.offered);
}

/** Formatted single-line address for the primary branch. */
export function formatAddress(): string {
  return formatBranchAddress(getPrimaryBranch());
}

/**
 * Builds a wa.me deep link with a pre-filled message.
 * Message is URI-encoded, so caller-supplied text is safe to pass through.
 */
export function whatsappUrl(message?: string): string {
  return branchWhatsappUrl(getPrimaryBranch(), message);
}

export function telUrl(): string {
  return branchTelUrl(getPrimaryBranch());
}

/** Groups consecutive days sharing identical hours, e.g. "Mon – Sat". */
export function groupedOpeningHours() {
  return groupedBranchHours(getPrimaryBranch());
}
