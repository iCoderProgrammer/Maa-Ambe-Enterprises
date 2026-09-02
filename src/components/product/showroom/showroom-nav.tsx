"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface ShowroomNavItem {
  id: string;
  label: string;
}

/**
 * How far below the bar a section's top may still sit and count as current.
 *
 * Must stay larger than `scroll-mt` on a showroom section minus the height of
 * the header and this bar — currently a 41px margin at `lg`, the tightest
 * case. See the note in `update()`.
 */
const ACTIVATION_SLACK = 64;

/**
 * Sticky section navigation for the showroom.
 *
 * POSITIONING — the part that usually goes wrong.
 *
 * The bar is `sticky`, not `fixed`, so it keeps its place in the document flow
 * and the sections below start underneath it instead of behind it. It parks at
 * the header's own height (`top-16`, `lg:top-20`) and sits one layer below the
 * header's `z-50`, so the two stack rather than fight. It also paints an opaque
 * background and a hairline: a transparent sticky bar lets the section
 * scrolling beneath it show through its own labels, which is exactly the
 * overlap this design has to avoid. Fully opaque, not translucent-with-blur:
 * a blurred red product shot sliding under the labels still tints them, and
 * the bar has to stay legible over every section it sits above.
 *
 * SCROLL SPY
 *
 * A rAF-throttled scroll listener picks the last section whose top has passed
 * the bar, which is the reading position a person actually perceives as
 * "current". An IntersectionObserver is the more fashionable choice but gets
 * this wrong for sections taller than the viewport — they stop intersecting
 * while you are still reading them.
 *
 * ACCESSIBILITY
 *
 * Real anchors in a real `nav`, so the browser supplies tab order, Enter
 * activation, focus and the address-bar fragment for free. The active item is
 * marked with `aria-current="location"`, and smooth scrolling is delegated to
 * CSS (`scroll-behavior`), which already honours `prefers-reduced-motion`.
 */
export function ShowroomNav({
  items,
  className,
}: {
  items: ShowroomNavItem[];
  className?: string;
}) {
  const [activeId, setActiveId] = React.useState(items[0]?.id ?? "");
  const listRef = React.useRef<HTMLUListElement>(null);

  React.useEffect(() => {
    if (items.length === 0) return;

    let frame = 0;

    const update = () => {
      frame = 0;

      /*
       * Anything whose top has crossed this line counts as read past. The line
       * is the bottom of the bar — measured live, so a change to the header or
       * to this bar's own height cannot desync it — plus ACTIVATION_SLACK.
       *
       * That slack is load-bearing, not cosmetic. An anchor jump parks a
       * section at its `scroll-mt`, which is deliberately larger than the
       * sticky stack so the heading clears it comfortably. Without slack the
       * section would land just BELOW the activation line and the bar would
       * still be highlighting the previous section — the "click Performance,
       * Utility stays lit" bug. The slack has to exceed the gap between the
       * bar's bottom and the `scroll-mt` used on the sections.
       */
      const barBottom =
        (listRef.current?.getBoundingClientRect().bottom ?? 0) + ACTIVATION_SLACK;

      let current = items[0].id;

      for (const item of items) {
        const element = document.getElementById(item.id);
        if (!element) continue;
        if (element.getBoundingClientRect().top <= barBottom) current = item.id;
      }

      // At the very bottom of the page the last section may never reach the
      // line — nothing scrolls past it — so claim it explicitly.
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
      if (atBottom) current = items[items.length - 1].id;

      setActiveId(current);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    /*
     * The rAF throttle drops any scroll event that arrives while a frame is
     * already queued, and during a smooth scroll the FINAL event is often the
     * one dropped — leaving the bar settled on a stale section. `scrollend`
     * fires once the animation has actually stopped, so the last word always
     * belongs to the resting position. Browsers without it fall back to the
     * scroll listener, which the slack above already makes correct.
     */
    window.addEventListener("scrollend", update, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("scrollend", update);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [items]);

  /*
   * Keep the active chip in view on narrow screens, where the row scrolls.
   * Done by setting `scrollLeft` on the list rather than with
   * `scrollIntoView`, which would also scroll the PAGE — hijacking the very
   * scroll that just changed the active section.
   */
  React.useEffect(() => {
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!list || !active) return;

    const target =
      active.offsetLeft - list.clientWidth / 2 + active.offsetWidth / 2;
    list.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [activeId]);

  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        "border-hairline bg-background sticky top-16 z-40 border-b lg:top-20",
        className
      )}
    >
      <nav aria-label="Model sections" className="mx-auto w-full max-w-(--container-content)">
        {/*
          The scroll container is the `ul`, not an ancestor: an `overflow`
          anywhere above the sticky element would silently disable stickiness.
        */}
        <ul
          ref={listRef}
          className="no-scrollbar flex list-none items-center gap-1 overflow-x-auto px-4 py-2.5 sm:px-6 lg:justify-center lg:px-10"
        >
          {items.map((item) => {
            const isActive = item.id === activeId;

            return (
              <li key={item.id} className="shrink-0">
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "focus-visible:outline-ring block rounded-full px-3.5 py-2 text-[0.8125rem] font-medium whitespace-nowrap transition-colors duration-200 ease-(--ease-out-brand) focus-visible:outline-2 focus-visible:outline-offset-2",
                    isActive
                      ? "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
