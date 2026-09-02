import Link from "next/link";
import { ArrowRight, Construction } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/common/section";

interface PagePlaceholderProps {
  eyebrow: string;
  title: string;
  description: string;
  /** What this page will contain once built. */
  upcoming: string[];
}

/**
 * Temporary page body for routes that are reachable from navigation but not yet
 * implemented. Keeps every nav link valid instead of shipping dead ends.
 * Each page replaces this with real content in its own phase.
 */
export function PagePlaceholder({
  eyebrow,
  title,
  description,
  upcoming,
}: PagePlaceholderProps) {
  return (
    <Section className="pt-16 lg:pt-24">
      <div className="max-w-2xl">
        <Badge variant="outline" className="gap-1.5">
          <Construction aria-hidden />
          {eyebrow}
        </Badge>
        <h1 className="text-display-xl mt-6">{title}</h1>
        <p className="text-muted-foreground mt-5 text-lead text-pretty">{description}</p>

        <h2 className="text-eyebrow text-muted-foreground mt-12 uppercase">
          Coming to this page
        </h2>
        <ul className="mt-5 space-y-2.5">
          {upcoming.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm">
              <span
                aria-hidden
                className="bg-brand-500 mt-2 size-1.5 shrink-0 rounded-full"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-11 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="brand" size="lg">
            <Link href="/book-test-ride">
              Book a Test Ride
              <ArrowRight aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">Talk to the showroom</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
