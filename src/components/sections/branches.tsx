import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { Stagger, StaggerItem } from "@/components/common/motion";
import { BranchCard } from "@/components/branches/branch-card";
import { getBranches } from "@/lib/branches";
import { DEALERSHIP_NAME } from "@/lib/brand";

/**
 * "Our Showrooms" — every branch, as cards.
 *
 * Scales with the branch list rather than with a hard-coded column count: one
 * showroom gets a single readable card instead of a lonely third of a row,
 * two share the width, three or more fall into a grid. On narrow screens the
 * cards stack, which reads better than a horizontal rail when each card
 * carries an address, hours and five actions.
 */
export function Branches() {
  const branches = getBranches();

  if (branches.length === 0) return null;

  const columns =
    branches.length === 1
      ? "sm:max-w-xl"
      : branches.length === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <Section id="showrooms" tone="muted">
      <SectionHeading
        eyebrow="Our showrooms"
        title={`Visit ${DEALERSHIP_NAME}`}
        description={
          branches.length > 1
            ? `Every ${DEALERSHIP_NAME} showroom is an authorized Lectrix EV dealership: the same range, the same warranty, the same after-sales support. Pick whichever is closest.`
            : `An authorized Lectrix EV dealership — the range on the floor, test rides on demand, and finance, registration and servicing handled in one place.`
        }
        action={
          <Button asChild variant="outline" size="lg">
            <Link href="/showroom">
              Showroom details
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        }
      />

      <Stagger
        as="ul"
        className={`mt-12 grid list-none gap-6 ${columns}`}
        stagger={0.07}
      >
        {branches.map((branch) => (
          <StaggerItem as="li" key={branch.branchId} className="flex">
            <BranchCard branch={branch} className="w-full" />
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
