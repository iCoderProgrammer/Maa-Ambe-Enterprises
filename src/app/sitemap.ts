import type { MetadataRoute } from "next";

import { getProductSlugs } from "@/lib/products";
import { getBranches } from "@/data/branches";
import { absoluteUrl } from "@/config/site";

/**
 * Sitemap for the dealership site.
 *
 * Routes are listed explicitly rather than crawled off the filesystem so that a
 * page cannot appear here by accident, and model URLs are generated from the
 * catalogue so a sixth model is indexed the moment its data file lands.
 *
 * Priorities reflect what actually converts: the lineup and the model pages
 * bring people in, the two lead forms are where they act. Nothing is excluded
 * that a customer can reach — the lead pages are indexable because "book a
 * Lectrix EV test ride" is a search someone genuinely makes.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: {
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/electric-scooters", priority: 0.9, changeFrequency: "weekly" },
    { path: "/compare", priority: 0.7, changeFrequency: "monthly" },
    { path: "/book-test-ride", priority: 0.9, changeFrequency: "monthly" },
    { path: "/on-road-price", priority: 0.9, changeFrequency: "monthly" },
    { path: "/finance", priority: 0.7, changeFrequency: "monthly" },
    { path: "/battery-as-a-service", priority: 0.7, changeFrequency: "monthly" },
    { path: "/showroom", priority: 0.9, changeFrequency: "monthly" },
    { path: "/service", priority: 0.6, changeFrequency: "monthly" },
    { path: "/warranty", priority: 0.5, changeFrequency: "yearly" },
    { path: "/about", priority: 0.6, changeFrequency: "yearly" },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  ];

  // One entry per showroom, so each location can be indexed for its own city.
  // Skipped entirely for a single-branch site, where `?branch=` would only
  // duplicate `/showroom`.
  const branches = getBranches();
  const branchRoutes =
    branches.length > 1
      ? branches.map((branch) => ({
          url: absoluteUrl(`/showroom?branch=${branch.branchId}`),
          lastModified,
          changeFrequency: "monthly" as const,
          priority: 0.7,
        }))
      : [];

  const modelRoutes = getProductSlugs().map((slug) => ({
    url: absoluteUrl(`/electric-scooters/${slug}`),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...modelRoutes,
    ...branchRoutes,
  ];
}
