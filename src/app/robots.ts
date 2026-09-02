import type { MetadataRoute } from "next";

import { absoluteUrl, siteConfig } from "@/config/site";

/**
 * Crawl rules.
 *
 * The API route is disallowed because it exists to receive lead submissions,
 * not to be read. Everything a customer can see is crawlable.
 *
 * Indexing is withheld until `NEXT_PUBLIC_SITE_URL` is configured: without it
 * the canonical URLs resolve to localhost, and a preview deployment indexed
 * under those URLs would compete with the real site.
 */
export default function robots(): MetadataRoute.Robots {
  const isConfigured = !siteConfig.url.includes("localhost");

  if (!isConfigured) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}
