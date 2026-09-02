import { NextResponse } from "next/server";

import { leadRequestSchema, normalizeIndianMobile, HONEYPOT_FIELD } from "@/schemas/lead";
import { getLeadService } from "@/lib/leads";
import { checkLimit, clientKey, consumeLimit } from "@/lib/rate-limit";
import { getProductBySlug } from "@/lib/products";
import { resolveBranch } from "@/lib/branches";
import { getSlotsForDate, isClosedOn } from "@/lib/booking-slots";
import { dealership } from "@/data/dealership";
import type { LeadInput } from "@/types/lead";

/** Needs the Node runtime for the mock service's filesystem access. */
export const runtime = "nodejs";

const WINDOW_MS = 10 * 60 * 1000;

/** Stored leads per client per window. Only successful submissions count. */
const SUBMIT_LIMIT = { limit: 5, windowMs: WINDOW_MS };

/** Total requests per client per window, including rejected ones. */
const BURST_LIMIT = { limit: 40, windowMs: WINDOW_MS };

const MAX_BODY_BYTES = 8 * 1024;

/**
 * Lead capture.
 *
 * Everything the client sends is treated as hostile: the body is size-capped,
 * re-validated against the same Zod schema the form uses, the model slug is
 * checked against the real catalogue, and the mobile number is normalised
 * server-side rather than trusting the browser to have done it.
 *
 * Error responses stay generic. A validation failure returns field-level
 * messages because those are the customer's own input, but nothing else leaks
 * internal state.
 *
 * Two quotas apply: a generous burst limit on all requests to stop hammering,
 * and a strict limit on leads actually stored — consumed only on success, so
 * correcting a typo never counts against the customer.
 */
export async function POST(request: Request) {
  const client = clientKey(request.headers);

  const burst = consumeLimit(`leads:burst:${client}`, BURST_LIMIT);
  if (!burst.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(burst.retryAfter) } }
    );
  }

  const submissions = checkLimit(`leads:submit:${client}`, SUBMIT_LIMIT);
  if (!submissions.ok) {
    return NextResponse.json(
      {
        error:
          "You have sent several enquiries already. Please call the showroom so we can help you directly.",
      },
      { status: 429, headers: { "Retry-After": String(submissions.retryAfter) } }
    );
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request too large." }, { status: 413 });
  }

  let raw: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request too large." }, { status: 413 });
    }
    raw = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = leadRequestSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path.join(".");
      if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
    }

    return NextResponse.json(
      { error: "Please check the highlighted fields.", fieldErrors },
      { status: 422 }
    );
  }

  const data = parsed.data;

  // A filled honeypot means a bot. Answer as though it succeeded so the bot
  // learns nothing, but store nothing.
  if (data[HONEYPOT_FIELD]) {
    return NextResponse.json({ reference: "LX-000000" }, { status: 202 });
  }

  // Never trust a client-normalised phone number.
  const mobile = normalizeIndianMobile(data.mobile);
  if (!mobile) {
    return NextResponse.json(
      { error: "Please check the highlighted fields.", fieldErrors: { mobile: "Enter a valid 10-digit Indian mobile number" } },
      { status: 422 }
    );
  }

  // A model slug must name a real product, which the shared schema cannot check
  // because it also runs in the browser without the catalogue.
  if ("model" in data && data.model && !getProductBySlug(data.model)) {
    return NextResponse.json(
      { error: "Please check the highlighted fields.", fieldErrors: { model: "Select a model from the list" } },
      { status: 422 }
    );
  }

  // A test-ride slot must be one the showroom actually offers. The shared
  // schema only checks that the time is well-formed, because it also runs in
  // the browser and the opening hours are not a client-side concern — so
  // without this a crafted request could book 03:00, or a day the showroom is
  // shut, or a slot that passed this morning.
  if (data.type === "test-ride") {
    if (isClosedOn(data.preferredDate)) {
      return NextResponse.json(
        {
          error: "Please check the highlighted fields.",
          fieldErrors: { preferredDate: "The showroom is closed on that day" },
        },
        { status: 422 }
      );
    }

    const slots = getSlotsForDate(data.preferredDate);

    if (!slots.some((slot) => slot.value === data.preferredTime)) {
      // A slot that exists on the day's grid but is no longer offered has
      // simply passed — say so, rather than implying the customer picked
      // something invalid.
      const passed = getSlotsForDate(data.preferredDate, dealership, {
        includePast: true,
      }).some((slot) => slot.value === data.preferredTime);

      return NextResponse.json(
        {
          error: "Please check the highlighted fields.",
          fieldErrors: {
            preferredTime: passed
              ? "That slot has already passed. Please choose a later one."
              : "Choose a slot from the list",
          },
        },
        { status: 422 }
      );
    }
  }

  const lead: LeadInput = {
    type: data.type,
    name: data.name,
    mobile,
    email: data.email || undefined,
    city: "city" in data ? data.city || undefined : undefined,
    pincode: "pincode" in data ? data.pincode : undefined,
    model: "model" in data ? data.model : undefined,
    variant: "variant" in data ? data.variant || undefined : undefined,
    preferredDate: "preferredDate" in data ? data.preferredDate : undefined,
    preferredTime: "preferredTime" in data ? data.preferredTime : undefined,
    message: data.message || undefined,
    // An enquiry with no branch, or one naming a branch that has since been
    // removed, is still a real customer: route it to the primary showroom
    // rather than dropping the lead over a routing detail.
    branchId: resolveBranch(data.branchId).branchId,
    source: data.source || undefined,
  };

  try {
    const result = await getLeadService().create(lead);
    // Only a stored lead counts against the strict quota.
    consumeLimit(`leads:submit:${client}`, SUBMIT_LIMIT);
    return NextResponse.json({ reference: result.reference }, { status: 201 });
  } catch (error) {
    console.error("[leads] failed to store lead", error);
    return NextResponse.json(
      { error: "We could not save your enquiry. Please call the showroom instead." },
      { status: 500 }
    );
  }
}
