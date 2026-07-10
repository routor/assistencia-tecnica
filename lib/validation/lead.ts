import { z } from "zod";
import { LANDING_PATH, PRIVACY_NOTICE_VERSION, VERTICAL } from "@/lib/constants";
import {
  CURRENT_PROCESS_VALUES,
  CUSTOMER_STATUS_FREQUENCY_VALUES,
  MAIN_BOTTLENECK_VALUES,
  MONTHLY_INTAKE_VALUES,
  PRICE_RANGE_VALUES,
  PRIORITY_FEATURE_MAX,
  PRIORITY_FEATURE_MIN,
  PRIORITY_FEATURE_VALUES,
  REPAIR_CATEGORY_VALUES,
  TEAM_SIZE_VALUES,
} from "@/lib/domain/options";

/**
 * Trusted-boundary validation (SEC-016, CTR-001, FR-014..FR-027).
 *
 * Every client value is untrusted: bounded, enumerated, trimmed/normalized, and — for authority
 * fields (vertical, landing_path, consent time, notice version) — IGNORED and replaced by server
 * constants in `buildLeadRecord`. Free-text fields are stored as literal text and are never rendered
 * as HTML (escaping happens at render time by React).
 */

// ---- WhatsApp normalization (deterministic) -------------------------------------------------

export type NormalizeResult =
  | { ok: true; value: string }
  | { ok: false };

export function normalizeWhatsApp(input: string): NormalizeResult {
  const digits = (input ?? "").replace(/\D/g, "");
  if (/^\d{10,15}$/.test(digits)) return { ok: true, value: digits };
  return { ok: false };
}

// ---- Field-level schemas --------------------------------------------------------------------

const trimmed = z.string().transform((s) => s.trim());

const requiredText = (min: number, max: number, label: string) =>
  trimmed.pipe(
    z
      .string()
      .min(min, `Informe ${label} (mínimo ${min} caracteres).`)
      .max(max, `${label} deve ter no máximo ${max} caracteres.`),
  );

const optionalEmail = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? null : v),
  z
    .string()
    .transform((s) => s.trim().toLowerCase())
    .pipe(z.string().email("E-mail inválido.").max(254, "E-mail muito longo."))
    .nullable()
    .default(null),
);

const whatsappField = z
  .string({ error: "Informe o WhatsApp." })
  .transform((s) => normalizeWhatsApp(s))
  .refine((r) => r.ok, { message: "WhatsApp inválido. Use DDD e número (10 a 15 dígitos)." })
  .transform((r) => (r.ok ? r.value : ""));

// Over-long/unknown attribution is dropped to null rather than rejected (never blocks submission).
const boundedAttribution = (max: number) =>
  z.preprocess(
    (v) => {
      if (typeof v !== "string") return null;
      const t = v.trim();
      if (t === "" || t.length > max) return null;
      return t;
    },
    z.string().nullable().default(null),
  );

const priorityFeatures = z
  .array(z.enum(PRIORITY_FEATURE_VALUES))
  .min(PRIORITY_FEATURE_MIN, "Selecione ao menos uma prioridade.")
  .max(PRIORITY_FEATURE_MAX, `Selecione no máximo ${PRIORITY_FEATURE_MAX} prioridades.`)
  .refine((arr) => new Set(arr).size === arr.length, "Prioridades não podem repetir.");

// Booleans may arrive as "on"/"true"/boolean from a form.
const asBoolean = z.preprocess(
  (v) => v === true || v === "true" || v === "on" || v === "1",
  z.boolean(),
);

const consentField = z.preprocess(
  (v) => v === true || v === "true" || v === "on" || v === "1",
  z.literal(true, {
    message: "É necessário aceitar o uso dos dados para participar.",
  }),
);

// Step 1 subset — used for client-side "Continuar" validation before revealing step 2.
export const step1Schema = z.object({
  name: requiredText(2, 100, "seu nome"),
  business_name: requiredText(2, 120, "o nome do negócio"),
  whatsapp: whatsappField,
  email: optionalEmail,
  segment: z.enum(REPAIR_CATEGORY_VALUES, { message: "Selecione o segmento principal." }),
});

// ---- Full submission schema -----------------------------------------------------------------

export const leadSubmissionSchema = z
  .object({
    name: requiredText(2, 100, "seu nome"),
    business_name: requiredText(2, 120, "o nome do negócio"),
    whatsapp: whatsappField,
    email: optionalEmail,
    segment: z.enum(REPAIR_CATEGORY_VALUES, {
      message: "Selecione o segmento principal.",
    }),
    team_size: z.enum(TEAM_SIZE_VALUES, {
      message: "Selecione o tamanho da equipe.",
    }),
    monthly_intakes: z.enum(MONTHLY_INTAKE_VALUES, {
      message: "Selecione o volume mensal.",
    }),
    current_process: z.enum(CURRENT_PROCESS_VALUES, {
      message: "Selecione o processo atual.",
    }),
    main_bottleneck: z.enum(MAIN_BOTTLENECK_VALUES, {
      message: "Selecione o principal gargalo.",
    }),
    priority_features: priorityFeatures,
    customer_status_frequency: z.enum(CUSTOMER_STATUS_FREQUENCY_VALUES, {
      message: "Selecione a frequência.",
    }),
    price_range: z.enum(PRICE_RANGE_VALUES, {
      message: "Selecione uma faixa de preço.",
    }),
    interview_permission: asBoolean.default(false),
    privacy_consent: consentField,
    // Bounded, inert attribution (US3). Unknown keys are stripped by the object schema.
    utm_source: boundedAttribution(200),
    utm_medium: boundedAttribution(200),
    utm_campaign: boundedAttribution(200),
    utm_term: boundedAttribution(200),
    utm_content: boundedAttribution(200),
    gclid: boundedAttribution(256),
  })
  // Rename `whatsapp` -> `whatsapp_normalized` in the output shape.
  .transform((data) => {
    const { whatsapp, ...rest } = data;
    return { ...rest, whatsapp_normalized: whatsapp };
  });

export type LeadSubmission = z.infer<typeof leadSubmissionSchema>;

// ---- Structured answers (data-model.md `AssistanceTechnicalAnswers`) -------------------------

export type AssistanceTechnicalAnswers = {
  repair_categories: [LeadSubmission["segment"]];
  team_size: LeadSubmission["team_size"];
  monthly_intakes: LeadSubmission["monthly_intakes"];
  current_process: LeadSubmission["current_process"];
  main_bottleneck: LeadSubmission["main_bottleneck"];
  priority_features: LeadSubmission["priority_features"];
  customer_status_frequency: LeadSubmission["customer_status_frequency"];
  price_range: LeadSubmission["price_range"];
};

export function buildAnswers(data: LeadSubmission): AssistanceTechnicalAnswers {
  return {
    repair_categories: [data.segment],
    team_size: data.team_size,
    monthly_intakes: data.monthly_intakes,
    current_process: data.current_process,
    main_bottleneck: data.main_bottleneck,
    priority_features: data.priority_features,
    customer_status_frequency: data.customer_status_frequency,
    price_range: data.price_range,
  };
}

// ---- Explicit lead record (no raw spread into persistence — CTR-001) ------------------------
//
// Keys are camelCase to match the Drizzle `leads` insert shape exactly, so the Server Action can
// insert the record directly with no intermediate mapping (and no risk of spreading raw form data).

export type LeadRecord = {
  vertical: typeof VERTICAL;
  name: string;
  businessName: string;
  whatsappNormalized: string;
  email: string | null;
  city: null;
  state: null;
  segment: LeadSubmission["segment"];
  teamSize: LeadSubmission["team_size"];
  monthlyVolume: LeadSubmission["monthly_intakes"];
  currentTool: LeadSubmission["current_process"];
  mainPain: LeadSubmission["main_bottleneck"];
  desiredFeatures: LeadSubmission["priority_features"];
  willingnessToPay: LeadSubmission["price_range"];
  interviewPermission: boolean;
  privacyConsent: true;
  privacyNoticeVersion: typeof PRIVACY_NOTICE_VERSION;
  consentedAt: Date;
  answers: AssistanceTechnicalAnswers;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  gclid: string | null;
  landingPath: typeof LANDING_PATH;
};

export function buildLeadRecord(
  data: LeadSubmission,
  opts: { now?: Date } = {},
): LeadRecord {
  const now = opts.now ?? new Date();
  return {
    // SERVER-AUTHORITATIVE — never trusted from the client (FR-027, SEC-016):
    vertical: VERTICAL,
    landingPath: LANDING_PATH,
    privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
    consentedAt: now,
    privacyConsent: true,
    // Explicitly mapped from validated data:
    name: data.name,
    businessName: data.business_name,
    whatsappNormalized: data.whatsapp_normalized,
    email: data.email,
    city: null,
    state: null,
    segment: data.segment,
    teamSize: data.team_size,
    monthlyVolume: data.monthly_intakes,
    currentTool: data.current_process,
    mainPain: data.main_bottleneck,
    desiredFeatures: data.priority_features,
    willingnessToPay: data.price_range,
    interviewPermission: data.interview_permission,
    answers: buildAnswers(data),
    utmSource: data.utm_source,
    utmMedium: data.utm_medium,
    utmCampaign: data.utm_campaign,
    utmTerm: data.utm_term,
    utmContent: data.utm_content,
    gclid: data.gclid,
  };
}

/** Field error map for the UI (CTR-001 `invalid` result). Keys are field names, values are messages. */
export type FieldErrors = Partial<Record<string, string>>;

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
