import { ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface MediaPlaceholderProps extends React.ComponentProps<"div"> {
  /** Describes the asset that belongs here, e.g. "NDuro — front three-quarter". */
  label: string;
  /** Tailwind aspect utility, e.g. "aspect-4/3". */
  ratio?: string;
  tone?: "default" | "inverse";
}

/**
 * Stands in for photography that has not been supplied yet.
 *
 * Deliberately not a fake product image: it reserves the exact layout space the
 * real asset will occupy (so there is no CLS when it is swapped in) and names
 * the asset it is waiting for. Replace with `next/image` once assets arrive.
 */
export function MediaPlaceholder({
  label,
  ratio = "aspect-4/3",
  tone = "default",
  className,
  ...props
}: MediaPlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={`Image placeholder: ${label}`}
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-2xl",
        ratio,
        tone === "inverse"
          ? "bg-white/5 text-on-inverse-muted"
          : "bg-muted text-muted-foreground",
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        className="absolute inset-0 [background-image:repeating-linear-gradient(135deg,currentColor_0,currentColor_1px,transparent_1px,transparent_11px)] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)] opacity-10"
      />
      <span className="relative flex flex-col items-center gap-2 px-6 text-center">
        <ImageIcon aria-hidden className="size-6 opacity-60" />
        <span className="text-xs font-medium">{label}</span>
      </span>
    </div>
  );
}
