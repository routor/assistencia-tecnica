import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { leads } from "@/db/schema";
import { buildLeadRecord, leadSubmissionSchema } from "@/lib/validation/lead";
import { deleteLeadByContact } from "@/lib/operations/lead-deletion";
import { syntheticFormInput } from "@/tests/fixtures/lead";
import { closeTestDb, testDb, truncateLeads } from "@/tests/helpers/db";

const insert = (whatsapp: string) =>
  testDb()
    .insert(leads)
    .values(buildLeadRecord(leadSubmissionSchema.parse(syntheticFormInput({ whatsapp }))));

describe("operator lead deletion (CTR-004, FR-035, SEC-015, NFR-010)", () => {
  beforeEach(async () => {
    await truncateLeads();
  });
  afterAll(async () => {
    await closeTestDb();
  });

  it("deletes only the verified target and leaves other leads untouched", async () => {
    await insert("11955550001");
    await insert("11955550002");

    const result = await deleteLeadByContact("(11) 95555-0001", "assistencia-tecnica");
    expect(result.deleted).toBe(1);

    const remaining = await testDb().select().from(leads);
    expect(remaining).toHaveLength(1);
    expect(remaining[0]!.whatsappNormalized).toBe("11955550002");
  });

  it("normalizes the supplied contact with the same rule as submission (punctuation/spaces)", async () => {
    await insert("5511955550003"); // stored with country code
    // Same digits, human-formatted with punctuation.
    const result = await deleteLeadByContact("+55 (11) 95555-0003", "assistencia-tecnica");
    expect(result.deleted).toBe(1);
    expect(
      await testDb().select().from(leads).where(eq(leads.whatsappNormalized, "5511955550003")),
    ).toHaveLength(0);
  });

  it("is scoped to the given vertical (no cross-vertical collateral)", async () => {
    await insert("11955550004");
    const result = await deleteLeadByContact("11955550004", "outra-vertical");
    expect(result.deleted).toBe(0);
    expect(await testDb().select().from(leads)).toHaveLength(1);
  });

  it("returns a count of 0 (no error, no PII) for an unknown or invalid contact", async () => {
    expect(await deleteLeadByContact("11955550009", "assistencia-tecnica")).toEqual({ deleted: 0 });
    expect(await deleteLeadByContact("abc", "assistencia-tecnica")).toEqual({ deleted: 0 });
  });
});
