import * as React from "react";

import { cn } from "@/lib/utils";

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

  return (
    <div
      className={cn(
        "flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between",
        centered && "sm:flex-col sm:items-center",
        className
      )}
      {...props}
    >
      <div className={cn("max-w-2xl", centered && "text-center")}>
        {eyebrow ? (
          <p
            className={cn(
              "text-eyebrow uppercase",
              isInverse ? "text-brand-400" : "text-brand-700 dark:text-brand-400"
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <Heading
          className={cn(
            Heading === "h1" ? "text-display-xl" : "text-display-lg",
            eyebrow && "mt-3"
          )}
        >
          {title}
        </Heading>
        {description ? (
          <p
            className={cn(
              "mt-4 text-lead text-pretty",
              isInverse ? "text-on-inverse-muted" : "text-muted-foreground"
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
