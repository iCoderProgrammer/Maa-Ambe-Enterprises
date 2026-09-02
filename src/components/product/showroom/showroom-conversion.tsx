"use client";

import * as React from "react";
import Link from "next/link";
import { IndianRupee, MapPin, MessageCircle, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";
import { BranchSelector } from "@/components/branches/branch-selector";
import { TestRideModal } from "@/components/forms/test-ride-modal";
import { useProduct } from "@/components/product/product-provider";
import { branchTelUrl, branchWhatsappUrl, type Branch } from "@/lib/branches";
import { DEALERSHIP_NAME, brandedModel } from "@/lib/brand";
import type { Product } from "@/types/product";

/**
 * The end of the product journey: the four things a ready customer does next.
 *
 * WHY THE BRANCH PICKER IS HERE
 *
 * Maa Ambe Enterprises trades from more than one showroom, so "call us" and
 * "message us" are ambiguous until a customer has said which counter they
 * mean. Choosing a showroom rewrites the phone and WhatsApp links and preloads
 * the test-ride form, so the enquiry reaches the branch that can actually
 * answer it. With a single branch the picker renders nothing and the links
 * point at that branch — the component does not need to know which case it is
 * in.
 *
 * The WhatsApp message names the model and the selected variant, so the
 * conversation starts with the staff already knowing what is being asked
 * about.
 */
export function ShowroomConversion({
  catalogue,
  branches,
}: {
  catalogue: Product[];
  branches: Branch[];
}) {
  const { product, variant } = useProduct();
  const [branchId, setBranchId] = React.useState(branches[0]?.branchId ?? "");

  const branch = branches.find((item) => item.branchId === branchId) ?? branches[0];
  const branded = brandedModel(product.name);

  const whatsappHref = branch
    ? branchWhatsappUrl(
        branch,
        `Hello ${DEALERSHIP_NAME}, I would like to know more about the ${branded} ${variant.name} — price, availability and a test ride.`
      )
    : null;

  return (
    <section className="bg-surface-inverse text-on-inverse section-y">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <p className="text-eyebrow text-brand-400 uppercase">Ready when you are</p>
            <h2 className="text-display-lg mt-3">Ride the {branded}</h2>
            <p className="text-on-inverse-muted mt-5 text-lead text-pretty">
              Test rides are free and take about fifteen minutes. Bring your licence and
              we will have the {product.name} charged and waiting. {DEALERSHIP_NAME} is an
              authorized Lectrix EV dealership — the sale, the registration, the service
              and the warranty all run through us.
            </p>

            <div className="mt-10">
              <BranchSelector
                branches={branches}
                selectedId={branchId}
                onSelect={setBranchId}
                label="Choose your showroom"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <TestRideModal
              products={catalogue}
              defaultModel={product.slug}
              defaultVariant={variant.id}
              defaultBranch={branch?.branchId}
            >
              <Button variant="brand" size="xl" block>
                Book a Test Ride
              </Button>
            </TestRideModal>

            <Button asChild variant="inverse" size="xl" block>
              <Link href={`/on-road-price?model=${product.slug}&variant=${variant.id}`}>
                <IndianRupee aria-hidden />
                Get On-Road Price
              </Link>
            </Button>

            <div className="grid gap-3 sm:grid-cols-2">
              {branch ? (
                <Button asChild variant="outline-inverse" size="xl">
                  <a href={branchTelUrl(branch)}>
                    <Phone aria-hidden />
                    Call the showroom
                  </a>
                </Button>
              ) : null}

              {whatsappHref ? (
                <Button asChild variant="outline-inverse" size="xl">
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                    <MessageCircle aria-hidden />
                    WhatsApp us
                  </a>
                </Button>
              ) : null}
            </div>

            <Button asChild variant="outline-inverse" size="xl" block>
              <Link href={branch ? `/showroom?branch=${branch.branchId}` : "/showroom"}>
                <MapPin aria-hidden />
                Find your nearest showroom
              </Link>
            </Button>

            {branch ? (
              <p className="text-on-inverse-muted mt-2 text-xs leading-relaxed">
                Calling and messaging reach {branch.branchName}. Switch showroom on the left to
                reach the other counter instead.
              </p>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
