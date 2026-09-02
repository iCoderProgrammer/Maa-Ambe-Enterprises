import { PendingData } from "@/components/common/pending-data";
import type { FeatureDefinition } from "@/data/feature-catalog";

/**
 * Renders the features a model actually declares.
 *
 * The list is already filtered by `getProductFeatures`, which resolves only the
 * ids present on the product — a feature the model does not claim can never
 * appear here. An empty list renders an honest pending state rather than being
 * padded out.
 */
export function FeatureGrid({
  features,
  emptyMessage,
  columns = 3,
}: {
  features: FeatureDefinition[];
  emptyMessage: string;
  columns?: 2 | 3;
}) {
  if (features.length === 0) {
    return <PendingData>{emptyMessage}</PendingData>;
  }

  return (
    <ul
      className={
        columns === 2
          ? "grid list-none gap-px overflow-hidden rounded-2xl bg-hairline sm:grid-cols-2"
          : "grid list-none gap-px overflow-hidden rounded-2xl bg-hairline sm:grid-cols-2 lg:grid-cols-3"
      }
    >
      {features.map((feature) => (
        <li key={feature.id} className="bg-background flex flex-col gap-3.5 p-6 lg:p-7">
          <feature.icon aria-hidden className="text-brand-600 dark:text-brand-400 size-5" />
          <div>
            <h3 className="font-display text-sm font-semibold">{feature.label}</h3>
            <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed text-pretty">
              {feature.description}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
