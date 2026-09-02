import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import type { Faq } from "@/data/faqs";

/**
 * Accessible FAQ accordion. Radix handles keyboard interaction and the
 * expanded/collapsed announcements; the matching FAQPage schema is emitted by
 * the page so the markup and the structured data can never disagree.
 */
export function FaqSection({
  faqs,
  title = "Questions, answered",
  description = "The things customers ask us most often before going electric. If yours is not here, call the showroom — we would rather explain it properly.",
}: {
  faqs: Faq[];
  title?: string;
  description?: string;
}) {
  return (
    <Section id="faq">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div>
          <SectionHeading eyebrow="FAQ" title={title} description={description} />
          <Button asChild variant="outline" size="lg" className="mt-8">
            <Link href="/faq">Read all FAQs</Link>
          </Button>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.question} value={`faq-${index}`}>
              <AccordionTrigger className="text-left font-display text-[0.9375rem] font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed text-pretty">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
