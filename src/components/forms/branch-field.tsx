"use client";

import type { UseFormRegisterReturn } from "react-hook-form";

import { Field, selectClassName } from "@/components/forms/field";
import { branchLocality, getBranches, isBranchPlaceholder } from "@/data/branches";

/**
 * "Preferred showroom" select, shared by the test-ride and price forms.
 *
 * Imports from `@/data/branches` rather than `@/lib/branches` on purpose: this
 * runs in the browser, and the lib layer resolves branch stock against the
 * product catalogue, which would pull the catalogue and its validation into
 * every form bundle for the sake of a list of names.
 *
 * Renders nothing while there is a single showroom — the answer is not in
 * doubt, and the form's `defaultValues` already carry that branch's id, so the
 * lead is still routed correctly.
 */
export function BranchField({
  registration,
  error,
  label = "Preferred showroom",
  defaultBranchId,
}: {
  registration: UseFormRegisterReturn;
  error?: string;
  label?: string;
  defaultBranchId: string;
}) {
  const branches = getBranches();
  if (branches.length < 2) return null;

  return (
    <Field label={label} error={error} required>
      {(props) => (
        <select
          {...props}
          {...registration}
          // Mirrored onto the element so the server renders the requested
          // branch selected, rather than the first one until hydration.
          defaultValue={defaultBranchId}
          className={selectClassName}
        >
          {branches.map((branch) => (
            <option key={branch.branchId} value={branch.branchId}>
              {branch.branchName}
              {isBranchPlaceholder("address", branch)
                ? ""
                : ` — ${branchLocality(branch)}`}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}
