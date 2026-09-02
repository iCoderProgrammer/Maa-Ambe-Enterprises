import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Container } from "@/components/common/container";

export interface Crumb {
  label: string;
  /** Omitted on the current page, which is not a link. */
  href?: string;
}

/** Visible breadcrumb trail. The matching BreadcrumbList schema is emitted by the page. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="border-hairline border-b">
      <Container>
        <ol className="text-muted-foreground flex flex-wrap items-center gap-1 py-3.5 text-xs">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={item.label} className="flex items-center gap-1">
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="hover:text-foreground rounded-sm px-0.5 transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-foreground px-0.5" aria-current="page">
                    {item.label}
                  </span>
                )}
                {!isLast ? (
                  <ChevronRight aria-hidden className="size-3.5 shrink-0 opacity-60" />
                ) : null}
              </li>
            );
          })}
        </ol>
      </Container>
    </nav>
  );
}
