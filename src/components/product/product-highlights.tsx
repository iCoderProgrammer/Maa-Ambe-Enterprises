"use client";

import { BatteryCharging, Gauge, PlugZap, Route } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatSpec, TBD } from "@/lib/format";
import { formatGradeability } from "@/lib/product-utils";
import { useProduct } from "@/components/product/product-provider";

interface Highlight {
  id: string;
  title: string;
  icon: typeof Gauge;
  lines: { label: string; value: string }[];
}

/**
 * Performance, battery, range and charging, told as four panels.
 *
 * All figures come from the selected variant, so the story stays truthful when
 * a visitor switches to a bigger battery.
 */
export function ProductHighlights() {
  const { specs } = useProduct();

  const highlights: Highlight[] = [
    {
      id: "performance",
      title: "Performance",
      icon: Gauge,
      lines: [
        { label: "Top speed", value: formatSpec(specs.topSpeedKmph, "km/h") },
        { label: "0–40 km/h", value: formatSpec(specs.accelerationSeconds, "s", 1) },
        { label: "Motor", value: specs.motor.type ?? TBD },
        { label: "Peak power", value: formatSpec(specs.motor.peakPowerW, "W") },
        { label: "Gradeability", value: formatGradeability(specs) ?? TBD },
      ],
    },
    {
      id: "battery",
      title: "Battery",
      icon: BatteryCharging,
      lines: [
        { label: "Capacity", value: formatSpec(specs.batteryCapacityKwh, "kWh", 1) },
        { label: "Chemistry", value: specs.batteryChemistry ?? TBD },
        {
          label: "Removable",
          value:
            specs.batteryRemovable == null ? TBD : specs.batteryRemovable ? "Yes" : "No",
        },
        { label: "Protection", value: specs.ipRating ?? TBD },
      ],
    },
    {
      id: "range",
      title: "Range",
      icon: Route,
      lines: [
        { label: "Claimed", value: formatSpec(specs.range.claimedKm, "km") },
        { label: "Real-world estimate", value: formatSpec(specs.range.realWorldKm, "km") },
        {
          label: "Riding modes",
          value: specs.ridingModes.length > 0 ? specs.ridingModes.join(", ") : TBD,
        },
      ],
    },
    {
      id: "charging",
      title: "Charging",
      icon: PlugZap,
      lines: [
        { label: "Full charge", value: formatSpec(specs.charging.fullChargeHours, "hrs", 1) },
        { label: "To 80%", value: formatSpec(specs.charging.eightyPercentHours, "hrs", 1) },
        { label: "Charger", value: specs.charging.chargerType ?? TBD },
      ],
    },
  ];

  return (
    <ul className="grid list-none gap-px overflow-hidden rounded-2xl bg-hairline sm:grid-cols-2 lg:grid-cols-4">
      {highlights.map((highlight) => (
        <li
          key={highlight.id}
          className="bg-background flex flex-col gap-5 p-6 lg:p-7"
        >
          <span
            aria-hidden
            className="bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-400 inline-flex size-10 items-center justify-center rounded-xl"
          >
            <highlight.icon className="size-5" />
          </span>
          <h3 className="font-display text-base font-semibold">{highlight.title}</h3>
          <dl className="space-y-3 text-sm">
            {highlight.lines.map((line) => (
              <div key={line.label} className="flex items-baseline justify-between gap-3">
                <dt className="text-muted-foreground text-xs">{line.label}</dt>
                <dd
                  className={cn(
                    "font-display text-right text-sm font-medium",
                    line.value === TBD && "text-muted-foreground font-normal"
                  )}
                >
                  {line.value}
                </dd>
              </div>
            ))}
          </dl>
        </li>
      ))}
    </ul>
  );
}
