"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { formatPrice, formatSpec, TBD } from "@/lib/format";
import { formatGradeability } from "@/lib/product-utils";
import { useProduct } from "@/components/product/product-provider";

interface SpecRow {
  label: string;
  value: string;
}

interface SpecGroup {
  title: string;
  rows: SpecRow[];
}

const availabilityLabel = {
  available: "In showroom",
  "coming-soon": "Coming soon",
  discontinued: "Discontinued",
} as const;

function warrantyValue(term: { years: number | null; kilometres: number | null } | null) {
  if (!term) return TBD;

  const parts = [
    term.years != null ? `${term.years} year${term.years === 1 ? "" : "s"}` : null,
    term.kilometres != null ? formatSpec(term.kilometres, "km") : null,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" / ") : TBD;
}

/**
 * Full specification sheet for the selected variant.
 *
 * A real `<table>` with row headers, so screen readers announce each figure
 * with the specification it belongs to. Unconfirmed values render as the shared
 * placeholder rather than being omitted, which keeps the sheet's shape stable
 * and makes the gaps visible rather than silently absent.
 */
export function SpecTable() {
  const { product, variant, specs } = useProduct();

  const groups: SpecGroup[] = [
    {
      title: "Performance",
      rows: [
        { label: "Top speed", value: formatSpec(specs.topSpeedKmph, "km/h") },
        { label: "Acceleration (0–40 km/h)", value: formatSpec(specs.accelerationSeconds, "s", 1) },
        { label: "Motor type", value: specs.motor.type ?? TBD },
        { label: "Rated power", value: formatSpec(specs.motor.ratedPowerW, "W") },
        { label: "Peak power", value: formatSpec(specs.motor.peakPowerW, "W") },
        { label: "Gradeability", value: formatGradeability(specs) ?? TBD },
        {
          label: "Riding modes",
          value: specs.ridingModes.length > 0 ? specs.ridingModes.join(", ") : TBD,
        },
      ],
    },
    {
      title: "Battery & charging",
      rows: [
        { label: "Battery capacity", value: formatSpec(specs.batteryCapacityKwh, "kWh", 1) },
        { label: "Chemistry", value: specs.batteryChemistry ?? TBD },
        {
          label: "Removable battery",
          value:
            specs.batteryRemovable == null ? TBD : specs.batteryRemovable ? "Yes" : "No",
        },
        { label: "Claimed range", value: formatSpec(specs.range.claimedKm, "km") },
        { label: "Real-world range estimate", value: formatSpec(specs.range.realWorldKm, "km") },
        { label: "Full charge time", value: formatSpec(specs.charging.fullChargeHours, "hrs", 1) },
        { label: "Charge to 80%", value: formatSpec(specs.charging.eightyPercentHours, "hrs", 1) },
        { label: "Charger", value: specs.charging.chargerType ?? TBD },
        { label: "Ingress protection", value: specs.ipRating ?? TBD },
      ],
    },
    {
      title: "Dimensions & practicality",
      rows: [
        { label: "Under-seat storage", value: formatSpec(specs.bootSpaceLitres, "L") },
        { label: "Kerb weight", value: formatSpec(specs.kerbWeightKg, "kg") },
        {
          label: "Colours on this variant",
          value:
            product.colors.length > 0
              ? String(
                  variant.colorIds ? variant.colorIds.length : product.colors.length
                )
              : TBD,
        },
      ],
    },
    {
      title: "Ownership",
      rows: [
        { label: "Ex-showroom price", value: formatPrice(variant.price) },
        { label: "Vehicle warranty", value: warrantyValue(product.warranty.vehicle) },
        { label: "Battery warranty", value: warrantyValue(product.warranty.battery) },
        {
          label: "Battery-as-a-Service",
          value: variant.baas ? "Available on this variant" : "Not offered",
        },
        { label: "Availability", value: availabilityLabel[variant.availability] },
      ],
    },
  ];

  const unconfirmed = groups
    .flatMap((group) => group.rows)
    .filter((row) => row.value === TBD).length;

  return (
    <div>
      <div className="border-hairline overflow-hidden rounded-2xl border">
        <table className="w-full text-sm">
          <caption className="sr-only">
            {product.name} {variant.name} — full specifications
          </caption>
          <tbody>
            {groups.map((group) => (
              <React.Fragment key={group.title}>
                <tr className="bg-surface-muted">
                  <th
                    scope="colgroup"
                    colSpan={2}
                    className="font-display px-5 py-3 text-left text-xs font-semibold tracking-wide uppercase"
                  >
                    {group.title}
                  </th>
                </tr>
                {group.rows.map((row) => (
                  <tr key={`${group.title}-${row.label}`} className="border-hairline border-t">
                    <th
                      scope="row"
                      className="text-muted-foreground w-1/2 px-5 py-3.5 text-left font-normal"
                    >
                      {row.label}
                    </th>
                    <td
                      className={cn(
                        "font-display px-5 py-3.5 text-right font-medium",
                        row.value === TBD && "text-muted-foreground font-normal"
                      )}
                    >
                      {row.value}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {unconfirmed > 0 ? (
        <p className="text-muted-foreground mt-4 text-xs">
          {unconfirmed} specification{unconfirmed === 1 ? " is" : "s are"} shown as “—”
          because we are still confirming the figures with Lectrix EV. Call the showroom
          and we will give you the current numbers for the {product.name} {variant.name}.
        </p>
      ) : null}
    </div>
  );
}
