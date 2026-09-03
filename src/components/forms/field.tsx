"use client";

import * as React from "react";
import { AlertCircle, ChevronDown } from "lucide-react";

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
 *
 * `appearance-none` removes the browser's own arrow. It has to go: each engine
 * draws that arrow at its own inset — Chrome tight against the right edge,
 * Firefox and Safari elsewhere — so the arrow never lined up with the field's
 * own 14px padding, and no amount of padding on the select could move it. The
 * arrow is drawn by `SelectControl` below instead, which is why this class is
 * not exported: a bare `<select>` wearing it would have no arrow at all.
 *
 * `pr-10` (40px) reserves the arrow's lane: 14px of edge padding, a 16px icon,
 * and 10px of clearance so a long option label is ellipsised by the browser
 * before it can reach the arrow.
 */
const selectClassName =
  "peer border-input bg-background h-11 w-full appearance-none rounded-lg border pr-10 pl-3.5 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";

/**
 * Native `<select>` with the arrow drawn by us.
 *
 * Every select in the app renders through this, so the arrow's position is
 * decided in exactly one place. It is anchored to the field's own right edge
 * with `right-3.5`, matching the 14px used on the left, and centred with
 * `inset-y-0 my-auto` rather than a translate — that centres against whatever
 * height the field actually has, so a taller or shorter variant needs no new
 * rule and there is no half-pixel offset to blur the icon.
 *
 * The icon sits outside the `<select>` (a native select cannot contain one) but
 * inside its relatively positioned wrapper, so it tracks the field at any
 * width, and `peer-disabled` fades it with the field it belongs to.
 */
export function SelectControl({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <div className="relative min-w-0">
      <select {...props} className={cn(selectClassName, className)}>
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="text-muted-foreground pointer-events-none absolute inset-y-0 right-3.5 my-auto size-4 peer-disabled:opacity-50"
      />
    </div>
  );
}
