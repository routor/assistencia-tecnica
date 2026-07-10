"use client";

import { SelectField, TextField } from "./fields";
import { REPAIR_CATEGORY_OPTIONS } from "@/lib/domain/options";
import type { FieldErrors } from "@/lib/validation/lead";
import type { ActionValues } from "@/lib/actions/submit-lead";

/** Step 1 — contact / profile (FR-012). Real labels, autocomplete, safe value preservation. */
export function ContactStep({
  errors,
  values,
}: {
  errors: FieldErrors;
  values: ActionValues;
}) {
  const v = (k: string) => (typeof values[k] === "string" ? (values[k] as string) : undefined);
  return (
    <div className="grid gap-5">
      <TextField
        name="name"
        label="Seu nome"
        required
        autoComplete="name"
        error={errors.name}
        defaultValue={v("name")}
      />
      <TextField
        name="business_name"
        label="Nome do negócio"
        required
        autoComplete="organization"
        error={errors.business_name}
        defaultValue={v("business_name")}
      />
      <TextField
        name="whatsapp"
        label="WhatsApp"
        required
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        hint="Com DDD. Usamos apenas para contato sobre a validação."
        error={errors.whatsapp}
        defaultValue={v("whatsapp")}
      />
      <TextField
        name="email"
        label="E-mail"
        type="email"
        inputMode="email"
        autoComplete="email"
        error={errors.email}
        defaultValue={v("email")}
      />
      <SelectField
        name="segment"
        label="O que você mais conserta"
        required
        options={REPAIR_CATEGORY_OPTIONS}
        error={errors.segment}
        defaultValue={v("segment")}
      />
    </div>
  );
}
