import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="section-y">
      <Container className="max-w-xl text-center">
        <p className="text-eyebrow text-brand-700 dark:text-brand-400 uppercase">
          Error 404
        </p>
        <h1 className="text-display-lg mt-4">This page took a different route</h1>
        <p className="text-muted-foreground mt-4 text-lead text-pretty">
          The page you are looking for has moved or no longer exists. Head back to the
          lineup and pick up where you left off.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/electric-scooters">Explore scooters</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
