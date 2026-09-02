import type { LeadService } from "@/lib/leads/lead-service";
import { MockLeadService } from "@/lib/leads/mock-service";
import { WebhookLeadService } from "@/lib/leads/webhook-service";

let instance: LeadService | null = null;

/**
 * Resolves the lead destination.
 *
 * Set `LEADS_WEBHOOK_URL` and leads are POSTed to it — a CRM intake endpoint,
 * an automation hook, an email relay. Leave it unset and leads go to the
 * development mock, which writes to a gitignored file and falls back to memory.
 *
 * That fallback is fine locally and wrong in production: a serverless
 * filesystem is read-only, so the mock keeps leads in per-instance memory and
 * they vanish when the instance recycles — while the customer is shown a
 * reference number. Hence the warning below: a production deployment with no
 * webhook configured is a misconfiguration, and it says so on every cold start.
 *
 * Credentials stay server-side. Neither variable carries `NEXT_PUBLIC_`, and
 * nothing in this module is imported by client code.
 */
export function getLeadService(): LeadService {
  if (!instance) {
    const url = process.env.LEADS_WEBHOOK_URL;

    if (url) {
      instance = new WebhookLeadService(url, process.env.LEADS_WEBHOOK_TOKEN);
    } else {
      if (process.env.NODE_ENV === "production") {
        console.warn(
          "[leads] LEADS_WEBHOOK_URL is not set — falling back to the development " +
            "mock. On serverless hosting this keeps leads in per-instance memory " +
            "and LOSES them. Configure a lead destination before taking enquiries."
        );
      }
      instance = new MockLeadService();
    }
  }

  return instance;
}

export type { LeadService } from "@/lib/leads/lead-service";
