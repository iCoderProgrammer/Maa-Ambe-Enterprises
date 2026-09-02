"use client";

import { Check, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import { branchLocality, isBranchPlaceholder, type Branch } from "@/lib/branches";

/**
 * "Choose Your Showroom" — a single-choice control over the branch list.
 *
 * Built as a radio group rather than a row of buttons because that is what it
 * is: one selection out of several, arrow-key navigable, announced as such by a
 * screen reader. Scrolls horizontally on narrow screens instead of wrapping
 * into a ragged block.
 *
 * Renders nothing for a single branch — a chooser with one option is furniture,
 * not a choice — so callers can mount it unconditionally.
 */
export function BranchSelector({
  branches,
  selectedId,
  onSelect,
  label = "Choose Your Showroom",
  className,
}: {
  branches: Branch[];
  selectedId: string;
  onSelect: (branchId: string) => void;
  label?: string;
  className?: string;
}) {
  if (branches.length < 2) return null;

  return (
    <div className={cn("min-w-0", className)}>
      <p className="text-eyebrow text-muted-foreground uppercase" id="branch-selector-label">
        {label}
      </p>

      <div
        role="radiogroup"
        aria-labelledby="branch-selector-label"
        className="-mx-5 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
      >
        {branches.map((branch) => {
          const isSelected = branch.branchId === selectedId;

          return (
            <button
              key={branch.branchId}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(branch.branchId)}
              className={cn(
                "flex shrink-0 snap-start items-center gap-2.5 rounded-xl border px-4 py-3 text-left transition-colors duration-200 ease-(--ease-out-brand) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                isSelected
                  ? "border-brand-600 bg-brand-50 dark:bg-brand-950"
                  : "border-hairline bg-background hover:bg-muted/70"
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "inline-flex size-5 shrink-0 items-center justify-center rounded-full border",
                  isSelected
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-border text-transparent"
                )}
              >
                {isSelected ? <Check className="size-3" /> : <MapPin className="size-3" />}
              </span>

              <span className="min-w-0">
                <span
                  className={cn(
                    "font-display block text-sm font-medium",
                    isSelected ? "text-foreground" : "text-foreground"
                  )}
                >
                  {branch.branchName}
                </span>
                <span className="text-muted-foreground block text-xs">
                  {isBranchPlaceholder("address", branch)
                    ? "Location to be confirmed"
                    : branchLocality(branch)}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
