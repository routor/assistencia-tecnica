"use client";

import { CheckboxField, CheckboxGroupField, SelectField } from "./fields";
import { PRIVACY_PATH } from "@/lib/constants";
import {
  CURRENT_PROCESS_OPTIONS,
  CUSTOMER_STATUS_FREQUENCY_OPTIONS,
  MAIN_BOTTLENECK_OPTIONS,
  MONTHLY_INTAKE_OPTIONS,
  PRICE_RANGE_OPTIONS,
  PRIORITY_FEATURE_GROUPS,
  PRIORITY_FEATURE_MAX,
  PRIORITY_FEATURE_MIN,
  TEAM_SIZE_OPTIONS,
} from "@/lib/domain/options";
import type { FieldErrors } from "@/lib/validation/lead";
import type { ActionValues } from "@/lib/actions/submit-lead";

/** Step 2 — business context + consent (FR-013, FR-015..FR-021, FR-035). */
export function ContextStep({
  errors,
  values,
}: {
  errors: FieldErrors;
  values: ActionValues;
}) {
  const v = (k: string) => (typeof values[k] === "string" ? (values[k] as string) : undefined);
  const priorityDefaults = Array.isArray(values.priority_features)
    ? (values.priority_features as string[])
    : [];

  return (
    <div className="grid gap-5">
      <SelectField
        name="team_size"
        label="Tamanho da equipe"
        required
        options={TEAM_SIZE_OPTIONS}
        error={errors.team_size}
        defaultValue={v("team_size")}
      />
      <SelectField
        name="monthly_intakes"
        label="Aparelhos que entram por mês"
        required
        options={MONTHLY_INTAKE_OPTIONS}
        error={errors.monthly_intakes}
        defaultValue={v("monthly_intakes")}
      />
      <SelectField
        name="current_process"
        label="Como você organiza hoje"
        required
        options={CURRENT_PROCESS_OPTIONS}
        error={errors.current_process}
        defaultValue={v("current_process")}
      />
      <SelectField
        name="main_bottleneck"
        label="Onde mais trava hoje"
        required
        options={MAIN_BOTTLENECK_OPTIONS}
        error={errors.main_bottleneck}
        defaultValue={v("main_bottleneck")}
      />
      <CheckboxGroupField
        name="priority_features"
        legend="O que resolveria mais a sua rotina"
        groups={PRIORITY_FEATURE_GROUPS}
        min={PRIORITY_FEATURE_MIN}
        max={PRIORITY_FEATURE_MAX}
        error={errors.priority_features}
        defaultValues={priorityDefaults}
      />
      <SelectField
        name="customer_status_frequency"
        label="Com que frequência perguntam “cadê meu conserto?”"
        required
        options={CUSTOMER_STATUS_FREQUENCY_OPTIONS}
        error={errors.customer_status_frequency}
        defaultValue={v("customer_status_frequency")}
      />
      <SelectField
        name="price_range"
        label="Quanto pagaria por mês por algo que resolvesse isso"
        required
        options={PRICE_RANGE_OPTIONS}
        error={errors.price_range}
        defaultValue={v("price_range")}
      />

      {/* Flattened: a divider (not a nested card) separates consent from the fields above. */}
      <div className="mt-2 grid gap-4 border-t border-line pt-6">
        <CheckboxField name="interview_permission" defaultChecked={false}>
          Aceito ser contatado(a) para uma conversa rápida sobre a minha rotina (opcional).
        </CheckboxField>
        <CheckboxField name="privacy_consent" error={errors.privacy_consent}>
          Autorizo o uso dos meus dados para esta pesquisa de validação e para contato sobre
          entrevista ou piloto futuro, conforme a{" "}
          <a
            href={PRIVACY_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-4"
          >
            política de privacidade
          </a>
          .
        </CheckboxField>
      </div>
    </div>
  );
}
