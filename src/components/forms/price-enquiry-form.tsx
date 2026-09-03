"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, SelectControl } from "@/components/forms/field";
import { BranchField } from "@/components/forms/branch-field";
import { getPrimaryBranch } from "@/data/branches";
import { LeadSuccessState } from "@/components/forms/lead-success-state";
import { useLeadSubmit } from "@/components/forms/use-lead-submit";
import {
  HONEYPOT_FIELD,
  priceEnquirySchema,
  type PriceEnquiryValues,
} from "@/schemas/lead";
import type { Product } from "@/types/product";

/**
 * On-road price enquiry.
 *
 * Deliberately does not quote a figure: on-road price depends on city RTO
 * charges, insurance and current offers, none of which are configured yet. The
 * form captures what the showroom needs to give a real answer.
 */
export function PriceEnquiryForm({
  products,
  defaultModel,
  defaultVariant,
  defaultBranch,
}: {
  products: Product[];
  defaultModel?: string;
  defaultVariant?: string;
  /** Preselected showroom, usually resolved from `?branch=` on the server. */
  defaultBranch?: string;
}) {
  const branchId = defaultBranch ?? getPrimaryBranch().branchId;
  const { state, submit, reset } = useLeadSubmit<PriceEnquiryValues>("price-enquiry");

  const {
    control,
    register,
    handleSubmit,
    setError,
    reset: resetForm,
    formState: { errors, isSubmitting },
  } = useForm<PriceEnquiryValues>({
    resolver: zodResolver(priceEnquirySchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      mobile: "",
      email: "",
      city: "",
      pincode: "",
      model: defaultModel ?? products[0]?.slug ?? "",
      variant: defaultVariant ?? "",
      branchId,
      message: "",
      [HONEYPOT_FIELD]: "",
    },
  });

  const selectedSlug = useWatch({ control, name: "model" });
  const selectedProduct = products.find((product) => product.slug === selectedSlug);
  const variants = selectedProduct?.variants ?? [];

  if (state.status === "success") {
    return (
      <LeadSuccessState
        title="Price enquiry received"
        description="We will send you the current on-road price for your city, including registration, insurance and any offers that apply."
        reference={state.reference}
        onReset={() => {
          resetForm();
          reset();
        }}
        resetLabel="Ask about another model"
      />
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => submit(values, setError))}
      className="space-y-6"
    >
      <div aria-hidden className="sr-only-focusable absolute">
        <label htmlFor="pe-company">Company</label>
        <input
          id="pe-company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register(HONEYPOT_FIELD)}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Model" error={errors.model?.message} required>
          {(props) => (
            <SelectControl
              {...props}
              {...register("model")}
              defaultValue={defaultModel ?? products[0]?.slug ?? ""}
            >
              {products.map((product) => (
                <option key={product.slug} value={product.slug}>
                  {product.name}
                </option>
              ))}
            </SelectControl>
          )}
        </Field>

        <Field
          label="Variant"
          error={errors.variant?.message}
          optional={variants.length < 2}
          hint={variants.length < 2 ? "This model has a single variant" : undefined}
        >
          {(props) => (
            <SelectControl
              {...props}
              {...register("variant")}
              disabled={variants.length < 2}
            >
              {variants.length < 2 ? (
                <option value={variants[0]?.id ?? ""}>
                  {variants[0]?.name ?? "Standard"}
                </option>
              ) : (
                <>
                  <option value="">Any variant</option>
                  {variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.name}
                    </option>
                  ))}
                </>
              )}
            </SelectControl>
          )}
        </Field>

        <BranchField
          registration={register("branchId")}
          error={errors.branchId?.message}
          defaultBranchId={branchId}
        />

        <Field label="City" error={errors.city?.message} required>
          {(props) => (
            <Input
              {...props}
              {...register("city")}
              autoComplete="address-level2"
              placeholder="Your city"
            />
          )}
        </Field>

        <Field
          label="PIN code"
          hint="On-road price varies by RTO"
          error={errors.pincode?.message}
          required
        >
          {(props) => (
            <Input
              {...props}
              {...register("pincode")}
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={6}
              placeholder="560001"
            />
          )}
        </Field>

        <Field label="Your name" error={errors.name?.message} required>
          {(props) => (
            <Input {...props} {...register("name")} autoComplete="name" placeholder="Full name" />
          )}
        </Field>

        <Field label="Mobile number" error={errors.mobile?.message} required>
          {(props) => (
            <Input
              {...props}
              {...register("mobile")}
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="98765 43210"
            />
          )}
        </Field>
      </div>

      <Field label="Anything else?" error={errors.message?.message} optional>
        {(props) => (
          <Textarea
            {...props}
            {...register("message")}
            rows={3}
            placeholder="Ask about finance, exchange or current offers."
          />
        )}
      </Field>

      {state.status === "error" ? (
        <p role="alert" className="text-destructive text-sm">
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" variant="brand" size="xl" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 aria-hidden className="animate-spin" />
              Sending…
            </>
          ) : (
            "Get on-road price"
          )}
        </Button>
        <p className="text-muted-foreground text-xs">
          No obligation. We use your details only to send you the price.
        </p>
      </div>
    </form>
  );
}
