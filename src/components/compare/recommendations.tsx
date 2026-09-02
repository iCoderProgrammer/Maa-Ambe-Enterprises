import Link from "next/link";
import { Award } from "lucide-react";

import { PendingData } from "@/components/common/pending-data";
import type { Recommendation } from "@/lib/recommendations";

/**
 * "Best for" summary.
 *
 * Renders only what the confirmed data supports. When nothing qualifies, the
 * component says so plainly instead of inventing a recommendation.
 */
export function Recommendations({
  recommendations,
  modelCount,
}: {
  recommendations: Recommendation[];
  modelCount: number;
}) {
  if (recommendations.length === 0) {
    return (
      <PendingData>
        {modelCount < 2
          ? "Add a second model to see which one leads on range, performance and value."
          : "We will highlight a best-for recommendation as soon as we have confirmed specifications for these models. We will not guess at one."}
      </PendingData>
    );
  }

  return (
    <ul className="grid list-none gap-px overflow-hidden rounded-2xl bg-hairline sm:grid-cols-2 lg:grid-cols-3">
      {recommendations.map((item) => (
        <li key={item.id} className="bg-background flex flex-col gap-3 p-6">
          <span
            aria-hidden
            className="bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-400 inline-flex size-9 items-center justify-center rounded-lg"
          >
            <Award className="size-4.5" />
          </span>
          <div>
            <p className="text-eyebrow text-muted-foreground uppercase">{item.label}</p>
            <p className="font-display mt-2 text-base font-semibold">
              <Link
                href={`/electric-scooters/${item.slug}`}
                className="hover:text-brand-700 dark:hover:text-brand-400 rounded-sm transition-colors"
              >
                {item.productName}
              </Link>
            </p>
            <p className="text-muted-foreground mt-1.5 text-sm text-pretty">
              {item.reason}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
