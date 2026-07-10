import { sql } from "drizzle-orm";
import {
  boolean,
  char,
  check,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import type { AssistanceTechnicalAnswers } from "@/lib/validation/lead";

/**
 * Shared `leads` table (data-model.md). One table supports three comparable verticals through
 * common columns + a validated JSONB `answers`. Portable across standard managed PostgreSQL
 * providers — no proprietary extensions. `gen_random_uuid()` is built into PostgreSQL 13+.
 *
 * Invariants enforced at the database (belt-and-suspenders over Zod):
 * - unique (vertical, whatsapp_normalized) — the concurrency/idempotency authority (FR-023/24);
 * - privacy_consent must be true;
 * - whatsapp_normalized must be 10–15 digits;
 * - vertical is constrained to the currently-implemented value (future verticals = approved migration).
 *
 * No raw IP, user agent, password, device credential, or customer repair record is stored (SEC/LGPD).
 */
export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    vertical: text("vertical").notNull(),

    // Contact / profile (PII — never logged or sent to analytics).
    name: text("name").notNull(),
    businessName: text("business_name").notNull(),
    whatsappNormalized: text("whatsapp_normalized").notNull(),
    email: text("email"),
    city: text("city"),
    state: char("state", { length: 2 }),

    // Mirrored bounded answers (for cross-vertical analysis).
    segment: text("segment").notNull(),
    teamSize: text("team_size").notNull(),
    monthlyVolume: text("monthly_volume").notNull(),
    currentTool: text("current_tool").notNull(),
    mainPain: text("main_pain").notNull(),
    desiredFeatures: jsonb("desired_features").$type<string[]>().notNull(),
    willingnessToPay: text("willingness_to_pay").notNull(),

    // Consent / permission.
    interviewPermission: boolean("interview_permission").notNull().default(false),
    privacyConsent: boolean("privacy_consent").notNull(),
    privacyNoticeVersion: text("privacy_notice_version").notNull(),
    consentedAt: timestamp("consented_at", { withTimezone: true, mode: "date" }).notNull(),

    // Full validated structured answers.
    answers: jsonb("answers").$type<AssistanceTechnicalAnswers>().notNull(),

    // Bounded, inert attribution (no PII by design).
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    utmTerm: text("utm_term"),
    utmContent: text("utm_content"),
    gclid: text("gclid"),

    landingPath: text("landing_path").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .default(sql`now()`),
  },
  (table) => [
    uniqueIndex("leads_vertical_whatsapp_unique").on(table.vertical, table.whatsappNormalized),
    check("leads_privacy_consent_true", sql`${table.privacyConsent} = true`),
    check("leads_whatsapp_digits", sql`${table.whatsappNormalized} ~ '^[0-9]{10,15}$'`),
    check("leads_vertical_allowed", sql`${table.vertical} = 'assistencia-tecnica'`),
  ],
);

export type LeadRow = typeof leads.$inferSelect;
export type LeadInsert = typeof leads.$inferInsert;
