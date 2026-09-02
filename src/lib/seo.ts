import type { Crumb } from "@/components/common/breadcrumbs";
import type { Faq } from "@/data/faqs";
import type { Product, ProductSpecs, ProductVariant } from "@/types/product";
import { dealership } from "@/data/dealership";
import { absoluteUrl, siteConfig } from "@/config/site";
import { brandedModel } from "@/lib/brand";
import { getBranches, getPrimaryBranch, type Branch } from "@/data/branches";

/**
 * Structured-data builders.
 *
 * Everything is derived from `siteConfig` and `dealership`, so schema can never
 * drift from what the pages actually say. Placeholder dealership fields are
 * omitted rather than published as zeroes.
 *
 * The publisher of this site is the DEALERSHIP (Maa Ambey Enterprises); the
 * `brand` of every product is the MANUFACTURER (Lectrix EV). Google reads both,
 * so conflating them here would misrepresent the business in search results as
 * well as on the page.
 */

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: dealership.legalName,
    url: siteConfig.url,
    description: dealership.description,
    // The dealership is not the manufacturer: it deals in the brand.
    brand: { "@type": "Brand", name: siteConfig.brand },
    ...(dealership.placeholders.includes("email")
      ? {}
      : { email: dealership.email }),
    ...(dealership.placeholders.includes("phone")
      ? {}
      : { telephone: dealership.phone }),
    ...(dealership.placeholders.includes("socialLinks")
      ? {}
      : { sameAs: dealership.socialLinks.map((link) => link.href) }),
  };
}

/**
 * LocalBusiness / AutoDealer entry for one showroom.
 *
 * Each branch is its own physical place and gets its own entry, keyed by a
 * per-branch `@id` and marked as a `branchOf` the dealership Organization —
 * which is how a multi-location business is meant to be described, and what
 * lets each showroom rank for its own city.
 *
 * Address, geo and phone are only emitted once real values replace the
 * placeholders. Publishing "000000" or 0,0 coordinates would actively harm
 * local search, so an unconfirmed field is omitted rather than defaulted.
 */
export function branchSchema(branch: Branch) {
  const hasAddress = !branch.placeholders.includes("address");
  const hasGeo = !branch.placeholders.includes("geo");
  const hasPhone = !branch.placeholders.includes("phone");
  const hasEmail = !branch.placeholders.includes("email");
  const url = absoluteUrl(`/showroom?branch=${branch.branchId}`);

  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "@id": absoluteUrl(`/showroom#${branch.branchId}`),
    name: `${dealership.dealershipName} — ${branch.branchName}`,
    description: branch.tagline,
    url,
    // The branch belongs to the dealership; the dealership deals in the brand.
    branchOf: { "@id": absoluteUrl("/#organization") },
    brand: { "@type": "Brand", name: siteConfig.brand },
    ...(hasPhone ? { telephone: branch.phone } : {}),
    ...(hasEmail ? { email: branch.email } : {}),
    ...(hasAddress
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: [branch.address.line1, branch.address.line2]
              .filter(Boolean)
              .join(", "),
            addressLocality: branch.address.city,
            addressRegion: branch.address.state,
            postalCode: branch.address.pincode,
            addressCountry: branch.address.countryCode,
          },
        }
      : {}),
    ...(hasGeo
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: branch.latitude,
            longitude: branch.longitude,
          },
        }
      : {}),
    openingHoursSpecification: branch.openingHours
      .filter((entry) => entry.opens && entry.closes)
      .map((entry) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${entry.day}`,
        opens: entry.opens,
        closes: entry.closes,
      })),
  };
}

/** Every branch as its own LocalBusiness entry. */
export function branchesSchema() {
  return getBranches().map(branchSchema);
}

/**
 * The dealership's primary showroom, for pages that describe "the showroom"
 * rather than a specific branch. Kept so existing callers are unchanged.
 */
export function localBusinessSchema() {
  return branchSchema(getPrimaryBranch());
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "en-IN",
    publisher: { "@id": absoluteUrl("/#organization") },
  };
}

/* -------------------------------------------------------------------------- */
/* Product & navigation schema                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Product schema for a model page.
 *
 * An `offers` block is emitted only when the variant has a confirmed price —
 * Google treats a price of 0 as a real offer, so publishing one for an
 * unconfirmed model would be a rich-result violation as well as a lie. The
 * same rule governs every optional field here: unknown data is omitted, never
 * defaulted.
 */
export function productJsonLd(
  product: Product,
  variant: ProductVariant,
  specs: ProductSpecs
) {
  const url = absoluteUrl(`/electric-scooters/${product.slug}`);

  const additionalProperty = [
    specs.range.claimedKm != null && {
      "@type": "PropertyValue",
      name: "Claimed range",
      value: specs.range.claimedKm,
      unitCode: "KMT",
    },
    specs.batteryCapacityKwh != null && {
      "@type": "PropertyValue",
      name: "Battery capacity",
      value: specs.batteryCapacityKwh,
      unitCode: "KWH",
    },
    specs.topSpeedKmph != null && {
      "@type": "PropertyValue",
      name: "Top speed",
      value: specs.topSpeedKmph,
      unitCode: "KMH",
    },
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": url,
    name: brandedModel(product.name),
    description: product.description,
    category: "Electric scooter",
    // The manufacturer, never the dealership selling it.
    brand: { "@type": "Brand", name: siteConfig.brand },
    url,
    ...(product.images.og || product.images.hero
      ? { image: absoluteUrl(product.images.og ?? product.images.hero!) }
      : {}),
    ...(variant.price != null
      ? {
          offers: {
            "@type": "Offer",
            price: variant.price,
            priceCurrency: "INR",
            availability:
              variant.availability === "available"
                ? "https://schema.org/InStock"
                : variant.availability === "coming-soon"
                  ? "https://schema.org/PreOrder"
                  : "https://schema.org/Discontinued",
            url,
            seller: { "@type": "AutoDealer", name: dealership.dealershipName },
          },
        }
      : {}),
    ...(additionalProperty.length > 0 ? { additionalProperty } : {}),
  };
}

/* -------------------------------------------------------------------------- */
/* Keywords                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Local search terms, generated rather than typed.
 *
 * Every term pairs the vehicle brand with the dealership or its city, because
 * that is what a local buyer actually searches: nobody looks for the dealership
 * name alone, and competing for "Lectrix EV" against the manufacturer is not
 * winnable. City-qualified terms appear only once a real city replaces the
 * placeholder — publishing "Lectrix EV dealer in City" would be worse than
 * publishing nothing.
 *
 * Pass a model name to add model-level terms for a product page.
 */
export function localKeywords(modelName?: string): string[] {
  const { city, state } = dealership.address;
  const cityKnown = !dealership.placeholders.includes("address");
  const brand = siteConfig.brand;
  const short = dealership.brandShort;

  const base = [
    `${dealership.dealershipName} ${brand}`,
    dealership.dealershipName,
    `${brand} dealer`,
    `${brand} showroom`,
    `${brand} dealer near me`,
    `${short} electric scooter showroom`,
    "electric scooter dealer",
  ];

  const local = cityKnown
    ? [
        `${brand} ${city}`,
        `${brand} dealer ${city}`,
        `${brand} showroom ${city}`,
        `electric scooter showroom ${city}`,
        `${brand} dealer ${state}`,
      ]
    : [];

  // Every branch with a confirmed address contributes its own city, so a second
  // showroom starts competing for its own local searches as soon as its address
  // is filled in — no keyword list to remember to update.
  const branchLocal = getBranches().flatMap((branch) =>
    branch.placeholders.includes("address")
      ? []
      : [
          `${brand} ${branch.address.city}`,
          `${brand} dealer ${branch.address.city}`,
          `${brand} showroom ${branch.address.city}`,
        ]
  );

  const model = modelName
    ? [
        brandedModel(modelName),
        `${modelName} price`,
        `${modelName} dealer`,
        ...(cityKnown ? [`${modelName} dealer ${city}`, `${modelName} price ${city}`] : []),
      ]
    : [];

  // De-duplicated: model terms can repeat a base term for single-word models.
  return Array.from(new Set([...base, ...local, ...branchLocal, ...model]));
}

export function breadcrumbJsonLd(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}

/** Collection page listing for the lineup. */
export function itemListJsonLd(products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: brandedModel(product.name),
      url: absoluteUrl(`/electric-scooters/${product.slug}`),
    })),
  };
}
