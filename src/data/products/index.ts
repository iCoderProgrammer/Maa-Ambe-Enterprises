import type { Product } from "@/types/product";
import { validateProducts } from "@/schemas/product";

import { lxs20 } from "./lxs-2-0";
import { lxs30 } from "./lxs-3-0";
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
 */
const lineup: Product[] = [nduro, lxs30, lxs20, zyro, sx25];

validateProducts([...lineup, templateProduct]);

export const products: Product[] = [...lineup].sort((a, b) => a.order - b.order);
