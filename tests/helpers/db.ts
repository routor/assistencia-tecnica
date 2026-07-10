// Test-only database helper. Connects to the ISOLATED disposable TEST_DATABASE_URL for assertions
// and cleanup. Does not go through `lib/db.ts` (which is server-only guarded) — it is a plain
// Postgres.js client scoped to tests.
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

let client: ReturnType<typeof postgres> | null = null;

export function testDb() {
  const url = process.env.TEST_DATABASE_URL;
  if (!url) throw new Error("TEST_DATABASE_URL is required for integration tests.");
  if (!client) client = postgres(url, { max: 4, onnotice: () => {} });
  return drizzle(client, { schema });
}

export async function truncateLeads(): Promise<void> {
  const url = process.env.TEST_DATABASE_URL;
  if (!url) throw new Error("TEST_DATABASE_URL is required for integration tests.");
  const c = client ?? postgres(url, { max: 1, onnotice: () => {} });
  client = c;
  await c`TRUNCATE TABLE leads`;
}

export async function closeTestDb(): Promise<void> {
  if (client) {
    await client.end({ timeout: 5 });
    client = null;
  }
}
