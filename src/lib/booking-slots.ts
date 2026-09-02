import { dealership, type DealershipConfig } from "@/data/dealership";
import { SHOWROOM_TIMEZONE, showroomToday } from "@/schemas/lead";

/**
 * Test-ride slots, derived from the showroom's own opening hours.
 *
 * The dealership config is the single source of truth for when the showroom is
 * open, so slots are generated from it rather than hard-coded — change the
 * hours and the booking form follows. A day the showroom is closed offers no
 * slots at all rather than letting someone book a visit to a locked door.
 *
 * Slots that have already passed are dropped for the same reason: an afternoon
 * visitor should not be offered this morning. `now` is injectable so that rule
 * can be tested without waiting for the clock.
 */

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export interface Slot {
  /** 24h "HH:MM" — what gets submitted. */
  value: string;
  /** "10:30 AM" — what the customer reads. */
  label: string;
}

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function toLabel(minutes: number): string {
  const hours24 = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const suffix = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${String(mins).padStart(2, "0")} ${suffix}`;
}

/**
 * Minutes since midnight right now, in the showroom's timezone.
 *
 * Read through `formatToParts` rather than a formatted string so no locale or
 * ICU version can hand back "24:00" for midnight.
 */
function showroomNowMinutes(now: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: SHOWROOM_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const value = (type: "hour" | "minute") =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);

  return value("hour") * 60 + value("minute");
}

/** Weekday name for an ISO date, read in the showroom's timezone. */
export function weekdayFor(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  // Midday UTC keeps the date stable across timezone offsets.
  const date = new Date(Date.UTC(year, month - 1, day, 12));
  return WEEKDAYS[date.getUTCDay()];
}

export interface SlotOptions {
  /** Gap between slot start times, minutes. */
  intervalMinutes?: number;
  /** How long a ride takes, so the last slot still finishes before closing. */
  rideMinutes?: number;
  /**
   * How far ahead the earliest slot must be, minutes. The showroom needs a
   * little notice to get a scooter ready, and a slot starting in three minutes
   * is not a booking anyone can keep.
   */
  minLeadMinutes?: number;
  /** Clock to read "now" from. Injectable for tests. */
  now?: Date;
  /**
   * Keep slots that have already passed today. Only for telling a customer
   * *why* their chosen slot was rejected — never for offering a booking.
   */
  includePast?: boolean;
}

/**
 * Slots available on a given date, at hourly intervals, ending far enough
 * before closing that a ride can finish before the showroom shuts.
 *
 * On today's date, slots that have passed — or are too close to now to honour —
 * are dropped, so the list only ever contains bookings the showroom can keep.
 */
export function getSlotsForDate(
  isoDate: string,
  config: DealershipConfig = dealership,
  {
    intervalMinutes = 60,
    rideMinutes = 60,
    minLeadMinutes = 30,
    now = new Date(),
    includePast = false,
  }: SlotOptions = {}
): Slot[] {
  if (!isoDate) return [];

  const weekday = weekdayFor(isoDate);
  const hours = config.openingHours.find((entry) => entry.day === weekday);

  if (!hours?.opens || !hours.closes) return [];

  const opens = toMinutes(hours.opens);
  const lastStart = toMinutes(hours.closes) - rideMinutes;

  // Only today is constrained by the clock. A future date offers its full day,
  // and a past date is already rejected by the schema before it gets here.
  const earliest =
    includePast || isoDate !== showroomToday(now)
      ? opens
      : Math.max(opens, showroomNowMinutes(now) + minLeadMinutes);

  const slots: Slot[] = [];

  for (let minutes = opens; minutes <= lastStart; minutes += intervalMinutes) {
    if (minutes < earliest) continue;

    slots.push({
      value: `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(
        minutes % 60
      ).padStart(2, "0")}`,
      label: toLabel(minutes),
    });
  }

  return slots;
}

/** True when the date is today and the showroom's last bookable slot has gone. */
export function isFullyBookedOut(
  isoDate: string,
  config: DealershipConfig = dealership,
  options: SlotOptions = {}
): boolean {
  if (!isoDate || isClosedOn(isoDate, config)) return false;
  return getSlotsForDate(isoDate, config, options).length === 0;
}

/** True when the showroom is shut on that date. */
export function isClosedOn(isoDate: string, config: DealershipConfig = dealership) {
  const hours = config.openingHours.find((entry) => entry.day === weekdayFor(isoDate));
  return !hours?.opens || !hours.closes;
}
