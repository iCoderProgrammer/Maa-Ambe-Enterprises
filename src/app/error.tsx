"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";

/**
 * Route-level error boundary. Never renders the raw error message — it may
 * contain server details — but keeps the digest visible for support requests.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="section-y">
      <Container className="max-w-xl text-center">
        <p className="text-eyebrow text-brand-700 dark:text-brand-400 uppercase">
          Something went wrong
        </p>
        <h1 className="text-display-lg mt-4">We hit an unexpected error</h1>
        <p className="text-muted-foreground mt-4 text-lead text-pretty">
          Please try again. If the problem continues, contact the showroom and we will
          help you directly.
        </p>
        {error.digest ? (
          <p className="text-muted-foreground mt-4 font-mono text-xs">
            Reference: {error.digest}
          </p>
        ) : null}
        <div className="mt-9 flex justify-center">
          <Button size="lg" onClick={reset}>
            <RotateCcw aria-hidden />
            Try again
          </Button>
        </div>
      </Container>
    </div>
  );
}
