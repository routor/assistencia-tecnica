import type { FieldErrors } from "@/lib/validation/lead";

/** Step 1 field names (FR-012). Used to route validation focus after server errors. */
export const STEP1_FIELDS = [
  "name",
  "business_name",
  "whatsapp",
  "email",
  "segment",
] as const;

/** Preferred field order for "first error" focus (step 1 then step 2). */
export const FIELD_FOCUS_ORDER = [
  ...STEP1_FIELDS,
  "team_size",
  "monthly_intakes",
  "current_process",
  "main_bottleneck",
  "priority_features",
  "customer_status_frequency",
  "price_range",
  "interview_permission",
  "privacy_consent",
] as const;

const STEP1_SET = new Set<string>(STEP1_FIELDS);

export function stepForField(field: string): 1 | 2 {
  return STEP1_SET.has(field) ? 1 : 2;
}

/** First step that contains a field error, preferring schema order. */
export function stepForFieldErrors(errors: FieldErrors): 1 | 2 {
  for (const field of FIELD_FOCUS_ORDER) {
    if (errors[field]) return stepForField(field);
  }
  for (const field of Object.keys(errors)) {
    return stepForField(field);
  }
  return 2;
}

export function firstErrorField(errors: FieldErrors): string | undefined {
  for (const field of FIELD_FOCUS_ORDER) {
    if (errors[field]) return field;
  }
  return Object.keys(errors)[0];
}

/** Stable control id for a named field (anchors, focus, aria). */
export function fieldControlId(name: string): string {
  return `lead-field-${name}`;
}
