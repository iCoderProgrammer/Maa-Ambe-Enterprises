import { Info } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Honest empty state for information the dealership has not confirmed yet.
 *
 * Used instead of hiding a section or, worse, filling it with plausible-looking
 * placeholder specifications.
 */
export function PendingData({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: "default" | "inverse";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-start gap-2.5 rounded-xl border border-dashed p-4 text-sm",
        tone === "inverse"
          ? "border-white/20 text-on-inverse-muted"
          : "border-border text-muted-foreground",
        className
      )}
    >
      <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
      <span className="text-pretty">{children}</span>
    </p>
  );
}
