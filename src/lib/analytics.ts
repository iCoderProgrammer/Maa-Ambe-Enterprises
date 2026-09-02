/**
 * Analytics façade.
 *
 * Components call `track()` and never touch a vendor SDK, so swapping GA4 for
 * something else — or adding a second destination — is a change to this file
 * only. No provider script is bundled: if a tag manager has put `dataLayer` or
 * `gtag` on the page, events reach it; if not, they are quietly dropped.
 */

export type AnalyticsEvent =
  | { name: "lead_form_opened"; type: string; model?: string }
  | { name: "lead_form_submitted"; type: string; model?: string }
  | { name: "lead_form_failed"; type: string; reason: string }
  | { name: "whatsapp_clicked"; source: string }
  | { name: "call_clicked"; source: string }
  | { name: "test_ride_cta_clicked"; source: string; model?: string }
  | { name: "price_cta_clicked"; source: string; model?: string }
  | { name: "compare_shared"; models: string };

type DataLayerWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

/**
 * Records an event. Safe to call during render or from a server component's
 * children — it no-ops outside the browser and never throws, because analytics
 * must not be able to break a form submission.
 */
export function track(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;

  const { name, ...params } = event;

  try {
    const target = window as DataLayerWindow;

    if (typeof target.gtag === "function") {
      target.gtag("event", name, params);
    } else if (Array.isArray(target.dataLayer)) {
      target.dataLayer.push({ event: name, ...params });
    } else if (process.env.NODE_ENV !== "production") {
      console.info("[analytics]", name, params);
    }
  } catch {
    // Never let a tracking failure surface to the customer.
  }
}
