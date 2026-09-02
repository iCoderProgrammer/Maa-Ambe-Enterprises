import { Quote } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { Stagger, StaggerItem } from "@/components/common/motion";
import { testimonials } from "@/data/testimonials";

/**
 * Customer reviews.
 *
 * Placeholder entries are badged as samples so nothing on this page can be
 * mistaken for a real customer claim. The badge disappears on its own once an
 * entry's `isPlaceholder` flag is set to false.
 */
export function Testimonials() {
  const allPlaceholder = testimonials.every((item) => item.isPlaceholder);

  return (
    <Section tone="muted">
      <SectionHeading
        eyebrow="Deliveries"
        title="Riders who made the switch"
        description={
          allPlaceholder
            ? "This section will carry real reviews and delivery photographs from our customers. The cards below are samples showing how they will appear."
            : "What customers tell us after living with a Lectrix EV scooter every day."
        }
      />

      <Stagger
        as="ul"
        className="mt-12 grid list-none gap-6 md:grid-cols-3"
        stagger={0.07}
      >
        {testimonials.map((item) => (
          <StaggerItem
            as="li"
            key={item.id}
            className="border-hairline bg-background flex flex-col rounded-2xl border p-6 sm:p-7"
          >
            {item.isPlaceholder ? (
              <Badge variant="outline" className="mb-5 self-start">
                Sample content
              </Badge>
            ) : null}
            <Quote aria-hidden className="text-brand-500 size-5" />
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-pretty">
              {item.quote}
            </blockquote>
            <footer className="border-hairline mt-6 border-t pt-5 text-sm">
              <p className="font-display font-semibold">{item.author}</p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {item.location} · {item.model}
              </p>
            </footer>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
