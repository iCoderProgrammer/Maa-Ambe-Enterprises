"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/forms/field";
import { LeadSuccessState } from "@/components/forms/lead-success-state";
import { useLeadSubmit } from "@/components/forms/use-lead-submit";
import { contactSchema, HONEYPOT_FIELD, type ContactValues } from "@/schemas/lead";

/**
 * General enquiry form. The shortest path to a reply from the showroom.
 *
 * `defaultMessage` lets a page seed the message box — the service page uses it
 * so a customer arriving to book a service does not start from an empty field.
 * The lead type stays "contact"; the submitted `source` records which page it
 * came from, so the showroom can still tell a service request from a general
 * question without a second API surface.
 */
export function ContactForm({
  defaultMessage = "",
  submitLabel = "Send message",
  successTitle = "Message sent",
  successDescription = "Thanks for getting in touch. Someone from the showroom will get back to you shortly.",
}: {
  defaultMessage?: string;
  submitLabel?: string;
  successTitle?: string;
  successDescription?: string;
} = {}) {
  const { state, submit, reset } = useLeadSubmit<ContactValues>("contact");

  const {
    register,
    handleSubmit,
    setError,
    reset: resetForm,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      mobile: "",
      email: "",
      city: "",
      message: defaultMessage,
      [HONEYPOT_FIELD]: "",
    },
  });

  if (state.status === "success") {
    return (
      <LeadSuccessState
        title={successTitle}
        description={successDescription}
        reference={state.reference}
        onReset={() => {
          resetForm();
          reset();
        }}
        resetLabel="Send another message"
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
        <label htmlFor="cf-company">Company</label>
        <input
          id="cf-company"
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

        <Field label="City" error={errors.city?.message} optional>
          {(props) => (
            <Input
              {...props}
              {...register("city")}
              autoComplete="address-level2"
              placeholder="Your city"
            />
          )}
        </Field>
      </div>

      <Field label="How can we help?" error={errors.message?.message} required>
        {(props) => (
          <Textarea
            {...props}
            {...register("message")}
            rows={5}
            placeholder="Tell us what you would like to know."
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
            submitLabel
          )}
        </Button>
        <p className="text-muted-foreground text-xs">
          We reply during showroom hours.
        </p>
      </div>
    </form>
  );
}
