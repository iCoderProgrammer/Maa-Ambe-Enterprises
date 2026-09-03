import * as React from "react";

import { cn } from "@/lib/utils";
import { Stagger, StaggerItem } from "@/components/common/motion";

interface SectionHeadingProps extends Omit<React.ComponentProps<"div">, "title"> {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Heading level. Only one `h1` may exist per page. */
  as?: "h1" | "h2" | "h3";
  align?: "start" | "center";
  /** Match the surrounding `Section` tone so contrast stays correct. */
  tone?: "default" | "inverse";
  /** Right-hand slot for a "view all" link or filter control. */
  action?: React.ReactNode;
}

/** Consistent eyebrow / title / description block used by every section. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  as: Heading = "h2",
  align = "start",
  tone = "default",
  action,
  className,
  ...props
}: SectionHeadingProps) {
  const centered = align === "center";
  const isInverse = tone === "inverse";

  /*
   * The heading animates itself.
   *
   * It used to be static markup while the grid or card list underneath it was
   * wrapped in a `Stagger`, so on every section the content rose into place
   * past a title that was already sitting there — the one part of the page
   * that never moved. Owning the entrance here rather than at 26 call sites
   * means eyebrow, title, description and action lead the section in the same
   * order everywhere, and a new section gets it without asking.
   *
   * The stagger is deliberately tighter than the card grids below (0.06 against
   * 0.07–0.09): a heading is read as one block, so the parts should arrive
   * close enough to feel like one movement rather than a queue.
   */
  return (
    <Stagger
      className={cn(
        "flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between",
        centered && "sm:flex-col sm:items-center",
        className
      )}
      stagger={0.06}
      {...props}
    >
      <div className={cn("max-w-2xl", centered && "text-center")}>
        {eyebrow ? (
          <StaggerItem
            as="span"
            className={cn(
              "text-eyebrow block uppercase",
              isInverse ? "text-brand-400" : "text-brand-700 dark:text-brand-400"
            )}
          >
            {eyebrow}
          </StaggerItem>
        ) : null}
        <StaggerItem
          as="span"
          className={cn("block", eyebrow && "mt-3")}
        >
          <Heading
            className={Heading === "h1" ? "text-display-xl" : "text-display-lg"}
          >
            {title}
          </Heading>
        </StaggerItem>
        {description ? (
          <StaggerItem
            as="span"
            className={cn(
              "text-lead mt-4 block text-pretty",
              isInverse ? "text-on-inverse-muted" : "text-muted-foreground"
            )}
          >
            {description}
          </StaggerItem>
        ) : null}
      </div>
      {action ? (
        <StaggerItem className="shrink-0">{action}</StaggerItem>
      ) : null}
    </Stagger>
  );
}
