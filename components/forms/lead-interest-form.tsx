"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ContactStep } from "./contact-step";
import { ContextStep } from "./context-step";
import { Honeypot } from "./fields";
import { submitLead, type ActionState } from "@/lib/actions/submit-lead";
import { pushAnalyticsEvent } from "@/lib/analytics/events";
import { THANK_YOU_URL } from "@/lib/constants";
import { step1Schema, toFieldErrors, type FieldErrors } from "@/lib/validation/lead";
import type { Attribution } from "@/lib/analytics/attribution";

const INITIAL: ActionState = { status: "idle" };

const ATTRIBUTION_KEYS: (keyof Attribution)[] = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
];

/**
 * Two-step, accessible interest form (FR-011, FR-022, FR-025, NFR-001/008/009, CTR-001/002).
 * Server Action is authoritative; the client adds progressive feedback, one-time funnel events,
 * double-submit protection, focus management, and a client step-1 gate.
 */
export function LeadInterestForm({ attribution = {} }: { attribution?: Attribution }) {
  const [state, formAction, isPending] = useActionState(submitLead, INITIAL);
  const [step, setStep] = useState<1 | 2>(1);
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const step1HeadingRef = useRef<HTMLHeadingElement>(null);
  const step2HeadingRef = useRef<HTMLHeadingElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const successEmittedRef = useRef(false);
  const router = useRouter();

  const serverErrors = state.status === "invalid" ? state.fieldErrors : {};
  const errors: FieldErrors = { ...serverErrors, ...clientErrors };
  const values = state.status === "invalid" || state.status === "error" ? state.values : {};

  // React to server results.
  useEffect(() => {
    if (state.status === "success" && !successEmittedRef.current) {
      successEmittedRef.current = true;
      pushAnalyticsEvent("lead_submit_success");
      router.push(THANK_YOU_URL);
      return;
    }
    if (state.status === "invalid") {
      pushAnalyticsEvent("lead_form_validation_error", { form_step: 2 });
      summaryRef.current?.focus();
    }
    if (state.status === "error") {
      pushAnalyticsEvent("lead_submit_error");
      summaryRef.current?.focus();
    }
  }, [state, router]);

  const handleFirstInteraction = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      pushAnalyticsEvent("lead_form_start");
    }
  };

  const focusFirstInvalid = () => {
    requestAnimationFrame(() => {
      const el = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
      el?.focus();
    });
  };

  const goToStep2 = () => {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const result = step1Schema.safeParse({
      name: fd.get("name"),
      business_name: fd.get("business_name"),
      whatsapp: fd.get("whatsapp"),
      email: fd.get("email"),
      segment: fd.get("segment"),
    });
    if (!result.success) {
      setClientErrors(toFieldErrors(result.error));
      pushAnalyticsEvent("lead_form_validation_error", { form_step: 1 });
      focusFirstInvalid();
      return;
    }
    setClientErrors({});
    pushAnalyticsEvent("lead_form_step_1_complete", { form_step: 1 });
    setStep(2);
    requestAnimationFrame(() => step2HeadingRef.current?.focus());
  };

  const goToStep1 = () => {
    setStep(1);
    requestAnimationFrame(() => step1HeadingRef.current?.focus());
  };

  const errorList = Object.entries(errors);
  const hasSummary =
    (state.status === "invalid" && errorList.length > 0) || state.status === "error";

  return (
    <form
      ref={formRef}
      action={formAction}
      onInput={handleFirstInteraction}
      onSubmit={() => pushAnalyticsEvent("lead_submit_attempt")}
      noValidate
      className="rounded-lg border border-line bg-surface p-6 sm:p-8"
    >
      {/* Progress (accessible text + decorative bar). */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-accent">
          Etapa {step} de 2 · cerca de 2 minutos
        </p>
        <div aria-hidden="true" className="mt-2 flex gap-1.5">
          <span className="h-1.5 flex-1 rounded-full bg-accent" />
          <span className={`h-1.5 flex-1 rounded-full ${step === 2 ? "bg-accent" : "bg-line"}`} />
        </div>
      </div>

      {/* Error summary / retry message (focusable, announced). */}
      {hasSummary ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mb-6 rounded-md border border-danger bg-danger/10 p-4 text-sm text-ink focus-visible:outline-focus"
        >
          {state.status === "error" ? (
            <p>{state.message}</p>
          ) : (
            <>
              <p className="font-semibold">Confira os campos destacados:</p>
              <ul className="mt-2 list-disc pl-5">
                {errorList.map(([field, message]) => (
                  <li key={field}>{message}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      ) : null}

      {/* Step 1 — kept in the DOM (hidden) on step 2 so its values submit with the form. */}
      <section
        aria-labelledby="step1-heading"
        hidden={step !== 1}
        aria-hidden={step !== 1 ? true : undefined}
      >
        <h3
          id="step1-heading"
          ref={step1HeadingRef}
          tabIndex={-1}
          className="text-xl font-semibold text-ink focus-visible:outline-focus"
        >
          Etapa 1 · Sobre você e o negócio
        </h3>
        <div className="mt-5">
          <ContactStep errors={errors} values={values} />
        </div>
        <div className="mt-7">
          <button
            type="button"
            onClick={goToStep2}
            className="inline-flex min-h-[52px] items-center justify-center rounded-md bg-accent px-6 py-3.5 font-semibold text-accent-ink transition-colors hover:bg-accent-hover focus-visible:outline-focus"
          >
            Continuar
          </button>
        </div>
      </section>

      {/* Step 2. */}
      <section
        aria-labelledby="step2-heading"
        hidden={step !== 2}
        aria-hidden={step !== 2 ? true : undefined}
      >
        <h3
          id="step2-heading"
          ref={step2HeadingRef}
          tabIndex={-1}
          className="text-xl font-semibold text-ink focus-visible:outline-focus"
        >
          Etapa 2 · Sua rotina de bancada
        </h3>
        <div className="mt-5">
          <ContextStep errors={errors} values={values} />
        </div>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row-reverse sm:items-center">
          <button
            type="submit"
            disabled={isPending}
            aria-disabled={isPending}
            className="inline-flex min-h-[52px] items-center justify-center rounded-md bg-accent px-6 py-3.5 font-semibold text-accent-ink transition-colors hover:bg-accent-hover focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? "Enviando seu cadastro…" : "Enviar e participar do piloto"}
          </button>
          <button
            type="button"
            onClick={goToStep1}
            disabled={isPending}
            className="inline-flex min-h-[52px] items-center justify-center rounded-md border border-line-strong px-6 py-3.5 font-semibold text-ink transition-colors hover:bg-surface-raised focus-visible:outline-focus"
          >
            Voltar
          </button>
        </div>
      </section>

      {/* Live status for AT (NFR-001). */}
      <p aria-live="polite" className="sr-only">
        {isPending ? "Enviando o cadastro, aguarde." : ""}
      </p>

      {/* Bounded, inert attribution carried through to persistence (server re-bounds it). */}
      {ATTRIBUTION_KEYS.map((key) =>
        attribution[key] ? (
          <input key={key} type="hidden" name={key} value={attribution[key]} readOnly />
        ) : null,
      )}

      <Honeypot />
    </form>
  );
}
