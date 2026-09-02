"use client";

import Link from "next/link";
import { Check, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MediaPlaceholder } from "@/components/common/media-placeholder";
import { cn } from "@/lib/utils";
import { TBD } from "@/lib/format";
import type { Comparison } from "@/lib/compare";
import { brandedModel } from "@/lib/brand";

/**
 * The comparison itself.
 *
 * One `<table>` at every breakpoint rather than a separate mobile component:
 * a duplicated DOM tree would double the markup, split the accessibility
 * semantics and risk the two versions drifting apart. Instead the table scrolls
 * horizontally on small screens with the specification column pinned, which is
 * the "horizontally scrollable comparison" pattern the brief allows and keeps
 * one set of row headers for screen readers.
 */
export function CompareTable({
  comparison,
  onRemove,
}: {
  comparison: Comparison;
  onRemove: (slug: string) => void;
}) {
  const { variants, groups } = comparison;
  const columnCount = variants.length;

  return (
    <div className="border-hairline overflow-hidden rounded-2xl border">
      <div className="scroll-fade-x overflow-x-auto">
        <table className="w-full min-w-[38rem] border-collapse text-sm">
          <caption className="sr-only">
            Side-by-side comparison of{" "}
            {variants.map((entry) => brandedModel(entry.product.name)).join(", ")}
          </caption>

          <thead>
            <tr>
              <th
                scope="col"
                className="bg-background sticky left-0 z-20 w-40 min-w-40 border-b border-hairline p-4 text-left align-bottom sm:w-52 sm:min-w-52"
              >
                <span className="text-eyebrow text-muted-foreground uppercase">
                  Specification
                </span>
              </th>

              {variants.map((entry) => (
                <th
                  key={entry.product.slug}
                  scope="col"
                  className="border-b border-l border-hairline p-4 text-left align-top"
                  style={{ width: `${80 / columnCount}%` }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/electric-scooters/${entry.product.slug}`}
                      className="font-display hover:text-brand-700 dark:hover:text-brand-400 rounded-sm text-base font-semibold transition-colors"
                    >
                      {brandedModel(entry.product.name)}
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => onRemove(entry.product.slug)}
                      aria-label={`Remove ${brandedModel(entry.product.name)} from comparison`}
                    >
                      <X aria-hidden />
                    </Button>
                  </div>

                  {entry.product.variants.length > 1 ? (
                    <Badge variant="outline" className="mt-2">
                      {entry.variant.name}
                    </Badge>
                  ) : null}

                  <div className="mt-3">
                    {entry.product.images.card ? null : (
                      <MediaPlaceholder
                        label={entry.product.name}
                        ratio="aspect-4/3"
                        className="rounded-lg"
                      />
                    )}
                  </div>

                  <Button asChild variant="brand" size="sm" block className="mt-3">
                    <Link href={`/book-test-ride?model=${entry.product.slug}`}>
                      Test Ride
                    </Link>
                  </Button>
                </th>
              ))}
            </tr>
          </thead>

          {groups.map((group) => (
            <tbody key={group.id}>
              <tr>
                <th
                  scope="colgroup"
                  colSpan={columnCount + 1}
                  className="bg-surface-muted font-display border-y border-hairline px-4 py-2.5 text-left text-xs font-semibold tracking-wide uppercase"
                >
                  {group.title}
                </th>
              </tr>

              {group.rows.map((row) => (
                <tr key={row.key} className="border-b border-hairline last:border-b-0">
                  <th
                    scope="row"
                    className="bg-background text-muted-foreground sticky left-0 z-10 p-4 text-left font-normal"
                  >
                    {row.label}
                  </th>

                  {row.values.map((value, index) => (
                    <td
                      key={variants[index].product.slug}
                      className={cn(
                        "border-l border-hairline p-4 align-middle",
                        value.display === TBD && "text-muted-foreground"
                      )}
                    >
                      <span
                        className={cn(
                          "font-display inline-flex items-center gap-1.5 font-medium",
                          value.isBest && "text-brand-700 dark:text-brand-400"
                        )}
                      >
                        {value.isBest ? (
                          <Check aria-hidden className="size-3.5 shrink-0" />
                        ) : null}
                        {value.display}
                        {value.isBest ? <span className="sr-only">(best in this comparison)</span> : null}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
}
