/** Every kind of enquiry the site can capture. */
export type LeadType = "test-ride" | "price-enquiry" | "contact";

export type LeadStatus = "new" | "contacted" | "closed";

/** The payload a form sends. Validated by `src/schemas/lead.ts` on both sides. */
export interface LeadInput {
  type: LeadType;
  name: string;
  /** Normalised to 10 digits before it reaches the service. */
  mobile: string;
  email?: string;
  city?: string;
  pincode?: string;
  /** Product slug. */
  model?: string;
  /** Variant id within the model. */
  variant?: string;
  /** ISO date, YYYY-MM-DD. */
  preferredDate?: string;
  /** 24h HH:MM. */
  preferredTime?: string;
  message?: string;
  /** Which showroom the enquiry is for. Defaults to the primary branch. */
  branchId?: string;
  /** Where the lead came from, e.g. "/electric-scooters/nduro". */
  source?: string;
}

/** A stored lead. */
export interface Lead extends LeadInput {
  id: string;
  /** Short human-quotable reference shown to the customer. */
  reference: string;
  status: LeadStatus;
  createdAt: string;
}

export interface LeadResult {
  id: string;
  reference: string;
}
