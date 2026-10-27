import type { Product } from "@/types/product";
import { validateProducts } from "@/schemas/product";

import { lxs } from "./lxs";
import { nduro } from "./nduro";
import { sx25 } from "./sx25";
import { templateProduct } from "./_template";
import { zyro } from "./zyro";

/**
 * The lineup — the single source of truth for the whole site.
 *
 * Data is validated at module load. Because every page that reads it is
 * statically rendered, that happens during `next build`: a malformed edit fails
 * the build rather than reaching a customer.
 *
 * `_template.ts` is validated alongside the real models so the reference
 * example can never drift out of sync with the schema, but it is not part of
 * the exported lineup.
 *
 * FOUR RECORDS, TEN VARIANTS
 *
 * One record per model as Lectrix EV sells it, not per badge on the road. LXS
 * 2.0, LXS 3.0 and LXS BaaS are one product with three variants because that is
 * how the manufacturer presents them — one page, one chassis, one "Select
 * Variant" control. The same goes for NDuro's three and ZYRO's three. Adding a
 * variant is an edit to a data file; adding a model is a new file and one line
 * here.
 */
const lineup: Product[] = [nduro, lxs, zyro, sx25];

validateProducts([...lineup, templateProduct]);

export const products: Product[] = [...lineup].sort((a, b) => a.order - b.order);
