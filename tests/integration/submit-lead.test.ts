import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { eq } from "drizzle-orm";
import { leads } from "@/db/schema";
import * as dbModule from "@/lib/db";
import { submitLead, type ActionState } from "@/lib/actions/submit-lead";
import { HONEYPOT_FIELD } from "@/lib/domain/options";
import { syntheticFormInput, syntheticWhatsapp } from "@/tests/fixtures/lead";
import { closeTestDb, testDb, truncateLeads } from "@/tests/helpers/db";

const IDLE: ActionState = { status: "idle" };

function toFormData(input: Record<string, unknown>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(input)) {
    if (Array.isArray(value)) {
      for (const v of value) fd.append(key, String(v));
    } else if (typeof value === "boolean") {
      if (value) fd.set(key, "on"); // unchecked checkboxes are simply absent
    } else if (value !== undefined && value !== null) {
      fd.set(key, String(value));
    }
  }
  return fd;
}

describe("submitLead Server Action (CTR-001, FR-022..FR-028, SEC-015/16, SC-004/5)", () => {
  beforeEach(async () => {
    await truncateLeads();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  afterAll(async () => {
    await closeTestDb();
  });

  it("persists a valid lead once with server-authoritative vertical/path and mapped answers", async () => {
    const wa = syntheticWhatsapp();
    const state = await submitLead(IDLE, toFormData(syntheticFormInput({ whatsapp: wa })));
    expect(state.status).toBe("success");

    const rows = await testDb().select().from(leads);
    expect(rows).toHaveLength(1);
    const row = rows[0]!;
    expect(row.vertical).toBe("assistencia-tecnica");
    expect(row.landingPath).toBe("/assistencia-tecnica");
    expect(row.privacyConsent).toBe(true);
    expect(row.privacyNoticeVersion).toBeTruthy();
    expect(row.answers.repair_categories).toEqual(["celulares_tablets"]);
    expect(row.city).toBeNull();
  });

  it("is idempotent for a sequential duplicate (same whatsapp) — one row, identical success", async () => {
    const wa = syntheticWhatsapp();
    const first = await submitLead(IDLE, toFormData(syntheticFormInput({ whatsapp: wa })));
    const second = await submitLead(IDLE, toFormData(syntheticFormInput({ whatsapp: wa })));
    expect(first).toEqual({ status: "success" });
    expect(second).toEqual({ status: "success" }); // inserted and existing are indistinguishable
    const rows = await testDb().select().from(leads).where(eq(leads.whatsappNormalized, wa));
    expect(rows).toHaveLength(1);
  });

  it("resolves a concurrent duplicate through the unique constraint — exactly one row", async () => {
    const wa = syntheticWhatsapp();
    const [a, b] = await Promise.all([
      submitLead(IDLE, toFormData(syntheticFormInput({ whatsapp: wa }))),
      submitLead(IDLE, toFormData(syntheticFormInput({ whatsapp: wa }))),
    ]);
    expect(a.status).toBe("success");
    expect(b.status).toBe("success");
    const rows = await testDb().select().from(leads).where(eq(leads.whatsappNormalized, wa));
    expect(rows).toHaveLength(1);
  });

  it("returns invalid with field errors and persists nothing when consent is missing", async () => {
    const input = syntheticFormInput();
    delete (input as Record<string, unknown>).privacy_consent;
    const state = await submitLead(IDLE, toFormData(input));
    expect(state.status).toBe("invalid");
    if (state.status === "invalid") {
      expect(state.fieldErrors.privacy_consent).toBeTruthy();
    }
    expect(await testDb().select().from(leads)).toHaveLength(0);
  });

  it("ignores manipulated vertical/landing_path from the client (server authority)", async () => {
    const state = await submitLead(
      IDLE,
      toFormData(syntheticFormInput({ vertical: "hackeado", landing_path: "/evil" })),
    );
    expect(state.status).toBe("success");
    const row = (await testDb().select().from(leads))[0]!;
    expect(row.vertical).toBe("assistencia-tecnica");
    expect(row.landingPath).toBe("/assistencia-tecnica");
  });

  it("treats a populated honeypot as a generic error, preserves values, without persisting or naming the mechanism", async () => {
    const input = syntheticFormInput({ name: "Preservado Teste", [HONEYPOT_FIELD]: "http://spam.example" });
    const state = await submitLead(IDLE, toFormData(input));
    expect(state.status).toBe("error");
    if (state.status === "error") {
      expect(state.message.toLowerCase()).not.toContain("honeypot");
      expect(state.message.toLowerCase()).not.toContain("bot");
      // CTR-001: submitted values are preserved (non-empty), matching the DB-error path...
      expect(Object.keys(state.values).length).toBeGreaterThan(0);
      expect(state.values.name).toBe("Preservado Teste");
      // ...but the honeypot field itself is never echoed back.
      expect(state.values[HONEYPOT_FIELD]).toBeUndefined();
    }
    expect(await testDb().select().from(leads)).toHaveLength(0);
  });

  it("returns a safe generic error (no internals) when the database fails", async () => {
    vi.spyOn(dbModule, "getDb").mockImplementation(() => {
      throw new Error("connection refused at 10.0.0.1:5432 password=secret");
    });
    const state = await submitLead(IDLE, toFormData(syntheticFormInput()));
    expect(state.status).toBe("error");
    if (state.status === "error") {
      expect(state.message).not.toMatch(/secret|5432|connection refused|password/i);
    }
  });
});
