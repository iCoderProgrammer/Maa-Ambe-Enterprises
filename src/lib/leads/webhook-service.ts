import type { LeadInput, LeadResult } from "@/types/lead";
import { createReference, type LeadService } from "@/lib/leads/lead-service";

/**
 * Delivers a lead to an HTTP endpoint — a CRM intake URL, a Zapier/Make hook,
 * a Google Apps Script, an email relay. Anything that will accept a JSON POST.
 *
 * This exists because the mock service cannot be the production destination:
 * serverless filesystems are read-only, so it falls back to per-instance memory
 * and every lead disappears when the instance recycles — while the customer is
 * shown a reference number. A lead is somebody who wants to buy a scooter, and
 * losing one quietly is the worst failure this site can have.
 *
 * Two rules follow from that:
 *
 *   - A delivery failure THROWS. The route then answers 500 and tells the
 *     customer to call the showroom, which is true and actionable. It never
 *     reports success for a lead nobody received.
 *   - The request is time-boxed, so a hanging endpoint cannot hold the function
 *     open until the platform kills it.
 *
 * The URL and token are server-only (no `NEXT_PUBLIC_` prefix) and this module
 * is imported only by the API route, so neither ever reaches the browser.
 */

/** Beyond this, the endpoint is treated as down. */
const TIMEOUT_MS = 8_000;

export class WebhookLeadService implements LeadService {
  constructor(
    private readonly url: string,
    private readonly token?: string
  ) {}

  async create(input: LeadInput): Promise<LeadResult> {
    // The reference is generated here rather than taken from the response, so a
    // downstream system that answers with an empty body still leaves the
    // customer with something to quote over the phone.
    const reference = createReference();
    const receivedAt = new Date().toISOString();

    const response = await fetch(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
      body: JSON.stringify({ ...input, reference, receivedAt }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });

    if (!response.ok) {
      // The body may hold the endpoint's own error; keep it short and off the
      // wire to the customer — the route logs this and answers generically.
      const detail = await response.text().catch(() => "");
      throw new Error(
        `Lead webhook responded ${response.status}${detail ? `: ${detail.slice(0, 200)}` : ""}`
      );
    }

    return { id: reference, reference };
  }
}
