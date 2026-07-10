// Synthetic lead factories — SYNTHETIC DATA ONLY (SC-007). No real participant PII may appear in
// tests, fixtures, snapshots, or reports.
import type { LeadSubmission } from "@/lib/validation/lead";

let seq = 0;

/** Deterministic-ish unique 11-digit Brazilian mobile for idempotency tests. */
export function syntheticWhatsapp(): string {
  seq += 1;
  const suffix = String(100000000 + seq).padStart(9, "0").slice(-9);
  return `1199${suffix}`.slice(0, 11);
}

/** Raw form-shaped input (strings), as it would arrive from the browser. */
export function syntheticFormInput(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    name: "Fulano de Teste",
    business_name: "Bancada Sintética",
    whatsapp: syntheticWhatsapp(),
    email: "",
    segment: "celulares_tablets",
    team_size: "2_3",
    monthly_intakes: "31_100",
    current_process: "planilha",
    main_bottleneck: "status_cliente",
    priority_features: ["ficha_aparelho", "status", "orcamento"],
    customer_status_frequency: "diariamente",
    price_range: "130_199",
    interview_permission: false,
    privacy_consent: true,
    ...overrides,
  };
}

/** Already-validated submission shape (post-schema). */
export function syntheticSubmission(overrides: Partial<LeadSubmission> = {}): LeadSubmission {
  return {
    name: "Fulano de Teste",
    business_name: "Bancada Sintética",
    whatsapp_normalized: syntheticWhatsapp(),
    email: null,
    segment: "celulares_tablets",
    team_size: "2_3",
    monthly_intakes: "31_100",
    current_process: "planilha",
    main_bottleneck: "status_cliente",
    priority_features: ["ficha_aparelho", "status", "orcamento"],
    customer_status_frequency: "diariamente",
    price_range: "130_199",
    interview_permission: false,
    privacy_consent: true,
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_term: null,
    utm_content: null,
    gclid: null,
    ...overrides,
  };
}

/** Values that must NEVER appear in analytics payloads / logs (PII-safe assertion helper). */
export const PII_NEEDLES = [
  "Fulano de Teste",
  "Bancada Sintética",
  "ana@example.com",
];
