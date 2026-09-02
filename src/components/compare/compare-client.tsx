"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Check, Link2, Plus, RotateCcw, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/common/section";
import { PendingData } from "@/components/common/pending-data";
import { CompareTable } from "@/components/compare/compare-table";
import { ModelPicker } from "@/components/compare/model-picker";
import { Recommendations } from "@/components/compare/recommendations";
import { compareProducts, MAX_COMPARE } from "@/lib/compare";
import { getRecommendations } from "@/lib/recommendations";
import { resolveVariant } from "@/lib/product-utils";
import type { Product } from "@/types/product";

const PARAM = "models";

/**
 * Comparison orchestrator.
 *
 * The URL is the single source of truth: selection lives in `?models=`, so a
 * comparison is shareable, bookmarkable and survives the browser's back button
 * without any extra state to keep in sync.
 *
 * The catalogue arrives as a prop from the server page rather than being
 * imported here — see `src/lib/product-utils.ts` for why that keeps the
 * validation layer out of the client bundle.
 */
export function CompareClient({ catalogue }: { catalogue: Product[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [copied, setCopied] = React.useState(false);

  const slugs = React.useMemo(() => {
    const raw = searchParams.get(PARAM);
    if (!raw) return [];

    // De-duplicate and cap here so a hand-edited URL cannot break the table.
    return [...new Set(raw.split(",").map((slug) => slug.trim()).filter(Boolean))].slice(
      0,
      MAX_COMPARE
    );
  }, [searchParams]);

  const comparison = React.useMemo(
    () => compareProducts(slugs, catalogue),
    [slugs, catalogue]
  );

  const setSlugs = React.useCallback(
    (next: string[]) => {
      const query = next.length > 0 ? `?${PARAM}=${next.join(",")}` : "";
      router.replace(`${pathname}${query}`, { scroll: false });
    },
    [pathname, router]
  );

  const selected = comparison.products.map((product) => product.slug);

  const available = catalogue
    .filter((product) => !selected.includes(product.slug))
    .map((product) => {
      const { variant, specs } = resolveVariant(product);
      return { product, price: variant.price, rangeKm: specs.range.claimedKm };
    });

  const recommendations = getRecommendations(comparison.variants);
  const isFull = selected.length >= MAX_COMPARE;

  const handleShare = async () => {
    const url = window.location.href;

    // Prefer the native share sheet on mobile; fall back to the clipboard.
    if (navigator.share) {
      try {
        await navigator.share({ title: "Compare Lectrix EV scooters", url });
        return;
      } catch {
        // The visitor dismissed the sheet — fall through to copying.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      // Clipboard blocked (insecure context or denied permission). The URL is
      // already in the address bar, so tell the visitor rather than failing
      // silently.
      window.prompt("Copy this comparison link", url);
    }
  };

  return (
    <>
      <Section compact className="pt-0">
        <div className="flex flex-wrap gap-3">
          <ModelPicker
            available={available}
            onSelect={(slug) => setSlugs([...selected, slug])}
            disabled={isFull}
            trigger={
              <Button variant="outline" size="lg" disabled={isFull}>
                <Plus aria-hidden />
                {isFull ? `${MAX_COMPARE} models selected` : "Add a model"}
              </Button>
            }
          />
          {selected.length > 0 ? (
            <>
              <Button variant="ghost" size="lg" onClick={() => setSlugs([])}>
                <RotateCcw aria-hidden />
                Clear
              </Button>
              <Button variant="ghost" size="lg" onClick={handleShare}>
                {copied ? (
                  <>
                    <Check aria-hidden />
                    Link copied
                  </>
                ) : (
                  <>
                    <Share2 aria-hidden />
                    Share
                  </>
                )}
              </Button>
            </>
          ) : null}
        </div>

        <p aria-live="polite" className="sr-only">
          {selected.length === 0
            ? "No models selected."
            : `${selected.length} of ${MAX_COMPARE} models selected: ${comparison.products
                .map((product) => product.name)
                .join(", ")}.`}
        </p>

        {comparison.unknownSlugs.length > 0 ? (
          <div className="mt-8">
            <PendingData>
              We could not find {comparison.unknownSlugs.length === 1 ? "a model" : "models"}{" "}
              called “{comparison.unknownSlugs.join("”, “")}”. That link may be out of
              date — pick from the current lineup instead.
            </PendingData>
          </div>
        ) : null}

        {selected.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              catalogue={catalogue}
              onSelect={(slug) => setSlugs([slug])}
            />
          </div>
        ) : (
          <div className="mt-8">
            <CompareTable
              comparison={comparison}
              onRemove={(slug) =>
                setSlugs(selected.filter((existing) => existing !== slug))
              }
            />

            {selected.length === 1 ? (
              <p className="text-muted-foreground mt-5 text-sm">
                Add a second model to see them side by side.
              </p>
            ) : null}
          </div>
        )}
      </Section>

      {selected.length > 0 ? (
        <Section tone="muted">
          <h2 className="text-display-md">What the numbers say</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl text-pretty">
            Highlights drawn only from confirmed specifications. A category is left out
            when the data cannot support a clear winner.
          </p>
          <div className="mt-10">
            <Recommendations
              recommendations={recommendations}
              modelCount={selected.length}
            />
          </div>
        </Section>
      ) : null}

      <Section tone="inverse">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-display-lg">Still deciding?</h2>
          <p className="text-on-inverse-muted mt-5 text-lead text-pretty">
            Fifteen minutes on the road tells you more than any specification sheet.
            Book a test ride and try them back to back.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="brand" size="xl">
              <Link
                href={
                  selected.length > 0
                    ? `/book-test-ride?model=${selected[0]}`
                    : "/book-test-ride"
                }
              >
                Book Test Ride
              </Link>
            </Button>
            <Button asChild variant="outline-inverse" size="xl">
              <Link href="/on-road-price">Get On-Road Price</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}

/** Shown before anything is selected — a one-tap way into a comparison. */
function EmptyState({
  catalogue,
  onSelect,
}: {
  catalogue: Product[];
  onSelect: (slug: string) => void;
}) {
  return (
    <div className="border-hairline rounded-2xl border border-dashed p-8 text-center sm:p-12">
      <Link2 aria-hidden className="text-muted-foreground mx-auto size-7" />
      <p className="font-display mt-5 text-display-sm">Pick a model to start</p>
      <p className="text-muted-foreground mx-auto mt-3 max-w-md text-sm text-pretty">
        Add up to {MAX_COMPARE} models. Your selection is saved in the page address, so
        you can send the comparison to someone else exactly as you see it.
      </p>

      <ul className="mt-9 flex list-none flex-wrap justify-center gap-3">
        {catalogue.map((product) => (
          <li key={product.slug}>
            <Button variant="outline" size="lg" onClick={() => onSelect(product.slug)}>
              {product.name}
              <ArrowRight aria-hidden />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
