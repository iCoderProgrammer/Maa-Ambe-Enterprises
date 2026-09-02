"use client";

import * as React from "react";
import type { UseFormSetError, FieldValues, Path } from "react-hook-form";

import { track } from "@/lib/analytics";
import type { LeadType } from "@/types/lead";

interface SubmitState {
  status: "idle" | "submitting" | "success" | "error";
  reference?: string;
  error?: string;
}

/**
 * Posts a validated form to `/api/leads` and turns the response into UI state.
 *
 * Server-side field errors are pushed back onto the form so the customer sees
 * them next to the input rather than as a generic banner — the server is the
 * authority on validity, and its verdict has to be visible where the mistake is.
 */
export function useLeadSubmit<T extends FieldValues>(type: LeadType) {
  const [state, setState] = React.useState<SubmitState>({ status: "idle" });

  const reset = React.useCallback(() => setState({ status: "idle" }), []);

  const submit = React.useCallback(
    async (values: T, setError: UseFormSetError<T>) => {
      setState({ status: "submitting" });

      try {
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            type,
            source: window.location.pathname + window.location.search,
          }),
        });

        const payload = (await response.json().catch(() => ({}))) as {
          reference?: string;
          error?: string;
          fieldErrors?: Record<string, string>;
        };

        if (!response.ok) {
          if (payload.fieldErrors) {
            for (const [field, message] of Object.entries(payload.fieldErrors)) {
              setError(field as Path<T>, { type: "server", message });
            }
          }

          track({ name: "lead_form_failed", type, reason: String(response.status) });
          setState({
            status: "error",
            error:
              payload.error ??
              "Something went wrong. Please try again, or call the showroom.",
          });
          return;
        }

        track({
          name: "lead_form_submitted",
          type,
          model: "model" in values ? String(values.model) : undefined,
        });
        setState({ status: "success", reference: payload.reference });
      } catch {
        track({ name: "lead_form_failed", type, reason: "network" });
        setState({
          status: "error",
          error:
            "We could not reach the server. Check your connection, or call the showroom.",
        });
      }
    },
    [type]
  );

  return { state, submit, reset };
}
