import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { Stagger, StaggerItem } from "@/components/common/motion";
import { getAdvantages } from "@/data/dealership";
import { DEALERSHIP_NAME, VEHICLE_BRAND } from "@/lib/brand";

/**
 * Dealership trust section — the counterpart to "Why Lectrix EV".
 *
 * That section sells the vehicle brand; this one sells the showroom. Content
 * comes from `dealership.advantages`, so a claim can be withdrawn by flipping
 * `offered` in the config rather than editing markup, and nothing here can
 * promise a service the dealership has not confirmed.
 */
export function WhyDealership() {
  const advantages = getAdvantages();

  if (advantages.length === 0) return null;

  return (
    <Section id="why-dealership" tone="muted">
      <SectionHeading
        eyebrow={`Why buy from ${DEALERSHIP_NAME}`}
        title="The scooter is Lectrix. The service is ours."
        description={`${VEHICLE_BRAND} builds the scooter and backs the warranty. ${DEALERSHIP_NAME} is the authorized dealership that helps you choose the right model, complete the paperwork and keep it running afterwards.`}
        action={
          <Button asChild variant="outline" size="lg">
            <Link href="/showroom">
              Our showroom
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        }
      />

      <Stagger
        as="ul"
        className="mt-12 grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3"
        stagger={0.06}
      >
        {advantages.map((advantage) => (
          <StaggerItem
            as="li"
            key={advantage.id}
            className="border-hairline bg-background flex flex-col gap-3 rounded-2xl border p-6 lg:p-7"
          >
            <BadgeCheck aria-hidden className="text-brand-600 size-5" />
            <h3 className="font-display text-base font-semibold text-pretty">
              {advantage.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
              {advantage.description}
            </p>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
