import { describe, expect, it } from "vitest";

import {
  branchDirectionsUrl,
  branchMapEmbedUrl,
  branchMapUrl,
  branches,
  branchTemplate,
  getBranches,
  getPrimaryBranch,
  hasBranchMapLocation,
  hasMultipleBranches,
  isKnownBranch,
  type Branch,
} from "@/data/branches";

/**
 * Every registered branch is still a placeholder, so these tests build their
 * own filled-in branches from `branchTemplate`. That is the point: the map
 * links are derived from a branch's own record, so filling one in is the whole
 * of "switching the feature on", and this file asserts exactly that.
 */
function filledBranch(overrides: Partial<Branch> = {}): Branch {
  return {
    ...branchTemplate,
    branchId: "filled",
    branchName: "Test Showroom",
    address: {
      line1: "12 Example Road",
      locality: "Example Locality",
      city: "Example City",
      state: "Example State",
      pincode: "123456",
      country: "India",
      countryCode: "IN",
    },
    // Nothing below is a placeholder any more.
    placeholders: [],
    ...overrides,
  };
}

describe("branch registry", () => {
  it("registers three showrooms", () => {
    expect(getBranches()).toHaveLength(3);
    expect(hasMultipleBranches()).toBe(true);
  });

  it("gives every branch a unique id and slug", () => {
    const ids = branches.map((branch) => branch.branchId);
    const slugs = branches.map((branch) => branch.slug);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(ids.every(isKnownBranch)).toBe(true);
  });

  it("has exactly one featured branch, and returns it as primary", () => {
    const featured = branches.filter((branch) => branch.featured);
    expect(featured).toHaveLength(1);
    expect(getPrimaryBranch().branchId).toBe(featured[0].branchId);
  });

  it("lists branches in display order", () => {
    const orders = getBranches().map((branch) => branch.displayOrder);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });
});

describe("google maps links", () => {
  it("prefers coordinates over the address", () => {
    const branch = filledBranch({ latitude: 19.076, longitude: 72.8777 });

    expect(branchMapUrl(branch)).toBe(
      "https://www.google.com/maps/search/?api=1&query=19.076%2C72.8777"
    );
    expect(branchDirectionsUrl(branch)).toBe(
      "https://www.google.com/maps/dir/?api=1&destination=19.076%2C72.8777"
    );
    expect(branchMapEmbedUrl(branch)).toBe(
      "https://www.google.com/maps?q=19.076%2C72.8777&output=embed"
    );
  });

  it("falls back to the postal address when there are no coordinates", () => {
    const branch = filledBranch({ placeholders: ["geo"] });
    const expected = encodeURIComponent(
      "Test Showroom, 12 Example Road, Example Locality, Example City, Example State 123456"
    );

    expect(branchMapUrl(branch)).toBe(
      `https://www.google.com/maps/search/?api=1&query=${expected}`
    );
    expect(branchDirectionsUrl(branch)).toBe(
      `https://www.google.com/maps/dir/?api=1&destination=${expected}`
    );
  });

  it("uses a branch's own place and embed links when it supplies them", () => {
    const branch = filledBranch({
      latitude: 19.076,
      longitude: 72.8777,
      mapUrl: "https://maps.app.goo.gl/example",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=example",
      directionsUrl: "https://maps.app.goo.gl/example-directions",
    });

    expect(branchMapUrl(branch)).toBe("https://maps.app.goo.gl/example");
    expect(branchMapEmbedUrl(branch)).toBe(
      "https://www.google.com/maps/embed?pb=example"
    );
    expect(branchDirectionsUrl(branch)).toBe(
      "https://maps.app.goo.gl/example-directions"
    );
  });

  it("points every branch at its own location, never a shared one", () => {
    const first = filledBranch({ branchId: "a", latitude: 19.076, longitude: 72.8777 });
    const second = filledBranch({ branchId: "b", latitude: 28.6139, longitude: 77.209 });

    expect(branchMapUrl(first)).not.toBe(branchMapUrl(second));
    expect(branchDirectionsUrl(first)).not.toBe(branchDirectionsUrl(second));
  });

  it("returns no link at all while a location is unconfirmed", () => {
    for (const branch of getBranches()) {
      expect(hasBranchMapLocation(branch)).toBe(false);
      expect(branchMapUrl(branch)).toBeNull();
      expect(branchDirectionsUrl(branch)).toBeNull();
      expect(branchMapEmbedUrl(branch)).toBeNull();
    }
  });
});
