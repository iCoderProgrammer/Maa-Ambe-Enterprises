import { describe, expect, it } from "vitest";

import { dealership, type DealershipConfig } from "@/data/dealership";
import { getSlotsForDate, isClosedOn, isFullyBookedOut, weekdayFor } from "@/lib/booking-slots";

/**
 * Slots are tested against a fixture rather than the live dealership config, so
 * changing the showroom's real opening hours never breaks the suite — only a
 * change to the slot rules themselves should.
 *
 * The fixture keeps Sunday closed and gives Saturday shorter hours, because
 * "closed" and "open but different" are the two cases the generator has to keep
 * apart. Every other field is inherited so the fixture stays valid as the
 * config type grows.
 */
const config: DealershipConfig = {
  ...dealership,
  openingHours: [
    { day: "Monday", opens: "09:30", closes: "19:30" },
    { day: "Tuesday", opens: "09:30", closes: "19:30" },
    { day: "Wednesday", opens: "09:30", closes: "19:30" },
    { day: "Thursday", opens: "09:30", closes: "19:30" },
    { day: "Friday", opens: "09:30", closes: "19:30" },
    { day: "Saturday", opens: "10:00", closes: "14:00" },
    { day: "Sunday", opens: null, closes: null },
  ],
};

/** All ten weekday slots: 09:30 open, 19:30 close, an hour set aside per ride. */
const FULL_WEEKDAY_GRID = [
  "09:30", "10:30", "11:30", "12:30", "13:30",
  "14:30", "15:30", "16:30", "17:30", "18:30",
];

const WEDNESDAY = "2026-09-02";
const SATURDAY = "2026-09-05";
const SUNDAY = "2026-09-06";

/** A Wednesday, well before the showroom opens, so nothing is filtered. */
const BEFORE_OPENING = new Date("2026-09-02T00:00:00Z"); // 05:30 IST
const values = (slots: { value: string }[]) => slots.map((slot) => slot.value);

describe("weekdayFor", () => {
  it("names the weekday of an ISO date", () => {
    expect(weekdayFor("2026-09-02")).toBe("Wednesday");
    expect(weekdayFor("2026-09-06")).toBe("Sunday");
  });

  it("does not slip a day across month or year boundaries", () => {
    expect(weekdayFor("2026-03-01")).toBe("Sunday");
    expect(weekdayFor("2027-01-01")).toBe("Friday");
  });
});

describe("isClosedOn", () => {
  it("is true only when the showroom has no hours that day", () => {
    expect(isClosedOn(SUNDAY, config)).toBe(true);
    expect(isClosedOn(WEDNESDAY, config)).toBe(false);
    expect(isClosedOn(SATURDAY, config)).toBe(false);
  });
});

describe("getSlotsForDate", () => {
  it("offers the full day on a future date", () => {
    const slots = getSlotsForDate(WEDNESDAY, config, { now: BEFORE_OPENING });
    expect(values(slots)).toEqual(FULL_WEEKDAY_GRID);
  });

  it("offers nothing on a day the showroom is shut", () => {
    expect(getSlotsForDate(SUNDAY, config, { now: BEFORE_OPENING })).toEqual([]);
  });

  it("offers nothing without a date", () => {
    expect(getSlotsForDate("", config, { now: BEFORE_OPENING })).toEqual([]);
  });

  it("follows that day's own hours", () => {
    // Saturday opens later and closes early, so it gets its own shorter grid.
    const slots = getSlotsForDate(SATURDAY, config, { now: BEFORE_OPENING });
    expect(values(slots)).toEqual(["10:00", "11:00", "12:00", "13:00"]);
  });

  it("ends early enough that the last ride finishes before closing", () => {
    const long = getSlotsForDate(WEDNESDAY, config, {
      now: BEFORE_OPENING,
      rideMinutes: 120,
    });
    // Two hours per ride pulls the last start back from 18:30 to 17:30.
    expect(values(long).at(-1)).toBe("17:30");
  });

  it("honours a different slot interval", () => {
    const slots = getSlotsForDate(SATURDAY, config, {
      now: BEFORE_OPENING,
      intervalMinutes: 30,
    });
    expect(values(slots)).toEqual([
      "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00",
    ]);
  });

  it("labels slots the way a customer reads a clock", () => {
    const slots = getSlotsForDate(WEDNESDAY, config, { now: BEFORE_OPENING });
    const label = (value: string) => slots.find((slot) => slot.value === value)?.label;

    expect(label("09:30")).toBe("9:30 AM");
    // Noon is 12 PM, not 0 PM.
    expect(label("12:30")).toBe("12:30 PM");
    expect(label("18:30")).toBe("6:30 PM");
  });

  describe("on today", () => {
    it("drops slots that have already passed", () => {
      // 18:00 IST — only the 18:30 slot is still ahead.
      const slots = getSlotsForDate(WEDNESDAY, config, {
        now: new Date("2026-09-02T12:30:00Z"),
      });
      expect(values(slots)).toEqual(["18:30"]);
    });

    it("offers nothing once the last slot has gone", () => {
      // 22:30 IST — the showroom shut hours ago.
      const slots = getSlotsForDate(WEDNESDAY, config, {
        now: new Date("2026-09-02T17:00:00Z"),
      });
      expect(slots).toEqual([]);
    });

    it("keeps a slot that is exactly the lead time away, and drops it a minute later", () => {
      const atCutoff = getSlotsForDate(WEDNESDAY, config, {
        now: new Date("2026-09-02T04:30:00Z"), // 10:00 IST, so 10:30 is exactly 30m off
      });
      expect(values(atCutoff)[0]).toBe("10:30");

      const justAfter = getSlotsForDate(WEDNESDAY, config, {
        now: new Date("2026-09-02T04:31:00Z"), // 10:01 IST
      });
      expect(values(justAfter)[0]).toBe("11:30");
    });

    it("can be asked for no lead time at all", () => {
      const slots = getSlotsForDate(WEDNESDAY, config, {
        now: new Date("2026-09-02T05:00:00Z"), // exactly 10:30 IST
        minLeadMinutes: 0,
      });
      expect(values(slots)[0]).toBe("10:30");
    });

    it("returns the whole grid when asked to include what has passed", () => {
      const slots = getSlotsForDate(WEDNESDAY, config, {
        now: new Date("2026-09-02T17:00:00Z"), // 22:30 IST — everything is past
        includePast: true,
      });
      expect(values(slots)).toEqual(FULL_WEEKDAY_GRID);
    });

    it("never filters a future date, however late it is today", () => {
      const slots = getSlotsForDate("2026-09-09", config, {
        now: new Date("2026-09-02T17:00:00Z"), // 22:30 IST
      });
      expect(values(slots)).toEqual(FULL_WEEKDAY_GRID);
    });
  });

  describe("reads the clock in the showroom's timezone", () => {
    it("treats 01:30 IST as early today, not as yesterday", () => {
      // 20:00 UTC on the 1st is 01:30 IST on the 2nd. Reading UTC would make
      // the 2nd a future date and skip filtering by luck rather than by rule —
      // here it is genuinely today, and nothing has passed yet.
      const slots = getSlotsForDate(WEDNESDAY, config, {
        now: new Date("2026-09-01T20:00:00Z"),
      });
      expect(values(slots)).toEqual(FULL_WEEKDAY_GRID);
    });

    it("has already rolled over to tomorrow at 00:30 IST", () => {
      // 19:00 UTC on the 2nd is 00:30 IST on the 3rd, so the 3rd is today and
      // its whole day is still ahead.
      const slots = getSlotsForDate("2026-09-03", config, {
        now: new Date("2026-09-02T19:00:00Z"),
      });
      expect(values(slots)).toEqual(FULL_WEEKDAY_GRID);
    });

    it("leaves a past date to the schema to reject", () => {
      // Filtering only applies to today. A date already gone is not this
      // function's problem — `dateSchema` refuses it before it gets here.
      const slots = getSlotsForDate("2026-09-01", config, {
        now: new Date("2026-09-02T12:30:00Z"),
      });
      expect(values(slots)).toEqual(FULL_WEEKDAY_GRID);
    });
  });
});

describe("isFullyBookedOut", () => {
  it("is true when the showroom is open today but out of slots", () => {
    expect(
      isFullyBookedOut(WEDNESDAY, config, { now: new Date("2026-09-02T17:00:00Z") })
    ).toBe(true);
  });

  it("is false while slots remain", () => {
    expect(
      isFullyBookedOut(WEDNESDAY, config, { now: new Date("2026-09-02T12:30:00Z") })
    ).toBe(false);
  });

  it("is false on a closed day — that is a different thing to tell the customer", () => {
    expect(isFullyBookedOut(SUNDAY, config, { now: BEFORE_OPENING })).toBe(false);
  });

  it("is false for a future date", () => {
    expect(
      isFullyBookedOut("2026-09-09", config, { now: new Date("2026-09-02T17:00:00Z") })
    ).toBe(false);
  });
});
