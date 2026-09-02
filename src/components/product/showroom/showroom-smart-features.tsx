"use client";

import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import type { ShowroomSmartFeatures as SmartFeatures } from "@/types/showroom";

/**
 * Feature list beside the artwork it describes.
 *
 * Built as a tablist rather than a row of buttons, because that is what it is:
 * one panel visible at a time, arrow keys moving between the tabs, the
 * selected tab announced as selected. Radix is not needed for three tabs, but
 * the keyboard contract it would have given is implemented in full here —
 * arrows, Home and End — because a list you cannot drive from the keyboard is
 * not a list, it is decoration.
 *
 * The artwork stacks above the list below `lg`, where there is no room for two
 * columns, and all panels are rendered and cross-faded so the frame never
 * collapses between selections.
 */
export function ShowroomSmartFeaturesBlock({ block }: { block: SmartFeatures }) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const count = block.items.length;

  const focusTab = (index: number) => {
    const next = (index + count) % count;
    setActiveIndex(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        focusTab(activeIndex + 1);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        focusTab(activeIndex - 1);
        break;
      case "Home":
        event.preventDefault();
        focusTab(0);
        break;
      case "End":
        event.preventDefault();
        focusTab(count - 1);
        break;
    }
  };

  if (count === 0) return null;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16">
      <div
        role="tablist"
        aria-label="App features"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        className="order-2 lg:order-1"
      >
        {block.items.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={item.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`${block.id}-tab-${item.id}`}
              aria-selected={isActive}
              aria-controls={`${block.id}-panel-${item.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "focus-visible:outline-ring block w-full cursor-pointer border-l-2 py-6 pl-6 text-left transition-colors duration-200 ease-(--ease-out-brand) focus-visible:outline-2 focus-visible:-outline-offset-2",
                isActive
                  ? "border-brand-600 dark:border-brand-400"
                  : "border-hairline hover:border-foreground/25"
              )}
            >
              <span
                className={cn(
                  "font-display block text-lg font-semibold transition-colors",
                  isActive ? "text-brand-700 dark:text-brand-300" : "text-foreground"
                )}
              >
                {item.title}
              </span>
              <span className="text-muted-foreground mt-2 block text-sm leading-relaxed text-pretty">
                {item.description}
              </span>
            </button>
          );
        })}
      </div>

      <div className="bg-surface-muted relative order-1 aspect-4/3 overflow-hidden rounded-2xl sm:rounded-3xl lg:order-2">
        {block.items.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={item.id}
              role="tabpanel"
              id={`${block.id}-panel-${item.id}`}
              aria-labelledby={`${block.id}-tab-${item.id}`}
              hidden={!isActive}
              className="absolute inset-0"
            >
              <Image
                src={item.media.src}
                alt={item.media.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 92vw"
                className="object-contain p-6 sm:p-10"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
