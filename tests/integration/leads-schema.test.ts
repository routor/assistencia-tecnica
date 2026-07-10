import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { leads } from "@/db/schema";
import { buildLeadRecord, leadSubmissionSchema } from "@/lib/validation/lead";
import { syntheticFormInput } from "@/tests/fixtures/lead";
import { closeTestDb, testDb, truncateLeads } from "@/tests/helpers/db";

const recordFrom = (overrides: Record<string, unknown> = {}) =>
  buildLeadRecord(leadSubmissionSchema.parse(syntheticFormInput(overrides)));

describe("leads schema, constraints, and JSONB (FR-023/26/27, SEC-015, SC-004)", () => {
  beforeEach(async () => {
    await truncateLeads();
  });
  afterAll(async () => {
    await closeTestDb();
  });

  it("migrations applied from empty: leads table exists and starts empty", async () => {
    const rows = await testDb().select().from(leads);
    expect(rows).toEqual([]);
  });

  it("inserts a valid lead and round-trips the JSONB answers", async () => {
    const record = recordFrom();
    const [inserted] = await testDb().insert(leads).values(record).returning();
    expect(inserted?.id).toBeDefined();
    expect(inserted?.vertical).toBe("assistencia-tecnica");
    expect(inserted?.landingPath).toBe("/assistencia-tecnica");
    expect(inserted?.answers.repair_categories).toEqual(["celulares_tablets"]);
    expect(inserted?.desiredFeatures).toEqual(["ficha_aparelho", "status", "orcamento"]);
    // Not-collected columns are null.
    expect(inserted?.city).toBeNull();
    expect(inserted?.state).toBeNull();
  });

  it("enforces unique (vertical, whatsapp_normalized) — the idempotency/concurrency authority", async () => {
    const wa = "11955550000";
    await testDb().insert(leads).values(recordFrom({ whatsapp: wa }));
    await expect(
      testDb().insert(leads).values(recordFrom({ whatsapp: wa })),
    ).rejects.toMatchObject({ cause: { code: "23505" } }); // unique_violation
    const rows = await testDb().select().from(leads).where(eq(leads.whatsappNormalized, wa));
    expect(rows).toHaveLength(1);
  });

  it("rejects a row with privacy_consent = false (DB check)", async () => {
    const record = { ...recordFrom(), privacyConsent: false as unknown as true };
    await expect(testDb().insert(leads).values(record)).rejects.toMatchObject({ cause: { code: "23514" } });
  });

  it("rejects a whatsapp that is not 10–15 digits (DB check)", async () => {
    const record = { ...recordFrom(), whatsappNormalized: "abc" };
    await expect(testDb().insert(leads).values(record)).rejects.toMatchObject({ cause: { code: "23514" } });
  });

  it("rejects an unknown vertical (DB check — server authority is defence-in-depth)", async () => {
    const record = { ...recordFrom(), vertical: "outro" as "assistencia-tecnica" };
    await expect(testDb().insert(leads).values(record)).rejects.toMatchObject({ cause: { code: "23514" } });
  });
});
