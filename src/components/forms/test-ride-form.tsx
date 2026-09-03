"use client";

import * as React from "react";
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
import { getSlotsForDate, isClosedOn } from "@/lib/booking-slots";
import {
  addDays,
  HONEYPOT_FIELD,
  MAX_BOOKING_DAYS,
  showroomToday,
  testRideSchema,
  type TestRideValues,
} from "@/schemas/lead";
import type { Product } from "@/types/product";
import { brandedModel } from "@/lib/brand";

/**
 * Test ride booking form.
 *
 * Reused by `/book-test-ride` and by `TestRideModal`, so a model-specific CTA
 * anywhere on the site opens the same form with that model already chosen.
 *
 * Time slots come from the dealership's opening hours rather than a fixed list,
 * so a visitor cannot book a slot on a day the showroom is closed.
 */
export function TestRideForm({
  products,
  defaultModel,
  defaultVariant,
  defaultBranch,
  onSuccess,
}: {
  products: Product[];
  defaultModel?: string;
  defaultVariant?: string;
  /** Preselected showroom, usually resolved from `?branch=` on the server. */
  defaultBranch?: string;
  onSuccess?: () => void;
}) {
  // Falls back to the primary branch so a single-showroom site still routes the
  // lead, and so the select is never rendered with nothing chosen.
  const branchId = defaultBranch ?? getPrimaryBranch().branchId;
  const { state, submit, reset } = useLeadSubmit<TestRideValues>("test-ride");

  const today = React.useMemo(() => showroomToday(), []);
  const maxDate = React.useMemo(() => addDays(today, MAX_BOOKING_DAYS), [today]);

  const {
    control,
    register,
    handleSubmit,
    setError,
    reset: resetForm,
    formState: { errors, isSubmitting },
  } = useForm<TestRideValues>({
    resolver: zodResolver(testRideSchema),
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
      preferredDate: "",
      preferredTime: "",
      message: "",
      [HONEYPOT_FIELD]: "",
    },
  });

  // `useWatch` rather than `watch()` — it is the subscription-based API, so it
  // re-renders only this component and is safe to derive from.
  const selectedDate = useWatch({ control, name: "preferredDate" });
  const slots = selectedDate ? getSlotsForDate(selectedDate) : [];
  const closed = Boolean(selectedDate) && isClosedOn(selectedDate);
  // Open today, but every remaining slot has passed. Distinct from "closed":
  // the fix is another date, not another showroom.
  const bookedOut = Boolean(selectedDate) && !closed && slots.length === 0;

  if (state.status === "success") {
    return (
      <LeadSuccessState
        title="Your test ride is requested"
        description="We will call you shortly to confirm the slot. Bring a valid driving licence with you — the ride takes about fifteen minutes."
        reference={state.reference}
        onReset={() => {
          resetForm();
          reset();
          onSuccess?.();
        }}
        resetLabel="Book another test ride"
      />
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => submit(values, setError))}
      className="space-y-6"
    >
      {/* Bot trap — positioned off-screen rather than display:none, which some
          bots detect. Never announced, never tabbable. */}
      <div aria-hidden className="sr-only-focusable absolute">
        <label htmlFor="tr-company">Company</label>
        <input
          id="tr-company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register(HONEYPOT_FIELD)}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Your name" error={errors.name?.message} required>
          {(props) => (
            <Input {...props} {...register("name")} autoComplete="name" placeholder="Full name" />
          )}
        </Field>

        <Field
          label="Mobile number"
          hint="We will call you on this number to confirm"
          error={errors.mobile?.message}
          required
        >
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

        <Field label="Email" error={errors.email?.message} optional>
          {(props) => (
            <Input
              {...props}
              {...register("email")}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
            />
          )}
        </Field>

        <Field label="Model" error={errors.model?.message} required>
          {(props) => (
            <SelectControl
              {...props}
              {...register("model")}
              // Also set on the element so the server renders the right option
              // selected. react-hook-form applies its defaults on mount, which
              // would otherwise leave the first model showing until hydration.
              defaultValue={defaultModel ?? products[0]?.slug ?? ""}
            >
              {products.map((product) => (
                <option key={product.slug} value={product.slug}>
                  {brandedModel(product.name)}
                </option>
              ))}
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

        <Field label="PIN code" error={errors.pincode?.message} required>
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

        <Field
          label="Preferred date"
          error={errors.preferredDate?.message}
          hint={`Any day in the next ${MAX_BOOKING_DAYS} days`}
          required
        >
          {(props) => (
            <Input
              {...props}
              {...register("preferredDate")}
              type="date"
              min={today}
              max={maxDate}
            />
          )}
        </Field>

        <Field
          label="Preferred time"
          error={errors.preferredTime?.message}
          hint={
            !selectedDate
              ? "Choose a date first"
              : closed
                ? "The showroom is closed on this day — please pick another date"
                : bookedOut
                  ? "No slots left today — please pick another date"
                  : "Showroom opening hours"
          }
          required
        >
          {(props) => (
            <SelectControl
              {...props}
              {...register("preferredTime")}
              disabled={slots.length === 0}
            >
              <option value="">
                {slots.length === 0 ? "No slots available" : "Select a slot"}
              </option>
              {slots.map((slot) => (
                <option key={slot.value} value={slot.value}>
                  {slot.label}
                </option>
              ))}
            </SelectControl>
          )}
        </Field>
      </div>

      <Field label="Anything we should know?" error={errors.message?.message} optional>
        {(props) => (
          <Textarea
            {...props}
            {...register("message")}
            rows={3}
            placeholder="Let us know if you have a preferred colour, variant or any questions."
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
              Booking…
            </>
          ) : (
            "Book my test ride"
          )}
        </Button>
        <p className="text-muted-foreground text-xs">
          Free, no obligation. We use your details only to arrange the test ride.
        </p>
      </div>
    </form>
  );
}
