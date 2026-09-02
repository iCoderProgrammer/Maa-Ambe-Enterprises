import * as React from "react";

import { cn } from "@/lib/utils";

type ContainerWidth = "default" | "narrow" | "wide" | "full";

const widths: Record<ContainerWidth, string> = {
  narrow: "max-w-3xl",
  default: "max-w-(--container-content)",
  wide: "max-w-[92rem]",
  full: "max-w-none",
};

interface ContainerProps extends React.ComponentProps<"div"> {
  width?: ContainerWidth;
}

/** Horizontal gutter + max width. The only place page inline padding is set. */
export function Container({
  className,
  width = "default",
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full px-5 sm:px-6 lg:px-10", widths[width], className)}
      {...props}
    />
  );
}
