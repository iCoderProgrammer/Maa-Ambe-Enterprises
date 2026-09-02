"use client";

import * as React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { getProductFeatures } from "@/lib/products";
import { products } from "@/data/products";

/**
 * Connected-vehicle features, filtered by the selected model.
 *
 * The feature list rendered for a model is exactly its `smartFeatures` array
 * from product data — a feature a model does not declare is never shown. Update
 * a model's array and this section follows automatically.
 */
export function SmartTechnology() {
  const [active, setActive] = React.useState(products[0].slug);

  return (
    <Section id="technology" tone="inverse">
      <SectionHeading
        eyebrow="Smart technology"
        title="A scooter that keeps in touch"
        description="Lectrix EV models pair with a mobile app so you can check charge, find your scooter and get alerted if something is wrong. Pick a model to see what it offers."
        tone="inverse"
      />

      <Tabs value={active} onValueChange={setActive} className="mt-10">
        <TabsList
          aria-label="Select a model"
          className="no-scrollbar w-full max-w-full justify-start overflow-x-auto bg-white/8 p-1"
        >
          {products.map((product) => (
            <TabsTrigger
              key={product.slug}
              value={product.slug}
              className="text-on-inverse-muted data-[state=active]:bg-brand data-[state=active]:text-brand-foreground"
            >
              {product.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {products.map((product) => {
          const features = getProductFeatures(product).smart;

          return (
            <TabsContent key={product.slug} value={product.slug} className="mt-10">
              {features.length > 0 ? (
                <ul className="grid list-none gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
                  {features.map((feature) => (
                    <li
                      key={feature.id}
                      className="bg-surface-inverse flex flex-col gap-3.5 p-7"
                    >
                      <feature.icon aria-hidden className="text-brand-400 size-5" />
                      <div>
                        <h3 className="font-display text-sm font-semibold">
                          {feature.label}
                        </h3>
                        <p className="text-on-inverse-muted mt-1.5 text-sm leading-relaxed text-pretty">
                          {feature.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-on-inverse-muted text-sm">
                  Connected features for {product.name} are being confirmed. Ask the
                  showroom what this model supports.
                </p>
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      <p className="text-on-inverse-muted/80 mt-8 text-xs">
        Connected feature availability is being confirmed with Lectrix EV and may vary
        by model, variant and app version.
      </p>
    </Section>
  );
}
