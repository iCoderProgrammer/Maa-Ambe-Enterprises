import type { ProductSpecs } from "@/types/product";
import type { ShowroomStatKey } from "@/types/showroom";
import { formatBatteryCapacity, formatGradeability } from "@/lib/product-utils";

/** A figure ready to render: a big number and the unit that qualifies it. */
export interface ShowroomStat {
  value: string;
  /** Qualifier shown smaller beside or beneath the value. */
  unit: string | null;
}

/**
 * Resolves a `statKey` against the selected variant's effective specification.
 *
 * Returns `null` when the figure is not confirmed, and every caller drops the
 * figure rather than substituting a placeholder — an editorial panel with a
 * dash where a number should be reads as broken, whereas the same panel
 * without the number still reads as a sentence. The spec sheet lower down the
 * page is where gaps are shown honestly as "—".
 */
export function resolveShowroomStat(
  key: ShowroomStatKey,
  specs: ProductSpecs
): ShowroomStat | null {
  switch (key) {
    case "bootSpaceLitres":
      return specs.bootSpaceLitres != null
        ? { value: String(specs.bootSpaceLitres), unit: "litres" }
        : null;

    case "accelerationSeconds":
      return specs.accelerationSeconds != null
        ? { value: `${specs.accelerationSeconds}s`, unit: "0–40 km/h" }
        : null;

    case "rangeClaimedKm":
      return specs.range.claimedKm != null
        ? { value: `${specs.range.claimedKm} km`, unit: "IDC range" }
        : null;

    case "batteryCapacityKwh": {
      // Named for the common case but resolved through the shared formatter, so
      // a model whose pack the brand publishes as "30 Ah" still gets a figure
      // here instead of the panel silently dropping it.
      const capacity = formatBatteryCapacity(specs);
      return capacity ? { value: capacity, unit: "battery" } : null;
    }

    case "topSpeedKmph":
      return specs.topSpeedKmph != null
        ? { value: `${specs.topSpeedKmph} km/h`, unit: "top speed" }
        : null;

    case "gradeability": {
      const gradeability = formatGradeability(specs);
      return gradeability ? { value: gradeability, unit: null } : null;
    }

    case "ipRating":
      return specs.ipRating != null ? { value: specs.ipRating, unit: null } : null;

    case "ridingModes":
      return specs.ridingModes.length > 0
        ? { value: specs.ridingModes.join(" · "), unit: null }
        : null;
  }
}
