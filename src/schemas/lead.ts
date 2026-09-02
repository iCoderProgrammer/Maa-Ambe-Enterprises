import { z } from "zod";

import { isKnownBranch } from "@/data/branches";

/**
 * Lead validation, shared by the browser and the API route.
 *
 * The same schema runs in both places on purpose: client-side validation is a
 * convenience the user can bypass, so the server re-validates every field
 * before anything is stored. Nothing here trusts the client.
 */

/* -------------------------------------------------------------------------- */
/* Indian mobile numbers                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Reduces the many ways people type an Indian mobile number to ten digits.
 * Accepts "+91 98765 43210", "091-9876543210", "0091 9876543210",
 * "(+91) 9876543210" and so on.
 * Returns null when the input cannot be a valid Indian mobile number.
 */
export function normalizeIndianMobile(input: string): string | null {
  const digits = input.replace(/\D/g, "");

  // Prefixes stack: a number saved from a call log can carry the international
  // access code, the trunk zero and the country code all at once, so they are
  // peeled off in order rather than one-or-the-other.
  let local = digits.replace(/^0+/, "");

  // Only strip "91" when what remains is exactly a country code plus a
  // subscriber number — a bare ten-digit number starting 91 is somebody's
  // actual number, not a prefixed one.
  if (local.length === 12 && local.startsWith("91")) local = local.slice(2);

  // Indian mobile numbers are ten digits and begin 6, 7, 8 or 9.
  return /^[6-9]\d{9}$/.test(local) ? local : null;
}

const mobileSchema = z
  .string()
  .trim()
  .min(1, "Enter your mobile number")
  .refine((value) => normalizeIndianMobile(value) !== null, {
    message: "Enter a valid 10-digit Indian mobile number",
  });

/* -------------------------------------------------------------------------- */
/* Shared field schemas                                                        */
/* -------------------------------------------------------------------------- */

const nameSchema = z
  .string()
  .trim()
  .min(2, "Enter your name")
  .max(80, "Name is too long")
  .regex(/^[\p{L}\p{M}][\p{L}\p{M}\s.'-]*$/u, "Enter your name using letters only");

const emailSchema = z
  .string()
  .trim()
  .max(160, "Email address is too long")
  .email("Enter a valid email address")
  .optional()
  .or(z.literal(""));

const citySchema = z
  .string()
  .trim()
  .min(2, "Enter your city")
  .max(60, "City name is too long");

/** Indian PIN codes are six digits and never start with zero. */
const pincodeSchema = z
  .string()
  .trim()
  .regex(/^[1-9]\d{5}$/, "Enter a valid 6-digit PIN code");

const messageSchema = z
  .string()
  .trim()
  .max(1000, "Please keep your message under 1000 characters")
  .optional()
  .or(z.literal(""));

const slugSchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9-]+$/, "Select a model from the list");

/* -------------------------------------------------------------------------- */
/* Dates                                                                       */
/* -------------------------------------------------------------------------- */

/** How far ahead a test ride may be booked. */
export const MAX_BOOKING_DAYS = 45;

/**
 * Where the showroom actually is. Every date and time on the site is read in
 * this zone, never in the server's or the browser's, so a booking means the
 * same thing wherever it is made.
 */
export const SHOWROOM_TIMEZONE = "Asia/Kolkata";

/**
 * Today's date in the showroom's timezone, as YYYY-MM-DD.
 *
 * Compared as date-only strings rather than `Date` objects so a server running
 * in UTC and a rider in IST agree on what "today" means — otherwise a booking
 * made after 05:30 IST could be rejected as being in the past.
 */
export function showroomToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: SHOWROOM_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function addDays(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

const dateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date")
  .refine((value) => value >= showroomToday(), {
    message: "Choose today or a later date",
  })
  .refine((value) => value <= addDays(showroomToday(), MAX_BOOKING_DAYS), {
    message: `Choose a date within the next ${MAX_BOOKING_DAYS} days`,
  });

const timeSchema = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Choose a time slot");

/* -------------------------------------------------------------------------- */
/* Lead schemas                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Bot trap. A hidden field no human fills in.
 *
 * The schema deliberately ACCEPTS any value: rejecting it here would return a
 * validation error naming the field, telling a bot exactly which input to leave
 * blank next time. The API route detects a filled honeypot after validation and
 * answers as though the submission succeeded, storing nothing.
 */
export const HONEYPOT_FIELD = "company";

/**
 * The showroom the customer wants to deal with.
 *
 * Validated against the branch registry rather than as a free string, so a
 * tampered or stale id cannot route a lead to a branch that does not exist.
 * Optional at the schema level: the lead is still worth capturing if the field
 * is missing, and the API falls back to the primary branch rather than
 * rejecting a real customer over a routing detail.
 */
const branchSchema = z
  .string()
  .trim()
  .refine((value) => value === "" || isKnownBranch(value), {
    message: "Choose a showroom from the list",
  })
  .optional();

const baseFields = {
  name: nameSchema,
  mobile: mobileSchema,
  email: emailSchema,
  message: messageSchema,
  branchId: branchSchema,
  source: z.string().trim().max(200).optional(),
  [HONEYPOT_FIELD]: z.string().max(200).optional(),
};

export const testRideSchema = z.object({
  ...baseFields,
  city: citySchema,
  pincode: pincodeSchema,
  model: slugSchema,
  variant: z.string().trim().regex(/^[a-z0-9-]*$/).optional(),
  preferredDate: dateSchema,
  preferredTime: timeSchema,
});

export const priceEnquirySchema = z.object({
  ...baseFields,
  city: citySchema,
  pincode: pincodeSchema,
  model: slugSchema,
  variant: z.string().trim().regex(/^[a-z0-9-]*$/).optional(),
});

export const contactSchema = z.object({
  ...baseFields,
  city: citySchema.optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more so we can help")
    .max(1000, "Please keep your message under 1000 characters"),
});

export type TestRideValues = z.infer<typeof testRideSchema>;
export type PriceEnquiryValues = z.infer<typeof priceEnquirySchema>;
export type ContactValues = z.infer<typeof contactSchema>;

/** Discriminated payload accepted by POST /api/leads. */
export const leadRequestSchema = z.discriminatedUnion("type", [
  testRideSchema.extend({ type: z.literal("test-ride") }),
  priceEnquirySchema.extend({ type: z.literal("price-enquiry") }),
  contactSchema.extend({ type: z.literal("contact") }),
]);

export type LeadRequest = z.infer<typeof leadRequestSchema>;
