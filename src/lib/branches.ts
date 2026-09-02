import type { Branch } from "@/data/branches";
import type { AssistanceService } from "@/data/dealership";
import type { Product } from "@/types/product";
import { getBranchById, getBranches, getPrimaryBranch } from "@/data/branches";
import { getAssistance } from "@/data/dealership";
import { getProducts } from "@/lib/products";

/**
 * Branch resolution.
 *
 * `src/data/branches.ts` stores a branch's stock and services as ids, so that
 * file stays free of any dependency on product data. Turning those ids into
 * real records happens here — which means an id that names nothing simply
 * yields no record, rather than rendering a model the branch does not have.
 */

/** Models on this branch's floor, in lineup order. */
export function getBranchModels(branch: Branch): Product[] {
  const catalogue = getProducts();
  if (branch.availableModels === "all") return catalogue;

  const wanted = new Set(branch.availableModels);
  return catalogue.filter((product) => wanted.has(product.slug));
}

/** Services this branch offers, filtered to those the dealership confirms. */
export function getBranchServices(branch: Branch): AssistanceService[] {
  const offered = getAssistance();
  if (branch.services === "all") return offered;

  const wanted = new Set(branch.services);
  return offered.filter((service) => wanted.has(service.id));
}

/**
 * Resolves a branch id that arrived from outside the app — a URL parameter, a
 * stored preference, a submitted form. An id naming no branch falls back to the
 * primary one rather than leaving the page with no contact details.
 */
export function resolveBranch(branchId?: string | null): Branch {
  if (!branchId) return getPrimaryBranch();
  return getBranchById(branchId) ?? getPrimaryBranch();
}

/**
 * A branch plus the resolved stock and services a UI needs, trimmed to what is
 * actually rendered.
 *
 * The branch experience is interactive, so its data crosses to the client. Full
 * `Product` records would send an entire specification sheet per model per
 * branch for the sake of a name; this sends the name.
 */
export interface BranchView {
  branch: Branch;
  models: { slug: string; name: string }[];
  services: { id: string; title: string }[];
}

export function toBranchView(branch: Branch): BranchView {
  return {
    branch,
    models: getBranchModels(branch).map((product) => ({
      slug: product.slug,
      name: product.name,
    })),
    services: getBranchServices(branch).map((service) => ({
      id: service.id,
      title: service.title,
    })),
  };
}

/** Every branch, resolved, in display order. */
export function getBranchViews(): BranchView[] {
  return getBranches().map(toBranchView);
}

/** Branch ids, for `generateStaticParams` and per-branch iteration. */
export function getBranchIds(): string[] {
  return getBranches().map((branch) => branch.branchId);
}

export {
  getBranches,
  getOpenBranches,
  getBranchById,
  getBranchBySlug,
  getPrimaryBranch,
  hasMultipleBranches,
  isBranchPlaceholder,
  formatBranchAddress,
  branchLocality,
  branchTelUrl,
  branchWhatsappUrl,
  groupedBranchHours,
  isKnownBranch,
} from "@/data/branches";
export type { Branch, BranchStatus, OpeningHours, ShowroomImage } from "@/data/branches";
