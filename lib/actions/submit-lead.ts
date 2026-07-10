"use server";

import { getDb } from "@/lib/db";
import { leads } from "@/db/schema";
import { HONEYPOT_FIELD } from "@/lib/domain/options";
import {
  buildLeadRecord,
  leadSubmissionSchema,
  toFieldErrors,
  type FieldErrors,
} from "@/lib/validation/lead";

/**
 * Server Action for the interest form (CTR-001, FR-022..FR-028, SEC-015, SEC-016).
 *
 * Discriminated, SAFE public result. The browser never receives database IDs, duplicate status,
 * SQL/provider errors, stack traces, or stored PII. `inserted` and `existing` are INDISTINGUISHABLE
 * (both -> "success") to avoid a duplicate-membership oracle. Success does NOT server-redirect: the
 * client emits exactly one `lead_submit_success` and then navigates, so conversion depends on the
 * action result, not a URL.
 */

export type ActionValues = Record<string, string | string[]>;

export type ActionState =
  | { status: "idle" }
  | { status: "invalid"; fieldErrors: FieldErrors; message: string; values: ActionValues }
  | { status: "error"; message: string; values: ActionValues }
  | { status: "success" };

const GENERIC_ERROR =
  "Não foi possível enviar agora. Seus dados foram mantidos, tente novamente em instantes.";

// Rebuild a safe echo of submitted values so the form can repopulate on invalid/error WITHOUT the
// honeypot and WITHOUT ever logging them.
function safeValues(formData: FormData): ActionValues {
  const values: ActionValues = {};
  for (const [key, value] of formData.entries()) {
    if (key === HONEYPOT_FIELD) continue;
    if (typeof value !== "string") continue;
    if (key === "priority_features") {
      const arr = (values[key] as string[]) ?? [];
      arr.push(value);
      values[key] = arr;
    } else {
      values[key] = value;
    }
  }
  return values;
}

export async function submitLead(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // 1) Honeypot: suspected automation -> generic safe response, no write, no success, no mechanism
  //    disclosure (FR-025, CTR-001).
  const honeypot = formData.get(HONEYPOT_FIELD);
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    // Same public shape as the DB-error path (CTR-001): generic message + preserved values (the
    // honeypot field is excluded by safeValues), no persistence, no mechanism disclosure.
    return { status: "error", message: GENERIC_ERROR, values: safeValues(formData) };
  }

  // 2) Shape the raw input (multi-value priority_features via getAll).
  const raw: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (key === HONEYPOT_FIELD) continue;
    if (key === "priority_features") continue;
    if (typeof value === "string") raw[key] = value;
  }
  raw.priority_features = formData.getAll("priority_features").filter((v) => typeof v === "string");
  raw.interview_permission = formData.get("interview_permission") !== null;
  raw.privacy_consent = formData.get("privacy_consent") !== null;

  // 3) Trusted-boundary validation (server is authoritative).
  const parsed = leadSubmissionSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "invalid",
      fieldErrors: toFieldErrors(parsed.error),
      message: "Confira os campos destacados.",
      values: safeValues(formData),
    };
  }

  // 4) Build the explicit insert record (server sets vertical/path/consent time/notice version).
  const record = buildLeadRecord(parsed.data);

  // 5) Parameterized insert-on-conflict-do-nothing. Unique (vertical, whatsapp_normalized) is the
  //    idempotency/concurrency authority. inserted -> [row]; existing -> [].
  try {
    await getDb()
      .insert(leads)
      .values(record)
      .onConflictDoNothing({ target: [leads.vertical, leads.whatsappNormalized] })
      .returning({ id: leads.id });
  } catch {
    // Never leak SQL/schema/connection/stack detail or any field value.
    return { status: "error", message: GENERIC_ERROR, values: safeValues(formData) };
  }

  // 6) inserted and existing are outwardly identical.
  return { status: "success" };
}
