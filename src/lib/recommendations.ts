import type { ResolvedVariant } from "@/types/product";
import { formatPrice, formatSpec } from "@/lib/format";

/**
 * "Best for" badges, derived strictly from confirmed product data.
 *
 * Three rules keep these honest:
 *
 * 1. A recommendation needs at least two compared models with a confirmed
 *    value. One known figure beating a row of unknowns is not a comparison.
 * 2. A tie produces no recommendation. If two models share the best figure,
 *    neither is "the" best.
 * 3. Every recommendation states the figure it is based on, so the customer can
 *    check the claim against the table right next to it.
 *
 * When the data cannot support a category, it is omitted entirely rather than
 * softened into a vague claim.
 */

export interface Recommendation {
  id: string;
  /** Badge text, e.g. "Best for performance". */
  label: string;
  /** The evidence, e.g. "Highest top speed at 75 km/h". */
  reason: string;
  slug: string;
  productName: string;
}

const MIN_CONFIRMED = 2;

interface Candidate {
  entry: ResolvedVariant;
  value: number;
}

/**
 * Returns the single best candidate, or null when there are too few confirmed
 * values or when the best figure is shared.
 */
function pickWinner(
  candidates: Candidate[],
  direction: "higher" | "lower"
): Candidate | null {
  if (candidates.length < MIN_CONFIRMED) return null;

  const best =
    direction === "higher"
      ? Math.max(...candidates.map((candidate) => candidate.value))
      : Math.min(...candidates.map((candidate) => candidate.value));

  const winners = candidates.filter((candidate) => candidate.value === best);

  return winners.length === 1 ? winners[0] : null;
}

function collect(
  entries: ResolvedVariant[],
  read: (entry: ResolvedVariant) => number | null
): Candidate[] {
  return entries
    .map((entry) => ({ entry, value: read(entry) }))
    .filter((candidate): candidate is Candidate => candidate.value != null);
}

export function getRecommendations(entries: ResolvedVariant[]): Recommendation[] {
  if (entries.length < MIN_CONFIRMED) return [];

  const recommendations: Recommendation[] = [];

  const push = (
    id: string,
    label: string,
    candidate: Candidate | null,
    reason: (candidate: Candidate) => string
  ) => {
    if (!candidate) return;
    recommendations.push({
      id,
      label,
      reason: reason(candidate),
      slug: candidate.entry.product.slug,
      productName: candidate.entry.product.name,
    });
  };

  // Performance — highest top speed.
  push(
    "performance",
    "Best for performance",
    pickWinner(
      collect(entries, (entry) => entry.specs.topSpeedKmph),
      "higher"
    ),
    (candidate) => `Highest top speed at ${formatSpec(candidate.value, "km/h")}`
  );

  // Daily commute — longest claimed range.
  push(
    "commute",
    "Best for daily commute",
    pickWinner(
      collect(entries, (entry) => entry.specs.range.claimedKm),
      "higher"
    ),
    (candidate) => `Longest claimed range at ${formatSpec(candidate.value, "km")}`
  );

  // Value — lowest cost per claimed kilometre of range. Needs both figures, so
  // a cheap model with no published range does not win by default.
  push(
    "value",
    "Best value",
    pickWinner(
      collect(entries, (entry) => {
        const price = entry.variant.price;
        const range = entry.specs.range.claimedKm;
        return price != null && range != null && range > 0 ? price / range : null;
      }),
      "lower"
    ),
    (candidate) => `Lowest price per km of claimed range (₹${Math.round(candidate.value)} per km)`
  );

  // Entry level — cheapest model in the entry category. Only meaningful when at
  // least two entry-level models are being compared.
  const entryLevel = entries.filter((entry) => entry.product.category === "entry");
  push(
    "entry",
    "Best entry-level EV",
    pickWinner(
      collect(entryLevel, (entry) => entry.variant.price),
      "lower"
    ),
    (candidate) => `Lowest ex-showroom price at ${formatPrice(candidate.value)}`
  );

  // Practicality — largest under-seat storage.
  push(
    "storage",
    "Best for storage",
    pickWinner(
      collect(entries, (entry) => entry.specs.bootSpaceLitres),
      "higher"
    ),
    (candidate) => `Largest under-seat storage at ${formatSpec(candidate.value, "L")}`
  );

  return recommendations;
}
