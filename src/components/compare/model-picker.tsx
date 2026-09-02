"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatPrice, formatSpec } from "@/lib/format";
import type { Product } from "@/types/product";

/**
 * "Add vehicle" picker.
 *
 * Only offers models that are not already in the comparison, so a visitor can
 * never add a duplicate. Disabled entirely once the comparison is full.
 */
export function ModelPicker({
  available,
  onSelect,
  disabled,
  trigger,
}: {
  available: { product: Product; price: number | null; rangeKm: number | null }[];
  onSelect: (slug: string) => void;
  disabled?: boolean;
  trigger?: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="lg" disabled={disabled}>
            <Plus aria-hidden />
            Add a model
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a model to compare</DialogTitle>
          <DialogDescription>
            Choose from the models not already in your comparison.
          </DialogDescription>
        </DialogHeader>

        {available.length === 0 ? (
          <p className="text-muted-foreground px-4 pb-4 text-sm">
            Every model is already in the comparison.
          </p>
        ) : (
          <ul className="max-h-[60vh] list-none space-y-2 overflow-y-auto px-4 pb-4">
            {available.map(({ product, price, rangeKm }) => (
              <li key={product.slug}>
                <DialogClose asChild>
                  <button
                    type="button"
                    onClick={() => onSelect(product.slug)}
                    className="border-border hover:border-foreground/30 hover:bg-muted flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-left transition-colors"
                  >
                    <span className="min-w-0">
                      <span className="font-display block text-sm font-semibold">
                        {product.name}
                      </span>
                      <span className="text-muted-foreground mt-0.5 block truncate text-xs">
                        {product.tagline}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="font-display block text-sm font-medium">
                        {formatPrice(price)}
                      </span>
                      <span className="text-muted-foreground mt-0.5 block text-xs">
                        {formatSpec(rangeKm, "km")}
                      </span>
                    </span>
                  </button>
                </DialogClose>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
