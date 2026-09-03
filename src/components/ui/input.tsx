import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * The browser's own picker button on `date`, `time` and `datetime-local`
 * inputs, aligned to match the arrow that `SelectControl` draws on a select.
 *
 * The button is drawn by the engine, so it cannot be replaced without losing
 * the native picker — but it can be sized and positioned. Left alone it comes
 * out heavier and a pixel wider than the select's chevron, and in dark mode it
 * stays black on a dark field, which is close to invisible.
 *
 * Chrome's own margin is dropped so the input's `px-3.5` decides the inset,
 * then `-mr-0.5` takes back the 2px of transparent padding the glyph carries
 * inside its box — measured, not guessed: that is what lands its ink on the
 * same vertical line as the chevron's, 17px in from the field's edge.
 * `size-4` matches the chevron's 16px box, `opacity-60` matches its
 * muted-foreground weight, and the dark-mode `invert` flips a black glyph to
 * white so it reads on a dark field. Hover lifts it to full strength, the same
 * affordance the rest of the form's controls have.
 *
 * Only Chromium exposes this pseudo-element. Firefox and Safari draw their own
 * button and ignore all of it, which is why the native one is restyled rather
 * than hidden behind an icon of ours: hiding it would leave those browsers
 * showing two icons, or none that opens the picker.
 */
const pickerIndicatorClassName =
  "[&::-webkit-calendar-picker-indicator]:my-0 [&::-webkit-calendar-picker-indicator]:ml-0 [&::-webkit-calendar-picker-indicator]:-mr-0.5 [&::-webkit-calendar-picker-indicator]:size-4 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 [&::-webkit-calendar-picker-indicator]:transition-opacity hover:[&::-webkit-calendar-picker-indicator]:opacity-100 dark:[&::-webkit-calendar-picker-indicator]:invert"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-lg border border-input bg-transparent px-3.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        pickerIndicatorClassName,
        className
      )}
      {...props}
    />
  )
}

export { Input }
