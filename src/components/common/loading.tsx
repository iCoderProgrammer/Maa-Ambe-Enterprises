import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/common/container";
import { cn } from "@/lib/utils";

/** Generic block placeholder used while a route segment streams in. */
export function SectionSkeleton({
  rows = 3,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)} aria-hidden>
      <Skeleton className="h-3 w-24 rounded-full" />
      <Skeleton className="h-9 w-2/3 max-w-md" />
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-4 w-full max-w-2xl" />
      ))}
    </div>
  );
}

/** Card-grid placeholder that matches the product lineup layout. */
export function CardGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      aria-hidden
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="border-hairline space-y-4 rounded-2xl border p-5">
          <Skeleton className="aspect-4/3 w-full rounded-xl" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-10 flex-1 rounded-lg" />
            <Skeleton className="h-10 flex-1 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Full-page loading state. Announced politely so screen-reader users know the
 * page is still working rather than empty.
 */
export function PageLoading({ label = "Loading" }: { label?: string }) {
  return (
    <div className="section-y" role="status" aria-live="polite">
      <span className="sr-only">{label}…</span>
      <Container className="space-y-12">
        <SectionSkeleton />
        <CardGridSkeleton />
      </Container>
    </div>
  );
}
