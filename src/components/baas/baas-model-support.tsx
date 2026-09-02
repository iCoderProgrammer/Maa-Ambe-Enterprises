import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { PendingData } from "@/components/common/pending-data";
import { formatPrice } from "@/lib/format";
import { getStartingPrice, isBaasAvailable } from "@/lib/product-utils";
import type { Product } from "@/types/product";
import { brandedModel } from "@/lib/brand";

/**
 * Which models offer Battery-as-a-Service.
 *
 * Availability is read per variant from product data — a model appears as
 * supported only if one of its variants actually carries BaaS terms. Nothing
 * here is a marketing claim; it is a direct reflection of what is configured.
 */
export function BaasModelSupport({ products }: { products: Product[] }) {
  const supported = products.filter(isBaasAvailable);
  const noneConfigured = supported.length === 0;

  return (
    <div>
      {noneConfigured ? (
        <PendingData className="mb-8">
          Battery-as-a-Service availability is being confirmed with Lectrix EV for each
          model and variant. Rather than guess, we have left the list below marked as
          unconfirmed — call the showroom and we will tell you exactly what is on offer
          this month.
        </PendingData>
      ) : null}

      <ul className="grid list-none gap-px overflow-hidden rounded-2xl bg-hairline sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const available = isBaasAvailable(product);
          const baasVariants = product.variants.filter((variant) => variant.baas != null);

          return (
            <li
              key={product.slug}
              className="bg-background flex flex-col justify-between gap-5 p-6"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-base font-semibold">
                    <Link
                      href={`/electric-scooters/${product.slug}`}
                      className="hover:text-brand-700 dark:hover:text-brand-400 rounded-sm transition-colors"
                    >
                      {brandedModel(product.name)}
                    </Link>
                  </h3>
                  <Badge variant={available ? "default" : "outline"} className="shrink-0">
                    {available ? (
                      <>
                        <Check aria-hidden />
                        BaaS
                      </>
                    ) : (
                      <>
                        <Minus aria-hidden />
                        {noneConfigured ? "To confirm" : "Not offered"}
                      </>
                    )}
                  </Badge>
                </div>

                <p className="text-muted-foreground mt-2 text-sm text-pretty">
                  {available
                    ? `Offered on ${baasVariants.length} variant${
                        baasVariants.length === 1 ? "" : "s"
                      }: ${baasVariants.map((variant) => variant.name).join(", ")}.`
                    : product.tagline}
                </p>
              </div>

              <div className="border-hairline flex items-baseline justify-between border-t pt-4">
                <span className="text-muted-foreground text-xs">From</span>
                <span className="font-display text-sm font-medium">
                  {formatPrice(getStartingPrice(product))}
                </span>
              </div>

              <Link
                href={`/electric-scooters/${product.slug}`}
                className="text-brand-700 dark:text-brand-400 inline-flex items-center gap-1.5 rounded-sm text-sm font-medium transition-colors hover:gap-2.5"
              >
                View {brandedModel(product.name)}
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
