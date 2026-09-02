import { describe, expect, it } from "vitest";

import { normalizeIndianMobile } from "@/schemas/lead";

/**
 * A number that fails to normalise is a lead nobody can call back, and one that
 * normalises when it should not is a lead that bounces. Both are silent, so the
 * accepted and rejected shapes are pinned here explicitly.
 */
describe("normalizeIndianMobile", () => {
  it("passes a plain ten-digit number through", () => {
    expect(normalizeIndianMobile("9876543210")).toBe("9876543210");
  });

  it("accepts every ordinary way of typing the country code", () => {
    for (const input of [
      "+91 98765 43210",
      "+919876543210",
      "(+91) 9876543210",
      "91-9876543210",
      "0091 9876543210",
      // Trunk zero and country code together, as a call log saves it.
      "0919876543210",
    ]) {
      expect(normalizeIndianMobile(input), input).toBe("9876543210");
    }
  });

  it("strips a trunk prefix", () => {
    expect(normalizeIndianMobile("09876543210")).toBe("9876543210");
    expect(normalizeIndianMobile("091-9876543210")).toBe("9876543210");
  });

  it("ignores spacing and punctuation", () => {
    expect(normalizeIndianMobile("  98765-43210  ")).toBe("9876543210");
    expect(normalizeIndianMobile("98765.43210")).toBe("9876543210");
    expect(normalizeIndianMobile("9 8 7 6 5 4 3 2 1 0")).toBe("9876543210");
  });

  it("accepts every valid leading digit and rejects the rest", () => {
    for (const lead of ["6", "7", "8", "9"]) {
      expect(normalizeIndianMobile(`${lead}876543210`), lead).toBe(`${lead}876543210`);
    }
    for (const lead of ["0", "1", "2", "3", "4", "5"]) {
      expect(normalizeIndianMobile(`${lead}876543210`), lead).toBeNull();
    }
  });

  it("rejects the wrong number of digits", () => {
    expect(normalizeIndianMobile("987654321")).toBeNull();
    expect(normalizeIndianMobile("98765432101")).toBeNull();
    // Stripping prefixes must not rescue a number that is too long anyway.
    expect(normalizeIndianMobile("9198765432101")).toBeNull();
    expect(normalizeIndianMobile("+91 98765 432100")).toBeNull();
  });

  it("rejects input with no usable number in it", () => {
    expect(normalizeIndianMobile("")).toBeNull();
    expect(normalizeIndianMobile("   ")).toBeNull();
    expect(normalizeIndianMobile("call the showroom")).toBeNull();
    expect(normalizeIndianMobile("+91")).toBeNull();
  });

  it("keeps a ten-digit number that merely starts with 91", () => {
    // Only a twelve-digit number has "91" stripped as a country code — this is
    // a real subscriber number, not a prefixed one.
    expect(normalizeIndianMobile("9198765432")).toBe("9198765432");
  });

  it("normalises a number that is already normalised to itself", () => {
    const once = normalizeIndianMobile("+91 98765 43210");
    expect(normalizeIndianMobile(once!)).toBe(once);
  });
});
