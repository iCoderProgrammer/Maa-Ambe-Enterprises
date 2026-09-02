"use client";

import * as React from "react";

import { BranchDetails } from "@/components/branches/branch-details";
import { BranchSelector } from "@/components/branches/branch-selector";
import { cn } from "@/lib/utils";
import type { BranchView } from "@/lib/branches";

/**
 * Selector + live detail panel.
 *
 * Owns which showroom is selected and nothing else; the panel below it is
 * presentational, so "what changes when you pick a branch" is answered in one
 * place. The chosen branch is written into the URL with `replaceState` rather
 * than a router navigation: the selection then survives a reload and can be
 * sent to someone, without re-rendering the server component tree or pushing an
 * entry onto the back stack for what is a filter, not a page.
 */
export function BranchExperience({
  views,
  initialBranchId,
  className,
}: {
  views: BranchView[];
  /** Usually resolved from `?branch=` on the server. */
  initialBranchId?: string;
  className?: string;
}) {
  const fallbackId = views[0]?.branch.branchId ?? "";
  const [selectedId, setSelectedId] = React.useState(() =>
    views.some((view) => view.branch.branchId === initialBranchId)
      ? initialBranchId!
      : fallbackId
  );

  const selected =
    views.find((view) => view.branch.branchId === selectedId) ?? views[0];

  const handleSelect = React.useCallback((branchId: string) => {
    setSelectedId(branchId);

    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("branch", branchId);
    window.history.replaceState(null, "", url);
  }, []);

  if (!selected) return null;

  return (
    <div className={cn("min-w-0", className)}>
      <BranchSelector
        branches={views.map((view) => view.branch)}
        selectedId={selected.branch.branchId}
        onSelect={handleSelect}
      />

      {/* Announced so a screen-reader user hears the panel change rather than
          only seeing it. */}
      <div
        className={views.length > 1 ? "mt-10" : ""}
        aria-live="polite"
        aria-atomic="false"
      >
        <BranchDetails view={selected} />
      </div>
    </div>
  );
}
