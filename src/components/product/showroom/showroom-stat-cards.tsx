import {
  Battery,
  Droplets,
  Gauge,
  Mountain,
  Package,
  Route,
  Shield,
  Timer,
  type LucideIcon,
} from "lucide-react";

import type { ShowroomIconId, ShowroomStatCards as StatCards } from "@/types/showroom";
import { ShowroomStat } from "@/components/product/showroom/showroom-stat";

/**
 * Icon ids resolve to components here rather than in the data, so a showroom
 * data file stays free of React imports and can cross a server/client boundary
 * as plain values.
 */
const icons: Record<ShowroomIconId, LucideIcon> = {
  gauge: Gauge,
  shield: Shield,
  route: Route,
  battery: Battery,
  timer: Timer,
  package: Package,
  mountain: Mountain,
  droplets: Droplets,
};

/**
 * Claims that have no artwork of their own.
 *
 * Used sparingly and only where the alternative would be worse: pairing a
 * gradeability rating with a stock photo of a hill, or inventing an SOS
 * screenshot that does not exist in the asset set. An icon states plainly that
 * this is a fact rather than a picture.
 */
export function ShowroomStatCardsBlock({ block }: { block: StatCards }) {
  return (
    <ul className="grid list-none gap-4 sm:grid-cols-2">
      {block.items.map((item) => {
        const Icon = icons[item.icon];

        return (
          <li
            key={item.id}
            className="border-hairline bg-background rounded-2xl border p-6 sm:p-8"
          >
            <span
              aria-hidden
              className="bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 inline-flex size-10 items-center justify-center rounded-xl"
            >
              <Icon className="size-5" />
            </span>

            <h3 className="font-display mt-5 text-base font-semibold">{item.title}</h3>

            {item.statKey ? (
              <ShowroomStat statKey={item.statKey} size="md" className="mt-1.5" />
            ) : null}

            <p className="text-muted-foreground mt-2.5 text-sm leading-relaxed text-pretty">
              {item.description}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
