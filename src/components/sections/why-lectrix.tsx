import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { Stagger, StaggerItem } from "@/components/common/motion";
import { valuePillars } from "@/data/why-lectrix";
import { DEALERSHIP_NAME } from "@/lib/brand";

/** Trust-building value pillars. Content lives in src/data/why-lectrix.ts. */
export function WhyLectrix() {
  return (
    <Section id="why-lectrix" className="scroll-mt-24">
      <SectionHeading
        eyebrow="Why Lectrix EV"
        title="Six reasons riders switch"
        description={`Electric ownership should be simpler than petrol, not more complicated. Here is what Lectrix EV builds into every scooter — and what you get when you buy one from ${DEALERSHIP_NAME}.`}
      />

      <Stagger
        as="ul"
        className="mt-12 grid list-none gap-px overflow-hidden rounded-2xl bg-hairline sm:grid-cols-2 lg:grid-cols-3"
        stagger={0.06}
      >
        {valuePillars.map((pillar) => (
          <StaggerItem
            as="li"
            key={pillar.id}
            className="bg-background flex flex-col gap-4 p-7 lg:p-8"
          >
            <span
              aria-hidden
              className="bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-400 inline-flex size-11 items-center justify-center rounded-xl"
            >
              <pillar.icon className="size-5" />
            </span>
            <div>
              <h3 className="font-display text-base font-semibold">{pillar.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed text-pretty">
                {pillar.description}
              </p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
