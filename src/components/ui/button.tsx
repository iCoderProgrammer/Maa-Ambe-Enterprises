import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-(--ease-out-brand) outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/88",
        /** Highest-intent conversion CTA. Use sparingly — one per view. */
        brand:
          "bg-brand text-brand-foreground hover:bg-brand-400 hover:shadow-brand",
        /** For use on dark (`tone="inverse"`) surfaces. */
        inverse:
          "bg-surface-inverse text-on-inverse hover:bg-surface-inverse/85",
        outline:
          "border-border bg-background text-foreground hover:border-foreground/25 hover:bg-muted aria-expanded:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        /** Outline sibling for dark surfaces. */
        "outline-inverse":
          "border-white/25 bg-transparent text-on-inverse hover:border-white/45 hover:bg-white/10",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:ring-destructive/40",
        link: "text-foreground underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-7 gap-1 rounded-md px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-md px-3 text-[0.8125rem] [&_svg:not([class*='size-'])]:size-3.5",
        default: "h-10 gap-2 px-4 text-sm",
        /** Primary page CTA. */
        lg: "h-12 gap-2 rounded-xl px-6 text-[0.9375rem] [&_svg:not([class*='size-'])]:size-4.5",
        /** Hero CTA only. */
        xl: "h-14 gap-2.5 rounded-xl px-8 text-base [&_svg:not([class*='size-'])]:size-5",
        icon: "size-10",
        "icon-xs": "size-7 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-md [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-12 rounded-xl [&_svg:not([class*='size-'])]:size-5",
      },
      /** Stretch to the container. Preferred over ad-hoc `w-full` classes. */
      block: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      block: false,
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  block = false,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, block, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
