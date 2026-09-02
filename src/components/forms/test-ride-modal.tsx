"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TestRideForm } from "@/components/forms/test-ride-form";
import { track } from "@/lib/analytics";
import type { Product } from "@/types/product";

/**
 * Test ride booking in a dialog.
 *
 * Wraps the same `TestRideForm` the dedicated page uses, so a model-specific
 * CTA opens the form with that model preselected without duplicating any
 * validation or submission logic.
 */
export function TestRideModal({
  products,
  defaultModel,
  defaultVariant,
  children,
}: {
  products: Product[];
  defaultModel?: string;
  defaultVariant?: string;
  /** The trigger — any button or link. */
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          track({ name: "lead_form_opened", type: "test-ride", model: defaultModel });
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Book a test ride</DialogTitle>
          <DialogDescription>
            Free, about fifteen minutes, and no obligation. Bring a valid driving
            licence.
          </DialogDescription>
        </DialogHeader>

        <div className="px-4 pb-5">
          <TestRideForm
            products={products}
            defaultModel={defaultModel}
            defaultVariant={defaultVariant}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
