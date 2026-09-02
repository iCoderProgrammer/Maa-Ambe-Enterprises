"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface FieldRenderProps {
  id: string;
  "aria-describedby": string | undefined;
  "aria-invalid": boolean | undefined;
  "aria-required": boolean | undefined;
}

/**
 * Labelled form field.
 *
 * shadcn's `form` component is not published for the `radix-nova` style, so
 * this is the hand-rolled equivalent. It exists to make the accessible wiring
 * impossible to get wrong: the label, hint and error are generated together and
 * handed to the control through a render prop, so `aria-describedby`,
 * `aria-invalid` and `aria-required` can never drift out of sync with what is
 * on screen.
 */
export function Field({
  label,
  hint,
  error,
  required,
  optional,
  className,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  /** Shows an explicit "optional" marker — clearer than marking everything else. */
  optional?: boolean;
  className?: string;
  children: (props: FieldRenderProps) => React.ReactNode;
}) {
  const id = React.useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("min-w-0", className)}>
      <Label htmlFor={id} className="flex items-baseline gap-1.5 text-sm font-medium">
        {label}
        {optional ? (
          <span className="text-muted-foreground text-xs font-normal">(optional)</span>
        ) : null}
        {required ? (
          <span aria-hidden className="text-destructive">
            *
          </span>
        ) : null}
      </Label>

      <div className="mt-2">
        {children({
          id,
          "aria-describedby": describedBy,
          "aria-invalid": error ? true : undefined,
          "aria-required": required || undefined,
        })}
      </div>

      {hint ? (
        <p id={hintId} className="text-muted-foreground mt-1.5 text-xs">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p
          id={errorId}
          className="text-destructive mt-1.5 flex items-start gap-1.5 text-xs"
        >
          <AlertCircle aria-hidden className="mt-px size-3.5 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Native `<select>` styling matching `Input`.
 *
 * A native select is used rather than the Radix one: it registers directly with
 * react-hook-form, ships no extra JavaScript, and gives mobile users their
 * platform's own picker, which is faster to operate than a custom listbox.
 */
export const selectClassName =
  "border-input bg-background h-11 w-full rounded-lg border px-3.5 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";
