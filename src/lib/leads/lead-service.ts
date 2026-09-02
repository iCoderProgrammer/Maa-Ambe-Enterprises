import type { Lead, LeadInput, LeadResult } from "@/types/lead";

/**
 * The seam between the site and wherever leads actually go.
 *
 * Every form and the API route talk to this interface only. Connecting a real
 * CRM later means writing one more implementation and changing the factory
 * below — no component, form or route changes.
 */
export interface LeadService {
  /** Persists a lead and returns its id and customer-facing reference. */
  create(input: LeadInput): Promise<LeadResult>;
  /** Optional: used by a future admin view. Mock only for now. */
  list?(): Promise<Lead[]>;
}

/** Unambiguous alphabet — no O/0, I/1, S/5. */
const REFERENCE_ALPHABET = "ABCDEFGHJKLMNPQRTUVWXYZ2346789";

/** Short, human-quotable reference a customer can read out over the phone. */
export function createReference(): string {
  let code = "";
  for (let index = 0; index < 6; index += 1) {
    code += REFERENCE_ALPHABET[Math.floor(Math.random() * REFERENCE_ALPHABET.length)];
  }
  return `LX-${code}`;
}
