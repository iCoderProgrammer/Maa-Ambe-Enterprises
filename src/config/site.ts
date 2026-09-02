import { dealership } from "@/data/dealership";
import { DEALERSHIP_IDENTITY, VEHICLE_BRAND } from "@/lib/brand";

/**
 * Resolve the public origin at build time.
 *
 * `NEXT_PUBLIC_SITE_URL` can arrive as an empty string — declared but left
 * blank on the host, or inlined as "" by the bundler — which `??` does not
 * treat as missing, and `new URL("")` throws, so the production build dies at
 * module evaluation. Hence: trim, ignore blanks, and guard the parse.
 *
 * The only fallback is the project's stable production domain, and only on a
 * production build. A preview must keep resolving to localhost: that is what
 * makes `robots.ts` withhold indexing, and it stops a preview's canonicals
 * from claiming URLs the real site needs. The per-deployment `VERCEL_URL` is
 * deliberately not consulted — it changes on every build, so baking it into
 * canonicals, the sitemap and JSON-LD would point them at a URL that stops
 * being current the moment the next deployment lands.
 */
function resolveSiteUrl(): string {
  const candidates = [process.env.NEXT_PUBLIC_SITE_URL];

  if (process.env.VERCEL_ENV === "production") {
    candidates.push(
      process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
      process.env.VERCEL_PROJECT_PRODUCTION_URL,
    );
  }

  for (const candidate of candidates) {
    const value = candidate?.trim();
    if (!value) continue;

    // Vercel's system variables are bare hostnames; a hand-set value may or
    // may not carry a scheme.
    const withScheme = /^https?:\/\//.test(value) ? value : `https://${value}`;

    try {
      return new URL(withScheme).origin;
    } catch {
      continue;
    }
  }

  return "http://localhost:3000";
}

/**
 * Site-wide metadata defaults. Page-level metadata extends these rather than
 * redefining them, so a change here propagates everywhere.
 *
 * `name` is the DEALERSHIP — this website belongs to Maa Ambey Enterprises,
 * not to the manufacturer. `brand` is the vehicle brand it sells. Search
 * engines, OG cards and structured data all read those two fields, so keeping
 * them distinct here is what keeps the distinction true everywhere else.
 */
export const siteConfig = {
  /** Site owner: the local business. */
  name: dealership.dealershipName,
  shortName: "Maa Ambey",
  /** The dealership's relationship to the brand, as one line. */
  identity: DEALERSHIP_IDENTITY,
  /** Vehicle brand on sale here. Never the site owner. */
  brand: VEHICLE_BRAND,
  /** Descriptive page title — the subject, not the owner. The owner is appended. */
  title: `${VEHICLE_BRAND} Electric Scooters`,
  description: `Explore ${VEHICLE_BRAND} electric scooters at ${dealership.dealershipName}, an authorized ${VEHICLE_BRAND} dealership. Compare range, price and features, book a test ride or get an on-road price from the showroom.`,
  /** Set NEXT_PUBLIC_SITE_URL in production; localhost keeps dev builds valid. */
  url: resolveSiteUrl(),
  locale: "en_IN",
  themeColor: "#0b0f14",
  /** Supply the asset before launch; nothing references it until it exists. */
  ogImage: "/images/brand/og-default.png",
  /** The dealership's own handle, once it has one. Not the manufacturer's. */
  twitterHandle: null as string | null,
  keywords: [
    dealership.dealershipName,
    `${dealership.dealershipName} ${VEHICLE_BRAND}`,
    VEHICLE_BRAND,
    `${VEHICLE_BRAND} dealer`,
    `${VEHICLE_BRAND} showroom`,
    "Lectrix electric scooter showroom",
    "electric scooter dealer",
    "book test ride",
    "on-road price",
  ],
  dealership,
} as const;

export type SiteConfig = typeof siteConfig;

/** Absolute URL helper for canonicals, OG tags and structured data. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, siteConfig.url).toString();
}
