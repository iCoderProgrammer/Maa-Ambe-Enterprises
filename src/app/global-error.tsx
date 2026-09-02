"use client";

import * as React from "react";

/**
 * Last-resort boundary: catches an error thrown by the root layout itself,
 * where `app/error.tsx` cannot help because the layout that renders it is the
 * thing that failed.
 *
 * It therefore replaces the whole document and must supply its own `<html>` and
 * `<body>`. Nothing here imports a component, a font or the design tokens —
 * every one of those comes through the layout that just failed — so the styles
 * are inline and the markup is plain. The customer still gets the showroom's
 * name and a way back.
 */
export default function GlobalError({
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
    <html lang="en-IN">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem",
          backgroundColor: "#ffffff",
          color: "#0b0f14",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <main style={{ maxWidth: "32rem", textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#0f7a4a",
            }}
          >
            Something went wrong
          </p>
          <h1 style={{ margin: "0.75rem 0 0", fontSize: "1.75rem", lineHeight: 1.15 }}>
            We hit an unexpected error
          </h1>
          <p style={{ margin: "1rem 0 0", lineHeight: 1.6, color: "#4a5560" }}>
            Please try again. If the problem continues, call the showroom and we will
            help you directly.
          </p>
          {error.digest ? (
            <p
              style={{
                margin: "1rem 0 0",
                fontFamily: "ui-monospace, monospace",
                fontSize: "0.75rem",
                color: "#4a5560",
              }}
            >
              Reference: {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "2rem",
              cursor: "pointer",
              borderRadius: "0.625rem",
              border: "none",
              backgroundColor: "#0b0f14",
              color: "#ffffff",
              padding: "0.75rem 1.5rem",
              fontSize: "0.9375rem",
              fontWeight: 500,
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
