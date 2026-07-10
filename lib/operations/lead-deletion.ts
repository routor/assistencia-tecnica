import "server-only";
import { and, eq } from "drizzle-orm";
import { leads } from "@/db/schema";
import { getDb } from "@/lib/db";
import { normalizeWhatsApp } from "@/lib/validation/lead";

/**
 * Operator-only lead deletion (CTR-004, FR-035, SEC-015). Not reachable from the public app; it is
 * called by an authorized operator via a least-privilege path after out-of-band request
 * verification. It normalizes the contact with the SAME rule as submission, targets only the
 * matching (vertical, whatsapp_normalized) row, hard-deletes it in a transaction, and returns only a
 * non-sensitive count — never the row content, and never logging any PII.
 */
export async function deleteLeadByContact(
  rawWhatsapp: string,
  vertical: string,
): Promise<{ deleted: number }> {
  const normalized = normalizeWhatsApp(rawWhatsapp);
  if (!normalized.ok) return { deleted: 0 };

  const deletedRows = await getDb().transaction(async (tx) => {
    return tx
      .delete(leads)
      .where(and(eq(leads.vertical, vertical), eq(leads.whatsappNormalized, normalized.value)))
      .returning({ id: leads.id });
  });

  return { deleted: deletedRows.length };
}
